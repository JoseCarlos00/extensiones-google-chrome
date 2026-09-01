import { InventoryManager } from "./InventoryManager.js";

// Transferencia Manual
export class InventoryTransfer extends InventoryManager {
	constructor(config) {
		super(config);
		console.log('Class InventoryTransfer');
	}

	renderForm() {
		super.renderForm();
		document.body.classList.add('inventory-transfer');
	}

	parseLine(linea, company) {
		// const match = linea.match(/^(\d+-\d+-\d+)\s+(\S+)\s+(\S+)\s+(\S+)(?:\s+(\S+))?/);
		const match = linea.match(
			/^(\d+-\d+-\d+)[\s,]+([^,\s]+)[\s,]+([^,\s]+)[\s,]+([^,\s]+)(?:[\s,]+([^,\s]+))?(?:[\s,]+([^,\s]+))?/,
		);
		if (!match) return null;

		const item = match[1] ?? '';
		const qty = parseInt(match[2]) ?? '';
		const fromLoc = match[3] ?? '';
		const toLoc = match[4] ?? '';
		const LP = match[5] === '-' ? '' : (match[5] ?? '');

		if (!item || !qty || !fromLoc || !toLoc || !company) return null;
		return { item, qty, fromLoc, toLoc, LP, company };
	}

	// Asignar valores al formulario
	valuesIntoForm({ firstDataToInsert }) {
		const { item, company, quantity, RFLOGISTICSUNIT, fromLoc, toLoc } = form1;

		item.value = firstDataToInsert.item;
		quantity.value = firstDataToInsert.qty;
		fromLoc.value = firstDataToInsert.fromLoc;
		toLoc.value = firstDataToInsert.toLoc;
		company.value = firstDataToInsert.company ?? 'FM';
		RFLOGISTICSUNIT.value = firstDataToInsert.LP;
	}

	verifyFormInsertData() {
		const { item, company, quantity, fromLoc, toLoc } = form1;

		if (
			item.value &&
			(company.value === 'FM' || company.value === 'BF') &&
			quantity.value &&
			fromLoc.value &&
			toLoc.value
		) {
			return true;
		}

		return false;
	}
}
