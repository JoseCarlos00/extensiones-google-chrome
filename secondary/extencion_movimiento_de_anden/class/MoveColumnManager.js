/**
 * Clase que permite mover columnas en una tabla HTML mediante drag-and-drop.
 */
class MoveColumnManager {
	/**
	 * Constructor de la clase MoveColumns.
	 * @param {Object} params - Parámetros para la configuración de la clase.
	 * @param {HTMLElement} params.table - Elemento de tabla HTML donde se habilitará el movimiento de columnas.
	 */
	constructor({ table = null }) {
		this.table = table;
		this.thead = this.table?.querySelector("thead");

		this.nameStorageConfigurationModal = nameStorageConfigurationModal;
		this.initEvents();
	}

	/**
	 * Inicializa los eventos necesarios para el movimiento de columnas.
	 */
	initEvents() {
		try {
			if (!this.thead) throw new Error("No se encontro el elemento <thead>");

			this.setEventsDragAndDrog();
		} catch (error) {
			console.error("[MoveColumns] Error:", error?.message, error);
		}
	}

	/**
	 * Configura los eventos de drag-and-drop para las celdas de encabezado de la tabla.
	 */
	setEventsDragAndDrog() {
		this.table.querySelectorAll("th").forEach((th, index) => {
			th.draggable = true;
			th.dataset.dragColumnIndex = index;

			th.addEventListener("dragstart", (event) => this.handleDragStart({ event }));
			th.addEventListener("dragover", (event) => this.handleDragOver({ event }));
			th.addEventListener("drop", (event) => this.handleDrog({ event }));
		});
	}

	/**
	 * Maneja el evento de inicio de arrastre.
	 * @param {Object} param - Objeto que contiene el evento.
	 * @param {Event} param.event - Evento que se está manejando.
	 */
	handleDragStart({ event }) {
		const columnIndex = event.target.dataset.dragColumnIndex;

		if (columnIndex === undefined) {
			console.error("El índice de columna no está definido.");
			return;
		}

		event.dataTransfer.setData("text/plain", columnIndex);
	}

	/**
	 * Maneja el evento de arrastre sobre otra celda.
	 * @param {Object} param - Objeto que contiene el evento.
	 * @param {Event} param.event - Evento que se está manejando.
	 */
	handleDragOver({ event }) {
		event.preventDefault(); // Permite soltar
	}

	/**
	 * Maneja el evento de soltar una celda.
	 * @param {Object} param - Objeto que contiene el evento.
	 * @param {Event} param.event - Evento que se está manejando.
	 */
	handleDrog({ event }) {
		event.preventDefault();
		const fromIndexColumn = event.dataTransfer.getData("text/plain"); // Obtiene el índice de la columna arrastrada.
		const toIndexColumn = this.getToIndexColumn(event);

		if (toIndexColumn === undefined) {
			console.warn("No se pudo determinar el índice de la columna de destino.");
			return;
		}

		if (fromIndexColumn === toIndexColumn) return;

		// Intercambia las columnas.
		this.swapColumns(fromIndexColumn, toIndexColumn);
	}

	getToIndexColumn(event) {
		const { toElement } = event;
		if (!toElement) return undefined;

		if (toElement.nodeName === "TH") {
			return toElement.dataset.dragColumnIndex;
		}
		if (toElement.nodeName === "DIV") {
			return toElement.closest("th")?.dataset?.dragColumnIndex;
		}

		return undefined;
	}

	/**
	 * Intercambia las columnas en la tabla.
	 * @param {string} fromIndexColumn - Índice de la columna de origen.
	 * @param {string} toIndexColumn - Índice de la columna de destino.
	 */
	swapColumns(fromIndexColumn, toIndexColumn) {
		try {
			const fromIndexColumnParse = Number(fromIndexColumn);
			const toIndexColumnParse = Number(toIndexColumn);

			// Verificar si son números enteros válidos y mayores o iguales a 0
			if (
				!Number.isInteger(fromIndexColumnParse) ||
				!Number.isInteger(toIndexColumnParse) ||
				fromIndexColumnParse < 0 ||
				toIndexColumnParse < 0 ||
				fromIndexColumnParse >= this.table.rows[0].cells.length || // Asegura que el índice esté dentro del rango
				toIndexColumnParse >= this.table.rows[0].cells.length
			) {
				console.warn("Índices inválidos:", { fromIndexColumnParse }, { toIndexColumnParse });
				return;
			}

			const rows = this.table.querySelectorAll("tr");

			rows.forEach((row) => {
				const cells = row.children;

				if (!cells[fromIndexColumnParse] || !cells[toIndexColumnParse]) return;
				// parentNode.insertBefore(newNode, existingNode);

				if (fromIndexColumnParse > toIndexColumnParse) {
					row.insertBefore(cells[fromIndexColumnParse], cells[toIndexColumnParse]);
				} else {
					row.insertBefore(cells[fromIndexColumnParse], cells[toIndexColumnParse]?.nextSibling);
				}
			});

			this.updateColumnIndices();
			this.saveColumnOrder();
		} catch (error) {
			console.error("[swapColumns]: Error al intercambiar columnas:", error);
		}
	}

	updateColumnIndices() {
		this.table.querySelectorAll("th").forEach((th, index) => {
			th.dataset.dragColumnIndex = index;
		});
	}

	saveColumnOrder() {
		const columnOrder = Array.from(this.table.querySelectorAll("th")).map((th) => {
			const id = th.id?.replace("ListPaneDataGrid_", "");
			const label = th.textContent.trim();

			return { id, label };
		});

		// Obtener configuración previa de localStorage
		const storedConfig = localStorage.getItem(this.nameStorageConfigurationModal);
		let config = storedConfig ? JSON.parse(storedConfig) : configurationModalInitial ?? {};

		// Guardar nuevamente en localStorage
		localStorage.setItem(this.nameStorageConfigurationModal, JSON.stringify({ ...config, columns: columnOrder }));
	}
}
