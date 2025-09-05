import { EventManagerCopy } from "./EventManagerCopy"
import { hideElementsIds } from "./constants";

interface HandlerManagerCopyConstructor {
	tableContent: HTMLTableElement | null;
	isTableEmptyOrSingleRow: () => Promise<boolean>;
	prefix: string;
}

/**
 * Manages the "Copy SQL" popup and its associated actions.
 * This includes handling the main trigger button and the individual copy buttons.
 */
export class HandlerManagerCopy {
	private readonly prefix: string;
	private readonly eventManager: EventManagerCopy;
	private readonly triggerButton: HTMLButtonElement | null;

	constructor({ tableContent, prefix, isTableEmptyOrSingleRow }: HandlerManagerCopyConstructor) {
		this.prefix = prefix;
		this.eventManager = new EventManagerCopy({ tableContent, isTableEmptyOrSingleRow });
		this.triggerButton = document.querySelector(`${this.prefix} #${hideElementsIds.copyItems}`);

		this.initialize();
	}

	/**
	 * Sets up all necessary event listeners for the component.
	 */
	private initialize(): void {
		try {
			if (!this.triggerButton) {
				throw new Error(`Could not find the trigger button: #${hideElementsIds.copyItems}`);
			}

			this.setupTriggerButtonListener();
			this.setupActionListeners();

			// Listen for the global event to close this popup
			document.addEventListener('close-popups', () => this.close());
		} catch (error) {
			console.error(`[HandlerManagerCopy] Error during initialization: ${error}`);
		}
	}

	/**
	 * Adds a click listener to the main button that toggles the SQL popup.
	 */
	private setupTriggerButtonListener(): void {
		this.triggerButton?.addEventListener('click', (e) => {
			const prevClass = this.triggerButton?.classList.contains('active');

			// 1. Notify other popups to close.
			document.dispatchEvent(new CustomEvent('close-popups'));
			e.stopPropagation();
			// 2. Toggle our own popup.
			
			// not active = Closed
			// active = Open
			if (prevClass) {
				this.close();
			} else {
				this.open();
			}
		});
	}

	/**
	 * Sets up event listeners for the actual copy actions
	 * (e.g., "Copy Table" and buttons inside the SQL popup).
	 */
	private setupActionListeners(): void {
		const copyTableButton = document.querySelector<HTMLButtonElement>(`${this.prefix} #${hideElementsIds.copyTable}`);
		const tooltipContent = document.querySelector<HTMLDivElement>(`${this.prefix} .tooltip-container .tooltip-content`);

		// Listener for the "Copy Table" button
		copyTableButton?.addEventListener('click', (e) => {
			this.eventManager.handleEvent({ ev: e });
		});

		// Use event delegation for all buttons inside the SQL popup
		tooltipContent?.addEventListener('click', (e) => {
			e.stopPropagation();

			const target = e.target as HTMLElement;
			const button = target.closest('button');

			if (button) {
				this.eventManager.handleEvent({ ev: e });
			}
		});
	}

	private open() {
		this.triggerButton?.classList.add('active');
	}


	/**
	 * Closes the SQL popup by removing the 'active' class.
	 */
	private close() {
		this.triggerButton?.classList.remove('active');
	}
}
