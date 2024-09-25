import { PrintMananger } from '../../utils/PrintMananger.js';
import { CheckBoxManangerColumn, CheckBoxManangerRow } from '../../utils/CheckBoxMananger.js';

export class PrintManangerDetail extends PrintMananger {
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
    };

    this.mapIndex = [
      { key: 'status1', values: ['status 1'] },
      { key: 'status1Number', values: ['status 1 (numeric)'] },
      { key: 'shipmentId', values: ['shipment id'] },
      { key: 'item', values: ['item'] },
      { key: 'description', values: ['description'] },
      { key: 'totalQty', values: ['total qty'] },
      { key: 'erpOrder', values: ['erp order'] },
    ];
  }

  async createCheckBox() {
    const { shipmentId, item, description, totalQty, erpOrder, status1 } = this.columnIndex;
    const showColumns = [shipmentId, item, description, totalQty, erpOrder, status1];

    const checkBoxManangerCol = new CheckBoxManangerColumn();
    checkBoxManangerCol.eventoClickCheckBox();
    await checkBoxManangerCol.createFiltersCheckbox(showColumns, true);
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

    const checkBoxManangerRow = new CheckBoxManangerRow({ positionRow: position });
    checkBoxManangerRow.eventoClickCheckBox();
    await checkBoxManangerRow.createFiltersCheckbox({
      rowsDefault: ['100'],
      showColumns: true,
      uniqueRows,
    });
  }

  async createCheckBox() {
    super.createCheckBox();
    await this.checkBoxRow();
  }
}
