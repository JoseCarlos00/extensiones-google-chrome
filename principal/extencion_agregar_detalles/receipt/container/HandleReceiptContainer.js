class HandleReceiptContainer extends HandlePanelDetailDataExternal {
  constructor() {
    super();
    this.backgroundMessage = 'actualizar_datos_de_receipt_container_detail';

    this.selectorsId = {
      receiptId: '#DetailPaneHeaderReceiptId',
      parent: '#DetailPaneHeaderParent',
      receiptDate: '#DetailPaneHeaderReceiptDate',
      checkIn: '#DetailPaneHeaderCheckIn',
      userStamp: '#DetailPaneHeaderUserStamp',
      trailerId: '#DetailPaneHeaderTrailerId',
      seeMoreInformation: '#seeMoreInformation',
    };

    this.externalPanelElements = {
      parent: null,
      receiptDate: null,
      checkIn: null,
      userStamp: null,
      trailerId: null,
    };

    this.internalPanelElements = {
      receiptId: null,
    };

    this.panelElements = {
      ...this.internalPanelElements,
      ...this.externalPanelElements,
      seeMoreInformation: null,
    };

    this.internalData = {
      receiptId: "[aria-describedby='ListPaneDataGrid_RECEIPT_ID']",
    };
  }

  _initializeInternalPanelElements() {
    return {
      receiptId: document.querySelector(this.selectorsId.receiptId),
    };
  }

  _initializeExternalPanelElements() {
    return {
      parent: document.querySelector(this.selectorsId.parent),
      receiptDate: document.querySelector(this.selectorsId.receiptId),
      checkIn: document.querySelector(this.selectorsId.checkIn),
      userStamp: document.querySelector(this.selectorsId.userStamp),
      trailerId: document.querySelector(this.selectorsId.trailerId),
    };
  }

  _extraerDatosDeTr(tr) {
    if (!tr) return;

    const receiptIdElement = tr.querySelector(this.internalData.receiptId);
    const receiptId = receiptIdElement ? receiptIdElement.textContent.trim() : '';

    const insert = [{ element: this.panelElements.receiptId, value: receiptId }];

    // Llamar a insertarInfo con los datos extraídos
    this._insertInfo({
      insert,
    });
  }

  _getDataExternal() {
    const { receiptId: internalLocationInvElement, seeMoreInformation } = this.panelElements;

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
    // Actualizar la interfaz con los datos recibidos
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
      { element: this.panelElements.receivedDateTime, value: receivedDateTime },
      { element: this.panelElements.userStamp, value: userStamp },
      { element: this.panelElements.parent, value: dateTimeStamp },
      { element: this.panelElements.receiptDate, value: allocation },
      { element: this.panelElements.checkIn, value: locating },
      { element: this.panelElements.workZone, value: workZone },
      { element: this.panelElements.trailerId, value: attribute1 },
    ];

    // Iterar sobre elementsToUpdate
    elementsToUpdate.forEach(({ element, value }) => {
      // Actualizar el valor del elemento
      if (element) {
        element.innerText = value;
        element.classList.remove('wait');
      }
    });
  }
}
