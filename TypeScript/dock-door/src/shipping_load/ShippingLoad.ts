import { LocalStorageHelper } from "../utils/LocalStorageHelper"
import { RefreshDockDoor } from "./refreshDockDoor"
import { ToastAlert } from "../utils/ToastAlert"
import { NAME_DATA_STORAGE_DOORS, TABLE_HTML } from "../constants";

const SELECTORS = {
	DOCK_DOOR_INPUT: '#ShippingLoadInfoSectionDockDoorValue > div > div.ui-igcombo-fieldholder.ui-igcombo-fieldholder-ltr.ui-corner-left > input',
	TABLE_INSERT_POINT: '#ScreenGroupSubAccordion11736',
	TABLE_DOCK_DOOR: '#tableDockDoor',
	SAVE_BUTTON: '#ShippingLoadMenuActionSave',
	DOOR_LIST_CONTAINER: 'body > div.ui-igcombo-dropdown ul.ui-igcombo-listitemholder',
};

export class ShippingLoad {
	private readonly nameDataStorageDoors: string = NAME_DATA_STORAGE_DOORS;
	private dataStorageDoors: Set<string> = new Set();
	private inputDockDoor: HTMLInputElement | null = null;
	private doorAssigned: string = "";
	private tableDockDoor: HTMLElement | null = null;

	private get hasDataStorageDoors(): boolean {
		return this.dataStorageDoors.size > 0;
	}

	private getStorageData(): Set<string> {
		const storedData = LocalStorageHelper.get(this.nameDataStorageDoors);
		return new Set(Array.isArray(storedData) ? storedData : []);
	}

	private verifyDataStorage() {
		console.log("[verifyDataStorage]", this.hasDataStorageDoors);

		if (this.hasDataStorageDoors && this.tableDockDoor) {
			this.tableDockDoor.classList.remove("hidden");
		} else {
			this.tableDockDoor?.classList.add("hidden");
		}
	}

	async init() {
		try {
			this.loadInitialData();
			this.queryDOMElements();
			await this.injectUIComponents();
			this.updateUI();
			this.setupEventListeners();
		} catch (error: any) {
			console.error("Ha ocurrido un error al inicializar [ShippingLoad]:", error?.message, error);
		}
	}

	private loadInitialData() {
		this.dataStorageDoors = this.getStorageData();
		if (!this.hasDataStorageDoors) {
			ToastAlert.showAlertFullTop("No se encontraron datos guardados de puertas asignadas", "info");
		}
	}

	private queryDOMElements() {
		this.inputDockDoor = document.querySelector(SELECTORS.DOCK_DOOR_INPUT);
		if (!this.inputDockDoor) {
			console.warn("El input para 'dock door' no fue encontrado.");
		}
		this.doorAssigned = this.inputDockDoor?.value ?? "";
	}

	private async injectUIComponents() {
		await this.insertTableAvailableDoors();
		this.tableDockDoor = document.querySelector(SELECTORS.TABLE_DOCK_DOOR);
		if (!this.tableDockDoor) {
			throw new Error("La tabla de dock doors no pudo ser encontrada después de la inserción.");
		}
	}

	private updateUI() {
		this.verifyDataStorage();
		this.showHiddenDoorInTable();
		this.hiddenDoorList();
	}

	private setupEventListeners() {
		this.setEventListenerToSave();
		this.setEventStorageChange();
	}

	private insertTableAvailableDoors(): Promise<void> {
		return new Promise((resolve, reject) => {
			const elementToInsert = document.querySelector(SELECTORS.TABLE_INSERT_POINT);

			if (!elementToInsert) {
				return reject(new Error("No existe el Elemento a insertar la tabla: [#ScreenGroupSubAccordion11736]"));
			}

			if (!TABLE_HTML) {
				return reject(new Error("No existe la constante de tabla HTML: [TABLE_HTML]"));
			}

			elementToInsert.insertAdjacentHTML("beforeend", TABLE_HTML);
			setTimeout(resolve, 50);
		});
	}

