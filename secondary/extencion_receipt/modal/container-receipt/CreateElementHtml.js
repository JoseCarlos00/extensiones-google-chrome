class CreateElementHtml {
	constructor() {
		this.trailerId = this.getTrailerId();
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
			const fila = row.childNodes;
			const tr = document.createElement("tr");

			fila.forEach((td) => {
				const ariadescribedby = td.getAttribute("aria-describedby");

				if (ariadescribedby === "ListPaneDataGrid_LICENSE_PLATE_ID") {
					const tdLicencePlate = document.createElement("td");
					tdLicencePlate.innerHTML = `<input value="${td.textContent}" readonly class="input-text" tabindex="0">`;
					tdLicencePlate.setAttribute("aria-describedby", ariadescribedby);

					tr.appendChild(tdLicencePlate);
				}

				if (ariadescribedby === "ListPaneDataGrid_RECEIPT_ID") {
					const tdReceiptId = document.createElement("td");
					tdReceiptId.innerHTML = `<input value="${td.textContent}" readonly tabindex="0" class="input-text">`;
					tdReceiptId.setAttribute("aria-describedby", ariadescribedby);

					tr.appendChild(tdReceiptId);

					const tdTrailerId = document.createElement("td");
					tdTrailerId.innerHTML = `<input value="${this.trailerId}" readonly class="input-text" tabindex="0">`;
					tdTrailerId.setAttribute("aria-describedby", "ListPaneDataGrid_TRAILER_ID");

					const divDelete = document.createElement("div");
					divDelete.className = "delete-row";
					tdTrailerId.appendChild(divDelete);
					tr.appendChild(tdTrailerId);
				}
			});

			newTbody.appendChild(tr);
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
				newTbody.innerHTML = '<tr><td colspan="3">No hay datos para mostrar <div class="delete-row"></div></td></tr>';
				return newTbody;
			}

			this.getTbodyElement();

			return newTbody;
		} catch (error) {
			console.error(`Error: [createTbody] Ha Ocurrido un error al crear el new <tbody>: ${error}`);
		}
	}
}
