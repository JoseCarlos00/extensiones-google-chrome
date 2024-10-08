console.log('[background.js]');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Print Container]');

  if (message.command === 'openNewTab') {
    // Crea una nueva pestaña con la URL específica justo al lado de la pestaña actual
    chrome.tabs.create({
      url:
        message.urlPrefix +
        'print/print.html?thead=' +
        encodeURIComponent(message.theadToPrint) +
        '&tbody=' +
        encodeURIComponent(message.tbodyToPrint),
      index: sender.tab.index + 1, // Abre la nueva pestaña al lado de la pestaña actual
      active: true, // Haz que la nueva pestaña sea la activa
    });
  }
});
