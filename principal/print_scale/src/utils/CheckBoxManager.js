class CheckBoxManager {
  constructor() {
    this.table = document.querySelector('#content');
    this.toggleHandleWrapper = null;
    this.checkboxContainer = null;
    this.toggleButton = null;
  }

  eventoClickCheckBox() {
    const { checkboxContainer, toggleButton } = this;

    if (!toggleButton) {
      console.error('No existe el elemento #toggleButton');
      return;
    }

    // Obtener el elemento del path SVG
    const togglePath = toggleButton.querySelector('.toggleIcon path');

    if (!togglePath) {
      console.error('No existe el elemento .toggleIcon path');
      return;
    }

    // Definir la función que se utilizará para manejar el evento 'click'
    const toggleButtonClickHandler = () => {
      if (!checkboxContainer) {
        console.error('[eventoClickCheckBox] No existe el elemento #checkboxContainer');
        return;
      }

      // Verificar si la clase 'mostrar' está presente en el checkboxContainer
      if (!checkboxContainer.classList.contains('show')) {
        // Si no está presente, la agregamos
        checkboxContainer.classList.add('show');
        // Cambiar el atributo "d" del path SVG para representar un símbolo de menos(- ⋀)
        togglePath.setAttribute(
          'd',
          'M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z'
        );
      } else {
        // Si está presente, la eliminamos
        checkboxContainer.classList.remove('show');
        // Cambiar el atributo "d" del path SVG para representar un símbolo de más(+ ⋁)
        togglePath.setAttribute(
          'd',
          'M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z'
        );
      }
    };

    toggleButton.removeEventListener('click', toggleButtonClickHandler);

    // Agregar el evento 'click' al toggleButton
    toggleButton.addEventListener('click', toggleButtonClickHandler);
  }

  setEventChangeToggle({ toggleHandle }) {
    console.log('setEventChangeToggle');

    // Validar si el contenedor de checkboxes existe
    if (!this.checkboxContainer) {
      console.error('[setEventChangeToggle] No existe el elemento #checkboxContainer');
      return;
    }

    // Eliminar eventos de cambio anteriores para evitar la duplicación
    const checkboxes = this.checkboxContainer.querySelectorAll('.column-toggle');

    if (checkboxes.length === 0) {
      console.error(
        '[setEventChangeToggle] No se encontraron elementos #checkboxContainer .column-toggle'
      );
      return;
    }

    // Guardar la referencia de la función en la instancia de la clase
    if (!this.toggleHandleWrapper) {
      this.toggleHandleWrapper = toggleHandle; // Guardar la referencia
    }

    // Remover event listeners antiguos
    checkboxes.forEach(checkbox => {
      checkbox.removeEventListener('change', e => this.toggleHandleWrapper(e));
    });

    // Agregar el nuevo event listener
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', e => this.toggleHandleWrapper(e));
    });
  }
}

export class CheckBoxManagerColumn extends CheckBoxManager {
  constructor() {
    super();
    this.checkboxContainer = document.getElementById('checkboxContainerColumn');
    this.toggleButton = document.getElementById('toggleButton');
  }

  toggleColumn(e) {
    const { target } = e;
    if (!target) {
      console.warn('[toggleColumn] No se encontró el elemento target ');
      return;
    }

    const columnIndex = parseInt(target.value) + 1;

    const checkboxContainer = target.closest('.checkbox-container');

    if (!this.table) {
      console.error('No existe el elemento <table>');
      return;
    }

    const rows = Array.from(
      this.table.querySelectorAll(
        `tr :is(th:nth-child(${columnIndex}), td:nth-child(${columnIndex}))`
      )
    );

    if (rows.length === 0) {
      console.warn('No hay filas <tr>');
      return;
    }

    rows.forEach(td => {
      if (target.checked) {
        td.style.display = 'table-cell';
      }

      td.classList.toggle('hidden', !target.checked);
      checkboxContainer.classList.toggle('checkbox-checked', !target.checked);
    });
  }

