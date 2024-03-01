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

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log('[Some Action]');
  if (message.action === 'some_action') {
    chrome.tabs.create({ url: message.url, active: false });
    // Enviar respuesta al script de contenido
    sendResponse({ status: 'OK' });
  }
});

// Escuchar los mensajes enviados desde la segunda pestaña
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log('[Container detail GET]');
  if (message.action === 'container_detail') {
    // Almacenar los datos recibidos
    const datosDesdeContainerDetail = message.datos;

    // Obtener el ID de la primera pestaña
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // Verificar si hay pestañas activas
      if (tabs.length > 0) {
        const primeraPestanaID = tabs[0].id;

        // Enviar los datos a la primera pestaña
        chrome.tabs.sendMessage(primeraPestanaID, {
          action: 'actualizar_datos',
          datos: datosDesdeContainerDetail,
        });
      } else {
        console.error('No se encontraron pestañas activas.');
      }
    });
  }
});
