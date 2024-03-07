(function () {
  function inicio() {
    const style = `
      <style>
        .container-principal {
          .row {
            margin: 20px 0;
          }
        }

        .container-file-upload-form {
          position: relative;

          display: flex;
          align-items: center;
          padding-left: 0;
        }

        .file-upload-form {
          width: fit-content;
          height: fit-content;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .file-upload-label input {
          display: none;
        }
        .file-upload-label svg {
          height: 36px;
          fill: #007ACC;
          margin-bottom: 1px;
        }
        .file-upload-label {
          cursor: pointer;
          background-color: #ddd;
          padding: 15px 35px;
          border-radius: 40px;
          border: 2px dashed rgb(82, 82, 82);
          box-shadow: 0px 0px 200px -50px rgba(0, 0, 0, 0.719);
          transition: border 0.3s ease-in-out;
        }
        /* Estilo de borde cuando se arrastra un archivo */
        .container-file-upload-form.drag-over  .file-upload-label{
          border: 2px solid #4CAF50;
        }
        .container-file-upload-form.drag-over  .file-upload-design{
          opacity: 0.2;
        }
        .container-file-upload-form.drag-over::before {
          content: "Suelta el archivo aquí";
          position: absolute;
          font-family: cursive;
          font-size: 1.4rem;
          padding: 0px 3px 14px 34px;
        }
        .file-upload-design {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .browse-button {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 10px 15px;
          gap: 15px;
          background-color: #007ACC;
          outline: 3px #007ACC solid;
          outline-offset: -3px;
          border-radius: 5px;
          border: none;
          cursor: pointer;
          transition: 400ms;

          padding: 2px 10px;
          color: white;
        }
        .browse-button-text {
          color: white;
          font-weight: 700;
          font-size: 1em;
          transition: 400ms;
          margin: 0;
        }
        .browse-button:hover {
          background-color: #fff;
        }
        .browse-button:hover .browse-button-text{
          color: #007ACC;
        }
        .file-upoad-label-text{
          margin: 0;
          padding: 0;
        }

        #insertar {
          align-self: end;
          margin-left: 16px;
        }

        @media print {
          .file-upload-form {
            display: none
          }
        }
      </style>
    `;

    const input = `
    <div class="col col-xl-6 col-md-8 container-file-upload-form"">
            <form class="file-upload-form">
            <label for="fileInput" class="file-upload-label">
              <div class="file-upload-design">
                <svg viewBox="0 0 640 520" height="1em">
                  <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144z" fill="#007ACC" stroke="#007ACC" stroke-width="8"></path>
                  <path d="M223 263c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" fill="#fff"></path>
                 </svg>
                <p class="file-upoad-label-text">Arrastrar y soltar</p>
                <p class="file-upoad-label-text">o</p>
                <span class="browse-button">
                  <span class="browse-button-text">Browse file</span>
                </span>
              </div>
              <input id="fileInput" type="file" />
            </label>
        </form>
        <button id="insertar" class="button" type="button"><span class="text">Registrar</span></button>
      </div>
    `;

    // document.querySelector('head').insertAdjacentHTML('beforeend', style);

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
      return new Promise((resolve, reject) => {
        waitForElement('.container-principal', 5000)
          .then(containerPrincipalElement => {
            containerPrincipalElement.insertAdjacentHTML('afterbegin', input);
            resolve();
          })
          .catch(() => {
            reject('ELEMENTO NO ENCONTRADO');
          });
      });
    }

    async function contenido() {
      try {
        const container = document.querySelector('.container-file-upload-form');
        const fileInput = document.getElementById('fileInput');

        if (!fileInput) return;

        // Agregar evento de cambio para la carga de archivos
        fileInput.addEventListener('change', handleFileInputChange);

        // Agregar eventos para arrastrar y soltar
        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('dragleave', handleDragLeave);
        container.addEventListener('drop', handleDrop);

        function handleFileInputChange(e) {
          const file = e.target.files[0];
          handleFile(file);
        }

        function handleDragOver(e) {
          e.preventDefault();
          container.classList.add('drag-over');
        }

        function handleDragLeave(e) {
          e.preventDefault();
          container.classList.remove('drag-over');
        }

        function handleDrop(e) {
          e.preventDefault();
          container.classList.remove('drag-over');

          const file = e.dataTransfer.files[0];
          handleFile(file);
        }

        function handleFile(file) {
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
        }

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
            console.log('datos:', datosLength, datos);
            document
              .querySelector('#insertar')
              .addEventListener('click', insertarWorkUnit, { once: true });
            insertarWorkUnit();
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
            console.log('datos:', datosLength, datos);
            document
              .querySelector('#insertar')
              .addEventListener('click', insertarWorkUnit, { once: true });
            insertarWorkUnit();
          }
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

        function insertarWorkUnit() {
          // Obten todos los elementos que contienen numeros de pedido
          const pedidosElementos = document.querySelectorAll(
            '.col.text-center.inv_heading h3:nth-child(1) span:nth-child(2)'
          );

          // Itera sobre cada elemento de numero de pedido
          pedidosElementos.forEach(pedidoElemento => {
            // Obten el numero de pedido de cada elemento
            const numeroPedido = pedidoElemento.textContent.trim().replace('Pedido #', '');

            // Obten el elemento del textarea correspondiente al numero de pedido actual
            const textareaElemento = pedidoElemento
              .closest('div.container.inv-container')
              .querySelector('.textarea');

            // Verifica si el numero de pedido existe en el objeto datos
            if (numeroPedido in datos) {
              // Inserta las unidades de trabajo en el textarea
              textareaElemento.value = datos[numeroPedido].join('\n');
            }
          });

          setTimeout(() => {
            window.print();
          }, 750);
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
