import { InventoryManager } from "./InventoryManager.js";

// Ajuste Positivo
export class InventoryAdjustment extends InventoryManager {
	constructor(config) {
		super(config);
		this.regexLinePattern = /^(\d+-\d+-\d+)[\s,]+(-?\d+)[\s,]+([^,\s]+)(?:[\s,]+([^\W_]+))?/;

		console.log('Class InventoryAdjustment');
	}

	parseLine(linea, company) {
		// const match = linea.match(/^(\d+-\d+-\d+)\s+(\S+)\s+(\S+)(?:\s+([^\W_]+))?/);
		const match = linea.match(this.regexLinePattern);

		if (!match) return null;

		const item = match[1] ?? '';
		const qty = Number(match[2]) ?? '';
		const location = match[3] ?? '';
		const LP = match[4] ?? '';


		if (!item || !qty || !location) return null;
		return { item, qty, location, LP, company };
	}

	// Asignar valores al formulario
	valuesIntoForm({ firstDataToInsert }) {
		const { item, company, quantity, location, RFLOGISTICSUNIT } = form1;

		item.value = firstDataToInsert?.item;
		quantity.value = firstDataToInsert?.qty;
		location.value = firstDataToInsert?.location;
		RFLOGISTICSUNIT.value = firstDataToInsert?.LP;
		company.value = firstDataToInsert?.company ?? 'FM';
	}

	verifyFormInsertData() {
		const { item, company, quantity, location } = form1;
		console.log('verifyFormInsertData');

		if (item.value && (company.value === 'FM' || company.value === 'BF') && quantity.value && location.value) {
			return true;
		}

		return false;
	}
}
