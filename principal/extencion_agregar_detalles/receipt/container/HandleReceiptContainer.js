class HandleReceiptContainer extends HandlePanelDetailDataExternal {
	constructor() {
		super();

		this.backgroundMessageGroup1 = "actualizar_datos_de_receipt_container_detail";
		this.backgroundMessageGroup2 = "actualizar_datos_de_receipt_detail";
		this.backgroundMessageGroup3 = "actualizar_datos_de_item_unit_of_measure";
		this.headerDataExternalPrincipal = "Receipt Container Detail";

		this.messageMap = {
			[this.backgroundMessageGroup1]: (datos) => this._updateContainerDetail(datos),
			[this.backgroundMessageGroup2]: (datos) => this._updateReceiptDetail(datos),
			[this.backgroundMessageGroup3]: (datos) => this.updateCapacityCJ(datos),
			datos_no_encontrados: (datos) => this._handleDataNotFound(datos),
		};

		this.selectorsId = {
			receiptId: "#DetailPaneHeaderReceiptId",
			parent: "#DetailPaneHeaderParent",
			receiptDate: "#DetailPaneHeaderReceiptDate",
			checkIn: "#DetailPaneHeaderCheckIn",
			userStamp: "#DetailPaneHeaderUserStamp",
			internalReceiptNum: "#DetailPaneHeaderInternalReceiptNum",
			trailerId: "#DetailPaneHeaderTrailerId",
			...this.seeMoreInformationSelector,
		};

		this.group1ExternalPanelElements = {
			parent: null,
			receiptDate: null,
			checkIn: null,
			userStamp: null,
		};

		this.group2ExternalPanelElements = {
			trailerId: null,
		};

		this.externalPanelElements = {
			...this.group1ExternalPanelElements,
			...this.group2ExternalPanelElements,
		};

		this.internalPanelElements = {
			receiptId: null,
			internalReceiptNum: null,
		};

		this.internalPanelValue = {
			internalReceiptNumber: null,
			internalRecContNumber: null,
		};

		this.panelElements = {
			...this.internalPanelElements,
			...this.externalPanelElements,
			seeMoreInformation: null,
		};

		this.internalData = {
			receiptId: "[aria-describedby='ListPaneDataGrid_RECEIPT_ID']",
			internalReceiptNumber: "[aria-describedby='ListPaneDataGrid_INTERNAL_RECEIPT_NUM']",
			internalRecContNumber: "[aria-describedby='ListPaneDataGrid_INTERNAL_REC_CONT_NUM']",
		};
	}

	_initializeInternalPanelElements() {
		return {
			receiptId: document.querySelector(this.selectorsId.receiptId),
			internalReceiptNum: document.querySelector(this.selectorsId.internalReceiptNum),
		};
	}

	_initializeExternalPanelElements() {
		return {
			parent: document.querySelector(this.selectorsId.parent),
			receiptDate: document.querySelector(this.selectorsId.receiptDate),
			checkIn: document.querySelector(this.selectorsId.checkIn),
			userStamp: document.querySelector(this.selectorsId.userStamp),
			trailerId: document.querySelector(this.selectorsId.trailerId),
			capacityCJ: document.querySelector(this.selectorsId.capacityCJ),
		};
	}

	async _cleanDetailPanel() {
		super._cleanDetailPanel();

		this.internalPanelValue.internalReceiptNumber = "";
		this.internalPanelValue.internalRecContNumber = "";
	}

	_extraerDatosDeTr(tr) {
		if (!tr) return;

		const receiptId = this._extractAndTrim(tr.querySelector(this.internalData.receiptId));
		const internalReceiptNumber = this._extractAndTrim(tr.querySelector(this.internalData.internalReceiptNumber));
		const internalRecContNumber = this._extractAndTrim(tr.querySelector(this.internalData.internalRecContNumber));

		const insert = [
			{ element: this.panelElements.receiptId, value: receiptId },
			{ element: this.panelElements.internalReceiptNum, value: internalReceiptNumber },
		];

		// Llamar a insertarInfo con los datos extraídos
		this._insertInfo({
			insert,
			internalReceiptNumber,
			internalRecContNumber,
		});
	}

	_insertInfo({ insert = [], internalReceiptNumber, internalRecContNumber }) {
		// LLAMA A _cleanDetailPanel EN super._insertInfo
		super._insertInfo({ insert });
		this.initializeCapacityCJText();

		const { trailerId } = this.panelElements;

		if (trailerId) {
			trailerId.classList.remove("disabled");
			trailerId.classList.remove("show-info");
			trailerId.innerHTML = "Trailer Id...";
		}

		this.internalPanelValue.internalReceiptNumber = internalReceiptNumber;
		this.internalPanelValue.internalRecContNumber = internalRecContNumber;
	}

	_getDataFromContainerDetail() {
		const { internalRecContNumber } = this.internalPanelValue;

		if (internalRecContNumber) {
			this._waitFordata(this.group1ExternalPanelElements);

			const url = `https://wms.fantasiasmiguel.com.mx/scale/details/receiptcontainer/${internalRecContNumber}?active=active`;

			this._sendBackgroundMessage(url);
		} else {
			ToastAlert.showAlertFullTop(
				"No se encontró la columna [Internal Container Number], por favor active la columna."
			);
			console.log("No se encontró el Internal Container Number");
		}
	}

	_getDataFromReceiptDetail() {
		const { internalReceiptNumber } = this.internalPanelValue;

		if (internalReceiptNumber) {
			this._waitFordata(this.group2ExternalPanelElements);

			const url = `https://wms.fantasiasmiguel.com.mx/scale/details/receipt/${internalReceiptNumber}?active=active`;

			this._sendBackgroundMessage(url);
		} else {
			ToastAlert.showAlertFullTop("No se encontró la Columna [Internal Receipt Number], por favor active la columna.");
			console.log("No se encontró el Internal Receipt Number");
		}
	}

	_getDataExternal() {
		try {
			this.setIsCancelGetDataExternal(false);

			this._getDataFromContainerDetail();
		} catch (error) {
			console.error("Error al obtener datos externos:", error);
		}
	}

	_setEventTrailerId() {
		try {
			const { trailerId } = this.panelElements;

			if (trailerId) {
				trailerId.addEventListener("click", () => {
					trailerId.classList.add("disabled");

					this.setIsCancelGetDataExternal(false);
					this._getDataFromReceiptDetail();
				});
			}
		} catch (error) {
			console.error("Error al establecer evento de Trailer ID:", error);
		}
	}

	_initializeDataExternal() {
		this._listeningToBackgroundMessages();
		this._setEventSeeMore();
		this._setEventTrailerId();
		this.setClickEventCapacityCJ();
	}

	_updateContainerDetail(datos) {
		// console.log(datos);
		const { parent, receiptDate, userStamp, checkIn } = datos;
		// Obtener elementos del DOM
		const elementsToUpdate = [
			{ element: this.externalPanelElements.parent, value: parent },
			{ element: this.externalPanelElements.receiptDate, value: receiptDate },
			{ element: this.externalPanelElements.userStamp, value: userStamp },
			{ element: this.externalPanelElements.checkIn, value: `Check In: ${checkIn}` },
		];

		this._setDataExternal(elementsToUpdate);
	}

	_updateReceiptDetail(datos) {
		const { trailerId } = datos;
		const { trailerId: trailerIdElement } = this.externalPanelElements;

		// Obtener elementos del DOM
		if (trailerIdElement) {
			trailerIdElement.innerHTML = `${trailerId}`;
			trailerIdElement.classList.remove("wait");
			trailerIdElement.classList.remove("disabled");
			trailerIdElement.classList.add("show-info");
		}
	}

	_handleDataNotFound(datos = {}) {
		const { header } = datos;
		if (!header) {
			console.error("[Header] recibido de datos vacíos");
			return;
		}

		super._handleDataNotFound(datos);

		// Trailer Id
		if (header === "Receipt Detail") {
			const { trailerId } = this.externalPanelElements;
			trailerId.innerHTML = "No encontrado";
			trailerId.classList.remove("wait");
			trailerId.classList.remove("disabled");
			trailerId.classList.add("show-info");
		}
	}
}
