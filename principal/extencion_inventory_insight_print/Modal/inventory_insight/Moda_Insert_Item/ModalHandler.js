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
    this.btnGetSentence = null;
    this.tableContent = null;
  }

  datosReset() {
    this.datos.length = 0;
  }

  async initialVatiables() {
    this.formItem = document.getElementById('formInsertItem');
    this.inserItem = this.formItem.inserItem;
    this.btnGetSentence = document.getElementById('get-sentece');
    this.tableContent = document.querySelector('#myModalShowTable #tableContent');
  }

  #isTableEmptyOrSingleRow() {
    return new Promise(resolve => {
      const firsrRow = this.tableContent.querySelector('td');
      const txt = firsrRow ? firsrRow.textContent.trim().toLowerCase() : '';

      if (!firsrRow || txt.includes('no hay datos')) {
        resolve(true);
        return;
      }

      resolve(false);
    });
  }

  #getItemsFromTable({ rows }) {
    const itemSelector = `td[aria-describedby='ListPaneDataGrid_ITEM'] input`;

    const getElementValue = (element, selector) => {
      const el = element.querySelector(selector);
      return el ? el.value.trim() : '';
    };

    const itemSql = rows
      .map(row => `'${getElementValue(row, itemSelector)}'`)
      .filter(Boolean)
      .join(',\n');

    return itemSql;
  }

  async #generateSentenceSQL({ rows }) {
    const items = await this.#getItemsFromTable({ rows });

    if (!items) {
      console.warn('No se encontreo contenido para la consulta');
      return;
    }

    const sentece = `SELECT DISTINCT item\n\nFROM item_location_assignment\n\nWHERE item\nIN (\n${items}\n  );`;

    return sentece;
  }

  async #obtenerSentencia(e) {
    e.preventDefault();

    const rows = Array.from(this.tableContent.querySelectorAll('tbody tr'));

    if (rows.length <= 1) {
      const result = await this.#isTableEmptyOrSingleRow();

      if (result) {
        console.warn('No hay filas en la tabla');
        ToastAlert.showAlertFullTop('No hay filas en la tabla', 'info');
      }

      return;
    }

    const texto = await this.#generateSentenceSQL({ rows });

    if (!texto) {
      console.warn('El texto generado está vacío');
      ToastAlert.showAlertFullTop('No se pudo generar texto para copiar', 'warning');
      return;
    }

    // Copia el texto al portapapeles
    copyToClipboard(texto);
  }

  #insertarItems() {
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

  #registrarDatos(e) {
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

    setTimeout(() => this.#closeModal(), 100);

    // Insertar datos
    this.#insertarItems();
  }

  #setEventListenerS() {
    if (this.formItem) {
      this.formItem.addEventListener('submit', e => this.#registrarDatos(e));
    } else {
      console.error('No se encontro el formulario #formInsertItem');
    }

    if (this.btnGetSentence) {
      this.btnGetSentence.addEventListener('click', e => this.#obtenerSentencia(e));
    } else {
      throw new Error('No se encontro el boton #btnGetSentence');
    }
  }

  async #openModal() {
    this.modal.style.display = 'block';
  }

  async #closeModal() {
    this.modal.style.display = 'none';
  }

  async setModalElement(modal) {
    try {
      if (!modal) {
        throw new Error('No se encontró el modal para abrir');
      }

      this.modal = modal;

      await this.initialVatiables();
      this.#setEventListenerS();
    } catch (error) {
      console.error(`Error en setModalElement: ${error}`);
    }
  }

  async handleOpenModal() {
    try {
      await this.#openModal();

      if (this.inserItem) {
        setTimeout(() => this.inserItem.focus(), 50);
      }
    } catch (error) {
      console.error(`Error en handleOpenModal: ${error}`);
    }
  }
}
