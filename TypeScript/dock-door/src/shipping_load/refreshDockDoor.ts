import { MODAL_HTML, NAME_DATA_STORAGE_DOORS } from "../CONST"
import { LocalStorageHelper } from "../utils/LocalStorageHelper"
import { ToastAlert } from "../utils/ToastAlert"

export class RefreshDockDoor {
		private nameDataStorageDoors: string = NAME_DATA_STORAGE_DOORS;
		private idButtonRefreshDoor: string = "openRefreshDockDoors";
		
		// Tabla de datos
		private tableDockDoor: HTMLElement | null = null;
	
	constructor() {
		console.log("NAME_DATA_STORAGE_DOORS", NAME_DATA_STORAGE_DOORS);
	}

	async render() {
		try {
			this.tableDockDoor = document.querySelector("#tableDockDoor");

			await this.insertButtonRefresh();
			this.setEventListenersRefresh();
		} catch (error: any) {
			console.error("Ha ocurrido un error al renderizar [refreshDockDoor]:", error?.message, error);
		}
	}

	async insertButtonRefresh() {
		const ulElementoToInsert = document.querySelector(
			'#topNavigationBar > nav > ul.nav.navbar-nav.navbar-left.visible-sm.visible-md.visible-lg.navbarposition'
		);

		const li = /*html*/ `
        <li class="refresh-dock-door">
          <a id='${this.idButtonRefreshDoor}' href="javascript:void(0);"  class="navbar-brand navbar-left navbartitle visible-sm visible-md visible-lg refresh-dock-door-text"  data-balloon-pos="right">
            <i class="far fa-sync "></i>
            <small  >Actualizar Dock Doors</small>
          </a>
        </li>
        `;

		if (!ulElementoToInsert) {
			throw new Error('[insertModalInDOM] No se encontró el elemento <ul> a insertar');
		}

		if (!MODAL_HTML) {
			throw new Error('[insertModalInDOM] No se encontró el HTML de la modal');
		}

		ulElementoToInsert?.insertAdjacentHTML('beforeend', li);
		document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

		await new Promise((resolve) => setTimeout(resolve, 50));
	}

	setEventListenersRefresh() {
		const btnRefresh = document.getElementById(this.idButtonRefreshDoor);

		if (!btnRefresh) {
			throw new Error(`No se encontró el botón refresh con id'${this.idButtonRefreshDoor}'`);
		}

		btnRefresh.addEventListener("click", async () => {
			await this.refreshDockDoor();
		});
	}

	async refreshDockDoor() {
		try {
			ToastAlert.showAlertFullTop("Actualizando Dock Doors", "info");
			this.tableDockDoor?.classList?.add("hidden");
			LocalStorageHelper.remove(this.nameDataStorageDoors);

			let nuevaVentana = window.open(
				"https://wms.fantasiasmiguel.com.mx/scale/insights/3041?selectRows=Y&isBlur=Y",
				"_blank",
				"width=800,height=600"
			);

			// Enviar un mensaje a la nueva ventana para que cierre después de cargar
			if (nuevaVentana) {
				nuevaVentana.onload = () => {
					nuevaVentana.postMessage("cerrar", "*");
				};
			}
		} catch (error: any) {
			console.error("Ha ocurrido un error al [refrescar dock door]", error?.message, error);
		}
	}
}
