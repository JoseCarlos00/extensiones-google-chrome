class GetDataDevolucionesForm {
	constructor() {
		try {
			this.formularioHTML = formularioHTMLReceiptDevoluciones;

			this.nameDataStorage = nameStorageContainer;
			this.eventStorgageChange = eventNameStorgageChange ?? "storageChange";

			this.receiptType = "DEVOLUCIONES";
		} catch (error) {
			console.error("Error al inicializar la clase GetDataDevolucionesForm", error);
		}
	}

	async render() {
		try {
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

	async setEventsListener() {
		try {
			const form = document.querySelector("#registroForm");
			const textareaForm = document.querySelector("#dataToInsert");

			textareaForm?.addEventListener("keydown", ({ key }) => key === "Enter" && (textareaForm.value += "\n"));

			if (!form) {
				throw new Error("Formulario no encontrado. #registroForm");
			}

			form.addEventListener("submit", () => this.handleSumitEvent);
		} catch (error) {
			console.error("Error al agregar eventos:", error.message);
		}
	}

	getValuePauseSubmit() {
		return sessionStorage.getItem(this.nameDataStoragePause) === "true";
	}

	registrarDatos({ lineas }) {
		const groupedMap = new Map();

		// Procesar cada línea
		lineas.forEach((linea) => {
			const match = linea.match(/(\d+-TR-\d{3}-\d+)\s+([^\W_]+)/);

			if (match) {
				const receiptId = match[1];
				const LP = match[2];

				if (!receiptId || !LP) return; // Si no hay datos, no hacer nada

				if (!groupedMap.has(receiptId)) {
					groupedMap.set(receiptId, []);
				}

				groupedMap.get(receiptId).push(LP);
			}
		});

		const data = Array.from(groupedMap, ([receiptId, containers]) => ({
			receiptId,
			containers: [...containers, "DONE"],
		}));

		console.log("Datos guardados:", data);
		LocalStorageHelper.save(this.nameDataStorage, { receiptType: this.receiptType, dataContainer: data });
		this.updateCounter(data.length);
		this.alertDataSaved();

		const eventStorgageChange = new Event(this.eventStorgageChange);
		window.dispatchEvent(eventStorgageChange);
	}

	async handleSumitEvent(e) {
		try {
			e.preventDefault();

			const { dataToInsert } = form;

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

			dataToInsert.value = "";
			this.registrarDatos({ lineas });
		} catch (error) {
			console.error("Error al manejar el evento handleSumitEvent", error.message);
		}
	}

	alertDataSaved() {
		ToastAlertRF.showAlertMinBotton("Datos guardados", "success");
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
    <button id="insertData" type="submit">Registrar</button>
  </div>
</form>`;
