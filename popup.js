/**
 * Popup UI Script
 */

document.addEventListener('DOMContentLoaded', async () => {
  await loadCurrentSite();
  await loadEventHistory();
  await loadMonitoringStatus();
  
  // Open options page
  document.getElementById('options-btn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
  
  // Listen for new events
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'NEW_EVENT') {
      loadCurrentSite();
      loadEventHistory();
    }
  });
});

/**
 * Load and display current site classification
 */
async function loadCurrentSite() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_CURRENT_TAB' });
    const container = document.getElementById('current-site');
    
    if (!response || !response.url) {
      container.innerHTML = '<div class="empty-state">No active tab</div>';
      return;
    }
    
    const classification = response.classification;
    const host = response.host || 'Unknown';
    
    container.innerHTML = `
      <div class="site-url">${escapeHtml(host)}</div>
      <div class="classification ${classification}">${classification}</div>
    `;
  } catch (error) {
    console.error('Failed to load current site:', error);
    document.getElementById('current-site').innerHTML = 
      '<div class="empty-state">Error loading site</div>';
  }
}

/**
 * Load and display event history
 */
async function loadEventHistory() {
  try {
    const history = await chrome.runtime.sendMessage({ type: 'GET_EVENT_HISTORY' });
    const container = document.getElementById('event-history');
    
    if (!history || history.length === 0) {
      container.innerHTML = '<div class="empty-state">No activity yet</div>';
      return;
    }
    
    container.innerHTML = history.map(event => {
      const timeAgo = formatTimeAgo(event.ts);
      return `
        <div class="event-item">
          <div class="event-info">
            <div class="event-host">${escapeHtml(event.host || 'Unknown')}</div>
            <div class="event-path">${escapeHtml(event.path || '/')}</div>
          </div>
          <div class="event-time">${timeAgo}</div>
          <div class="classification ${event.classification}" style="margin-left: 8px;">${event.classification.charAt(0).toUpperCase()}</div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Failed to load event history:', error);
    document.getElementById('event-history').innerHTML = 
      '<div class="empty-state">Error loading history</div>';
  }
}

/**
 * Load monitoring status
 */
async function loadMonitoringStatus() {
  try {
    const status = await chrome.runtime.sendMessage({ type: 'GET_MONITORING_STATUS' });
    const indicator = document.getElementById('status-indicator');
    
    if (status && status.enabled) {
      indicator.classList.remove('inactive');
    } else {
      indicator.classList.add('inactive');
    }
  } catch (error) {
    console.error('Failed to load monitoring status:', error);
  }
}

/**
 * Format time ago
 */
function formatTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
