// Ajuste Positivo
class InventoryAdjustment extends IventoryManager {
	constructor(config) {
		super(config);
		console.log("Class InventoryAdjustment");
	}

	parseLine(linea) {
		// const match = linea.match(/^(\d+-\d+-\d+)\s+(\S+)\s+(\S+)(?:\s+([^\W_]+))?/);
		const match = linea.match(/^(\d+-\d+-\d+)[\s,]+(\d+)[\s,]+([^,\s]+)(?:[\s,]+([^\W_]+))?/);


		if (!match) return null;

		const item = match[1] ?? "";
		const qty = Number(match[2]) ?? "";
		const ubicacion = match[3] ?? "";
		const LP = match[4] ?? "";
		const company = match[5] ?? "FM";

		if (!item || !qty || !ubicacion) return null;
		return { item, qty, ubicacion, LP, company };
	}

	// Asignar valores al formulario
	assigneateValueInForm({ firstDataToInsert }) {
		const { item, company, quantity, location, RFLOGISTICSUNIT } = form1;

		item.value = firstDataToInsert?.item;
		quantity.value = firstDataToInsert?.qty;
		location.value = firstDataToInsert?.ubicacion;
		RFLOGISTICSUNIT.value = firstDataToInsert?.LP;
		company.value = firstDataToInsert?.company ?? "FM";
	}

	verifyFormInsertData() {
		const { item, company, quantity, location } = form1;
		console.log("verifyFormInsertData");

		if (item.value && (company.value === "FM" || company.value === "BF") && quantity.value && location.value) {
			return true;
		}

		return false;
	}
}
