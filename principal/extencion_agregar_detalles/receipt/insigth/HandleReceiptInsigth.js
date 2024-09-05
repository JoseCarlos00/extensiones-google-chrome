class HandleReceiptInsigth extends HandlePanelDetail {
  constructor() {
    super();
    this.selectorsId = {
      TrailingSts: '#DetailPaneHeaderTrailingStatusNumeric',
      LeadingSts: '#DetailPaneHeaderLeadingStatusNumeric',
      InternalNumber: '#DetailPaneHeaderInternalReceiptNumber',
      TrailerId: '#DetailPaneHeaderTrailerId',
    };

    this.panelElements = {
      TrailingSts: null,
      LeadingSts: null,
      InternalNumber: null,
      TrailerId: null,
    };

    this.internalData = {
      TrailingSts: "[aria-describedby='ListPaneDataGrid_TRAILINGSTS']",
      LeadingSts: "[aria-describedby='ListPaneDataGrid_LEADINGSTS']",
      InternalNumber: "[aria-describedby='ListPaneDataGrid_INTERNAL_RECEIPT_NUM']",
      TrailerId: "[aria-describedby='ListPaneDataGrid_TRAILER_ID']",
    };
  }

  _initializePanelElements() {
    return new Promise((resolve, reject) => {
      const elements = {
        TrailingSts: document.querySelector(this.selectorsId.TrailingSts),
        LeadingSts: document.querySelector(this.selectorsId.LeadingSts),
        InternalNumber: document.querySelector(this.selectorsId.InternalNumber),
        TrailerId: document.querySelector(this.selectorsId.TrailerId),
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
    const trailingStsElement = tr.querySelector(this.internalData.TrailingSts);
    const leadingStsElement = tr.querySelector(this.internalData.LeadingSts);
    const internalNumElement = tr.querySelector(this.internalData.InternalNumber);
    const trailerIdElement = tr.querySelector(this.internalData.TrailerId);

    const trailingSts = trailingStsElement ? trailingStsElement.textContent.trim() : '';
    const leadingSts = leadingStsElement ? leadingStsElement.textContent.trim() : '';
    const internalReceiptNum = internalNumElement ? internalNumElement.textContent.trim() : '';
    const trailerId = trailerIdElement ? trailerIdElement.textContent.trim() : '—';

    const insert = [
      { element: this.panelElements.TrailingSts, value: trailingSts },
      { element: this.panelElements.LeadingSts, value: leadingSts },
      { element: this.panelElements.InternalNumber, value: internalReceiptNum },
      { element: this.panelElements.TrailerId, value: trailerId },
    ];

    // Llamar a insertarInfo con los datos extraídos
    this._insertInfo({
      insert,
    });
  }
}
