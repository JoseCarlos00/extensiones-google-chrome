function inicio() {
  console.log('Extension Excel');

  const btnExcelElement =
    document.querySelector(
      '#UpdatePanel > main > div:nth-child(7) > div > div.d-flex.bd-highlight.mb-3 > div.mr-auto.p-2.bd-highlight'
    ) ?? undefined;

  const btnExcel = `
  <div class="mr-auto p-2 bd-highlight">
    <button  id="btnExcel2" class="btn btn-sm text-grey btn-dark-teal mt-3" type="button"><i class="fas fa-file-excel"></i>Excel 2</button>
  </div>`;

  if (btnExcelElement) {
    btnExcelElement.classList.remove('mr-auto');
    btnExcelElement.insertAdjacentHTML('afterend', btnExcel);

    content();
  }

  function content() {
    exportTable();
  }

  function exportTable() {
    // Accede a la tabla por su ID
    const table = document.querySelector('#gvEnvio_ctl00') ?? undefined;

    if (table) {
      // Usa SheetJS para crear un libro y agregar una hoja con los datos de la tabla
      const workbook = XLSX.utils.table_to_book(table);
      console.log('workBook:', workbook);

      // Convierte el libro a un archivo blob
      // const blob = XLSX.write(workbook, { bookType: 'xlsx', type: 'blob' });
      // console.log('blob:', blob);

      // // Crea un objeto URL y descarga el archivo
      // const url = window.URL.createObjectURL(blob);
      // chrome.downloads.download({
      //   url: url,
      //   filename: 'exported_table.xlsx',
      // });
    }
  }
}

window.addEventListener('load', inicio, { once: true });
