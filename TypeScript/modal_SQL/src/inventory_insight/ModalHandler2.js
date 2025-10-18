class ModalHandler {
	constructor({ modalId, sectionContainerClass }) {
		this.modalId = modalId;
		this.sectionContainerClass = sectionContainerClass;

		this.modal = null;
		this.tbodyTable = document.querySelector("#ListPaneDataGrid > tbody");

		this.internalDataSelector = {
			item: "td[aria-describedby='ListPaneDataGrid_ITEM']",
			location: "td[aria-describedby='ListPaneDataGrid_LOCATION']",
			internalNumber: "td[aria-describedby='ListPaneDataGrid_INTERNAL_LOCATION_INV']",
		};

		this.queryElements = {
			OH: null,
			AL: null,
			IT: null,
			SU: null,
			DIV_INTERNAL_NUM: null,
			LOCATION: null,
			ITEM: null,
		};

		this._selectedRows = [];
		this._statementUpdateSQL = "";
		this._isInitialVariables = true;
	}


	async _setValuesForQueryElements() {
		try {
			await this._resetValuesQueryElements();

			if (this._selectedRows.length === 0) {
				ToastAlert.showAlertFullTop("No se encontraron filas selecionadas", "info");
				return;
			}

			const { ITEM, LOCATION, DIV_INTERNAL_NUM } = this.queryElements;
			const [firstRow] = this._selectedRows;

			const {
				item: itemSelector,
				location: locationSelector,
				internalNumber: internalNumSelector,
			} = this.internalDataSelector;

			const item = firstRow.querySelector(itemSelector)?.textContent || "";
			const location = firstRow.querySelector(locationSelector)?.textContent || "";

			ITEM.value = item;
			LOCATION.value = location;

			if (this._selectedRows.length === 1) {
				const internalNumber = firstRow.querySelector(internalNumSelector)?.textContent || "";
				DIV_INTERNAL_NUM.textContent = `'${internalNumber}'`;
			} else {
				const internalNumbers = this._selectedRows
					.map((row) => row.querySelector(internalNumSelector)?.textContent)
					.filter(Boolean)
					.map((text) => `'${text}'`);

				if (internalNumbers.length > 0) {
					DIV_INTERNAL_NUM.textContent = internalNumbers.join(",\n");
				}
			}
		} catch (error) {
			console.error(`Error en setValuesForQueryElements: ${error}`);
		}
	}

	async _getStatementWhere(values) {
		const typeStatementWhere = document.querySelector(
			`#${this.modalId} .main-code-container .radio-container .radio-inputs input[name="type-mode"][type="radio"]:checked`
		);

		if (!typeStatementWhere) {
			console.error("No se encontro el tipo de condicion [WHERE]");
			ToastAlert.showAlertFullTop("No se encontro el tipo de condicion [WHERE]");
			return;
		}

		const { type } = typeStatementWhere.dataset;
		const { DIV_INTERNAL_NUM, ITEM, LOCATION } = values;
		const selectedRowsNum = this._selectedRows.length;

		const typeWhereMap = {
			internal: () => {
				const statement = selectedRowsNum > 1 ? `IN (\n${DIV_INTERNAL_NUM}\n)` : `= ${DIV_INTERNAL_NUM}`;
				return `AND internal_location_inv ${statement}`;
			},
			itemLoc: () => `AND location = '${LOCATION}'\nAND item = '${ITEM}'`,
		};

		return `\nWHERE warehouse = 'Mariano'\n${typeWhereMap[type]()}`;
	}

	async _getStatementSet(values) {
		const selectedTypesOfSetSentences = Array.from(
			document.querySelectorAll(`#${this.modalId} .main-code-container .opcs-btn-container input.opc-btn:checked`)
		);

		if (selectedTypesOfSetSentences.length === 0) {
			console.error("No se selecciono ninguna opcion para el tipo de sentencia [SET]");
			ToastAlert.showAlertFullTop("No se selecciono ninguna opcion para el tipo de sentencia [SET]");
			return;
		}

		const typeSetMap = {
			OH: () => `  ON_HAND_QTY = ${values.OH}`,
			AL: () => `  ALLOCATED_QTY = ${values.AL}`,
			IT: () => `  IN_TRANSIT_QTY = ${values.IT}`,
			SU: () => `  SUSPENSE_QTY = ${values.SU}`,
		};

		return selectedTypesOfSetSentences.map((item) => typeSetMap[item.dataset.type]()).join(",\n");
	}

	async _getStatementSQL() {
		try {
			const { OH, AL, IT, SU, DIV_INTERNAL_NUM, LOCATION, ITEM } = this.queryElements;

			const values = {
				OH: OH.value.trim(),
				AL: AL.value.trim(),
				IT: IT.value.trim(),
				SU: SU.value.trim(),
				DIV_INTERNAL_NUM: DIV_INTERNAL_NUM.textContent.trim(),
				LOCATION: LOCATION.value.trim(),
				ITEM: ITEM.value.trim(),
			};

			const statementWhere = await this._getStatementWhere(values);
			const statementSET = await this._getStatementSet(values);

			if (!statementWhere || !statementSET) {
				throw new Error("Error al generar las declaraciones SQL.");
			}

			return `UPDATE location_inventory\nSET\n${statementSET}\n${statementWhere}`;
		} catch (error) {
			console.error("Error: Ha ocurrido un error al  generar las sentencias SQL", error);
			return;
		}
	}


	async handleOpenModal() {
		try {
			if (!this._isInitialVariables) {
				throw new Error("No se encontraron los elementos necesarios de la consulta");
			}

			await this._getRowsSelected();
			await this._setValuesForQueryElements();
			await this._addClassSelectedRows();
			setTimeout(() => this.queryElements.OH?.focus(), 50);
		} catch (error) {
			console.error(`Error en handleOpenModal: ${error}`);
		} finally {
			await this._openModal();
		}
	}

	async handleCopyToClipBoar() {
		try {
			const statementSQL = await this._getStatementSQL();

			if (statementSQL) {
				copyToClipboard(statementSQL);
			}
		} catch (error) {
			console.error(`Error en handleCopyToClipBoar: ${error}`);
			return;
		}
	}
}
