import { EventManagerCopy } from "./EventManagerCopy"
import { hideElementsIds } from "./constants";

interface HandlerManagerCopyConstructor {
	tableContent: HTMLTableElement | null;
	isTableEmptyOrSingleRow: () => Promise<boolean>;
	prefix: string;
}

export class HandlerManagerCopy {
	private readonly prefix: string;
	public eventManager: EventManagerCopy | null;
	private btnCopySentenceSql: HTMLButtonElement | null;

	constructor({ tableContent, prefix, isTableEmptyOrSingleRow }: HandlerManagerCopyConstructor) {
		this.prefix = prefix;
		this.eventManager = new EventManagerCopy({ tableContent, isTableEmptyOrSingleRow });
		this.btnCopySentenceSql = null;

		this.initialSetup();
	}

	initialSetup() {
		try {
			this.btnCopySentenceSql = document.querySelector(`${this.prefix} #${hideElementsIds.copyItems}`);

			if (!this.eventManager) {
				throw new Error('Error: [initialSetup] No se pudo inicializar EventManagerCopy');
			}

			if (!this.btnCopySentenceSql) {
				throw new Error('Error: [initialSetup] No se pudo inicializar btnCopySentenceSql');
			}

			this.btnCopySentenceSql.addEventListener('click', (e) => {
				e.stopPropagation();
				this.btnCopySentenceSql?.classList?.toggle('active');
			});

			this.setEventsForCopyButtons();

			// Escucha un solo evento delegado
			document.addEventListener('close-popups', () => this.close());
		} catch (error) {
			console.error(`[HandlerManagerCopy] Error en initialSetup: ${error}`);
		}
	}

	private setEventsForCopyButtons() {
		const copyTable = document.querySelector(`${this.prefix} #${hideElementsIds.copyTable}`);
		const tooltipContainer = document.querySelector(`${this.prefix} .tooltip-container .tooltip-content`);

		if (copyTable) {
			copyTable.addEventListener('click', (e) => {
				this.eventManager?.handleEvent({ ev: e });
			});
		} else {
			console.warn(`No se encontró el elemento #${hideElementsIds.copyTable}`);
		}

		if (tooltipContainer) {
			tooltipContainer.addEventListener('click', (e) => {
				const { target } = e;

				if (!(target instanceof HTMLElement)) return;

				const { nodeName } = target;

				if (nodeName === 'BUTTON') {
					this.eventManager?.handleEvent({ ev: e });
				}
			});
		} else {
			console.warn('No se encontró el elemento .tooltip-container .tooltip-content');
		}
	}

	private close() {
		console.log('[HandlerManagerCopy] close');
		this.btnCopySentenceSql?.classList.remove('active');
	}
}
