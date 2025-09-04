// Este script se ejecuta en segundo plano
console.log("[background.js]");

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	const sendMessageToRender = (datos, action) => {
		console.log("[sendMessageToRender]", action, datos);

		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			if (tabs.length > 0) {
				chrome.tabs.sendMessage(tabs[0].id, {
					action,
					datos,
				});
			} else {
				console.error("No se encontraron pestañas activas.");
			}
		});
	};

	// Tabla de despacho
	const actionHandlers = {
		some_action: () => {
			console.log("[Some Action]");
			chrome.tabs.create({ url: message.url, index: sender.tab.index + 1, active: false });

			// Enviar respuesta al script de contenido
			sendResponse({ status: "OK" });
		},
		datos_no_encontrados_desde_detail: () => {
			console.log("[No Data Found GET]");

			const datos = {
				header: message.data,
				message: "Datos no encontrados",
			};

			sendMessageToRender(datos, "datos_no_encontrados");
		},
		datos_desde_shipment_detail: () => {
			console.log("[shipment_detail GET]");
			sendMessageToRender(message.datos, "actualizar_datos_de_shipment_detail");
		},
		datos_desde_inventory_detail: () => {
			console.log("[Inventory Detail GET]");
			sendMessageToRender(message.datos, "actualizar_datos_de_inventory_detail");
		},
		datos_desde_receipt_container_detail: () => {
			console.log("[Receipt Container Detail GET]");
			sendMessageToRender(message.datos, "actualizar_datos_de_receipt_container_detail");
		},
		datos_desde_receipt_detail: () => {
			console.log("[Receipt Detail GET]");
			sendMessageToRender(message.datos, "actualizar_datos_de_receipt_detail");
		},
		datos_desde_shipping_container_detail: () => {
			console.log("[Shipping Container Detail GET]");
			sendMessageToRender(message.datos, "actualizar_datos_shipping_container_detail");
		},
		datos_desde_wave_detail: () => {
			console.log("[Wave Detail GET]");
			sendMessageToRender(message.datos, "actualizar_datos_de_wave_detail");
		},
		datos_desde_workinstruction_detail: () => {
			console.log("[Work Instruction Detail GET]");
			sendMessageToRender(message.datos, "actualizar_datos_de_workinstruction_detail");
		},
		datos_desde_load_detail: () => {
			console.log("[Load Detail GET]");
			sendMessageToRender(message.datos, "actualizar_datos_de_load_detail");
		},
		datos_desde_item_unit_of_measure: () => {
			console.log("[item Unit of Measure GET]");
			sendMessageToRender(message.datos, "actualizar_datos_de_item_unit_of_measure");
		},
	};

	// Ejecutar el manejador correspondiente si existe
	if (actionHandlers[message.action]) {
		actionHandlers[message.action]();
	} else {
		console.error(`Acción desconocida: ${message.action}`);
	}
});
