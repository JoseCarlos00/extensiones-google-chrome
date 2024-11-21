class Configuration {
	constructor() {
		this.autoComplete = true;
		this.confirmOk = false;
		this.confirmDelay = 500;
		this.selector = "menu-config";

		this.nameStorageContainer = "dataContainers";

		this.nameStorage = {
			autoComplete: "autoCompleteReceipt",
			confirmOk: "confirmOkReceipt",
			confirmDelay: "confirmDelayReceipt",
			initReceipt: "initReceipt",
		};

		this.dataContainerStorage = this.getSaveStorageData();
		this.trailerId = this.getTrailerId();
	}

	async init() {
		try {
			this.recoverSettingsStorage();
			await this.insertMenuConfiguration();
			this.setEventListener();
		} catch (error) {
			console.error("Ha ocurrio un error al inicializar el panel de Configuracion:", error);
		}
	}

	getSaveStorageData() {
		const saveData = LocalStorageHelper.get(this.nameStorageContainer);

		if (!saveData) {
			return {};
		}

		return saveData;
	}

	getTrailerId() {
		try {
			if (!this.dataContainerStorage) {
				return "No encontrado";
			}

			// Buscar el valor del trailerId
			const trailerId = this.dataContainerStorage?.[0]?.trailerId;

			return trailerId || "No encontrado";
		} catch (error) {
			console.error("Error al obtener el trailerId:", error.message, error);
			return "No encontrado";
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

	async insertMenuConfiguration() {
		const disabled = (property) => (property ? "" : "disabled");
		const checked = (property) => (property ? "checked" : "");

		const html = /*html*/ `
      <div>
        <nav class="menu-config">
            <header>
              <div class="contaier-icon">
                <svg class="icon-menu" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                    <path
                      d="M11.558 3.5a.75.75 0 0 1 .685.447l.443 1c.044.1.065.202.065.302a6.2 6.2 0 0 1 1.254.52a.751.751 0 0 1 .219-.151l.97-.443a.75.75 0 0 1 .843.151l.837.838a.75.75 0 0 1 .17.8l-.395 1.02a.748.748 0 0 1-.168.26c.218.398.393.818.52 1.255a.75.75 0 0 1 .261.048l1 .373a.75.75 0 0 1 .488.703v1.184a.75.75 0 0 1-.447.686l-1 .443a.748.748 0 0 1-.302.065a6.227 6.227 0 0 1-.52 1.254c.06.061.112.134.151.219l.444.97a.75.75 0 0 1-.152.843l-.838.837a.75.75 0 0 1-.8.17l-1.02-.395a.749.749 0 0 1-.26-.168a6.225 6.225 0 0 1-1.255.52a.75.75 0 0 1-.048.261l-.373 1a.75.75 0 0 1-.703.488h-1.184a.75.75 0 0 1-.686-.447l-.443-1a.748.748 0 0 1-.065-.302a6.226 6.226 0 0 1-1.254-.52a.752.752 0 0 1-.219.151l-.97.443a.75.75 0 0 1-.843-.151l-.837-.838a.75.75 0 0 1-.17-.8l.395-1.02a.75.75 0 0 1 .168-.26A6.224 6.224 0 0 1 4.999 13a.752.752 0 0 1-.261-.048l-1-.373a.75.75 0 0 1-.488-.703v-1.184a.75.75 0 0 1 .447-.686l1-.443a.748.748 0 0 1 .302-.065a6.2 6.2 0 0 1 .52-1.254a.75.75 0 0 1-.15-.219l-.444-.97a.75.75 0 0 1 .152-.843l.837-.837a.75.75 0 0 1 .801-.17l1.02.395c.102.04.189.097.26.168a6.224 6.224 0 0 1 1.254-.52a.75.75 0 0 1 .048-.261l.373-1a.75.75 0 0 1 .703-.488h1.185Z"
                      opacity=".2" />
                    <path
                      d="M8.232 11.768A2.493 2.493 0 0 0 10 12.5c.672 0 1.302-.267 1.768-.732A2.493 2.493 0 0 0 12.5 10c0-.672-.267-1.302-.732-1.768A2.493 2.493 0 0 0 10 7.5c-.672 0-1.302.267-1.768.732A2.493 2.493 0 0 0 7.5 10c0 .672.267 1.302.732 1.768Zm2.829-.707c-.28.28-.657.439-1.061.439c-.404 0-.78-.16-1.06-.44S8.5 10.405 8.5 10s.16-.78.44-1.06s.656-.44 1.06-.44s.78.16 1.06.44s.44.656.44 1.06s-.16.78-.44 1.06Z" />
                    <path
                      d="m14.216 3.773l-1.27.714a6.213 6.213 0 0 0-1.166-.48l-.47-1.414a.5.5 0 0 0-.474-.343H9.06a.5.5 0 0 0-.481.365l-.392 1.403a6.214 6.214 0 0 0-1.164.486L5.69 3.835a.5.5 0 0 0-.578.094L3.855 5.185a.5.5 0 0 0-.082.599l.714 1.27c-.199.37-.36.76-.48 1.166l-1.414.47a.5.5 0 0 0-.343.474v1.777a.5.5 0 0 0 .365.481l1.403.392c.122.405.285.794.486 1.164l-.669 1.333a.5.5 0 0 0 .094.578l1.256 1.256a.5.5 0 0 0 .599.082l1.27-.714c.37.199.76.36 1.166.48l.47 1.414a.5.5 0 0 0 .474.343h1.777a.5.5 0 0 0 .481-.365l.392-1.403a6.21 6.21 0 0 0 1.164-.486l1.333.669a.5.5 0 0 0 .578-.093l1.256-1.257a.5.5 0 0 0 .082-.599l-.714-1.27c.199-.37.36-.76.48-1.166l1.414-.47a.5.5 0 0 0 .343-.474V9.06a.5.5 0 0 0-.365-.481l-1.403-.392a6.208 6.208 0 0 0-.486-1.164l.669-1.333a.5.5 0 0 0-.093-.578l-1.257-1.256a.5.5 0 0 0-.599-.082Zm-1.024 1.724l1.184-.667l.733.733l-.627 1.25a.5.5 0 0 0 .019.482c.265.44.464.918.59 1.418a.5.5 0 0 0 .35.36l1.309.366v1.037l-1.327.44a.5.5 0 0 0-.328.354a5.216 5.216 0 0 1-.585 1.42a.5.5 0 0 0-.007.502l.667 1.184l-.733.733l-1.25-.627a.5.5 0 0 0-.482.019c-.44.265-.918.464-1.418.59a.5.5 0 0 0-.36.35l-.366 1.309H9.525l-.44-1.327a.5.5 0 0 0-.355-.328a5.217 5.217 0 0 1-1.42-.585a.5.5 0 0 0-.502-.007l-1.184.667l-.733-.733l.627-1.25a.5.5 0 0 0-.019-.482a5.216 5.216 0 0 1-.59-1.418a.5.5 0 0 0-.35-.36l-1.309-.366V9.525l1.327-.44a.5.5 0 0 0 .327-.355c.125-.5.323-.979.586-1.42a.5.5 0 0 0 .007-.502L4.83 5.624l.733-.733l1.25.627a.5.5 0 0 0 .482-.019c.44-.265.918-.464 1.418-.59a.5.5 0 0 0 .36-.35l.366-1.309h1.037l.44 1.327a.5.5 0 0 0 .354.327c.5.125.979.323 1.42.586a.5.5 0 0 0 .502.007Z" />
                  </g>
                </svg>
              </div>
              <h3 class="tittle-menu">
                <span>
                  Configuracion
                </span>
              </h3>
            </header>
            <ul>
              <form id="form-config">
								<li>
									<label class="switch input-container">
										<span class="tittle-label">Auto Completar</span>
										<input name="autoCompleteToggle"  type="checkbox"  ${checked(this.autoComplete)}>


										<span class="slider"></span>
									</label>
								</li>
								<li>
									<label class="switch input-container">
										<span class="tittle-label">Confirmar</span>
										<input name="confirmToggle" type="checkbox" ${checked(this.confirmOk)}>
										<span class="slider"></span>
									</label>
								</li>
								<li>
									<label class="input-number input-container">
										<span class="tittle-label">Tiempo</span>
										<input 
											name="confirmDelayInput" 
											type="number" 
											value="${parseFloat(this.confirmDelay / 1000)}"
											step="0.01" min="0.1" max="60" 
											${disabled(this.confirmOk)}>
										<span class="suffix">S</span>
									</label>
								</li>

									<div class="container-buttons">
										<button type="submit" class="btn submit">Guardar</button>
										<button id="reset-button" type="button" class="btn reset">Reestablecer</button>
									</div>
							</form>

							<form id="form-get-data">
								<label id="trailer-id-label">Trailer Id: ${this.trailerId}</label>
								<button id="init-receipt" ${
									this.trailerId && this.trailerId !== "No encontrado" ? "" : "disabled"
								} type="button" name="init-receipt">Iniciar Recibo</button>
								<button id="cancel-receipt"  type="button" name="cancel-receipt">Cancelar</button>
							</form>
            </ul>
        </nav>
      </div>
      `;

		const body = document.querySelector("body");

		if (body) {
			body.insertAdjacentHTML("beforeend", html);
		}
	}
}

// Crear una instancia de la clase y ejecutar la inicialización
window.addEventListener("load", () => {
	try {
		const inputHiddenReceiptPreference = Form1?.HIDDENRECPREF ?? "";

		if (inputHiddenReceiptPreference?.value !== "TRASLADOS") {
			throw new Error(`La preferencia de recibo actual: [${inputHiddenReceiptPreference?.value}]. No es [TRASLADOS]`);
		}

		const configurationManager = new Configuration();
		console.log(configurationManager);
		configurationManager.init();

		const receiptManager = new ReceitManagerRF({ configurationManager });
		console.log(receiptManager);
		receiptManager.init();
	} catch (error) {
		console.error("Error: no se pudo crear ReceitManagerRF", error.message);
	}
});
