class TableManager {
	regex356 = /^356-C\b/;
	regexE = /^E-\b/;
	regexMae = /^4344-\b/;

	constructor() {
		this.bodyTable = null;
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
		const allValid = shipmentsIdSelected.every((id) => this.regex356.test(id));

		if (!allValid) {
			console.warn('[processShipments]: Al menos un SHIPMENT_ID no cumple con el formato esperado');
			return [];
		}

		// Si todos cumplen, regresar el array limpio
		return shipmentsIdSelected.map((id) => id.trim());
	}

	getWaveName() {
		const shipmentsIdSelected = this.getShipmentsIdSelected();
		if (shipmentsIdSelected.length === 0) return null;

		// Verifica si todos son tipo 356-C
		if (shipmentsIdSelected.every((id) => this.regex356.test(id))) {
			return shipmentsIdSelected.length > 1 ? 'Marino Clientes' : shipmentsIdSelected[0];
		}

		// Verifica si todos son tipo E-
		if (shipmentsIdSelected.every((id) => this.regexE.test(id))) {
			return shipmentsIdSelected.length > 1 ? 'Mariano Express' : shipmentsIdSelected[0];
		}

		// Verifica si todos son tipo Maestros
		if (shipmentsIdSelected.every((id) => this.regexMae.test(id))) {
			return shipmentsIdSelected.length > 1 ? 'Maestros' : shipmentsIdSelected[0];
		}

		console.warn('[getWaveName]: Al menos un SHIPMENT_ID no cumple con el formato esperado');
		return null;
	}
}
