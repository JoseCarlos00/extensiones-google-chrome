// Se ejecuta cuando la página ha cargado completamente.
window.addEventListener('load', () => {
	// Configuración específica para esta página
	const ulSelector = '#topNavigationBar > nav > ul.collapsepane.nav.navbar-nav';
	const urlPrefix = 'shipment_detail/';

	// Crea una instancia de la clase y la inicializa
	const shipmentPrinter = new PrintInjector({ ulSelector, urlPrefix });
	shipmentPrinter.init();
});
