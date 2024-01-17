function inicio() {
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

      & button {
        align-self: center;
        width: 90px;
        cursor: pointer;
        font-size: 16px;
        padding: 10px;
        text-align: center;
        background-color: #0dd406;
      }

      & button:hover {
        background: #0dd406d6;
      }
      
      & button:active {
        background: #0dd406bf;
      }
    }

    .contadores-container {
      position: fixed;
      bottom: 0;
      width: 200px;
      font-size: 1.12rem;

      spam {
        font-weight: bold;
      }
    }
    </style>
    `
    );

    const body = document.querySelector('body');

    /** Insertar Ubicaciones */
    const formulario = `
      <form id="registroForm">
        <label for="ubicaciones">Item, Qty y Ubicacion:</label>
        <textarea id="ubicaciones" name="ubicaciones" rows="4" cols="50" required placeholder="8264-10104-10618   1pz    1-25-02-AA-01    FMA0002376952(Opcional)"></textarea>
        
        <button id="registraUbicaciones" type="button">Registrar</button>
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
    content();
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

        // Procesar cada línea
        lineas.forEach(linea => {
          const match = linea.match(/^(\d+-\d+-\d+)\s+(\S+)\s+(\S+)(?:\s+([^\W_]+))?/);

          if (match) {
            const item = match[1] ?? null;
            const qty = Number(match[2]) ?? null;
            const ubicacion = match[3] ?? null;
            const LP = match[4] ?? null;
            console.log('lp:', LP);

            if (!item || !qty || !ubicacion) return;
            // Verificar si el item ya existe en el objeto datos
            if (datos[item]) {
              // Si existe, agregar la ubicación a la lista existente
              datos[item].push({ qty, ubicacion, LP });
            } else {
              // Si no existe, crear una nueva lista con la ubicación
              datos[item] = [{ qty, ubicacion, LP }];
            }
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
      const items = Object.keys(datos);
      contador(items.length);
      // Verificar si hay datos para procesar
      if (items.length === 0) {
        console.log('No hay datos para insertar.');
        return;
      }

      // Obtener el primer artículo del objeto datos
      const primerItem = items[0];
      const ubicaciones2 = datos[primerItem];

      // Obtener el primer Objeto del primer artículo, item,lp,qty y loc
      const primeraUbicacion = ubicaciones2[0];

      // Asignar valores al formulario
      form1.item.value = primerItem;
      form1.company.value = 'FM';
      form1.quantity.value = primeraUbicacion.qty;
      form1.location.value = primeraUbicacion.ubicacion;
      if (primeraUbicacion.LP) form1.RFLOGISTICSUNIT.value = primeraUbicacion.LP;

      // Simular una operación asincrónica, por ejemplo, un temporizador
      delete datos[primerItem];
      setTimeout(function () {
        console.log('insertarDatos completado exitosamente');
        if (chrome.storage) {
          // Tu código que utiliza chrome.storage aquí
          // Guardar los datos en el almacenamiento local
          chrome.storage.local.set({ datosGuardados: datos }, function () {
            console.log('Datos guardados en el almacenamiento local.');
          });
        } else {
          console.error('chrome.storage no está disponible.');
        }

        form1.submit();
      }, 1800);
    }

    function contador(value) {
      const countRestante = document.querySelector('#countRestante');
      countRestante.innerHTML = `${value}`;
    }

    // Verificar si hay datos almacenados al cargar la página
    if (chrome.storage) {
      // Tu código que utiliza chrome.storage aquí
      chrome.storage.local.get('datosGuardados', function (result) {
        const datosGuardados = result.datosGuardados;
        const datosGuardadosNum = Object.keys(datosGuardados).length;

        if (datosGuardados) {
          console.log('Se encontraron datos guardados:', datosGuardadosNum, datosGuardados);
          contador(datosGuardadosNum);
          insertarDatos(datosGuardados);
        } else {
          console.log('No se encontraron datos guardados.');
        }
      });
    } else {
      console.error('chrome.storage no está disponible.');
    }
  }
}
window.onload = inicio;
