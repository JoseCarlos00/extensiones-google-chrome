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
    this.uiIggridIndicator = new UiIggridIndicator();
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

    if (firstInput) {
      setTimeout(() => {
        firstInput.focus();
        firstInput.select();
      }, 50);
    }
  }

  async _openModal() {
    this.modal.style.display = 'block';
  }

  deleteRow(element) {
    if (!element) {
      throw new Error('No se encotro un elemento HTML');
    }

    const trSelected = element.closest('tr');

    if (trSelected) {
      trSelected.remove();

      this.updateRowCounter();
    }
  }

  async handleSortTable(element) {
    if (!element) {
      throw new Error('No se encotro un elemento HTML');
    }

    const { classList, dataset } = element;
    const columnIndex = parseInt(dataset.columnIndex, 10);

    if (isNaN(columnIndex)) {
      throw new Error('No se encontró el atributo "data-column-index" en el elemento <th>');
    }

    this.uiIggridIndicator.setElementSelected(element);

    let sortOrder;

    if (classList.contains('ui-iggrid-colheaderasc')) {
      // Orden descendente
      classList.replace('ui-iggrid-colheaderasc', 'ui-iggrid-colheaderdesc');
      sortOrder = 'desc';
    } else {
      // Orden ascendente (si estaba en descendente o sin ordenar)
      classList.remove('ui-iggrid-colheaderdesc');
      classList.add('ui-iggrid-colheaderasc');
      sortOrder = 'asc';
    }

    this.uiIggridIndicator.showIndicator(sortOrder);
    sortTable({ columnIndex, table: this.tableContent, sortOrder });
  }

  handleEventCLick(e) {
    const { target } = e;
    const { classList, tagName } = target;

    if (classList.contains('delete-row')) {
      this.deleteRow(target);
    } else if (classList.contains('ui-iggrid-headertext')) {
      const th = target.closest('th');
      this.handleSortTable(th);
    }

    if (tagName === 'INPUT') {
      target.focus();
      target.select();
    } else if (tagName === 'TH') {
      this.handleSortTable(target);
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

  /**
   * TODO: Refactorizar
   */
  async setEventTeclas() {
    try {
      await this.valitateElementsTable();
      const inputs = Array.from(this.tableContent.querySelectorAll('td[aria-describedby] input'));

      if (inputs.length == 0) {
        console.warn(
          '[setEventTeclas]: No se encontraron elementos td[aria-describedby] input:not(.exclude)'
        );
        return;
      }

      inputs.forEach(cell => {
        // cell.setAttribute('tabindex', '0');
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
      this.uiIggridIndicator.deleteAllIdicator();
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

function sortTable({ columnIndex, table, sortOrder = 'asc' }) {
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  if (rows.length === 0) {
    console.warn('No se encontraron filas para ordenar');
    return;
  }

  rows.sort((a, b) => {
    // Obtener los inputs de las filas a y b
    const inputA = a.cells[columnIndex].querySelector('input');
    const inputB = b.cells[columnIndex].querySelector('input');

    // Verificar si alguna fila tiene la clase 'item-exist'
    const hasClassA = a.cells[columnIndex].classList.contains('item-exist');
    const hasClassB = b.cells[columnIndex].classList.contains('item-exist');

    let comparison = 0;

    // Ordenar primero por 'item-exist' y luego por valor de input
    if (hasClassA && !hasClassB) {
      // return -1; // a viene antes que b
      comparison = -1; // a viene antes que b
    } else if (!hasClassA && hasClassB) {
      // return 1; // b viene antes que a
      comparison = 1; // b viene antes que a
    } else {
      // Ambas tienen o no tienen 'item-exist', ordenar por valor del input
      const aValue = inputA.value;
      const bValue = inputB.value;
      // return aValue.localeCompare(bValue);
      comparison = aValue.localeCompare(bValue);
    }

    // Si sortOrder es 'desc', invertir la comparación
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  // Limpiar y reordenar las filas en el tbody
  rows.forEach(row => tbody.appendChild(row));
}
