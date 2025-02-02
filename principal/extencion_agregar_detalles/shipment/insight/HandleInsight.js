class HandleInsight extends HandlePanelDetailDataExternal {
	constructor({ selectorsId }) {
		super();
		this.backgroundMessage = "actualizar_datos_de_load_detail";

		this.messageMap = {
			[this.backgroundMessage]: (datos) => this._updateDetailsPanelInfo(datos),
			datos_no_encontrados: (datos) => this._handleDataNotFound(datos),
		};

		this.selectorsId = {
			...selectorsId,
			...this.seeMoreInformationSelector,
		};

		this.group1ExternalPanelElements = {
			dockDoor: null,
		};

		this.externalPanelElements = {
			...this.group1ExternalPanelElements,
		};

		this.internalPanelElements = {
			loadNumber: null,
			userDefineFile3: null,
			internalShipmentNum: null,
			trailingNum: null,
			leadingNum: null,
			dockDoor: null,
		};

		this.panelElements = {
			...this.internalPanelElements,
			...this.externalPanelElements,
			seeMoreInformation: null,
		};

		this.internalData = {
			loadNumber: "[aria-describedby='ListPaneDataGrid_SHIPPING_LOAD_NUM']",
			userDefineFile3: "[aria-describedby='ListPaneDataGrid_SHIPMENT_HEADER_USER_DEF3']",
			internalShipmentNum: "[aria-describedby='ListPaneDataGrid_INTERNAL_SHIPMENT_NUM']",
			trailingNum: "[aria-describedby='ListPaneDataGrid_TRAILINGSTS']",
			leadingNum: "[aria-describedby='ListPaneDataGrid_LEADINGSTS']",
		};

		this.anchorLoad = "https://wms.fantasiasmiguel.com.mx/scale/details/shippingload/";
	}

	_initializeInternalPanelElements() {
		return {
			loadNumber: document.querySelector(this.selectorsId.loadNumber),
			userDefineFile3: document.querySelector(this.selectorsId.userDefineFile3),
			internalShipmentNum: document.querySelector(this.selectorsId.internalShipmentNum),
			trailingNum: document.querySelector(this.selectorsId.trailingNum),
			leadingNum: document.querySelector(this.selectorsId.leadingNum),
			dockDoor: document.querySelector(this.selectorsId.dockDoor),
		};
	}

	_initializeExternalPanelElements() {
		this.group1ExternalPanelElements = {
			dockDoor: document.querySelector(this.selectorsId.dockDoor),
		};
		return {
			...this.group1ExternalPanelElements,
			seeMoreInformation: document.querySelector(this.selectorsId.seeMoreInformation),
		};
	}

	_extraerDatosDeTr(tr) {
		if (!tr) return;

		// Uso de la función auxiliar para extraer y limpiar valores
		const loadNumber = this._extractAndTrim(tr.querySelector(this.internalData.loadNumber));
		const userDefineFile3 = this._extractAndTrim(tr.querySelector(this.internalData.userDefineFile3), "—");
		const internalShipmentNum = this._extractAndTrim(tr.querySelector(this.internalData.internalShipmentNum));
		const trailingNum = this._extractAndTrim(tr.querySelector(this.internalData.trailingNum));
		const leadingNum = this._extractAndTrim(tr.querySelector(this.internalData.leadingNum));

		if (this.internalPanelElements.loadNumber) {
			this.internalPanelElements.loadNumber.href = `${this.anchorLoad + loadNumber}`;
		}

		const insert = [
			{ element: this.internalPanelElements.loadNumber, value: loadNumber },
			{ element: this.internalPanelElements.userDefineFile3, value: userDefineFile3 },
			{ element: this.internalPanelElements.internalShipmentNum, value: internalShipmentNum },
			{ element: this.internalPanelElements.trailingNum, value: trailingNum },
			{ element: this.internalPanelElements.leadingNum, value: leadingNum },
		];

		// Llamar a insertarInfo con los datos extraídos
		this._insertInfo({
			insert,
		});
	}

	_insertInfo({ insert = [] }) {
		// LLAMA A _cleanDetailPanel EN super._insertInfo
		super._insertInfo({ insert });
		this._insertSeeMoreInformation();
	}

	_getDataExternal() {
		try {
			const { loadNumber: loadNumberElement } = this.internalPanelElements;

			const loadNumber = loadNumberElement ? Number(loadNumberElement.textContent.trim()) : "";

			if (!loadNumber) {
				ToastAlert.showAlertMinTop(`Shipping load Invalido: [${loadNumber}]`);
				return;
			}

			if (loadNumberElement) {
				this._waitFordata(this.group1ExternalPanelElements);
				this.setIsCancelGetDataExternal(false);

				const url = `https://wms.fantasiasmiguel.com.mx/scale/details/shippingload/${loadNumber}?active=active`;
				this._sendBackgroundMessage(url);
			} else {
				ToastAlert.showAlertFullTop("No se encontró la Columna [Shipping load], por favor active la columna.");
				console.log("No se encontró el Shipping load");
			}
		} catch (error) {
			console.error("Error al obtener datos externos:", error);
		}
	}

	_updateDetailsPanelInfo(datos) {
		const { dockDoor } = datos;

		const elementsToUpdate = [{ element: this.externalPanelElements.dockDoor, value: `Door: ${dockDoor}` }];

		this._setDataExternal(elementsToUpdate);
	}
}
