function inicio() {
  let pause = true;

  function getAdjType(iIndex) {
    if (iIndex == 0) return 'Ajuste Negativo';
    if (iIndex == 1) return 'Ajuste Negativo LPN';
    if (iIndex == 2) return 'Ajuste Positivo';
    if (iIndex == 3) return 'Ajustes';
    if (iIndex == 4) return 'Cambio de Estatus';
    if (iIndex == 5) return 'Status Change';
    if (iIndex == 6) return 'Transferencia Manual';
    if (iIndex == 7) return 'Transferencia Manual LP';
    return '';
  }

  let stAdj = getAdjType(form1.adjType.selectedIndex) ?? undefined;

  if (stAdj == 'Ajuste Positivo') {
    /**Estilos */
    document.querySelector('head').insertAdjacentHTML(
      'beforeend',
      `
    <style>
    #registroForm {
      position: absolute;
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 500px;

      animation: entradaElemento 0.5s ease-in-out;

      div {
        margin: 0 auto;
      }

      & button:nth-child(2) {
        align-self: center;
        width: 90px;
        cursor: pointer;
        font-size: 16px;
        padding: 10px;
        text-align: center;
        background-color: #0dd406;
      }

      & button:nth-child(2):hover {
        background: #0dd406d6;
      }
      
      & button:nth-child(2):active {
        background: #0dd406bf;
      }
    }

    .contadores-container {
      position: fixed;
      bottom: 0;
      width: 200px;
      font-size: 1.12rem;

      animation: entradaElemento 0.5s ease-in-out;

      spam {
        font-weight: bold;
        padding-left: 4px;
      }
    }

    @keyframes entradaElemento {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /** Otros estilos */
    #table1 > tbody > tr:nth-child(9) > td {
      padding: 12px 0 0 19px;
    }
    </style>
    `
    );

    const body = document.querySelector('body');

    /** Insertar Ubicaciones */
    const formulario = `
      <form id="registroForm">
        <label for="ubicaciones">Item, Qty y Ubicacion:</label>
        <textarea id="ubicaciones" name="ubicaciones" rows="4" cols="50" required placeholder="Item\t\t\tPiezas\tUbicacion\tLP(Opcional)\n8264-10104-10618\t1pz\t1-25-02-AA-01\tFMA0002376952"></textarea>
        
        <div>
          <button id="pausar" type="button">Pausar</button>
          <button id="registraUbicaciones" type="button">Registrar</button>
          <button id="cancelar" type="button">Cancel</button>
        </div>
      </form>`;

    body.insertAdjacentHTML('afterbegin', formulario);

    // Insetar Contador
    const contadores = `
      <div class="contadores-container">
        <p>
        Restantes:<spam id="countRestante">0</spam>
        </p>
      </div>
      `;

    body.insertAdjacentHTML('beforeend', contadores);

    // Verificar si esta la variable PAUSE almacenado al cargar la página
    if (chrome.storage) {
      chrome.storage.local.get('pauseChrome', result => {
        const pauseChrome = result.pauseChrome;

        if (pauseChrome) {
          pause = pauseChrome;
          console.log('Pause Get:', pauseChrome);
        } else {
          console.log('No se encontro PAUSE guardado.');
        }
      });
    } else {
      console.error('chrome.storage no está disponible.');
    }

    content();
    document.getElementById('cancelar').addEventListener('click', alertaCanceladora);
  }

  function content() {
    // Objeto para almacenar los datos

    document.querySelector('#registraUbicaciones').addEventListener('click', registrarDatos);

    function registrarDatos() {
      const datos = {};
      const ubicaciones = document.getElementById('ubicaciones').value;

      if (ubicaciones) {
        // Dividir el texto en líneas
        const lineas = ubicaciones.split('\n');

        // Contador para asignar claves numéricas únicas
        let contador = 0;

        // Procesar cada línea
        lineas.forEach(linea => {
          const match = linea.match(/^(\d+-\d+-\d+)\s+(\S+)\s+(\S+)(?:\s+([^\W_]+))?/);
          if (match) {
            const item = match[1] ?? null;
            const qty = Number(match[2]) ?? null;
            const ubicacion = match[3] ?? null;
            const LP = match[4] ?? null;
            // console.log('lp:', LP);

            if (!item || !qty || !ubicacion) return;

            // Agregar datos al objeto usando el contador como clave
            datos[contador++] = { item, qty, ubicacion, LP };
          }
        });

        // Limpiar el campo de texto
        document.getElementById('ubicaciones').value = '';

        // Insertar datos
        // console.log(datos);
        insertarDatos(datos);
      }
    } // End Ubicaciones

    function insertarDatos(datos) {
      // Obtener las claves (números de artículo) del objeto datos
      const filas = Object.keys(datos);
      contador(filas.length);
      // Verificar si hay datos para procesar
      if (filas.length === 0) {
        console.log('No hay datos para insertar.');
        return;
      }

      // console.log('datos:', datos);

      // Obtener la primera fila del objeto datos
      const primerFila = datos[filas[0]];
      // console.log('primerFila:', primerFila);
      // Asignar valores al formulario
      form1.item.value = primerFila.item;
      form1.company.value = 'FM';
      form1.quantity.value = primerFila.qty;
      form1.location.value = primerFila.ubicacion;
      if (primerFila.LP) form1.RFLOGISTICSUNIT.value = primerFila.LP;

      // Simular una operación asincrónica, por ejemplo, un temporizador
      delete datos[filas[0]];
      setTimeout(function () {
        console.log('insertarDatos completado exitosamente');
        if (chrome.storage) {
          chrome.storage.local.set({ datosAdjustment: datos }, () => {
            console.log('Datos guardados en el almacenamiento local.');
          });

          chrome.storage.local.set({ pauseChrome: pause }, () => {
            console.log('Pause Set1:', pause);
          });
        } else {
          console.error('chrome.storage no está disponible.');
        }

        console.log('pauseActive:', pause);
        if (pause) {
          document.querySelector('#submit1').click();
        }
      }, 1500);
    }

    function contador(value) {
      const countRestante = document.querySelector('#countRestante');
      countRestante.innerHTML = `${value}`;
    }

    // Verificar si hay datos almacenados al cargar la página
    if (chrome.storage) {
      // Tu código que utiliza chrome.storage aquí
      chrome.storage.local.get('datosAdjustment', result => {
        const datosAdjustment = result.datosAdjustment;

        if (datosAdjustment) {
          const datosAdjustmentNum = Object.keys(datosAdjustment).length;

          if (datosAdjustmentNum > 0) {
            document.querySelector('#ubicaciones').setAttribute('disabled', true);
            document.querySelector('#registraUbicaciones').setAttribute('disabled', true);

            console.log('Se encontraron datos guardados:', datosAdjustmentNum, datosAdjustment);

            contador(datosAdjustmentNum);
            insertarDatos(datosAdjustment);
          }
        } else {
          console.log('No se encontraron datos guardados.');
        }
      });
    } else {
      console.error('chrome.storage no está disponible.');
    }

    document.getElementById('pausar').addEventListener('click', () => {
      pause = false;

      if (chrome.storage) {
        chrome.storage.local.set({ pauseChrome: pause }, () => {
          console.log('Pause Set2:', pause);
        });
      } else {
        console.error('chrome.storage no está disponible.');
      }
    });
  }

  function alertaCanceladora() {
    const tiempoEspera = 250;

    // Mostrar una alerta que permita al usuario cancelar la ejecución de la función
    const confirmacion = confirm('¿Quieres cancelar?');
    if (confirmacion) {
      if (chrome.storage) {
        chrome.storage.local.remove('datosAdjustment', function () {
          console.log('datos borrados correctamente.');
          setTimeout(() => {
            window.location.reload();
          }, tiempoEspera);
        });
      } else {
        console.error('chrome.storage no está disponible.');
      }
    } else {
      console.log('La función no se ha ejecutado.');
    }
  }
}

window.addEventListener('load', inicio, { once: true });
