(function () {
  function inicio() {
    const style = `
      <style>
        @media print {
          .file-input-container {
            display: none
          }
        }
      </style>
    `;

    const input = `
      <div class="file-input-container">
        <input type="file" id="fileInput" />
        <button id="insertar">Inserar Work Unit</button>
      </div>
    `;

    document.querySelector('head').insertAdjacentHTML('beforeend', style);
    document.querySelector('body').insertAdjacentHTML('afterbegin', input);

    var fileInput = document.getElementById('fileInput');

    fileInput.addEventListener('change', function (e) {
      var file = e.target.files[0];

      if (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
          var data = e.target.result;

          // Parsear el archivo Excel con SheetJS
          var workbook = XLSX.read(data, { type: 'binary' });
          var sheet_name_list = workbook.SheetNames;
          var sheet = workbook.Sheets[sheet_name_list[0]];

          // Obtener los datos como un array de objetos
          var excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          // Ahora puedes trabajar con excelData, que contiene los datos del archivo Excel
          registrarDatos(excelData);
        };

        reader.readAsBinaryString(file);
      }
    });

    // Objeto para almacenar los datos
    const datos = {};

    function registrarDatos(excelData) {
      const workUnitHeader = excelData[0][0];
      const pedidoHeader = excelData[0][7];

      if (workUnitHeader == 'Work unit' && pedidoHeader == 'Reference id') {
        // Iterar sobre las filas de excelData
        for (let i = 1; i < excelData.length; i++) {
          const workUnit = String(excelData[i][0]);
          const pedido = String(excelData[i][7]);
          const numeroPedido = pedido.substr(12);

          // console.log('WI:', workUnit, ' pedido:', numeroPedido);

          // Verificar si el numero de pedido ya existe en el objeto datos
          if (datos[numeroPedido]) {
            // Verificar si el workUnit no está duplicado en la lista
            if (!datos[numeroPedido].includes(workUnit)) {
              // Si no está duplicado, agregar el workUnit a la lista existente
              datos[numeroPedido].push(workUnit);
            }
          } else {
            // Si no existe, crear una nueva lista con el work unit
            datos[numeroPedido] = [workUnit];
          }
        }
      }

      const datosLength = Object.keys(datos).length;

      if (datosLength > 0) {
        console.log('datos:', datos, datosLength);
        document.querySelector('#insertar').addEventListener('click', insertarWorkUnit);
      }
    }

    function insertarWorkUnit() {
      // Obten todos los elementos que contienen numeros de pedido
      const pedidosElementos = document.querySelectorAll(
        '.col.text-center.inv_heading.position-relative h3:nth-child(1) span:nth-child(2)'
      );

      // Itera sobre cada elemento de numero de pedido
      pedidosElementos.forEach(pedidoElemento => {
        // Obten el numero de pedido de cada elemento
        const numeroPedido = pedidoElemento.textContent.trim().replace('Pedido #', '');

        // Obten el elemento del textarea correspondiente al numero de pedido actual
        const textareaElemento = pedidoElemento.closest('.inv_heading').querySelector('.textarea');

        // Verifica si el numero de pedido existe en el objeto datos
        if (numeroPedido in datos) {
          // Inserta las unidades de trabajo en el textarea
          textareaElemento.value = datos[numeroPedido].join('\n');
        }
      });
    }
  }

  window.addEventListener('load', inicio, { once: true });
})();
