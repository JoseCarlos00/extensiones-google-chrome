class HandlePanelDetailDataExternal extends HandlePanelDetail {
	constructor() {
		super();

		this.backgroundMessage = "invalidate";
		this.headerDataExternalPrincipal = "not data";

		this.seeMoreInformationSelector = {
			seeMoreInformation: "#seeMoreInformation",
			capacityCJ: "#DetailPaneHeaderShowCapacityCJ",
		};
		this.externalPanelElements = {};
		this.internalPanelElements = {};
		this.internalPanelValue = {};

		this.messageMap = {
			[this.backgroundMessage]: (datos) => this._updateDetailsPanelInfo(datos),
			datos_no_encontrados: () => this._removeClassWait(this.externalPanelElements),
		};
	}

	setIsCancelGetDataExternal(value = true) {
		this.isCancelGetDataExternal = value;
	}

	_initializeInternalPanelElements() {
		// Retoran un Objeto de Elementos
		throw new Error("El metodo _initializeInternalPanelElements no esta definido");
	}

	_initializeExternalPanelElements() {
		// Retoran un Objeto de Elementos
		throw new Error("El metodo _initializeExternalPanelElements no esta definido");
	}

	_initializePanelElements() {
		return new Promise((resolve, reject) => {
			const internalElements = this._initializeInternalPanelElements();
			const externalElements = this._initializeExternalPanelElements();

			// Combina todos los elementos
			const allElements = {
				...internalElements,
				...externalElements,
				seeMoreInformation: document.querySelector(this.selectorsId.seeMoreInformation),
			};

			const missingOptions = Object.entries(allElements)
				.filter(([key, value]) => !value)
				.map(([key]) => key);

			if (missingOptions.length > 0) {
				reject(
					`No se encontraron los elementos necesarios para inicializar HandlePanelDetail: [${missingOptions.join(
						", "
					)}]`
				);
			}

			// Asigna los elementos validados a sus respectivos objetos
			this.internalPanelElements = internalElements;
			this.externalPanelElements = externalElements;
			this.panelElements = allElements;

			setTimeout(resolve, 50);
		});
	}

	async _cleanDetailPanel() {
		for (const key in this.panelElements) {
			const element = this.panelElements[key];

			if (element) {
				element.innerHTML = "";
				element.classList.remove("wait");
			}
		}
	}

	_insertInfo({ insert = [] }) {
		// LLAMA A _cleanDetailPanel EN super._insertInfo
		super._insertInfo({ insert });
		const { seeMoreInformation } = this.panelElements;

		if (seeMoreInformation) {
			seeMoreInformation.classList.remove("disabled");
			seeMoreInformation.innerHTML = "Ver mas info...";
		}
	}

	_waitFordata(externalPanelElements) {
		const text = "1346-863-28886...";

		if (!(externalPanelElements instanceof Object) || !externalPanelElements) {
			console.error("[waitFordata]: No se ecnotro el objeto [externalPanelElements]");
			return;
		}

		for (const key in externalPanelElements) {
			const element = externalPanelElements[key];

			if (element) {
				element.innerHTML = text;
				element.classList.add("wait");
			}
		}
	}

	_removeClassWait(externalPanelElements) {
		const text = "No encontrado";

		if (!(externalPanelElements instanceof Object) || !externalPanelElements) {
			console.error("[removeClassWait]: No se ecnotro el objeto [externalPanelElements]");
			return;
		}

		for (const key in externalPanelElements) {
			const element = externalPanelElements[key];

			if (element) {
				element.innerHTML = text;
				element.classList.remove("wait");
			}
		}
	}

	_updateDetailsPanelInfo(datos) {
		// Actualizar la interfaz con los datos recibidos
		throw new Error("El metodo _updateDetailsPanelInfo no esta definido");
	}

	_setDataExternal(elementsToUpdate = []) {
		if (elementsToUpdate.length === 0) {
			console.warn("[setDataExternal]: [elementsToUpdate] esta vacio");
			return;
		}

		// Iterar sobre elementsToUpdate
		elementsToUpdate.forEach(({ element, value }) => {
			// Actualizar el valor del elemento
			if (element) {
				element.innerText = value;
				element.classList.remove("wait");
			}
		});
	}

	_sendBackgroundMessage(urlParams) {
		chrome.runtime.sendMessage(
			{
				action: "some_action",
				url: urlParams,
			},
			(response) => {
				console.log("Respuesta de background.js:", response.status);
			}
		);
	}

	_getDataExternal() {
		// Obtener los datos de la API externa
		throw new Error("El metodo _getDataExternal no esta definido");
	}

	_setEventSeeMore() {
		const { seeMoreInformation } = this.panelElements;
		// Agregar evento al botón "Ver más"
		if (!seeMoreInformation) {
			console.warn('No se encontró el botón "Ver más"');
			return;
		}

		seeMoreInformation.addEventListener("click", (e) => {
			seeMoreInformation.classList.add("disabled");
			this._getDataExternal();
		});
	}

	_initializeDataExternal() {
		this._listeningToBackgroundMessages();
		this._setEventSeeMore();
	}

	async _initializeHandlePanelDetail() {
		try {
			await this._initializePanelElements();
			this._initializeDataExternal();
		} catch (error) {
			console.error("Error: ha ocurrido un error al inizicailar HandleInventory:", error);
		}
	}

	handleDataNoFoundCapacity() {
		const { capacityCJ } = this.externalPanelElements;

		if (capacityCJ) {
			capacityCJ.innerHTML = "No encontrado";
			capacityCJ.classList.remove("wait");
			capacityCJ.classList.remove("disabled");
			capacityCJ.classList.add("show-info");
		}
	}

	_handleDataNotFound(datos) {
		const { header } = datos;

		if (header === this.headerDataExternalPrincipal) {
			this._removeClassWait(this.group1ExternalPanelElements);
			return;
		}

		this.handleDataNoFoundCapacity();
	}

	updateCapacityCJ(datos) {
		const { capacityCJ } = this.group2ExternalPanelElements;
		const { capacityCJ: capacityCJValue = "" } = datos;

		if (!capacityCJ) {
			console.warn("No se encontró el elemento de <capacidadCJ>");
			return;
		}

		capacityCJ.innerHTML = `${capacityCJValue} CJ`;
		capacityCJ.classList.remove("wait");
		capacityCJ.classList.remove("disabled");
		capacityCJ.classList.add("show-info");
	}

	fetchCapacityData(item) {
		try {
			const urlParams = `https://wms.fantasiasmiguel.com.mx/scale/trans/itemUOM?Item=${item}&Company=FM`;
			this._sendBackgroundMessage(urlParams);
		} catch (error) {
			console.error("Error: ha ocurrido un error al obtener la capacidad de item:", error);
		}
	}

	getCurrentINternalItem() {
		const { item } = this.internalPanelValue;
		return item;
	}

	getCurrentItem() {
		const currentItem = document.querySelector("#DetailPaneHeaderItem")?.textContent?.trim();
		return currentItem;
	}

	getCapacityCJ() {
		const item = this.getCurrentItem();
		console.log("CurrentItem:", item);

		if (!item) {
			ToastAlert.showAlertMinTop("Ha ocurrido un error al obtener la capacidad del item");
			return;
		}

		this._waitFordata(this.group2ExternalPanelElements);
		this.setIsCancelGetDataExternal(false);
		this.fetchCapacityData(item);
	}

	initializeCapacityCJText() {
		const { capacityCJ } = this.externalPanelElements;

		if (!capacityCJ) {
			console.warn('No se encontró el elemento "Capacidad CJ"');
			return;
		}

		capacityCJ.classList.remove("disabled");
		capacityCJ.classList.remove("show-info");
		capacityCJ.innerHTML = "Capacidad CJ...";
	}

	setClickEventCapacityCJ() {
		const { capacityCJ } = this.externalPanelElements;

		if (!capacityCJ) {
			console.warn('No se encontró el elemento "Capacidad CJ"');
			return;
		}

		capacityCJ.addEventListener("click", (e) => {
			capacityCJ.classList.add("disabled");

			this.getCapacityCJ();
		});
	}

	_listeningToBackgroundMessages() {
		chrome.runtime.onMessage.addListener((message) => {
			const { action, datos } = message;

			console.log("msg action:", action);
			console.log("this.backgroundMessage:", this.backgroundMessage);

			if (this.isCancelGetDataExternal) {
				return;
			}

			if (this.messageMap[action]) {
				this.messageMap[action](datos);
			} else {
				console.error("[listeningToBackgroundMessages]: unknown background response message:", message.action);
				console.log(this.messageMap);
			}
		});
	}
}
