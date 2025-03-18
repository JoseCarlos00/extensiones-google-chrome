class HandlePanelDetailInventory extends HandlePanelDetailDataExternal {
	constructor({ selectorsId }) {
		super();

		this.backgroundMessageGroup1 = 'actualizar_datos_de_inventory_detail';
		this.headerDataExternalPrincipal = 'Inventory Detail';

		this.messageMap = {
			[this.backgroundMessageGroup1]: (datos) => this._updateDetailsPanelInfo(datos),
			[this.backgroundMessageUOM]: (datos) => this.updateCapacityCJ(datos),
			datos_no_encontrados: (datos) => this._handleDataNotFound(datos),
		};

		this.selectorsId = {
			...selectorsId,
			...this.seeMoreInformationSelector,
		};

		this.group1ExternalPanelElements = {
			userStamp: null,
			dateTimeStamp: null,
			allocation: null,
			locating: null,
			workZone: null,
			attribute1: null,
		};

		this.group2ExternalPanelElements = {
			capacityCJ: null,
		};

		this.externalPanelElements = {
			...this.group1ExternalPanelElements,
			...this.group2ExternalPanelElements,
		};

		this.internalPanelElements = {
			internalLocationInv: null,
			logisticsUnit: null,
			parentLogisticsUnit: null,
		};

		this.panelElements = {
			...this.internalPanelElements,
			...this.externalPanelElements,
			seeMoreInformation: null,
		};

		this.internalData = {
			internalLocationInv: "[aria-describedby='ListPaneDataGrid_INTERNAL_LOCATION_INV']",
			logisticsUnit: "[aria-describedby='ListPaneDataGrid_LOGISTICS_UNIT']",
			parentLogisticsUnit: "[aria-describedby='ListPaneDataGrid_PARENT_LOGISTICS_UNIT']",
		};
	}

	_initializeInternalPanelElements() {
		return {
			internalLocationInv: document.querySelector(this.selectorsId.internalLocationInv),
			logisticsUnit: document.querySelector(this.selectorsId.logisticsUnit),
			parentLogisticsUnit: document.querySelector(this.selectorsId.parentLogisticsUnit),
		};
	}

	_initializeExternalPanelElements() {
		this.group1ExternalPanelElements = {
			userStamp: document.querySelector(this.selectorsId.userStamp),
			dateTimeStamp: document.querySelector(this.selectorsId.dateTimeStamp),
			allocation: document.querySelector(this.selectorsId.allocation),
			locating: document.querySelector(this.selectorsId.locating),
			workZone: document.querySelector(this.selectorsId.workZone),
			attribute1: document.querySelector(this.selectorsId.attribute1),
		};
		return {
			...this.group1ExternalPanelElements,
			seeMoreInformation: document.querySelector(this.selectorsId.seeMoreInformation),
			capacityCJ: document.querySelector(this.selectorsId.capacityCJ),
		};
	}

	_extraerDatosDeTr(tr) {
		if (!tr) return;

		const internalLocationInv = this._extractAndTrim(tr.querySelector(this.internalData.internalLocationInv));
		const logisticsUnit = this._extractAndTrim(tr.querySelector(this.internalData.logisticsUnit));
		const parentLogisticsUnit = this._extractAndTrim(tr.querySelector(this.internalData.parentLogisticsUnit));

		const insert = [
			{ element: this.panelElements.internalLocationInv, value: internalLocationInv },
			{ element: this.panelElements.logisticsUnit, value: logisticsUnit },
			{ element: this.panelElements.parentLogisticsUnit, value: parentLogisticsUnit },
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
		this.initializeCapacityCJText();
	}

	getDataFromInternalLocationInv() {
		const { internalLocationInv: internalLocationInvElement, seeMoreInformation } = this.panelElements;

		const internalNumberText = internalLocationInvElement ? internalLocationInvElement.textContent.trim() : '';

		if (internalNumberText === '-1' || internalNumberText === '0') {
			ToastAlert.showAlertMinTop(`Internal Location Inv Invalido: [${internalNumberText}]`);
			return;
		}

		if (internalNumberText) {
			console.log('group1ExternalPanelElements', this.group1ExternalPanelElements);
			console.log('externalPanelElements', this.externalPanelElements);

			this._waitFordata(this.group1ExternalPanelElements);
			this.setIsCancelGetDataExternal(false);

			const url = `https://wms.fantasiasmiguel.com.mx/scale/trans/inventory?InternalLocationInv=${internalNumberText}&active=active`;
			this._sendBackgroundMessage(url);
		} else {
			ToastAlert.showAlertFullTop('No se encontró la columna [Internal Location Inv], por favor active la columna.');
			console.error('No se encontró el Internal Location Inv');
			if (seeMoreInformation) seeMoreInformation.classList.remove('disabled'); // Reactivar el botón
		}
	}

	_getDataExternal() {
		try {
			this.setIsCancelGetDataExternal(false);

			this.getDataFromInternalLocationInv();
		} catch (error) {
			console.error('Error al obtener datos externos:', error);
		}
	}

	_updateDetailsPanelInfo(datos) {
		const { receivedDateTime, attribute1, allocation, locating, workZone, userStamp, dateTimeStamp } = datos;

		const elementsToUpdate = [
			{ element: this.externalPanelElements.receivedDateTime, value: receivedDateTime },
			{ element: this.externalPanelElements.userStamp, value: userStamp },
			{ element: this.externalPanelElements.dateTimeStamp, value: dateTimeStamp },
			{ element: this.externalPanelElements.allocation, value: allocation },
			{ element: this.externalPanelElements.locating, value: locating },
			{ element: this.externalPanelElements.workZone, value: workZone },
			{ element: this.externalPanelElements.attribute1, value: attribute1 },
		];

		this._setDataExternal(elementsToUpdate);
	}

	_initializeDataExternal() {
		this._listeningToBackgroundMessages();
		this._setEventSeeMore();
		this.setClickEventCapacityCJ();
	}
}
