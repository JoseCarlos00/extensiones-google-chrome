// Contenido de background.js
// Escucha los mensajes enviados desde el script de contenido
// Este script se ejecuta en segundo plano
console.log('[background.js] 1');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[background.js] 2');
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

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log('[background.js] 3');
  if (message.action === 'some_action') {
    chrome.tabs.create({ url: message.url, active: false });
    // Enviar respuesta al script de contenido
    sendResponse({ status: 'OK' });
  }
});

// Escuchar los mensajes enviados desde la segunda pestaña
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log('[background.js] 4');
  if (message.action === 'datos_desde_segunda_pestaña') {
    // Almacenar los datos recibidos
    const datosDesdeSegundaPestaña = message.datos;

    // Obtener el ID de la primera pestaña
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const primeraPestanaID = tabs[0].id;

      // Enviar los datos a la primera pestaña
      chrome.tabs.sendMessage(primeraPestanaID, {
        action: 'actualizar_datos',
        datos: datosDesdeSegundaPestaña,
      });
    });
  }
});
