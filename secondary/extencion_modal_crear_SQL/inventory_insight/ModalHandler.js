class ModalHandler {
  constructor() {
    this.modal = null;
    this.tbodyTable = document.querySelector('#ListPaneDataGrid > tbody');

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
    this._statementUpdateSQL = '';
  }

  /**
   * Initializes the variables by selecting DOM elements.
   * Throws an error if any element is not found.
   */
  async _initialVariables() {
    try {
      const prefix = '#myModal .main-code-container .code-container';

      const internalElements = {
        OH: document.querySelector(`${prefix} #input_OH`),
        AL: document.querySelector(`${prefix} #input_AL`),
        IT: document.querySelector(`${prefix} #input_IT`),
        SU: document.querySelector(`${prefix} #input_SU`),
        DIV_INTERNAL_NUM: document.querySelector(`${prefix} #internal-inventory-numbers`),
        LOCATION: document.querySelector(`${prefix} #location`),
        ITEM: document.querySelector(`${prefix} #item`),
      };

      const missingOptions = Object.entries(internalElements)
        .filter(([key, value]) => !value)
        .map(([key]) => key);

      if (missingOptions.length > 0) {
        throw new Error(
          `No se encontraron los elementos necesarios para inicializar el menú contextual: [${missingOptions.join(
            ', '
          )}]`
        );
      }

      // Asignar los elementos validados a `queryElement`
      this.queryElements = internalElements;
    } catch (error) {
      console.error(`Error en initialVariables: ${error}`);
    }
  }

  async _openModal() {
    this.modal.style.display = 'block';
  }

  resetSelectedRows() {
    this._selectedRows.length = 0;
  }

  async _getRowsSelected() {
    const rows = Array.from(this.tbodyTable.rows);

    if (rows.length === 0) {
      console.error('No se encontraron th[data-role="checkbox"]');
      return null;
    }

    const selectedRows = rows.filter(row => {
      const checkbox = row.querySelector('th span[name="chk"]');

      if (checkbox) {
        const { chk } = checkbox.dataset;
        return chk === 'on';
      }
    });

    this._selectedRows = selectedRows;
  }

  async _resetValuesQueryElements() {
    // Recorrer las claves del objeto
    Object.keys(this.queryElements).forEach(key => {
      const element = this.queryElements[key];

      if (element && element.tagName === 'INPUT') {
        element.value = '';
      } else if (element && element.tagName === 'DIV') {
        element.textContent = '';
      }
    });
  }

  async _setValuesForQueryElements() {
    if (this._selectedRows.length === 0) {
      ToastAlert.showAlertFullTop('No se encontraron filas selecionadas', 'info');
      return;
    }

    await this._resetValuesQueryElements();
    const internalNumbers = [];
    const { ITEM, LOCATION, DIV_INTERNAL_NUM } = this.queryElements;

    this._selectedRows.forEach((row, index) => {
      const internalNumber = row.querySelector(this.internalDataSelector.internalNumber);

      if (index === 0) {
        const item = row.querySelector(this.internalDataSelector.item);
        const location = row.querySelector(this.internalDataSelector.location);

        if (item) {
          ITEM.value = `${item.textContent}`;
        }

        if (location) {
          LOCATION.value = `${location.textContent}`;
        }
      }

      if (internalNumber) {
        internalNumbers.push(internalNumber.textContent);
      }
    });

    if (internalNumbers.length > 0) {
      DIV_INTERNAL_NUM.textContent = internalNumbers.map(i => `'${i}'`).join(',\n');
    }
  }

  async _getStatementWhere(vaules) {
    const typeStatementWhere = document.querySelector(
      '#myModal .main-code-container .radio-container .radio-inputs input[name="type-mode"][type="radio"]:checked'
    );

    if (!typeStatementWhere) {
      console.error('No se encontro el tipo de condicion [where]');
      return;
    }

    const { type } = typeStatementWhere.dataset;
    const { DIV_INTERNAL_NUM, ITEM, LOCATION } = vaules;
    const selectedRowsNum = this._selectedRows.length;

    const params = {
      value: DIV_INTERNAL_NUM,
      item: ITEM,
      location: LOCATION,
    };

    const typeWhereMap = {
      internal: ({ value }) => {
        const statement = selectedRowsNum > 1 ? `IN (\n${value}\n)` : ' = ' + value;

        return `AND internal_location_inv ${statement}`;
      },
      itemLoc: ({ item, location }) => `AND location = '${location}'\nAND item = '${item}'`,
    };

    const statementWhere = `\nWHERE warehouse = 'Mariano'\n${typeWhereMap[type](params)}`;

    return statementWhere;
  }

  async _getStatementSet(vaules) {
    const typesOfSetSentences = Array.from(
      document.querySelectorAll(
        '#myModal .main-code-container .opcs-btn-container input.opc-btn:checked'
      )
    );

    if (typesOfSetSentences.length === 0) {
      console.error('No se selecciono ninguna opcion para el tipo de sentencia [set]');
      return;
    }

    const { OH, AL, IT, SU } = vaules;

    const valueSelect = {
      OH: OH,
      AL: AL,
      IT: IT,
      SU: SU,
    };

    const typeSetMap = {
      OH: ({ value: OH }) => `  ON_HAND_QTY = ${OH}`,
      AL: ({ value: AL }) => `  ALLOCATED_QTY = ${AL}`,
      IT: ({ value: IT }) => `  IN_TRANSIT_QTY = ${IT}`,
      SU: ({ value: SU }) => `  SUSPENSE_QTY = ${SU}`,
    };

    const statementSET = typesOfSetSentences
      .map(item => {
        const { type } = item.dataset;
        return typeSetMap[type]({ value: valueSelect[type] });
      })
      .join(',\n');

    return statementSET;
  }

  async getStatementSQL() {
    const { OH, AL, IT, SU, DIV_INTERNAL_NUM, LOCATION, ITEM } = this.queryElements;

    const vaules = {
      OH: OH.value,
      AL: AL.value,
      IT: IT.value,
      SU: SU.value,
      DIV_INTERNAL_NUM: DIV_INTERNAL_NUM.textContent,
      LOCATION: LOCATION.value,
      ITEM: ITEM.value,
    };

    const statementWhere = await this._getStatementWhere(vaules);
    const statementSET = await this._getStatementSet(vaules);
    const statemenUPDATE = 'UPDATE location_inventory\nSET\n' + statementSET + statementWhere;

    return statemenUPDATE;
  }

  async setModalElement(modal) {
    try {
      if (!modal) {
        throw new Error('No se encontró el modal para abrir');
      }

      this.modal = modal;
      await this._initialVariables();

      if (!this.tbodyTable) {
        throw new Error('No se encontró el elemento tbody');
      }
    } catch (error) {
      console.error(`Error en setModalElement: ${error}`);
    }
  }

  async handleOpenModal() {
    try {
      await this._getRowsSelected();
      await this._setValuesForQueryElements();
      await this._openModal();
    } catch (error) {
      console.error(`Error en handleOpenModal: ${error}`);
    }
  }

  async handleCopyToClipBoar() {
    try {
      const statementSQL = await this.getStatementSQL();

      copyToClipboard(statementSQL);
    } catch (error) {
      console.error(`Error en handleCopyToClipBoar: ${error}`);
    }
  }
}
