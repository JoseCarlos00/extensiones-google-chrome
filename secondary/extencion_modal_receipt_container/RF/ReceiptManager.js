console.log("Receit Manager RF Class");

class ReceitManagerRF {
	constructor({ configurationManager }) {
		try {
			this.configurationManager = configurationManager;

			// Inputs
			this.inputTrailerId = Form1?.TRAILERID;

			// buttons action
			this.btnOK = document.querySelector("input[type=submit][value=OK]");

			this.nameStorage = {
				autoComplete: "autoCompleteReceipt",
				confirmOk: "confirmOkReceipt",
				confirmDelay: "confirmDelayReceipt",
				initReceipt: "initReceipt",
			};

			// Configuracion inicial
			this.autoComplete = true;
			this.confirmOk = false;
			this.confirmDelay = 500;
			this.initReceipt = this.getInitReceiptStorage();

			// Title Surtido
			this.tittleSurtido = document.getElementsByTagName("h3")[0]?.textContent?.trim() ?? "";
			this.messageInvaliteTrailerId = document.getElementsByTagName("h3")[1]?.textContent?.trim() ?? "";

			this.isValideTrailerIdTitle = this.tittleSurtido === "Trailer id";

			this.recoverSettingsStorage();
			this.dataContainerStorage = this.configurationManager?.getSaveStorageData();
		} catch (error) {
			console.error("Ha ocurrido un error al inicializar el objeto:", error.message);
		}
	}

	getInitReceiptStorage() {
		const initReceiptStorage = JSON.parse(sessionStorage.getItem(this.nameStorage.initReceipt));
		console.log("[getInitReceiptStorage]:", typeof initReceiptStorage, initReceiptStorage);
		return initReceiptStorage || false;
	}

	// Recuperar configuraciones almacenadas en localStorage
	recoverSettingsStorage() {
		const savedAutocomplete = localStorage.getItem(this.nameStorage.autoComplete);
		const savedConfirmOk = localStorage.getItem(this.nameStorage.confirmOk);
		const savedConfirmDelay = localStorage.getItem(this.nameStorage.confirmDelay);

		// Recuperar y verificar si confirmOk es válido (no ha pasado más de 1 hora)
		if (savedConfirmOk !== null) {
			const confirmOkData = JSON.parse(savedConfirmOk);
			const currentTime = Date.now();
			const oneHour = 60 * 60 * 1000; // 1 hora en milisegundos

			// Verificar si ha pasado más de 1 hora
			if (currentTime - confirmOkData.timestamp > oneHour) {
				localStorage.removeItem(this.nameStorage.confirmOk); // Eliminar de localStorage
				this.confirmOk = false; // Restaurar valor predeterminado
			} else {
				this.confirmOk = confirmOkData.value;
			}
		}

		this.autoComplete = savedAutocomplete === null ? this.autoComplete : JSON.parse(savedAutocomplete);
		this.confirmDelay = savedConfirmDelay === null ? this.confirmDelay : parseInt(savedConfirmDelay, 10);
	}

	autocompleteForm() {
		if (!this.autoComplete) return;

		console.log("AutoComplete:", this.dataContainerStorage);
		const storageLength = Object.keys(this.dataContainerStorage)?.length;

		if (!this.dataContainerStorage || storageLength === 0) {
			console.warn("No se encontraron datos en el almacenamiento [dataContainerStorage]");
			return;
		}

		console.log("Se ejecuto el metodo autocompleteForm()");
	}

	submitForm() {
		if (!this.confirmOk || !this.btnOK) return;

		const isContainerActive = this.inputTrailerId?.value !== "" && this.inputTrailerId ? true : false;

		if (isContainerActive && this.isValideShitment) {
			setTimeout(() => {
				console.warn("Confirmar button OK");
				if (this.messageInvaliteTrailerId !== "Invalid Trailer ID." && this.inputTrailerId.value !== "") {
					this.btnOK.click();
				} else {
					console.warn("Se cancelo la accion de confirmar el button OK");
				}
			}, this.confirmDelay);
		}
	}

	handleGetData() {
		console.log("Se hizo click en el boton de obtener datos");

		this.dataContainerStorage = this.configurationManager?.getSaveStorageData();
		this.changeInitReceiptStorage();
		this.autocompleteForm();
	}

	setEventInitReceipt() {
		const btnInitReceipt = document.getElementById("init-receipt");

		if (!btnInitReceipt) {
			console.error('No se encontró el elemento con id "init-receipt".');
			return;
		}

		btnInitReceipt.addEventListener("click", () => this.handleGetData());
	}

	changeInitReceiptStorage() {
		this.initReceipt = true;
		sessionStorage.setItem(this.nameStorage.initReceipt, JSON.stringify(true));
	}

	setEventListeners() {
		this.setEventInitReceipt();
	}

	init() {
		// Eventos
		this.setEventListeners();
		// this.autocompleteForm();
		// this.submitForm();

		console.log("Button OK: [", this.confirmOk, "]", this.btnOK);
	}
}
