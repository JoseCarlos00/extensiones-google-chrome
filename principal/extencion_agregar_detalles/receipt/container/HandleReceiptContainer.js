class HandleReceiptContainer extends HandlePanelDetailDataExternal {
  constructor() {
    super();

    this.selectorsId = {
      receiptId: '#DetailPaneHeaderReceiptId',
      parent: '#DetailPaneHeaderParent',
      receiptDate: '#DetailPaneHeaderReceiptDate',
      checkIn: '#DetailPaneHeaderCheckIn',
      userStamp: '#DetailPaneHeaderUserStamp',
      trailerId: '#DetailPaneHeaderTrailerId',
      ...this.seeMoreInformationSelector,
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
    };
  }

  _initializeExternalPanelElements() {
    return {
      parent: document.querySelector(this.selectorsId.parent),
      receiptDate: document.querySelector(this.selectorsId.receiptDate),
      checkIn: document.querySelector(this.selectorsId.checkIn),
      userStamp: document.querySelector(this.selectorsId.userStamp),
      trailerId: document.querySelector(this.selectorsId.trailerId),
    };
  }

  async _cleanDetailPanel() {
    for (const key in this.panelElements) {
      const element = this.panelElements[key];

      if (element) {
        element.innerHTML = '';
        element.classList.remove('wait');
      }
    }

    this.internalPanelValue.internalReceiptNumber = '';
    this.internalPanelValue.internalRecContNumber = '';
  }

  _extraerDatosDeTr(tr) {
    if (!tr) return;

    const receiptIdElement = tr.querySelector(this.internalData.receiptId);
    const receiptId = receiptIdElement ? receiptIdElement.textContent.trim() : '';

    const internalNum = tr.querySelector(this.internalData.internalReceiptNumber);
    const internalNumValue = internalNum?.textContent.trim() ?? '';

    const internalConNum = tr.querySelector(this.internalData.internalRecContNumber);
    const internalConNumValue = internalConNum?.textContent.trim() ?? '';

    const insert = [{ element: this.panelElements.receiptId, value: receiptId }];

    // Llamar a insertarInfo con los datos extraídos
    this._insertInfo({
      insert,
      internalNumValue,
      internalConNumValue,
    });
  }

  _insertInfo({ insert = [], internalNumValue, internalConNumValue }) {
    super._insertInfo({ insert });
    const { trailerId } = this.panelElements;

    if (trailerId) {
      trailerId.classList.remove('disabled');
      trailerId.style.pointerEvents = 'auto';
      trailerId.innerHTML = 'Trailer Id...';
    }

    this.internalPanelValue.internalReceiptNumber = internalNumValue;
    this.internalPanelValue.internalRecContNumber = internalConNumValue;
  }

  _waitFordata(value) {
    const text = '1346-863-28886...';

    if (value === 'trailerId') {
      const { trailerId } = this.externalPanelElements;
      trailerId.classList.add('wait');
      return;
    }

    const sinTrailerId = Object.fromEntries(
      Object.entries(this.externalPanelElements).filter(([key, value]) => key !== 'trailerId')
    );

    for (const key in sinTrailerId) {
      const element = sinTrailerId[key];

      if (element) {
        element.innerHTML = text;
        element.classList.add('wait');
      }
    }
  }

  _getDataFromContainerDetail() {
    const { internalRecContNumber } = this.internalPanelValue;

    if (internalRecContNumber) {
      this._waitFordata('detail');
      const receipt = internalRecContNumber + '?active=active';

      chrome.runtime.sendMessage(
        {
          action: 'some_action',
          url: `https://wms.fantasiasmiguel.com.mx/scale/details/receiptcontainer/${receipt}`,
        },
        response => {
          console.log('Respuesta de background.js:', response.status);
        }
      );
    } else {
      ToastAlert.showAlertFullTop(
        'No se encontró la columna [Internal Container Number], por favor active la columna.'
      );
      console.log('No se encontró el Internal Container Number');
    }
  }

  _getDataFromReceiptDetail() {
    const { internalReceiptNumber } = this.internalPanelValue;

    if (internalReceiptNumber) {
      this._waitFordata('trailerId');
      const receipt = internalReceiptNumber + '?active=active';

      chrome.runtime.sendMessage(
        {
          action: 'some_action',
          url: `https://wms.fantasiasmiguel.com.mx/scale/details/receipt/${receipt}`,
        },
        response => {
          console.log('Respuesta de background.js:', response.status);
        }
      );
    } else {
      ToastAlert.showAlertFullTop(
        'No se encontró la Columna [Internal Receipt Number], por favor active la columna.'
      );
      console.log('No se encontró el Internal Receipt Number');
    }
  }

  _getDataExternal(value) {
    this.setIsCancelGetDataExternal(false);

    if (value === 'trailerId') {
      this - this._getDataFromReceiptDetail();
      return;
    }

    this._getDataFromContainerDetail();
  }

  _setEventTrailerId() {
    const { trailerId } = this.panelElements;

    if (trailerId) {
      trailerId.addEventListener('click', () => {
        trailerId.classList.add('disabled');
        this._getDataExternal('trailerId');
      });
    }
  }

  _initializeDataExternal() {
    this._listeningToBackgroundMessages();
    this._setEventSeeMore();
    this._setEventTrailerId();
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
      trailerIdElement.classList.remove('wait');
      trailerIdElement.classList.remove('disabled');
      trailerIdElement.style.pointerEvents = 'none';
    }
  }

  _listeningToBackgroundMessages() {
    const messageMap = {
      actualizar_datos_de_receipt_container_detail: datos => this._updateContainerDetail(datos),
      actualizar_datos_de_receipt_detail: datos => this._updateReceiptDetail(datos),
      datos_no_encontrados: () => this._removeClassWait(),
    };

    chrome.runtime.onMessage.addListener(message => {
      if (this.isCancelGetDataExternal) {
        return;
      }

      if (messageMap[message.action]) {
        const datos = message.datos;
        messageMap[message.action](datos);
      } else {
        console.error('unknown background response message:', message.action);
      }
    });
  }
}
