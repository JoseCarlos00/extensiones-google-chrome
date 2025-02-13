class EventClickManager {
	constructor({ updateRowCounter, tableContent, list }) {
		this._tableContent = tableContent;
		this._updateRowCounter = updateRowCounter;
	}

	handleEvent({ ev }) {
		const { target, type } = ev;
		const { nodeName } = target;

		if (type === "click") {
			this.#handleClick(target, nodeName);
		}
	}

	#handleClick(target, nodeName) {
		const { classList } = target;

		if (classList.contains("delete-row")) {
			this.#deleteRow(target);
		}

		if (nodeName === "INPUT") {
			target.focus();
			target.select();
		}
	}

	#validateElement(element) {
		if (!element) {
			throw new Error("El elemento HTML proporcionado es nulo o indefinido");
		}
	}

	#deleteRow(element) {
		this.#validateElement(element);

		const trSelected = element.closest("tr");
		if (trSelected) {
			trSelected.remove();
			this._updateRowCounter();
		}
	}
}

class EventManagerKeydown {
	constructor() {
		this.validKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
	}

	handleEvent({ ev }) {
		const { target, type, key } = ev;

		if (type === "keydown" && target.nodeName === "INPUT" && this.validKeys.includes(key)) {
			this.#handleKeydown({ input: target, key, ev });
		}
	}

	#handleKeydown({ input, key, ev }) {
		const row = input.closest("tr");
		const colIndex = Array.from(row.children).indexOf(input.closest("td"));

		const getNextCell = (direction) =>
			({
				ArrowUp: () => row.previousElementSibling?.children[colIndex]?.querySelector("input"),
				ArrowDown: () => row.nextElementSibling?.children[colIndex]?.querySelector("input"),
				ArrowLeft: () => row.children[colIndex - 1]?.querySelector("input"),
				ArrowRight: () => row.children[colIndex + 1]?.querySelector("input"),
			}[direction]());

		const nextCell = getNextCell(key);

		if (nextCell) {
			ev.preventDefault();
			nextCell.focus();
			nextCell.select();
		} else {
			console.warn(`[handleKeydown] No se encontró un [nextCell] válido para la tecla ${key}`);
		}
	}
}
