// Transferencia Manual
class InventoryTransfer extends IventoryManager {
	constructor(config) {
		super(config);
		console.log("Class InventoryTransfer");
	}

	parseLine(linea) {
		const match = linea.match(/^(\d+-\d+-\d+)\s+(\S+)\s+(\S+)\s+(\S+)(?:\s+(\S+))?/);
		if (!match) return null;

		const item = match[1] ?? null;
		const qty = Number(match[2]) ?? null;
		const fromLoc = match[3] ?? null;
		const toLoc = match[4] ?? null;
		const LP = match[5] ?? null;

		if (!item || !qty || !fromLoc || !toLoc) return null;
		return { item, qty, fromLoc, toLoc, LP };
	}

	// Asignar valores al formulario
	assigneateValueInForm({ firstDataToInsert }) {
		const { item, company, quantity, QTYUM, RFLOGISTICSUNIT, fromLoc, toLoc } = form1;

		item.value = firstDataToInsert?.item;
		quantity.value = firstDataToInsert?.qty;
		fromLoc.value = firstDataToInsert?.fromLoc;
		toLoc.value = firstDataToInsert?.toLoc;
		company.value = "FM";
		QTYUM.value = "PZ (1,00)";
		RFLOGISTICSUNIT.value = firstDataToInsert?.LP;
	}

	verifyFormInsertData() {
		const { item, company, quantity, QTYUM, fromLoc, toLoc } = form1;
		console.log("verifyFormInsertData");

		if (item.value && company.value === "FM" && quantity.value && fromLoc.value && toLoc.value) {
			return true;
		}

		return false;
	}
}
