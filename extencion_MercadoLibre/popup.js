(function () {
  function inicio() {
    document.querySelector('body').insertAdjacentHTML(
      'beforebegin',
      `
    <input type="file" id="fileInput" />
    <button id="cargarArchivo">Cargar Archivo</button>
  `
    );

    var fileInput = document.getElementById('fileInput');

    // fileInput.addEventListener('change', function (e) {
    //   var file = e.target.files[0];

    //   if (file) {
    //     var reader = new FileReader();

    //     reader.onload = function (e) {
    //       var data = e.target.result;

    //       // Parsear el archivo Excel con SheetJS
    //       var workbook = XLSX.read(data, { type: 'binary' });
    //       var sheet_name_list = workbook.SheetNames;
    //       var sheet = workbook.Sheets[sheet_name_list[0]];

    //       // Obtener los datos como un array de objetos
    //       var excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    //       // Ahora puedes trabajar con excelData, que contiene los datos del archivo Excel
    //       console.log(excelData);
    //     };

    //     reader.readAsBinaryString(file);
    //   }
    // });
  }
  window.addEventListener('load', inicio);
})();
