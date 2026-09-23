import { PrintManager } from '../../utils/PrintManager.js';
import { CheckBoxManagerColumn, CheckBoxManagerRow } from '../../utils/CheckBoxManager.js';

export class PrintManagerDetail extends PrintManager {
	constructor() {
		super();
		this.columnIndex = {
			SHIPMENT_ID: -1,
			PARENT_CONTAINER_ID: -1,
			QUANTITY: -1,
			ITEM: -1,
			ITEM_DESC: -1,
		};

		this.mapIndex = [
			{ key: 'SHIPMENT_ID', values: ['shipment id'] },
			{ key: 'PARENT_CONTAINER_ID', values: ['parent container id'] },
			{ key: 'QUANTITY', values: ['quantity'] },
			{ key: 'ITEM', values: ['item'] },
			{ key: 'ITEM_DESC', values: ['description'] },
		];

		this.isChangeBox = false;
	}

	async init() {
		await super.init();
    this.ocultarFilasEnCero();
	}

	async createCheckBox() {
		const showColumns = Object.values(this.columnIndex);

		const checkBoxManagerCol = new CheckBoxManagerColumn();
		checkBoxManagerCol.eventoClickCheckBox();
		await checkBoxManagerCol.createFiltersCheckbox(showColumns, true);
	}

	ocultarFilasEnCero() {
		console.log('[Ocultar filas en cero]');
		const tdQuantity = this.table.querySelectorAll(`td:nth-child(${this.columnIndex.QUANTITY + 1})`);

		// Verificar si se encontraron elementos
		if (!tdQuantity || tdQuantity.length === 0) {
			console.log('No se encontraron elementos para ocultar');
			return;
		}

		// Ocultar filas con valor cero
		tdQuantity.forEach((td) => {
			if (td.innerHTML.trim() === '0') {
				const row = td.closest('tr[data-id]');
				if (row) {
					row.classList.add('hidden');
				}
			}
		});

		console.log('Filas en cero ocultadas');
	}
}
