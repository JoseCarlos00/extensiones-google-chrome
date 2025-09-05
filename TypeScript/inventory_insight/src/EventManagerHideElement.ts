import { configurationInitial, type ConfigurationHide, hideElementsIds } from './constants.ts';

// --- LocalStorage Utilities ---

/**
 * Retrieves the element visibility configuration from localStorage.
 * Merges it with the default configuration to ensure all keys are present.
 * @returns The configuration object.
 */
export function getHideElementConfig(): ConfigurationHide {
	const storedState = localStorage.getItem('storedStateHide');
	if (storedState) {
		try {
			const storedConfig = JSON.parse(storedState);
			// Merge with default to handle new keys added to the app
			return { ...configurationInitial, ...storedConfig };
		} catch (error) {
			console.error("Error parsing 'storedStateHide' from localStorage. Reverting to default.", error);
		}
	}
	return configurationInitial;
}

/**
 * Saves the element visibility configuration to localStorage.
 * @param configurationObject The configuration object to save.
 */
export function saveHideElementConfig(configurationObject: ConfigurationHide) {
	localStorage.setItem('storedStateHide', JSON.stringify(configurationObject));
}

// --- Event Manager ---

interface EventManagerHideElementConstructor {
	ListPanelHiddenMenu: HTMLElement;
	prefix: string;
}

/**
 * Manages click events within the "Hide Elements" popup menu.
 * Handles toggling element visibility and persisting the state in localStorage.
 */
export class EventManagerHideElement {
	private readonly prefix: string;
	private readonly listPanel: HTMLElement;
	private readonly config: ConfigurationHide;
	private readonly elementsMap: Record<string, HTMLElement | null>;

	constructor({ ListPanelHiddenMenu, prefix }: EventManagerHideElementConstructor) {
		this.prefix = prefix;
		this.listPanel = ListPanelHiddenMenu;
		this.config = getHideElementConfig();

		// Cache the DOM elements that can be hidden/shown
		this.elementsMap = {
			[hideElementsIds.copyTable]: document.querySelector(`${this.prefix} #${hideElementsIds.copyTable}`),
			[hideElementsIds.insertItem]: document.querySelector(`${this.prefix} #${hideElementsIds.insertItem}`),
			[hideElementsIds.insertRow]: document.querySelector(`${this.prefix} #${hideElementsIds.insertRow}`),
			[hideElementsIds.copyItems]: document.querySelector(`${this.prefix} #${hideElementsIds.copyItems}`),
			[hideElementsIds.counterRow]: document.querySelector(`${this.prefix} #${hideElementsIds.counterRow}`),
		};
	}

	/**
	 * Main event handler entry point.
	 * @param event The DOM event.
	 */
	public handleEvent({ event }: { event: Event }) {
		if (event.type !== 'click') return;

		const menuItem = this.getClickedMenuItem(event.target);
		if (menuItem) {
			this.handleMenuItemClick(menuItem);
		}
	}

	/**
	 * Finds the parent `<li>` element from the event target.
	 * @param target The element that was clicked.
	 * @returns The `HTMLLIElement` if found, otherwise `null`.
	 */
	private getClickedMenuItem(target: EventTarget | null): HTMLLIElement | null {
		if (target instanceof HTMLElement) {
			// We are only interested in clicks on items inside the list
			return target.closest('li.li-item');
		}
		return null;
	}

	/**
	 * Processes a click on a menu item.
	 * @param menuItem The `<li>` element that was clicked.
	 */
	private handleMenuItemClick(menuItem: HTMLLIElement) {
		const { hide: elementKey } = menuItem.dataset;
		const icon = menuItem.querySelector<HTMLElement>('.ui-icon');

		// Ensure the popup closes after a selection is made.
		this.listPanel.classList.add('hidden');

		if (!elementKey || !icon) {
			console.warn('Clicked menu item is missing "data-hide" attribute or an icon.', menuItem);
			return;
		}

		this.toggleElementVisibility(elementKey);
		this.toggleMenuItemIcon(icon);
		this.updateAndSaveConfig(elementKey);
	}

	private toggleElementVisibility(elementKey: string) {
		const elementToToggle = this.elementsMap[elementKey];
		if (elementToToggle) {
			elementToToggle.classList.toggle('hidden');
		} else {
			console.warn(`Element with key "${elementKey}" not found in elementsMap.`);
		}
	}

	private toggleMenuItemIcon(icon: HTMLElement) {
		icon.classList.toggle('ui-iggrid-icon-hide');
		icon.classList.toggle('ui-iggrid-icon-show');
	}

	private updateAndSaveConfig(elementKey: string) {
		const element = this.elementsMap[elementKey];
		if (element && this.config[elementKey]) {
			this.config[elementKey].hide = element.classList.contains('hidden');
			saveHideElementConfig(this.config);
		}
	}
}
