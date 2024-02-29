// Este script se ejecuta en segundo plano
console.log('[background.js]');

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log('[background.js]');
  if (message.action === 'some_action') {
    chrome.tabs.create({ url: message.url, active: false });
    // Enviar respuesta al script de contenido
    sendResponse({ status: 'OK' });
  }
});

// Escuchar los mensajes enviados desde container detail
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log('[Container Detail GET]');
  if (message.action === 'datos_desde_container_detail') {
    // Almacenar los datos recibidos
    const datosDesdeContainerDetail = message.datos;

    // Obtener el ID de la primera pestaña
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const primeraPestanaID = tabs[0].id;

      // Enviar los datos a la primera pestaña
      chrome.tabs.sendMessage(primeraPestanaID, {
        action: 'actualizar_datos_container',
        datos: datosDesdeContainerDetail,
      });
    });
  }
});

// Escuchar los mensajes enviados desde receip detail
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log('[Receipt Detail GET]');
  if (message.action === 'datos_desde_receipt_detail') {
    // Almacenar los datos recibidos
    const datosDesdeReceiptDetail = message.datos;

    // Obtener el ID de la primera pestaña
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const primeraPestanaID = tabs[0].id;

      // Enviar los datos a la primera pestaña
      chrome.tabs.sendMessage(primeraPestanaID, {
        action: 'actualizar_datos_receipt',
        datos: datosDesdeReceiptDetail,
      });
    });
  }
});
