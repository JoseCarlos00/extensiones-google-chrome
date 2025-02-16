// Crear una instancia de la clase y ejecutar la inicialización
window.addEventListener("load", () => {
	try {
		const inputHiddenReceiptPreference = Form1?.HIDDENRECPREF ?? "";

		const configurationControl = recoverSettingsStorage();
		const configurationManager = new Configuration({ ...configurationControl });

		console.log({ configurationManager });
		configurationManager.initialize();

		if (inputHiddenReceiptPreference?.value === "TRASLADOS") {
			// const receiptManager = new Traslados({ configurationManager });
			// console.log(receiptManager);
			// receiptManager.init();
			return;
		}

		if (inputHiddenReceiptPreference?.value === "DEVOLUCIONES") {
			// const getDataForm = new GetDataDevolucionesForm({ nameDataStorage: "receiptContainerDataDevoluciones" });
			// getDataForm.render();
			// const receiptManager = new Devoluciones({ configurationManager });
			// console.log(receiptManager);
			// setTimeout(() => {
			// 	receiptManager.init();
			// }, 50);
		}
	} catch (error) {
		console.error("Error: no se pudo crear ReceitManagerRF", error.message);
	}
});

function recoverSettingsStorage() {
	const nameStorage = {
		autoComplete: "autoCompleteReceipt",
		confirmOk: "confirmOkReceipt",
	};

	const savedAutocomplete = localStorage.getItem(nameStorage.autoComplete);
	const savedConfirmOk = localStorage.getItem(nameStorage.confirmOk);

	let confirmOk = false;

	// Recuperar y verificar si confirmOk es válido (no ha pasado más de 1 hora)
	if (savedConfirmOk !== null) {
		const confirmOkData = JSON.parse(savedConfirmOk);
		const currentTime = Date.now();
		const oneHour = 60 * 60 * 1000; // 1 hora en milisegundos

		// Verificar si ha pasado más de 1 hora
		if (currentTime - confirmOkData.timestamp > oneHour) {
			localStorage.removeItem(nameStorage.confirmOk); // Eliminar de localStorage
			confirmOk = false; // Restaurar valor predeterminado
		} else {
			confirmOk = confirmOkData.value;
		}
	}

	const autoComplete = savedAutocomplete ? JSON.parse(savedAutocomplete) : true;
	const confirmDelay = 500;

	return { autoComplete, confirmDelay, confirmOk };
}
