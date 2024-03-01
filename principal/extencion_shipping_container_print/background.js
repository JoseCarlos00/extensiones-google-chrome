// Este script se ejecuta en segundo plano
console.log('[background.js] ');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Print Container');
  if (message.command === 'openNewTab') {
    // Crea una nueva pestaña con la URL específica
    chrome.tabs.create({
      url:
        'print/print.html?thead=' +
        encodeURIComponent(message.theadToPrint) +
        '&tbody=' +
        encodeURIComponent(message.tbodyToPrint),
    });
  }
});

