class SaveDataManager {
	constructor({ nameStorageContainer, buttonSaveData, buttonDeleteData }) {
		this._tbodyTable = document.querySelector("#ListPaneDataGrid tbody");
		this.nameStorageContainer = nameStorageContainer;
		this.buttonSaveData = buttonSaveData;
		this.buttonDeleteData = buttonDeleteData;

		this.eventClickManager = null;
		this.eventNameStorgageChange = eventNameStorgageChange;
	}

	async initialize() {
		try {
			if (!this._tbodyTable) {
				throw new Error("No se encontró el elemento tbody");
			}

			if (!this.nameStorageContainer) {
				throw new Error("No se encontró el elemento de almacenamiento de nombre");
			}

			if (!this.buttonSaveData || !this.buttonDeleteData) {
				throw new Error("No se encontraron los botones de guardar y eliminar datos");
			}

			this.eventClickManager = new EventClickManagerStorage({
				tbodyTable: this._tbodyTable,
				nameStorageContainer: this.nameStorageContainer,
			});

			if (!this.eventClickManager) {
				throw new Error("No se encontró el manejador de eventos de click");
			}

			await this.insertButtons();
			this.setEventListener();
		} catch (error) {
			console.error(
				`Error: [initialize] Ha ocurrido un error al inicializar la clase SaveDataManager: ${error.message}.`,
				error
			);
		}
	}

	async insertButtons() {
		return new Promise((resolve) => {
			const ul = document.querySelector("#topNavigationBar > nav > ul.collapsepane.nav.navbar-nav");

			if (!ul) {
				throw new Error("No se encontró el elemento ul");
			}

			if (!(this.buttonSaveData instanceof Element)) {
				throw new Error("El elemento buttonSaveData no es un elemento <li> HTML");
			}

			if (!(this.buttonDeleteData instanceof Element)) {
				throw new Error("El elemento buttonDeleteData no es un elemento <li> HTML");
			}

			ul.insertAdjacentElement("beforeend", this.buttonSaveData);
			ul.insertAdjacentElement("beforeend", this.buttonDeleteData);

			setTimeout(resolve, 50);
		});
	}

	setEventListener() {
		this.buttonSaveData.addEventListener("click", (e) => this.eventClickManager.handleEvent(e));
		this.buttonDeleteData.addEventListener("click", (e) => this.handleDeleteData(e));

		window.addEventListener(this.eventNameStorgageChange, () => this.handleMarckSaveData());
	}

	handleMarckSaveData() {
		const { dataContainer } = LocalStorageHelper.get(this.nameStorageContainer);

		if (!dataContainer || saveData?.length === 0) {
			this.markSaveData(true);
			return;
		}

		this.markSaveData();
	}

	handleDeleteData() {
		try {
			const { dataContainer } = LocalStorageHelper.get(this.nameStorageContainer);

			if (!dataContainer) {
				console.warn("No hay datos para eliminar");
				this.markSaveData(true);
				return;
			}

			const confirmDelete = confirm(`¿Estás seguro de eliminar los datos guardados?\nEstá acción no se puede deshacer`);

			if (confirmDelete) {
				LocalStorageHelper.remove(this.nameStorageContainer);
				this.markSaveData(true);
				ToastAlert.showAlertMinBotton("Datos eliminados con éxito", "success");
			}
		} catch (error) {
			console.error("Error al eleminar los datos guardados:", error.message, error);
			ToastAlert.showAlertFullTop("Ha ocurrido un error al guardar los datos");
		}
	}

	markSaveData(isRemoveMark) {
		if (!this.buttonSaveData) {
			console.error("No existe el botón de guardar datos.");
			return;
		}

		if (isRemoveMark) {
			this.buttonSaveData.classList.remove("save-data-active");
		} else {
			this.buttonSaveData.classList.add("save-data-active");
		}
	}
}
