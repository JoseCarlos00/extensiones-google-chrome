// Transferencia Manual
class InventoryTransfer extends IventoryManager {
	constructor(config) {
		super(config);
		console.log("Class InventoryTransfer");
	}

	parseLine(linea) {
		// const match = linea.match(/^(\d+-\d+-\d+)\s+(\S+)\s+(\S+)\s+(\S+)(?:\s+(\S+))?/);
		const match = linea.match(/^(\d+-\d+-\d+)[\s,]+([^,\s]+)[\s,]+([^,\s]+)[\s,]+([^,\s]+)(?:[\s,]+([^,\s]+))?/);

		if (!match) return null;

		const item = match[1] ?? "";
		const qty = Number(match[2]) ?? "";
		const fromLoc = match[3] ?? "";
		const toLoc = match[4] ?? "";
		const LP = match[5] ?? "";
		const company = match[6] ?? "FM";

		if (!item || !qty || !fromLoc || !toLoc) return null;
		return { item, qty, fromLoc, toLoc, LP, company };
	}

	// Asignar valores al formulario
	assigneateValueInForm({ firstDataToInsert }) {
		const { item, company, quantity, RFLOGISTICSUNIT, fromLoc, toLoc } = form1;

		item.value = firstDataToInsert?.item;
		quantity.value = firstDataToInsert?.qty;
		fromLoc.value = firstDataToInsert?.fromLoc;
		toLoc.value = firstDataToInsert?.toLoc;
		company.value = firstDataToInsert?.company ?? "FM";
		RFLOGISTICSUNIT.value = firstDataToInsert?.LP;
	}

	verifyFormInsertData() {
		const { item, company, quantity, fromLoc, toLoc } = form1;
		console.log("verifyFormInsertData");

		if (
			item.value &&
			(company.value === "FM" || company.value === "BF") &&
			quantity.value &&
			fromLoc.value &&
			toLoc.value
		) {
			return true;
		}

		return false;
	}
}
