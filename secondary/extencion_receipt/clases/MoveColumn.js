class MoveColumns {
	constructor({ table = null }) {
		this.table = table;
		this.thead = this.table?.querySelector("thead");

		this.initEvents();
	}

	initEvents() {
		try {
			if (!this.thead) throw new Error("No se encontro el elemento <thead>");

			this.setEventDragAndDrog();
		} catch (error) {
			console.error("[MoveColumns] Error:", error?.message, error);
		}
	}

	setEventDragAndDrog() {
		this.table.querySelectorAll("th").forEach((th, index) => {
			th.draggable = true;
			th.dataset.dragColumnIndex = index;

			th.addEventListener("dragstart", (event) => this.handleDragStart({ event }));
			th.addEventListener("dragover", (event) => this.handleDragOver({ event }));
			th.addEventListener("drop", (event) => this.handleDrog({ event }));
		});
	}

	handleDragStart({ event }) {
		event.dataTransfer.setData("text/plain", event.target.dataset.dragColumnIndex);
	}

	handleDragOver({ event }) {
		event.preventDefault(); // Permite soltar
	}

	handleDrog({ event }) {
		event.preventDefault();

		const fromIndexColumn = event.dataTransfer.getData("text/plain");

		const getToIndexColumn = () => {
			const { toElement } = event;

			if (!toElement) return undefined;

			if (toElement.nodeName === "TH") return dataset?.dragColumnIndex;

			if (toElement.nodeName === "DIV") {
				return toElement?.closest("th")?.dataset?.dragColumnIndex;
			}
		};

		const toIndexColumn = getToIndexColumn();

		if (fromIndexColumn === toIndexColumn) return;

		this.swapColumns(fromIndexColumn, toIndexColumn);
	}

	swapColumns(fromIndexColumn, toIndexColumn) {
		const fromIndexColumnParse = Number(fromIndexColumn);
		const toIndexColumnParse = Number(toIndexColumn);

		// Verificar si son números enteros válidos y mayores o iguales a 0
		if (
			!Number.isInteger(fromIndexColumnParse) ||
			!Number.isInteger(toIndexColumnParse) ||
			fromIndexColumn < 0 ||
			toIndexColumn < 0
		) {
			console.warn("Índices inválidos:", { col1 }, { col2 });
			return;
		}

		const rows = this.table.querySelectorAll("tr");

		rows.forEach((row, index) => {
			const cells = row.children;

			if (cells[fromIndexColumnParse] && cells[toIndexColumnParse]) {
				// parentNode.insertBefore(newNode, existingNode);

				if (fromIndexColumnParse > toIndexColumnParse) {
					row.insertBefore(cells[fromIndexColumnParse], cells[toIndexColumnParse]);
				} else {
					row.insertBefore(cells[fromIndexColumnParse], cells[toIndexColumnParse].nextSibling);
				}
			}
		});

		this.table.querySelectorAll("th").forEach((th, index) => {
			th.dataset.dragColumnIndex = index;
		});
	}
}
