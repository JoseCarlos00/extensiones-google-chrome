(function () {
  function inicio() {
    console.log('Shipping container insight');

    const ul =
      document.querySelector('#topNavigationBar > nav > ul.collapsepane.nav.navbar-nav') ??
      undefined;

    const li = `
    <li class="navdetailpane visible-sm visible-md visible-lg">
      <a id='printButton' href="#" data-toggle="detailpane" class="navimageanchor visiblepane">
        <i class="far fa-print navimage"></i>
      </a>
    </li>`;

    if (ul) {
      ul.insertAdjacentHTML('beforeend', li);

      // Escucha el evento clic en el botón de la extensión
      document.getElementById('printButton').addEventListener('click', () => {
        // Lógica para obtener el contenido a imprimir de la página actual
        const theadToPrint = document.getElementById('ListPaneDataGrid_headers').innerHTML;
        const tbodyToPrint = document.getElementById('ListPaneDataGrid').innerHTML;

        // Envía un mensaje al script de fondo para solicitar la apertura de una nueva pestaña
        if (chrome.runtime) {
          chrome.runtime.sendMessage({
            command: 'openNewTab',
            theadToPrint: theadToPrint,
            tbodyToPrint: tbodyToPrint,
          });
        }
      });
    }
  }

  window.addEventListener('load', inicio, { once: true });
})();
