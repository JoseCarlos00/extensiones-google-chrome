// Ajuste Positivo
class InventoryAdjustment extends IventoryManager {
	constructor({ formularioHTML, nameDataStorage, adjType }) {
		console.log("Class InventoryAdjustment");
		super({ formularioHTML, nameDataStorage, adjType });
	}

	registrarDatos({ lineas }) {
		const data = {};

		// Contador para asignar claves numéricas únicas
		let contador = 0;

		// Procesar cada línea
		lineas.forEach((linea) => {
			const match = linea.match(/^(\d+-\d+-\d+)\s+(\S+)\s+(\S+)(?:\s+([^\W_]+))?/);
			if (match) {
				const item = match[1] ?? "";
				const qty = Number(match[2]) ?? "";
				const ubicacion = match[3] ?? "";
				const LP = match[4] ?? "";

				if (!item || !qty || !ubicacion) return;

				// Agregar datos al objeto usando el contador como clave
				data[contador++] = { item, qty, ubicacion, LP };
			}
		});

		// Insertar datos
		console.log("datos:", data);
		this.insertarDatos({ data });
	}

	// Insertar datos en el Formulario
	insertarDatos({ data }) {
		try {
			// Obtener las claves (números de artículo) del objeto datos
			const rows = Object.keys(data);
			this.updateCounter(rows.length);

			// Verificar si hay datos para procesar
			if (rows.length === 0) {
				console.log("No hay datos para insertar.");
				return;
			}

			// Obtener la primera fila del objeto datos
			const firstRow = data[rows[0]];

			if (!form1) {
				throw new Error("Formulario no encontrado [#form1]");
			}

			// Asignar valores al formulario
			const { item, company, quantity, location, RFLOGISTICSUNIT } = form1;

			item.value = firstRow?.item;
			company.value = "FM";
			quantity.value = firstRow?.qty;
			location.value = firstRow?.ubicacion;
			if (firstRow?.LP) RFLOGISTICSUNIT.value = firstRow?.LP;

			delete data[rows[0]];

			this.saveDataToSessionStorage(data);
			this.submitFormData();
		} catch (error) {
			console.error("Error al insertar datos:", error.message);
		}
	}
}

const formularioHTMLAdjustment = /*html*/ `
<form id="registroForm" class="registroForm adjustment">
  <label for="dataToInsert">Item, Qty y Ubicacion:</label>
  <textarea  id="dataToInsert" name="dataToInsert" class="textarea" rows="4" cols="50" required placeholder="Item\t\t\tPiezas\tUbicacion\tLP(Opcional)\n8264-10104-10618\t1pz\t1-25-02-AA-01\tFMA0002376952"></textarea>
  
  <div>
    <button id="pause" type="button"  tabindex="-1">Pausa: off</button>
    <button id="insertData" type="submit">Registrar</button>
    <button id="cancel" type="button">Cancelar</button>
  </div>
</form>`;

window.addEventListener("load", async () => {
	const nameDataStorage = "datosAdjustment"; // Nombre del objeto en el almacenamiento local

	try {
		const iventoryManager = new InventoryAdjustment({
			formularioHTML: formularioHTMLAdjustment,
			nameDataStorage,
			adjType: "Ajuste Positivo",
		});

		iventoryManager.render();
	} catch (error) {
		console.error("Error al cargar el componente InventoryAdjustment:", error.message);
	}
});
