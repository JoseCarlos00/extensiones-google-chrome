import { PrintManager } from '../../utils/PrintManager.js';
import { CheckBoxManagerColumn } from '../../utils/CheckBoxManager.js';

export class PrintManagerDetail extends PrintManager {
	constructor() {
		super();
		this.columnIndex = {
			WORK_UNIT: -1,
			ITEM: -1,
			ITEM_DESC: -1,
			REFERENCE_ID: -1,
			CONFIRM_QTY: -1,
			INSTRUCTION_TYPE: -1,
		};

		this.mapIndex = [
			{ key: 'WORK_UNIT', values: ['work unit'] },
			{ key: 'ITEM', values: ['item'] },
			{ key: 'ITEM_DESC', values: ['description'] },
			{ key: 'REFERENCE_ID', values: ['reference id'] },
			{ key: 'CONFIRM_QTY', values: ['confirm qty'] },
			{ key: 'INSTRUCTION_TYPE', values: ['instruction type'] },
		];

		this.isChangeBox = false;
	}

	async createCheckBox() {
		const showColumns = Object.values(this.columnIndex).filter(
			(_, index) => index !== Object.keys(this.columnIndex).indexOf('INSTRUCTION_TYPE'),
		);

		const checkBoxManagerCol = new CheckBoxManagerColumn();
		checkBoxManagerCol.eventoClickCheckBox();
		await checkBoxManagerCol.createFiltersCheckbox(showColumns, true);
	}

	filteredRow() {
		const { tbodyElementContent: tbody} = this;

		if (!tbody) return;


		const instructionTypeIndex = this.columnIndex.INSTRUCTION_TYPE;
		const rows = tbody.querySelectorAll('tr');


		rows.forEach((row) => {
			const cells = row.children;

			const instructionTypeCell = cells[instructionTypeIndex];

			if (!instructionTypeCell) return;

			const instructionType = instructionTypeCell.textContent.trim();

			if (instructionType === 'Header') {
				row.style.display = 'none';
			}
		});
	}
}

