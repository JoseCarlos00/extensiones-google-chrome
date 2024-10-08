class HandlePanelDetailInventory extends HandlePanelDetailDataExternal {
  constructor() {
    super();
    this.backgroundMessage = 'actualizar_datos_de_inventory_detail';

    this.selectorsId = {
      internalLocationInv: '#DetailPaneHeaderinternalLocationInv',
      logisticsUnit: '#DetailPaneHeaderlogisticsUnit',
      parentLogisticsUnit: '#DetailPaneHeaderParentLogisticsUnit',
      receiptDateTime: '#DetailPaneHeaderReceiptDateTime',
      userStamp: '#DetailPaneHeaderUserStamp',
      dateTimeStamp: '#DetailPaneHeaderDateTimeStamp',
      allocation: '#DetailPaneHeaderAllocation',
      locating: '#DetailPaneHeaderLocating',
      workZone: '#DetailPaneHeaderWorkZone',
      attribute1: '#DetailPaneHeaderAttribute1',
      ...this.seeMoreInformationSelector,
    };

    this.externalPanelElements = {
      userStamp: null,
      dateTimeStamp: null,
      allocation: null,
      locating: null,
      workZone: null,
      attribute1: null,
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
    return {
      userStamp: document.querySelector(this.selectorsId.userStamp),
      dateTimeStamp: document.querySelector(this.selectorsId.dateTimeStamp),
      allocation: document.querySelector(this.selectorsId.allocation),
      locating: document.querySelector(this.selectorsId.locating),
      workZone: document.querySelector(this.selectorsId.workZone),
      attribute1: document.querySelector(this.selectorsId.attribute1),
    };
  }

  _extraerDatosDeTr(tr) {
    if (!tr) return;

    const internalLocationInv = this._extractAndTrim(
      tr.querySelector(this.internalData.internalLocationInv)
    );
    const logisticsUnit = this._extractAndTrim(tr.querySelector(this.internalData.logisticsUnit));
    const parentLogisticsUnit = this._extractAndTrim(
      tr.querySelector(this.internalData.parentLogistics)
    );

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

  _getDataExternal() {
    try {
      const { internalLocationInv: internalLocationInvElement, seeMoreInformation } =
        this.panelElements;

      const internalNumberText = internalLocationInvElement
        ? internalLocationInvElement.textContent.trim()
        : '';

      if (internalNumberText === '-1' || internalNumberText === '0') {
        ToastAlert.showAlertMinTop(`Internal Location Inv Invalido: [${internalNumberText}]`);
        return;
      }

      if (internalNumberText) {
        this._waitFordata();
        this.setIsCancelGetDataExternal(false);

        const url = `https://wms.fantasiasmiguel.com.mx/scale/trans/inventory?InternalLocationInv=${internalNumberText}&active=active`;
        this._sendBackgroundMessage(url);
      } else {
        ToastAlert.showAlertFullTop(
          'No se encontró la columna [Internal Location Inv], por favor active la columna.'
        );
        console.error('No se encontró el Internal Location Inv');
        if (seeMoreInformation) seeMoreInformation.classList.remove('disabled'); // Reactivar el botón
      }
    } catch (error) {
      console.error('Error al obtener datos externos:', error);
    }
  }

  _updateDetailsPanelInfo(datos) {
    const {
      receivedDateTime,
      attribute1,
      allocation,
      locating,
      workZone,
      userStamp,
      dateTimeStamp,
    } = datos;

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
}
