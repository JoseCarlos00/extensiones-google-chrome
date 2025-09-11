import { NAME_DATA_STORAGE_DOORS } from "../CONST"
import { LocalStorageHelper } from "../utils/LocalStorageHelper"
import { ToastAlert } from "../utils/ToastAlert"

const SELECTORS = {
	NAV_BAR_INSERT_POINT: '#topNavigationBar > nav > ul.nav.navbar-nav.navbar-left.visible-sm.visible-md.visible-lg.navbarposition',
	TABLE_DOCK_DOOR: '#tableDockDoor',
};

const REFRESH_BUTTON_ID = "openRefreshDockDoors";

export class RefreshDockDoor {
	private readonly nameDataStorageDoors: string = NAME_DATA_STORAGE_DOORS;
	private tableDockDoor: HTMLElement | null = null;

	async render() {
		try {
			this.tableDockDoor = document.querySelector(SELECTORS.TABLE_DOCK_DOOR);

			if (!this.tableDockDoor) {
				console.warn("[RefreshDockDoor] La tabla de dock doors no fue encontrada. La actualización podría no ocultarla visualmente.");
			}

			await this.injectRefreshButton();
			this.setupEventListener();
		} catch (error: any) {
			console.error("Ha ocurrido un error al renderizar [RefreshDockDoor]:", error.message, error);
		}
	}

	private async injectRefreshButton(): Promise<void> {
		const ulElementToInsert = document.querySelector(SELECTORS.NAV_BAR_INSERT_POINT);

		if (!ulElementToInsert) {
			throw new Error("[RefreshDockDoor] No se encontró el punto de inserción en la barra de navegación.");
		}

		const buttonHtml = /*html*/ `
        <li class="refresh-dock-door">
          <a id='${REFRESH_BUTTON_ID}' href="javascript:void(0);" class="navbar-brand navbar-left navbartitle visible-sm visible-md visible-lg refresh-dock-door-text" data-balloon-pos="right" aria-label="Actualizar Dock Doors">
            <i class="far fa-sync"></i>
            <small>Actualizar Dock Doors</small>
          </a>
        </li>
        `;

		ulElementToInsert.insertAdjacentHTML('beforeend', buttonHtml);
		await new Promise(resolve => setTimeout(resolve, 50));
	}

	private setupEventListener() {
		const btnRefresh = document.getElementById(REFRESH_BUTTON_ID);

		if (!btnRefresh) {
			throw new Error(`[RefreshDockDoor] No se encontró el botón de refresco con id '${REFRESH_BUTTON_ID}'.`);
		}

		btnRefresh.addEventListener("click", () => this.handleRefresh());
	}

	private handleRefresh() {
		try {
			ToastAlert.showAlertFullTop("Actualizando Dock Doors...", "info");
			this.tableDockDoor?.classList.add("hidden");
			LocalStorageHelper.remove(this.nameDataStorageDoors);

			const refreshUrl =
				"https://wms.fantasiasmiguel.com.mx/scale/insights/3041?selectRows=Y&RefreshMode=Y"
			const windowFeatures = "width=800,height=600";
			const newWindow = window.open(refreshUrl, "_blank", windowFeatures);

			if (newWindow) {
				// Enviar un mensaje a la nueva ventana para que cierre después de cargar
				newWindow.onload = () => {
					newWindow.postMessage("cerrar", "*");
				};
			} else {
				// Manejar el caso en que el bloqueador de pop-ups impida abrir la ventana
				ToastAlert.showAlertFullTop("Por favor, deshabilite el bloqueador de ventanas emergentes para este sitio.", "warning");
			}
		} catch (error: any) {
			console.error("Ha ocurrido un error al refrescar los dock doors:", error.message, error);
			ToastAlert.showAlertFullTop("Error al intentar refrescar los dock doors.", "error");
		}
	}
}
