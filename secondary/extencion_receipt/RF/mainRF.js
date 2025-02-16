// Crear una instancia de la clase y ejecutar la inicialización
window.addEventListener("load", async () => {
	try {
		const inputHiddenReceiptPreference = Form1?.HIDDENRECPREF ?? "";
		const receiptType = inputHiddenReceiptPreference?.value;
		const titileMainValue = document
			.querySelector("#proRfWrapper > form > table > tbody > tr.touchscreen-show > td > b")
			?.textContent?.trim();

		const acceptedReceiptPreferences = ["TRASLADOS", "DEVOLUCIONES"];

		if (titileMainValue === "Select a receiving preference" || !acceptedReceiptPreferences.includes(receiptType)) {
			// Si el título principal es igual a "Select a receiving preference", entamos en el menu principal
			return;
		}

		const configurationControl = recoverSettingsStorage();
		const configurationManager = new Configuration({
			...configurationControl,
			receiptType,
		});

		await configurationManager.initialize();
		console.log("Configuration render");

		if (inputHiddenReceiptPreference?.value === "TRASLADOS") {
			new Traslados({ configurationControl, receiptType });
			return;
		}

		if (inputHiddenReceiptPreference?.value === "DEVOLUCIONES") {
			const getDataForm = new GetDataDevolucionesForm();
			await getDataForm.render();

			new Devoluciones({ configurationControl, receiptType });
		}
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
