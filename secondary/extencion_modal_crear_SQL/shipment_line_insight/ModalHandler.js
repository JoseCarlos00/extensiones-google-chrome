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
      internalNumber: "td[aria-describedby='ListPaneDataGrid_INTERNAL_LOCATION_INV']",
    };
    this.prefix = '#myModal .modal-content ';
    this.internalShipmentNum = null;
    this.status1 = null;
  }

  #setinternalShipmentNum() {
    this.internalShipmentNum = document.querySelector(`${this.prefix} #internal_shipment_line_num`);
  }

  #setStatus1() {
    this.status1 = document.querySelector(`${this.prefix} #status1`);
  }

  async #getInternalData(rows) {
    if (rows.length === 0) {
      console.error('No se enontraron filas');
      return;
    }

    const internalData = rows
      .map(item => {
        const internalNumber = item
          .querySelector(this.internalDataSelector.internalNumber)
          ?.textContent.trim();

        return `'${internalNumber}'`;
      })
      .filter(Boolean)
      .join('\n');

    return internalData;
  }

  async #setInternalData() {
    const internalData = await this.#getInternalData();
  }

  async #processInternalTableData() {
    if (!this.tbody) {
      throw new Error('No se encontro el elemento <tbody>');
    }

    const rows = Array.from(tbody.querySelectorAll('tr'));

    if (rows.length === 0) {
      throw new Error('No se encontraron filas en el <tbody>');
    }

    await this.#getInternalData(rows);
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
      this.#setinternalShipmentNum();
      this.#setStatus1();
    } catch (error) {
      console.error(`Error en setModalElement: ${error}`);
    }
  }

  async handleOpenModal() {
    try {
      await this.#openModal();
      this.status1.focus();
    } catch (error) {
      console.error(`Error en handleOpenModal: ${error}`);
    }
  }

  handleCopyToClipBoar() {
    try {
      const texto = '';
      const codeText = document.querySelector('code.language-sql')?.textContent;

      if (texto) {
        copyToClipboard(texto);
      }

      console.log('codeText\n', codeText);
    } catch (error) {
      console.error(`Error en handleCopyToClipBoar: ${error}`);
      return;
    }
  }
}
