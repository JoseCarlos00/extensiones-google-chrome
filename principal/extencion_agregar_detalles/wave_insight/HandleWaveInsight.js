class HandlePanelDetailWaveInsight extends HandlePanelDetailDataExternal {
	constructor({ selectorsId }) {
		super();
		this.backgroundMessage = "actualizar_datos_de_wave_detail";

		this.messageMap = {
			[this.backgroundMessage]: (datos) => this._updateDetailsPanelInfo(datos),
			datos_no_encontrados: (datos) => this._handleDataNotFound(datos),
		};

		this.selectorsId = {
			...selectorsId,
			...this.seeMoreInformationSelector,
		};

		this.group1ExternalPanelElements = {
			userStamp: null,
		};

		this.externalPanelElements = {
			...this.group1ExternalPanelElements,
			seeMoreInformation: null,
		};

		this.internalPanelElements = {
			waveNumber: null,
			waveFlow: null,
			startDataTime: null,
			endDataTime: null,
		};

		this.panelElements = {
			...this.internalPanelElements,
			...this.externalPanelElements,
			seeMoreInformation: null,
		};

		this.internalData = {
			waveFlow: "[aria-describedby='ListPaneDataGrid_WAVE_FLOW']",
			startDataTime: "[aria-describedby='ListPaneDataGrid_WAVE_DATE_TIME_STARTED']",
			endDataTime: "[aria-describedby='ListPaneDataGrid_WAVE_DATE_TIME_ENDED']",
		};
	}

	_initializeInternalPanelElements() {
		return {
			waveFlow: document.querySelector(this.selectorsId.waveFlow),
			startDataTime: document.querySelector(this.selectorsId.startDataTime),
			endDataTime: document.querySelector(this.selectorsId.endDataTime),
			waveNumber: document.querySelector(this.selectorsId.waveNumber),
		};
	}

	_initializeExternalPanelElements() {
		this.group1ExternalPanelElements = {
			userStamp: document.querySelector(this.selectorsId.userStamp),
		};
		return {
			...this.group1ExternalPanelElements,
			seeMoreInformation: document.querySelector(this.selectorsId.seeMoreInformation),
		};
	}

	_extraerDatosDeTr(tr) {
		if (!tr) return;

		// Uso de la función auxiliar para extraer y limpiar valores
		const waveFlow = this._extractAndTrim(tr.querySelector(this.internalData.waveFlow));
		const startDataTime = this._extractAndTrim(tr.querySelector(this.internalData.startDataTime));
		const endDataTime = this._extractAndTrim(tr.querySelector(this.internalData.endDataTime), "—");

		const insert = [
			{ element: this.internalPanelElements.waveFlow, value: waveFlow },
			{ element: this.internalPanelElements.startDataTime, value: startDataTime },
			{ element: this.internalPanelElements.endDataTime, value: endDataTime },
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
			const { waveNumber: internalElement } = this.internalPanelElements;

			const waveNumber = internalElement ? Number(internalElement.textContent.trim()) : "";

			if (!waveNumber) {
				ToastAlert.showAlertMinTop(`Wave Invalido: [${waveNumber}]`);
				return;
			}

			if (internalElement) {
				this._waitFordata(this.group1ExternalPanelElements);
				this.setIsCancelGetDataExternal(false);

				const url = `https://wms.fantasiasmiguel.com.mx/scale/details/wavedetail/${waveNumber}?active=active`;
				this._sendBackgroundMessage(url);
			} else {
				ToastAlert.showAlertFullTop("No se encontró la Columna [Wave], por favor active la columna.");
				console.log("No se encontró el Wave");
			}
		} catch (error) {
			console.error("Error al obtener datos externos:", error);
		}
	}

	_updateDetailsPanelInfo(datos) {
		const { userStamp } = datos;

		const elementsToUpdate = [{ element: this.externalPanelElements.userStamp, value: `${userStamp}` }];

		this._setDataExternal(elementsToUpdate);
	}
}
