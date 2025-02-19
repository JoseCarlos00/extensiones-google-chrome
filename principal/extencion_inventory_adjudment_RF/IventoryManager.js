class IventoryManager {
	constructor({ formularioHTML, nameDataStorage, adjType, currentAdjType }) {
		this.formularioHTML = formularioHTML;
		this.nameDataStorage = nameDataStorage;
		this.adjType = adjType;
		this.currentAdjType = currentAdjType;

		this.objectStorage = this.getContentFromSessionStorage();
		this.dataStorage = this.objectStorage?.data ?? [];

		this.delaySubmit = 800;
		this.nameDataStoragePause = nameDataStorage + "_puuse";
		this.pauseSubmmit = this.getValuePauseSubmit();

		this.form = null;
		this.textareaForm = null;

		this.actionButton = {
			pause: null,
			cancel: null,
			insertData: null,
		};

		this.timeoutId = null;

		if (this.adjType !== this.currentAdjType) {
			throw new Error(
				`El adjType actual:[${this.currentAdjType}] es diferente del adjType solicitado: ${this.adjType}`
			);
		}

		console.log("objectStorage:", this.objectStorage);
	}

	async render() {
		try {
			await this.renderCounters();
			await this.renderForm();

			await this.initializarElementosTheDOM();
			await this.setEventsListener();
			this.setPauseValuenInDOM();

			this.recoveryDataFromSessionStorage();
		} catch (error) {
			console.error("Error al renderizar el formulario:", error.message);
		}
	}

	renderForm() {
		return new Promise((resolve, reject) => {
			if (!this.formularioHTML) {
				reject("Formulario no encontrado");
				return;
			}

			document.body.insertAdjacentHTML("afterbegin", this.formularioHTML);

			setTimeout(resolve, 50);
		});
	}

	async renderCounters() {
		const contadores = `
      <div class="contadores-container">
        <p>
        	Restantes:<spam id="countRestante">${this.dataStorage?.length}</spam>
        </p>
      </div>
      `;

		document.body.insertAdjacentHTML("beforeend", contadores);
	}

	getValuePauseSubmit() {
		return sessionStorage.getItem(this.nameDataStoragePause) === "true";
	}

	async initializarElementosTheDOM() {
		this.form = document.querySelector("#registroForm");

		if (!this.form) throw new Error("Formulario no encontrado [#registroForm]");

		const { dataToInsert, pause, cancel, insertData } = this.form;

		this.textareaForm = dataToInsert;
		this.actionButton.pause = pause;
		this.actionButton.cancel = cancel;
		this.actionButton.insertData = insertData;

		if (!this.textareaForm) throw new Error("Textarea element no encontrado");
		if (!this.actionButton.pause) throw new Error("Boton de pausa no encontrado");
		if (!this.actionButton.cancel) throw new Error("Boton de cancelar no encontrado");
		if (!this.actionButton.insertData) throw new Error("Boton de insertar datos no encontrado");
	}

	async handleSumitEvent(e) {
		try {
			e.preventDefault();

			const { dataToInsert } = this.form;

			if (!dataToInsert) {
				throw new Error("No se encontró el campo de texto [name='dataToInsert']");
			}

			if (!dataToInsert?.value?.trim()) {
				return;
			}

			// Dividir el texto en líneas
			const lineas =
				dataToInsert?.value
					?.trim()
					?.split("\n")
					?.map((i) => i?.trim())
					?.filter(Boolean) ?? [];

			if (lineas.length === 0) {
				throw new Error("No hay líneas para insertar");
			}

			this.registrarDatos({ lineas });
		} catch (error) {
			console.error("Error al manejar el evento handleSumitEvent", error.message);
		}
	}

	async setEventsListener() {
		try {
			const { textareaForm, actionButton, form } = this;

			textareaForm.addEventListener("keydown", ({ key }) => key === "Enter" && (textareaForm.value += "\n"));

			form.addEventListener("submit", (e) => this.handleSumitEvent(e));

			actionButton.cancel.addEventListener("click", (e) => this.handleCancelInsertData(e));
			actionButton.pause.addEventListener("click", () => this.handlePauseInsertData());
		} catch (error) {
			console.error("Error al agregar eventos:", error.message);
		}
	}

	handlePauseInsertData() {
		this.pauseSubmmit = !this.pauseSubmmit;
		this.saveDataToSessionStorage(this.nameDataStoragePause, this.pauseSubmmit);

		this.setPauseValuenInDOM(pause);
	}

	handleCancelInsertData() {
		const timeDelayReload = 250;

		if (this.dataStorage?.length === 0) {
			return;
		}

		// Mostrar una alerta que permita al usuario cancelar la ejecución de la función
		const confirmacion = confirm(`¿Quieres cancelar?\nSe borraran los datos ingresados`);

		try {
			if (confirmacion) {
				// Si el usuario confirma, cancelar la ejecución de la función
				sessionStorage.removeItem(this.nameDataStorage);

				setTimeout(() => {
					window.location.reload();
				}, timeDelayReload);
			}
		} catch (error) {
			console.error("Error: al cancelar: ", error.message);
		}
	}

	setPauseValuenInDOM() {
		const value = this.pauseSubmmit ? "on" : "off";
		this.actionButton.pause.setAttribute("pause-active", value);
		this.actionButton.pause.innerHTML = `Pausa: ${value}`;
	}

	saveDataToSessionStorage(nameStorage, data) {
		sessionStorage.setItem(nameStorage, JSON.stringify(data));
	}

	getContentFromSessionStorage() {
		return JSON.parse(sessionStorage.getItem(this.nameDataStorage)) ?? {};
	}

	updateCounter(value) {
		const counterE = document.querySelector("#countRestante");

		if (counterE) {
			counterE.innerHTML = `${value ?? ""}`;
		} else {
			console.warn("No se encontro el elemento #countRestante");
		}
	}

	recoveryDataFromSessionStorage() {
		// Objeto para almacenar los datos
		const { dataStorage } = this;

		if (!dataStorage) {
			console.error("No se encontro el Objeto [datosStorage] en la sesión:");
			return;
		}

		if (dataStorage?.length === 0) {
			console.warn("No hay datos guardados en la sesión");
			return;
		}

		if (this.pauseSubmmit) {
			alert("Tiene activado la pausa, por favor desactivarla enviar formulario");
		}

		this.textareaForm.setAttribute("disabled", true);
		this.actionButton.insertData.setAttribute("disabled", true);

		console.log("Se encontraron datos guardados:", dataStorage?.length, dataStorage);

		this.updateCounter(dataStorage?.length);
		this.insertarDatos(this.objectStorage);
	}

	registrarDatos({ lineas }) {
		if (!Array.isArray(lineas) || lineas.length === 0) return;

		const data = lineas.map((linea) => this.parseLine(linea)).filter((entry) => entry !== null);

		if (data.length === 0) return;

		console.log("datos:", data);
		this.updateCounter(data.length);
		this.insertarDatos({ type: this.adjType, data });
	}

	// Insertar datos en el Formulario
	insertarDatos(dataStorage) {
		try {
			if (!dataStorage || !dataStorage.data || dataStorage.data.length === 0) return;
			console.log("insertarDatos", dataStorage);

			// Obtener la primera fila del Array
			const firstDataToInsert = dataStorage.data.shift() ?? null;

			if (!form1) {
				throw new Error("Formulario no encontrado [#form1]");
			}

			if (!firstDataToInsert) {
				throw new Error("No hay datos para insertar [firstDataToInsert]");
			}

			// Asignar valores al formulario
			this.assigneateValueInForm({ firstDataToInsert });

			this.saveDataToSessionStorage(this.nameDataStorage, dataStorage);
			this.submitFormData();
		} catch (error) {
			console.error("Error al insertar datos:", error.message);
		}
	}

	// Métodos abstractos que deben ser implementados en las clases hijas
	parseLine(linea) {
		throw new Error("Método parseLine() debe ser implementado en la subclase");
	}

	verifyFormInsertData() {
		throw new Error("verifyFormInsertData() no implementado");
	}

	verifyFormInsertData() {
		throw new Error("verifyFormInsertData() no implementado");
	}

	clearExistingTimeout() {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}
	}

	setTimeoutSubmitForm() {
		this.clearExistingTimeout();

		this.timeoutId = setTimeout(() => this.submitFormData, 1000);

		// Limpiar el timeout original después de 10 minutos
		setTimeout(() => {
			this.clearExistingTimeout();
			console.log("Timeout de 10 minutos alcanzado, timeout original limpiado.");
		}, 10 * 60 * 1000);
	}

	submitFormData() {
		if (this.pauseSubmmit) {
			console.warn("El envio de datos se encuentra en pausa");
			return;
		}

		const dataInsertOk = this.verifyFormInsertData();

		if (!dataInsertOk) {
			console.warn(" No se pudo insertar los datos");
			return;
		}

		const btnSubmit = document.querySelector("#submit1");

		if (!btnSubmit) {
			console.error("No se encontró el botón de submit");
			return;
		}

		setTimeout(() => {
			// btnSubmit.click();
			console.log("click en OK");

			this.setTimeoutSubmitForm();
		}, this.delaySubmit);
	}
}
