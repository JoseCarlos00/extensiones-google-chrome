async function main() {
  try {
    await insertButtonDownload();
    setEventDownload();
  } catch (error) {
    console.error('Error:', error);
  }
}

function insertButtonDownload() {
  const buttonExcel = `
    <li class="pull-right menubutton" aria-label="Bajar filas visibles" data-balloon-pos="left">
      <a id="exportToExcel"  class=" menuicon" href="javascript:void(0);"><svg 
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="13.5" height="18">
          <path
            d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM155.7 250.2L192 302.1l36.3-51.9c7.6-10.9 22.6-13.5 33.4-5.9s13.5 22.6 5.9 33.4L221.3 344l46.4 66.2c7.6 10.9 5 25.8-5.9 33.4s-25.8 5-33.4-5.9L192 385.8l-36.3 51.9c-7.6 10.9-22.6 13.5-33.4 5.9s-13.5-22.6-5.9-33.4L162.7 344l-46.4-66.2c-7.6-10.9-5-25.8 5.9-33.4s25.8-5 33.4 5.9z"
            fill="#fff">
          </path>
        </svg>
      </a>
    </li>   
  `;
  return new Promise((resolve, reject) => {
    const anchorExcel = document.getElementById('MenuExportToExcel');

    if (!anchorExcel) {
      throw new Error("No se encotro el enlace de export to excel <a id'MenuExportToExcel'>");
    }

    const elementToInsert = anchorExcel.closest('li.menubutton');

    if (!elementToInsert) {
      throw new Error('No se encontro el elemento a insertar <li.menubutton>');
    }
    elementToInsert.setAttribute('aria-label', 'Descargar Todo');
    elementToInsert.setAttribute('data-balloon-pos', 'left');
    elementToInsert.insertAdjacentHTML('afterend', buttonExcel);

    setTimeout(resolve, 50);
  });
}

function setEventDownload() {
  const btnDownload = document.getElementById('exportToExcel');

  if (!btnDownload) {
    throw new Error('No se encontró el botón para descargar');
  }

  btnDownload.addEventListener('click', async () => {
    console.log('Descarga Iniciada');

    try {
      const table = await constructTable();
      await exportTable(table);
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

function constructTable() {
  return new Promise((resolve, reject) => {
    const thead = document.querySelector('#ListPaneDataGrid_headers > thead');
    const tbody = document.querySelector('table[data-controlid] > tbody');

    if (!thead || !tbody) {
      return reject(new Error('No se encontró el encabezado o cuerpo para construir la tabla'));
    }

    const table = document.createElement('table');

    const theadClone = thead.cloneNode(true);
    const tbodyClone = tbody.cloneNode(true);

    // Encontrar columnas a ignorar
    const columnsToIgnore = [];
    theadClone.querySelectorAll('th').forEach((th, index) => {
      if (
        th.classList.contains('ui-iggrid-rowselector-header') ||
        th.id === 'ListPaneDataGrid_ICON'
      ) {
        columnsToIgnore.push(index);
      }
    });

    // Filtrar columnas en el theadClone
    theadClone.querySelectorAll('tr').forEach(row => {
      row.querySelectorAll('th').forEach((th, index) => {
        if (columnsToIgnore.includes(index)) {
          th.remove(); // Eliminar columnas a ignorar
        }
      });
    });

    // Filtrar columnas en el tbodyClone
    tbodyClone.querySelectorAll('tr').forEach(row => {
      row.querySelectorAll('& :is(th, td)').forEach((td, index) => {
        if (columnsToIgnore.includes(index)) {
          td.remove(); // Eliminar columnas a ignorar
        }
      });
    });

    // Recorrer cada celda en el tbody clon
    tbodyClone.querySelectorAll('td').forEach(cell => {
      // Obtener el texto visible, ignorando los enlaces
      const link = cell.querySelector('a');
      const cellText = link ? link.textContent.trim() : cell.textContent.trim();

      // Procesar el texto si es un número
      const numberValue = Number(cellText.replace('.', '').replace(',', '.'));

      if (!isNaN(numberValue)) {
        td.textContent = cellText.replace(/\./g, '');
      } else {
        cell.textContent = cellText; // Actualizar con el texto visible
      }
    });

    // Agregar el thead y tbody filtrados a la nueva tabla
    table.appendChild(theadClone);
    table.appendChild(tbodyClone);

    // Retornar la tabla construida
    resolve(table);
  });
}

function getTitleDocument() {
  return new Promise((resolve, reject) => {
    const title = document.querySelector('a[data-formid][data-resourcekey][data-resourcevalue]');

    if (title) {
      const titleText = title.textContent.trim();

      if (titleText) {
        const formattedTitle = titleText
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');

        resolve(formattedTitle);
      } else {
        resolve('Document');
      }
    } else {
      resolve('Document');
    }
  });
}

async function exportTable(table) {
  try {
    if (!table) {
      throw new Error('No se encontró la <table> para exportar');
    }

    // Usa SheetJS para crear un libro y agregar una hoja con los datos de la tabla
    const workbook = XLSX.utils.table_to_book(table);
    const title = (await getTitleDocument()) ?? 'Document';

    XLSX.writeFile(workbook, `${title}.xlsx`);
  } catch (error) {
    console.error('Error:', error);
  }
}

window.addEventListener('load', main, { once: true });
