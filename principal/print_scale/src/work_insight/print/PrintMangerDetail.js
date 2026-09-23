import { PrintManager } from '../../utils/PrintManager.js';
import { CheckBoxManagerColumn, CheckBoxManagerRow } from '../../utils/CheckBoxManager.js';

export class PrintManagerDetail extends PrintManager {
	constructor() {
		super();
		this.columnIndex = {
			WORK_UNIT: -1,
			INSTRUCTION_TYPE: -1,
			ITEM: -1,
			ITEM_DESC: -1,
			REFERENCE_ID: -1,
			CONFIRM: -1,
		};

		this.mapIndex = [
			{ key: 'WORK_UNIT', values: ['work_unit'] },
			{ key: 'ITEM', values: ['item'] },
			{ key: 'ITEM_DESC', values: ['description'] },
			{ key: 'INSTRUCTION_TYPE', values: ['instruction_type'] },
			{ key: 'REFERENCE_ID', values: ['reference_id'] },
			{ key: 'CONFIRM', values: ['confirm_qty'] },
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
