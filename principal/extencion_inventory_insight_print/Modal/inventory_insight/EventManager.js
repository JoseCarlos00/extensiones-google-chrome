class EventManager {
  constructor({ updateRowCounter, tableContent, list }) {
    this._tableContent = tableContent;
    this._uiIggridIndicator = new UiIggridIndicator();
    this._updateRowCounter = updateRowCounter;
    this._list = list;
  }

  handleEvent({ ev }) {
    const { target, type } = ev;
    const { nodeName } = target;

    const isHide = this._list.classList.contains('hidden');

    if (type === 'click') {
      if (isHide) {
        this.#handleClick(target, nodeName);
      } else {
        this._list.classList.add('hidden');
      }
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
  constructor({ list, tableContent }) {
    this._list = list;
    this.tableContent = tableContent;
    this.elemetSelected = null;
    this.selector = {
      item: "td[aria-describedby='ListPaneDataGrid_ITEM'] input",
      location: "td[aria-describedby='ListPaneDataGrid_LOCATION'] input",
    };
  }

  handleEvent({ ev }) {
    const { target: element, type } = ev;
    const { nodeName } = ev.target;

    if (type === 'click') {
      if (nodeName === 'I') {
        this.elemetSelected = element.parentElement;
      } else {
        this.elemetSelected = element;
      }

      this._list.classList.add('hidden');
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

    /**
     * Format [ 'item', ]
     * @returns {String}
     */
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

    const itemExist = () => {
      const items = itemSql();
      return `SELECT DISTINCT\n item\n\nFROM item_location_assignment\n\nWHERE item\nIN (\n${items}\n  );`;
    };

    const updateCapacity = () => {
      const items = itemSql();
      return `UPDATE item_location_capacity\nSET\nMAXIMUM_QTY = 2,\nQUANTITY_UM = 'CJ',\nMINIMUM_RPLN_PCT = 50\n\nWHERE location_type = 'Generica Permanente S'\nAND item IN (\n${items}\n  );`;
    };

    const showCapacity = () => {
      const items = itemSql();
      const SELECT = `SELECT DISTINCT\n  I.item,\n  I.item_color,\n  CAST(ILC.MAXIMUM_QTY AS INT) AS MAXIMUM_QTY,\n  ILC.quantity_um,\n  ILC.MINIMUM_RPLN_PCT,\n  ILC.location_type`;
      const FROM = `FROM item I\nLEFT JOIN item_location_capacity ILC  ON  ILC.item = I.item`;
      const AND1 = `AND (I.item_category1 <> 'Bulk' OR I.item_category1 IS NULL)`;
      const AND2 = `AND (ILC.location_type NOT LIKE 'Generica Permanente R' OR  ILC.location_type IS NULL)`;
      const AND3 = `AND I.item IN (\n${items}\n  )`;
      const WHERE = `WHERE I.company='FM'\n${AND1}\n${AND2}\n${AND3}\n`;
      return `${SELECT}\n\n${FROM}\n\n${WHERE}\nORDER BY 1;`;
    };

    const insertInto = () => {
      const MAXIMUM_QTY = 2;
      const QUANTITY_UM = 50;
      // ('valor1 ', 'FM', 'Generica Permanente S', 'valor2', 'CJ', 'valor3', 'JoseCarlos', DATEADD(HOUR, 6, GETDATE()), '100', '0'),

      const INSERT_INTO = `INSERT INTO item_location_capacity  (ITEM, COMPANY, LOCATION_TYPE, MAXIMUM_QTY, QUANTITY_UM, MINIMUM_RPLN_PCT, USER_STAMP, DATE_TIME_STAMP, MAXIMUM_RPLN_FILL_PCT, MINIMUM_TOPOFF_RPLN_PCT)\nVALUES\n`;

      const VALUES = rows
        .map(
          row =>
            ` ('${getElementValue(
              row,
              itemSelector
            )}', 'FM', 'Generica Permanente S', '${MAXIMUM_QTY}', 'CJ', '${QUANTITY_UM}', 'JoseCarlos', DATEADD(HOUR, 6, GETDATE()), '100', '0')`
        )
        .filter(Boolean)
        .join(',\n');

      return INSERT_INTO + VALUES;
    };

    const handleCopyMap = {
      'item-sql': itemSql,
      'item-location': itemLocation,
      'item-exist': itemExist,
      'update-capacity': updateCapacity,
      'show-capacity': showCapacity,
      'insert-into': insertInto,
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
      if (!this.tableContent) {
        throw new Error('Error:[handleCopyToClipBoar] No se encontro la pripiedad [tableContent]');
      }

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
      'insert-row': document.querySelector(`${this.#prefix} #insertRow`),
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

class EventManagerKeydown {
  constructor() {
    this.validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  }

  handleEvent({ ev }) {
    const { target, type, key } = ev;

    if (type === 'keydown' && target.nodeName === 'INPUT' && this.validKeys.includes(key)) {
      this.#handleKeydown({ input: target, key, ev });
    }
  }

  #handleKeydown({ input, key, ev }) {
    const row = input.closest('tr');
    const colIndex = Array.from(row.children).indexOf(input.closest('td'));

    const getNextCell = direction =>
      ({
        ArrowUp: () => row.previousElementSibling?.children[colIndex]?.querySelector('input'),
        ArrowDown: () => row.nextElementSibling?.children[colIndex]?.querySelector('input'),
        ArrowLeft: () => row.children[colIndex - 1]?.querySelector('input'),
        ArrowRight: () => row.children[colIndex + 1]?.querySelector('input'),
      }[direction]());

    const nextCell = getNextCell(key);

    if (nextCell) {
      ev.preventDefault();
      nextCell.focus();
      nextCell.select();
    } else {
      console.warn(`[handleKeydown] No se encontró un [nextCell] válido para la tecla ${key}`);
    }
  }
}
