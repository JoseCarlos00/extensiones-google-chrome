class ReceitManagerRF {
	constructor({ autoComplete, confirmDelay, confirmOk }) {
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
			console.log("initReceipt", this.initReceipt);

			// Storage
			this.dataStorage = LocalStorageHelper.get(this.nameDataStorage);
			this.dataContainerStorage = this.dataStorage?.dataContainer;
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
		this.dataContainerStorage = LocalStorageHelper.get(this.nameStorageContainer);
		this.dataContainerStorage = dataStorage?.dataContainer;
		this.autocompleteForm();
	}

	setEventListeners() {
		this.setEventInitReceipt();
		this.autocompleteForm();

		window.addEventListener(this.eventStorgageChange, () => this.handleGetData());

		window.addEventListener("init-receipt-event", () => {
			this.initReceipt = this.getInitReceiptStorage();
		});
	}

	init() {
		// Eventos
		this.setEventListeners();
	}
}
