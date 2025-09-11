import { LocalStorageHelper } from "../utils/LocalStorageHelper"
import { RefreshDockDoor } from "./refreshDockDoor"
import { ToastAlert } from "../utils/ToastAlert"
import { NAME_DATA_STORAGE_DOORS, TABLE_HTML } from "../CONST";


(function () {
	const script = document.createElement("script");
	script.src = chrome.runtime.getURL("test.js");

	(document.head || document.documentElement).appendChild(script);
})()

export class ShippingLoad {
	private nameDataStorageDoors: string = NAME_DATA_STORAGE_DOORS;
	private dataStorageDoors: Set<string> | null = null;
	private inputDockDoor: HTMLInputElement | null  = null;
	private doorAssigned: string | null = null;
	private isDataStorageDoors: boolean = false;
	private tableDockDoor: HTMLElement | null = null;

	constructor() {
		try {
			this.dataStorageDoors = this.getStorageData();
			this.inputDockDoor = document.querySelector(
				"#ShippingLoadInfoSectionDockDoorValue > div > div.ui-igcombo-fieldholder.ui-igcombo-fieldholder-ltr.ui-corner-left > input"
			);

			this.doorAssigned = this.inputDockDoor?.value ?? "";
			this.isDataStorageDoors = this.dataStorageDoors.size > 0;

			if (this.dataStorageDoors.size === 0) {
				ToastAlert.showAlertFullTop("No se encontraron datos guardados de puertas asignadas", "info");
			}

			// Tabla de datos
			this.tableDockDoor = null;
		} catch (error) {
			console.error("Ha ocurrido un error al crear [ShippingLoad]:", error);
		}
	}

	getStorageData() {
		// Recupera los datos del almacenamiento y los convierte en un Set
		const storedData = LocalStorageHelper.get(this.nameDataStorageDoors);
		return new Set(Array.isArray(storedData) ? storedData : []);
	}

	verifyDataStorage() {
		console.log("[verifyDataStorage]", this.isDataStorageDoors);

		if (this.isDataStorageDoors && this.tableDockDoor) {
			this.tableDockDoor.classList.remove("hidden");
		} else {
			this.tableDockDoor?.classList?.add("hidden");
		}
	}

	async init() {
		try {
			await this.insertTableAvailableDoors();
			this.tableDockDoor = document.querySelector("#tableDockDoor");

			this.verifyDataStorage();
			this.showHiddenDoorInTable();

			this.setEventListenerToSave();
			this.setEventStorageChange();
			this.hiddenDoorList();
		} catch (error: any) {
			console.error("Ha ocurrido un error al inicializar [ShippingLoad]:", error?.message, error);
		}
	}

	// Insertar tabla de puertas disponibles en el DOM
	insertTableAvailableDoors() {
		return new Promise((resolve, reject) => {
			const elementToInsert = document.querySelector("#ScreenGroupSubAccordion11736");

			if (!elementToInsert) {
				reject("No existe el Elemento a insertar la tabla: [#ScreenGroupSubAccordion11736]");
				return;
			}

			if (!TABLE_HTML) {
				reject("No existe la constante de tabla HTML: [tableHTML]");
			}

			elementToInsert.insertAdjacentHTML("beforeend", TABLE_HTML);
			setTimeout(resolve, 50);
		});
	}

	setEventStorageChange() {
		window.addEventListener("storage", async ({ key }) => {
			if (key === this.nameDataStorageDoors) {
				this.dataStorageDoors = this.getStorageData();
				this.isDataStorageDoors = this.dataStorageDoors.size > 0;
				this.hiddenDoorList();
				this.showHiddenDoorInTable();
				this.verifyDataStorage();
				ToastAlert.showAlertFullTop("Información de puertas asignadas actualizada", "info");
			}
		});
	}

	setEventListenerToSave() {
		const btnSave = document.querySelector("#ShippingLoadMenuActionSave");

		btnSave?.addEventListener("click", () => this.addToDoorLocalStorage());

		document.addEventListener("keydown", ({ key }) => {
			if (key === "Enter") {
				this.addToDoorLocalStorage();
			}
		});
	}

	showHiddenDoorInTable() {
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
				td?.classList?.remove("not-available");

				if (this.dataStorageDoors?.has(doorValue)) {
					td?.classList?.add("not-available");
				}
			});
		} catch (error: any) {
			console.error("Error en showHiddenDoorInTable:", error.message, error);
			return;
		}
	}

	hiddenDoorList() {
		try {
			// Selección de contenedor base (reemplázalo con un selector más específico si es posible)
			const listContainer = document.querySelector("body > div:nth-child(27) ul.ui-igcombo-listitemholder");

			if (!listContainer) {
				throw new Error("Contenedor de la lista no encontrado.");
			}

			// Selección de elementos a procesar
			const doorListInputs = listContainer.querySelectorAll("li.ui-igcombo-listitem .comboInfo .emphasizedText");

			if (!doorListInputs || doorListInputs.length === 0) {
				throw new Error("No se encontraron los elementos inputs a ocultar.");
			}

			// Procesar elementos en un solo bucle
			doorListInputs.forEach((doorElement) => {
				const liElement = doorElement.closest("li.ui-igcombo-listitem");

				if (!liElement) {
					console.warn(`[hiddenDoorList]: No se encontró el elemento <li> para ${doorElement}.`);
					return;
				}

				// Mostrar por defecto
				liElement.classList.remove("hidden");

				// Obtener valor y verificar en `dataStorageDoors`
				const doorValue = doorElement?.textContent?.trim();

				if (this.dataStorageDoors?.has(doorValue)) {
					liElement.classList.add("hidden");
				}
			});
		} catch (error) {
			console.error('Error en "hiddenDoorList":', error);
		}
	}

	addToDoorLocalStorage() {
		try {
			if (!this.dataStorageDoors) {
				throw new Error("El [dataStorageDoors] no existe.");
			}

			const valueInputDork = this.inputDockDoor?.value?.trim() ?? "";

			if (!valueInputDork && !this.doorAssigned) {
				throw new Error("No hay valor en el input 'dock door' para guardar.");
			}

			if (valueInputDork !== this.doorAssigned) {
				this.dataStorageDoors.delete(this.doorAssigned as string);
				this.dataStorageDoors.add(valueInputDork);
			}

			// Convertir el Set a un array y guardarlo en localStorage
			LocalStorageHelper.save(this.nameDataStorageDoors, Array.from(this.dataStorageDoors));

			console.log("Puertas guardadas exitosamente:");
		} catch (error) {
			console.error("Error guardando puertas en storage:", error);
		}
	}
}

window.addEventListener("load", async () => {
	try {
		const shippingLoad = new ShippingLoad();
		await shippingLoad.init();

		try {
			const refreshDockDoor = new RefreshDockDoor();
			await refreshDockDoor.render();
		} catch (error) {
			console.error("Error in inicializar la clase refreshDockDoor:", error);
		}
	} catch (error) {
		console.error("Error in inicializar la clase ShippingLoad:", error);
	}
});
