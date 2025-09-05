import { EventManagerCopy } from "./EventManagerCopy"
import { hideElementsIds } from "./constants";

interface HandlerManagerCopyConstructor {
  tableContent: HTMLTableElement | null;
  isTableEmptyOrSingleRow: () => Promise<boolean>;
  prefix: string;
}

export class HandlerManagerCopy {
	private readonly prefix: string;

	public eventManager: EventManagerCopy | null = null;

	constructor({ tableContent, prefix, isTableEmptyOrSingleRow }: HandlerManagerCopyConstructor) {
		this.prefix = prefix;
    this.eventManager = new EventManagerCopy({ tableContent, isTableEmptyOrSingleRow });

		this.initialSetup();
	}

	initialSetup() {
    if (!this.eventManager) {
      throw new Error('Error: [initialSetup] No se pudo inicializar EventManagerCopy');
    }

		this.setEventsForCopyButtons();
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
          e.stopPropagation();
					this.eventManager?.handleEvent({ ev: e });
				}
			});
		} else {
			console.warn('No se encontró el elemento .tooltip-container .tooltip-content');
		}
	}
}
