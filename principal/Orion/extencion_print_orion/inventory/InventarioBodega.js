function initialEvents() {
  /** Banderas Globales */
  let activarFilas = false;
  let isVerificarLineasDeImpresionExecuted = false;

  try {
    const elementoInsert = document.querySelector(
      '#frmConsultaMiodani > main > div.row > div > div > div.card-table > div.form-inline'
    );

    if (elementoInsert) {
      elementoInsert.classList.add('container-print');
      elementoInsert.children[0].classList.remove('col');

      elementoInsert.insertAdjacentHTML('beforeend', buttonPrint);

      //Evento
      setTimeout(() => {
        document
          .querySelector('#printButtonInventory')
          .addEventListener('click', verificarLineasDeImpresion);
      }, 100);
    }

    const body = document.querySelector('body');
    const enlace =
      '<a href="#gvInventario_ctl00_ctl03_ctl01_ddlPageSize_Det" id="irALista" hidden="">Ir a Lista</a>';

    body && body.insertAdjacentHTML('afterbegin', enlace);

    window.addEventListener('beforeprint', verificarLineasDeImpresion);
    window.addEventListener('afterprint', activartodasLasLineas);

    document.addEventListener('keydown', function (event) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        console.warn('¡Has presionado Ctrl + P!');
        event.preventDefault(); // Prevenir la acción predeterminada de imprimir la página

        verificarLineasDeImpresion();
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }

  function verificarLineasDeImpresion() {
    if (isVerificarLineasDeImpresionExecuted) {
      console.log(
        'Retur: isVerificarLineasDeImpresionExecuted:',
        isVerificarLineasDeImpresionExecuted
      );
      return;
    }

    isVerificarLineasDeImpresionExecuted = true;
    console.log('verificarLineasDeImpresion se ha ejecutado');

    const totalElement = document.querySelector(
      '#gvInventario_ctl00 > tfoot > tr > td > div > div > div:nth-child(7)'
    );

    // Obtener el contenido del elemento
    const text = totalElement ? totalElement.innerText.trim() : '';
    const match = text.match(/\d+/);
    const number = match ? match[0] : '0';
    const totalNumber = Number(number);

    const numFilasElement = document.querySelectorAll('#gvInventario_ctl00 > tbody tr');
    const numFilas = numFilasElement ? numFilasElement.length : 0;

    // Comparar el número de filas con el total
    if (numFilas === totalNumber || (numFilas === 0 && totalNumber === 0)) {
      console.warn('El total de filas  === 0 y total === 0\nO numfilas === totalNumber');
      window.print();
      return;
    }

    if (numFilas < totalNumber) {
      const userResponse = confirm(
        '❌Impresión incompleta\n' +
          'Active todas las líneas\n' +
          '¿Desea continuar con la impresión?\n' +
          '     ⚠️                                                                      Sí        /        No'
      );

      if (userResponse) {
        activarFilas = false;
        window.print();
      } else {
        activarFilas = true;
        console.log('activarFilas = true');
        setTimeout(activartodasLasLineas, 50);
      }
    }
  }

  function activartodasLasLineas() {
    isVerificarLineasDeImpresionExecuted = false;

    // Verificar si activarFilas está definido y es verdadero
    if (typeof activarFilas === 'undefined' || !activarFilas) {
      console.warn('No existe la variable activarFilas\nO es false');
      return;
    }

    activarFilas = false;

    // Seleccionar el botón para ir a la lista y hacer clic si existe
    const btnIrALista = document.querySelector('#irALista');

    if (btnIrALista) {
      btnIrALista.click();
    } else {
      console.warn('El botón #irALista no se encontró.');
    }

    // Seleccionar la lista de filas y agregar la clase 'bounce-active' si existe
    const listaDeActivarFilas = document.querySelector(
      '#gvInventario_ctl00_ctl03_ctl01_ddlPageSize_Det'
    );

    if (listaDeActivarFilas) {
      listaDeActivarFilas.addEventListener('click', () =>
        listaDeActivarFilas.classList.remove('bounce-active')
      );

      setTimeout(() => {
        listaDeActivarFilas.classList.add('bounce-active');
      }, 100);
    } else {
      console.warn('La lista de filas activas no se encontró.');
    }
  }
}

// Boton imprimir
const buttonPrint = `
<div >
  <button id="printButtonInventory" type="button" class="btn btn-sm btn-purple"><i class="fas fa-print"></i>Imprimir</button>
</div>
`;

window.addEventListener('load', initialEvents, { once: true });
