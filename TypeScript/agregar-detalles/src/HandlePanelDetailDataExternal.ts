import { HandlePanelDetail } from "./HandlePanelDetail"
import { ToastAlert } from "./utils/ToastAlert"

export class HandlePanelDetailDataExternal extends HandlePanelDetail {
	backgroundMessage: string = "invalidate";
	headerDataExternalPrincipal: string = 'not data';
	backgroundMessageUOM: string = 'actualizar_datos_de_item_unit_of_measure';
	isCancelGetDataExternal: boolean = false;
	seeMoreInformationSelector: { [key: string]: string };
	externalPanelElements: { [key: string]: HTMLElement } = {};
	internalPanelElements: { [key: string]: HTMLElement } = {};
	panelElements: { [key: string]: HTMLElement } = {};
	internalPanelValue: { [key: string]: string } = {};
	messageMap: { [key: string]: Function };

	constructor() {
		super();

		this.seeMoreInformationSelector = {
			seeMoreInformation: '#seeMoreInformation',
			capacityCJ: '#DetailPaneHeaderShowCapacityCJ',
		};

		this.messageMap = {
			[this.backgroundMessage]: (datos) => this.updateDetailsPanelInfo(datos),
			datos_no_encontrados: () => this.removeClassWait(this.externalPanelElements),
		};
	}

	initializeInternalPanelElements() {
		// Retorna un Objeto de Elementos
		throw new Error('El método initializeInternalPanelElements no esta definido');
	}

	initializeExternalPanelElements() {
		// Retorna un Objeto de Elementos
		throw new Error('El método initializeExternalPanelElements no esta definido');
	}

	initializePanelElements() {
		return new Promise((resolve, reject) => {
			const internalElements = this.initializeInternalPanelElements() ?? {};
			const externalElements = this.initializeExternalPanelElements() ?? {};

			// Combina todos los elementos
			const allElements = {
				...internalElements,
				...externalElements,
			};

			const missingOptions = Object.entries(allElements)
				.filter(([_key, value]) => !value)
				.map(([key]) => key);

			if (missingOptions.length > 0) {
				reject(
					`No se encontraron los elementos necesarios para inicializar HandlePanelDetail: [${missingOptions.join(
						', '
					)}]`
				);
			}

			// Asigna los elementos validados a sus respectivos objetos
			this.internalPanelElements = internalElements;
			this.externalPanelElements = externalElements;
			this.panelElements = allElements;

			setTimeout(resolve, 50);
		});
	}

	async cleanDetailPanel() {
		for (const key in this.panelElements) {
			const element = this.panelElements[key];

			if (element) {
				element.innerHTML = '';
				element.classList.remove('wait');
			}
		}
	}

	insertSeeMoreInformation() {
		const { seeMoreInformation } = this.panelElements;

		if (seeMoreInformation) {
			seeMoreInformation.classList.remove('disabled');
			seeMoreInformation.innerHTML = 'Ver mas info...';
		}
	}

	waitForData(externalPanelElements: { [key: string]: HTMLElement }) {
		const text = '1346-863-28886...';

		if (!(externalPanelElements instanceof Object) || !externalPanelElements) {
			console.error('[waitForData]: No se encontró el objeto [externalPanelElements]');
			return;
		}

		for (const key in externalPanelElements) {
			const element = externalPanelElements[key];

			if (element) {
				element.innerHTML = text;
				element.classList.add('wait');
			}
		}
	}

	removeClassWait(externalPanelElements: { [key: string]: HTMLElement }) {
		const text = 'No encontrado';

		if (!(externalPanelElements instanceof Object) || !externalPanelElements) {
			console.error('[removeClassWait]: No se encontró el objeto [externalPanelElements]');
			return;
		}

		for (const key in externalPanelElements) {
			const element = externalPanelElements[key];

			if (element) {
				element.innerHTML = text;
				element.classList.remove('wait');
			}
		}
	}

	updateDetailsPanelInfo(datos) {
		// Actualizar la interfaz con los datos recibidos
		throw new Error('El método _updateDetailsPanelInfo no esta definido');
	}

	setDataExternal(elementsToUpdate = []) {
		if (elementsToUpdate.length === 0) {
			console.warn('[setDataExternal]: [elementsToUpdate] esta vació');
			return;
		}

		// Iterar sobre elementsToUpdate
		elementsToUpdate.forEach(({ element, value }: { element: HTMLElement; value: string }) => {
			// Actualizar el valor del elemento
			if (element) {
				element.innerText = value;
				element.classList.remove('wait');
			}
		});
	}

