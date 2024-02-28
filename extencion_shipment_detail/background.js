// Contenido de background.js
console.log('[background.js] 1');

// Este script se ejecuta en segundo plano

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log('[background.js] 2');
  // Aquí puedes manejar los mensajes que recibes de otras partes de la extensión
  if (message.action === 'some_action') {
    // Realiza alguna acción en respuesta al mensaje recibido
    // Por ejemplo, abre una nueva pestaña
    chrome.tabs.create({ url: message.url, active: false });
  }
});

// Escuchar los mensajes enviados desde la segunda pestaña
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log('[background.js] 3');
  if (message.action === 'datos_desde_segunda_pestaña') {
    // Almacenar los datos recibidos
    var datosDesdeSegundaPestaña = message.datos;

    // Obtener el ID de la primera pestaña
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var primeraPestañaID = tabs[0].id;

      // Enviar los datos a la primera pestaña
      chrome.tabs.sendMessage(primeraPestañaID, {
        action: 'actualizar_datos',
        datos: datosDesdeSegundaPestaña,
      });
    });
  }
});
