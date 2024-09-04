class HandleReceiptInsigth extends HandlePanelDetail {
  constructor() {
    super();
    this.selectorsId = {
      customer: '#DetailPaneHeaderCustomer',
      shipTo: '#DetailPaneHeaderShipTo',
      internalShipmentNum: '#DetailPaneHeaderInternalShipmentNumber',
    };

    this.panelElements = {
      customer: null,
      shipTo: null,
      internalShipmentNum: null,
    };

    this.internalData = {
      customer: "[aria-describedby='ListPaneDataGrid_CUSTOMER']",
      shipTo: "[aria-describedby='ListPaneDataGrid_SHIP_TO']",
      internalShipmentNum: "[aria-describedby='ListPaneDataGrid_INTERNAL_SHIPMENT_NUM']",
    };
  }

  _initializePanelElements() {
    return new Promise((resolve, reject) => {
      const elements = {
        customer: document.querySelector(this.selectorsId.customer),
        shipTo: document.querySelector(this.selectorsId.shipTo),
        internalShipmentNum: document.querySelector(this.selectorsId.internalShipmentNum),
      };

      const missingOptions = Object.entries(elements)
        .filter(([key, value]) => !value)
        .map(([key]) => key);

      if (missingOptions.length > 0) {
        reject(
          `No se encontraron los elementos necesarios para inicializar el HandlePanelDetail: [${missingOptions.join(
            ', '
          )}]`
        );
      }

      // Asignar los elementos validados a `optionModal`
      this.panelElements = elements;
      setTimeout(resolve, 50);
    });
  }

  _extraerDatosDeTr(tr) {
    if (!tr) return;

    // Obtener elementos del DOM
    const customerElement = tr.querySelector(this.internalData.customer);
    const shipToElement = tr.querySelector(this.internalData.shipTo);
    const internalShipmentNumElement = tr.querySelector(this.internalData.internalShipmentNum);

    const customer = customerElement ? customerElement.textContent.trim() : '';
    const shipTo = shipToElement ? shipToElement.textContent.trim() : '';
    const internalShipmentNum = internalShipmentNumElement
      ? internalShipmentNumElement.textContent.trim()
      : '';

    const insert = [
      { element: this.panelElements.customer, value: customer },
      { element: this.panelElements.shipTo, value: shipTo },
      { element: this.panelElements.internalShipmentNum, value: internalShipmentNum },
    ];

    // Llamar a insertarInfo con los datos extraídos
    this._insertInfo({
      insert,
    });
  }
}
