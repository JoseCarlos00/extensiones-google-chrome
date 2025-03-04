class UpdateWorkUnit {
	constructor() {
		this.tbody = document.querySelector("#ListPaneDataGrid > tbody");

		this.selectors = {
			workType: "td[aria-describedby='ListPaneDataGrid_INSTRUCTION_TYPE']",
			intenralInstructionNum: "td[aria-describedby='ListPaneDataGrid_INTERNAL_INSTRUCTION_NUM']",
			tbody: "#ListPaneDataGrid > tbody",
			btnCopy: ".update-work-unit .btn-copy-code-work-unit",
			internalsNumbers: ".update-work-unit #numbers-internals-containers",
			codeText: ".update-work-unit #code-text",
			workUnit: ".update-work-unit #work-unit",
			messageError: ".update-work-unit #message-error",
		};

		this._selectedRows = [];
		this.internalData = {
			internalsNumbers: [],
		};

		this.internalContainerNumbersElement = null;
		this.workUnitElement = null;
		this.messageErrorElement = null;
	}

	setSelectedRows(values) {
		this._selectedRows = values;
	}

	async initialVariables() {
		try {
			this.internalContainerNumbersElement = document.querySelector(this.selectors.internalsNumbers);
			this.workUnitElement = document.querySelector(this.selectors.workUnit);
			this.messageErrorElement = document.querySelector(this.selectors.messageError);

			if (!this.internalContainerNumbersElement) {
				throw new Error("Internal container numbers element container not found");
			}
			if (!this.workUnitElement) {
				throw new Error("Work unit element not found");
			}
			if (!this.messageErrorElement) {
				throw new Error("Message error element not found");
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
		this.internalContainerNumbersElement.textContent = "";
		this.workUnitElement.textContent = "''";
	}

	async setInternalData(rows) {
		await this.cleanInternalData();

		if (rows.length === 0) {
			throw new Error("[setInternalData]: No se encontraron filas en el <tbody>");
		}

		const headers = [];
		const detail = [];

		rows.forEach((row) => {
			const workTypeValue = row.querySelector(this.selectors.workType)?.textContent?.trim() ?? null;
			const internalsNumbersValue =
				row.querySelector(this.selectors.intenralInstructionNum)?.textContent?.trim() ?? null;

			if (!internalsNumbersValue) {
				return null;
			}

			if (workTypeValue === "Header") {
				headers.push(`'${internalsNumbersValue}'`);
				return;
			}

			if (workTypeValue === "Detail") {
				detail.push(`'${internalsNumbersValue}'`);
			}
		});

		if (headers.length > 1) {
			this.showMessageError("Se encontraron más de un [Header]");
			throw new Error("[setInternalData]: Se encontraron más de una cabecera");
		}

		if (detail.length === 0) {
			this.showMessageError("No se encontraron [Detail]");
			throw new Error("[setInternalData]: No se encontraron detalles");
		}

		this.internalData.internalsNumbers = [...headers, ...detail];
	}

	async processInternalTableData() {
		if (this._selectedRows.length <= 1) {
			this.showMessageError("Debe selecionar al menos dos filas");
			return;
		}

		await this.setInternalData(this._selectedRows);
	}

	async cleanValues() {
		this.resetElementVaules();
		await this.cleanInternalData();
	}

	setElementValues() {
		if (this.internalData.internalsNumbers.length === 0) {
			return;
		}

		this.internalContainerNumbersElement.textContent = this.internalData.internalsNumbers.join(", ");
	}

	hidenMessageError() {
		this.messageErrorElement.classList.add("d-none");
	}
	showMessageError(msg = "Debe selecionar al menos dos filas") {
		this.messageErrorElement.classList.remove("d-none");
		this.messageErrorElement.textContent = msg;
	}

	async setValueForUpdateWorkUnit() {
		try {
			this.hidenMessageError();
			await this.cleanValues();
			await this.processInternalTableData();
			this.setElementValues();
		} catch (error) {
			console.error("Error en setValueForUpdateWorkUnit: ", error.message);
		}
	}
}
