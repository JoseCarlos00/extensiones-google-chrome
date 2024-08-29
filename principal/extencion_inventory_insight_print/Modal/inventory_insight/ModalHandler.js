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
    this._modal = null;
    this._tbodyTable = null;
    this._tableContent = null;
    this._listPaneDataGridPopover = null;
    this._prefix = '#myModalShowTable';
  }

  async _valitateElementsTable() {
    return new Promise((resolve, reject) => {
      if (!this._tbodyTable) {
        reject('No se encontro el elemento <tbody>');
      }

      if (!this._tableContent) {
        reject("Error:[createTbody] No se encontro el elemento <table id='tableContent'>");
      }

      resolve();
    });
  }

  async _createTbody() {
    try {
      await this._valitateElementsTable();

      const rows = Array.from(this._tbodyTable.rows);

      // Create new tbody
      const newTbody = document.createElement('tbody');

      if (rows.length === 0) {
        newTbody.innerHTML =
          '<tr><td colspan="3">No hay datos para mostrar <div class="delete-row"></div></td></tr>';
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

  async _insertTbody() {
    try {
      await this._valitateElementsTable();

      const newTbody = await this._createTbody();

      const tbodyExist = this._tableContent.querySelector('tbody');
      tbodyExist && tbodyExist.remove();

      this._tableContent.appendChild(newTbody);
    } catch (error) {
      console.error('Error: [insertTbody] Ha Ocurrido un error al insertar el new <tbody>:', error);
    }
  }

  async _initialVariables() {
    this._tbodyTable = document.querySelector('#ListPaneDataGrid tbody');
    this._tableContent = document.querySelector(`${this._prefix} #tableContent`);
    this._listPaneDataGridPopover = document.querySelector(
      `${this._prefix} #ListPaneDataGrid_popover`
    );

    if (!this._tbodyTable) {
      throw new Error('No se encontro el elemento #ListPaneDataGrid tbody');
    }

    if (!this._tableContent) {
      throw new Error('No se encontro el elemento #tableContent');
    }

    if (!this._listPaneDataGridPopover) {
      throw new Error('No se encontro el elemento #ListPaneDataGrid_popover');
    }
  }

  _focusFirstInput() {
    const firstInput = this._tableContent.querySelector('input.input-text');

    if (firstInput) {
      setTimeout(() => {
        firstInput.focus();
        firstInput.select();
      }, 50);
    }
  }

  async _openModal() {
    this._modal.style.display = 'block';
  }

  _setEventsForCopyButtons() {
    const copytable = document.querySelector(`${this._prefix} #copy-table`);

    const tooltipContainer = document.querySelector(
      `${this._prefix} .tooltip-container .tooltip-content`
    );

    const eventManager = new EventManagerCopy({
      list: this._listPaneDataGridPopover,
      tableContent: this._tableContent,
    });

    if (!eventManager) {
      throw new Error('No se encontró el EventManager');
    }

    if (copytable) {
      copytable.addEventListener('click', e => eventManager.handleEvent({ ev: e }));
    } else {
      console.warn('No se encontró el elemento #copy-table');
    }

    if (tooltipContainer) {
      tooltipContainer.addEventListener('click', e => {
        const { target } = e;
        const { nodeName } = target;

        if (nodeName === 'BUTTON') {
          eventManager.handleEvent({ ev: e });
        }
      });
    } else {
      console.warn('No se encontró el elemento .tooltip-container .tooltip-content');
    }
  }

  async _setEventClickModalTable() {
    try {
      await this._valitateElementsTable();

      const eventManager = new EventManager({
        updateRowCounter: this._updateRowCounter,
        tableContent: this._tableContent,
        list: this._listPaneDataGridPopover,
      });

      this._tableContent.addEventListener('click', e => eventManager.handleEvent({ ev: e }));
      this._modal.querySelector('.modal-content').addEventListener('click', e => {
        if (e.target.classList.contains('modal-content')) {
          eventManager.handleEvent({ ev: e });
        }
      });
    } catch (error) {
      console.warn(
        'Error: Ha ocurrido un error al crear el Evento click en #tableContent: ',
        error
      );
    }
  }

  _setEventHideElement() {
    const btnHideElement = document.querySelector(`${this._prefix} #hide-elements`);

    const ulList = document.querySelector(`${this._prefix} #list-elements`);

    if (btnHideElement && this._listPaneDataGridPopover) {
      btnHideElement.addEventListener('click', e => {
        this._listPaneDataGridPopover.classList.toggle('hidden');
      });
    } else {
      console.warn('No se encontró el elemento #hide-elements');
    }

    if (ulList) {
      const eventManager = new EventManagerHideElement();
      ulList.addEventListener('click', e => eventManager.handleEvent({ ev: e }));
    } else {
      console.warn('No se encontró el elemento #list-elements');
    }
  }

  async _createNewRow() {
    const tr = document.createElement('tr');

    const tdItem = document.createElement('td');
    tdItem.innerHTML = `<input value="" tabindex="0" class="input-text">`;
    tdItem.setAttribute('aria-describedby', 'ListPaneDataGrid_ITEM');
    tr.prepend(tdItem);

    const tdLoc = document.createElement('td');
    tdLoc.innerHTML = `<input value="" tabindex="0" class="input-text">`;
    tdLoc.setAttribute('aria-describedby', 'ListPaneDataGrid_LOCATION');
    tr.appendChild(tdLoc);

    const tdItemDesc = document.createElement('td');
    tdItemDesc.innerHTML = `<input value="" class="input-text exclude" tabindex="-1">`;
    tdItemDesc.setAttribute('aria-describedby', 'ListPaneDataGrid_ITEM_DESC');

    const divDelete = document.createElement('div');
    divDelete.className = 'delete-row';
    tdItemDesc.appendChild(divDelete);

    tr.appendChild(tdItemDesc);

    return tr;
  }

  #isTableEmptyOrSingleRow() {
    return new Promise(resolve => {
      const firsrRow = this._tableContent.querySelector('td');
      const txt = firsrRow ? firsrRow.textContent.trim().toLowerCase() : '';

      if (!firsrRow || txt.includes('no hay datos')) {
        firsrRow.remove();
        resolve(true);
        return;
      }

      resolve(false);
    });
  }

  async _insertNewRow() {
    try {
      await this._valitateElementsTable();

      const tbodyExist = this._tableContent.querySelector('tbody');
      const newRow = await this._createNewRow();

      if (tbodyExist) {
        await this.#isTableEmptyOrSingleRow();
        tbodyExist.appendChild(newRow);
      } else {
        const newTbody = document.createElement('tbody');
        newTbody.appendChild(newRow);
        this._tableContent.appendChild(newTbody);
      }
    } catch (error) {
      console.error(
        'Error: [insertNewRow] Ha Ocurrido un error al insertar una nueva fila:',
        error
      );
    }
  }

  _setEventInsertRow() {
    const btnInsertRow = document.querySelector(`${this._prefix} #insertRow`);

    if (!btnInsertRow) {
      console.warn('No se encontró el elemento #insert-row');
      return;
    }

    btnInsertRow.addEventListener('click', e => this._insertNewRow());
  }

  async setModalElement(modal) {
    try {
      if (!modal) {
        throw new Error('No se encontró el modal para abrir');
      }

      this._modal = modal;
      await this._initialVariables();
      await this._setEventClickModalTable();
      this._setEventsForCopyButtons();
      this._setEventHideElement();
      this._setEventInsertRow();
    } catch (error) {
      console.error(`Error en setModalElement: ${error}`);
    }
  }

  /**
   * TODO: Refactorizar
   */
  async _setEventTeclas() {
    try {
      await this._valitateElementsTable();
      const inputs = Array.from(this._tableContent.querySelectorAll('td[aria-describedby] input'));

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

  async _updateRowCounter() {
    const contador = document.querySelector('#myModalShowTable #rowCounter');

    if (!contador) {
      console.error('El elemento contador no se encuentra en el DOM.');
      return;
    }

    const rows = Array.from(this._tableContent.querySelectorAll('tbody tr'));

    // Actualizar el texto del contador con el número de filas
    contador.textContent = `Filas: ${rows.length}`;
  }

  async handleOpenModal() {
    try {
      await this._insertTbody();
      await this._setEventTeclas();
      await this._openModal();
      await this._updateRowCounter();
      UiIggridIndicator.deleteAllIdicator();
      this._focusFirstInput();
    } catch (error) {
      console.error(`Error en handleOpenModal: ${error}`);
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
