import { idButtonDownSend } from './constants.js';
import { exportTable } from './downloadExcel.js';

export const buttonExcelDownloadSend = /* html */ `
    <li class="pull-right menubutton" aria-label="Envío Tultitlan" data-balloon-pos="left">
      <a id="${idButtonDownSend}"  class=" menuicon" href="javascript:void(0);"><svg 
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="13.5" height="18">
          <path
            d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM155.7 250.2L192 302.1l36.3-51.9c7.6-10.9 22.6-13.5 33.4-5.9s13.5 22.6 5.9 33.4L221.3 344l46.4 66.2c7.6 10.9 5 25.8-5.9 33.4s-25.8 5-33.4-5.9L192 385.8l-36.3 51.9c-7.6 10.9-22.6 13.5-33.4 5.9s-13.5-22.6-5.9-33.4L162.7 344l-46.4-66.2c-7.6-10.9-5-25.8 5.9-33.4s25.8-5 33.4 5.9z"
            fill="#7109ff">
          </path>
        </svg>
      </a>
    </li>   
  `;

export function initInventoryInsight() {
	setEventDownloadSend();
}

function setEventDownloadSend() {
	const btnDownload = document.getElementById(idButtonDownSend);

	if (!btnDownload) {
		throw new Error('No se encontró el botón para descargar');
	}

	btnDownload.addEventListener('click', async () => {
		console.log('Descarga Iniciada');

		try {
			const table = await constructTable();

			// Obtén fecha actual
			const now = new Date();
			const day = String(now.getDate()).padStart(2, '0');
			const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
			const year = now.getFullYear();

			const fecha = `${day}-${month}-${year}`;
			const fileName = `Envío Tultitlan ${fecha}`;
			await exportTable(table, fileName);
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


		const tbodyClone = tbody.cloneNode(true);

    // Creamos un nuevo thead con solo las columnas deseadas
    const theadClone = document.createElement('thead');
    const headerRow = document.createElement('tr');

    headerRow.innerHTML = /* html */ `
      <th>SKU</th>
      <th>CANTIDAD</th>
    `;

    theadClone.appendChild(headerRow);
    
    const newTbody = document.createElement('tbody');

		// Filtrar columnas en el tbodyClone
		tbodyClone.querySelectorAll('tr').forEach((row) => {
      const newRow = document.createElement('tr');

      const tdSku = document.createElement('td');
			const tdCantidad = document.createElement('td');

			const skuCellValue = row.querySelector('td[aria-describedby=ListPaneDataGrid_ITEM]')?.textContent.trim() || '';
      const cantidadCellValue = row.querySelector('td[aria-describedby=ListPaneDataGrid_ON_HAND_QTY]')?.textContent.trim() || '';

      tdSku.textContent = skuCellValue;
      tdCantidad.textContent = cantidadCellValue;

      newRow.appendChild(tdSku);
      newRow.appendChild(tdCantidad);

      newTbody.appendChild(newRow);
		});

		// Recorrer cada celda en el tbody clon
		newTbody.querySelectorAll('td').forEach((cell) => {
			// Obtener el texto visible, ignorando los enlaces
			const link = cell.querySelector('a');
			const cellText = link ? link.textContent.trim() : cell.textContent.trim();

			// Procesar el texto si es un número
			const numberValue = Number(cellText.replace('.', '').replace(',', '.'));

			if (!isNaN(numberValue)) {
				cell.textContent = cellText.replace(/\./g, '');
			} else {
				cell.textContent = cellText; // Actualizar con el texto visible
			}
		});

		// Agregar el thead y tbody filtrados a la nueva tabla
		table.appendChild(theadClone);
		table.appendChild(newTbody);

		// Retornar la tabla construida
		resolve(table);
	});
}
