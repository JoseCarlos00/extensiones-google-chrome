function inicio() {
  console.log('Shipping container insight print');

  const ul =
    document.querySelector('#topNavigationBar > nav > ul.collapsepane.nav.navbar-nav') ?? null;

  const li = `
    <li class="navdetailpane visible-sm visible-md visible-lg">
      <a id='printButton' href="#" data-toggle="detailpane" aria-label="Imprimir Tabla" data-balloon-pos="right" class="navimageanchor visiblepane">
        <i class="far fa-print navimage"></i>
      </a>
    </li>`;

  if (ul) {
    ul.insertAdjacentHTML('beforeend', li);

    // Escucha el evento clic en el botón print
    const printButton = document.getElementById('printButton');

    printButton && printButton.addEventListener('click', getDataForToPrint);
  }
}

function getDataForToPrint() {
  // Lógica para obtener el contenido a imprimir de la página actual
  const theadToPrint = document.getElementById('ListPaneDataGrid_headers');
  const tbodyToPrint = document.getElementById('ListPaneDataGrid');

  if (!tbodyToPrint || !theadToPrint) return;

  // Envía un mensaje al script de fondo para solicitar la apertura de una nueva pestaña
  if (chrome.runtime && tbodyToPrint && theadToPrint) {
    chrome.runtime.sendMessage({
      command: 'openNewTab',
      theadToPrint: theadToPrint.innerHTML,
      tbodyToPrint: tbodyToPrint.innerHTML,
    });
  }
}
window.addEventListener('load', inicio);
