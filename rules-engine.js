/**
 * Rules Engine for URL Classification
 * Classifies URLs as productive, neutral, or distracting based on static rules
 */

class RulesEngine {
  constructor(rules = []) {
    this.rules = rules;
    this.defaultClassification = 'neutral';
  }

  /**
   * Load rules from JSON
   */
  static async loadRules() {
    try {
      const response = await fetch(chrome.runtime.getURL('rules.json'));
      const data = await response.json();
      const engine = new RulesEngine(data.rules);
      engine.defaultClassification = data.defaultClassification || 'neutral';
      return engine;
    } catch (error) {
      console.error('Failed to load rules:', error);
      return new RulesEngine([]);
    }
  }

  /**
   * Load rules from storage (user-edited rules)
   */
  static async loadRulesFromStorage() {
    try {
      const result = await chrome.storage.local.get(['rules', 'defaultClassification']);
      const rules = result.rules || [];
      const engine = new RulesEngine(rules);
      engine.defaultClassification = result.defaultClassification || 'neutral';
      return engine;
    } catch (error) {
      console.error('Failed to load rules from storage:', error);
      return new RulesEngine([]);
    }
  }

  /**
   * Parse URL into components
   */
  parseURL(url) {
    try {
      const urlObj = new URL(url);
      return {
        host: urlObj.hostname,
        path: urlObj.pathname,
        full: url
      };
    } catch (error) {
      console.error('Failed to parse URL:', url, error);
      return null;
    }
  }

  /**
   * Classify a URL
   * Returns: { classification, ruleId }
   */
  classify(url) {
    const parsed = this.parseURL(url);
    if (!parsed) {
      return {
        classification: this.defaultClassification,
        ruleId: null
      };
    }

    // First, check path-contains rules (more specific)
    for (const rule of this.rules) {
      if (rule.type === 'path-contains' && 
          rule.domain === parsed.host && 
          parsed.path.includes(rule.pathPattern)) {
        return {
          classification: rule.classification,
          ruleId: rule.id
        };
      }
    }

    // Then check domain rules
    for (const rule of this.rules) {
      if (rule.type === 'domain' && rule.domain === parsed.host) {
        return {
          classification: rule.classification,
          ruleId: rule.id
        };
      }
    }

    // Default classification
    return {
      classification: this.defaultClassification,
      ruleId: null
    };
  }

  /**
   * Add a new rule
   */
  addRule(rule) {
    if (!rule.id) {
      rule.id = `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    this.rules.push(rule);
    return rule.id;
  }

  /**
   * Update a rule by ID
   */
  updateRule(ruleId, updates) {
    const index = this.rules.findIndex(r => r.id === ruleId);
    if (index !== -1) {
      this.rules[index] = { ...this.rules[index], ...updates };
      return true;
    }
    return false;
  }

  /**
   * Delete a rule by ID
   */
  deleteRule(ruleId) {
    const index = this.rules.findIndex(r => r.id === ruleId);
    if (index !== -1) {
      this.rules.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Get all rules
   */
  getRules() {
    return [...this.rules];
  }

  /**
   * Export rules as JSON
   */
  exportRules() {
    return JSON.stringify({
      rules: this.rules,
      defaultClassification: this.defaultClassification
    }, null, 2);
  }

  /**
   * Import rules from JSON
   */
  importRules(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      this.rules = data.rules || [];
      this.defaultClassification = data.defaultClassification || 'neutral';
      return true;
    } catch (error) {
      console.error('Failed to import rules:', error);
      return false;
    }
  }
}

// Make available globally for importScripts
if (typeof self !== 'undefined') {
  self.RulesEngine = RulesEngine;
}
// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RulesEngine;
}
