// Escucha los mensajes enviados desde el script de contenido
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
