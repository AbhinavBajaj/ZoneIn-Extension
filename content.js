/**
 * Content script: when this tab becomes visible again (e.g. user switched from Xcode to Chrome),
 * tell the background to send the current page event so it's recorded without a refresh.
 */
(function () {
  let wasHidden = false;
  let contextInvalidated = false;

  function safeSendTabVisible() {
    if (contextInvalidated) return;
    try {
      chrome.runtime.sendMessage({ type: 'TAB_BECAME_VISIBLE' }, function () {
        try {
          if (chrome.runtime && chrome.runtime.lastError) contextInvalidated = true;
        } catch (_) {
          contextInvalidated = true;
        }
      });
    } catch (e) {
      contextInvalidated = true;
    }
  }

  document.addEventListener('visibilitychange', function () {
    try {
      if (document.visibilityState === 'visible') {
        if (wasHidden) {
          wasHidden = false;
          setTimeout(safeSendTabVisible, 0);
        } else {
          wasHidden = false;
        }
      } else {
        wasHidden = true;
      }
    } catch (e) {
      wasHidden = false;
    }
  });
})();
