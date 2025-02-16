class Traslados extends ReceitManagerRF {
	constructor(configurationManager) {
		try {
			const { receiptType } = configurationManager;
			super(configurationManager);

			console.log("Iniciando: ", receiptType);

			// Inputs
			this.inputTrailerId = Form1?.TRAILERID;
			this.inputLicencePlate = Form1?.CONTID;

			// buttons action
			this.btnOK = document.querySelector("input[type=submit][value=OK]");
			this.btnDone = document.querySelector("input[type=button][value=Done]");

			// Title Surtido
			this.tittleSurtido = document.getElementsByTagName("h3")[0]?.textContent?.trim() ?? "";
			this.messageInvaliteTrailerId = document.getElementsByTagName("h3")[1]?.textContent?.trim() ?? "";
			this.messageInvaliteLicencePlate = document.getElementsByTagName("h3")[1]?.textContent?.trim() ?? "";

			this.isValideTrailerIdTitle = this.tittleSurtido === "Trailer id";
			this.isValideLicencePlate = this.tittleSurtido === "License plate";
		} catch (error) {
			console.error("Ha ocurrido un error al inicializar el [Traslados]:", error.message);
		}
	}

	autocompleteForm() {
		try {
			if (!this.autoComplete) return;

			const storageLength = Array.from(this.dataContainerStorage).length ?? 0;

			if (!this.dataContainerStorage || storageLength === 0) {
				console.warn("No se encontraron datos en el almacenamiento [dataContainerStorage]");
				return;
			}

			if (this.isValideTrailerIdTitle) {
				this.setValueTrailerIdInput();
				return;
			}

			if (this.isValideLicencePlate) {
				this.setValueLicencePlate();
				return;
			}
		} catch (error) {
			console.error("Error: [AutoComplete]:", error);
		}
	}

	submitForm() {
		if (!this.confirmOk || !this.btnOK) return;

		if (
			this.inputTrailerId?.value === "" &&
			this.inputTrailerId &&
			this.messageInvaliteTrailerId !== "Invalid Trailer ID."
		) {
			console.warn("Input Trailer ID vacío");
			return;
		}

		if (
			this.inputLicencePlate?.value === "" &&
			this.inputLicencePlate &&
			this.messageInvaliteLicencePlate !== "Configuracion"
		) {
			console.warn("Input Licence Plate vacío");
			return;
		}

		setTimeout(() => {
			console.warn("Confirmar button OK");
			this.btnOK.click();
		}, this.confirmDelay);
	}

	setValueTrailerIdInput() {
		const tralerId = this.configurationManager.getTrailerId();
		console.log("[setValueTrailerIdInput]: tralerId:", tralerId);

		if (this.inputTrailerId && tralerId) {
			this.inputTrailerId.value = tralerId;
			this.submitForm();
		}
	}
}
