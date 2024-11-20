console.log("Receit Manager RF Class");

class ReceitManagerRF {
	constructor({ configurationManager }) {
		try {
			this.configurationManager = configurationManager;

			// Inputs
			this.inputTrailerId = Form1?.TRAILERID;
			this.inputLicencePlate = Form1?.CONTID;

			// buttons action
			this.btnOK = document.querySelector("input[type=submit][value=OK]");

			this.nameStorageContainer = "dataContainers";

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
			this.messageInvaliteLicencePlate = document.getElementsByTagName("h3")[1]?.textContent?.trim() ?? "";

			this.isValideTrailerIdTitle = this.tittleSurtido === "Trailer id";
			this.isValideLicencePlate = this.tittleSurtido === "License plate";

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

	setValueTrailerIdInput() {
		const tralerId = this.configurationManager.getTrailerId();
		console.log("[AutoComplete]: tralerId:", tralerId);

		if (this.inputTrailerId && tralerId) {
			this.inputTrailerId.value = tralerId;
			this.submitForm();
		}
	}

	setValueLicencePlate() {
		// Verifica si el array `dataContainerStorage` tiene elementos
		if (this.dataContainerStorage.length === 0 && this.inputLicencePlate) {
			console.log("No hay datos en dataContainerStorage.");
			return;
		}

		// Obtén el primer objeto del array
		const firstObject = this.dataContainerStorage[0];

		// Verifica si el objeto tiene un array `containers` válido
		if (!firstObject.containers || firstObject.containers.length === 0) {
			// Elimina el objeto si su `containers` está vacío
			this.dataContainerStorage.shift();
			console.log("El primer objeto fue eliminado porque `containers` está vacío.");
			LocalStorageHelper.save(this.nameStorageContainer, this.dataContainerStorage);
			console.log("dataContainerStorage:", this.dataContainerStorage);
			alert("1: Ejecutar el DONE");
			return;
		}

		// Obtén y procesa el primer elemento de `containers`
		const firstLicencePlate = firstObject.containers.shift();
		console.log(`Procesando placa: ${firstLicencePlate}`);
		LocalStorageHelper.save(this.nameStorageContainer, this.dataContainerStorage);
		console.log("dataContainerStorage:", this.dataContainerStorage);
		this.inputLicencePlate.value = firstLicencePlate;

		// Si después de eliminar, el array `containers` está vacío, elimina el objeto completo
		if (firstObject.containers.length === 0) {
			this.dataContainerStorage.shift();
			LocalStorageHelper.save(this.nameStorageContainer, this.dataContainerStorage);
			console.log("dataContainerStorage:", this.dataContainerStorage);
			console.log("El primer objeto fue eliminado porque `containers` quedó vacío.");
			alert("2: Ejecutar el DONE");
			return;
		}

		this.submitForm();
	}

	autocompleteForm() {
		try {
			if (!this.autoComplete) return;

			console.log("[AutoComplete]:", this.dataContainerStorage);
			const storageLength = Array.from(this.dataContainerStorage).length ?? 0;

			if (!this.dataContainerStorage || storageLength === 0) {
				console.warn("No se encontraron datos en el almacenamiento [dataContainerStorage]");
				return;
			}

			console.log("Se ejecuto el metodo autocompleteForm()");

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
		console.log("Se ejecuto el metodo submitForm()");

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
		this.autocompleteForm();
	}

	init() {
		// Eventos
		this.setEventListeners();
	}
}
