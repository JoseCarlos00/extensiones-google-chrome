class CreateElementHtml {
	constructor() {
		this.trailerId = this.getTrailerId();
		this.columns = configurationModalInitial?.columns ?? [];
	}

	getTrailerId() {
		try {
			const advanceCriteriaJson = JSON.parse(sessionStorage.getItem("2779advanceCriteriaJson")) || [];

			if (!Array.isArray(advanceCriteriaJson)) {
				console.warn("El contenido de advanceCriteriaJson no es una matriz:", advanceCriteriaJson);
				return "No encontrado";
			}

			// Buscar el valor del trailerId
			const trailerId = advanceCriteriaJson.find(({ FieldIdentifier }) => FieldIdentifier === "TRAILER_ID")?.Value;

			return trailerId || "No encontrado";
		} catch (error) {
			console.error("Error al obtener el trailerId:", error.message, error);
			return "No encontrado";
		}
	}

	getTbodyElement({ rows, newTbody }) {
		rows.forEach((row) => {
			const tdList = row.childNodes;
			const trNew = document.createElement("tr");

			this.columns.forEach(({ id }) => {
				const tdNew = document.createElement("td");
				tdNew.setAttribute("aria-describedby", `ListPaneDataGrid_${id}`);

				if (id === "TRAILER_ID") {
					tdNew.innerHTML = `<input value="${this.trailerId}" readonly class="input-text" tabindex="0">`;
				} else {
					const tdOriginal = Array.from(tdList).find(
						(td) => td.getAttribute("aria-describedby") === `ListPaneDataGrid_${id}`
					);

					if (tdOriginal) {
						tdNew.innerHTML = `<input value="${tdOriginal.textContent}" readonly class="input-text" tabindex="0">`;
					}
				}

				trNew.appendChild(tdNew);
			});

			// Agregar botón eliminar en la primera columna
			const divDelete = document.createElement("div");
			divDelete.className = "delete-row";
			trNew.querySelector("td")?.insertAdjacentElement("beforeend", divDelete);

			newTbody.appendChild(trNew);
		});
	}

	async createTbody({ tbodyTable }) {
		try {
			if (!tbodyTable) {
				throw new Error("tbodyTable no puede ser null o indefinido");
			}

			const rows = Array.from(tbodyTable.rows);

			// Create new tbody
			const newTbody = document.createElement("tbody");

			if (rows.length === 0) {
				newTbody.innerHTML = `<tr><td colspan="${this.columns.length}">No hay datos para mostrar <div class="delete-row"></div></td></tr>`;
				return newTbody;
			}

			// Crea filas en el nuevo tbody
			this.getTbodyElement({ rows, newTbody });

			return newTbody;
		} catch (error) {
			console.error(`Error: [createTbody] Ha Ocurrido un error al crear el new <tbody>: ${error}`);
		}
	}
}
