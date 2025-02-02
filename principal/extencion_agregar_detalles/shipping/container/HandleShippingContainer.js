class HandleShippingContainer extends HandlePanelDetailDataExternal {
	constructor({ selectorsId }) {
		super();
		this.messageMap = {
			[this.backgroundMessageUOM]: (datos) => this.updateCapacityCJ(datos),
			datos_no_encontrados: (datos) => this.handleDataNoFoundCapacity(),
		};

		this.selectorsId = {
			...selectorsId,
			...this.seeMoreInformationSelector,
		};

		this.internalPanelElements = {
			workUnit: null,
			parentContainerId: null,
			statusNumeric: null,
			shipmentId: null,
			internalShipmentNum: null,
			internalContainerNum: null,
			customer: null,
		};

		this.externalPanelElements = {
			capacityCJ: null,
		};

		this.panelElements = {
			...this.internalPanelElements,
			...this.externalPanelElements,
		};

		this.internalData = {
			workUnit: "[aria-describedby='ListPaneDataGrid_WorkUnit']",
			containerId: "[aria-describedby='ListPaneDataGrid_CONTAINER_ID']",
			parentContainerId: "[aria-describedby='ListPaneDataGrid_PARENT_CONTAINER_ID']",
			shipmentId: "[aria-describedby='ListPaneDataGrid_SHIPMENT_ID']",
			statusNumeric: "[aria-describedby='ListPaneDataGrid_STATUSNUMERIC']",
			internalShipmentNum: "[aria-describedby='ListPaneDataGrid_INTERNAL_SHIPMENT_NUM']",
			internalContainerNum: "[aria-describedby='ListPaneDataGrid_INTERNAL_CONTAINER_NUM']",
		};
	}

	_initializeInternalPanelElements() {
		return {
			parentContainerId: document.querySelector(this.selectorsId.parentContainerId),
			statusNumeric: document.querySelector(this.selectorsId.statusNumeric),
			shipmentId: document.querySelector(this.selectorsId.shipmentId),
			internalShipmentNum: document.querySelector(this.selectorsId.internalShipmentNum),
			internalContainerNum: document.querySelector(this.selectorsId.internalContainerNum),
			customer: document.querySelector(this.selectorsId.customer),
		};
	}

	_initializeExternalPanelElements() {
		return {
			capacityCJ: document.querySelector(this.selectorsId.capacityCJ),
		};
	}

	_extraerDatosDeTr(tr) {
		if (!tr) return;

		const workUnit = this._extractAndTrim(tr.querySelector(this.internalData.workUnit));
		const containerId = this._extractAndTrim(tr.querySelector(this.internalData.containerId));
		const parentContainerId = this._extractAndTrim(tr.querySelector(this.internalData.parentContainerId));
		const shipmentId = this._extractAndTrim(tr.querySelector(this.internalData.shipmentId));
		const statusNumeric = this._extractAndTrim(tr.querySelector(this.internalData.statusNumeric), "—");
		const internalShipmentNum = this._extractAndTrim(tr.querySelector(this.internalData.internalShipmentNum), "—");
		const internalContainerNum = this._extractAndTrim(tr.querySelector(this.internalData.internalContainerNum), "—");

		const insert = [
			{ element: this.panelElements.workUnit, value: workUnit },
			{ element: this.panelElements.containerId, value: containerId },
			{ element: this.panelElements.parentContainerId, value: parentContainerId },
			{ element: this.panelElements.shipmentId, value: shipmentId },
			{ element: this.panelElements.statusNumeric, value: statusNumeric },
			{ element: this.panelElements.internalShipmentNum, value: internalShipmentNum },
			{ element: this.panelElements.internalContainerNum, value: internalContainerNum },
		];

		// Llamar a insertarInfo con los datos extraídos
		this._insertInfo({
			insert,
			tiendaNum: shipmentId,
		});
	}

	_insertInfo({ insert = [], tiendaNum }) {
		super._insertInfo({ insert });
		this.initializeCapacityCJText();

		// Insertar tienda si hay un ID de envío
		this._insertarTienda(tiendaNum);
	}

	_initializeDataExternal() {
		this._listeningToBackgroundMessages();
		this.setClickEventCapacityCJ();
	}
}
