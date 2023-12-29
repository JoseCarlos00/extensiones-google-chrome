(function () {
  function inicio() {
    const style = `
      <style>
      .container-principal {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
      }

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

    function waitForElement(selector, timeout) {
      return new Promise((resolve, reject) => {
        const element = document.querySelector(selector) ?? undefined;

        const intervalId = setInterval(() => {
          if (element) {
            clearInterval(intervalId);
            resolve(element);
          }
        }, 1000);

        setTimeout(() => {
          clearInterval(intervalId);
          const errorMessage = `Elemento ${selector} no encontrado después de ${timeout} segundos`;
          if (!element) reject(errorMessage);
        }, timeout);
      });
    }

    function insertarHTMLSiExiste() {
      return new Promise(resolve => {
        waitForElement('.container-principal', 5000)
          .then(containerPrincipalElement => {
            containerPrincipalElement.insertAdjacentHTML('beforeend', input);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    }

    async function contenido() {
      try {
        const fileInput = document.getElementById('fileInput');

        if (!fileInput) return;

        fileInput.addEventListener('change', function (e) {
          const file = e.target.files[0];

          if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
              const data = e.target.result;

              if (!data) return;

              // Verificar la extensión del archivo para determinar el tipo de parseo
              const extension = file.name.split('.').pop().toLowerCase();

              if (extension === 'xlsx') {
                extensionXLSX(data);
              } else if (extension === 'xls') {
                extensionXLS(file);
              } else {
                console.log('Formato de archivo no compatible');
              }
            };

            reader.readAsArrayBuffer(file);
          }
        });

        // Objeto para almacenar los datos
        const datos = {};

        function registrarDatosXLSX(excelData) {
          // Iterar sobre las filas de excelData
          for (let i = 1; i < excelData.length; i++) {
            const workUnit = String(excelData[i][0]);
            const pedido = String(excelData[i][7]);
            const numeroPedido = pedido.split('-').pop();

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

          const datosLength = Object.keys(datos).length;

          if (datosLength > 0) {
            console.log('datos:', datos, datosLength);
            document.querySelector('#insertar').addEventListener('click', insertarWorkUnit);
          }
        }

        function registrarDatosXLS(excelData) {
          const WU = 'UNIDAD DE TRABAJO';
          const PED = 'ID DEL PEDIDO';

          for (let i = 0; i < excelData.length; i++) {
            const element = excelData[i];
            const workUnit = String(excelData[i][WU]);
            const pedido = String(excelData[i][PED]);
            const numeroPedido = pedido.split('-').pop();

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
            const textareaElemento = pedidoElemento
              .closest('.inv_heading')
              .querySelector('.textarea');

            // Verifica si el numero de pedido existe en el objeto datos
            if (numeroPedido in datos) {
              // Inserta las unidades de trabajo en el textarea
              textareaElemento.value = datos[numeroPedido].join('\n');
            }
          });
        }

        function extensionXLSX(data) {
          // Parsear el archivo Excel con SheetJS para archivos .xlsx
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheet_name_list = workbook.SheetNames;
          const sheet = workbook.Sheets[sheet_name_list[0]];

          // Obtener los datos como un array de objetos
          const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          // Ahora puedes trabajar con excelData, que contiene los datos del archivo Excel
          const workUnitHeader = excelData[0][0] ?? '';
          const pedidoHeader = excelData[0][7] ?? '';
          const valuePedido = excelData[1][7] ?? '';

          console.log('wor:', workUnitHeader, ' ped:', pedidoHeader);
          console.log('Value:', valuePedido);
          console.log(excelData[0]);

          if (
            workUnitHeader == 'Work unit' &&
            pedidoHeader == 'Reference id' &&
            valuePedido.includes('4172-ML-')
          ) {
            registrarDatosXLSX(excelData);
          }
        }

        function extensionXLS(file) {
          async function getData() {
            /* Obtén el array buffer */
            let libro;
            try {
              libro = await file.arrayBuffer();
            } catch (e) {
              console.log('Error:', e);
              return;
            }

            // Convierte el ArrayBuffer en un array de bytes
            const data = new Uint8Array(libro);

            // Convierte el array de bytes en un libro de Excel
            const workbook = XLSX.read(data, { type: 'array' });

            // Obtiene los datos de la primera hoja del libro
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const excelData = XLSX.utils.sheet_to_json(sheet);

            return excelData;
          }

          async function content() {
            const excelData = await getData();
            /** Validar que sea una Hoja de trabajo Activo */
            // console.log('Datos del archivo XLS:', typeof excelData, excelData);

            if (Object.keys(excelData).length == 0) return;

            // console.log('Dato 1:', typeof excelData[0], excelData[0]);

            const excelData0 = Object.keys(excelData[0]) ?? '';

            const filas = Object.keys(excelData);
            // console.log('Filas:', filas);

            const columna = excelData0;
            // console.log('Columna: ', columna);

            const valuePedido = excelData[0][columna[2]] ?? '';

            console.log('Value:', valuePedido);

            const workUnitHeader = columna[3] ?? '';
            const pedidoHeader = columna[2] ?? '';
            // console.log('wor:', workUnitHeader, ' ped:', pedidoHeader);

            if (
              pedidoHeader == 'ID DEL PEDIDO' &&
              workUnitHeader == 'UNIDAD DE TRABAJO' &&
              valuePedido.includes('4172-ML-')
            ) {
              registrarDatosXLS(excelData);
            }
          }

          content();
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    async function promesa() {
      return new Promise(resolve => {
        setTimeout(resolve, 1000);
      });
    }

    promesa()
      .then(() => {
        return insertarHTMLSiExiste();
      })
      .then(() => {
        contenido(); // Llama a la función contenido después de insertar el HTML
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  window.addEventListener('load', inicio, { once: true });
})();