  hideColumns(columnsIndexes = [], isShow = true) {
    if (!this.table) {
      console.error('No existe el elemento <table>');
      return;
    }

    if (columnsIndexes.length === 0) {
      console.warn('No se especificaron columnas');
      return;
    }

    const rows = Array.from(this.table.rows);
    if (rows.length === 0) {
      console.warn('No hay filas <tr> en la tabla');
      return;
    }

    for (const row of rows) {
      for (let columnIndex = 0; columnIndex < row.cells.length; columnIndex++) {
        const cell = row.cells[columnIndex];
        if (cell) {
          const includeColumnsIndex = columnsIndexes.includes(columnIndex);

          if (isShow) {
            cell.classList.toggle('hidden', !includeColumnsIndex);
            cell.style.display = includeColumnsIndex ? 'table-cell' : 'none';
          } else {
            cell.classList.toggle('hidden', includeColumnsIndex);
            cell.style.display = includeColumnsIndex ? 'none' : 'table-cell';
          }
        }
      }
    }
  }

  /**
   * Crea input type="CheckBook" para cada columna de la tabla
   *
   * Al no pasar ningún parámetro se muestran todas las columnas
   *
   * @param {type Array} columnsDefault : Indice de Columnas a ocultar
   * @param {type Bolean} isShow : Valor por default = true
   */

  #createCheckboxElements(columnsDefault = [], isShow = true) {
    return new Promise((resolve, reject) => {
      // Validar si el elemento de la tabla existe
      if (!this.table) {
        reject('No existe el elemento <table>');
        console.error('[createCheckboxElements] No existe el elemento <table>');
        return;
      }

      // Validar si el contenedor de checkboxes existe
      if (!this.checkboxContainer) {
        reject('No existe el elemento checkboxContainer');
        console.error('[createCheckboxElements] No existe el elemento checkboxContainer');
        return;
      }

      // Obtener los encabezados de la tabla
      const headerRows = Array.from(this.table.querySelectorAll('thead tr th'));
      if (headerRows.length === 0) {
        console.warn('No hay encabezados en la tabla');
        resolve(); // Resolver la promesa aunque no haya encabezados
        return;
      }

      headerRows.forEach((row, index) => {
        const headerText = row.textContent.trim();

        // Crear el checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'column-toggle';
        checkbox.value = index;

        const span = document.createElement('span');
        span.className = 'checkmark';

        const label = document.createElement('label');
        label.className = 'checkbox-container';

        // Lógica para mostrar/ocultar la columna según el parámetro
        if (columnsDefault.length === 0 && isShow) {
          checkbox.checked = true; // Todas las columnas habilitadas
        } else if (
          (columnsDefault.includes(index) && isShow) ||
          (!columnsDefault.includes(index) && !isShow)
        ) {
          // Habilitar Columna
          checkbox.checked = true;
        } else {
          checkbox.checked = false;
          label.classList.add('checkbox-checked');
        }

        // Añadir elementos al DOM
        label.appendChild(checkbox);
        label.appendChild(span);
        label.appendChild(document.createTextNode(headerText));

        this.checkboxContainer.appendChild(label);
      });

      // Ocultar / MOstrar columnas en el DOM
      this.hideColumns(columnsDefault, isShow);

      resolve(); // Resolver la promesa cuando todo ha sido exitoso
    });
  }

  /**
   * Mostrar o ocultar columnas dependiendo del valor del indicio proporcionado
   * @param {Array} columnsToShow Indice de columnas a ocultar/mostrar
   * @param {Bolean} showColumns Si es TRUE los indices solo mostraran esas columnas si es FALSE se ocultaran
   */
  async createFiltersCheckbox(columnsToShow = [], showColumns = true) {
    console.log('[Create Filters Checkbox]');

    try {
      const { checkboxContainer, toggleButton } = this;

      // Validar si el contenedor de checkboxes existe
      if (!checkboxContainer) {
        console.error('[createFiltersCheckbox] No existe el elemento #checkboxContainer');
        return;
      }

      checkboxContainer.innerHTML = '';

      // Esperar a que los checkboxes estén creados antes de asignar eventos
      await this.#createCheckboxElements(columnsToShow, showColumns);
      this.setEventChangeToggle({ toggleHandle: this.toggleColumn });

      if (toggleButton) {
        toggleButton.removeAttribute('disabled');
      }
    } catch (error) {
      console.error('Error al crear los checkboxes:', error);
    }
  }
}

