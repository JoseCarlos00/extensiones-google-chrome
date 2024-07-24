function initialEvents() {
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
}

// Boton imprimir
const buttonPrint = `
<div >
  <button id="printButtonInventory" type="button" class="btn btn-sm btn-purple"><i class="fas fa-print"></i>Imprimir</button>
</div>
`;

window.addEventListener('load', initialEvents, { once: true });
