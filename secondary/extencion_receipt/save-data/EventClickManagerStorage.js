class EventClickManagerStorage {
	constructor({ tbodyTable, nameStorageContainer }) {
		this.tbodyTable = tbodyTable;
		this.licencePlateId = "ListPaneDataGrid_LICENSE_PLATE_ID";
		this.status = "ListPaneDataGrid_STATUS_NAME";
		this.receiptId = "ListPaneDataGrid_RECEIPT_ID";

		this.receiptTypeTralados = new ReceiptTypeTralados({ nameStorageContainer });
		this.receiptTypeDevoluciones = new ReceiptTypeDevoluciones({ nameStorageContainer });
	}

	handleEvent() {
		const rows = Array.from(this.tbodyTable?.rows) || [];
		if (rows.length === 0) return;

		const firstRow = rows[0];
		const receiptId = firstRow.querySelector(`td[aria-describedby="${this.receiptId}"]`)?.textContent?.trim();

		if (!receiptId) return;

		if (receiptId.includes("-TR-111-")) {
			console.warn("DEVOLUCIONES");
			const containersList = this.getContainersList({ rows, receiptType: "DEVOLUCIONES" });
			this.receiptTypeDevoluciones.handleSaveData({ containersList });
			return;
		}

		if (receiptId.includes("TR_E-")) {
			console.warn("TRASLADOS");
			const containersList = this.getContainersList({ rows, receiptType: "TRASLADOS" });
			this.receiptTypeTralados.handleSaveData({ containersList });
		}
	}

	getContainersList({ rows = [], receiptType }) {
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
					const receiptIdValue = normalizeString(row.querySelector(`td[aria-describedby=${this.receiptId}]`));

					if (statusValue === "Check In Pending") {
						if (receiptType === "TRASLADOS") {
							return licencePlateIdValue;
						}

						if (receiptType === "DEVOLUCIONES") {
							return [receiptIdValue, licencePlateIdValue];
						}
					}
				})
				.filter(Boolean);

			return containersList;
		} catch (error) {
			console.error(
				`Error: [getContainersList] Ha ocurrido un error al obtener la lista de contenedores: ${error.message}`
			);

			return [];
		}
	}
}
