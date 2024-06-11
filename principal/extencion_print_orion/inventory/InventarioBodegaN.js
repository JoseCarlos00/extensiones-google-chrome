/** Inventario Bodega Separado N */

function inicio() {
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

  const tdFoot = document.querySelector('#gvInventario_ctl00 > tfoot > tr > td');
  tdFoot && tdFoot.setAttribute('colspan', 24);
}

// Boton imprimir
const buttonPrint = `
<div >
    <button id="printButtonInventory" type="button" class="btn btn-sm btn-purple"><i class="fas fa-print"></i>Imprimir</button>
</div>
`;

window.addEventListener('load', inicio, { once: true });
