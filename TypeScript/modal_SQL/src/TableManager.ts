import { ToastAlert } from "./utils/ToastAlert"

export class TableManager {
	private bodyTable: HTMLTableSectionElement | null = null;

	constructor() {
		this.initialize();
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

	getSelectedRowForSelector(selector: string = 'Not_found') {
		if (!this.bodyTable) {
			console.error('No se encontró la tabla tbody');
			return [];
		}

		const selectorClass = `tr > td[aria-describedby='ListPaneDataGrid_${selector}'].ui-iggrid-selectedcell.ui-state-active`;

		if (!document.querySelector(`th#ListPaneDataGrid_${selector}`)) {
			ToastAlert.showAlertFullTop(`No se encontró la columna [${selector}]`, 'warning');
			console.warn(`No se encontró la columna [${selector}]`);
			return [];
		}

		const colsSelected = Array.from(this.bodyTable.querySelectorAll(selectorClass));

		if (colsSelected.length === 0) {
			console.warn('No Hay filas seleccionadas en la tabla');
			return [];
		}

		return colsSelected.map((row) => row?.textContent?.trim()).filter(Boolean);
	}

	getSelectedRows() {
		if (!this.bodyTable) {
			console.error('No se encontró la tabla tbody');
			return [];
		}

		const selectorClass = `tr[aria-selected=true]`;
		const selectedRows = Array.from(this.bodyTable.querySelectorAll(selectorClass)) as HTMLTableRowElement[];

		if (selectedRows.length === 0) {
			console.warn('No Hay filas seleccionadas en la tabla');
			return [];
		}

		return selectedRows
	}
}
