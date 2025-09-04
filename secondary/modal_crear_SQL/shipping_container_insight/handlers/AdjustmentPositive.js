class AdjustmentPositive {
	constructor() {
		this.selectors = {
			item: "td[aria-describedby='ListPaneDataGrid_ITEM']",
			qty: "td[aria-describedby='ListPaneDataGrid_QUANTITY']",
			location: "td[aria-describedby='ListPaneDataGrid_LOCATION']",
			containerId: "td[aria-describedby='ListPaneDataGrid_CONTAINER_ID']",
			tbody: "#ListPaneDataGrid > tbody",
			btnCopy: ".adjustment-positive .btn-copy-code-adj-pos",
			adjustmentPositiveForm: ".adjustment-positive #adjustment-positive-form",
		};

		this.internalData = "";
		this.adjustmentPositiveForm = null;
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
				const qtyValue = row.querySelector(this.selectors.qty)?.textContent?.trim() ?? "";
				const locationValue = row.querySelector(this.selectors.location)?.textContent?.trim() ?? "";

				const containerIdE = row.querySelector(this.selectors.containerId)?.textContent?.trim();

				if (containerIdE) {
					return null;
				}

				const location = locationValue.startsWith("-") ? "ASCENSOR" : locationValue;

				return `${itemValue}  ${qtyValue}  ${location}`;
			})
			.filter(Boolean)
			.join("\n");
	}

	async processInternalTableData() {
		const tbody = document.querySelector(this.selectors.tbody);
		if (!tbody) {
			throw new Error("No se encontró <tbody>");
		}

		const rows = Array.from(tbody.querySelectorAll("tr"));
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
