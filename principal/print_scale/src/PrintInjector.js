/**
 * Clase para inyectar un botón de impresión en una barra de navegación
 * y enviar los datos de una tabla a un script de fondo para imprimir.
 */
class PrintInjector {
	/**
	 * @param {string} ulSelector El selector CSS para el elemento <ul> donde se insertará el botón.
	 * @param {string} urlPrefix El prefijo de URL para la nueva pestaña que se abrirá.
	 */
	constructor({ ulSelector, urlPrefix }) {
		this.ulSelector = ulSelector;
		this.urlPrefix = urlPrefix;

		this.liButtonHTML = /*html*/ `
      <li class="navdetailpane visible-sm visible-md visible-lg">
        <a id='printButton' href="#" data-toggle="detailpane" aria-label="Imprimir Tabla" data-balloon-pos="right" class="navimageanchor visiblepane">
          <i class="far fa-print navimage"></i>
        </a>
      </li>
			`;
	}

	/**
	 * Inicializa el proceso: busca el elemento <ul>, inyecta el botón y añade el listener.
	 */
	init() {
		console.log('Iniciando inyección de botón de impresión.');

		const ul = document.querySelector(this.ulSelector);

		if (!ul) {
			console.error(`No se encontró el elemento ul con el selector: "${this.ulSelector}"`);
			return;
		}

		const li = this.liButtonHTML;
		if (!li) {
			console.error('No se encontró el button HTML para la inyección.');
			return;
		}

		ul.insertAdjacentHTML('beforeend', li);

		const printButton = document.getElementById('printButton');
		if (printButton) {
			printButton.addEventListener('click', this.#handlePrintClick.bind(this));
		} else {
			console.error('No se pudo encontrar el botón de impresión después de insertarlo.');
		}
	}

	/**
	 * Maneja el evento de clic en el botón de imprimir.
	 * @param {MouseEvent} event El objeto del evento de clic.
	 * @private
	 */
	#handlePrintClick(event) {
		event.preventDefault(); // Previene la acción por defecto del enlace '#'
		try {
			// Lógica para obtener el contenido a imprimir de la página actual
			const theadToPrint = document.querySelector('#ListPaneDataGrid_headers thead');
			const tbodyToPrint = document.querySelector('#ListPaneDataGrid tbody');

			if (!theadToPrint || !tbodyToPrint) {
				console.error('No se encontró el elemento <thead> o <tbody> para imprimir.');
				return;
			}

			const config = {
				command: 'openNewTab',
				urlPrefix: this.urlPrefix,
				theadToPrint: theadToPrint.innerHTML,
				tbodyToPrint: tbodyToPrint.innerHTML,
			};

			// Envía un mensaje al script de fondo para solicitar la apertura de una nueva pestaña
			if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
				chrome.runtime.sendMessage(config);
			} else {
				console.warn('chrome.runtime.sendMessage no está disponible. Config:', config);
			}
		} catch (error) {
			console.error('Error al obtener el contenido a imprimir:', error);
		}
	}
}
