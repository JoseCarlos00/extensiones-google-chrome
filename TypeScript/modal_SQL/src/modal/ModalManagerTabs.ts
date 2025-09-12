import { ModalManager, type IModalHandler, type ModalManagerConstructor } from './ModalManager';

export class ModalManagerTabs<T extends IModalHandler> extends ModalManager<T> {
	constructor(configuration: ModalManagerConstructor<T>) {
		super(configuration);
	}

	protected setEventListeners() {
		try {
			super.setEventListeners();

			this.initEventsTabs();
		} catch (error) {
			console.error('[ModalManagerTabs]: Error: Ha ocurrido un error al crear los eventListener', error);
		}
	}

	initEventsTabs() {
		const tabs = document.querySelectorAll('.MuiTabs-container-principal .MuiTabs-list button') as NodeListOf<HTMLButtonElement>;
		const panels = document.querySelectorAll(".MuiTabs-container-principal [role='tabpanel']") as NodeListOf<HTMLDivElement>;
		const indicator = document.querySelector('.MuiTabs-container-principal .MuiTabs-indicator') as HTMLSpanElement;

		const tabSelected = document.querySelector('.MuiTabs-container-principal .MuiTabs-list button.Mui-selected') as HTMLButtonElement | null;

		if (tabs.length === 0 || panels.length === 0 || !indicator) {
			console.warn('No se encontraron los elementos tabulares');
			return;
		}

		tabs.forEach((tab: HTMLButtonElement, index: number) => {
			tab.addEventListener('click', function () {
				// Remover clase activa de todos los tabs
				tabs.forEach((t) => t.classList.remove('Mui-selected'));

				// Agregar clase activa al tab activo
				this.classList.add('Mui-selected');

				// Mostrar el panel correspondiente y ocultar los demás
				panels.forEach((panel) => (panel.hidden = true));

				const panel = document.getElementById(`tabpanel-${index}`)
				panel && (panel.hidden = false);

				// Actualizar aria-selected
				tabs.forEach((t) => t.setAttribute('aria-selected', 'false'));
				this.setAttribute('aria-selected', 'true');

				// Mover indicador visual
				indicator.style.left = `${this.offsetLeft}px`;
				indicator.style.width = `${this.offsetWidth}px`;
			});
		});

		if (tabSelected) {
			indicator.style.left = `${tabSelected.offsetLeft}px`;
			indicator.style.width = `${tabSelected.offsetWidth}px`;
		}
	}
}
