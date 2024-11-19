console.log("Receit Manager RF Class");

class ReceitManagerRF {
	constructor() {
		try {
			// Inputs Hidden

			// Inputs
			this.inputItem = document.querySelector("#FORM1 > table > tbody input[name=itemNum]");
			this.inputContainer = document.querySelector("#FORM1 > table > tbody input[name=TRANSCONTID]");

			// buttons action
			this.btnOK = document.getElementById("bOK");

			// Configuracion inicial
			this.autoComplete = true;
			this.confirmOk = false;
			this.confirmDelay = 500;

			// Title Surtido
			this.tittleSurtido = document.getElementsByTagName("h3")[0]?.textContent?.trim() ?? "";
			this.isValideTrailerIdTitle = this.tittleSurtido.toLocaleLowerCase.includes("traile id");

			this.recoverSettingsStorage();
		} catch (error) {
			console.error("Ha ocurrido un error al inicializar el objeto:", error.message);
		}
	}

	// Recuperar configuraciones almacenadas en localStorage
	recoverSettingsStorage() {
		const savedAutocomplete = localStorage.getItem("autoComplete");
		const savedConfirmOk = localStorage.getItem("confirmOk");
		const savedConfirmDelay = localStorage.getItem("confirmDelay");

		// Recuperar y verificar si confirmOk es válido (no ha pasado más de 1 hora)
		if (savedConfirmOk !== null) {
			const confirmOkData = JSON.parse(savedConfirmOk);
			const currentTime = Date.now();
			const oneHour = 60 * 60 * 1000; // 1 hora en milisegundos

			// Verificar si ha pasado más de 1 hora
			if (currentTime - confirmOkData.timestamp > oneHour) {
				localStorage.removeItem("confirmOk"); // Eliminar de localStorage
				this.confirmOk = false; // Restaurar valor predeterminado
			} else {
				this.confirmOk = confirmOkData.value;
			}
		}

		this.autoComplete = savedAutocomplete === null ? this.autoComplete : JSON.parse(savedAutocomplete);
		this.confirmDelay = savedConfirmDelay === null ? this.confirmDelay : parseInt(savedConfirmDelay, 10);
	}

	insertContenedor() {
		if (!this.previusTrText && !this.inputContainer) return;

		const hasCont = this.previusTrText.includes("Cont:");
		if (!hasCont) return;

		const lp = this.previusTrText.replace("Cont:\n", "");
		this.inputContainer.value = lp;
	}

	autocompleteForm() {
		if (!this.autoComplete) return;

		if (this.inputItem && this.inputItemHidden) {
			this.inputItem.value = this.inputItemHidden.value;

			this.inputContainer?.focus();
		}

		this.insertContenedor();

		if (this.inputCheckDigit && this.inputCheckDigitHidden) {
			this.inputCheckDigit.value = this.inputCheckDigitHidden.value;
		}

		if (this.inputToLoc && this.inputFromLocHidden) {
			this.inputToLoc.value = this.inputFromLocHidden.value;
		}
	}

	submitForm() {
		if (!this.confirmOk || !this.btnOK) return;

		const isContainerActive = this.inputContainer?.value !== "" && this.inputContainer ? true : false;

		if (isContainerActive && this.isValideShitment) {
			setTimeout(() => {
				console.warn("Confirmar button OK");
				this.btnOK.click();
			}, this.confirmDelay);
		}
	}

	static inputsHiddenTest() {
		document.querySelectorAll("input[type=hidden]").forEach((button) => {
			console.log(`${button.name} => ${button.value}`);
		});
	}

	init() {
		// Eventos
		// this.autocompleteForm();
		// this.submitForm();

		console.log("Button OK: [", this.confirmOk, "]", this.btnOK);
	}
}

window.addEventListener("load", () => {
	try {
		const inputHiddenReceiptPreference = Form1?.HIDDENRECPREF ?? "";

		if (inputHiddenReceiptPreference?.value !== "TRASLADOS") {
			throw new Error(`La preferencia de recibo actual: [${inputHiddenReceiptPreference?.value}]. No es [TRASLADOS]`);
		}

		const receiptManager = new ReceitManagerRF();
		console.log(receiptManager);
		receiptManager.init();
	} catch (error) {
		console.error("Error: no se pudo crear ReceitManagerRF", error.message);
	}
});
