function inicio() {
  console.log('Extension Excel');

  const title =
    document.querySelector('div div > main.main.container-fluid > h1.text-center').innerText ?? '';

  const btnExelSCALE =
    document.querySelector(
      '#Panel13 > main > div.row > div > div.d-flex.bd-highlight.mb-3 > div:nth-child(2)'
    ) ?? undefined;

  const btnExelAR_SCALE =
    document.querySelector(
      '#Panel25 > main > div.row > div > div.d-flex.bd-highlight.mb-3 > div:nth-child(2)'
    ) ?? undefined;

  if (btnExelAR_SCALE) {
    const btnExcel1 = `
    <div class="p-2 bd-highlight">
      <button  id="btnExcel2" class="btn btn-sm text-grey btn-purple mt-3"" type="button"><i class="fas fa-file-excel"></i>Excel</button>
    </div>`;

    btnExelAR_SCALE.insertAdjacentHTML('afterend', btnExcel1);
    document.querySelector('#btnExcel2').addEventListener('click', e => {
      const elementID = e.target.getAttribute('id');
      console.log(elementID);
      if (elementID == 'btnExcel2') {
        const tableARSCALE = document.querySelector('#gvtransactionhistoryLI_ctl00') ?? undefined;
        console.log(tableARSCALE);
        exportTable(tableARSCALE);
      }
    });
  }

  if (btnExelSCALE) {
    const btnExcel2 = `
    <div class="p-2 bd-highlight">
    <button  id="btnExcel3" class="btn btn-sm text-grey btn-purple mt-3"" type="button"><i class="fas fa-file-excel"></i>Excel</button>
    </div>`;
    btnExelSCALE.insertAdjacentHTML('afterend', btnExcel2);
    document.querySelector('#btnExcel3').addEventListener('click', e => {
      const elementID = e.target.getAttribute('id');
      console.log(elementID);
      if (elementID == 'btnExcel3') {
        const tableScale = document.querySelector('#gvtransactionhistory_ctl00') ?? undefined;
        console.log(tableScale);
        exportTable(tableScale);
      }
    });
  }

  function exportTable(table) {
    // Usa SheetJS para crear un libro y agregar una hoja con los datos de la tabla
    const workbook = XLSX.utils.table_to_book(table);
    console.log('workBook:', workbook);

    // Convierte el libro a un archivo blob
    const blob = XLSX.writeFile(workbook, 'exported_table.xlsx');

    console.log('log:', blob);
  }
}

window.addEventListener('load', inicio, { once: true });
