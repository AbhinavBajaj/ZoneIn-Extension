/**
 * Transport layer for sending events to local machine
 * Supports Native Messaging (preferred) and HTTP fallback
 */

class Transport {
  constructor() {
    this.mode = 'http'; // 'native' or 'http' - default to HTTP
    this.nativePort = null;
    this.httpEndpoint = 'http://127.0.0.1:17321/events';
  }

  /**
   * Initialize transport based on user preference
   */
  async init() {
    const result = await chrome.storage.local.get(['transportMode']);
    this.mode = result.transportMode || 'http'; // Default to HTTP
    
    if (this.mode === 'native') {
      await this.initNativeMessaging();
      
      // If native messaging failed and no explicit mode was set, fall back to HTTP
      if (!this.nativePort && !result.transportMode) {
        console.log('Native messaging unavailable, defaulting to HTTP mode');
        this.mode = 'http';
        await chrome.storage.local.set({ transportMode: 'http' });
      }
    } else {
      console.log('Using HTTP transport mode (localhost:17321)');
    }
  }

  /**
   * Initialize native messaging connection
   */
  async initNativeMessaging() {
    try {
      this.nativePort = chrome.runtime.connectNative('com.zonein.host');
      
      // Check for immediate error
      if (chrome.runtime.lastError) {
        const error = chrome.runtime.lastError.message;
        console.log('Native messaging host not found (this is OK if not installed):', error);
        this.nativePort = null;
        return;
      }
      
      this.nativePort.onDisconnect.addListener(() => {
        if (chrome.runtime.lastError) {
          console.log('Native messaging disconnected:', chrome.runtime.lastError.message);
        } else {
          console.log('Native messaging disconnected');
        }
        this.nativePort = null;
      });
    } catch (error) {
      console.log('Native messaging not available:', error);
      this.nativePort = null;
    }
  }

  /**
   * Send event via native messaging
   */
  async sendNative(event) {
    if (!this.nativePort) {
      await this.initNativeMessaging();
    }
    
    if (!this.nativePort) {
      return { success: false, error: 'Native messaging not available' };
    }

    try {
      this.nativePort.postMessage(event);
      
      // Check for errors after posting
      if (chrome.runtime.lastError) {
        const error = chrome.runtime.lastError.message;
        console.log('Native messaging error:', error);
        this.nativePort = null;
        return { success: false, error: error };
      }
      
      return { success: true };
    } catch (error) {
      console.log('Failed to send via native messaging:', error);
      this.nativePort = null;
      return { success: false, error: error.message };
    }
  }

  /**
   * Send event via HTTP
   */
  async sendHTTP(event) {
    try {
      const response = await fetch(this.httpEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      });

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      // Silently fail - transport is optional
      console.log('HTTP transport failed (expected if ZoneIn app not running):', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send event using configured transport
   */
  async sendEvent(event) {
    if (this.mode === 'native') {
      return await this.sendNative(event);
    } else {
      return await this.sendHTTP(event);
    }
  }

  /**
   * Set transport mode
   */
  async setMode(mode) {
    this.mode = mode;
    await chrome.storage.local.set({ transportMode: mode });
    
    if (mode === 'native') {
      await this.initNativeMessaging();
      
      // Check if native messaging failed
      if (!this.nativePort && chrome.runtime.lastError) {
        console.log('Native messaging not available, staying in current mode');
      }
    } else if (this.nativePort) {
      try {
        this.nativePort.disconnect();
      } catch (error) {
        // Ignore disconnect errors
      }
      this.nativePort = null;
    }
  }
}

// Make available globally for importScripts
if (typeof self !== 'undefined') {
  self.Transport = Transport;
}
// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Transport;
}
