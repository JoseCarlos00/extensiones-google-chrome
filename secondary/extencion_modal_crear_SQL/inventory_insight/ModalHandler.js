/**
 * Manejador de Modal
 *
 * Funciones Obligatorias:
 * 1. setModalElement -> initialVariables
 * 2  handleOpenModal
 * 3  handleCopyToClipBoar
 */
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
  }

  async verifyValidTable() {
    return new Promise((resolve, reject) => {
      const containers_ids = Array.from(
        document.querySelectorAll(
          "#ListPaneDataGrid > tbody > tr > td[aria-describedby='ListPaneDataGrid_CONTAINER_ID']"
        )
      );

      if (containers_ids.length === 0) {
        ToastAlert.showAlertFullTop('No Hay filas en la tabla', 'error');
        reject({ message: 'No Hay filas en la tabla' });
      } else {
        const containersFound = containers_ids.map(td => td.textContent.trim()).filter(Boolean);

        if (containersFound.length > 1 || !containersFound.length) {
          ToastAlert.showAlertFullTop('No se encontro un formato valido en la tabla', 'error');
          reject({ message: 'No Se encontro un formato valido en la tabla' });
        }

        resolve();
      }
    });
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

    this._selectedRows.forEach((row, index) => {
      const internalNumber = row.querySelector(this.internalDataSelector.internalNumber);

      if (index === 0) {
        const item = row.querySelector(this.internalDataSelector.item);
        const location = row.querySelector(this.internalDataSelector.location);

        if (item) {
          this.queryElements.ITEM.value = item.textContent;
        }

        if (location) {
          this.queryElements.LOCATION.value = location.textContent;
        }
      }

      if (internalNumber) {
        internalNumbers.push(internalNumber.textContent);
      }
    });

    if (internalNumbers.length > 0) {
      this.queryElements.DIV_INTERNAL_NUM.textContent = internalNumbers
        .map(i => `'${i}'`)
        .join(',\n');
    }
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

  handleCopyToClipBoar() {
    const codeText = document.querySelector('#myModal .main-code-container .code-container');

    console.log('[handleCopyToClipBoar]', codeText);
    ToastAlert.showAlertMinBotton('Se hizo clip en copiar', 'info');
  }
}

/**
 * TODO: Necesito Obtener datos internos y mostrarlos en los elementos Internos
 */
