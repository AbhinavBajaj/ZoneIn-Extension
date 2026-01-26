/**
 * Options Page Script
 */

let rulesEngine = null;
let editingRuleId = null;

document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  await loadRules();
  
  // Monitoring toggle
  document.getElementById('monitoring-enabled').addEventListener('change', async (e) => {
    await chrome.storage.local.set({ monitoringEnabled: e.target.checked });
  });
  
  // Transport mode
  document.querySelectorAll('input[name="transport"]').forEach(radio => {
    radio.addEventListener('change', async (e) => {
      await chrome.storage.local.set({ transportMode: e.target.value });
      // Notify background script
      chrome.runtime.sendMessage({
        type: 'TRANSPORT_MODE_CHANGED',
        mode: e.target.value
      });
    });
  });
  
  // Rule type change
  document.getElementById('rule-type').addEventListener('change', (e) => {
    const pathGroup = document.getElementById('path-pattern-group');
    pathGroup.style.display = e.target.value === 'path-contains' ? 'block' : 'none';
  });
  
  // Add rule button
  document.getElementById('add-rule-btn').addEventListener('click', () => {
    openRuleEditor();
  });
  
  // Import rules
  document.getElementById('import-rules-btn').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const text = await file.text();
        if (rulesEngine.importRules(text)) {
          await saveRules();
          await loadRules();
          alert('Rules imported successfully!');
        } else {
          alert('Failed to import rules. Please check the JSON format.');
        }
      }
    };
    input.click();
  });
  
  // Export rules
  document.getElementById('export-rules-btn').addEventListener('click', () => {
    const json = rulesEngine.exportRules();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zonein-rules.json';
    a.click();
    URL.revokeObjectURL(url);
  });
  
  // Reset rules
  document.getElementById('reset-rules-btn').addEventListener('click', async () => {
    if (confirm('Are you sure you want to reset to default rules? This will remove all custom rules.')) {
      await chrome.storage.local.remove(['rules', 'defaultClassification']);
      await loadRules();
      alert('Rules reset to defaults!');
    }
  });
  
  // Modal controls
  document.getElementById('modal-close').addEventListener('click', closeRuleEditor);
  document.getElementById('cancel-rule-btn').addEventListener('click', closeRuleEditor);
  document.getElementById('save-rule-btn').addEventListener('click', saveRule);
});

/**
 * Load settings
 */
async function loadSettings() {
  const result = await chrome.storage.local.get(['monitoringEnabled', 'transportMode']);
  
  document.getElementById('monitoring-enabled').checked = result.monitoringEnabled !== false;
  
  const transportMode = result.transportMode || 'native';
  document.getElementById(`transport-${transportMode}`).checked = true;
}

/**
 * Load rules
 */
async function loadRules() {
  const result = await chrome.storage.local.get(['rules', 'defaultClassification']);
  
  if (result.rules && result.rules.length > 0) {
    rulesEngine = new RulesEngine(result.rules);
    rulesEngine.defaultClassification = result.defaultClassification || 'neutral';
  } else {
    // Load default rules
    const response = await fetch(chrome.runtime.getURL('rules.json'));
    const data = await response.json();
    rulesEngine = new RulesEngine(data.rules);
    rulesEngine.defaultClassification = data.defaultClassification || 'neutral';
    await saveRules();
  }
  
  renderRules();
}

/**
 * Save rules to storage
 */
async function saveRules() {
  await chrome.storage.local.set({
    rules: rulesEngine.getRules(),
    defaultClassification: rulesEngine.defaultClassification
  });
}

/**
 * Render rules list
 */
