// Contenido de background.js
// Este script se ejecuta en segundo plano
console.log('[background.js]');

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'some_action') {
    console.log('[Some Action]');
    chrome.tabs.create({ url: message.url, active: false });
    // Enviar respuesta al script de contenido
    sendResponse({ status: 'OK' });
  } else if (message.action === 'datos_desde_shipment_detail') {
    console.log('[shipment_detail]');
    // Almacenar los datos recibidos
    const datosDesdeShipmentDetail = message.datos;

    // Obtener el ID de la primera pestaña
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // Verificar si hay pestañas activas
      if (tabs.length > 0) {
        const primeraPestanaID = tabs[0].id;

        chrome.tabs.sendMessage(primeraPestanaID, {
          action: 'actualizar_datos_de_shipment_detail',
          datos: datosDesdeShipmentDetail,
        });
      } else {
        console.error('No se encontraron pestañas activas.');
      }
    });
  } else if (message.action === 'datos_desde_inventory_detail') {
    console.log('[Container Detail GET]');
    // Almacenar los datos recibidos
    const datosDesdeInventoryDetail = message.datos;

    // Obtener las pestañas activas
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // Verificar si hay pestañas activas
      if (tabs.length > 0) {
        const primeraPestanaID = tabs[0].id;

        // Enviar los datos a la primera pestaña
        chrome.tabs.sendMessage(primeraPestanaID, {
          action: 'actualizar_datos_de_inventory_detail',
          datos: datosDesdeInventoryDetail,
        });
      } else {
        console.error('No se encontraron pestañas activas.');
      }
    });
  }
});

/*

 else if (message.action === 'datos_desde_inventory_detail') {
    console.log('[Container Detail GET]');
    // Almacenar los datos recibidos
    const datosDesdeContainerDetail = message.datos;

    // Obtener las pestañas activas
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // Verificar si hay pestañas activas
      if (tabs.length > 0) {
        const primeraPestanaID = tabs[0].id;

        // Enviar los datos a la primera pestaña
        chrome.tabs.sendMessage(primeraPestanaID, {
          action: 'actualizar_datos_container',
          datos: datosDesdeContainerDetail,
        });
      } else {
        console.error('No se encontraron pestañas activas.');
      }
    });
  }

*/
