function initialEvents() {
  let activarFilas = false;

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
        .addEventListener('click', () => window.print());
    }, 100);
  }

  const body = document.querySelector('body');
  const enlace = `<a href="#gvInventario_ctl00_ctl03_ctl01_PageSizeComboBox_Input" id="irALista" hidden="">Ir a Lista</a>`;

  body && body.insertAdjacentHTML('afterbegin', enlace);

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

    if (numFilas === totalNumber) return;

    if (numFilas < totalNumber) {
      const userResponse = confirm('Impresión incompleta\nActive todas las lineas');

      if (userResponse) {
        activarFilas = true;
      } else {
        activarFilas = false;
      }
    }
  }

  function activartodasLasLineas(e) {
    e.preventDefault();

    if (!activarFilas) return;

    const btnIrALista = document.querySelector('#irALista');

    btnIrALista && btnIrALista.click();
    // alert('Activar la lineas a sido activada');

    const listFilas = document.querySelector(
      '#gvInventario_ctl00_ctl03_ctl01_PageSizeComboBox > table'
    );

    listFilas && listFilas.classList.add('bounce-active');
  }
}

// Boton imprimir
const buttonPrint = `
<div >
  <button id="printButtonInventory" type="button" class="btn btn-sm btn-purple"><i class="fas fa-print"></i>Imprimir</button>
</div>
`;

window.addEventListener('load', initialEvents, { once: true });
