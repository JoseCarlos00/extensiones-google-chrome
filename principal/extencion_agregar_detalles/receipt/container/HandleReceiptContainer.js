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

    const receiptId = this._extractAndTrim(tr.querySelector(this.internalData.receiptId));
    const internalReceiptNumber = this._extractAndTrim(
      tr.querySelector(this.internalData.internalReceiptNumber)
    );
    const internalRecContNumber = this._extractAndTrim(
      tr.querySelector(this.internalData.internalRecContNumber)
    );

    const insert = [{ element: this.panelElements.receiptId, value: receiptId }];

    // Llamar a insertarInfo con los datos extraídos
    this._insertInfo({
      insert,
      internalReceiptNumber,
      internalRecContNumber,
    });
  }

  _insertInfo({ insert = [], internalReceiptNumber, internalRecContNumber }) {
    super._insertInfo({ insert });
    const { trailerId } = this.panelElements;

    if (trailerId) {
      trailerId.classList.remove('disabled');
      trailerId.style.pointerEvents = 'auto';
      trailerId.innerHTML = 'Trailer Id...';
    }

    this.internalPanelValue.internalReceiptNumber = internalReceiptNumber;
    this.internalPanelValue.internalRecContNumber = internalRecContNumber;
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

      const url = `https://wms.fantasiasmiguel.com.mx/scale/details/receiptcontainer/${internalRecContNumber}?active=active`;

      this._sendBackgroundMessage(url);
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

      const url = `https://wms.fantasiasmiguel.com.mx/scale/details/receipt/${internalReceiptNumber}?active=active`;

      this._sendBackgroundMessage(url);
    } else {
      ToastAlert.showAlertFullTop(
        'No se encontró la Columna [Internal Receipt Number], por favor active la columna.'
      );
      console.log('No se encontró el Internal Receipt Number');
    }
  }

  _getDataExternal(value) {
    try {
      this.setIsCancelGetDataExternal(false);

      if (value === 'trailerId') {
        this - this._getDataFromReceiptDetail();
        return;
      }

      this._getDataFromContainerDetail();
    } catch (error) {
      console.error('Error al obtener datos externos:', error);
    }
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

  _removeClassWait(elementsObj) {
    const text = 'No encontrado';
    for (const key in elementsObj) {
      const element = elementsObj[key];

      if (element) {
        element.innerHTML = text;
        element.classList.remove('wait');
      }
    }
  }

  _handleDataNotFound(datos) {
    const { header } = datos;

    const sinTrailerId = Object.fromEntries(
      Object.entries(this.externalPanelElements).filter(([key, value]) => key !== 'trailerId')
    );

    // Trailer Id
    if (header === 'Receipt Detail') {
      const { trailerId } = this.externalPanelElements;
      trailerId.innerHTML = 'No encontrado';
      trailerId.classList.remove('wait');
      trailerId.classList.remove('disabled');
      trailerIdElement.style.pointerEvents = 'none';
    } else if (header === 'Receipt Container Detail') {
      this._removeClassWait(sinTrailerId);
    }
  }

  _listeningToBackgroundMessages() {
    const messageMap = {
      actualizar_datos_de_receipt_container_detail: datos => this._updateContainerDetail(datos),
      actualizar_datos_de_receipt_detail: datos => this._updateReceiptDetail(datos),
      datos_no_encontrados: datos => this._handleDataNotFound(datos),
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
