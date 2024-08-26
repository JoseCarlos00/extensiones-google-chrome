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
    this.internalDataSelector = {
      internalNumber: "td[aria-describedby='ListPaneDataGrid_INTERNAL_LOCATION_INV']",
    };
  }

  async _openModal() {
    this.modal.style.display = 'block';
  }

  async setModalElement(modal) {
    try {
      if (!modal) {
        throw new Error('No se encontró el modal para abrir');
      }

      this.modal = modal;
    } catch (error) {
      console.error(`Error en setModalElement: ${error}`);
    }
  }

  async handleOpenModal() {
    try {
      await this._openModal();
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
