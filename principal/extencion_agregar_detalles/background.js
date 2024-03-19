// Este script se ejecuta en segundo plano
console.log('[background.js]');

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'some_action') {
    console.log('[Some Action]');
    chrome.tabs.create({ url: message.url, active: false });
    // Enviar respuesta al script de contenido
    sendResponse({ status: 'OK' });
    //
  } else if (message.action === 'datos_desde_shipment_detail') {
    console.log('[shipment_detail GET]');
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
    //
  } else if (message.action === 'datos_desde_inventory_detail') {
    console.log('[Inventory Detail GET]');
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
    //
  } else if (message.action === 'datos_desde_receipt_container_detail') {
    console.log('[Receipt Container Detail GET]');
    const datosDesdeContainerDetail = message.datos;

    // Obtener las pestañas activas
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // Verificar si hay pestañas activas
      if (tabs.length > 0) {
        const primeraPestanaID = tabs[0].id;

        // Enviar los datos a la primera pestaña
        chrome.tabs.sendMessage(primeraPestanaID, {
          action: 'actualizar_datos_de_receipt_container_detail',
          datos: datosDesdeContainerDetail,
        });
      } else {
        console.error('No se encontraron pestañas activas.');
      }
    });
    //
  } else if (message.action === 'datos_desde_receipt_detail') {
    console.log('[Receipt Detail GET]');
    const datosDesdeReceiptDetail = message.datos;

    // Obtener las pestañas activas
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // Verificar si hay pestañas activas
      if (tabs.length > 0) {
        const primeraPestanaID = tabs[0].id;

        // Enviar los datos a la primera pestaña
        chrome.tabs.sendMessage(primeraPestanaID, {
          action: 'actualizar_datos_de_receipt_detail',
          datos: datosDesdeReceiptDetail,
        });
      } else {
        console.error('No se encontraron pestañas activas.');
      }
    });
    //
  } else if (message.action === 'datos_desde_shipping_container_detail') {
    console.log('[Shipping Container detail GET]');
    const datosDesdeContainerDetail = message.datos;

    // Obtener el ID de la primera pestaña
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // Verificar si hay pestañas activas
      if (tabs.length > 0) {
        const primeraPestanaID = tabs[0].id;

        // Enviar los datos a la primera pestaña
        chrome.tabs.sendMessage(primeraPestanaID, {
          action: 'actualizar_datos_shipping_container',
          datos: datosDesdeContainerDetail,
        });
      } else {
        console.error('No se encontraron pestañas activas.');
      }
    });
    //
  } else if (message.action === 'datos_desde_wave_detail') {
    console.log('[Shipping Container detail GET]');
    const datosDesdeWaveDetail = message.datos;

    // Obtener el ID de la primera pestaña
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // Verificar si hay pestañas activas
      if (tabs.length > 0) {
        const primeraPestanaID = tabs[0].id;

        // Enviar los datos a la primera pestaña
        chrome.tabs.sendMessage(primeraPestanaID, {
          action: 'actualizar_datos_de_wave_detail',
          datos: datosDesdeWaveDetail,
        });
      } else {
        console.error('No se encontraron pestañas activas.');
      }
    });
  } else if (message.action === 'datos_desde_workinstruction_detail') {
    console.log('[workinstruction Detail GET]');
    const datosDesdeWorkinstructionDetail = message.datos;

    // Obtener el ID de la primera pestaña
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // Verificar si hay pestañas activas
      if (tabs.length > 0) {
        const primeraPestanaID = tabs[0].id;

        // Enviar los datos a la primera pestaña
        chrome.tabs.sendMessage(primeraPestanaID, {
          action: 'actualizar_datos_de_workinstruction_detail',
          datos: datosDesdeWorkinstructionDetail,
        });
      } else {
        console.error('No se encontraron pestañas activas.');
      }
    });
  } else if (message.action === 'datos_desde_load_detail') {
    console.log('[load Detail GET]');
    const datosDesdeloadDetail = message.datos;

    // Obtener el ID de la primera pestaña
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // Verificar si hay pestañas activas
      if (tabs.length > 0) {
        const primeraPestanaID = tabs[0].id;

        // Enviar los datos a la primera pestaña
        chrome.tabs.sendMessage(primeraPestanaID, {
          action: 'actualizar_datos_de_load_detail',
          datos: datosDesdeloadDetail,
        });
      } else {
        console.error('No se encontraron pestañas activas.');
      }
    });
  } else if (message.action === 'datos_no_encontrados_desde_detail') {
    console.log('[datos no encontrados GET]');

    const datos = {
      header: message.data,
      message: 'Datos no encontrados',
    };

    // Obtener el ID de la primera pestaña
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // Verificar si hay pestañas activas

      if (tabs.length > 0) {
        const primeraPestanaID = tabs[0].id;

        // Enviar los datos a la primera pestaña
        chrome.tabs.sendMessage(primeraPestanaID, {
          action: 'datos_no_encontrados',
          datos: datos,
        });
      } else {
        console.error('No se encontraron pestañas activas.');
      }
    });
  }
  //
  // END
});

/*


else if (message.action === 'datos_desde_workinstruction_detail') {
    console.log('[workinstruction Detail GET]');
    const datosDesdeWorkinstructionDetail = message.datos;

    // Obtener el ID de la primera pestaña
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // Verificar si hay pestañas activas
      if (tabs.length > 0) {
        const primeraPestanaID = tabs[0].id;

        // Enviar los datos a la primera pestaña
        chrome.tabs.sendMessage(primeraPestanaID, {
          action: 'actualizar_datos_de_load_detail',
          datos: datosDesdeWorkinstructionDetail,
        });
      } else {
        console.error('No se encontraron pestañas activas.');
      }
    });
  }


*/