	sendBackgroundMessage(urlParams: string) {
		chrome.runtime.sendMessage(
			{
				action: 'some_action',
				url: urlParams,
			},
			(response) => {
				console.log('Respuesta de background.js:', response.status);
			}
		);
	}

	getDataExternal() {
		// Obtener los datos de la API externa
		throw new Error('El método _getDataExternal no esta definido');
	}

	setEventSeeMore() {
		const { seeMoreInformation } = this.panelElements;
		// Agregar evento al botón "Ver más"
		if (!seeMoreInformation) {
			console.warn('No se encontró el botón "Ver más"');
			return;
		}

		seeMoreInformation.addEventListener('click', () => {
			seeMoreInformation.classList.add('disabled');
			this.getDataExternal();
		});
	}

	initializeDataExternal() {
		this.listeningToBackgroundMessages();
		this.setEventSeeMore();
	}

	async initializeHandlePanelDetail() {
		try {
			await this.initializePanelElements();
			this.initializeDataExternal();
		} catch (error) {
			console.error('Error: ha ocurrido un error al inizicailar HandlePanelDetailDataExternal:', error);
		}
	}

	handleDataNoFoundCapacity() {
		const { capacityCJ } = this.externalPanelElements;

		if (capacityCJ) {
			capacityCJ.innerHTML = 'No encontrado';
			capacityCJ.classList.remove('wait');
			capacityCJ.classList.remove('disabled');
			capacityCJ.classList.add('show-info');
		}
	}

	handleDataNotFound(datos) {
		const { header } = datos;

		if (header === this.headerDataExternalPrincipal) {
			this.removeClassWait(this.group1ExternalPanelElements);
			return;
		}
	}

	updateCapacityCJ(datos) {
		const { capacityCJ } = this.panelElements;
		const { capacityCJ: capacityCJValue = '' } = datos;

		if (!capacityCJ) {
			console.warn('No se encontró el elemento de <capacidadCJ>');
			return;
		}

		capacityCJ.innerHTML = `${capacityCJValue} CJ`;
		capacityCJ.classList.remove('wait');
		capacityCJ.classList.remove('disabled');
		capacityCJ.classList.add('show-info');
	}

	fetchCapacityData(item: string) {
		try {
			const urlParams = `https://wms.fantasiasmiguel.com.mx/scale/trans/itemUOM?Item=${item}&Company=FM&active=active`;
			this.sendBackgroundMessage(urlParams);
		} catch (error) {
			console.error('Error: ha ocurrido un error al obtener la capacidad de item:', error);
		}
	}

	getCurrentINternalItem() {
		const { item } = this.internalPanelValue;
		return item;
	}

	getCurrentItem() {
		const currentItem = document.querySelector('#DetailPaneHeaderItem')?.textContent?.trim();
		return currentItem;
	}

	getCapacityCJ() {
		const item = this.getCurrentItem();
		console.log('CurrentItem:', item);

		if (!item) {
			ToastAlert.showAlertMinTop('Ha ocurrido un error al obtener la capacidad del item');
			return;
		}

		const { capacityCJ } = this.externalPanelElements;

		this.waitForData({ capacityCJ });
		this.setIsCancelGetDataExternal(false);
		this.fetchCapacityData(item);
	}

	initializeCapacityCJText() {
		const { capacityCJ } = this.externalPanelElements;

		if (!capacityCJ) {
			console.warn('No se encontró el elemento "Capacidad CJ"');
			return;
		}

		capacityCJ.classList.remove('disabled');
		capacityCJ.classList.remove('show-info');
		capacityCJ.innerHTML = 'Capacidad CJ...';
	}

	setClickEventCapacityCJ() {
		const { capacityCJ } = this.externalPanelElements;

		if (!capacityCJ) {
			console.warn('No se encontró el elemento "Capacidad CJ"');
			return;
		}

		capacityCJ.addEventListener('click', (e) => {
			capacityCJ.classList.add('disabled');

			this.getCapacityCJ();
		});
	}

	listeningToBackgroundMessages() {
		chrome.runtime.onMessage.addListener((message) => {
			const { action, datos } = message;

			console.log('msg action:', action);
			console.log('this.backgroundMessage:', this.backgroundMessage);

			if (this.isCancelGetDataExternal) {
				return;
			}

			if (this.messageMap[action]) {
				this.messageMap[action](datos);
			} else {
				console.error('[listeningToBackgroundMessages]: unknown background response message:', message.action);
				console.log(this.messageMap);
			}
		});
	}
}
