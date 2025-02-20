class Devoluciones extends ReceitManagerRF {
	constructor(configurationManager) {
		try {
			super(configurationManager);

			console.log("Iniciando: ", this.currentReceiptType);

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
			console.log("autocompleteForm", !this.currentReceiptType !== this.receiptType, {
				autoComplete: this.autoComplete,
				confirmOk: this.confirmOk,
			});

			if (this.currentReceiptType !== this.receiptType) {
				console.error("Error: El tipo de recibo no coincide con el tipo de recibo configurado", {
					currentReceiptType: this.currentReceiptType,
					receiptType: this.receiptType,
				});
				return;
			}

			if (!this.autoComplete) return;

			const storageLength = this.dataContainerStorage?.length ?? 0;

			this.updateCounter(storageLength);

			if (storageLength === 0) {
				console.warn("No se encontraron datos en el almacenamiento [dataContainerStorage]");
				return;
			}

			if (this.isValideReceiptIdTitle && this.inputReceiptId) {
				this.setValueReceiptIdInput();
				return;
			}

			if (this.isValideLicencePlate && this.inputLicencePlate) {
				this.setValueLicencePlate();
				return;
			}
		} catch (error) {
			console.error("Error: [AutoComplete]:", error);
		}
	}

	submitForm() {
		console.log("[submitForm]");

		if (!this.confirmOk || !this.btnOK) return;

		if (
			this.inputReceiptId?.value === "" &&
			this.inputReceiptId &&
			this.messageInvaliteReceiptId !== "Invalid receipt."
		) {
			console.warn("Input Receipt ID vacío");
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
			this.setTimeoutsubmitForm();
		}, this.confirmDelay);
	}

	setValueReceiptIdInput() {
		const receiptId = this.dataContainerStorage?.[0]?.receiptId;
		console.log("[setValueReceiptIdInput]: receiptId:", receiptId);

		this.inputReceiptId.value = receiptId;
		if (this.inputReceiptId && receiptId && this.messageInvaliteReceiptId !== "Invalid receipt.") {
			this.submitForm();
		}
	}
}
