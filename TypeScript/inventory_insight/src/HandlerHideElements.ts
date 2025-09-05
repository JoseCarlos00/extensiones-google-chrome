import { EventManagerHideElement } from './EventManagerHideElement';

interface HandlerHideElementsOptions {
	prefix: string;
}

export class HandlerHideElements {
	private prefix: string;
	private ListPanelHiddenMenu: HTMLElement | null;

	constructor({ prefix }: HandlerHideElementsOptions) {
		this.prefix = prefix;
		this.ListPanelHiddenMenu = null;

		this.initialize();
	}

	private initialize() {
		try {
			this.ListPanelHiddenMenu = document.querySelector(`${this.prefix} #ListPaneDataGrid_popover`);
			this.setEventHideElement();

			// Escucha un solo evento delegado
			document.addEventListener('close-popups', () => this.close());
		} catch (error) {
			console.error('[HandlerHideElements]: Error al inicializar HideElements:', error);
		}
	}

	private setEventHideElement() {
		const btnHideElement = document.querySelector(`${this.prefix} #hide-elements`);
		const ulList = document.querySelector(`${this.prefix} #list-elements`);

		if (!this.ListPanelHiddenMenu) {
			throw new Error('No se encontró el elemento #ListPaneDataGrid_popover');
		}

		if (!btnHideElement) {
			throw new Error('No se encontró el elemento #hide-elements');
		}

		if (!ulList) {
			throw new Error('No se encontró el elemento #list-elements');
		}

		btnHideElement.addEventListener('click', (e) => {
			// 1. Notificamos a todos los demás popups que se cierren.
			document.dispatchEvent(new CustomEvent('close-popups'));
			e.stopPropagation();
			// 2. Abrimos/cerramos nuestro propio popup.
			this.ListPanelHiddenMenu?.classList.toggle('hidden');
		});

		const eventManager = new EventManagerHideElement({ ListPanelHiddenMenu: this.ListPanelHiddenMenu, prefix: this.prefix });
		
		ulList.addEventListener('click', (e) => {
			e.stopPropagation();
			eventManager.handleEvent({ event: e });
		});
	}

	private close() {
		console.log('[HandlerHideElements] close');
		this.ListPanelHiddenMenu?.classList.add('hidden');
	}
}
