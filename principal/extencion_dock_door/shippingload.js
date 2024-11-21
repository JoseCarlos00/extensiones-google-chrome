class ShippingLoad {
	constructor() {
		try {
			this.nameDataStorgaeDoors = nameDataStorgaeDoors;
			this.daataStorgaeDoors = Array.from(LocalStorageHelper.get(this.nameDataStorgaeDoors)) ?? [];

			this.doorAssigned =
				document.querySelector(
					"#ShippingLoadInfoSectionDockDoorValue > div > div.ui-igcombo-fieldholder.ui-igcombo-fieldholder-ltr.ui-corner-left > input"
				)?.value ?? "";
		} catch (error) {
			console.error("Ha ocurrido un error al crear [ShippingLoad]:", error);
		}
	}

	init() {
		try {
			const dataStorageLength = this.daataStorgaeDoors.length ?? 0;

			if (dataStorageLength === 0) {
				throw new Error("No se encontraron datos en el almacenamiento local de", this.nameDataStorgaeDoors);
			}
		} catch (error) {
			console.error("Ha ocurrido un error al inicializar [ShippingLoad]:", error?.message, error);
		}
	}

	async setEventListenerToSave() {
		const btnSave = document.querySelector("#ShippingLoadMenuActionSave");

		btnSave?.addEventListener("click", () => this.addToDoorLocalStorage());

		document.addEventListener("keydown", ({ key }) => {
			if (key === "Enter") {
				this.addToDoorLocalStorage();
			}
		});
	}

	insertTableAvailebleDoors() {
		return new Promise((resolve, reject) => {
			const elementToInsert = document.querySelector("#ScreenGroupSubAccordion11736");

			if (!elementToInsert) {
				reject("No existe el Elemento a insertar la tabla");
				return;
			}

			elementToInsert.insertAdjacentHTML("beforeend", tableHTML);
			resolve();
		});
	}

	async insertDoockNotAvailable() {
		try {
			const table = document.getElementById("content");
			if (!table) return; // Asegurarse de que la tabla existe

			const rows = Array.from(table.querySelectorAll("tbody tr td"));
			if (rows.length === 0) return; // Asegurarse de que hay filas en la tabla

			// await cleanClass('not-available');

			if (!doors) {
				return;
			}

			rows.forEach((td) => {
				const content = td.innerHTML;
				if (doors.includes(content)) {
					td.classList.add("not-available");
				}
			});
		} catch (error) {
			console.error(error);
			return;
		}
	}

	hiddenDoorLIst() {
		const doorListInputs = document.querySelectorAll(
			"body > div:nth-child(27) ul.ui-igcombo-listitemholder > li.ui-igcombo-listitem .comboInfo .emphasizedText"
		);

		if (!doorListInputs || doorListInputs.length === 0) return;

		doorListInputs.forEach((doorElement) => {
			const doorValue = doorElement.innerText;

			const liElement = doorElement.closest("li.ui-igcombo-listitem");

			if (this.daataStorgaeDoors?.includes(doorValue)) {
				liElement?.classList?.add("hidden");
			}
		});
	}

	addToDoorLocalStorage() {
		try {
			if (!this.daataStorgaeDoors || !Array.isArray(this.daataStorgaeDoors)) {
				throw new Error("El [daataStorgaeDoors] no es un arreglo. O no existe");
			}

			const valueInput = inputDockDoor ? inputDockDoor.value : "";

			/**
			 * TODO: Revisar eliminacion y Verificacion
			 */
			if (doorAssigned !== valueInput) {
				// Elimina doorAssigned del array doors si es diferente a valueINput
				doors = doors.filter((door) => door !== doorAssigned);
			}

			if (valueInput) {
				doors.push(valueInput);

				console.log("Doors Save Storage");
			}
		} catch (error) {
			console.error("Error saving doors to storage:", error);
		}
	}
}