export class CheckBoxManagerRow extends CheckBoxManager {
  constructor({ positionRow = -1 }) {
    super();
    this.checkboxContainer = document.getElementById('checkboxContainerRow');
    this.toggleButton = document.getElementById('toggleButtonRow');
    this.positionRow = positionRow;
  }

  toggleRow(e) {
    if (!this.table) {
      console.error('No existe el elemento <table>');
      return;
    }

    const { target } = e;
    if (!target) {
      console.warn('[toggleColumn] No se encontró el elemento target ');
      return;
    }

    const rows = Array.from(this.table.rows);
    const value = target.value;
    const checkboxContainer = target.closest('.checkbox-container');

    if (rows.length === 0) {
      console.warn('No hay filas <tr>');
      return;
    }

    rows.forEach(tr => {
      const rowSelected = tr.querySelector(`td:nth-child(${this.positionRow})`);

      if (rowSelected && checkboxContainer) {
        const grupoText = rowSelected.textContent.trim();

        if (grupoText === value) {
          tr.classList.toggle('hidden', !target.checked);
          checkboxContainer.classList.toggle('checkbox-checked', !target.checked);
        }
      }
    });
  }

  hiddenRows({ rowsDefault = [], isShow = true }) {
    if (!this.table) {
      console.error('No existe el elemento <table>');
      return;
    }

    if (rowsDefault.length === 0) {
      console.warn('No se especificaron columnas');
      return;
    }

    const rows = Array.from(this.table.rows);
    if (rows.length === 0) {
      console.warn('No hay filas <tr> en la tabla');
      return;
    }

    rows.forEach(tr => {
      const row = tr.querySelector(`td:nth-child(${this.positionRow})`);

      if (!row) return;

      const rowText = row.textContent.trim();
      tr.classList.toggle('hidden', !rowsDefault.includes(rowText) && isShow);
    });
  }

  /** Filter Row*/
  async #createCheckboxElementsRow({ rowsDefault = [], isShow = true, uniqueRows = [] }) {
    return new Promise((resolve, reject) => {
      // Generar los checkboxes
      if (uniqueRows.length === 0) {
        console.error('No se especificaron filas');
        reject('No se especificaron filas');
        return;
      }

      if (!this.checkboxContainer) {
        reject('No existe el elemento checkboxContainer');
        return; // Salir de la función si no se encontró el contenedor de checkboxes
      }

      uniqueRows.forEach(rowName => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        const span = document.createElement('span');

        checkbox.type = 'checkbox';
        checkbox.className = 'column-toggle';
        checkbox.value = rowName;

        span.className = 'checkmark';

        if (rowsDefault.length === 0 && isShow === true) {
          label.className = 'checkbox-container';
          checkbox.checked = true;
        } else if (
          (rowsDefault.includes(rowName) && isShow) ||
          (!rowsDefault.includes(rowName) && isShow === false)
        ) {
          checkbox.checked = true;
          label.className = 'checkbox-container';
        } else {
          checkbox.checked = false;
          label.className = 'checkbox-container checkbox-checked';
        }

        label.appendChild(checkbox);
        label.appendChild(span);
        label.appendChild(document.createTextNode(rowName));
        this.checkboxContainer.appendChild(label);
      });

      this.hiddenRows({ rowsDefault, isShow });
      resolve();
    });
  }

  async createFiltersCheckbox({ rowsDefault = [], showColumns = true, uniqueRows = [] }) {
    console.log('[Create Filters Checkbox Row]');

    try {
      const { checkboxContainer, toggleButton } = this;
      // Validar si el contenedor de checkboxes existe
      if (!checkboxContainer) {
        console.error('[createFiltersCheckboxRow] No existe el elemento #checkboxContainer');
        return;
      }

      checkboxContainer.innerHTML = '';
      await this.#createCheckboxElementsRow({
        rowsDefault,
        isShow: showColumns,
        uniqueRows,
      });

      this.setEventChangeToggle({ toggleHandle: this.toggleRow });

      if (toggleButton) {
        toggleButton.removeAttribute('disabled');
      }
    } catch (error) {
      console.error('Error al crear los checkboxes:', error);
    }
  }
}
