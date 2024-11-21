class ShippingLoadInsight {
	constructor() {
		this.nameDataStorgaeDoors = NAME_DATA_STORAGE_DOORS;
		this.dataStorgaeDoors = new Set();

		this.idButtonOpenModal = "openShowDockDoors";
		this.tbodyElement = document.querySelector("#ListPaneDataGrid > tbody");
	}

	async init() {
		try {
			await this.insertModalInDOM();
			this.initializeModalOpen();
			// setLocalStorage([]);

			// modalFunction();

			// const tbody = tbody && observacion(tbody);

			// const btnNewWave = document.querySelector("#ListPaneMenuActionNew");
			// const btnEditWave = document.querySelector("#ListPaneMenuActionEdit");

			// btnNewWave && btnNewWave.addEventListener("click", saveDoorToClick);
			// btnEditWave && btnEditWave.addEventListener("click", saveDoorToClick);

			// await verificarHeaderDockDoor(true);
		} catch (error) {
			console.error("Ha ocurrido un error al inicializar [ShippingLoadInsight]:", error?.message, error);
		}
	}

	insertModalInDOM() {
		return new Promise((resolve, reject) => {
			const ulElementoToInsert = document.querySelector("#topNavigationBar > nav > ul.collapsepane.nav.navbar-nav");

			const li = `
        <li class="navdetailpane visible-sm visible-md visible-lg">
          <a id='${this.idButtonOpenModal}' href="#" data-toggle="detailpane" class="navimageanchor visiblepane" aria-label="Mostrar Dock Doors" data-balloon-pos="right">
            <i class="far fa-door-open navimage"></i>
          </a>
        </li>
        `;

			if (!ulElementoToInsert) {
				reject("No se encontró el elemento <ul> a insertar");
			}

			ulElementoToInsert.insertAdjacentHTML("beforeend", li);

			setTimeout(resolve, 50);
		});
	}

	initializeModalOpen() {
		try {
			const modal = document.getElementById("modalShowDockDoor");
			const btnOpen = document.getElementById(this.idButtonOpenModal);
			const btnClose = document.querySelector("#modalShowDockDoor .modal-container .close");

			if (!modal) {
				throw new Error("No se encontró el modal <div> con id '#modalShowDock'");
			}

			if (!btnOpen) {
				throw new Error("No se encontró el botón openModal con id'${this.idButtonOpenModal'");
			}

			if (!btnClose) {
				throw new Error("No se encontró el botón closeModal con clase '.close'");
			}

			this.setEventListenersModal({ modal, btnOpen, btnClose });
		} catch (error) {
			console.error("Ha ocurrido un error al inicializar [initializeModalOpen]:", error?.message, error);
		}
	}

	setEventListenersModal({ modal, btnOpen, btnClose }) {
		// const { modal } = elements;

		setEventModalOpenClose(elements);

		// Cuando el usuario hace clic fuera del modal, ciérralo
		window.addEventListener("click", ({ target }) => {
			const element = target;

			if (element === modal) {
				modal.style.display = "none";
			}
		});

		window.addEventListener("keydown", ({ key }) => {
			if (key === "Escape") {
				if (modal.style.display === "block") {
					modal.style.display = "none";
				}
			}
		});
	}

	getDoockDoor() {
		let door = [];

		return new Promise((resolve) => {
			const dock_doors = document.querySelectorAll('td[aria-describedby="ListPaneDataGrid_DOCK_DOOR_LOCATION"]');

			if (dock_doors.length === 0) {
				resolve([]);
				return;
			}

			dock_doors.forEach((doorElement) => {
				const content = doorElement.innerHTML;

				if (content) {
					door.push(content.replace(/&nbsp;/, " "));
				}
			});

			resolve(door);
		});
	}

	async insertDoockNotAvailable() {
		console.log("[insertDoockNotAvailable]");

		try {
			const table = document.getElementById("content");
			if (!table) return; // Asegurarse de que la tabla existe

			const rows = Array.from(table.querySelectorAll("tbody tr td"));
			if (rows.length === 0) return; // Asegurarse de que hay filas en la tabla

			const door = await getDoockDoor();

			if (!Array.isArray(door) || door.length === 0) {
				setLocalStorage(door);
				await cleanClass("not-available");
				return;
			}

			rows.forEach((td) => {
				const content = td.innerHTML;
				if (door.includes(content)) {
					td.classList.add("not-available");
				}
			});
		} catch (error) {
			console.error(error);
			return;
		}
	}
}
