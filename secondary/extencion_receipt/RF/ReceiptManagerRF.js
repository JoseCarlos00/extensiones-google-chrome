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

			this.inputReceiptId = null;
			this.inputTrailerId = null;

			this.timeoutId = null;
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

	submitForm() {
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
		// Actualiza e elimina el primer Objeto de dataContainerStorage
		if (!firstObject?.containers || firstObject?.containers?.length === 0) {
			// Elimina el objeto si su `containers` está vacío
			this.dataContainerStorage?.shift();
			console.log("[1] El primer objeto fue eliminado porque `containers` está vacío.");

			LocalStorageHelper.save(this.nameDataStorage, {
				...this.dataStorage,
				dataContainer: this.dataContainerStorage,
			});

			console.warn("No hay datos gurdados");
			return;
		}

		// Obtén y procesa el primer elemento de `containers`
		const firstLicencePlate = firstObject.containers.shift();
		console.log(`Procesando placa: ${firstLicencePlate}`);

		LocalStorageHelper.save(this.nameDataStorage, {
			...this.dataStorage,
			dataContainer: this.dataContainerStorage,
		});

		/**
		 * Si después de eliminar el primer elemento de `containers`,
		 * el array `containers` está vacío, elimina el objeto completo
		 *  Actualiza e elimina el primer Objeto de dataContainerStorage
		 */
		//
		if (firstObject.containers?.length === 0) {
			this.dataContainerStorage.shift();
			LocalStorageHelper.save(this.nameDataStorage, {
				...this.dataStorage,
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
		if (!this.btnDone) {
			console.error("No se encontró el botón DONE");
			return;
		}

		if (!this.confirmOk) {
			console.warn("DONE: confirmOK está Inhablilitado");
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

		window.addEventListener("cancel-receipt-event", () => {
			this.initReceipt = false;
			this.inputReceiptId && (this.inputReceiptId.value = "");
			this.inputTrailerId && (this.inputTrailerId.value = "");
		});
	}

	availableButtonInitReceipt() {
		const btnInitReceipt = document.getElementById("init-receipt");

		if (btnInitReceipt && this.dataContainerStorage?.length > 0 && this.currentReceiptType === this.receiptType) {
			btnInitReceipt.removeAttribute("disabled");
			btnInitReceipt.classList.add("bounce");
		} else {
			btnInitReceipt.setAttribute("disabled", "");
			btnInitReceipt.classList.remove("bounce");
		}
	}

	updateCounter(value) {
		console.log("updateCounter ReceiptManager");

		const conunterE = document.querySelector("#countRestante");
		const containerLength = value ? value : this.dataContainerStorage?.length ?? "0";
		const containersLength = this.dataContainerStorage?.[0]?.containers
			? this.dataContainerStorage[0].containers?.length - 1
			: "0";
		console.log({
			dataContainerStorage: this.dataContainerStorage,
			containersLength,
			containerLength,
			value,
			dataContainerStorageContainers: this.dataContainerStorage?.[0]?.containers,
		});

		if (conunterE) {
			conunterE.innerHTML = `${containerLength} |  ${containersLength}`;
		} else {
			console.warn("No se encontro el elemento #countRestante");
		}
	}

	clearExistingTimeout() {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}
	}

	setTimeoutSubmitForm() {
		this.clearExistingTimeout();

		this.timeoutId = setTimeout(() => this.submitForm(), 1000);

		// Limpiar el timeout original después de 10 minutos
		setTimeout(() => {
			this.clearExistingTimeout();
			console.log("Timeout de 10 minutos alcanzado, timeout original limpiado.");
		}, 10 * 60 * 1000);
	}

	init() {
		// Eventos
		this.setEventListeners();
	}
}
