import { PrintManager } from '../../utils/PrintManager.js';
import { CheckBoxManagerColumn, CheckBoxManagerRow } from '../../utils/CheckBoxManager.js';

export class PrintManagerDetail extends PrintManager {
  constructor() {
    super();
    this.columnIndex = {
      status1: -1,
      status1Number: -1,
      shipmentId: -1,
      item: -1,
      description: -1,
      totalQty: -1,
      erpOrder: -1,
      allocationRejectedQty: -1,
    };

    this.mapIndex = [
      { key: 'status1', values: ['status 1'] },
      { key: 'status1Number', values: ['status 1 (numeric)'] },
      { key: 'shipmentId', values: ['shipment id'] },
      { key: 'item', values: ['item'] },
      { key: 'description', values: ['description'] },
      { key: 'totalQty', values: ['total qty'] },
      { key: 'erpOrder', values: ['erp order'] },
      { key: 'allocationRejectedQty', values: ['allocation rejected quantity'] },
    ];

    this.sinCortos = [];
    this.conCortos = [];

    this.isChangeBox = false;
  }

  async init() {
    await super.init();
    await this.setEventShowCortos();
    this.setEventChangeToggle();
  }

  async createCheckBox() {
    const { shipmentId, item, description, totalQty } = this.columnIndex;
    const showColumns = [shipmentId, item, description, totalQty];

    const checkBoxManagerCol = new CheckBoxManagerColumn();
    checkBoxManagerCol.eventoClickCheckBox();
    await checkBoxManagerCol.createFiltersCheckbox(showColumns, true);

    await this.checkBoxRow();
  }

  async checkBoxRow() {
    const { table } = this;
    const position = this.columnIndex.status1Number + 1;

    const rowsSelected = Array.from(table.querySelectorAll(`tbody tr td:nth-child(${position})`));

    if (!rowsSelected || !table) {
      return new Error('No se encontraron los elementos <table> and <tbody>');
    }

    if (rowsSelected.length === 0) {
      return new Error('No hay filas en el <tbody>');
    }

    const valuesRow = rowsSelected.map(td => td.textContent.trim());
    const uniqueRows = [...new Set(valuesRow)];

    const checkBoxManagerRow = new CheckBoxManagerRow({ positionRow: position });
    checkBoxManagerRow.eventoClickCheckBox();
    await checkBoxManagerRow.createFiltersCheckbox({
      rowsDefault: ['100'],
      showColumns: true,
      uniqueRows,
    });
  }

  async setEventShowCortos() {
    const formShowCortos = document.querySelector('#show-cortos');

    if (!formShowCortos) {
      console.error('No se encontró el elemento <form id="show-cortos">');
      return;
    }

    await this.initializeRowsShort();

    const initialChecked = formShowCortos.querySelector('input[name="cortos"]:checked');
    if (initialChecked) {
      this.hiddenRows(initialChecked.value);
    }

    formShowCortos.addEventListener('change', e => this.handleShowCortos(e));
  }

  handleShowCortos(e) {
    const { target } = e;

    if (!target) {
      return;
    }

    const { type, value, nodeName } = target;

    console.log(`type:  ${type}, value: ${value}, nodeName: ${nodeName}`);

    if (type === 'radio' && nodeName === 'INPUT') {
      this.hiddenRows(value);
    }
  }

  toggleRows(rows = [], hide) {
    console.log('[toggleRows]:\n rows:', rows);
    if (rows.length === 0) {
      return;
    }

    const classListMap = {
      show: tr => tr.classList.remove('hidden'),
      hide: tr => tr.classList.add('hidden'),
    };

    rows.forEach(td => {
      const tr = td.closest('tr');

      if (tr && classListMap[hide]) {
        classListMap[hide](tr);
      }
    });
  }

  async initializeRowsShort() {
    const { table } = this;
    const { allocationRejectedQty } = this.columnIndex;

    if (!table) {
      console.error('No existe el elemento <table>');
      return;
    }

    if (allocationRejectedQty === -1) {
      console.error('No existe la columna "Allocation rejected quantity"');
      return;
    }

    const rowsAllocationRejectedQty = Array.from(
      table.querySelectorAll(`tbody tr:not(.hidden) td:nth-child(${allocationRejectedQty + 1})`)
    );

    if (rowsAllocationRejectedQty.length === 0) {
      console.warn('No hay filas <tr>');
      return;
    }

    this.sinCortos = rowsAllocationRejectedQty.filter(td => td.textContent.trim() === '0');
    this.conCortos = rowsAllocationRejectedQty.filter(td => td.textContent.trim() !== '0');

    this.isChangeBox = false;
  }

  async hiddenRows(value) {
    if (this.isChangeBox) {
      this.sinCortos.length = 0;
      this.conCortos.length = 0;
      await this.initializeRowsShort();
    }

    const mapShort = {
      'Con Cortos': () => {
        this.toggleRows(this.sinCortos, 'hide');
        this.toggleRows(this.conCortos, 'show');
      },
      'Sin Cortos': () => {
        this.toggleRows(this.sinCortos, 'show');
        this.toggleRows(this.conCortos, 'hide');
      },
      Todo: () => {
        this.toggleRows(this.sinCortos, 'show');
        this.toggleRows(this.conCortos, 'show');
      },
    };

    if (!mapShort[value]) {
      console.warn('[hiddenRows] No  se encontró el valor:', value);
      return;
    }

    mapShort[value]();
  }

  setEventChangeToggle() {
    const checkboxContainer = document.querySelector('#checkboxContainerRow');
    // Validar si el contenedor de checkboxes existe
    if (!checkboxContainer) {
      console.error(
        '[PrintManagerDetail: setEventChangeToggle] No existe el elemento #checkboxContainer'
      );
      return;
    }

    // Eliminar eventos de cambio anteriores para evitar la duplicación
    const checkboxes = checkboxContainer.querySelectorAll('.column-toggle');

    if (checkboxes.length === 0) {
      console.error(
        '[PrintManagerDetail: setEventChangeToggle] No se encontraron elementos #checkboxContainer .column-toggle'
      );
      return;
    }

    // Agregar el nuevo event listener
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.isChangeBox = true;
        const shortChecked = document.querySelector('#show-cortos input[name="cortos"]:checked');

        if (shortChecked) {
          this.hiddenRows(shortChecked.value);
        }
      });
    });
  }
}
