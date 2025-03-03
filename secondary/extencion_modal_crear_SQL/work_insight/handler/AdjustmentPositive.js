class AdjustmentPositive {
	constructor() {
		this.tbody = document.querySelector("#ListPaneDataGrid > tbody");

		this.selectors = {
			item: "td[aria-describedby='ListPaneDataGrid_ITEM']",
			fromLoc: "td[aria-describedby='ListPaneDataGrid_FROM_LOC']",
			toLoc: "td[aria-describedby='ListPaneDataGrid_TO_LOC']",
			confirmQty: "td[aria-describedby='ListPaneDataGrid_CONFIRM_QTY']",
			workType: "td[aria-describedby='ListPaneDataGrid_INSTRUCTION_TYPE']",
			tbody: "#ListPaneDataGrid > tbody",
			btnCopy: ".adjustment-positive .btn-copy-code-adj-pos",
			adjustmentPositiveForm: ".adjustment-positive #adjustment-positive-form",
		};

		this._selectedRows = [];
		this.internalData = "";
		this.adjustmentPositiveForm = null;
	}

	setSelectedRows(values) {
		this._selectedRows = values;
	}

	async initialVariables() {
		try {
			this.adjustmentPositiveForm = document.querySelector(this.selectors.adjustmentPositiveForm);

			if (!this.adjustmentPositiveForm) {
				throw new Error("<textarea> Adjustment Positive Form not found");
			}

			this.setEventCopyToClipBoard();
		} catch (error) {
			console.error("[AdjustmentPositive.initialVariables: Error:", error.message);
		}
	}

	handleCopyToClipBoar() {
		try {
			const codeText = this.internalData;

			if (codeText) {
				copyToClipboard(codeText);
			}
		} catch (error) {
			console.error("Error en handleCopyToClipBoar: ", error.message);
			ToastAlert.showAlertMinBotton("Ha ocurrido al copiar al portapapeles");
		}
	}

	setEventCopyToClipBoard() {
		// Event to copy
		const btnCopy = document.querySelector(this.selectors.btnCopy);

		if (!btnCopy) {
			console.error('No element with class "btn-copy-code" found.');
			return;
		}

		btnCopy.addEventListener("click", () => this.handleCopyToClipBoar());
	}

	async cleanInternalData() {
		this.internalData = "";
	}

	resetElementVaules() {
		this.adjustmentPositiveForm.value = "";
	}

	async setInternalData(rows) {
		await this.cleanInternalData();

		if (rows.length === 0) {
			throw new Error("No se encontraron filas en el <tbody>");
		}

		this.internalData = rows
			.map((row) => {
				const itemValue = row.querySelector(this.selectors.item)?.textContent?.trim() ?? "";
				const confirmQtyValue = row.querySelector(this.selectors.confirmQty)?.textContent?.trim() ?? "";
				const fromLocValue = row.querySelector(this.selectors.fromLoc)?.textContent?.trim() ?? "";
				const toLocValue = row.querySelector(this.selectors.toLoc)?.textContent?.trim() ?? "";
				const workTypeVaule = row.querySelector(this.selectors.workType)?.textContent?.trim() ?? "";

				if (workTypeVaule !== "Detail") {
					return null;
				}

				const location =
					toLocValue === "EMP-01" || /^\d-\d{2}-\d{2}-[A-Z]{2}-\d{2}$/.test(fromLocValue) ? "ASCENSOR" : fromLocValue;

				return `${itemValue}\t${confirmQtyValue}\t${location}`;
			})
			.filter(Boolean)
			.join("\n")
			.trim();

		console.log(this.internalData);
	}

	async processInternalTableData() {
		if (!this.tbody) {
			throw new Error("No se encontró <tbody>");
		}

		if (this._selectedRows.length > 0) {
			await this.setInternalData(this._selectedRows);
			return;
		}

		const rows = Array.from(this.tbody.querySelectorAll("tr"));
		await this.setInternalData(rows);
	}

	async cleanValues() {
		this.resetElementVaules();
		await this.cleanInternalData();
	}

	setElementValues() {
		this.adjustmentPositiveForm.value = this.internalData;
	}

	async setValueForAdjustment() {
		try {
			await this.cleanValues();
			await this.processInternalTableData();
			this.setElementValues();
		} catch (error) {
			console.error("Error en setValueForAdjustment: ", error.message);
		}
	}
}
