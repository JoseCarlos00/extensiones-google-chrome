import { MODAL_HTML, NAME_DATA_STORAGE_DOORS } from "../CONST"
import { LocalStorageHelper } from "../utils/LocalStorageHelper"
import { ToastAlert } from "../utils/ToastAlert"

const SELECTORS = {
	TBODY: '#ListPaneDataGrid > tbody',
	TABLE_HEADERS: '#ListPaneDataGrid_headers',
	DOCK_DOOR_HEADER: '#ListPaneDataGrid_DOCK_DOOR_LOCATION',
	NAV_BAR_INSERT_POINT: '#topNavigationBar > nav > ul.collapsepane.nav.navbar-nav',
	MODAL: '#modalShowDockDoor',
	MODAL_OPEN_BUTTON: '#openShowDockDoors',
	MODAL_CLOSE_BUTTON: '.close',
	MODAL_TABLE: '#tableDockDoor',
	NEW_WAVE_BUTTON: '#ListPaneMenuActionNew',
	EDIT_WAVE_BUTTON: '#ListPaneMenuActionEdit',
	DOCK_DOOR_CELLS: 'td[aria-describedby="ListPaneDataGrid_DOCK_DOOR_LOCATION"]',
};

export class ShippingLoadInsight {
	private readonly nameDataStorageDoors: string = NAME_DATA_STORAGE_DOORS;
	private readonly isRefreshMode: boolean;
	
	private dataStorageDoors: Set<string> = new Set();
	private tbodyElement: HTMLElement | null = null;
	private tableDockDoorModal: HTMLElement | null = null;

	constructor() {
		const urlParams = new URLSearchParams(window.location.search);
		this.isRefreshMode = urlParams.has('selectRows') && urlParams.has('RefreshMode');
	}

	private async preInit() {
		this.tbodyElement = document.querySelector(SELECTORS.TBODY);
		if (!this.tbodyElement) {
			throw new Error('El elemento principal de la tabla (tbody) no fue encontrado.');
		}

		const tableHeaders = document.querySelector(SELECTORS.TABLE_HEADERS) as HTMLElement;

		if (!tableHeaders) {
			throw new Error('Los encabezados de la tabla no fueron encontrados.');
		}

		this.checkDockDoorColumn();
		this.observeChangesInTheDOM(tableHeaders, () => this.checkDockDoorColumn());
	}

	private checkDockDoorColumn() {
		const dockDoorHeader = document.querySelector(SELECTORS.DOCK_DOOR_HEADER);
		const btnOpenModal = document.getElementById(SELECTORS.MODAL_OPEN_BUTTON.substring(1));

		if (dockDoorHeader) {
			btnOpenModal?.classList.remove('disabled');
		} else {
			btnOpenModal?.classList.add('disabled');
			ToastAlert.showAlertFullTop('Active la columna [Dock Door]', 'error');
		}
	}

	async init() {
		try {
			if (this.isRefreshMode) {
				document.body.classList.add('is-refresh-mode');

				// Modo Refresco: Espera a que la tabla se cargue, extrae los datos y cierra.
				await new Promise(resolve => setTimeout(resolve, 250)); // Espera inicial
				this.tbodyElement = document.querySelector(SELECTORS.TBODY);

				if (!this.tbodyElement) {
					throw new Error('El elemento principal de la tabla (tbody) no fue encontrado para el refresco.');
				}

				let observer: MutationObserver;
				let processed = false;

				const runProcess = () => {
					if (processed) return;
					processed = true;
					clearTimeout(fallbackTimeout);
					if (observer) observer.disconnect();
					this.setDockDoorList(); // Procesa los datos y cierra la ventana
				};

				// Fallback: Si no hay cambios en 5 segundos, procesa lo que haya y cierra.
				const fallbackTimeout = setTimeout(() => {
					console.warn('Timeout: No se detectaron cambios en la tabla. Forzando procesamiento y cierre.');
					runProcess();
				}, 5000);

				// Observador: se activa cuando se añaden filas a la tabla.
				observer = new MutationObserver(runProcess);
				observer.observe(this.tbodyElement, { childList: true, subtree: true });

				// Comprobación inicial: si las filas ya están cargadas, procesa inmediatamente.
				if (this.tbodyElement.querySelector('tr')) {
					runProcess();
				}
			} else {
				// Modo normal: inicializa la UI completa.
				await this.preInit();
				await this.insertModalInDOM();
				this.tableDockDoorModal = document.querySelector(SELECTORS.MODAL_TABLE);
				this.initializeModal();
				this.setupGeneralEventListeners();

				// Sincronización inicial de puertas, después de un breve retardo
				setTimeout(() => this.setDockDoorList(), 50);
			}
		} catch (error: any) {
			console.error('Ha ocurrido un error al inicializar [ShippingLoadInsight]:', error.message, error);
			if (this.isRefreshMode) {
				window.close(); // Si hay un error en modo refresco, intenta cerrar la ventana.
			}
		}
	}

