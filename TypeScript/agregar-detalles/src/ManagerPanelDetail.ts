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
				throw new Error('ManagerPanelDetail: Table body element (#ListPaneDataGrid > tbody) not found.');
			}

			if (!this.panelDetail) {
				throw new Error('ManagerPanelDetail: Panel detail element was not provided.');
			}

			if (!this.handlePanelDetail) {
				throw new Error('ManagerPanelDetail: handlePanelDetail instance was not provided.');
			}

			await this.insertElementsHtml();
			await this.initializeHandlePanelDetail();
			this.setEventsListeners();
			this.setupTbodyObserver();
		} catch (error) {
			// El error ya tiene el contexto, no es necesario agregar más texto.
			console.error(error);
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

	private async insertElementsHtml(): Promise<void> {
		if (this.elementsToInsert.length === 0) {
			// Esto se considera una condición de error en el flujo de inicialización.
			throw new Error('ManagerPanelDetail: No se proporcionaron elementos HTML para insertar.');
		}

		this.elementsToInsert.forEach(({ element, position = 'beforeend' }) => {
			this.insertElement({ insert: this.panelDetail, element, position });
		});

    await new Promise((resolve) => setTimeout(resolve, 50));
	}

	/**
	 * Procesa una nueva selección de fila, evitando el reprocesamiento de la misma fila.
	 * @param tr La fila de la tabla seleccionada.
	 */
	private processNewSelection(tr: HTMLTableRowElement | null): void {
		if (!tr) return;

		const trDataId = tr.getAttribute('data-id');

		// Evita el trabajo redundante si se vuelve a hacer clic en la misma fila.
		if (trDataId && this.lastSelectedId === trDataId) {
			return;
		}

		this.lastSelectedId = trDataId;
		this.handlePanelDetail.setIsCancelGetDataExternal();
		this.extraerDatosDeTr(tr);
	}

	private setEventsListeners() {
		this.tbody?.addEventListener('click', (e) => {
			const { target } = e;
			if (!(target instanceof HTMLElement)) return;

			const tr = target?.closest('tr[data-id]');
			this.processNewSelection(tr as HTMLTableRowElement | null);
		});

		// Escuchar el evento de teclado en el <tbody>
		this.tbody?.addEventListener('keydown', (e) => {
			const { key } = e;
			if (key === 'ArrowUp' || key === 'ArrowDown') {
				// Se usa un breve retardo para permitir que el navegador actualice el atributo 'aria-selected'
				// antes de que intentemos consultarlo.
				setTimeout(() => {
					const tr = this.tbody?.querySelector('tr[aria-selected="true"]');
					this.processNewSelection(tr as HTMLTableRowElement | null);
				}, 50);
			}
		});
	}

	private setupTbodyObserver() {
		// Función que se ejecutará cuando ocurra una mutación en el DOM
		const handleMutation = (mutationsList: MutationRecord[]) => {
			this.handlePanelDetail.cleanDetailPanel();
			this.handlePanelDetail.setIsCancelGetDataExternal();

			if (mutationsList[0]) {
				if (!mutationsList[0]?.target || !(mutationsList[0]?.target instanceof HTMLElement)) {
					return;
				}

				const trSelected = mutationsList[0]?.target?.querySelector('tr[aria-selected="true"]');
				if (trSelected) {
					// Actualiza el estado para mantener la consistencia con los eventos de clic/teclado.
					this.lastSelectedId = trSelected.getAttribute('data-id');
					this.extraerDatosDeTr(trSelected as HTMLTableRowElement);
				} else {
					this.lastSelectedId = null;
				}
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
