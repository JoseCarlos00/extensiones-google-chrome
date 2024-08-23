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
    this._isInitialVariables = true;
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
        this._isInitialVariables = false;
        throw new Error(
          `No se encontraron los elementos necesarios para inicializar [ModalHandler]: [${missingOptions.join(
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
    try {
      await this._resetValuesQueryElements();

      if (this._selectedRows.length === 0) {
        ToastAlert.showAlertFullTop('No se encontraron filas selecionadas', 'info');
        return;
      }

      const { ITEM, LOCATION, DIV_INTERNAL_NUM } = this.queryElements;
      const [firstRow] = this._selectedRows;

      const {
        item: itemSelector,
        location: locationSelector,
        internalNumber: internalNumSelector,
      } = this.internalDataSelector;

      const item = firstRow.querySelector(itemSelector)?.textContent || '';
      const location = firstRow.querySelector(locationSelector)?.textContent || '';

      ITEM.value = item;
      LOCATION.value = location;

      if (this._selectedRows.length === 1) {
        const internalNumber = firstRow.querySelector(internalNumSelector)?.textContent || '';
        DIV_INTERNAL_NUM.textContent = `'${internalNumber}'`;
      } else {
        const internalNumbers = this._selectedRows
          .map(row => row.querySelector(internalNumSelector)?.textContent)
          .filter(Boolean)
          .map(text => `'${text}'`);

        if (internalNumbers.length > 0) {
          DIV_INTERNAL_NUM.textContent = internalNumbers.join(',\n');
        }
      }
    } catch (error) {
      console.error(`Error en setValuesForQueryElements: ${error}`);
    }
  }

  async _getStatementWhere(values) {
    const typeStatementWhere = document.querySelector(
      '#myModal .main-code-container .radio-container .radio-inputs input[name="type-mode"][type="radio"]:checked'
    );

    if (!typeStatementWhere) {
      console.error('No se encontro el tipo de condicion [WHERE]');
      ToastAlert.showAlertFullTop('No se encontro el tipo de condicion [WHERE]');
      return;
    }

    const { type } = typeStatementWhere.dataset;
    const { DIV_INTERNAL_NUM, ITEM, LOCATION } = values;
    const selectedRowsNum = this._selectedRows.length;

    const typeWhereMap = {
      internal: () => {
        const statement =
          selectedRowsNum > 1 ? `IN (\n${DIV_INTERNAL_NUM}\n)` : `= '${DIV_INTERNAL_NUM}'`;
        return `AND internal_location_inv ${statement}`;
      },
      itemLoc: () => `AND location = '${LOCATION}'\nAND item = '${ITEM}'`,
    };

    return `\nWHERE warehouse = 'Mariano'\n${typeWhereMap[type]()}`;
  }

  async _getStatementSet(values) {
    const selectedTypesOfSetSentences = Array.from(
      document.querySelectorAll(
        '#myModal .main-code-container .opcs-btn-container input.opc-btn:checked'
      )
    );

    if (selectedTypesOfSetSentences.length === 0) {
      console.error('No se selecciono ninguna opcion para el tipo de sentencia [SET]');
      ToastAlert.showAlertFullTop(
        'No se selecciono ninguna opcion para el tipo de sentencia [SET]'
      );
      return;
    }

    const typeSetMap = {
      OH: () => `  ON_HAND_QTY = ${values.OH}`,
      AL: () => `  ALLOCATED_QTY = ${values.AL}`,
      IT: () => `  IN_TRANSIT_QTY = ${values.IT}`,
      SU: () => `  SUSPENSE_QTY = ${values.SU}`,
    };

    return selectedTypesOfSetSentences.map(item => typeSetMap[item.dataset.type]()).join(',\n');
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
        throw new Error('Error al generar las declaraciones SQL.');
      }

      return `UPDATE location_inventory\nSET\n${statementSET}\n${statementWhere}`;
    } catch (error) {
      console.error('Error: Ha ocurrido un error al  generar las sentencias SQL', error);
      return;
    }
  }

  async _getSelectedRowsNum() {
    return this._selectedRows.length;
  }

  async _addClassSelectedRows() {
    const containerPrincipal = document.querySelector('#myModal .main-code-container');

    if (!containerPrincipal) {
      console.error('[updateModalContent] No se encontró el elemento .main-code-container');
      return;
    }

    const rowNum = (await this._getSelectedRowsNum()) ?? 0;

    containerPrincipal.classList.toggle('single', rowNum <= 1);
    containerPrincipal.classList.toggle('multiple', rowNum >= 2);
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
      if (!this._isInitialVariables) {
        throw new Error('No se encontraron los elementos necesarios de la consulta');
      }

      await this._getRowsSelected();
      await this._setValuesForQueryElements();
      await this._addClassSelectedRows();
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
