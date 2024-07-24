/** Inventario Bodega Separado N */

function main() {
  let activarFilas = false;

  const elementoInsert = document.querySelector(
    '#frmInventarioSeparado > main > div.row > div > div > div.card-table > div.form-inline'
  );

  if (elementoInsert) {
    elementoInsert.classList.add('container-print');
    elementoInsert.children[0].classList.remove('col');

    elementoInsert.insertAdjacentHTML('beforeend', buttonPrint);

    //Evento
    setTimeout(() => {
      document
        .querySelector('#printButtonInventory')
        .addEventListener('click', () => window.print());
    }, 100);
  }

  const body = document.querySelector('body');
  const enlace =
    '<a href="#gvInventario_ctl00_ctl03_ctl01_PageSizeComboBox_Input" id="irALista" hidden="">Ir a Lista</a>';

  body && body.insertAdjacentHTML('afterbegin', enlace);

  const tdFoot = document.querySelector('#gvInventario_ctl00 > tfoot > tr > td');
  tdFoot && tdFoot.setAttribute('colspan', 24);

  window.addEventListener('beforeprint', verificarLineasDeImpresion);
  window.addEventListener('afterprint', activartodasLasLineas);

  function verificarLineasDeImpresion(e) {
    e.preventDefault(); // Detiene la impresión automáticamente

    const totalElement = document.querySelector(
      '#gvInventario_ctl00 > tfoot > tr > td > table > tbody > tr > td > div.rgWrap.rgInfoPart > strong'
    );

    const numFilasElement = document.querySelectorAll('#gvInventario_ctl00 > tbody > tr');

    const numFilas = numFilasElement ? numFilasElement.length : 0;
    const totalNumber = totalElement ? Number(totalElement.innerHTML) : 0;

    // Comparar el número de filas con el total
    if (numFilas === totalNumber || (numFilas === 0 && totalNumber === 0)) {
      console.warn('El total de filas  === 0 y total === 0\nO numfilas === totalNumber');
      return;
    }

    if (numFilas < totalNumber) {
      const userResponse = confirm('Impresión incompleta\nActive todas las lineas');

      if (userResponse) {
        activarFilas = true;
        console.log('activarFilas = true');
      } else {
        activarFilas = false;
      }
    }
  }

  function activartodasLasLineas(e) {
    e.preventDefault(); // Evita el comportamiento predeterminado del evento

    // Verificar si activarFilas está definido y es verdadero
    if (typeof activarFilas === 'undefined' || !activarFilas) {
      console.warn('No existe la variable activarFilas\nO es false');
      return;
    }

    // Seleccionar el botón para ir a la lista y hacer clic si existe
    const btnIrALista = document.querySelector('#irALista');

    if (btnIrALista) {
      btnIrALista.click();
    } else {
      console.warn('El botón #irALista no se encontró.');
    }

    // Seleccionar la lista de filas y agregar la clase 'bounce-active' si existe
    const listaDeActivarFilas = document.querySelector(
      '#gvInventario_ctl00_ctl03_ctl01_PageSizeComboBox > table tbody'
    );

    if (listaDeActivarFilas) {
      listaDeActivarFilas.addEventListener('click', () =>
        listaDeActivarFilas.classList.remove('bounce-active')
      );

      setTimeout(() => {
        listaDeActivarFilas.classList.add('bounce-active');
      }, 100);
    } else {
      console.warn('La lista de filas no se encontró.');
    }
  }
}

// Boton imprimir
const buttonPrint = `
<div >
    <button id="printButtonInventory" type="button" class="btn btn-sm btn-purple"><i class="fas fa-print"></i>Imprimir</button>
</div>
`;

window.addEventListener('load', main, { once: true });
