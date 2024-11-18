class IventoryManager {
	constructor({ formularioHTML, nameDataStorage = "dataContentRf", adjType = "empty" }) {
		this.type = form1?.adjType?.value ?? "";
		this.formularioHTML = formularioHTML;

		this.nameDataStorage = nameDataStorage;
		this.datosStorage = this.getContentFromSessionStorage() ?? {};
		this.datosStorageLength = Object.keys(this.datosStorage).length;

		this.delaySubmit = 800;
		this.adjType = adjType;
		this.currentAdjType = form1.adjType?.value ?? "";
		this.nameDataStoragePause = nameDataStorage + "_puuse";
		this.pauseSubmmit = this.getValuePauseSubmit();

		if (this.adjType !== this.currentAdjType) {
			throw new Error(
				`El adjType actual:[${this.currentAdjType}] es diferente del adjType solicitado: ${this.adjType}`
			);
		}

		console.log("this.datosStorage:", this.datosStorage);
		console.log("this.datosStorageLength:", this.datosStorageLength);
	}

	async render() {
		try {
			await this.renderCounters();
			await this.renderForm();
			await this.setEventsListener();
			this.recoveryDataFromSessionStorage();
		} catch (error) {
			console.error("Error al renderizar el formulario:", error.message);
		}
	}

	async renderForm() {
		if (!this.formularioHTML) {
			throw new Error("Formulario no encontrado");
		}

		document.body.insertAdjacentHTML("afterbegin", this.formularioHTML);
	}

	async renderCounters() {
		const contadores = `
      <div class="contadores-container">
        <p>
        Restantes:<spam id="countRestante">${this.datosStorageLength}</spam>
        </p>
      </div>
      `;

		document.body.insertAdjacentHTML("beforeend", contadores);
	}

	getValuePauseSubmit() {
		return sessionStorage.getItem(this.nameDataStoragePause) === "true";
	}

	async setEventsListener() {
		try {
			const form = document.querySelector("#registroForm");

			if (!form) {
				throw new Error("Formulario no encontrado. #registroForm");
			}

			const { pause, cancel } = form;

			const handleSumitEvent = async (e) => {
				try {
					e.preventDefault();

					const { dataToInsert } = form;
					console.log("dataToInsert:", dataToInsert?.value);

					if (!dataToInsert) {
						throw new Error("No se encontró el campo de texto [name='dataToInsert']");
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
			};

			form.addEventListener("submit", handleSumitEvent);

			cancel?.addEventListener("click", (e) => this.handleCancelInsertData(e));

			if (pause) {
				pause.addEventListener("click", () => this.handlePauseInsertData(pause));
				this.setPauseValuenInDOM(pause);
			}
		} catch (error) {
			console.error("Error al agregar eventos:", error.message);
		}
	}

	handlePauseInsertData(pause) {
		if (!pause) {
			console.error('No se encontró el elemento [name="pause"]');
			return;
		}

		const newPasueValue = !this.pauseSubmmit;

		sessionStorage.setItem(this.nameDataStoragePause, String(newPasueValue));
		this.pauseSubmmit = newPasueValue;

		this.setPauseValuenInDOM(pause);
	}

	handleCancelInsertData() {
		const timeDelayReload = 250;

		if (Object.keys(this.datosStorage).length <= 0) {
			alert("No hay datos para cancelar");
			return;
		}

		// Mostrar una alerta que permita al usuario cancelar la ejecución de la función
		const confirmacion = confirm(`¿Quieres cancelar?\nSe borraran los datos ingresados`);

		try {
			if (confirmacion) {
				// Si el usuario confirma, cancelar la ejecución de la función
				this.deleteDataFromSessionStorage();

				setTimeout(() => {
					window.location.reload();
				}, timeDelayReload);
			}
		} catch (error) {
			console.error("Error: al cancelar: ", error.message);
		}
	}

	setPauseValuenInDOM(pause) {
		const pauseSubmmit = this.pauseSubmmit ? "on" : "off";
		pause.setAttribute("pause-active", pauseSubmmit);
		pause.innerHTML = `Pausa: ${pauseSubmmit}`;
	}

	saveDataToSessionStorage(data) {
		sessionStorage.setItem(this.nameDataStorage, JSON.stringify(data));
	}

	getContentFromSessionStorage() {
		return JSON.parse(sessionStorage.getItem(this.nameDataStorage)) ?? {};
	}

	deleteDataFromSessionStorage() {
		sessionStorage.removeItem(this.nameDataStorage);
	}

	registrarDatos() {
		throw new Error("registrarDatos() No implementado");
	}

	insertarDatos({ data }) {
		throw new Error("insertarDatos() no implementado");
	}

	updateCounter(value) {
		const countRestante = document.querySelector("#countRestante");
		if (countRestante) {
			countRestante.innerHTML = `${value}`;
		} else {
			console.warn("No se encontro el elemento #countRestante");
		}
	}

	recoveryDataFromSessionStorage() {
		// Objeto para almacenar los datos
		const { datosStorage } = this;

		if (!datosStorage) {
			console.error("No se encontro el Objeto [datosStorage] en la sesión:");
			return;
		}

		const dataStorageLenght = Object.keys(datosStorage).length;

		if (dataStorageLenght <= 0) {
			console.warn("No hay datos guardados en la sesión");
			return;
		}

		if (this.pauseSubmmit) {
			alert("Tiene activado la pausa, por favor desactivarla enviar formulario");
		}

		document.querySelector("#dataToInsert")?.setAttribute("disabled", true);
		document.querySelector("#insertData")?.setAttribute("disabled", true);

		console.log("Se encontraron datos guardados:", dataStorageLenght, datosStorage);

		this.updateCounter(dataStorageLenght);
		this.insertarDatos({ data: datosStorage });
	}

	submitFormData() {
		if (this.pauseSubmmit) {
			console.warn("El envio de datos se encuentra en pausa");
			return;
		}

		setTimeout(() => {
			console.log("insertarDatos completado exitosamente");

			const btnSubmit = document.querySelector("#submit1");

			if (btnSubmit) {
				btnSubmit.click();
			} else {
				console.log("No se encontró el botón de #submit1");
			}
		}, this.delaySubmit);
	}
}
