class Configuration {
	constructor({ autoComplete, confirmDelay, confirmOk, receiptType }) {
		this.nameStorageContainer = nameStorageContainer;

		this.autoComplete = autoComplete;
		this.confirmOk = confirmOk;
		this.confirmDelay = confirmDelay;

		this.eventStorgageChange = eventNameStorgageChange ?? "storageChange";

		this.nameStorage = {
			autoComplete: "autoCompleteReceipt",
			confirmOk: "confirmOkReceipt",
			confirmDelay: "confirmDelayReceipt",
			initReceipt: "initReceipt",
		};

		this.dataStorage = LocalStorageHelper.get(this.nameStorageContainer);
		this.dataContainerStorage = dataStorage?.dataContainer;
		this.trailerId = dataStorage?.trailerId || "No encontrado";

		this.isReceiptTypeTralados = receiptType === "TRASLADOS";
		this.isReceiptTypedevoluciones = receiptType === "DEVOLUCIONES";

		this.renderConfiguration = new RenderConfiguration({
			autoComplete: this.autoComplete,
			confirmOk: this.confirmOk,
			receiptType,
			trailerId: this.trailerId,
		});

		this.trailerIdLabel = null;
		this.btnInitReceipt = null;
		this.btnCancelReceipt = null;
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

		if (!this.trailerIdLabel && this.isReceiptTypeTralados) {
			throw new Error("No se encontro el elemento #trailer-id-label");
		}

		if (!this.btnInitReceipt) {
			throw new Error("No se encontro el elemento #init-receipt");
		}

		if (!this.btnCancelReceipt) {
			throw new Error("No se encontro el elemento #cancel-receipt");
		}
	}

	setEventListener() {
		const form = document.getElementById("form-config");
		if (!form) return;

		const { confirmToggle, autoCompleteToggle } = form;

		autoCompleteToggle?.addEventListener("change", () => {
			this.autoComplete = autoCompleteToggle.checked;
			localStorage.setItem(this.nameStorage.autoComplete, JSON.stringify(this.autoComplete));
		});

		confirmToggle?.addEventListener("change", () => {
			confirmDelayInput.disabled = !confirmToggle.checked;
			this.confirmOk = confirmToggle.checked;

			// Guardar confirmOk y la hora de activación
			localStorage.setItem(
				this.nameStorage.confirmOk,
				JSON.stringify({
					value: this.confirmOk,
					timestamp: Date.now(), // Guarda la marca de tiempo actual
				})
			);
		});
	}

	setEventStorage() {
		try {
			const { btnCancelReceipt, btnInitReceipt } = this;

			btnCancelReceipt.addEventListener("click", () => {
				sessionStorage.removeItem(this.nameStorage.initReceipt);
				LocalStorageHelper.remove(this.nameStorageContainer);

				this.isReceiptTypeTralados && this.verifyTrailerId();
			});

			btnInitReceipt.addEventListener("click", () => {
				sessionStorage.setItem(this.nameStorage.initReceipt, JSON.stringify(true));
				const initReceiptEvent = new Event("init-receipt-event");
				document.dispatchEvent(initReceiptEvent);
			});

			window.addEventListener(this.eventStorgageChange, () => this.handleStorageEvent());
		} catch (error) {
			console.error("Ha ocurrido un error al guardar eventos de Storage:", error?.message);
		}
	}

	verifyTrailerId = () => {
		if (!this.trailerIdLabel) return;

		this.trailerIdLabel.innerHTML = `Trailer Id: ${this.trailerId}`;
		console.log("trailerId:", this.trailerId);

		if (this.trailerId && this.trailerId !== "No encontrado") {
			btnInitReceipt.removeAttribute("disabled");
		} else {
			btnInitReceipt.setAttribute("disabled", "");
		}
	};

	// -> Cada que se actualize el valor en local estorage. Agregar o Eliminar
	handleStorageEvent() {
		if (this.btnInitReceipt && this.dataContainerStorage) {
			this.btnInitReceipt.removeAttribute("disabled");
		} else {
			this.btnInitReceipt.setAttribute("disabled", "");
		}
	}
}
