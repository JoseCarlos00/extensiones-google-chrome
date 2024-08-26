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

      if (texto) {
        copyToClipboard(texto);
      }
    } catch (error) {
      console.error(`Error en handleCopyToClipBoar: ${error}`);
      return;
    }
  }
}

// Objeto para almacenar los datos
const datos = [];

function registrarDatos() {
  const formItem = document.querySelector('#myModalInserToItem > div > form');
  const itemElement = document.querySelector('#myModalInserToItem #inserItem')?.value;

  if (!formItem || !itemElement) return;

  datos.length = 0;

  // Dividir el texto en lineas
  const lineas = itemElement.split('\n');

  // Procesar cada linea
  lineas.forEach(linea => {
    const regex = /^(\d+-\d+-\d+),?\s*$/;
    const match = linea.match(regex);

    if (match) {
      // match[1] contiene el valor sin la coma al final
      const valorSinComa = match[1];

      if (!datos.includes(valorSinComa)) {
        console.log('No existe: Insertar');
        datos.push(valorSinComa);
      }
    }
  });

  // Limpiar el campo de texto
  formItem.reset();

  // Insertar datos
  insertarItems();
}

function insertarItems() {
  const table = document.querySelector('#myModalAssigment #tableContent');
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.forEach(row => {
    const inputTd = row.querySelector('td[aria-describedby="ListPaneDataGrid_ITEM"]');
    const inputItem = row.querySelector('td[aria-describedby="ListPaneDataGrid_ITEM"] input');

    if (datos.includes(inputItem.value)) {
      inputTd.classList.add('item-exist');
    }
  });

  // Cerrar modal
  setTimeout(() => {
    const modal = document.getElementById('myModalInserToItem');
    modal && (modal.style.display = 'none');
  }, 250);
}

function setEventModal(elements) {
  const { btnOpen, btnClose, modal, modalInsert, btnCloseModal, btnOpenModal } = elements;

  /** MODAL INSERTAR ITEM */
  // Cuando el usuario hace clic en el botón, abre el modal
  btnOpenModal.addEventListener('click', function () {
    const textareaInsertarItem = document.querySelector('#myModalInserToItem #inserItem');
    modalInsert.style.display = 'block';

    if (textareaInsertarItem) {
      setTimeout(() => textareaInsertarItem.focus(), 50);
    }
  });
}
