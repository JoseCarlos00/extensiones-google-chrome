class Configuration {
	constructor({ autoComplete, confirmDelay, confirmOk, receiptType }) {
		try {
			this.nameStorageContainer = nameStorageContainer;
			this.eventStorgageChange = eventNameStorgageChange ?? "storageChange";

			this.autoComplete = autoComplete;
			this.confirmOk = confirmOk;
			this.confirmDelay = confirmDelay;

			this.nameStorage = {
				autoComplete: "autoCompleteReceipt",
				confirmOk: "confirmOkReceipt",
				confirmDelay: "confirmDelayReceipt",
				initReceipt: "initReceipt",
			};

			this.trailerIdLabel = null;
			this.btnInitReceipt = null;
			this.btnCancelReceipt = null;

			this.currentReceiptType = receiptType;

			this.dataStorage = LocalStorageHelper.get(this.nameStorageContainer) || {};
			this.dataContainerStorage = this.dataStorage?.dataContainer || [];
			this.trailerId = this.dataStorage?.trailerId || "No encontrado";
			this.receiptType = this.dataStorage?.receiptType;

			this.isReceiptTypeTralados = this.currentReceiptType === "TRASLADOS";
			this.isReceiptTypedevoluciones = this.currentReceiptType === "DEVOLUCIONES";

			this.renderConfiguration = new RenderConfiguration({
				autoComplete: this.autoComplete,
				confirmOk: this.confirmOk,
				receiptType: this.currentReceiptType,
				trailerId: this.trailerId,
			});
		} catch (error) {
			console.error("Error al crear [Configuration constructor]:", error);
		}
	}

	async initialize() {
		try {
			await this.renderConfiguration.render();
			this.initializarButonsForm();

			this.setEventListener();
			this.setEventStorage();
		} catch (error) {
			console.error("Ha ocurrio un error al inicializar el panel de Configuracion:", error);
		}
	}

	initializarButonsForm() {
		this.trailerIdLabel = document.getElementById("trailer-id-label");
		this.btnInitReceipt = document.getElementById("init-receipt");
		this.btnCancelReceipt = document.getElementById("cancel-receipt");

		if (this.isReceiptTypeTralados) {
			if (!this.trailerIdLabel) {
				throw new Error("No se encontro el elemento #trailer-id-label");
			}
		}

		if (!this.btnInitReceipt) {
			throw new Error("No se encontro el elemento #init-receipt");
		}

		if (!this.btnCancelReceipt) {
			throw new Error("No se encontro el elemento #cancel-receipt");
		}
	}

	setEventListener() {
		try {
			const form = document.getElementById("form-config");
			if (!form) return;

			const { confirmToggle, autoCompleteToggle } = form;

			if (!confirmToggle) {
				throw new Error("No se encontro el elemento #confirm-toggle");
			}

			if (!autoCompleteToggle) {
				throw new Error("No se encontro el elemento #auto-complete-toggle");
			}

			const handleAutoComplete = () => {
				this.autoComplete = autoCompleteToggle.checked;
				localStorage.setItem(this.nameStorage.autoComplete, JSON.stringify(this.autoComplete));
			};

			const handleConfirm = () => {
				this.confirmOk = confirmToggle.checked;

				// Guardar confirmOk y la hora de activación
				localStorage.setItem(
					this.nameStorage.confirmOk,
					JSON.stringify({
						value: this.confirmOk,
						timestamp: Date.now(), // Guarda la marca de tiempo actual
					})
				);
			};

			autoCompleteToggle?.addEventListener("change", handleAutoComplete);
			confirmToggle?.addEventListener("change", handleConfirm);

			window.addEventListener("event-form-control", () => {
				handleAutoComplete();
				handleConfirm();
			});
		} catch (error) {
			console.error("[Configuration] Ha ocurrido un error al configurar los eventos:", error);
			throw new Error("Ha ocurrido un error al configurar los eventos");
		}
	}

	setEventStorage() {
		try {
			const { btnCancelReceipt, btnInitReceipt } = this;

			btnCancelReceipt.addEventListener("click", () => {
				sessionStorage.removeItem(this.nameStorage.initReceipt);
				LocalStorageHelper.remove(this.nameStorageContainer);

				this.setvalueInStorage();
				this.handleStorageEvent();
			});

			btnInitReceipt.addEventListener("click", () => {
				sessionStorage.setItem(this.nameStorage.initReceipt, JSON.stringify(true));

				const initReceiptEvent = new Event("init-receipt-event");
				window.dispatchEvent(initReceiptEvent);
			});

			// Windows
			window.addEventListener(this.eventStorgageChange, () => {
				this.handleStorageEvent();
			});

			window.addEventListener("storage", ({ key }) => {
				if (key === this.nameStorageContainer) {
					console.log("Event [event storage] In ReceiptConfiguration");
					this.setvalueInStorage();
					this.handleStorageEvent();
				}
			});
		} catch (error) {
			console.error("Ha ocurrido un error al guardar eventos de Storage:", error?.message);
		}
	}

	verifyTrailerId = () => {
		if (!this.trailerIdLabel) return;

		this.trailerIdLabel.innerHTML = `Trailer Id: ${this.trailerId}`;
		console.log("trailerId:", this.trailerId);
	};

	setvalueInStorage() {
		this.dataStorage = LocalStorageHelper.get(this.nameStorageContainer) || {};
		this.dataContainerStorage = this.dataStorage?.dataContainer || [];
		this.trailerId = this.dataStorage?.trailerId || "No encontrado";
	}

	// -> Cada que se actualize el valor en local estorage. Agregar o Eliminar
	handleStorageEvent() {
		console.log("handleStorageEvent");
		this.verifyTrailerId();

		if (this.btnInitReceipt && this.dataContainerStorage?.length > 0) {
			this.btnInitReceipt.removeAttribute("disabled");
		} else {
			this.btnInitReceipt.setAttribute("disabled", "");
		}
	}
}
