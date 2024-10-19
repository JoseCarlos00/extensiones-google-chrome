console.log("Surtdo RF Class");

class SurtidoRF {
	constructor() {
		// Inputs
		this.inputItem = document.querySelector("#FORM1 > table > tbody input[name=itemNum]");
		this.inputContainer = document.querySelector("#FORM1 > table > tbody input[name=TRANSCONTID]");

		this.currentTr = this.inputContainer?.closest("tr");
		this.previusTr = this.currentTr?.previousElementSibling;
		this.previusTrText = this.previusTr ? this.previusTr.textContent.trim() : "";

		this.inputToLoc = document.querySelector("#FORM1 > table > tbody input[name=loc]");
		this.inputCheckDigit = document.querySelector("#FORM1 > table > tbody input[name=CHECKDIG]");

		// Inputs Hidden
		this.inputItemHidden = document.querySelector("#HIDDENitem");
		this.inputFromLocHidden = document.querySelector("#HIDDENFROMLOC");
		this.inputCheckDigitHidden = document.querySelector("#HIDDENcheckDigit");
		this.inputLocHidden = document.querySelector("#loc[type=hidden]");

		// buttons action
		this.btnOK = document.getElementById("bOK");

		// Configuracion inicial
		this.autoComplete = true;
		this.confirmOk = false;
		this.confirmDelay = 500;

		this.recoverSettingsStorage();
	}

	// Recuperar configuraciones almacenadas en localStorage
	recoverSettingsStorage() {
		const savedAutocomplete = localStorage.getItem("autoComplete");
		const savedConfirmOk = localStorage.getItem("confirmOk");
		const savedConfirmDelay = localStorage.getItem("confirmDelay");

		this.autoComplete = savedAutocomplete === null ? this.autoComplete : JSON.parse(savedAutocomplete);
		this.confirmOk = savedConfirmOk === null ? this.confirmOk : JSON.parse(savedConfirmOk);
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
		}

		this.insertContenedor();

		if (this.inputCheckDigit && this.inputCheckDigitHidden) {
			this.inputCheckDigit.value = this.inputCheckDigitHidden.value;
		}

		if (this.inputToLoc && this.inputFromLocHidden) {
			this.inputToLoc.value = this.inputFromLocHidden.value;
		}
	}

	saveCurrentUrl() {
		if (this.btnOK) {
			// Verificamos si existe this.btnOK
			const currentUrl = window.location.href; // Obtenemos la URL de la página actual

			// Recuperamos las URLs guardadas anteriormente en localStorage
			let storedUrls = JSON.parse(localStorage.getItem("uniqueUrls")) || [];

			// Comprobamos si la URL ya está guardada
			if (!storedUrls.includes(currentUrl)) {
				storedUrls.push(currentUrl); // Si no está, la añadimos
				localStorage.setItem("uniqueUrls", JSON.stringify(storedUrls)); // Guardamos en localStorage
			}

			console.log("URL guardada:", currentUrl);
		}
	}

	submitForm() {
		if (!this.confirmOk || !this.btnOK) return;

		setTimeout(() => {
			this.btnOK.click();
		}, this.confirmDelay);
	}

	static inputsHiddenTest() {
		document.querySelectorAll("input[type=hidden]").forEach((button) => {
			console.log(`${button.name} => ${button.value}`);
		});
	}

	init() {
		// Eventos
		this.autocompleteForm();
		this.submitForm();

		console.log("Button OK: [", this.confirmOk, "]", this.btnOK);
		if (this.btnOK) {
			this.saveCurrentUrl();
		}
	}
}

window.addEventListener("load", () => {
	const surtido = new SurtidoRF();
	console.log(surtido);
	surtido.init();
});
