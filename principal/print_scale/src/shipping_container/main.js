const BUTTON_PRINT_SELECT_DOCS = `
<li class="navdetailpane visible-sm visible-md visible-lg">
        <a id="ListPaneMenuActionPrintContainerDocs" class="navimageanchor visiblepane" data-resourcekey="PRINTDEFAULTDOCS" data-resourcevalue="Print default docs" href="javascript:;  " data-securitycheckpoint="21">
<i class="far fa-file-powerpoint navimage"></i></a>
      </li>
`;

class PrintInjectorShippingContainer extends PrintInjector {
	constructor(parameters) {
		super(parameters);

			this.liButtonHTML = /*html*/ `
      <li class="navdetailpane visible-sm visible-md visible-lg">
        <a id='printButton' href="#" data-toggle="detailpane" aria-label="Imprimir Tabla" data-balloon-pos="right" class="navimageanchor visiblepane">
          <i class="far fa-print navimage"></i>
        </a>
      </li>
			
			${BUTTON_PRINT_SELECT_DOCS}
			`;
	}
}

// Se ejecuta cuando la página ha cargado completamente.
window.addEventListener('load', () => {
	// Configuración específica para esta página
	const ulSelector = '#topNavigationBar > nav > ul.collapsepane.nav.navbar-nav';
	const urlPrefix = 'shipping_container/';

	// Crea una instancia de la clase y la inicializa
	const shipmentPrinter = new PrintInjectorShippingContainer({ ulSelector, urlPrefix });
	shipmentPrinter.init();
});
