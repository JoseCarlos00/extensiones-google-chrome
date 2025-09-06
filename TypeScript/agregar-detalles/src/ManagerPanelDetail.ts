export interface IHandlerPanelDetail {
	initializeHandlePanelDetail(): Promise<void> | void;
	setIsCancelGetDataExternal(): void;
	cleanDetailPanel(): void;
	extraerDatosDeTr(tr: HTMLTableRowElement): void;
}

export type InsertPosition = 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend';
export type ElementToInsert = { element: Element; position?: InsertPosition };


interface ManagerPanelDetailConstructor<T extends IHandlerPanelDetail> {
	panelDetail: HTMLElement;
	elementsHtmlToInsert: ElementToInsert[];
	handlePanelDetail: T;
}


export class ManagerPanelDetail<T extends IHandlerPanelDetail> {
	tbody: HTMLTableSectionElement | null;
	panelDetail: HTMLElement;
	elementsToInsert: ElementToInsert[];
	handlePanelDetail: T;
	lastSelectedId: string | null = null;

	constructor({ panelDetail, elementsHtmlToInsert, handlePanelDetail }: ManagerPanelDetailConstructor<T>) {
		this.tbody = document.querySelector('#ListPaneDataGrid > tbody');
		this.panelDetail = panelDetail;
		this.elementsToInsert = elementsHtmlToInsert;
		this.handlePanelDetail = handlePanelDetail;
	}

	async initialize() {
		try {
			if (!this.tbody) {
				throw new Error('Table body element not found');
			}

			if (!this.panelDetail) {
				throw new Error('Panel detail element not found');
			}

			if (!this.handlePanelDetail) {
				throw new Error('HandlePanelDetail element not found');
			}

			await this.insertElementsHtml();
			await this.initializeHandlePanelDetail();
			this.setEventsListeners();
			this.observation();
		} catch (error) {
			console.error(`Error: Ha ocurrido un error al inicializar ManagerDetail: ${error}`);
		}
	}

	private async initializeHandlePanelDetail() {
		await this.handlePanelDetail.initializeHandlePanelDetail();
	}

	extraerDatosDeTr(tr: HTMLTableRowElement) {
		this.handlePanelDetail.extraerDatosDeTr(tr);
	}

	insertElement({ insert, element: elementToInsert, position = 'beforeend' }: { insert: HTMLElement; element: Element; position?: string }) {
		if (elementToInsert instanceof HTMLElement && elementToInsert) {
			insert.insertAdjacentElement(position as InsertPosition, elementToInsert);
		} else {
			console.warn('El elemento no es de tipo Html Element');
		}
	}

	insertElementsHtml() {
		return new Promise((resolve, reject) => {
			if (this.elementsToInsert.length === 0) {
				reject('No se Encontraron elementos a insertar');
			}

			this.elementsToInsert.forEach(
				({ element, position = 'beforeend' }) => {
					this.insertElement({ insert: this.panelDetail, element, position });
				}
			);

			setTimeout(resolve, 50);
		});
	}

	private setEventsListeners() {
		this.tbody?.addEventListener('click', (e) => {
			const { target } = e;

			if (!target || !(target instanceof HTMLElement)) {
				console.warn('[ManagerDetail setEventsListeners]No se encontró el elemento');
				return;
			}

			const tr = target?.closest('tr[data-id]');

			if (tr) {
				const trDataId = tr.getAttribute('data-id');

				if (this.lastSelectedId !== trDataId) {
					this.lastSelectedId = trDataId;
				}

				this.handlePanelDetail.setIsCancelGetDataExternal();
				this.extraerDatosDeTr(tr as HTMLTableRowElement);
			}
		});

		// Escuchar el evento de teclado en el <tbody>
		this.tbody?.addEventListener('keydown', (e) => {
			const { key } = e;

			if (key === 'ArrowUp' || key === 'ArrowDown') {
				const tr = this.tbody?.querySelector('tr[aria-selected="true"]');

				if (tr) {
					this.handlePanelDetail.setIsCancelGetDataExternal();
					this.extraerDatosDeTr(tr as HTMLTableRowElement);
				}
			}
		});
	}

	private observation() {
		// Función que se ejecutará cuando ocurra una mutación en el DOM
		const handleMutation = (mutationsList: MutationRecord[]) => {
			this.handlePanelDetail.cleanDetailPanel();
			this.handlePanelDetail.setIsCancelGetDataExternal();

			if (mutationsList[0]) {
				if (!mutationsList[0]?.target || !(mutationsList[0]?.target instanceof HTMLElement)) {
					return;
				}

				const trSelected = mutationsList[0]?.target?.querySelector('tr[aria-selected="true"]');
				trSelected && this.extraerDatosDeTr(trSelected as HTMLTableRowElement);
			}
		};

		// Configuración del observer
		const observerConfig = {
			attributes: false, // Observar cambios en atributos
			childList: true, // Observar cambios en la lista de hijos
			subtree: false, // Observar cambios en los descendientes de los nodos objetivo
		};

		// Crea una instancia de MutationObserver con la función de callback
		const observer = new MutationObserver(handleMutation);

		// Inicia la observación del nodo objetivo y su configuración
		observer.observe(this.tbody!, observerConfig);
	}
}
