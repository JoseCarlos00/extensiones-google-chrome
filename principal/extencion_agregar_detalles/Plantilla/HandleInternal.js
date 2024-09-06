class HandlePanelDetailNAME extends HandlePanelDetail {
  constructor() {
    super();
    this.selectorsId = {
      workUnit: '#DetailPaneHeaderWorkUnit',
    };

    this.panelElements = {
      workUnit: null,
    };

    this.internalData = {
      workUnit: "[aria-describedby='ListPaneDataGrid_WorkUnit']",
    };
  }

  _initializePanelElements() {
    return new Promise((resolve, reject) => {
      const elements = {
        workUnit: document.querySelector(this.selectorsId.workUnit),
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

    const workUnit = this._extractAndTrim(tr.querySelector(this.internalData.workUnit));

    const insert = [{ element: this.panelElements.workUnit, value: workUnit }];

    // Llamar a insertarInfo con los datos extraídos
    this._insertInfo({
      insert,
    });
  }
}
