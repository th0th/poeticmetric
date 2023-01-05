(function () {
  "use strict";

  if (window.localStorage && window.localStorage.pmIgnore) {
    return;
  }

  var apiUrl = "{{.RestApiBaseUrl}}/events";
  var event = null;
  var lastUrl;
  var lastVisibleAt = null;

  function handlePageChange() {
    var url = window.document.location.href;
    var intl = window.Intl.DateTimeFormat().resolvedOptions();
    var referrer = null;

    if (lastUrl !== undefined) {
      referrer = lastUrl;
    } else if (window.document.referrer !== "") {
      referrer = window.document.referrer;
    }

    event = {
      d: 0,
      k: "PAGE_VIEW",
      l: intl.locale,
      r: referrer,
      t: intl.timeZone,
      u: url,
    };

    lastVisibleAt = new Date();

    sendPageViewEvent();

    lastUrl = url;
  }

  function handleVisibilityChange() {
    if (document.visibilityState === "visible") {
      lastVisibleAt = new Date();
    } else {
      sendPageViewEvent();
    }
  }

  function sendPageViewEvent() {
    if (event && event.i !== undefined) {
      event.d = event.d + Math.round((new Date().getTime() - lastVisibleAt.getTime()) / 1000);

      navigator.sendBeacon(apiUrl, JSON.stringify(event));
    } else {
      var request = new XMLHttpRequest();

      request.open("POST", apiUrl, true);
      request.setRequestHeader("content-type", "application/json");
      request.responseType = "json";
      request.onload = function (e) {
        if (request.status === 202) {
          if (event !== null) {
            event.i = request.response.id;
          }
        }
      };
      request.send(JSON.stringify(event));
    }
  }

  if ((window.history || {}).pushState) {
    var windowHistoryPushState = window.history.pushState;

    window.history.pushState = function () {
      sendPageViewEvent();

      windowHistoryPushState.apply(this, arguments);

      handlePageChange();
    };
  }

  window.addEventListener("popstate", handlePageChange, { capture: true });
  window.addEventListener("visibilitychange", handleVisibilityChange, { capture: true });
  window.addEventListener("pagehide", handleVisibilityChange, { capture: true });

  handlePageChange();
})();
