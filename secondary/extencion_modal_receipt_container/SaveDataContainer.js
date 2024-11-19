class SaveDataContainer {
	constructor() {
		this.buttonSaveConfiguration = {
			buttonId: "saveData",
			iconoModal: "fa-save",
			iconoId: "saveDataIcono",
			textLabel: "Guardar Contenedores",
			textLabelPosition: "right",
		};
		this.buttonDeleteConfiguration = {
			buttonId: "deleteData",
			iconoModal: "fa-trash",
			iconoId: "deleteDataIcono",
			textLabel: "Borrar Contenedores",
			textLabelPosition: "right",
		};

		this.buttonSaveData = null;
		this.buttonDeleteData = null;

		this._tbodyTable = document.querySelector("#ListPaneDataGrid tbody");
		this.trailerId = this.getTrailerId();

		this.nameStorageContainer = "dataContainers";
	}

	async init() {
		try {
			this.buttonSaveData = await ButtonOpenModal.getButtonOpenModal(this.buttonSaveConfiguration);
			this.buttonDeleteData = await ButtonOpenModal.getButtonOpenModal(this.buttonDeleteConfiguration);

			await this.insertButtons();
			this.setEventListener();
			this.handleMarckSaveData();
		} catch (error) {
			console.error("Ha ocurrido un error al iniciar el componente SaveDataContainer:", error.message);
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
		const buttonSaveData = document.querySelector(`#${this.buttonSaveConfiguration.buttonId}`);
		const buttonDeleteData = document.querySelector(`#${this.buttonDeleteConfiguration.buttonId}`);

		if (!buttonSaveData) {
			throw new Error("No se encontró el botón con el id #" + this.buttonSaveConfiguration.buttonId);
		}

		if (!buttonDeleteData) {
			throw new Error("No se encontró el botón con el id #" + this.buttonDeleteConfiguration.buttonId);
		}

		buttonSaveData.addEventListener("click", async (e) => this.handleSaveData(e));
		buttonDeleteData.addEventListener("click", async (e) => this.handleDeleteData(e));
	}

	getTrailerId() {
		try {
			const advanceCriteriaJson = JSON.parse(sessionStorage.getItem("2779advanceCriteriaJson")) || [];

			if (!Array.isArray(advanceCriteriaJson)) {
				console.warn("El contenido de advanceCriteriaJson no es una matriz:", advanceCriteriaJson);
				return "No encontrado";
			}

			// Buscar el valor del trailerId
			const trailerId = advanceCriteriaJson.find(({ FieldIdentifier }) => FieldIdentifier === "TRAILER_ID")?.Value;

			return trailerId || "No encontrado";
		} catch (error) {
			console.error("Error al obtener el trailerId:", error.message, error);
			return "No encontrado";
		}
	}

	async getContainersList() {
		try {
			if (!this._tbodyTable) {
				throw new Error("No se encontró el elemento tbody");
			}

			const rows = Array.from(this._tbodyTable.rows);

			if (rows.length === 0) {
				return [];
			}

			// Procesar cada fila para obtener el valor deseado
			const containersList = rows
				.flatMap((row) => {
					// Iterar por los hijos de cada fila
					return Array.from(row.children)
						.filter((td) => td.getAttribute("aria-describedby") === "ListPaneDataGrid_LICENSE_PLATE_ID")
						.map((td) => td.textContent?.trim() || null);
				})
				.filter(Boolean); // Filtrar valores nulos o vacíos

			return containersList;
		} catch (error) {
			console.error(
				`Error: [getContainersList] Ha ocurrido un error al obtener la lista de contenedores: ${error.message}`,
				error
			);

			return [];
		}
	}

	async handleSaveData(e) {
		try {
			e.preventDefault();

			// Obtener los datos
			let trailerId = await this.getTrailerId();
			const containersList = await this.getContainersList();

			// Verificar que hay contenedores
			if (!containersList || containersList.length === 0) {
				console.error("No hay contenedores para guardar.");
				return;
			}

			if (!trailerId || trailerId?.trim() === "No encontrado") {
				let trailerName = prompt("Trailer id");

				if (trailerName) {
					trailerId = trailerName?.trim();
				} else {
					throw new Error("No se ingresó el id del trailer");
				}
			}

			// Dividir la lista de contenedores en grupos de 5
			const groupedContainers = [];
			for (let i = 0; i < containersList.length; i += 5) {
				groupedContainers.push(containersList.slice(i, i + 5));
			}

			// Crear el objeto final con grupos
			const data = groupedContainers.reduce((result, group, index) => {
				result[`group${index + 1}`] = { trailerId, containers: group };
				return result;
			}, {});

			console.log("Datos guardados:", data);
			LocalStorageHelper.save(this.nameStorageContainer, data);
			ToastAlert.showAlertMinBotton("Datos guardados con éxito", "success");
			this.markSaveData();
		} catch (error) {
			console.error("Error al guardar los datos:", error.message, error);
			ToastAlert.showAlertFullTop("Ha ocurrido un error al guardar los datos");
		}
	}

	handleMarckSaveData() {
		const saveData = LocalStorageHelper.get(this.nameStorageContainer);

		if (!saveData) {
			return;
		}

		this.markSaveData();
	}

	markSaveData(isRemoveMark) {
		console.log("markSaveData:", this.buttonSaveData);

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

	handleDeleteData() {
		try {
			const saveData = LocalStorageHelper.get(this.nameStorageContainer);

			if (!saveData) {
				console.warn("No hay datos para eliminar");
				return;
			}

			const confirmDelete = confirm(`¿Estás seguro de eliminar los datos guardados?\nEstá acción no se puede deshacer`);

			if (confirmDelete) {
				LocalStorageHelper.remove(this.nameStorageContainer);
				ToastAlert.showAlertMinBotton("Datos eliminados con éxito", "success");
				this.markSaveData(true);
			}
		} catch (error) {
			console.error("Error al eleminar los datos guardados:", error.message, error);
			ToastAlert.showAlertFullTop("Ha ocurrido un error al guardar los datos");
		}
	}
}
