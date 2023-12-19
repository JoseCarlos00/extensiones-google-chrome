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

      & button {
      align-self: center;
       width: 70px;
       cursor: pointer;
      }
    }
    
    </style>
    `
    );

    /** Insertar Ubicaciones */
    const formulario = `
      <form id="registroForm">
        <label for="ubicaciones">Item, Qty y Ubicacion:</label>
        <textarea id="ubicaciones" name="ubicaciones" rows="4" cols="50" required placeholder="8264-10104-10618   1pz    1-25-02-AA-01"></textarea>
        
        
        <button id="registraUbicaciones" type="submit">Registrar</button>
      </form>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', formulario);

    content();
  }

  function content() {
    // Objeto para almacenar los datos
    const datos = {};

    document.querySelector('#registraUbicaciones').addEventListener('click', registrarDatos);

    function registrarDatos() {
      const ubicaciones = document.getElementById('ubicaciones').value;

      if (ubicaciones) {
        // Dividir el texto en líneas
        const lineas = ubicaciones.split('\n');

        // Procesar cada línea
        lineas.forEach(linea => {
          // Modificar la expresión regular para manejar el nuevo formato
          const match = linea.match(/^(\d+-\d+-\d+)\s+(\S+)\s+(\S+)/);

          if (match) {
            const item = match[1];
            const qty = match[2];
            const ubicacion = match[3];

            // Verificar si el item ya existe en el objeto datos
            if (datos[item]) {
              // Si existe, agregar la ubicación a la lista existente
              datos[item].push({ qty, ubicacion });
            } else {
              // Si no existe, crear una nueva lista con la ubicación
              datos[item] = [{ qty, ubicacion }];
            }
          }
        });

        console.log('datos:', datos);
        // Limpiar el campo de texto
        document.getElementById('ubicaciones').value = '';

        // Insertar datos
        insertarDatos();
      }
    } // End Ubicaciones

    function insertarDatos() {
      // Obtener las claves (números de artículo) del objeto datos
      const items = Object.keys(datos);

      // Verificar si hay datos para procesar
      if (items.length === 0) {
        console.log('No hay datos para insertar.');
        return;
      }

      // Obtener el primer artículo del objeto datos
      const primerItem = items[0];
      const ubicaciones = datos[primerItem];

      // Obtener la primera ubicación del primer artículo
      const primeraUbicacion = ubicaciones[0];

      // Asignar valores al formulario
      form1.item.value = primerItem;
      form1.company.value = 'FM';
      form1.quantity.value = primeraUbicacion.qty;
      form1.location.value = primeraUbicacion.ubicacion;

      // Simular una operación asincrónica, por ejemplo, un temporizador
      setTimeout(function () {
        console.log('insertarDatos completado exitosamente');
        form1.submit();
      }, 2000);
    }
  }
}
window.onload = inicio;
