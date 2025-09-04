function inicio() {
  console.log('Inventory insight print');

  const ul =
    document.querySelector('#topNavigationBar > nav > ul.collapsepane.nav.navbar-nav') ?? null;

  const li = `
    <li class="navdetailpane visible-sm visible-md visible-lg">
      <a id='printButton' href="#" data-toggle="detailpane" class="navimageanchor visiblepane" aria-label="Imprimir Inventario" data-balloon-pos="down">
        <i class="far fa-print navimage"></i>
      </a>
    </li>
    `;

  if (!ul) return;

  ul.insertAdjacentHTML('beforeend', li);

  const btnPrint = document.getElementById('printButton');

  // Escucha el evento clic en el botón print
  if (btnPrint) {
    btnPrint.addEventListener('click', getDataForToPrint);
  } else {
    alert('Error: no se encontró el botón print');
  }

  function getDataForToPrint() {
    console.log('Click [Button Print]');
    // Lógica para obtener el contenido a imprimir de la página actual
    const theadToPrint = document.getElementById('ListPaneDataGrid_headers');
    const tbodyToPrint = document.getElementById('ListPaneDataGrid');

    if (!tbodyToPrint || !theadToPrint) return;

    // Envía un mensaje al script de fondo para solicitar la apertura de una nueva pestaña
    if (chrome.runtime) {
      chrome.runtime.sendMessage({
        command: 'openNewTab',
        theadToPrint: theadToPrint.innerHTML,
        tbodyToPrint: tbodyToPrint.innerHTML,
        type: 'inventory',
      });
    }
  }
}

window.addEventListener('load', inicio);
