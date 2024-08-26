/**
 * Manejador de Modal
 *
 * Funciones Obligatorias:
 * 1. setModalElement -> initialVariables
 * 2  handleOpenModal
 * 3  handleCopyToClipBoar
 */

class ModalHandlerInsertItem {
  constructor() {
    this.modal = null;
    this.formItem = null;
    this.inserItem = null;
    this.datos = [];
  }

  datosReset() {
    this.datos.length = 0;
  }

  async initialVatiables() {
    this.formItem = document.getElementById('formInsertItem');
    this.inserItem = this.formItem.inserItem;
  }

  insertarItems() {
    const table = document.querySelector('#myModalShowTable #tableContent');
    const rows = Array.from(table.querySelectorAll('tbody tr'));

    if (rows.length === 0) {
      console.warn('No se ecnontraron filas en la tabla');
    }

    rows.forEach(row => {
      const td = row.querySelector('td[aria-describedby="ListPaneDataGrid_ITEM"]');
      const inputItem = row.querySelector('td[aria-describedby="ListPaneDataGrid_ITEM"] input');
      const item = inputItem ? inputItem.value.trim() : '';

      if (item && this.datos.includes(item)) {
        td.classList.add('item-exist');
      }
    });

    this.datosReset();
  }

  registrarDatos(e) {
    e.preventDefault();

    const { inserItem, formItem, datos } = this;

    if (!inserItem || !formItem) {
      console.error('No se encontro el formulario #formInsertItem y sus campos');
      return;
    }

    this.datosReset();

    // Dividir el texto en lineas
    const lineas = inserItem.value.split('\n');

    // Procesar cada linea
    lineas.forEach(linea => {
      const regex = /^(\d+-\d+-\d+),?\s*$/;
      const match = linea.match(regex);

      if (match) {
        // match[1] contiene el valor sin la coma al final
        const valorSinComa = match[1];

        if (!datos.includes(valorSinComa)) {
          datos.push(valorSinComa);
        }
      }
    });

    if (datos.length === 0) {
      inserItem.classList.add('is-invalid');
      return;
    }

    // Limpiar el campo de texto
    inserItem.classList.remove('is-invalid');
    formItem.reset();

    setTimeout(() => this._closeModal(), 100);

    // Insertar datos
    this.insertarItems();
  }

  setEventListenerS() {
    if (!this.formItem) {
      throw new Error('No se encontro el formulalio #formInsertItem');
    }

    this.formItem.addEventListener('submit', e => this.registrarDatos(e));
  }

  async _openModal() {
    this.modal.style.display = 'block';
  }

  async _closeModal() {
    this.modal.style.display = 'none';
  }

  async setModalElement(modal) {
    try {
      if (!modal) {
        throw new Error('No se encontró el modal para abrir');
      }

      this.modal = modal;

      await this.initialVatiables();
      this.setEventListenerS();
    } catch (error) {
      console.error(`Error en setModalElement: ${error}`);
    }
  }

  async handleOpenModal() {
    try {
      await this._openModal();

      if (this.inserItem) {
        setTimeout(() => this.inserItem.focus(), 50);
      }
    } catch (error) {
      console.error(`Error en handleOpenModal: ${error}`);
    }
  }
}
