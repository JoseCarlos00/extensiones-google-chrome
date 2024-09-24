import { CheckBoxManangerColumn, CheckBoxManangerRow } from './CheckBoxMananger.js';
console.log('Print.js');

async function main() {
  try {
    // Obtén el contenido de la URL
    const params = new URLSearchParams(window.location.search);
    const thead = params.get('thead');
    const tbody = params.get('tbody');

    if (!thead || !tbody) {
      console.error('Error: No se encontro [thead] and [tbody] en los parametros');
      return;
    }

    // Renderiza el contenido en el elemento 'content'
    const table = document.getElementById('content');
    const theadElement = document.createElement('thead');
    const tbodyElement = document.createElement('tbody');

    if (!table) {
      console.error('No se encontro la <table> a insertar');
      return;
    }

    theadElement.innerHTML = thead;
    tbodyElement.innerHTML = decodeURIComponent(tbody);

    table.insertAdjacentElement('beforeend', theadElement);
    table.insertAdjacentElement('beforeend', tbodyElement);

    await cleanThead();
    await createCheckBox();

    setTimeout(() => window.print(), 500);
  } catch (error) {
    console.error('Error:', error);
  }
}

function cleanThead() {
  return new Promise(resolve => {
    // Seleccionar el <thead> original y las filas <tr> dentro de él
    const originalThead = document.querySelector('#content > thead');
    const headers = originalThead.querySelectorAll('tr th');

    const rowOld = originalThead.querySelector('tr');

    if (!originalThead) {
      console.error('No se encontro el <thead> en la <table>');
      return;
    }

    if (headers.length === 0) {
      console.warn('No hay filas en el <tr>');
      resolve();
      return;
    }

    // Crear un nuevo elemento <tr>
    const rowNew = document.createElement('tr');

    headers.forEach(th => {
      const thNew = document.createElement('th');
      const thText = th.textContent.trim();

      thNew.textContent = thText;

      rowNew.appendChild(thNew);
    });

    // Reemplazar el <tr> antiguo con el nuevo
    originalThead.replaceChild(rowNew, rowOld);
    resolve();
  });
}

async function createCheckBox() {
  const showColumns = [4, 5, 6, 7, 8].map(index => index - 1);

  const checkBoxManangerCol = new CheckBoxManangerColumn();
  checkBoxManangerCol.eventoClickCheckBox();
  await checkBoxManangerCol.createFiltersCheckbox(showColumns, true);

  await hiddenRows();
}

// Espera a que la página haya cargado antes de ejecutar la función inicio
window.addEventListener('load', main, { once: true });

async function hiddenRows() {
  const table = document.getElementById('content');
  const position = 9;

  const rowsGroup = Array.from(table.querySelectorAll(`tbody tr td:nth-child(${position})`));

  if (!rowsGroup || !table) {
    reject('No se encontraron los elementos <table> and <tbody>');
    return;
  }

  if (rowsGroup.length === 0) {
    reject('No hay filas en el <tbody>');
    return;
  }

  const valuesGroup = rowsGroup.map(td => td.textContent.trim());
  const uniqueGroup = [...new Set(valuesGroup)];

  const checkBoxManangerRow = new CheckBoxManangerRow({ positionRow: position });
  checkBoxManangerRow.eventoClickCheckBox();
  await checkBoxManangerRow.createFiltersCheckbox({
    rowsDefault: ['100'],
    showColumns: true,
    uniqueRows: uniqueGroup,
  });
}
