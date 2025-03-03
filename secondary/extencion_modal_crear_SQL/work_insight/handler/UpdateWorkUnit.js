class UpdateWorkUnit {
	constructor() {
		this.tbody = document.querySelector("#ListPaneDataGrid > tbody");

		this.selectors = {
			item: "td[aria-describedby='ListPaneDataGrid_ITEM']",
			fromLoc: "td[aria-describedby='ListPaneDataGrid_FROM_LOC']",
			toLoc: "td[aria-describedby='ListPaneDataGrid_TO_LOC']",
			confirmQty: "td[aria-describedby='ListPaneDataGrid_CONFIRM_QTY']",
			workType: "td[aria-describedby='ListPaneDataGrid_INSTRUCTION_TYPE']",
			tbody: "#ListPaneDataGrid > tbody",
			btnCopy: ".update-work-unit .btn-copy-code-work-unit",
			internalsNumbers: ".update-work-unit #numbers-internals-containers",
			codeText: ".update-work-unit #code-text",
		};

		this._selectedRows = [];
		this.internalData = {
			internalsNumbers: [],
		};

		this.internalsNumbers = null;
	}

	setSelectedRows(values) {
		this._selectedRows = values;
	}

	async initialVariables() {
		try {
			this.internalsNumbers = document.querySelector(this.selectors.internalsNumbers);

			if (!this.internalsNumbers) {
				throw new Error("Internal numbers container not found");
			}

			this.setEventCopyToClipBoard();
		} catch (error) {
			console.error("[UpdateWorkUnit.initialVariables: Error:", error.message);
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
		this.internalData.internalsNumbers.length = 0;
	}

	resetElementVaules() {
		this.internalsNumbers.textContent = "";
	}

	async setInternalData(rows) {
		const { internalContainerNum, containerId } = this.selectors;

		await this.cleanInternalData();

		if (rows.length === 0) {
			throw new Error("No se encontraron filas en el <tbody>");
		}

		rows.forEach((row) => {
			const internalContainerNumElement = row.querySelector(internalContainerNum);
			const containerIdElement = row.querySelector(containerId);

			if (internalContainerNumElement && containerIdElement) {
				const containerIdText = containerIdElement.textContent.trim();
				const internalNumText = internalContainerNumElement.textContent.trim();

				if (containerIdText && internalNumText) {
					this.internalData.internalsNumbers.push(internalNumText);
				} else if (!containerIdText && internalNumText) {
					this.internalData.internalsNumbers.push(internalNumText);
				}
			}
		});
	}

	async processInternalTableData() {
		if (!this.tbody) {
			throw new Error("No se encontró <tbody>");
		}

		if (this._selectedRows.length > 0) {
			await this.setInternalData(this._selectedRows);
			return;
		}

		const rows = Array.from(tbody.querySelectorAll("tr"));
		await this.setInternalData(rows);
	}

	async cleanValues() {
		this.resetElementVaules();
		await this.cleanInternalData();
	}

	setElementValues() {
		this.internalsNumbers.textContent = this.internalData.internalsNumbers.join("\n");
	}

	async setValueForUpdateWorkUnit() {
		try {
			await this.cleanValues();
			await this.processInternalTableData();
			this.setElementValues();
		} catch (error) {
			console.error("Error en setValueForUpdateWorkUnit: ", error.message);
		}
	}
}
