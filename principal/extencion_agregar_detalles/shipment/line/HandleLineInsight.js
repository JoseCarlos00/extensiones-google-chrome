class HandleLineInsight extends HandlePanelDetailDataExternal {
  constructor() {
    super();
    this.backgroundMessage = 'actualizar_datos_de_shipment_detail';

    this.selectorsId = {
      shipmentId: '#DetailPaneHeaderShiptmenID',
      internalShipmentNum: '#DetailPaneHeaderInternalShipmetNum',
      internalShipmentLineNum: '#DetailPaneHeaderInternalShipmetLineNum',
      status1: '#DetailPaneHeaderStatus1',
      status1Num: '#DetailPaneHeaderStatus1Number',
      trailing: '#DetailPaneHeaderTraingSts',
      trailingNum: '#DetailPaneHeaderTrailingStsNumber',
      leading: '#DetailPaneHeaderLeadingSts',
      leadingNum: '#DetailPaneHeaderLeadingStsNumber',
      customer: '#DetailPaneHeaderCustomer',
      waveNumber: '#DetailPaneHeaderWaveNumber',
      dateCreate: '#DetailPaneHeaderDateCreate',
      ...this.seeMoreInformationSelector,
    };

    this.externalPanelElements = {
      waveNumber: null,
      dateCreate: null,
    };

    this.internalPanelElements = {
      shipmentId: null,
      internalShipmentNum: null,
      internalShipmentLineNum: null,
      status1: null,
      status1Num: null,
      trailing: null,
      trailingNum: null,
      leading: null,
      leadingNum: null,
      customer: null,
    };

    this.panelElements = {
      ...this.internalPanelElements,
      ...this.externalPanelElements,
      seeMoreInformation: null,
    };

    this.internalData = {
      shipmentId: "[aria-describedby='ListPaneDataGrid_SHIPMENT_ID']",
      internalShipmentNum: "[aria-describedby='ListPaneDataGrid_INTERNAL_SHIPMENT_NUM']",
      internalShipmentLineNum: "[aria-describedby='ListPaneDataGrid_INTERNAL_SHIPMENT_LINE_NUM']",
      status1: "[aria-describedby='ListPaneDataGrid_STATUS1']",
      status1Num: "[aria-describedby='ListPaneDataGrid_STATUS1NUMERIC']",
      trailing: "[aria-describedby='ListPaneDataGrid_TRAILING_STS']",
      trailingNum: "[aria-describedby='ListPaneDataGrid_SHIPMENT_TRAILING_STS']",
      leading: "[aria-describedby='ListPaneDataGrid_LEADING_STS']",
      leadingNum: "[aria-describedby='ListPaneDataGrid_SHIPMENT_LEADING_STS']",
    };
  }

  _initializeInternalPanelElements() {
    return {
      shipmentId: document.querySelector(this.selectorsId.shipmentId),
      internalShipmentNum: document.querySelector(this.selectorsId.internalShipmentNum),
      internalShipmentLineNum: document.querySelector(this.selectorsId.internalShipmentLineNum),
      status1: document.querySelector(this.selectorsId.status1),
      status1Num: document.querySelector(this.selectorsId.status1Num),
      trailing: document.querySelector(this.selectorsId.trailing),
      trailingNum: document.querySelector(this.selectorsId.trailingNum),
      leading: document.querySelector(this.selectorsId.leading),
      leadingNum: document.querySelector(this.selectorsId.leadingNum),
      customer: document.querySelector(this.selectorsId.customer),
    };
  }

  _initializeExternalPanelElements() {
    return {
      waveNumber: document.querySelector(this.selectorsId.waveNumber),
      dateCreate: document.querySelector(this.selectorsId.dateCreate),
    };
  }

  _extraerDatosDeTr(tr) {
    if (!tr) return;

    const shipmentId = this._extractAndTrim(tr.querySelector(this.internalData.shipmentId));
    const internalShipmentNum = this._extractAndTrim(
      tr.querySelector(this.internalData.internalShipmentNum)
    );
    const internalShipmentLineNum = this._extractAndTrim(
      tr.querySelector(this.internalData.internalShipmentLineNum)
    );
    const status1 = this._extractAndTrim(tr.querySelector(this.internalData.status1));
    const status1Num = this._extractAndTrim(tr.querySelector(this.internalData.status1Num));
    const trailing = this._extractAndTrim(tr.querySelector(this.internalData.trailing));
    const trailingNum = this._extractAndTrim(tr.querySelector(this.internalData.trailingNum));
    const leading = this._extractAndTrim(tr.querySelector(this.internalData.leading));
    const leadingNum = this._extractAndTrim(tr.querySelector(this.internalData.leadingNum));

    const insert = [
      { element: this.internalPanelElements.shipmentId, value: shipmentId },
      { element: this.internalPanelElements.internalShipmentNum, value: internalShipmentNum },
      {
        element: this.internalPanelElements.internalShipmentLineNum,
        value: internalShipmentLineNum,
      },
      { element: this.internalPanelElements.status1, value: status1 },
      { element: this.internalPanelElements.status1Num, value: status1Num },
      { element: this.internalPanelElements.trailing, value: trailing },
      { element: this.internalPanelElements.trailingNum, value: trailingNum },
      { element: this.internalPanelElements.leading, value: leading },
      { element: this.internalPanelElements.leadingNum, value: leadingNum },
    ];

    // Llamar a insertarInfo con los datos extraídos
    this._insertInfo({
      insert,
      shipmentId,
    });
  }

  _insertInfo({ insert = [], shipmentId }) {
    super._insertInfo({ insert });

    // Insertar tienda si hay un ID de envío
    this._insertarTienda(shipmentId);
  }

  _getDataExternal() {
    try {
      const { internalShipmentNum } = this.internalPanelElements;

      if (internalShipmentNum) {
        this._waitFordata();
        this.setIsCancelGetDataExternal(false);

        const url = `https://wms.fantasiasmiguel.com.mx/scale/details/shipment/${internalShipmentNum.textContent.trim()}?active=active`;
        this._sendBackgroundMessage(url);
      } else {
        ToastAlert.showAlertFullTop(
          'No se encontró la Columna [Internal shipment Number], por favor active la columna.'
        );
        console.log('No se encontró el Internal shipment Number');
      }
    } catch (error) {
      console.error('Error al obtener datos externos:', error);
    }
  }

  _updateDetailsPanelInfo(datos) {
    try {
      const { date, internalShipmentNumber, waveNumber } = datos;

      const elementsToUpdate = [
        { element: this.externalPanelElements.dateCreate, value: date },
        { element: this.externalPanelElements.waveNumber, value: `Wave: ${waveNumber}` },
      ];

      if (
        this.internalPanelElements.internalShipmentNum.textContent.trim() === internalShipmentNumber
      ) {
        this._setDataExternal(elementsToUpdate);
      }
    } catch (error) {
      console.error('Error al actualizar detalles del panel:', error);
    }
  }
}
