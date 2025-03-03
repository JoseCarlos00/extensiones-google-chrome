class UpdateContainerId {
	constructor() {
		this.selectors = {
			internalContainerNum: "td[aria-describedby='ListPaneDataGrid_INTERNAL_CONTAINER_NUM']",
			containerId: "td[aria-describedby='ListPaneDataGrid_CONTAINER_ID']",
			tbody: "#ListPaneDataGrid > tbody",
			internalContainerNumElement: ".change-container-id #internal-container-id-num",
			internalParentContainerNumElement: ".change-container-id #internal-parent-container-id-num",
			internalContainerNumbersElement: ".change-container-id #numbers-internals-containers",
			containerIdElement: ".change-container-id #container-id",
			parentContainerIdElement: ".change-container-id #parent-container-id",
			inputInsertLogistisUnit: "#insertLogistictUnit",
		};

		this.internalData = {
			internalNumContainerId: "",
			internalNumParentContainerId: [],
			LP: "",
			internalsNumbers: [],
		};

		this.internalContainerNumElement = null;
		this.internalParentContainerNumElement = null;
		this.internalContainerNumbersElement = null;
		this.containerIdElement = null;
		this.parentContainerIdElement = null;
		this.inputInsertLogistisUnit = null;
	}

	async initialVariables() {
		try {
			// Select elements
			this.internalContainerNumElement = document.querySelector(this.selectors.internalContainerNumElement);
			this.internalParentContainerNumElement = document.querySelector(this.selectors.internalParentContainerNumElement);
			this.internalContainerNumbersElement = document.querySelector(this.selectors.internalContainerNumbersElement);
			this.containerIdElement = document.querySelector(this.selectors.containerIdElement);
			this.parentContainerIdElement = document.querySelector(this.selectors.parentContainerIdElement);
			this.inputInsertLogistisUnit = document.querySelector(this.selectors.inputInsertLogistisUnit);

			if (!this.internalContainerNumElement) {
				throw new Error("Internal container number element not found");
			}
			if (!this.internalParentContainerNumElement) {
				throw new Error("Internal parent container number element not found");
			}
			if (!this.internalContainerNumbersElement) {
				throw new Error("Internal container numbers element not found");
			}
			if (!this.containerIdElement) {
				throw new Error("Container ID element not found");
			}
			if (!this.parentContainerIdElement) {
				throw new Error("Parent container ID element not found");
			}
			if (!this.inputInsertLogistisUnit) {
				throw new Error("Insert logistics unit element not found");
			}

			this.setEventInsertLogisticUnit();
			this.setEventCopyToClipBoard();
		} catch (error) {
			console.error("[UpdateContainerId.initialVariables: Error:", error.message);
		}
	}

	setEventInsertLogisticUnit() {
		this.inputInsertLogistisUnit.addEventListener("click", () => this.inputInsertLogistisUnit.select());

		this.inputInsertLogistisUnit.addEventListener("input", async () => {
			this.inputInsertLogistisUnit.value = this.inputInsertLogistisUnit.value.toUpperCase();

			await this.setValueLogisticUnit(this.inputInsertLogistisUnit.value);
		});
	}

	setEventCopyToClipBoard() {
		// Event to copy
		const btnCopy = document.querySelector(".btn-copy-code");

		if (!btnCopy) {
			console.error('No element with class "btn-copy-code" found.');

			return;
		}

		btnCopy.addEventListener("click", () => this.handleCopyToClipBoar());
	}

	async cleanInternalData() {
		this.internalData.internalNumContainerId = "";
		this.internalData.internalNumParentContainerId.length = 0;
		this.internalData.internalsNumbers.length = 0;
		this.internalData.LP = "";
		this.inputInsertLogistisUnit.value = "";
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
					this.internalData.internalNumContainerId = internalNumText;
					this.internalData.internalsNumbers.push(internalNumText);
				} else if (!containerIdText && internalNumText) {
					this.internalData.internalNumParentContainerId.push(internalNumText);
					this.internalData.internalsNumbers.push(internalNumText);
				}
			}
		});
	}

	resetElementVaules() {
		this.internalContainerNumElement.textContent = "";
		this.internalParentContainerNumElement.textContent = "";
		this.internalContainerNumbersElement.textContent = "";
	}

	async setElementValues() {
		// await this.verifyAllElement();

		this.internalContainerNumElement.textContent = `'${this.internalData.internalNumContainerId}'`;
		this.internalParentContainerNumElement.textContent = this.internalData.internalNumParentContainerId
			.map((i) => `'${i}'`)
			.join(", ");
		this.internalContainerNumbersElement.textContent = this.internalData.internalsNumbers
			.map((i) => `'${i}'`)
			.join(", ");
	}

	/**
	 * Asignar LP a la consulta SQL
	 * @param {String} value : `'${value}'`
	 * Se formatea el texto para concatenar comillas sencillas.
	 * Valor por defaul: CONTENEDOR
	 */
	async setValueLogisticUnit(value = "CONTENEDOR") {
		this.parentContainerIdElement.textContent = `'${value}'`;
		this.containerIdElement.textContent = `'${value}'`;
	}

	async processInternalTableData() {
		const tbody = document.querySelector(this.selectors.tbody);
		if (!tbody) {
			throw new Error("No se encontró <tbody>");
		}

		const rows = Array.from(tbody.querySelectorAll("tr"));
		await this.setInternalData(rows);
	}

	async handleChangeContainerId() {
		try {
			this.resetElementVaules();
			await this.cleanInternalData();
			await this.processInternalTableData();
			await this.setElementValues();
		} catch (error) {
			console.error("Error en handleChangeContainerId: ", error.message);
		}
	}

	handleCopyToClipBoar() {
		try {
			const codeText = document.querySelector(".change-container-id code.language-sql")?.textContent;

			const parentContainerText = this.parentContainerIdElement.textContent.trim();
			const containerIdText = this.containerIdElement.textContent.trim();

			if (
				/''/.test(parentContainerText) ||
				parentContainerText === `'CONTENEDOR'` ||
				/''/.test(containerIdText) ||
				containerIdText === `'CONTENEDOR'`
			) {
				ToastAlert.showAlertFullTop("Ingrese un Contenedor Valido");
			} else {
				if (codeText) {
					copyToClipboard(codeText);
				}
			}
		} catch (error) {
			console.error("Error en handleCopyToClipBoar: ", error.message);
			ToastAlert.showAlertMinBotton("Ha ocurrido al copiar al portapapeles");
		}
	}
}
