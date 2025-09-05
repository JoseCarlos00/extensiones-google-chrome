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
			const prevClass = this.ListPanelHiddenMenu?.classList.contains('hidden');

			// 1. Notificamos a todos los demás popups que se cierren.
			document.dispatchEvent(new CustomEvent('close-popups'));
			e.stopPropagation();
			// 2. Abrimos/cerramos nuestro propio popup.
		
			// hidden = Closed
			// not hidden = Open
			if (prevClass) {
				this.open();
			} else {
				this.close();
			}
			
		});

		const eventManager = new EventManagerHideElement({ prefix: this.prefix });
		
		ulList.addEventListener('click', (e) => {
			e.stopPropagation();
			eventManager.handleEvent({ event: e });
		});
	}

	private open() {
		this.ListPanelHiddenMenu?.classList.remove('hidden');
	}

	private close() {
		this.ListPanelHiddenMenu?.classList.add('hidden');
	}
}
