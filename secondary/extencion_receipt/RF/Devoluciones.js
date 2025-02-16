class Devoluciones extends ReceitManagerRF {
	constructor({ configurationManager }) {
		try {
			super({ configurationManager });

			// Inputs
			this.inputReceiptId = Form1?.RECID;
			this.inputLicencePlate = Form1?.CONTID;

			// buttons action
			this.btnOK = document.querySelector("input[type=submit][value=OK]");
			this.btnDone = document.querySelector("input[type=button][value=Done]");

			// Title Surtido
			this.tittleSurtido = document.getElementsByTagName("h3")[0]?.textContent?.trim() ?? "";
			this.messageInvaliteReceiptId = document.getElementsByTagName("h3")[1]?.textContent?.trim() ?? "";
			this.messageInvaliteLicencePlate = document.getElementsByTagName("h3")[1]?.textContent?.trim() ?? "";

			this.isValideReceiptIdTitle = this.tittleSurtido === "Receipt id";
			this.isValideLicencePlate = this.tittleSurtido === "License plate";
		} catch (error) {
			console.error("Ha ocurrido un error al inicializar el [Devoluciones]:", error.message);
		}
	}

	autocompleteForm() {
		try {
			if (!this.autoComplete) return;

			const storageLength = this.dataContainerStorage?.length;

			if (storageLength === 0) {
				console.warn("No hay datos en dataContainerStorage.");
				return;
			}

			this.updateCounter(storageLength);

			if (!this.dataContainerStorage || storageLength === 0) {
				console.warn("No se encontraron datos en el almacenamiento [dataContainerStorage]");
				return;
			}

			if (this.isValideReceiptIdTitle) {
				this.setValueReceiptIdInput();
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
			this.inputReceiptId?.value === "" &&
			this.inputReceiptId &&
			this.messageInvaliteReceiptId !== "Invalid receipt."
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

	setValueReceiptIdInput() {
		console.log("setValueReceiptIdInput", this.dataContainerStorage);

		const receiptId = this.dataContainerStorage?.[0]?.receiptId;
		console.log("[setValueReceiptIdInput]: receiptId:", receiptId);

		if (this.inputReceiptId && receiptId) {
			this.inputReceiptId.value = receiptId;
			this.submitForm();
		}
	}

	// * Revisar ↓

	updateCounter(value) {
		const countRestante = document.querySelector("#countRestante");
		if (countRestante) {
			countRestante.innerHTML = `${value ?? "0"}`;
		} else {
			console.warn("No se encontro el elemento #countRestante");
		}
	}

	/**
	 * TODO: Agregar un setTimeout para acer submitForm
	 */
}
