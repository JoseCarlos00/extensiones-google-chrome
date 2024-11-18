// Transferencia Manual LP
class InventoryTransferLP extends IventoryManager {
	constructor({ formularioHTML, nameDataStorage, adjType }) {
		super({ formularioHTML, nameDataStorage, adjType });
		console.log("Class InventoryTransfer LP");
	}

	registrarDatos({ lineas }) {
		const data = {};

		// Contador para asignar claves numéricas únicas
		let contador = 0;

		// Procesar cada línea
		lineas.forEach((linea) => {
			const match = linea.match(/^(\S+)\s+(\S+)(?:\s+(\S+))?/);

			if (match) {
				const LPOrigen = match[1] ?? null;
				const toLoc = match[2] ?? null;
				const LPDestino = match[3] ?? null;

				if (!LPOrigen || !LPOrigen) return;

				// Agregar datos al objeto usando el contador como clave
				data[contador++] = { LPOrigen, toLoc, LPDestino };
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

			// Obtener la primera fila del objeto datos
			const firstRow = data[rows[0]];

			if (!form1) {
				throw new Error("Formulario no encontrado [#form1]");
			}

			// Asignar valores al formulario
			const { RFLOGISTICSUNIT, toLoc } = form1;

			if (RFLOGISTICSUNIT && firstRow?.LPOrigen) {
				RFLOGISTICSUNIT.value = firstRow?.LPOrigen;
				console.log("RFLOGISTICSUNIT", RFLOGISTICSUNIT);
				console.log("RFLOGISTICSUNIT TO:", firstRow?.LPOrigen);
			}

			if (toLoc && firstRow?.toLoc) {
				toLoc.value = firstRow?.toLoc;
				console.log("toLoc", toLoc);
				console.log("toLoc TO:", firstRow?.toLoc);
			}

			this.saveDataToSessionStorage(data);
			this.submitFormData(() => {
				delete data[rows[0]];
				this.saveDataToSessionStorage(data);
			});
		} catch (error) {
			console.error("Error al insertar datos:", error.message);
		}
	}
}

const formularioHTMLTranferLP = /*html*/ `
<form id="registroForm" class="registroForm adjustment">
<label for="dataToInsert">Item, To Ubicacion, LP:</label>
<textarea id="dataToInsert" name="dataToInsert" rows="4" cols="50" required placeholder="LP Origen\tUbi. destino\tLP destino(Opcional)\nFMA-ORIGEN\t1-25-02-AA-01\tFMA-DESTINO"></textarea>
  
  <div>
    <button id="pause" type="button"  tabindex="-1" pause-active="off">Pausa: off</button>
    <button id="insertData" type="submit">Registrar</button>
    <button id="cancel" type="button">Cancelar</button>
  </div>
</form>`;

window.addEventListener("load", async () => {
	const nameDataStorage = "datosToTranferLP"; // Nombre del objeto en el almacenamiento local

	try {
		const iventoryManager = new InventoryTransferLP({
			formularioHTML: formularioHTMLTranferLP,
			nameDataStorage,
			adjType: "Transferencia Manual LP",
		});

		iventoryManager.render();
	} catch (error) {
		console.error("Error al cargar el componente InventoryTranferLP:", error.message);
	}
});
