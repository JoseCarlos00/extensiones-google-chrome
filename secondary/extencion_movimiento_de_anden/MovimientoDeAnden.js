class MovimientoDeAnden extends IventoryManager {
	constructor({ formularioHTML, nameDataStorage, adjType }) {
		super({ formularioHTML, nameDataStorage, adjType });
		console.log("Class MovimientoDeAnden");
	}

	registrarDatos({ lineas }) {
		const data = [];

		// Contador para asignar claves numéricas únicas
		let contador = 0;

		// Procesar cada línea
		lineas.forEach((linea) => {
			const match = linea.match(/([^\W_]+)/);
			if (match) {
				const LP = match[1] ?? "";
				if (!LP) return;

				// Agregar datos al objeto usando el contador como clave
				if (!data.includes(LP)) {
					data.push(LP);
				}
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
			this.updateCounter(data.length);

			// Verificar si hay datos para procesar
			if (data.length === 0) {
				console.log("No hay datos para insertar.");
				return;
			}

			if (!form1) {
				throw new Error("Formulario no encontrado [#form1]");
			}

			// Asignar valores al formulario
			const { workUnitNum } = form1;

			if (!workUnitNum) {
				throw new Error("No se encontró el campo 'workUnitNum' en el formulario");
			}

			// Obtener la primera fila del objeto datos
			const firstRow = data.shift();

			workUnitNum.value = firstRow;

			this.saveDataToSessionStorage(data);
			this.submitFormData();
		} catch (error) {
			console.error("Error al insertar datos:", error.message);
		}
	}
}

const formularioHTMLMovimientoDeAnden = /*html*/ `
<form id="registroForm" class="registroForm adjustment">
  <label for="dataToInsert">Movimientos De Anden</label>
  <textarea  id="dataToInsert" name="dataToInsert" class="textarea" rows="4" cols="50" required placeholder="Container\nFMA0002376952"></textarea>
  
  <div>
    <button id="pause" type="button"  tabindex="-1" pause-active="off">Pausa: off</button>
    <button id="insertData" type="submit">Registrar</button>
    <button id="cancel" type="button">Cancelar</button>
  </div>
</form>`;

window.addEventListener("load", async () => {
	const nameDataStorage = "datosMovimientoDeAnden"; // Nombre del objeto en el almacenamiento local

	try {
		const moveAndenManager = new MovimientoDeAnden({
			formularioHTML: formularioHTMLMovimientoDeAnden,
			nameDataStorage,
			adjType: "Movimiento de Anden",
		});

		moveAndenManager.render();
	} catch (error) {
		console.error("Error al cargar el componente MovimientoDeAnden:", error.message);
	}
});
