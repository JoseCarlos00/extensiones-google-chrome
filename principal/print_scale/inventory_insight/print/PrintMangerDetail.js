import { PrintManager } from '../../utils/PrintManager.js';
import { CheckBoxManagerColumn, CheckBoxManagerRow } from '../../utils/CheckBoxManager.js';

export class PrintManagerDetail extends PrintManager {
	constructor() {
		super();
		this.columnIndex = {
			LOCATION: -1,
			ITEM: -1,
			ITEM_DESC: -1,
			AVAILABLE_QTY: -1,
			ON_HAND_QTY: -1,
			ALLOCATED_QTY: -1,
			IN_TRANSIT_QTY: -1,
			SUSPENSE_QTY: -1,
		};

		this.mapIndex = [
			{ key: 'LOCATION', values: ['location'] },
			{ key: 'ITEM', values: ['item'] },
			{ key: 'ITEM_DESC', values: ['description'] },
			{ key: 'AVAILABLE_QTY', values: ['av'] },
			{ key: 'ON_HAND_QTY', values: ['oh'] },
			{ key: 'ALLOCATED_QTY', values: ['al'] },
			{ key: 'IN_TRANSIT_QTY', values: ['it'] },
			{ key: 'SUSPENSE_QTY', values: ['su'] },
		];

		this.isChangeBox = false;
	}

	async createCheckBox() {
		const showColumns = Object.values(this.columnIndex);

		const checkBoxManagerCol = new CheckBoxManagerColumn();
		checkBoxManagerCol.eventoClickCheckBox();
		await checkBoxManagerCol.createFiltersCheckbox(showColumns, true);
	}
}
