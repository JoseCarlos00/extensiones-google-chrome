class HandlePanelDetailTransactionHistory extends HandlePanelDetailDataExternal {
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

		this.externalPanelElements = {
			capacityCJ: null,
		};

		this.internalPanelElements = {
			workUnit: null,
			containerId: null,
			userName: null,
			customer: null,
			activityDateTime: null,
		};

		this.panelElements = {
			...this.internalPanelElements,
			...this.externalPanelElements,
		};

		this.internalData = {
			workUnit: "[aria-describedby='ListPaneDataGrid_WorkUnit']",
			containerId: "[aria-describedby='ListPaneDataGrid_ContainerId']",
			userName: "[aria-describedby='ListPaneDataGrid_UserName']",
			referenceId: "[aria-describedby='ListPaneDataGrid_ReferenceId']",
			activityDateTime: "[aria-describedby='ListPaneDataGrid_ActivityDateTime']",
		};
	}

	_initializeInternalPanelElements() {
		return {
			workUnit: document.querySelector(this.selectorsId.workUnit),
			containerId: document.querySelector(this.selectorsId.containerId),
			userName: document.querySelector(this.selectorsId.userName),
			customer: document.querySelector(this.selectorsId.customer),
			activityDateTime: document.querySelector(this.selectorsId.activityDateTime),
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
		const userName = this._extractAndTrim(tr.querySelector(this.internalData.userName));
		const referenceId = this._extractAndTrim(tr.querySelector(this.internalData.referenceId));
		const activityDateTime = this._extractAndTrim(tr.querySelector(this.internalData.activityDateTime));

		const insert = [
			{ element: this.panelElements.workUnit, value: workUnit },
			{ element: this.panelElements.containerId, value: "LP: " + containerId },
			{ element: this.panelElements.userName, value: userName },
			{ element: this.panelElements.activityDateTime, value: activityDateTime },
		];

		// Llamar a insertarInfo con los datos extraídos
		this._insertInfo({
			insert,
			referenceId,
		});
	}

	_insertInfo({ insert = [], referenceId }) {
		super._insertInfo({ insert });
		this.initializeCapacityCJText();

		// Insertar tienda si hay un ID de envío
		this._insertarTienda(referenceId);
	}

	_initializeDataExternal() {
		this._listeningToBackgroundMessages();
		this.setClickEventCapacityCJ();
	}
}
