/**
 * Content script: when this tab becomes visible again (e.g. user switched from Xcode to Chrome),
 * tell the background to send the current page event so it's recorded without a refresh.
 */
(function () {
  let wasHidden = false;

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
      // Only notify when we were previously hidden (app switch or tab switch back to this tab)
      if (wasHidden) {
        chrome.runtime.sendMessage({ type: 'TAB_BECAME_VISIBLE' }).catch(function () {
          // Extension context invalid or not available, ignore
        });
      }
      wasHidden = false;
    } else {
      wasHidden = true;
    }
  });
})();
