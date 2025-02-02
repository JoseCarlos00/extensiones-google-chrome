class ShippingLoadInsight {
	constructor() {
		this.nameDataStorgaeDoors = NAME_DATA_STORAGE_DOORS;
		this.dataStorgaeDoors = new Set();

		this.idModal = "modalShowDockDoor";
		this.idButtonOpenModal = "openShowDockDoors";
		this.tbodyElement = document.querySelector("#ListPaneDataGrid > tbody");

		if (!this.nameDataStorgaeDoors) {
			throw new Error("NAME_DATA_STORAGE_DOORS is not defined");
		}

		if (!this.tbodyElement) {
			throw new Error("tbodyElement is not defined");
		}

		// Tabla de datos en el Modal
		this.tableDockDoorModal = null;
	}

	async preInit() {
		const tableHeaders = document.querySelector("#ListPaneDataGrid_headers");

		if (!tableHeaders) {
			throw new Error("tableHeaders is not defined. [#ListPaneDataGrid_headers]");
		}

		this.verifiryDockDoorHeader();
		this.observeChangesInTheDOM(tableHeaders, () => this.verifiryDockDoorHeader());
	}

	verifiryDockDoorHeader() {
		const dockDoorHeader = document.querySelector("#ListPaneDataGrid_DOCK_DOOR_LOCATION");

		if (dockDoorHeader) {
			const btnOpenModal = document.getElementById(this.idButtonOpenModal);

			btnOpenModal?.classList.remove("disabled");
		} else {
			const btnOpenModal = document.getElementById(this.idButtonOpenModal);
			btnOpenModal?.classList.add("disabled");

			ToastAlert.showAlertFullTop("Active la columna Dock Door", "error");
		}
	}

	async init() {
		try {
			await this.preInit(); // Valida elementos iniciales
			await this.insertModalInDOM(); // Inserta el modal
			this.initializeModalOpen(); // Configura eventos del modal
			this.tableDockDoorModal = document.querySelector("#tableDockDoor");
			this.setEventListeners(); // Configura eventos adicionales

			// Asegura que el DOM esté cargado antes de ejecutar
			setTimeout(() => this.setDoockDoorList(), 50);
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
				reject("[insertModalInDOM] No se encontró el elemento <ul> a insertar");
			}

			if (!MODAL_HTML) {
				reject("[insertModalInDOM] No se encontró el HTML de la modal");
			}

			ulElementoToInsert.insertAdjacentHTML("beforeend", li);
			document.body.insertAdjacentHTML("beforeend", MODAL_HTML);

			setTimeout(resolve, 50);
		});
	}

	initializeModalOpen() {
		try {
			const modal = document.getElementById(this.idModal);
			const btnOpen = document.getElementById(this.idButtonOpenModal);
			const btnClose = modal.querySelector(".close");

			if (!modal) {
				throw new Error("No se encontró el modal <div> con id '#modalShowDock'");
			}

			if (!btnOpen) {
				throw new Error(`No se encontró el botón openModal con id'${this.idButtonOpenModal}'`);
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
		// Cuando el usuario hace clic en el botón, abre el modal
		btnOpen.addEventListener("click", () => {
			this.showHiddenDoorInTableModal();
			modal.style.display = "block";
		});

		// Cuando el usuario hace clic en <span> (x), cierra el modal
		btnClose.addEventListener("click", () => {
			modal.style.display = "none";
		});

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

	observeChangesInTheDOM(elementHTML, handleMutation) {
		// Configuración del observer
		const observerConfig = {
			attributes: false, // Observar cambios en atributos
			childList: true, // Observar cambios en la lista de hijos
			subtree: false, // Observar cambios en los descendientes de los nodos objetivo
		};

		// Crea una instancia de MutationObserver con la función de callback
		const observer = new MutationObserver(handleMutation);

		// Inicia la observación del nodo objetivo y su configuración
		observer.observe(elementHTML, observerConfig);
	}

	setEventListeners() {
		if (!this.tbodyElement) {
			throw new Error("No se encontró el elemento <tbody> con id #ListPaneDataGrid > tbody");
		}

		const btnNewWave = document.querySelector("#ListPaneMenuActionNew");
		const btnEditWave = document.querySelector("#ListPaneMenuActionEdit");

		this.observeChangesInTheDOM(this.tbodyElement, () => this.setDoockDoorList());

		btnNewWave?.addEventListener("click", () => this.setDoockDoorList());
		btnEditWave?.addEventListener("click", () => this.setDoockDoorList());
	}

	setDoockDoorList() {
		const dockDoors = document.querySelectorAll('td[aria-describedby="ListPaneDataGrid_DOCK_DOOR_LOCATION"]');

		if (!dockDoors || dockDoors.length === 0) {
			console.warn("[setDoockDoorList]: No se encontraron elementos td[DOCK_DOOR_LOCATION]");
			this.dataStorgaeDoors.clear();
			LocalStorageHelper.remove(this.nameDataStorgaeDoors);
			return;
		}

		// Función de normalización
		const normalizeString = (str) => str?.normalize("NFKC").replace(/\s+/g, " ").trim();

		// Vacía el conjunto actual
		this.dataStorgaeDoors.clear();

		dockDoors.forEach((doorElement) => {
			const doorValue = normalizeString(doorElement?.textContent);

			// Filtrar valores nulos, vacíos o solo espacios
			if (doorValue) {
				this.dataStorgaeDoors.add(doorValue);
			}
		});

		// Guarda en localStorage
		console.log("Guarda en localStorage:", this.nameDataStorgaeDoors, this.dataStorgaeDoors);
		LocalStorageHelper.save(this.nameDataStorgaeDoors, Array.from(this.dataStorgaeDoors));
	}

	showHiddenDoorInTableModal() {
		try {
			if (!this.tableDockDoorModal) {
				throw new Error("No existe el elemento a insertar la tabla de puertas no disponibles");
			}

			const rows = Array.from(this.tableDockDoorModal.querySelectorAll("tbody tr td"));

			if (rows.length === 0) {
				throw new Error("No hay filas en la tabla");
			}

			rows.forEach((td) => {
				const doorValue = td?.textContent?.trim();

				td?.classList?.remove("not-available");

				if (this.dataStorgaeDoors.has(doorValue)) {
					td?.classList?.add("not-available");
				}
			});

			this.tableDockDoorModal.classList.remove("hidden");
		} catch (error) {
			console.error("Error en showHiddenDoorInTableModal:", error.message, error);
			return;
		}
	}
}

window.addEventListener("load", async () => {
	try {
		const loadManager = new ShippingLoadInsight();
		loadManager.init();
	} catch (error) {
		console.error('Error al crear el objeto de la clase "ShippingLoadInsight"', error?.message, error);
	}
});
