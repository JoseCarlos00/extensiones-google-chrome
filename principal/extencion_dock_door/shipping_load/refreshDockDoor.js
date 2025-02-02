class RefreshDockDoor {
	constructor() {
		try {
			this.nameDataStorgaeDoors = NAME_DATA_STORAGE_DOORS;
			this.idButtonRefreshDoor = "openRefreshDockDoors";

			// Tabla de datos
			this.tableDockDoor = null;

			console.log("NAME_DATA_STORAGE_DOORS", NAME_DATA_STORAGE_DOORS);
		} catch (error) {
			console.error("Ha ocurrido un error al crear [refreshDockDoor]:", error);
		}
	}

	async render() {
		try {
			this.tableDockDoor = document.querySelector("#tableDockDoor");
			await this.insertButtonRefresh();
			this.setEventListenersRefresh();
		} catch (error) {
			console.error("Ha ocurrido un error al renderizar [refreshDockDoor]:", error?.message, error);
		}
	}

	insertButtonRefresh() {
		return new Promise((resolve, reject) => {
			const ulElementoToInsert = document.querySelector(
				"#topNavigationBar > nav > ul.nav.navbar-nav.navbar-left.visible-sm.visible-md.visible-lg.navbarposition"
			);

			const li = `
        <li class="refresh-dock-door">
          <a id='${this.idButtonRefreshDoor}' href="javascript:void(0);"  class="navbar-brand navbar-left navbartitle visible-sm visible-md visible-lg refresh-dock-door-text"  data-balloon-pos="right">
            <i class="far fa-sync "></i>
            <small  >Actualizar Dock Doors</small>
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
			const response = await fetch("https://jsonplaceholder.typicode.com/posts");
			const data = await response.json();

			console.log("data", data);
		} catch (error) {
			console.error("Ha ocurrido un error al [refrescar dock door]", error?.message, error);
		}
	}
}
