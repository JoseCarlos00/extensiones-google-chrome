function inicio() {
  console.log('Shipment line insight print');

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
  } else {
    console.log('No se encontró el elemento ul');
  }
}

function getDataForToPrint() {
  try {
    // Lógica para obtener el contenido a imprimir de la página actual
    const theadToPrint = document.querySelector('#ListPaneDataGrid_headers thead');
    const tbodyToPrint = document.querySelector('#ListPaneDataGrid tbody');

    if (!theadToPrint) {
      console.error('No se encotro el elemento <theadToPrint>');
    }

    if (!tbodyToPrint) {
      console.error('No se encotro el elemento <tbodyToPrint>');
    }

    const config = {
      command: 'openNewTab',
      urlPrefix: 'shipment_detail/',
      theadToPrint: theadToPrint.innerHTML,
      tbodyToPrint: tbodyToPrint.innerHTML,
    };

    // Envía un mensaje al script de fondo para solicitar la apertura de una nueva pestaña
    if (chrome.runtime) {
      chrome.runtime.sendMessage(config);
    }
  } catch (error) {
    console.error('Error al obtener el contenido a imprimir:', error);
  }
}
window.addEventListener('load', inicio);
