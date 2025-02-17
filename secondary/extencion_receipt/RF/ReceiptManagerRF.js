class ReceitManagerRF {
	constructor({ autoComplete, confirmDelay, confirmOk, receiptType }) {
		try {
			this.eventStorgageChange = eventNameStorgageChange ?? "storageChange";
			this.nameDataStorage = nameStorageContainer;

			this.nameStorage = {
				autoComplete: "autoCompleteReceipt",
				confirmOk: "confirmOkReceipt",
				confirmDelay: "confirmDelayReceipt",
				initReceipt: "initReceipt",
			};

			// Configuracion inicial
			this.autoComplete = autoComplete;
			this.confirmOk = confirmOk;
			this.confirmDelay = confirmDelay;
			this.initReceipt = this.getInitReceiptStorage();
			this.currentReceiptType = receiptType;

			// Storage
			this.dataStorage = LocalStorageHelper.get(this.nameDataStorage);
			this.dataContainerStorage = this.dataStorage?.dataContainer || [];
			this.receiptType = this.dataStorage?.receiptType;
		} catch (error) {
			console.error("Ha ocurrido un error al inicializar el ReceitManagerRF:", error.message);
		}
	}

	getInitReceiptStorage() {
		const storage = sessionStorage.getItem("initReceipt");
		const initReceiptStorage = storage ? JSON.parse(storage) : false;
		return initReceiptStorage;
	}

	// Recuperar configuraciones almacenadas en localStorage
	recoverSettingsStorage() {
		const savedAutocomplete = localStorage.getItem(this.nameStorage.autoComplete);
		const savedConfirmOk = localStorage.getItem(this.nameStorage.confirmOk);

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
	}

	autocompleteForm() {
		throw new Error("Method not implemented in the class child");
	}

	setValueLicencePlate() {
		// Verifica si el array `dataContainerStorage` tiene elementos
		if (this.dataContainerStorage?.length === 0 && this.inputLicencePlate) {
			console.log("No hay datos en dataContainerStorage.");
			return;
		}

		// Obtén el primer objeto del array
		const firstObject = this.dataContainerStorage?.[0];

		// Verifica si el objeto tiene un array `containers` válido
		if (!firstObject?.containers || firstObject?.containers?.length === 0) {
			// Elimina el objeto si su `containers` está vacío
			this.dataContainerStorage?.shift();
			console.log("[1] El primer objeto fue eliminado porque `containers` está vacío.");

			LocalStorageHelper.save(this.nameStorageContainer, {
				...this.storageContainer,
				dataContainer: this.dataContainerStorage,
			});

			console.warn("No hay datos gurdados");
			return;
		}

		// Obtén y procesa el primer elemento de `containers`
		const firstLicencePlate = firstObject.containers.shift();
		console.log(`Procesando placa: ${firstLicencePlate}`);

		LocalStorageHelper.save(this.nameStorageContainer, {
			...this.storageContainer,
			dataContainer: this.dataContainerStorage,
		});

		// Si después de eliminar, el array `containers` está vacío, elimina el objeto completo
		if (firstObject.containers?.length === 0) {
			this.dataContainerStorage.shift();
			LocalStorageHelper.save(this.nameStorageContainer, {
				...this.storageContainer,
				dataContainer: this.dataContainerStorage,
			});
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

	onclickButtonDonde() {
		if (!this.confirmOk || !this.btnDone) {
			console.error("No se encontró el botón DONE");
			return;
		}

		setTimeout(() => {
			this.btnDone.click();
		}, this.confirmDelay);
	}

	handleGetData() {
		this.dataStorage = LocalStorageHelper.get(this.nameDataStorage);
		this.dataContainerStorage = this.dataStorage?.dataContainer;
		this.receiptType = this.dataStorage?.receiptType;

		this.availableButtonInitReceipt();
		this.autocompleteForm();
	}

	setEventListeners() {
		console.log("setEventListeners");

		const form = document.getElementById("form-config");
		const { confirmToggle, autoCompleteToggle } = form;

		this.autocompleteForm();
		this.availableButtonInitReceipt();

		const handleNewRegister = () => {
			this.initReceipt = true;
			this.confirmOk = true;
			this.autoComplete = true;

			confirmToggle.checked = true;
			autoCompleteToggle.checked = true;

			const newEventFormControl = new Event("event-form-control");
			window.dispatchEvent(newEventFormControl);

			this.handleGetData();
		};

		// Evento que se dispara cuando se guardar los datos del formulario <textarea>
		window.addEventListener(this.eventStorgageChange, handleNewRegister);

		// Evento Cuando se da click en el button #btnInitReceipt
		window.addEventListener("init-receipt-event", handleNewRegister);
	}

	availableButtonInitReceipt() {
		const btnInitReceipt = document.getElementById("init-receipt");

		if (btnInitReceipt && this.dataContainerStorage?.length > 0) {
			btnInitReceipt.removeAttribute("disabled");
		} else {
			btnInitReceipt.setAttribute("disabled", "");
		}
	}

	updateCounter(value) {
		console.log("updateCounter ReceiptManager");
		const conunterE = document.querySelector("#countRestante");
		const containerLent = this.dataContainerStorage?.length ?? 0;

		if (conunterE) {
			conunterE.innerHTML = `${value ? value : containerLent}`;
		} else {
			console.warn("No se encontro el elemento #countRestante");
		}
	}

	init() {
		// Eventos
		this.setEventListeners();
	}
}
