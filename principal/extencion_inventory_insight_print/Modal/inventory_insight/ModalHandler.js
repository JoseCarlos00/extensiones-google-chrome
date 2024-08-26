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
    this._tableContent = document.querySelector('#myModalShowTable #tableContent');
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
    const prefix = '#myModalShowTable';
    const copytable = document.querySelector(`${prefix} #copy-table`);
    const copyItems = document.querySelector(`${prefix} #copy-items`);

    const eventManager = new EventManagerCopy();

    if (!eventManager) {
      throw new Error('No se encontró el EventManager');
    }

    if (copytable) {
      copytable.addEventListener('click', e =>
        eventManager.handleEvent({ ev: e, tableContent: this._tableContent })
      );
    } else {
      console.error('No se encontró el elemento #copy-table');
    }

    if (copyItems) {
      copyItems.addEventListener('click', e =>
        eventManager.handleEvent({ ev: e, tableContent: this._tableContent })
      );
    } else {
      console.error('No se encontró el elemento #copy-items');
    }
  }

  async _setEventClickModalTable() {
    try {
      await this._valitateElementsTable();
      const eventManager = new EventManager({
        updateRowCounter: this._updateRowCounter,
        tableContent: this._tableContent,
      });

      this._tableContent.addEventListener('click', e => eventManager.handleEvent({ ev: e }));
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

      this._modal = modal;
      await this._initialVariables();
      await this._setEventClickModalTable();
      this._setEventsForCopyButtons();
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

class EventManager {
  constructor({ updateRowCounter, tableContent }) {
    this._tableContent = tableContent;
    this._uiIggridIndicator = new UiIggridIndicator();
    this._updateRowCounter = updateRowCounter;
  }

  handleEvent({ ev }) {
    const { target, type } = ev;
    const { nodeName } = target;

    if (type === 'click') {
      this.#handleClick(target, nodeName);
    }
  }

  #handleClick(target, nodeName) {
    const { classList } = target;

    if (classList.contains('delete-row')) {
      this.#deleteRow(target);
    } else if (classList.contains('ui-iggrid-headertext')) {
      const th = target.closest('th');
      this.#handleSortTable(th);
    }

    if (nodeName === 'INPUT') {
      target.focus();
      target.select();
    } else if (nodeName === 'TH') {
      this.#handleSortTable(target);
    }
  }

  #validateElement(element) {
    if (!element) {
      throw new Error('El elemento HTML proporcionado es nulo o indefinido');
    }
  }

  async #handleSortTable(element) {
    this.#validateElement(element);

    const { classList, dataset } = element;
    const columnIndex = parseInt(dataset.columnIndex, 10);

    if (isNaN(columnIndex)) {
      throw new Error('Atributo "data-column-index" no encontrado en el elemento <th>');
    }

    this._uiIggridIndicator.setElementSelected(element);

    const sortOrder = classList.contains('ui-iggrid-colheaderasc') ? 'desc' : 'asc';

    classList.toggle('ui-iggrid-colheaderasc', sortOrder === 'asc');
    classList.toggle('ui-iggrid-colheaderdesc', sortOrder === 'desc');

    this._uiIggridIndicator.showIndicator(sortOrder);
    sortTable({ columnIndex, table: this._tableContent, sortOrder });
  }

  #deleteRow(element) {
    this.#validateElement(element);

    const trSelected = element.closest('tr');
    if (trSelected) {
      trSelected.remove();
      this._updateRowCounter();
    }
  }
}

class EventManagerCopy {
  elemetSelected = null;
  tableContent = null;
  selector = {
    item: "td[aria-describedby='ListPaneDataGrid_ITEM'] input",
    location: "td[aria-describedby='ListPaneDataGrid_LOCATION'] input",
  };

  handleEvent({ ev, tableContent }) {
    this.tableContent = tableContent;

    const { target: element, type } = ev;
    const { nodeName } = ev.target;

    if (type === 'click') {
      if (nodeName === 'I') {
        this.elemetSelected = element.parentElement;
      } else {
        this.elemetSelected = element;
      }

      this.#handleOnClick();
    }
  }

  #handleOnClick() {
    if (!this.elemetSelected) {
      throw new Error('Error: [handleOnClick] No se encontro un elemento selecionado');
    }

    const { id } = this.elemetSelected.dataset;
    this.#handleCopyToClipBoar(id);
  }

  #getTextToCopy({ id, rows }) {
    const { item: itemSelector, location: locationSelector } = this.selector;

    const getElementValue = (element, selector) => {
      const el = element.querySelector(selector);
      return el ? el.value.trim() : '';
    };

    const itemSql = () =>
      rows
        .map(row => `'${getElementValue(row, itemSelector)}'`)
        .filter(Boolean)
        .join(',\n');

    const itemLocation = () =>
      rows
        .map(
          row => `${getElementValue(row, itemSelector)}\t${getElementValue(row, locationSelector)}`
        )
        .filter(Boolean)
        .join('\n');

    const handleCopyMap = {
      'item-sql': itemSql,
      'item-location': itemLocation,
    };

    // Verifica si el id es válido
    if (!handleCopyMap[id]) {
      console.error(`No se encontró una función asociada al ID: ${id}`);
      return null;
    }

    return handleCopyMap[id]();
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

  async #handleCopyToClipBoar(id) {
    try {
      const rows = Array.from(this.tableContent.querySelectorAll('tbody tr'));

      if (rows.length <= 1) {
        const result = await this.#isTableEmptyOrSingleRow();

        if (result) {
          console.warn('No hay filas en la tabla');
          ToastAlert.showAlertFullTop('No hay filas en la tabla', 'info');
        }

        return;
      }

      const texto = this.#getTextToCopy({ id, rows });

      if (!texto) {
        console.warn('El texto generado está vacío');
        ToastAlert.showAlertFullTop('No se pudo generar texto para copiar', 'warning');
        return;
      }

      // Copia el texto al portapapeles
      copyToClipboard(texto);
    } catch (error) {
      console.error(`Error en handleCopyToClipBoar: ${error}`);
      return;
    }
  }
}
