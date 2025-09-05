import { configurationInitial, type ConfigurationHide, hideElementsIds } from './constants.ts';

export function getValueLocalStorage() {
	const storedState = localStorage.getItem('storedStateHide');

	return JSON.parse(storedState ?? '{}') ?? configurationInitial;
}

export function setValueLocalStorage(configurationObject: ConfigurationHide) {
	localStorage.setItem('storedStateHide', JSON.stringify(configurationObject));
}

export class EventManagerHideElement {
	private readonly prefix: string;
	private configurationObjectHide = getValueLocalStorage();
	private elementsMap: { [key: string]: HTMLElement | null };
	private ListPanelHiddenMenu: HTMLElement;
	private elementSelected: HTMLElement | null;

	constructor({ ListPanelHiddenMenu, prefix }: { ListPanelHiddenMenu: HTMLElement; prefix: string }) {
		this.elementSelected = null;
		this.prefix = prefix;
		this.ListPanelHiddenMenu = ListPanelHiddenMenu;

		this.elementsMap = {
			'copy-table': document.querySelector(`${this.prefix} #${hideElementsIds.copyTable}`),
			'insert-item': document.querySelector(`${this.prefix} #${hideElementsIds.insertItem}`),
			'insert-row': document.querySelector(`${this.prefix} #${hideElementsIds.insertRow}`),
			'copy-item': document.querySelector(`${this.prefix} #${hideElementsIds.copyItems}`),
			'counter-row': document.querySelector(`${this.prefix} #${hideElementsIds.counterRow}`),
		};
	}

	public handleEvent({ ev }: { ev: Event }) {
		const { target, type } = ev;

		if (type === 'click') {
			this.elementSelected = this.getElementToHandle(target as HTMLElement);

			if (this.elementSelected) {
				this.handleClick();
			}
		}
	}

	private getElementToHandle(target: HTMLElement | null): HTMLElement | null {
		if (!(target instanceof HTMLElement)) {
			console.warn('El target no es un HTMLElement válido');
			return null;
		}

		return target?.closest('li') || target;
	}

	private handleClick() {
		if (!this.elementSelected || !this.ListPanelHiddenMenu) {
			throw new Error('Error: [handleClick] No se encontró un elemento seleccionado o la lista de elementos');
		}

		const { nodeName, dataset } = this.elementSelected;
		const uiIcon = this.elementSelected.querySelector('.ui-icon');
		const isHide = this.ListPanelHiddenMenu.classList.contains('hidden');

		if (!isHide) {
			this.ListPanelHiddenMenu.classList.add('hidden');
		}

		if (nodeName !== 'LI' || !uiIcon || !dataset.hide) {
			console.warn('Elemento no válido o faltan atributos.');
			return;
		}

		this.toggleIcon(uiIcon);
		this.handleHideElement(dataset.hide);
	}

	private toggleIcon(uiIcon: Element) {
		uiIcon.classList.toggle('ui-iggrid-icon-hide');
		uiIcon.classList.toggle('ui-iggrid-icon-show');
	}

	private handleHideElement(hide: string) {
		const elementToHide = this.elementsMap[hide];

		if (!elementToHide) {
			console.warn('No se encontró un [data-hide] válido');
			return;
		}

		elementToHide.classList.toggle('hidden');
		this.configurationObjectHide[hide].hide = elementToHide.classList.contains('hidden');

		setValueLocalStorage(this.configurationObjectHide);
	}
}
