/**
 * Clase que gestiona los eventos de clic en una tabla.
 */
class EventClickManager {
	/**
	 * Constructor de la clase EventClickManager.
	 * @param {Object} params - Parámetros para la configuración del gestor de eventos.
	 * @param {Function} params.updateRowCounter - Función para actualizar el contador de filas.
	 * @param {HTMLElement} params.tableContent - Contenido de la tabla donde se gestionan los eventos.
	 */
	constructor({ updateRowCounter, tableContent }) {
		this._tableContent = tableContent; // Almacena el contenido de la tabla.
		this._updateRowCounter = updateRowCounter; // Almacena la función para actualizar el contador de filas.
	}

	/**
	 * Maneja los eventos de clic.
	 * @param {Object} param - Objeto que contiene el evento.
	 * @param {Event} param.ev - Evento que se está manejando.
	 */
	handleEvent({ ev }) {
		const { target, type } = ev; // Desestructura el evento para obtener el objetivo y tipo.
		const { nodeName } = target; // Obtiene el nombre del nodo del objetivo.

		if (type === "click") {
			this.#handleClick(target, nodeName); // Llama al método privado para manejar el clic.
		}
	}

	/**
	 * Maneja el evento de clic en el objetivo especificado.
	 * @param {HTMLElement} target - Elemento que fue clicado.
	 * @param {string} nodeName - Nombre del nodo del elemento clicado.
	 */
	#handleClick(target, nodeName) {
		const { classList } = target; // Obtiene la lista de clases del objetivo.

		if (classList.contains("delete-row")) {
			this.#deleteRow(target); // Elimina la fila si el objetivo tiene la clase "delete-row".
			return;
		}

		if (nodeName === "INPUT") {
			target.focus(); // Enfoca el input.
			target.select(); // Selecciona el contenido del input.
		}
	}

	/**
	 * Valida que el elemento proporcionado no sea nulo o indefinido.
	 * @param {HTMLElement} element - Elemento HTML a validar.
	 * @throws {Error} - Lanza un error si el elemento es nulo o indefinido.
	 */
	#validateElement(element) {
		if (!element) {
			throw new Error("El elemento HTML proporcionado es nulo o indefinido");
		}
	}

	/**
	 * Elimina la fila correspondiente al elemento clicado.
	 * @param {HTMLElement} element - Elemento que fue clicado para eliminar la fila.
	 */
	#deleteRow(element) {
		this.#validateElement(element); // Valida el elemento.
		const trSelected = element.closest("tr"); // Encuentra la fila más cercana al elemento clicado.
		if (trSelected) {
			trSelected.remove(); // Elimina la fila del DOM.
			this._updateRowCounter(); // Actualiza el contador de filas.
		}
	}
}

/**
 * Clase que gestiona los eventos de teclado, específicamente las teclas de dirección.
 */
class EventManagerKeydown {
	/**
	 * Constructor de la clase EventManagerKeydown.
	 */
	constructor() {
		this.validKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]; // Teclas válidas para la navegación.
	}

	/**
	 * Maneja los eventos de teclado.
	 * @param {Object} param - Objeto que contiene el evento.
	 * @param {Event} param.ev - Evento que se está manejando.
	 */
	handleEvent({ ev }) {
		const { target, type, key } = ev; // Desestructura el evento para obtener el objetivo, tipo y tecla.
		if (type === "keydown" && target.nodeName === "INPUT" && this.validKeys.includes(key)) {
			this.#handleKeydown({ input: target, key, ev }); // Llama al método privado para manejar la tecla presionada.
		}
	}

	/**
	 * Maneja la lógica de navegación entre celdas de la tabla usando las teclas de dirección.
	 * @param {Object} param - Objeto que contiene el input, la tecla y el evento.
	 * @param {HTMLElement} param.input - Elemento input que fue activado.
	 * @param {string} param.key - Tecla que fue presionada.
	 * @param {Event} param.ev - Evento que se está manejando.
	 */
	#handleKeydown({ input, key, ev }) {
		const row = input.closest("tr"); // Encuentra la fila más cercana al input.
		const colIndex = Array.from(row.children).indexOf(input.closest("td")); // Obtiene el índice de la columna del input.

		// Función para obtener la siguiente celda en la dirección especificada.
		const getNextCell = (direction) =>
			({
				ArrowUp: () => row.previousElementSibling?.children[colIndex]?.querySelector("input"),
				ArrowDown: () => row.nextElementSibling?.children[colIndex]?.querySelector("input"),
				ArrowLeft: () => row.children[colIndex - 1]?.querySelector("input"),
				ArrowRight: () => row.children[colIndex + 1]?.querySelector("input"),
			}[direction]());

		const nextCell = getNextCell(key); // Obtiene la siguiente celda según la tecla presionada.

		if (nextCell) {
			ev.preventDefault(); // Previene el comportamiento por defecto del navegador.
			nextCell.focus(); // Enfoca la siguiente celda.
			nextCell.select(); // Selecciona el contenido de la siguiente celda.
		} else {
			console.warn(`[handleKeydown] No se encontró un [nextCell] válido para la tecla ${key}`);
		}
	}
}