	private setEventStorageChange() {
		window.addEventListener("storage", ({ key }) => {
			if (key === this.nameDataStorageDoors) {
				this.dataStorageDoors = this.getStorageData();
				this.updateUI();
				ToastAlert.showAlertFullTop("Información de puertas asignadas actualizada", "info");
			}
		});
	}

	private setEventListenerToSave() {
		const btnSave = document.querySelector(SELECTORS.SAVE_BUTTON);

		btnSave?.addEventListener("click", () => this.addToDoorLocalStorage());

		document.addEventListener("keydown", ({ key }) => {
			if (key === "Enter") this.addToDoorLocalStorage();
		});
	}

	private showHiddenDoorInTable() {
		try {
			if (!this.tableDockDoor) {
				throw new Error("No existe el elemento a insertar la tabla de puertas no disponibles");
			}

			const rows = Array.from(this.tableDockDoor.querySelectorAll("tbody tr td"));
			if (rows.length === 0) {
				throw new Error("No hay filas en la tabla");
			}

			rows.forEach((td) => {
				const doorValue = td?.textContent?.trim();
				td.classList.remove("not-available");

				if (doorValue && this.dataStorageDoors.has(doorValue)) {
					td.classList.add("not-available");
				}
			});
		} catch (error: any) {
			console.error("Error en showHiddenDoorInTable:", error.message, error);
		}
	}

	private hiddenDoorList() {
		try {
			// Este selector es muy específico y puede romperse si la interfaz de usuario cambia.
			const listContainer = document.querySelector(SELECTORS.DOOR_LIST_CONTAINER);

			if (!listContainer) {
				// No siempre está presente, así que no lanzamos error, solo advertimos.
				console.warn("Contenedor de la lista de puertas no encontrado. Puede que no esté visible.");
				return;
			}

			const doorListItems = listContainer.querySelectorAll("li.ui-igcombo-listitem .comboInfo .emphasizedText");
			if (doorListItems.length === 0) {
				console.warn("No se encontraron elementos de puerta en la lista.");
				return;
			}

			doorListItems.forEach((doorElement) => {
				const liElement = doorElement.closest("li.ui-igcombo-listitem");
				if (!liElement) {
					console.warn(`[hiddenDoorList]: No se encontró el elemento <li> para ${doorElement}.`);
					return;
				}

				liElement.classList.remove("hidden");
				const doorValue = doorElement?.textContent?.trim();

				if (doorValue && this.dataStorageDoors.has(doorValue)) {
					liElement.classList.add("hidden");
				}
			});
		} catch (error) {
			console.error('Error en "hiddenDoorList":', error);
		}
	}

	private addToDoorLocalStorage() {
		try {
			const valueInputDock = this.inputDockDoor?.value?.trim() ?? "";

			if (!valueInputDock && !this.doorAssigned) {
				// No hay valor nuevo ni anterior, no hay nada que hacer.
				return;
			}

			if (valueInputDock !== this.doorAssigned) {
				// Si había una puerta asignada, la liberamos
				if (this.doorAssigned) {
					this.dataStorageDoors.delete(this.doorAssigned);
				}
				// Si hay una nueva puerta, la ocupamos
				if (valueInputDock) {
					this.dataStorageDoors.add(valueInputDock);
				}
			}

			LocalStorageHelper.save(this.nameDataStorageDoors, Array.from(this.dataStorageDoors));
			console.log("Puertas guardadas exitosamente:", this.dataStorageDoors);
		} catch (error) {
			console.error("Error guardando puertas en storage:", error);
		}
	}
}

window.addEventListener("load", async () => {
	try {
		// @ts-ignore - _webUi es una variable global del contexto de la página
		console.log("Dock Door List:", _webUi.config.ConfigValue["DockDoor_List"]);

		const shippingLoad = new ShippingLoad();
		await shippingLoad.init();

		const refreshDockDoor = new RefreshDockDoor();
		await refreshDockDoor.render();
	} catch (error) {
		console.error("Error al inicializar la extensión Dock Door:", error);
	}
});
