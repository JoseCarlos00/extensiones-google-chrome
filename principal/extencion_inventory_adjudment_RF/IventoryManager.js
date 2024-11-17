class IventoryManager {
	constructor({ formularioHTML, nameDataStorage = "dataContentRf" }) {
		this.type = form1?.adjType?.value ?? "";
		this.formularioHTML = formularioHTML;

		this.nameDataStorage = nameDataStorage;
		this.datosStorage = this.getContentFromSessionStorage();
		this.datosStorageLength = Object.keys(this.datosStorage).length;

		console.log("this.datosStorage:", this.datosStorage);
		console.log("this.datosStorageLength:", this.datosStorageLength);
	}

	async render() {
		try {
			await this.renderCounters();
			await this.renderForm();
			await this.setEventsListener();
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
						dataToInsert
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

			cancel.addEventListener("click", (e) => this.handleCancelInsertData(e));
		} catch (error) {
			console.error("Error al agregar eventos:", error.message);
		}
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

	insertarDatos(datos) {
		throw new Error("insertarDatos() no implementado");
	}

	handleCancelInsertData() {
		const timeDelayReload = 250;
		// Mostrar una alerta que permita al usuario cancelar la ejecución de la función
		const confirmacion = confirm("¿Quieres cancelar?NSe borraran los datos ingresados");

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

	updateCounter(value) {
		const countRestante = document.querySelector("#countRestante");
		if (countRestante) {
			countRestante.innerHTML = `${value}`;
		} else {
			console.warn("No se encontro el elemento #countRestante");
		}
	}
}
