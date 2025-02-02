class HandleReceipLineInsight extends HandlePanelDetailDataExternal {
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
			receiptId: null,
			internalReceiptNumber: null,
		};

		this.externalPanelElements = {
			capacityCJ: null,
		};

		this.panelElements = {
			...this.internalPanelElements,
			...this.externalPanelElements,
		};

		this.internalData = {
			receiptId: "[aria-describedby='ListPaneDataGrid_RECEIPT_ID']",
			internalReceiptNumber: "[aria-describedby='ListPaneDataGrid_INTERNAL_RECEIPT_NUM']",
		};
	}

	_initializeInternalPanelElements() {
		return {
			receiptId: document.querySelector(this.selectorsId.receiptId),
			internalReceiptNumber: document.querySelector(this.selectorsId.internalReceiptNumber),
		};
	}

	_initializeExternalPanelElements() {
		return {
			capacityCJ: document.querySelector(this.selectorsId.capacityCJ),
		};
	}

	_extraerDatosDeTr(tr) {
		if (!tr) return;

		const receiptId = this._extractAndTrim(tr.querySelector(this.internalData.receiptId));
		const internalReceiptNumber = this._extractAndTrim(tr.querySelector(this.internalData.internalReceiptNumber));

		const insert = [
			{ element: this.panelElements.receiptId, value: receiptId },
			{ element: this.panelElements.internalReceiptNumber, value: internalReceiptNumber },
		];

		// Llamar a insertarInfo con los datos extraídos
		this._insertInfo({
			insert,
		});
	}

	_insertInfo({ insert = [] }) {
		// LLAMA A _cleanDetailPanel EN super._insertInfo
		super._insertInfo({ insert });
		this.initializeCapacityCJText();
	}

	_initializeDataExternal() {
		this._listeningToBackgroundMessages();
		this.setClickEventCapacityCJ();
	}
}
