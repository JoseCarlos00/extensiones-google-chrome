class UpdateStatus {
	constructor() {
		this.selectors = {
			internalContainerNum: "td[aria-describedby='ListPaneDataGrid_INTERNAL_CONTAINER_NUM']",
			containerId: "td[aria-describedby='ListPaneDataGrid_CONTAINER_ID']",
			tbody: "#ListPaneDataGrid > tbody",
			internalContainerNumbersElement: ".change-sts #numbers-internals-containers",
			status: ".change-sts #sts-container",
		};

		this.internalData = {
			internalsNumbers: [],
			status: "",
		};

		this.internalContainerNumbersElement = null;
		this.statusElement = null;
	}

	async initialVariables() {
		try {
			this.internalContainerNumbersElement = document.querySelector(this.selectors.internalContainerNumbersElement);
			this.statusElement = document.querySelector(this.selectors.status);

			if (!this.internalContainerNumbersElement) {
				throw new Error("Internal container numbers element not found");
			}
			if (!this.statusElement) {
				throw new Error("Status element not found");
			}

			this.setEventCopyToClipBoard();
		} catch (error) {
			console.error("[UpdateStatus.initialVariables: Error:", error.message);
		}
	}

	async cleanInternalData() {
		this.internalData.internalsNumbers.length = 0;
		this.internalData.status = "";
	}

	resetElementVaules() {
		this.internalContainerNumbersElement.textContent = "";
		this.statusElement.textContent = "";
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
		const tbody = document.querySelector(this.selectors.tbody);
		if (!tbody) {
			throw new Error("No se encontró <tbody>");
		}

		const rows = Array.from(tbody.querySelectorAll("tr"));
		await this.setInternalData(rows);
	}

	handleCopyToClipBoar() {
		try {
			const codeText = document.querySelector(".change-sts code.language-sql")?.textContent;

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
		const btnCopy = document.querySelector(".btn-copy-code-sts");

		if (!btnCopy) {
			console.error('No element with class "btn-copy-code" found.');

			return;
		}

		btnCopy.addEventListener("click", () => this.handleCopyToClipBoar());
	}

	async setElementValues() {
		this.internalContainerNumbersElement.textContent = this.internalData.internalsNumbers
			.map((i) => `'${i}'`)
			.join(", ");
	}

	async cleanValues() {
		this.resetElementVaules();
		await this.cleanInternalData();
	}

	async handleChangeStatus() {
		try {
			await this.cleanValues();
			await this.processInternalTableData();
			await this.setElementValues();
		} catch (error) {
			console.error("Error en handleChangeStatus: ", error.message);
		}
	}
}
