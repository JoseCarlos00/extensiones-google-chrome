(()=>{
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('content.js');

  (document.head || document.documentElement).appendChild(script);
})()
