/**
 * Background Service Worker for ZoneIn Extension
 * Monitors tab URL changes and active tab changes
 */

importScripts('rules-engine.js');
importScripts('transport.js');

let rulesEngine = null;
let transport = null;
let monitoringEnabled = true;
let eventHistory = [];

// Initialize on startup
(async () => {
  await loadRules();
  transport = new Transport();
  await transport.init();
  
  const result = await chrome.storage.local.get(['monitoringEnabled']);
  monitoringEnabled = result.monitoringEnabled !== false; // Default to true
  
  // Load event history
  const historyResult = await chrome.storage.local.get(['eventHistory']);
  eventHistory = historyResult.eventHistory || [];
  
  // Listen for tab updates
  chrome.tabs.onUpdated.addListener(handleTabUpdate);
  chrome.tabs.onActivated.addListener(handleTabActivated);
  
  // Listen for storage changes (rules updates, monitoring toggle)
  chrome.storage.onChanged.addListener(handleStorageChange);
})();

/**
 * Load rules from storage or default
 */
async function loadRules() {
  const result = await chrome.storage.local.get(['rules', 'defaultClassification']);
  
  if (result.rules && result.rules.length > 0) {
    // Use user-edited rules
    rulesEngine = new RulesEngine(result.rules);
    rulesEngine.defaultClassification = result.defaultClassification || 'neutral';
  } else {
    // Load default rules
    rulesEngine = await RulesEngine.loadRules();
    // Save default rules to storage
    await chrome.storage.local.set({
      rules: rulesEngine.getRules(),
      defaultClassification: rulesEngine.defaultClassification
    });
  }
}

/**
 * Handle tab URL updates
 */
async function handleTabUpdate(tabId, changeInfo, tab) {
  if (!monitoringEnabled) return;
  if (changeInfo.status !== 'complete' || !tab.url) return;
  
  await classifyAndEmit(tab.url, tabId);
}

/**
 * Handle active tab changes
 */
async function handleTabActivated(activeInfo) {
  if (!monitoringEnabled) return;
  
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url) {
      await classifyAndEmit(tab.url, activeInfo.tabId);
    }
  } catch (error) {
    console.error('Failed to get active tab:', error);
  }
}

/**
 * Classify URL and emit event
 */
async function classifyAndEmit(url, tabId) {
  if (!rulesEngine) {
    await loadRules();
  }
  
  const result = rulesEngine.classify(url);
  const parsed = rulesEngine.parseURL(url);
  
  const event = {
    ts: Date.now(),
    url: url,
    host: parsed ? parsed.host : null,
    path: parsed ? parsed.path : null,
    classification: result.classification,
    ruleId: result.ruleId,
    tabId: tabId
  };
  
  // Add to history (keep last 100)
  eventHistory.unshift(event);
  if (eventHistory.length > 100) {
    eventHistory = eventHistory.slice(0, 100);
  }
  await chrome.storage.local.set({ eventHistory: eventHistory });
  
  // Send via transport (non-blocking)
  if (transport) {
    transport.sendEvent(event).catch(err => {
      console.log('Transport failed (non-critical):', err);
    });
  }
  
  // Broadcast to popup if open
  try {
    chrome.runtime.sendMessage({
      type: 'NEW_EVENT',
      event: event
    }).catch(() => {
      // Popup might not be open, ignore
    });
  } catch (error) {
    // Ignore
  }
}

/**
 * Handle storage changes
 */
async function handleStorageChange(changes, areaName) {
  if (areaName !== 'local') return;
  
  if (changes.rules || changes.defaultClassification) {
    await loadRules();
  }
  
  if (changes.monitoringEnabled !== undefined) {
    monitoringEnabled = changes.monitoringEnabled.newValue !== false;
  }
  
  if (changes.transportMode) {
    if (transport) {
      await transport.setMode(changes.transportMode.newValue);
    }
  }
}

/**
 * Handle messages from popup/options
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_CURRENT_TAB') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0] && tabs[0].url) {
        const result = rulesEngine.classify(tabs[0].url);
        const parsed = rulesEngine.parseURL(tabs[0].url);
        sendResponse({
          url: tabs[0].url,
          host: parsed ? parsed.host : null,
          path: parsed ? parsed.path : null,
          classification: result.classification,
          ruleId: result.ruleId
        });
      } else {
        sendResponse(null);
      }
    });
    return true; // Async response
  }
  
  if (message.type === 'GET_EVENT_HISTORY') {
    sendResponse(eventHistory.slice(0, 10)); // Last 10 events
    return false;
  }
  
  if (message.type === 'GET_MONITORING_STATUS') {
    sendResponse({ enabled: monitoringEnabled });
    return false;
  }
});
