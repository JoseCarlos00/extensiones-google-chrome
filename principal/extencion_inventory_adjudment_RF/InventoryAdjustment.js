// Ajuste Positivo
class InventoryAdjustment extends IventoryManager {
	constructor({ formularioHTML, nameDataStorage }) {
		console.log("Class InventoryAdjustment");
		super({ formularioHTML, nameDataStorage });
	}

	registrarDatos({ lineas }) {
		const datos = {};

		// Contador para asignar claves numéricas únicas
		let contador = 0;

		// Procesar cada línea
		lineas.forEach((linea) => {
			const match = linea.match(/^(\d+-\d+-\d+)\s+(\S+)\s+(\S+)(?:\s+([^\W_]+))?/);
			if (match) {
				const item = match[1] ?? null;
				const qty = Number(match[2]) ?? null;
				const ubicacion = match[3] ?? null;
				const LP = match[4] ?? null;

				if (!item || !qty || !ubicacion) return;

				// Agregar datos al objeto usando el contador como clave
				datos[contador++] = { item, qty, ubicacion, LP };
			}
		});

		// Insertar datos
		console.log("datos:", datos);
		// insertarDatos(datos);
	}

	insertarDatos({ datos }) {
		// Obtener las claves (números de artículo) del objeto datos
		const filas = Object.keys(datos);
		contador(filas.length);
		// Verificar si hay datos para procesar
		if (filas.length === 0) {
			console.log("No hay datos para insertar.");
			return;
		}

		// console.log('datos:', datos);

		// Obtener la primera fila del objeto datos
		const primerFila = datos[filas[0]];
		// console.log('primerFila:', primerFila);
		// Asignar valores al formulario
		form1.item.value = primerFila.item;
		form1.company.value = "FM";
		form1.quantity.value = primerFila.qty;
		form1.location.value = primerFila.ubicacion;
		if (primerFila.LP) form1.RFLOGISTICSUNIT.value = primerFila.LP;

		// Simular una operación asincrónica, por ejemplo, un temporizador
		delete datos[filas[0]];

		setTimeout(() => {
			console.log("insertarDatos completado exitosamente");

			if (condition) {
			}

			if (chrome.storage) {
				chrome.storage.local.set({ datosAdjustment: datos }, () => {
					console.log("Datos guardados en el almacenamiento local.");
				});

				chrome.storage.local.set({ pauseChrome: pause }, () => {
					console.log("Pause Set1:", pause);
				});
			} else {
				console.error("chrome.storage no está disponible.");
			}

			console.log("pauseActive:", pause);
			if (pause) {
				document.querySelector("#submit1").click();
			}
		}, 1500);
	}
}

const formularioHTML = /*html*/ `
<form id="registroForm" class="registroForm adjustment">
  <label for="dataToInsert">Item, Qty y Ubicacion:</label>
  <textarea  id="dataToInsert" name="dataToInsert" class="textarea" rows="4" cols="50" required placeholder="Item\t\t\tPiezas\tUbicacion\tLP(Opcional)\n8264-10104-10618\t1pz\t1-25-02-AA-01\tFMA0002376952"></textarea>
  
  <div>
    <button id="pause" type="button"  tabindex="-1">Pausar</button>
    <button id="insertData" type="submit">Registrar</button>
    <button id="cancel" type="button">Cancelar</button>
  </div>
</form>`;

window.addEventListener("load", async () => {
	const nameDataStorage = "datosAdjustment"; // Nombre del objeto en el almacenamiento local

	try {
		const iventoryManager = new InventoryAdjustment({ formularioHTML, nameDataStorage });
		iventoryManager.render();
	} catch (error) {
		console.error("Error al cargar el componente InventoryAdjustment:", error);
	}
});

function content() {
	// Objeto para almacenar los datos

	// Verificar si hay datos almacenados al cargar la página
	if (chrome.storage) {
		// Tu código que utiliza chrome.storage aquí
		chrome.storage.local.get("datosAdjustment", (result) => {
			const datosAdjustment = result.datosAdjustment;

			if (datosAdjustment) {
				const datosAdjustmentNum = Object.keys(datosAdjustment).length;

				if (datosAdjustmentNum > 0) {
					document.querySelector("#ubicaciones").setAttribute("disabled", true);
					document.querySelector("#registraUbicaciones").setAttribute("disabled", true);

					console.log("Se encontraron datos guardados:", datosAdjustmentNum, datosAdjustment);

					contador(datosAdjustmentNum);
					insertarDatos(datosAdjustment);
				}
			} else {
				console.log("No se encontraron datos guardados.");
			}
		});
	} else {
		console.error("chrome.storage no está disponible.");
	}
}
