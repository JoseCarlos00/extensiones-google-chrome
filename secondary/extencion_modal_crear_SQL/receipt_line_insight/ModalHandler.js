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
    this.tbody = document.querySelector('#ListPaneDataGrid > tbody');
    this.internalDataSelector = {
			internalNumber: "td[aria-describedby='ListPaneDataGrid_INTERNAL_RECEIPT_NUM']",
		};
    this.prefix = '#myModal .modal-content ';
    this.internalReceiptNum = null;
    this._selectedRows = [];
  }

  #setInternalShipmentNum() {
    this.internalReceiptNum = document.querySelector(`${this.prefix} #internal_receipt_num`);
  }

  #resetInternalNumber() {
    this.internalReceiptNum.textContent = '';
  }

  async #getRowsSelected() {
    const rows = Array.from(this.tbody.rows);

    if (rows.length === 0) {
      console.warn('No se encontraron th[data-role="checkbox"]');
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

  async #getInternalData() {
    if (!this._selectedRows.length === 0) {
      console.warn('No se encontraron filas');
      return;
    }

    const internalNumbers = this._selectedRows
      .map(row => row.querySelector(this.internalDataSelector.internalNumber)?.textContent.trim())
      .filter(Boolean);

    return internalNumbers;
  }

  async #setInternalData() {
    this.#resetInternalNumber();

    const internalNumbers = await this.#getInternalData();

    if (internalNumbers.length > 0) {
      this.internalReceiptNum.textContent = internalNumbers[0];
    } else {
      this.internalReceiptNum.textContent = 'No data found';
    }
  }

  async #openModal() {
    this.modal.style.display = 'block';
  }

  async setModalElement(modal) {
    try {
      if (!modal) {
        throw new Error('No se encontró el modal para abrir');
      }

      this.modal = modal;
      this.#setInternalShipmentNum();
    } catch (error) {
      console.error(`Error en setModalElement: ${error}`);
    }
  }

  async handleOpenModal() {
    try {
      await this.#openModal();
      await this.#getRowsSelected();
      await this.#setInternalData();
    } catch (error) {
      console.error(`Error en handleOpenModal: ${error}`);
    }
  }

  handleCopyToClipBoar() {
    try {
      const codeText = document.querySelector('code.language-sql');
      const texto = codeText ? codeText.textContent : '';

      if (!texto) {
        console.warn('El texto generado está vacío');
        ToastAlert.showAlertFullTop('No se pudo generar texto para copiar', 'warning');
        return;
      }

      copyToClipboard(texto);
    } catch (error) {
      console.error(`Error en handleCopyToClipBoar: ${error}`);
      return;
    }
  }
}
