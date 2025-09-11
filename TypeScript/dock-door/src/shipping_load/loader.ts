(function () {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL('shipping_load/ShippingLoad.js');

  (document.head || document.documentElement).appendChild(script);
})()
