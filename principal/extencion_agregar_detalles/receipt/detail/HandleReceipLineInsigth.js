class HandleReceipLineInsigth extends HandlePanelDetail {
  constructor() {
    super();
    this.selectorsId = {
      receiptId: '#DetailPaneHeaderReceiptId',
      internalReceiptNumber: '#DetailPaneHeaderInternalReceiptNumber',
    };

    this.panelElements = {
      receiptId: null,
      internalReceiptNumber: null,
    };

    this.internalData = {
      receiptId: "[aria-describedby='ListPaneDataGrid_RECEIPT_ID']",
      internalReceiptNumber: "[aria-describedby='ListPaneDataGrid_INTERNAL_RECEIPT_NUM']",
    };
  }

  _initializePanelElements() {
    return new Promise((resolve, reject) => {
      const elements = {
        receiptId: document.querySelector(this.selectorsId.receiptId),
        internalReceiptNumber: document.querySelector(this.selectorsId.internalReceiptNumber),
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
    const receiptIdElement = tr.querySelector(this.internalData.receiptId);
    const internalNumbElement = tr.querySelector(this.internalData.internalReceiptNumber);

    const receiptId = receiptIdElement ? receiptIdElement.textContent.trim() : '';
    const internalReceiptNumber = internalNumbElement ? internalNumbElement.textContent.trim() : '';

    const insert = [
      { element: this.panelElements.receiptId, value: receiptId },
      { element: this.panelElements.internalReceiptNumber, value: internalReceiptNumber },
    ];

    // Llamar a insertarInfo con los datos extraídos
    this._insertInfo({
      insert,
    });
  }
}
