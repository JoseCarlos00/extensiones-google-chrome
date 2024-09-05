class HandleInsight extends HandlePanelDetailDataExternal {
  constructor() {
    super();
    this.backgroundMessage = 'actualizar_datos_de_load_detail';

    this.selectorsId = {
      loadNumber: '#DetailPaneHeaderLoadNumber',
      userDefineFile3: '#DetailPaneHeaderUserDefineFile3',
      internalShipmentNum: '#DetailPaneHeaderinternalShipmentNum',
      trailingNum: '#DetailPaneHeaderTrailingStsNumber',
      leadingNum: '#DetailPaneHeaderLeadingStsNumber',
      dockDoor: '#DetailPaneHeaderDockDoor',
      ...this.seeMoreInformationSelector,
    };

    this.externalPanelElements = {
      dockDoor: null,
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
    return {
      dockDoor: document.querySelector(this.selectorsId.dockDoor),
    };
  }

  _extraerDatosDeTr(tr) {
    if (!tr) return;

    // Uso de la función auxiliar para extraer y limpiar valores
    const loadNumber = this._extractAndTrim(tr.querySelector(this.internalData.loadNumber));
    const userDefineFile3 = this._extractAndTrim(
      tr.querySelector(this.internalData.userDefineFile3)
    );
    const internalShipmentNum = this._extractAndTrim(
      tr.querySelector(this.internalData.internalShipmentNum)
    );
    const trailingNum = this._extractAndTrim(tr.querySelector(this.internalData.trailingNum));
    const leadingNum = this._extractAndTrim(tr.querySelector(this.internalData.leadingNum));

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

  _getDataExternal() {
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

      const internalLocationInv = internalNumberText + '&active=active';

      chrome.runtime.sendMessage(
        {
          action: 'some_action',
          url: `https://wms.fantasiasmiguel.com.mx/scale/trans/inventory?InternalLocationInv=${internalLocationInv}`,
        },
        response => {
          console.log('Respuesta de background.js:', response.status);
        }
      );
    } else {
      ToastAlert.showAlertFullTop(
        'No se encontró la columna [Internal Location Inv], por favor active la columna.'
      );
      console.error('No se encontró el Internal Location Inv');
      if (seeMoreInformation) seeMoreInformation.classList.remove('disabled'); // Reactivar el botón
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
