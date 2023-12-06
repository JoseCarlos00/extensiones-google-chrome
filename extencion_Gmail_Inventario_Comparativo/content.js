(function () {
  function comparativo() {
    const tdbody =
      document.querySelector(
        'body > div > div > table.message > tbody > tr:nth-child(3) > td > table > tbody > tr > td > div > font > div > table > tbody > tr > td > table > tbody'
      ) ?? undefined;

    if (tdbody) {
      inicio();
    }
  }

  function inicio() {
    document.querySelector('head').insertAdjacentHTML(
      'beforeend',
      `
    <style>
      body, td {
        font-size: 14px;
      } {
        font-size: 14px;
      }

      .en-cero {
        background-color: #ffff0066 !important;
      }

      table.message > tbody > tr:nth-child(3) > td > table > tbody > tr > td > div > font > div > table > tbody > tr > td > table > tbody tr:hover {
        background-color: lightcoral;
      }



      /* Boton Copiar Items */
      .container-boton-copiar-items-modify {
        width: fit-content;
        padding-bottom: 3px;
        transition: opacity 300ms ease-in 0s;

        /* tooltip settings 👇 */
        .copy {
          /* button */
          --button-bg: #353434;
          --button-hover-bg: #000000;
          --button-text-color: #fff;
          --button-hover-text-color: #fff;
          --button-border-radius: 5px;
          --button-diameter: 14.5px;
          --button-outline-width: 1px;
          --button-outline-color: rgb(141, 141, 141);
          /* tooltip */
          --tooltip-bg: #f4f3f3;
          --toolptip-border-radius: 4px;
          --tooltip-font-family: Menlo, Roboto Mono, monospace;
          /* 👆 this field should not be empty */
          --tooltip-font-size: 12px;
          /* 👆 this field should not be empty */
          --tootip-text-color: rgb(50, 50, 50);
          --tooltip-padding-x: 7px;
          --tooltip-padding-y: 7px;
          --tooltip-offset: 8px;
          --tooltip-transition-duration: 0.5s;
        }

        .copy {
          box-sizing: border-box;
          width: var(--button-diameter);
          height: var(--button-diameter);
          border-radius: var(--button-border-radius);
          background-color: var(--button-bg);
          color: var(--button-text-color);
          border: none;
          cursor: pointer;
          position: relative;
          outline: none;
        }

        .tooltip {
          position: absolute;
          opacity: 0;
          visibility: 0;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          font: var(--tooltip-font-size) var(--tooltip-font-family);
          color: var(--tootip-text-color);
          background: var(--tooltip-bg);
          padding: var(--tooltip-padding-y) var(--tooltip-padding-x);
          border-radius: var(--toolptip-border-radius);
          pointer-events: none;
          transition: all var(--tooltip-transition-duration) cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .tooltip::before {
          content: attr(data-text-initial);
        }

        .tooltip::after {
          content: '';
          position: absolute;
          bottom: calc(var(--tooltip-padding-y) / 2 * -1);
          width: var(--tooltip-padding-y);
          height: var(--tooltip-padding-y);
          background: inherit;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          z-index: -999;
          pointer-events: none;
        }

        .copy svg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .checkmark {
          display: none;
        }

        /* actions */
        .copy:hover .tooltip,
        .copy:focus:not(:focus-visible) .tooltip {
          opacity: 1;
          visibility: visible;
          top: calc((100% + var(--tooltip-offset)) * -1);
        }

        .copy:focus:not(:focus-visible) .tooltip::before {
          content: attr(data-text-end);
        }

        .copy:focus:not(:focus-visible) .clipboard {
          display: none;
        }

        .copy:focus:not(:focus-visible) .checkmark {
          display: block;
        }

        .copy:hover,
        .copy:focus {
          background-color: var(--button-hover-bg);
        }

        .copy:active {
          outline: var(--button-outline-width) solid var(--button-outline-color);
        }

        .copy:hover svg {
          color: var(--button-hover-text-color);
        }
      }

      @media print {
        #registroForm {
            display: none;
        }

        .container-boton-copiar-items-modify {
          display: none;
        }
      }

    </style>
    `
    );

    /** Boton Copiar */
    const botonCopiar = `
     <div class="container-boton-copiar-items-modify" style="opacity: 1; position: absolute; right: 0; z-index: 10; top: -2px;">
       <button tablaSelected="pedido1" class="copy boton-copiar-items-modify">
         <span data-text-end="Copiado!" data-text-initial="Copiar" class="tooltip">
         </span>
         <span>
            <svg xml:space="preserve" style="enable-background: new 0 0 512 512" viewBox="0 0 6.35 6.35" y="0" x="0"
              height="12" width="12" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
              xmlns="http://www.w3.org/2000/svg" class="clipboard">
              <g>
                <path fill="currentColor"
                  d="M2.43.265c-.3 0-.548.236-.573.53h-.328a.74.74 0 0 0-.735.734v3.822a.74.74 0 0 0 .735.734H4.82a.74.74 0 0 0 .735-.734V1.529a.74.74 0 0 0-.735-.735h-.328a.58.58 0 0 0-.573-.53zm0 .529h1.49c.032 0 .049.017.049.049v.431c0 .032-.017.049-.049.049H2.43c-.032 0-.05-.017-.05-.049V.843c0-.032.018-.05.05-.05zm-.901.53h.328c.026.292.274.528.573.528h1.49a.58.58 0 0 0 .573-.529h.328a.2.2 0 0 1 .206.206v3.822a.2.2 0 0 1-.206.205H1.53a.2.2 0 0 1-.206-.205V1.529a.2.2 0 0 1 .206-.206z">
                </path>
              </g>
            </svg>
            <svg xml:space="preserve" style="enable-background: new 0 0 512 512" viewBox="0 0 24 24" y="0" x="0"
              height="10" width="10" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
              xmlns="http://www.w3.org/2000/svg" class="checkmark">
              <g>
                <path data-original="#000000" fill="currentColor"
                  d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z">
                </path>
              </g>
            </svg>
          </span>
       </button>
     </div>
`;

    const tdbody = document.querySelector(
      'body > div > div > table.message > tbody > tr:nth-child(3) > td > table > tbody > tr > td > div > font > div > table > tbody > tr > td > table > tbody'
    );

    function antesDeImprimir() {
      const tabla = document.querySelector(
        'body > div > div > table.message > tbody > tr:nth-child(3) > td > table > tbody > tr > td > div > font > div > table > tbody > tr > td > table'
      );

      tabla.setAttribute('border', 1);
      tabla.setAttribute('cellpadding', 2);
      tabla.setAttribute('contenteditable', true);

      tabla.style = `font-family: Arial; color: rgb(0, 0, 0); font-size: 12px; border: 1px solid #000; border-collapse: collapse;`;

      /**Columna de GRUPO */
      document
        .querySelector(
          'body > div > div > table.message > tbody > tr:nth-child(3) > td > table > tbody > tr > td > div > font > div > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(1)'
        )
        .setAttribute('width', '10%');

      /**Columna de SKU */
      document
        .querySelector(
          'body > div > div > table.message > tbody > tr:nth-child(3) > td > table > tbody > tr > td > div > font > div > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(2)'
        )
        .setAttribute('width', '12%');

      // /**Columna de DESCRIPTION */
      // document
      //   .querySelector(
      //     'body > div > div > table.message > tbody > tr:nth-child(3) > td > table > tbody > tr > td > div > font > div > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(3)'
      //   )
      //   .setAttribute('width', '20%');

      /**Columna de Color */
      document
        .querySelector(
          'body > div > div > table.message > tbody > tr:nth-child(3) > td > table > tbody > tr > td > div > font > div > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(4)'
        )
        .setAttribute('width', '8.5%');

      /**Columna de MAR */
      document
        .querySelector(
          'body > div > div > table.message > tbody > tr:nth-child(3) > td > table > tbody > tr > td > div > font > div > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(5)'
        )
        .setAttribute('width', '5%');

      /**Columna de TUL */
      document
        .querySelector(
          'body > div > div > table.message > tbody > tr:nth-child(3) > td > table > tbody > tr > td > div > font > div > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(6)'
        )
        .setAttribute('width', '5%');

      /**Columna de Detail*/
      document
        .querySelector(
          'body > div > div > table.message > tbody > tr:nth-child(3) > td > table > tbody > tr > td > div > font > div > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(7)'
        )
        .setAttribute('width', '25%');

      insertPadding();

      /**Position relative a los td con SKU */
      tdbody.childNodes.forEach((tr, index) => {
        const sku = tr.children[1];

        if (index > 0) {
          sku.style.position = 'relative';
          sku.insertAdjacentHTML('beforeend', botonCopiar);
        }
      });

      eventosCopy();
    }

    //padding-left: 8px;
    function insertPadding() {
      tdbody.childNodes.forEach(tr => {
        tr.children[6].style = 'padding-left: 8px;';
      });
    }

    /**Columna de MAR */
    function marcarEnCero() {
      tdbody.childNodes.forEach(tr => {
        const mar = Number(tr.children[4].innerText);

        if (mar === 0) {
          tr.classList.add('en-cero');
        }
      });
    }

    function despuesDeImprimir() {
      marcarEnCero();
    }

    async function copyItem(item) {
      try {
        await navigator.clipboard.writeText(item);
      } catch (err) {
        console.error('Error al copiar al portapapeles:', err);
      }
    }

    function eventosCopy() {
      document.querySelectorAll('.boton-copiar-items-modify').forEach(item => {
        item.addEventListener('click', () => {
          const skuCopy = item.parentElement.parentElement.innerText;
          copyItem(skuCopy);
        });
      });
    }

    /** Insertar Ubicaciones */
    const formulario = `
      <form id="registroForm">
        <label for="ubicaciones">Item y Ubicaciones:</label>
        <textarea id="ubicaciones" name="ubicaciones" rows="4" cols="50" required placeholder="8264-10104-10618   2-Piking-Elevador-Reserva"></textarea>
        
        <button id="registraUbicaciones" type="button">Registrar</button>
      </form>`;

    document.querySelector('body').insertAdjacentHTML('afterbegin', formulario);

    // Objeto para almacenar los datos
    const datos = {};

    document.querySelector('#registraUbicaciones').addEventListener('click', registrarDatos);

    function registrarDatos() {
      const ubicaciones = document.getElementById('ubicaciones').value;

      // Dividir el texto en lineas
      const lineas = ubicaciones.split('\n');

      // Procesar cada linea
      lineas.forEach(linea => {
        // Modificar la expresion regular para manejar el nuevo formato
        // const match = linea.match(/^(\d+-\d+-\d+)(.*)/);
        const match = linea.match(/^(\d+-\d+-\d+)(.*)[,]?(.*)/);

        if (match) {
          const item = match[1];

          const texto1 = match[2];

          // Eliminar las comas de texto1 y texto2
          const texto1SinComas = texto1.replace(/,/g, '');

          // Convertir el texto2 sin comas en un array de ubicaciones
          // const ubicaciones = match[2].split(/\s+/).filter(Boolean); // Filtrar elementos vacios
          const ubicaciones = texto1SinComas.split(/\s+/).filter(Boolean); // Filtrar elementos vacíos

          // Verificar si el item ya existe en el objeto datos
          if (datos[item]) {
            // Si existe, agregar las ubicaciones a la lista existente
            datos[item] = datos[item].concat(ubicaciones);
          } else {
            // Si no existe, crear una nueva lista con las ubicaciones
            datos[item] = ubicaciones;
          }
        }
        console.log('datos:', datos);
      });

      // Limpiar el campo de texto
      document.getElementById('ubicaciones').value = '';

      // Insertar datos
      insertarUbicaciones();
    }

    // End Ubicaciones
    function insertarUbicaciones() {
      /** Recorrer todos los sku (item) */
      tdbody.childNodes.forEach((tr, index) => {
        const item = tr.children[1].innerText;
        const ubicacion = tr.children[6];

        if (index > 0) {
          // Verifica si el item existe en el objeto datos
          if (item in datos) {
            // Inserta las ubicaciones en fila
            ubicacion.innerHTML = datos[item];
          }
        }
      });
    }

    window.addEventListener('beforeprint', antesDeImprimir);
    window.addEventListener('afterprint', despuesDeImprimir);
  }

  window.addEventListener('load', comparativo);
})();
