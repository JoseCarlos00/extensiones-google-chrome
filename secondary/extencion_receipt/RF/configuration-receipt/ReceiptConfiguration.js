class Configuration {
	constructor({ autoComplete, confirmDelay, confirmOk, receiptType }) {
		this.autoComplete = autoComplete;
		this.confirmOk = confirmOk;
		this.confirmDelay = confirmDelay;

		this.nameStorageContainer = nameStorageContainer;

		this.nameStorage = {
			autoComplete: "autoCompleteReceipt",
			confirmOk: "confirmOkReceipt",
			confirmDelay: "confirmDelayReceipt",
			initReceipt: "initReceipt",
		};

		this.dataStorage = LocalStorageHelper.get(this.nameStorageContainer);
		this.dataContainerStorage = dataStorage?.dataContainer;
		this.trailerId = dataStorage?.trailerId || "No encontrado";

		this.renderConfiguration = new RenderConfiguration({
			autoComplete: this.autoComplete,
			confirmOk: this.confirmOk,
			receiptType,
			trailerId: this.trailerId,
		});
	}

	async initialize() {
		try {
			await this.renderConfiguration.render();
			// this.recoverSettingsStorage();
			// this.setEventListener();
		} catch (error) {
			console.error("Ha ocurrio un error al inicializar el panel de Configuracion:", error);
		}
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

	// Configurar eventos para guardar cambios en localStorage
	handleInputEvents = (e) => {
		e.preventDefault();

		const { autoCompleteToggle, confirmToggle, confirmDelayInput } = e.target;

		this.autoComplete = autoCompleteToggle.checked;
		localStorage.setItem(this.nameStorage.autoComplete, JSON.stringify(this.autoComplete));

		this.confirmOk = confirmToggle.checked;
		// Guardar confirmOk y la hora de activación
		localStorage.setItem(
			this.nameStorage.confirmOk,
			JSON.stringify({
				value: this.confirmOk,
				timestamp: Date.now(), // Guarda la marca de tiempo actual
			})
		);

		this.confirmDelay = parseFloat(confirmDelayInput.value);
		localStorage.setItem(this.nameStorage.confirmDelay, this.confirmDelay * 1000);
	};

	handleStorageEvent() {
		const trailerIdLabel = document.getElementById("trailer-id-label");
		const btnInitReceipt = document.getElementById("init-receipt");
		const btnCancelReceipt = document.getElementById("cancel-receipt");

		const verifyTrailerId = () => {
			this.dataContainerStorage = this.getSaveStorageData();
			this.trailerId = this.getTrailerId();
			trailerIdLabel.innerHTML = `Trailer Id: ${this.trailerId}`;
			console.log("trailerId:", this.trailerId);

			if (this.trailerId && this.trailerId !== "No encontrado") {
				btnInitReceipt?.removeAttribute("disabled");
			} else {
				btnInitReceipt?.setAttribute("disabled", "");
			}
		};

		window.addEventListener("storage", ({ key, newValue }) => {
			if (key === this.nameStorageContainer) {
				verifyTrailerId();
			}
		});

		if (btnCancelReceipt) {
			btnCancelReceipt.addEventListener("click", () => {
				console.log("Se elimino:", this.nameStorage.initReceipt);
				sessionStorage.removeItem(this.nameStorage.initReceipt);
				LocalStorageHelper.remove(this.nameStorageContainer);
				verifyTrailerId();
			});
		} else {
			console.error("No se encontró el elemento btnCancelReceipt");
		}
	}

	setEventListener() {
		const form = document.getElementById("form-config");
		this.handleStorageEvent();

		if (!form) return;
		form.addEventListener("submit", this.handleInputEvents);

		const { confirmToggle, confirmDelayInput, autoCompleteToggle } = form;

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

		const resetButton = document.getElementById("reset-button");
		if (!resetButton) return;

		resetButton.addEventListener("click", () => {
			const { autoCompleteToggle, confirmToggle, confirmDelayInput } = form;

			const settings = {
				autocomplete: true,
				confirmOk: false,
				confirmDelay: 500,
			};

			this.autoComplete = settings.autocomplete;
			localStorage.setItem(this.nameStorage.autoComplete, JSON.stringify(this.autoComplete));

			this.confirmOk = settings.confirmOk;
			localStorage.setItem(this.nameStorage.confirmOk, JSON.stringify(this.confirmOk));

			this.confirmDelay = 0.5;
			localStorage.setItem(this.nameStorage.confirmDelay, 500);

			autoCompleteToggle.checked = true;
			confirmToggle.checked = false;
			confirmDelayInput.value = 0.5;
			confirmDelayInput.disabled = true;
		});
	}
}
