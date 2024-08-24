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
    this.tbodyTable = null;
    this.tableContent = null;
  }

  async valitateElementsTable() {
    return new Promise((resolve, reject) => {
      if (!this.tbodyTable) {
        reject('No se encontro el elemento <tbody>');
      }

      if (!this.tableContent) {
        reject("Error:[createTbody] No se encontro el elemento <table id='tableContent'>");
      }

      resolve();
    });
  }

  async createTbody() {
    try {
      await this.valitateElementsTable();

      const rows = Array.from(this.tbodyTable.rows);

      // Create new tbody
      const newTbody = document.createElement('tbody');

      if (rows.length === 0) {
        newTbody.innerHTML = '<tr><td colspan="3">No hay datos para mostrar</td></tr>';
        return newTbody;
      }

      rows.forEach(row => {
        const fila = row.childNodes;
        const tr = document.createElement('tr');

        fila.forEach(td => {
          const ariadescribedby = td.getAttribute('aria-describedby');

          if (ariadescribedby === 'ListPaneDataGrid_ITEM') {
            const tdItem = document.createElement('td');
            tdItem.innerHTML = `<input value="${td.textContent} "tabindex="0" class="input-text">`;
            tdItem.setAttribute('aria-describedby', ariadescribedby);
            tr.prepend(tdItem);
          }

          if (ariadescribedby === 'ListPaneDataGrid_LOCATION') {
            const tdLoc = document.createElement('td');
            tdLoc.innerHTML = `<input value="${td.textContent} "tabindex="0" class="input-text">`;
            tdLoc.setAttribute('aria-describedby', ariadescribedby);
            tr.appendChild(tdLoc);
          }

          if (ariadescribedby === 'ListPaneDataGrid_ITEM_DESC') {
            const tdItemDesc = document.createElement('td');

            tdItemDesc.innerHTML = `<input value="${td.textContent} "class="input-text exclude" tabindex="-1">`;
            tdItemDesc.setAttribute('aria-describedby', ariadescribedby);

            const divDelete = document.createElement('div');
            divDelete.className = 'delete-row';

            tdItemDesc.appendChild(divDelete);

            tr.appendChild(tdItemDesc);
          }
        });

        newTbody.appendChild(tr);
      });

      return newTbody;
    } catch (error) {
      console.error(`Error: [createTbody] Ha Ocurrido un error al crear el new <tbody>: ${error}`);
    }
  }

  async insertTbody() {
    try {
      await this.valitateElementsTable();

      const newTbody = await this.createTbody();

      const tbodyExist = this.tableContent.querySelector('tbody');
      tbodyExist && tbodyExist.remove();

      this.tableContent.appendChild(newTbody);
    } catch (error) {
      console.error('Error: [insertTbody] Ha Ocurrido un error al insertar el new <tbody>:', error);
    }
  }

  async initialVariables() {
    this.tbodyTable = document.querySelector('#ListPaneDataGrid tbody');
    this.tableContent = document.querySelector('#myModalShowTable #tableContent');
  }

  focusFirstInput() {
    const firstInput = this.tableContent.querySelector('input.input-text');

    setTimeout(() => {
      if (firstInput) {
        firstInput.focus();
        firstInput.select();
      }
    }, 50);
  }

  async _openModal() {
    this.modal.style.display = 'block';
  }

  deleteRow(element) {
    const trSelected = element.closest('tr');

    if (trSelected) {
      trSelected.remove();

      this.updateRowCounter();
    }
  }

  handleEventCLick(e) {
    const { target } = e;
    const { classList, tagName } = target;

    if (classList.contains('delete-row')) {
      this.deleteRow(target);
    }

    if (tagName === 'INPUT') {
      this.focusFirstInput();
      target.select();
    }
  }

  async setEventClickModalTable() {
    try {
      await this.valitateElementsTable();

      this.tableContent.addEventListener('click', e => this.handleEventCLick(e));
    } catch (error) {
      console.error(
        'Error: Ha ocurrido un error al crear el Evento click en #tableContent: ',
        error
      );
    }
  }

  async setModalElement(modal) {
    try {
      if (!modal) {
        throw new Error('No se encontró el modal para abrir');
      }

      this.modal = modal;
      await this.initialVariables();
      await this.setEventClickModalTable();
    } catch (error) {
      console.error(`Error en setModalElement: ${error}`);
    }
  }

  async setEventTeclas() {
    try {
      await this.valitateElementsTable();
      const inputs = Array.from(
        this.tableContent.querySelectorAll('td[aria-describedby] input:not(.exclude)')
      );

      if (inputs.length == 0) {
        console.warn('No se encontraron elementos td[aria-describedby] input:not(.exclude)');
        return;
      }

      inputs.forEach(cell => {
        cell.setAttribute('tabindex', '0');
        cell.addEventListener('keydown', handleKeydown);
      });

      function handleKeydown(event) {
        const cell = event.target;
        const row = cell.parentElement.parentElement;
        const colIndex = Array.from(row.children).indexOf(cell.parentElement);

        let nextCell;

        switch (event.key) {
          case 'ArrowRight':
            nextCell = getNextCell(row, colIndex + 1);
            break;
          case 'ArrowLeft':
            nextCell = getNextCell(row, colIndex - 1);
            break;
          case 'ArrowDown':
            nextCell = getCellBelow(row, colIndex);
            break;
          case 'ArrowUp':
            nextCell = getCellAbove(row, colIndex);
            break;
        }

        if (nextCell) {
          event.preventDefault();
          nextCell?.focus();
          nextCell?.select();
        }
      }

      function getNextCell(row, colIndex) {
        return row.children[colIndex]?.querySelector('input');
      }

      function getCellBelow(row, colIndex) {
        const nextRow = row.nextElementSibling;
        return nextRow?.children[colIndex]?.querySelector('input');
      }

      function getCellAbove(row, colIndex) {
        const prevRow = row.previousElementSibling;
        return prevRow?.children[colIndex]?.querySelector('input');
      }
    } catch (error) {}
  }

  async updateRowCounter() {
    const contador = document.querySelector('#myModalShowTable #rowCounter');

    if (!contador) {
      console.error('El elemento contador no se encuentra en el DOM.');
      return;
    }

    const rows = Array.from(this.tableContent.querySelectorAll('tbody tr'));

    // Actualizar el texto del contador con el número de filas
    contador.textContent = `Filas: ${rows.length}`;
  }

  async handleOpenModal() {
    try {
      await this.insertTbody();
      await this.setEventTeclas();
      await this._openModal();
      await this.updateRowCounter();
      this.focusFirstInput();
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

function showIndicator({ columnIndex, table }) {
  const thHeader = table.querySelectorAll('thead tr th');

  if (!thHeader) return;

  thHeader.forEach((th, index) => {
    const indicador = th.querySelector('.ui-iggrid-indicatorcontainer');

    if (index === columnIndex) {
      indicador && (indicador.style.display = 'block');
    } else {
      indicador && (indicador.style.display = 'none');
    }
  });
}

function sortTable(params) {
  showIndicator(params);

  const { columnIndex, table } = params;

  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((a, b) => {
    // Obtener los inputs de las filas a y b
    const inputA = a.querySelectorAll('input')[columnIndex];
    const inputB = b.querySelectorAll('input')[columnIndex];

    const tdItemA = a.querySelector('td[aria-describedby="ListPaneDataGrid_ITEM"]');
    const tdItemB = b.querySelector('td[aria-describedby="ListPaneDataGrid_ITEM"]');

    // Verificar si alguna fila tiene la clase 'item-exist'
    const hasClassA = tdItemA.classList.contains('item-exist');
    const hasClassB = tdItemB.classList.contains('item-exist');

    // Ordenar primero por 'item-exist' y luego por valor de input
    if (hasClassA && !hasClassB) {
      return -1; // a viene antes que b
    } else if (!hasClassA && hasClassB) {
      return 1; // b viene antes que a
    } else {
      // Ambas tienen o no tienen 'item-exist', ordenar por valor del input
      const aValue = inputA.value;
      const bValue = inputB.value;
      return aValue.localeCompare(bValue);
    }
  });

  // Limpiar y reordenar las filas en el tbody
  rows.forEach(row => tbody.appendChild(row));
}
