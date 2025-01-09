class GetDataDevolucionesForm {
	constructor({ nameDataStorage = "dataContentRf" }) {
		this.formularioHTML = formularioHTMLReceiptDevoluciones;

		this.nameDataStorage = nameDataStorage;

		this.nameDataStoragePause = nameDataStorage + "_puuse";
		this.pauseSubmmit = this.getValuePauseSubmit();
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
		return JSON.parse(sessionStorage.getItem(this.nameDataStorage)) ?? [];
	}

	deleteDataFromSessionStorage() {
		sessionStorage.removeItem(this.nameDataStorage);
	}

	registrarDatos({ lineas }) {
		const data = [];

		// Crear un objeto para agrupar por receiptID
		const groupedContainers = {};

		// Procesar cada línea
		lineas.forEach((linea) => {
			const match = linea.match(/(\d+-TR-\d{3}-\d+)\s+([^\W_]+)/);

			if (match) {
				const receiptId = match[1] ?? "";
				const LP = match[2] ?? "";

				// Verificar si receiptID ya está en el objeto
				if (!groupedContainers[receiptId]) {
					groupedContainers[receiptId] = [];
				}

				// Agregar el LP al array correspondiente
				groupedContainers[receiptId].push(LP);
			}
		});

		// Transformar groupedContainers en un array
		for (const receiptId in groupedContainers) {
			if (Object.hasOwnProperty.call(groupedContainers, receiptId)) {
				data.push({
					receiptId,
					containers: groupedContainers[receiptId],
				});
			}
		}

		// Agregar "DONE" al final de cada array LP
		data.forEach((item) => {
			item.containers.push("DONE");
		});

		// Insertar datos
		console.log("datos:", data);
		console.log("groupedContainers:", groupedContainers);

		console.log("Datos guardados:", data);
		LocalStorageHelper.save(this.nameDataStorage, data);
	}

	insertarDatos({ data }) {
		throw new Error("insertarDatos() no implementado");
	}

	updateCounter(value) {
		const countRestante = document.querySelector("#countRestante");
		if (countRestante) {
			countRestante.innerHTML = `${value ?? "Error"}`;
		} else {
			console.warn("No se encontro el elemento #countRestante");
		}
	}
}

const formularioHTMLReceiptDevoluciones = /*html*/ `
<form id="registroForm" class="registroForm adjustment">
  <label for="dataToInsert">Recibo Devoluciones</label>
  <textarea  id="dataToInsert" name="dataToInsert" class="textarea" rows="4" cols="50" required placeholder="Receipt ID\t\tContainer\n357-TR-111-12119\tFMA0002376952"></textarea>
  
  <div>
    <button id="initRecDev" type="button"  tabindex="-1">Iniciar</button>
    <button id="pause" type="button"  tabindex="-1" pause-active="off">Pausa: off</button>
    <button id="insertData" type="submit">Registrar</button>
    <button id="cancel" type="button">Cancelar</button>
  </div>
</form>`;
