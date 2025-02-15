class EventClickManagerStorage {
	constructor({ tbodyTable }) {
		this.tbodyTable = tbodyTable;
		this.licencePlateId = "ListPaneDataGrid_LICENSE_PLATE_ID";
		this.status = "ListPaneDataGrid_STATUS_NAME";
		this.receiptId = "ListPaneDataGrid_RECEIPT_ID";
	}

	handleEvent() {
		console.log("Se ha producido un evento:");
		const rows = Array.from(this.tbodyTable?.rows) || [];

		if (rows.length === 0) return;

		const firstRow = rows[0];

		const receiptId = firstRow.querySelector(`td[aria-describedby="${this.receiptId}"]`)?.textContent?.trim();
		console.log({ receiptId, bool: !!receiptId });

		if (!receiptId) return;

		if (receiptId.includes("-TR-111-")) {
			console.warn("DEVOLUCIONES");
			return;
		}

		if (receiptId.includes("TR_E-B")) {
			console.warn("TRASLADOS");
		}
	}

	getContainersList(rows = []) {
		try {
			if (rows.length === 0) {
				return [];
			}

			// Función de normalización
			const normalizeString = (str) => str?.textContent?.normalize("NFKC")?.replace(/\s+/g, " ")?.trim();

			const containersList = rows
				.map((row) => {
					const licencePlateIdValue = normalizeString(row.querySelector(`td[aria-describedby=${this.licencePlateId}]`));
					const statusValue = normalizeString(row.querySelector(`td[aria-describedby=${this.status}]`));

					if (statusValue === "Check In Pending") {
						return licencePlateIdValue;
					}
				})
				.filter(Boolean);

			return containersList;
		} catch (error) {
			console.error(
				`Error: [getContainersList] Ha ocurrido un error al obtener la lista de contenedores: ${error.message}`,
				error
			);

			return [];
		}
	}
}
