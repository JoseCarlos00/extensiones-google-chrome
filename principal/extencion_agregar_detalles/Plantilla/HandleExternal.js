class HandlePanelDetailNAME extends HandlePanelDetailDataExternal {
  constructor() {
    super();
    this.backgroundMessage = 'NAME';

    this.selectorsId = {
      internal: '#idInternal',
      external: '#idExternal',
      ...this.seeMoreInformationSelector,
    };

    this.externalPanelElements = {
      external: null,
    };

    this.internalPanelElements = {
      internal: null,
    };

    this.panelElements = {
      ...this.internalPanelElements,
      ...this.externalPanelElements,
      seeMoreInformation: null,
    };

    this.internalData = {
      internal: "[aria-describedby='ListPaneDataGrid_SHIPPING_LOAD_NUM']",
    };
  }

  _initializeInternalPanelElements() {
    return {
      internal: document.querySelector(this.selectorsId.internal),
    };
  }

  _initializeExternalPanelElements() {
    return {
      external: document.querySelector(this.selectorsId.external),
    };
  }

  _extraerDatosDeTr(tr) {
    if (!tr) return;

    // Uso de la función auxiliar para extraer y limpiar valores
    const internalData = this._extractAndTrim(tr.querySelector(this.internalData.internal));

    const insert = [{ element: this.internalPanelElements.internal, value: internalData }];

    // Llamar a insertarInfo con los datos extraídos
    this._insertInfo({
      insert,
    });
  }

  _getDataExternal() {
    try {
      const { internal: internalElement } = this.internalPanelElements;

      const internalNumber = internalElement ? String(internalElement.textContent.trim()) : '';

      if (loadNumberElement) {
        this._waitFordata();
        this.setIsCancelGetDataExternal(false);

        const url = `https://wms.fantasiasmiguel.com.mx/scale/details/shippingload/${internalNumber}?active=active`;
        this._sendBackgroundMessage(url);
      } else {
        ToastAlert.showAlertFullTop(
          'No se encontró la Columna [NAME], por favor active la columna.'
        );
        console.log('No se encontró el NAME');
      }
    } catch (error) {
      console.error('Error al obtener datos externos:', error);
    }
  }

  _updateDetailsPanelInfo(datos) {
    const { dataExternal } = datos;

    const elementsToUpdate = [
      { element: this.externalPanelElements.external, value: `${dataExternal}` },
    ];

    this._setDataExternal(elementsToUpdate);
  }
}