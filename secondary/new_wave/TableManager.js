class TableManager {
	constructor() {
		this.bodyTable = null;
		this.regex = /^356-C\b/;
	}

	initialize() {
		try {
			this.bodyTable = document.querySelector('#ListPaneDataGrid tbody');

			if (!this.bodyTable) {
				throw new Error('No se encontró el elemento #ListPaneDataGrid tbody');
			}
		} catch (error) {
			console.error(`[TableManager]: Error en initialize: ${error}`);
		}
	}

	getShipmentsIdSelected() {
		const shipmentsIdSelected = Array.from(
			this.bodyTable.querySelectorAll(
				"tr > td[aria-describedby='ListPaneDataGrid_SHIPMENT_ID'].ui-iggrid-selectedcell.ui-state-active"
			)
		);

		if (shipmentsIdSelected.length === 0) {
			console.warn('No Hay filas seleccionadas en la tabla');
			return [];
		}

		return shipmentsIdSelected.map((row) => row?.textContent?.trim()).filter(Boolean);
	}

	processShipments() {
    const shipmentsIdSelected = this.getShipmentsIdSelected();

		if (shipmentsIdSelected.length === 0) {
			console.warn('[processShipments]: No hay filas seleccionadas en la tabla');
			return [];
		}

		// Validar que TODOS cumplen el regex
		const allValid = shipmentsIdSelected.every((id) => this.regex.test(id));

		if (!allValid) {
			console.warn('[processShipments]: Al menos un SHIPMENT_ID no cumple con el formato esperado');
			return [];
		}

		// Si todos cumplen, regresar el array limpio
		return shipmentsIdSelected.map((id) => id.trim());
	}
}
