// Transferencia Manual
class InventoryTransfer extends IventoryManager {
	constructor({ formularioHTML, nameDataStorage, adjType }) {
		super({ formularioHTML, nameDataStorage, adjType });
		console.log("Class InventoryTransfer");
	}

	registrarDatos({ lineas }) {
		const data = {};

		// Contador para asignar claves numéricas únicas
		let contador = 0;

		// Procesar cada línea
		lineas.forEach((linea) => {
			const match = linea.match(/^(\d+-\d+-\d+)\s+(\S+)\s+(\S+)\s+(\S+)(?:\s+(\S+))?/);

			if (match) {
				const item = match[1] ?? null;
				const qty = Number(match[2]) ?? null;
				const fromLoc = match[3] ?? null;
				const toLoc = match[4] ?? null;
				const LP = match[5] ?? null;

				if (!item || !qty) return;

				// Agregar datos al objeto usando el contador como clave
				data[contador++] = { item, qty, fromLoc, toLoc, LP };
			}
		});

		// Limpiar el campo de texto

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

			// console.log('datos:', datos);

			// Obtener la primera fila del objeto datos
			const firstRow = data[rows[0]];

			if (!form1) {
				throw new Error("Formulario no encontrado [#form1]");
			}

			// Asignar valores al formulario
			const { item, company, quantity, QTYUM, RFLOGISTICSUNIT, fromLoc, toLoc } = form1;

			item.value = firstRow?.item;
			company.value = "FM";
			quantity.value = firstRow?.qty;
			QTYUM.value = "PZ (1,00)";
			fromLoc.value = firstRow?.fromLoc;
			toLoc.value = firstRow?.toLoc;

			if (firstRow?.LP) RFLOGISTICSUNIT.value = firstRow?.LP;

			delete data[rows[0]];

			this.saveDataToSessionStorage(data);
			this.submitFormData();
		} catch (error) {
			console.error("Error al insertar datos:", error.message);
		}
	}
}

const formularioHTMLTranfer = /*html*/ `
<form id="registroForm" class="registroForm adjustment">
<label for="dataToInsert">Item, Qty, From Ubicacion, To Ubicacion, LP:</label>
<textarea id="dataToInsert" name="dataToInsert" rows="4" cols="50" required placeholder="Item\t\t\tPiezas\tUbi. origen\tUbi. destino\tLP origen(Opcional)\n8264-10104-10618\t1pz\t1-25-02-AA-01\t1-25-02-AA-01\tFMA0002376952"></textarea>
  
  <div>
    <button id="pause" type="button"  tabindex="-1" pause-active="off">Pausa: off</button>
    <button id="insertData" type="submit">Registrar</button>
    <button id="cancel" type="button">Cancelar</button>
  </div>
</form>`;

window.addEventListener("load", async () => {
	const nameDataStorage = "datosToTranfer"; // Nombre del objeto en el almacenamiento local

	try {
		const iventoryManager = new InventoryTransfer({
			formularioHTML: formularioHTMLTranfer,
			nameDataStorage,
			adjType: "Transferencia Manual",
		});

		iventoryManager.render();
	} catch (error) {
		console.error("Error al cargar el componente InventoryTranfer:", error.message);
	}
});
