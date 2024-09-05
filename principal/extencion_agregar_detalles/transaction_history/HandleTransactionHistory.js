class HandlePanelDetailTransactionHistory extends HandlePanelDetail {
  constructor() {
    super();
    this.selectorsId = {
      workUnit: '#DetailPaneHeaderWorkUnit',
      containerId: '#DetailPaneHeaderContainerId',
      userName: '#DetailPaneHeaderUserStamp',
      customer: '#DetailPaneHeaderCustomer',
    };

    this.panelElements = {
      workUnit: null,
      containerId: null,
      userName: null,
      customer: null,
    };

    this.internalData = {
      workUnit: "[aria-describedby='ListPaneDataGrid_WorkUnit']",
      containerId: "[aria-describedby='ListPaneDataGrid_ContainerId']",
      userName: "[aria-describedby='ListPaneDataGrid_UserName']",
      referenceId: "[aria-describedby='ListPaneDataGrid_ReferenceId']",
    };
  }

  _initializePanelElements() {
    return new Promise((resolve, reject) => {
      const elements = {
        workUnit: document.querySelector(this.selectorsId.workUnit),
        containerId: document.querySelector(this.selectorsId.containerId),
        userName: document.querySelector(this.selectorsId.userName),
        customer: document.querySelector(this.selectorsId.customer),
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
    const workUnitElement = tr.querySelector(this.internalData.workUnit);
    const containerIdElement = tr.querySelector(this.internalData.containerId);
    const userNameElement = tr.querySelector(this.internalData.userName);
    const referenceIdElement = tr.querySelector(this.internalData.referenceId);

    const workUnit = workUnitElement ? workUnitElement.textContent.trim() : '';
    const containerId = containerIdElement ? containerIdElement.textContent.trim() : '';
    const userName = userNameElement ? userNameElement.textContent.trim() : '';
    const referenceId = referenceIdElement ? referenceIdElement.textContent.trim() : '';

    const insert = [
      { element: this.panelElements.workUnit, value: workUnit },
      { element: this.panelElements.containerId, value: containerId },
      { element: this.panelElements.userName, value: userName },
    ];

    // Llamar a insertarInfo con los datos extraídos
    this._insertInfo({
      insert,
      referenceId,
    });
  }

  _insertInfo({ insert = [], referenceId }) {
    super._insertInfo({ insert });

    // Insertar tienda si hay un ID de envío
    this._insertarTienda(referenceId);
  }
}