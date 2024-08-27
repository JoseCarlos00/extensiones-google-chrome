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

function getValueLocalStorage() {
  const storedState = localStorage.getItem('storedStateHide');

  const configurationInitial = {
    'copy-table': { name: 'Copiar Tabla', hide: false },
    'insert-item': { name: 'Insertar Item', hide: true },
    'copy-item': { name: 'Copiar Item', hide: true },
    'counter-row': { name: 'Contar Filas', hide: false },
  };

  return JSON.parse(storedState) ?? configurationInitial;
}

function setValueLocalStorage(configurationObject) {
  localStorage.setItem('storedStateHide', JSON.stringify(configurationObject));
}

class EventManagerHideElement {
  #prefix = '#myModalShowTable';
  #configurationObjectHide = getValueLocalStorage();

  constructor() {
    this.elementsMap = {
      'copy-table': document.querySelector(`${this.#prefix} #copy-table`),
      'insert-item': document.querySelector(`${this.#prefix} #insertItemModal`),
      'copy-item': document.querySelector(`${this.#prefix} #copy-items`),
      'counter-row': document.querySelector(`${this.#prefix} #rowCounter`),
    };

    this.elementSelected = null;
  }

  handleEvent({ ev }) {
    const { target, type } = ev;

    if (type === 'click') {
      this.elementSelected = this.#getElementToHandle(target);
      if (this.elementSelected) {
        this.#handleClick();
      }
    }
  }

  #getElementToHandle(target) {
    return target?.closest('li') || target;
  }

  #handleClick() {
    const { nodeName, dataset } = this.elementSelected;
    const uiIcon = this.elementSelected.querySelector('.ui-icon');

    if (nodeName !== 'LI' || !uiIcon || !dataset.hide) {
      console.warn('Elemento no válido o faltan atributos.');
      return;
    }

    this.#toggleIcon(uiIcon);
    this.#handleHideElement(dataset.hide);
  }

  #toggleIcon(uiIcon) {
    uiIcon.classList.toggle('ui-iggrid-icon-hide');
    uiIcon.classList.toggle('ui-iggrid-icon-show');
  }

  #handleHideElement(hide) {
    const elementToHide = this.elementsMap[hide];

    if (!elementToHide) {
      console.warn('No se encontró un [data-hide] válido');
      return;
    }

    elementToHide.classList.toggle('hidden');
    this.#configurationObjectHide[hide].hide = elementToHide.classList.contains('hidden');

    setValueLocalStorage(this.#configurationObjectHide);
  }
}