function renderRules() {
  const container = document.getElementById('rules-list');
  const rules = rulesEngine.getRules();
  
  if (rules.length === 0) {
    container.innerHTML = '<div class="empty-state">No rules defined</div>';
    return;
  }
  
  container.innerHTML = rules.map(rule => {
    const typeLabel = rule.type === 'path-contains' ? 'Path' : 'Domain';
    const ruleId = escapeHtml(rule.id);
    return `
      <div class="rule-item" data-rule-id="${ruleId}">
        <div class="rule-item-info">
          <span class="rule-item-type">${typeLabel}</span>
          <div class="rule-item-domain">${escapeHtml(rule.domain)}</div>
          ${rule.pathPattern ? `<div class="rule-item-path">Path: ${escapeHtml(rule.pathPattern)}</div>` : ''}
        </div>
        <div>
          <span class="rule-item-classification ${rule.classification}">${rule.classification}</span>
          <div class="rule-item-actions">
            <button class="btn-icon edit-rule-btn" data-rule-id="${ruleId}" title="Edit">✏️</button>
            <button class="btn-icon delete-rule-btn" data-rule-id="${ruleId}" title="Delete">🗑️</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  // Attach event listeners to edit buttons
  container.querySelectorAll('.edit-rule-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const ruleId = e.target.closest('.edit-rule-btn').getAttribute('data-rule-id');
      editRule(ruleId);
    });
  });
  
  // Attach event listeners to delete buttons
  container.querySelectorAll('.delete-rule-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const ruleId = e.target.closest('.delete-rule-btn').getAttribute('data-rule-id');
      await deleteRule(ruleId);
    });
  });
}

/**
 * Open rule editor
 */
function openRuleEditor(ruleId = null) {
  editingRuleId = ruleId;
  const modal = document.getElementById('rule-editor-modal');
  const title = document.getElementById('modal-title');
  
  if (ruleId) {
    title.textContent = 'Edit Rule';
    const rule = rulesEngine.getRules().find(r => r.id === ruleId);
    if (rule) {
      document.getElementById('rule-type').value = rule.type;
      document.getElementById('rule-domain').value = rule.domain;
      document.getElementById('rule-path-pattern').value = rule.pathPattern || '';
      document.getElementById('rule-classification').value = rule.classification;
      document.getElementById('path-pattern-group').style.display = 
        rule.type === 'path-contains' ? 'block' : 'none';
    }
  } else {
    title.textContent = 'Add Rule';
    document.getElementById('rule-type').value = 'domain';
    document.getElementById('rule-domain').value = '';
    document.getElementById('rule-path-pattern').value = '';
    document.getElementById('rule-classification').value = 'neutral';
    document.getElementById('path-pattern-group').style.display = 'none';
  }
  
  modal.classList.add('show');
}

/**
 * Close rule editor
 */
function closeRuleEditor() {
  document.getElementById('rule-editor-modal').classList.remove('show');
  editingRuleId = null;
}

/**
 * Save rule
 */
async function saveRule() {
  const type = document.getElementById('rule-type').value;
  const domain = document.getElementById('rule-domain').value.trim();
  const pathPattern = document.getElementById('rule-path-pattern').value.trim();
  const classification = document.getElementById('rule-classification').value;
  
  if (!domain) {
    alert('Please enter a domain');
    return;
  }
  
  if (type === 'path-contains' && !pathPattern) {
    alert('Please enter a path pattern');
    return;
  }
  
  const rule = {
    type: type,
    domain: domain,
    classification: classification
  };
  
  if (type === 'path-contains') {
    rule.pathPattern = pathPattern;
  }
  
  if (editingRuleId) {
    rulesEngine.updateRule(editingRuleId, rule);
  } else {
    rulesEngine.addRule(rule);
  }
  
  await saveRules();
  await loadRules();
  closeRuleEditor();
}

/**
 * Edit rule
 */
function editRule(ruleId) {
  openRuleEditor(ruleId);
}

/**
 * Delete rule
 */
async function deleteRule(ruleId) {
  if (confirm('Are you sure you want to delete this rule?')) {
    rulesEngine.deleteRule(ruleId);
    await saveRules();
    await loadRules();
  }
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
