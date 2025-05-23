class HandlePanelDetailWorkInsight extends HandlePanelDetailDataExternal {
	constructor({ selectorsId }) {
		super();
		this.backgroundMessage = "actualizar_datos_de_workinstruction_detail";

		this.messageMap = {
			[this.backgroundMessage]: (datos) => this._updateDetailsPanelInfo(datos),
			[this.backgroundMessageUOM]: (datos) => this.updateCapacityCJ(datos),
			datos_no_encontrados: (datos) => this._handleDataNotFound(datos),
		};

		this.selectorsId = {
			...selectorsId,
			...this.seeMoreInformationSelector,
		};

		this.group1ExternalPanelElements = {
			fromZone: null,
			toZone: null,
		};

		this.externalPanelElements = {
			...this.group1ExternalPanelElements,
		};

		this.internalPanelElements = {
			referenceId: null,
			assignedUser: null,
			internalNum: null,
			completedByUser: null,
			waveNumber: null,
			customer: null,
		};

		this.panelElements = {
			...this.internalPanelElements,
			...this.externalPanelElements,
			seeMoreInformation: null,
			capacityCJ: null,
		};

		this.internalData = {
			internal: "[aria-describedby='ListPaneDataGrid_SHIPPING_LOAD_NUM']",
			referenceId: "[aria-describedby='ListPaneDataGrid_REFERENCE_ID']",
			assignedUser: "[aria-describedby='ListPaneDataGrid_USER_ASSIGNED']",
			waveNumber: "[aria-describedby='ListPaneDataGrid_LAUNCH_NUM']",
			internalNum: "[aria-describedby='ListPaneDataGrid_INTERNAL_INSTRUCTION_NUM']",
			completedByUser: "[aria-describedby='ListPaneDataGrid_COMPLETED_BY_USER']",
		};
	}

	_initializeInternalPanelElements() {
		return {
			referenceId: document.querySelector(this.selectorsId.referenceId),
			assignedUser: document.querySelector(this.selectorsId.assignedUser),
			internalNum: document.querySelector(this.selectorsId.internalNum),
			completedByUser: document.querySelector(this.selectorsId.completedByUser),
			waveNumber: document.querySelector(this.selectorsId.waveNumber),
			customer: document.querySelector(this.selectorsId.customer),
		};
	}

	_initializeExternalPanelElements() {
		this.group1ExternalPanelElements = {
			fromZone: document.querySelector(this.selectorsId.fromZone),
			toZone: document.querySelector(this.selectorsId.toZone),
		};

		return {
			...this.group1ExternalPanelElements,
			seeMoreInformation: document.querySelector(this.selectorsId.seeMoreInformation),
			capacityCJ: document.querySelector(this.selectorsId.capacityCJ),
		};
	}

	_extraerDatosDeTr(tr) {
		if (!tr) return;

		// Uso de la función auxiliar para extraer y limpiar valores
		const referenceId = this._extractAndTrim(tr.querySelector(this.internalData.referenceId));
		const assignedUser = this._extractAndTrim(tr.querySelector(this.internalData.assignedUser), "—");
		const waveNumber = this._extractAndTrim(tr.querySelector(this.internalData.waveNumber));
		const internalNum = this._extractAndTrim(tr.querySelector(this.internalData.internalNum));
		const completedByUser = this._extractAndTrim(tr.querySelector(this.internalData.completedByUser), "—");

		const insert = [
			{ element: this.internalPanelElements.referenceId, value: referenceId },
			{ element: this.internalPanelElements.assignedUser, value: assignedUser },
			{ element: this.internalPanelElements.waveNumber, value: `Wave: ${waveNumber}` },
			{ element: this.internalPanelElements.internalNum, value: internalNum },
			{ element: this.internalPanelElements.completedByUser, value: completedByUser },
		];

		// Llamar a insertarInfo con los datos extraídos
		this._insertInfo({
			insert,
			tiendaNum: referenceId,
		});
	}

	_insertInfo({ insert = [], tiendaNum }) {
		super._insertInfo({ insert });
		this._insertSeeMoreInformation();
		this.initializeCapacityCJText();

		// Insertar tienda si hay un ID de envío
		this._insertarTienda(tiendaNum);
	}

	_getDataExternal() {
		try {
			const { internalNum: internalElement } = this.internalPanelElements;

			const internalNumber = internalElement ? String(internalElement.textContent.trim()) : "";
			if (!internalElement) {
				ToastAlert.showAlertMinTop(`Internal Instruction Number No Valido: [${internalNumber}]`);
				return;
			}

			if (internalElement) {
				this._waitFordata(this.group1ExternalPanelElements);
				this.setIsCancelGetDataExternal(false);

				const url = `https://wms.fantasiasmiguel.com.mx/scale/details/workinstruction/${internalNumber}?active=active`;
				this._sendBackgroundMessage(url);
			} else {
				ToastAlert.showAlertFullTop(
					"No se encontró la Columna [Internal Instruction Number], por favor active la columna."
				);
				console.log("No se encontró el Internal Instruction Number");
			}
		} catch (error) {
			console.error("Error al obtener datos externos:", error);
		}
	}

	_updateDetailsPanelInfo(datos) {
		const { fromZone, toZone } = datos;

		const elementsToUpdate = [
			{ element: this.externalPanelElements.fromZone, value: `${fromZone}` },
			{ element: this.externalPanelElements.toZone, value: `${toZone}` },
		];

		this._setDataExternal(elementsToUpdate);
	}

	_initializeDataExternal() {
		this._listeningToBackgroundMessages();
		this._setEventSeeMore();
		this.setClickEventCapacityCJ();
	}
}
