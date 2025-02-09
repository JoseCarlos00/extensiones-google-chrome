console.log("Receit Manager RF Class");

class Devoluciones {
	constructor() {
		try {
			// Inputs
			this.inputReceiptId = Form1?.RECID;
			this.inputLicencePlate = Form1?.CONTID;

			// buttons action
			this.btnOK = document.querySelector("input[type=submit][value=OK]");
			this.btnDone = document.querySelector("input[type=button][value=Done]");

			this.nameStorageContainer = "receiptContainerDataDevoluciones";

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
			this.messageInvaliteReceiptId = document.getElementsByTagName("h3")[1]?.textContent?.trim() ?? "";
			this.messageInvaliteLicencePlate = document.getElementsByTagName("h3")[1]?.textContent?.trim() ?? "";

			this.isValideReceiptIdTitle = this.tittleSurtido === "Receipt id";
			this.isValideLicencePlate = this.tittleSurtido === "License plate";

			this.recoverSettingsStorage();
			this.dataContainerStorage = LocalStorageHelper.get(this.nameStorageContainer);
		} catch (error) {
			console.error("Ha ocurrido un error al inicializar el objeto:", error.message);
		}
	}

	getInitReceiptStorage() {
		const initReceiptStorage = JSON.parse(sessionStorage.getItem(this.nameStorage.initReceipt));
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

	setValueReceiptIdInput() {
		console.log("setValueReceiptIdInput", this.dataContainerStorage);

		const receiptId = this.dataContainerStorage?.[0]?.receiptId;
		console.log("[setValueReceiptIdInput]: receiptId:", receiptId);

		if (this.inputReceiptId && receiptId) {
			this.inputReceiptId.value = receiptId;
			this.submitForm();
		}
	}

	setValueLicencePlate() {
		// Verifica si el array `dataContainerStorage` tiene elementos
		if (this.dataContainerStorage?.length === 0 && this.inputLicencePlate) {
			console.log("No hay datos en dataContainerStorage.");
			return;
		}

		// Obtén el primer objeto del array
		const firstObject = this.dataContainerStorage?.[0];
		console.log("firstObject", firstObject);

		// Verifica si el objeto tiene un array `containers` válido
		if (!firstObject?.containers || firstObject?.containers?.length === 0) {
			// Elimina el objeto si su `containers` está vacío
			this.dataContainerStorage?.shift();
			console.log("[1] El primer objeto fue eliminado porque `containers` está vacío.");
			LocalStorageHelper.save(this.nameStorageContainer, this.dataContainerStorage);
			console.warn("No hay datos gurdados");
			return;
		}

		// Obtén y procesa el primer elemento de `containers`
		const firstLicencePlate = firstObject.containers.shift();
		console.log(`Procesando placa: ${firstLicencePlate}`);
		LocalStorageHelper.save(this.nameStorageContainer, this.dataContainerStorage);

		// Si después de eliminar, el array `containers` está vacío, elimina el objeto completo
		if (firstObject.containers?.length === 0) {
			this.dataContainerStorage.shift();
			LocalStorageHelper.save(this.nameStorageContainer, this.dataContainerStorage);
			console.log("[2] El primer objeto fue eliminado porque `containers` quedó vacío.");
		}

		if (firstLicencePlate === "DONE") {
			this.onclickButtonDonde();
			return;
		}

		this.inputLicencePlate.value = firstLicencePlate;

		console.log("Click en oK");
		this.submitForm();
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

	onclickButtonDonde() {
		if (!this.confirmOk || !this.btnDone) {
			console.error("No se encontró el botón DONE");
			return;
		}

		setTimeout(() => {
			this.btnDone.click();
		}, this.confirmDelay);
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

	handleGetData() {
		this.dataContainerStorage = LocalStorageHelper.get(this.nameStorageContainer);
		this.changeInitReceiptStorage();
		this.autocompleteForm();
	}

	setEventInitReceipt() {
		const btnInitReceipt = document.getElementById("initRecDev");

		if (!btnInitReceipt) {
			console.error('No se encontró el elemento con id "initRecDev".');
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

	updateCounter(value) {
		const countRestante = document.querySelector("#countRestante");
		if (countRestante) {
			countRestante.innerHTML = `${value ?? "0"}`;
		} else {
			console.warn("No se encontro el elemento #countRestante");
		}
	}

	init() {
		// Eventos
		this.setEventListeners();
	}
}