	private insertModalInDOM(): Promise<void> {
		return new Promise((resolve, reject) => {
			const ulElementToInsert = document.querySelector(SELECTORS.NAV_BAR_INSERT_POINT);

			const li = /*html*/ `
        <li class="navdetailpane visible-sm visible-md visible-lg">
          <a id='${SELECTORS.MODAL_OPEN_BUTTON.substring(1)}' href="javascript:void(0);" data-toggle="detailpane" class="navimageanchor visiblepane" aria-label="Mostrar Dock Doors" data-balloon-pos="right">
            <i class="far fa-door-open navimage"></i>
          </a>
        </li>
        `;

			if (!ulElementToInsert) {
				return reject(new Error('[insertModalInDOM] No se encontró el punto de inserción en la barra de navegación.'));
			}

			if (!MODAL_HTML) {
				return reject(new Error('[insertModalInDOM] No se encontró el HTML del modal.'));
			}

			ulElementToInsert.insertAdjacentHTML('beforeend', li);
			document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

			setTimeout(resolve, 50);
		});
	}

	private initializeModal() {
		try {
			const modal = document.getElementById(SELECTORS.MODAL.substring(1));
			const btnOpen = document.getElementById(SELECTORS.MODAL_OPEN_BUTTON.substring(1));
			const btnClose = modal?.querySelector(SELECTORS.MODAL_CLOSE_BUTTON) as HTMLElement;

			if (!modal) {
				throw new Error("El elemento del modal no fue encontrado.");
			}

			if (!btnOpen) {
				throw new Error("El botón para abrir el modal no fue encontrado.");
			}

			if (!btnClose) {
				throw new Error("El botón para cerrar el modal no fue encontrado.");
			}

			this.setupModalEventListeners({ modal, btnOpen, btnClose });
		} catch (error: any) {
			console.error('Ha ocurrido un error al inicializar [initializeModalOpen]:', error?.message, error);
		}
	}

	private setupModalEventListeners({ modal, btnOpen, btnClose }: { modal: HTMLElement, btnOpen: HTMLElement, btnClose: HTMLElement }) {
		// Cuando el usuario hace clic en el botón, abre el modal
		btnOpen.addEventListener('click', () => {
			this.showHiddenDoorInTableModal();
			modal.style.display = 'block';
		});

		// Cuando el usuario hace clic en <span> (x), cierra el modal
		btnClose.addEventListener('click', () => {
			modal.style.display = 'none';
		});

		// Cuando el usuario hace clic fuera del modal, ciérralo
		window.addEventListener('click', ({ target }) => {
			if (target === modal) {
				modal.style.display = 'none';
			}
		});

		window.addEventListener('keydown', ({ key }) => {
			if (key === 'Escape') {
				if (modal.style.display === 'block') {
					modal.style.display = 'none';
				}
			}
		});
	}

	private observeChangesInTheDOM(elementHTML: HTMLElement, handleMutation: () => void) {
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

	private setupGeneralEventListeners() {
		if (!this.tbodyElement) {
			throw new Error('El elemento tbody no está disponible para configurar los listeners.');
		}

		const btnNewWave = document.querySelector(SELECTORS.NEW_WAVE_BUTTON);
		const btnEditWave = document.querySelector(SELECTORS.EDIT_WAVE_BUTTON);

		this.observeChangesInTheDOM(this.tbodyElement, () => this.setDockDoorList());

		btnNewWave?.addEventListener('click', () => this.setDockDoorList());
		btnEditWave?.addEventListener('click', () => this.setDockDoorList());
	}

	private setDockDoorList() {
		const dockDoors = document.querySelectorAll(SELECTORS.DOCK_DOOR_CELLS);

		if (!dockDoors || dockDoors.length === 0) {
			console.warn('[setDockDoorList]: No se encontraron elementos td[DOCK_DOOR_LOCATION]');
			this.dataStorageDoors.clear();
			LocalStorageHelper.remove(this.nameDataStorageDoors);
		} else {
			// Función de normalización
			const normalizeString = (str: string | null | undefined) => str?.normalize('NFKC').replace(/\s+/g, ' ').trim();

			// Vacía el conjunto actual
			this.dataStorageDoors.clear();

			dockDoors.forEach((doorElement) => {
				const doorValue = normalizeString(doorElement.textContent);

				// Filtrar valores nulos, vacíos o solo espacios
				if (doorValue) {
					this.dataStorageDoors.add(doorValue);
				}
			});

			// Guarda en localStorage
			console.log('Guarda en localStorage:', this.nameDataStorageDoors, this.dataStorageDoors);
			LocalStorageHelper.save(this.nameDataStorageDoors, Array.from(this.dataStorageDoors));
		}

		// Si estamos en modo refresco, cierra la ventana después de procesar.
		if (this.isRefreshMode) {
			setTimeout(() => window.close(), 50);
		}
	}

	showHiddenDoorInTableModal() {
		if (!this.tableDockDoorModal) {
			console.error('Error en showHiddenDoorInTableModal: La tabla del modal no fue encontrada.');
			return;
		}

		try {
			const rows = Array.from(this.tableDockDoorModal.querySelectorAll('tbody tr td'));

			if (rows.length === 0) {
				console.warn('No se encontraron filas en la tabla del modal.');
				return;
			}

			rows.forEach((td) => {
				const doorValue = td.textContent?.trim();
				td.classList.remove('not-available');

				if (doorValue && this.dataStorageDoors.has(doorValue)) {
					td.classList.add('not-available');
				}
			});

			this.tableDockDoorModal.classList.remove('hidden');
		} catch (error: any) {
			console.error('Error en showHiddenDoorInTableModal:', error.message, error);
		}
	}
}

window.addEventListener("load", async () => {
	try {
		const shippingLoadInsight = new ShippingLoadInsight();
		await shippingLoadInsight.init();
	} catch (error: any) {
		console.error('Error al crear el objeto de la clase "ShippingLoadInsight"', error?.message, error);
	}
});
