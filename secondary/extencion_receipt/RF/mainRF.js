// Crear una instancia de la clase y ejecutar la inicialización
window.addEventListener("load", async () => {
	try {
		const inputHiddenReceiptPreference = Form1?.HIDDENRECPREF ?? "";

		const configurationControl = recoverSettingsStorage();
		const configurationManager = new Configuration({
			...configurationControl,
			receiptType: inputHiddenReceiptPreference?.value,
		});

		await configurationManager.initialize();

		console.log({ inputHiddenReceiptPreference });

		// if (inputHiddenReceiptPreference?.value === "TRASLADOS") {
		// 	const receiptManager = new Traslados({ configurationControl });
		// 	return;
		// }

		// if (inputHiddenReceiptPreference?.value === "DEVOLUCIONES") {
		// 	const getDataForm = new GetDataDevolucionesForm();
		// 	await getDataForm.render();

		// 	const receiptManager = new Devoluciones({ configurationControl });
		// }
	} catch (error) {
		console.error("Ha ocurrido un error en [mainRF]:", error.message);
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
