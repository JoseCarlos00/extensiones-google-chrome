class HandlePanelDetailWorkInsight extends HandlePanelDetailDataExternal {
  constructor() {
    super();
    this.backgroundMessage = 'actualizar_datos_de_workinstruction_detail';

    this.selectorsId = {
      referenceId: '#DetailPaneHeaderReferenceId',
      assignedUser: '#DetailPaneHeaderAssignedUser',
      internalNum: '#DetailPaneHeaderInternalInstructionNum',
      completedByUser: '#DetailPaneHeaderCompleteByUser',
      waveNumber: '#DetailPaneHeaderWaveNumber',
      customer: '#DetailPaneHeaderCustomer',
      fromZone: '#DetailPaneHeaderFromZone',
      toZone: '#DetailPaneHeaderToZone',
      ...this.seeMoreInformationSelector,
    };

    this.externalPanelElements = {
      fromZone: null,
      toZone: null,
    };

    this.internalPanelElements = {
      referenceId: null,
      assignedUser: null,
      internalNum: null,
      completedByUser: null,
      waveNumber: null,
      customer: null,
    };

    this.panelElements = {
      ...this.internalPanelElements,
      ...this.externalPanelElements,
      seeMoreInformation: null,
    };

    this.internalData = {
      internal: "[aria-describedby='ListPaneDataGrid_SHIPPING_LOAD_NUM']",
      referenceId: "[aria-describedby='ListPaneDataGrid_REFERENCE_ID']",
      assignedUser: "[aria-describedby='ListPaneDataGrid_USER_ASSIGNED']",
      waveNumber: "[aria-describedby='ListPaneDataGrid_LAUNCH_NUM']",
      internalNum: "[aria-describedby='ListPaneDataGrid_INTERNAL_INSTRUCTION_NUM']",
      completedByUser: "[aria-describedby='ListPaneDataGrid_COMPLETED_BY_USER']",
    };
  }

  _initializeInternalPanelElements() {
    return {
      referenceId: document.querySelector(this.selectorsId.referenceId),
      assignedUser: document.querySelector(this.selectorsId.assignedUser),
      internalNum: document.querySelector(this.selectorsId.internalNum),
      completedByUser: document.querySelector(this.selectorsId.completedByUser),
      waveNumber: document.querySelector(this.selectorsId.waveNumber),
      customer: document.querySelector(this.selectorsId.customer),
    };
  }

  _initializeExternalPanelElements() {
    return {
      fromZone: document.querySelector(this.selectorsId.fromZone),
      toZone: document.querySelector(this.selectorsId.toZone),
    };
  }

  _extraerDatosDeTr(tr) {
    if (!tr) return;

    // Uso de la función auxiliar para extraer y limpiar valores
    const referenceId = this._extractAndTrim(tr.querySelector(this.internalData.referenceId));
    const assignedUser = this._extractAndTrim(
      tr.querySelector(this.internalData.assignedUser),
      '—'
    );
    const waveNumber = this._extractAndTrim(tr.querySelector(this.internalData.waveNumber));
    const internalNum = this._extractAndTrim(tr.querySelector(this.internalData.internalNum));
    const completedByUser = this._extractAndTrim(
      tr.querySelector(this.internalData.completedByUser),
      '—'
    );

    const insert = [
      { element: this.internalPanelElements.referenceId, value: referenceId },
      { element: this.internalPanelElements.assignedUser, value: assignedUser },
      { element: this.internalPanelElements.waveNumber, value: waveNumber },
      { element: this.internalPanelElements.internalNum, value: internalNum },
      { element: this.internalPanelElements.completedByUser, value: completedByUser },
    ];

    // Llamar a insertarInfo con los datos extraídos
    this._insertInfo({
      insert,
      tiendaNum: referenceId,
    });
  }

  _insertInfo({ insert = [], tiendaNum }) {
    super._insertInfo({ insert });

    // Insertar tienda si hay un ID de envío
    this._insertarTienda(tiendaNum);
  }

  _getDataExternal() {
    try {
      const { internalNum: internalElement } = this.internalPanelElements;

      const internalNumber = internalElement ? String(internalElement.textContent.trim()) : '';
      if (!internalElement) {
        ToastAlert.showAlertMinTop(`Internal Instruction Number No Valido: [${internalNumber}]`);
        return;
      }

      if (loadNumberElement) {
        this._waitFordata();
        this.setIsCancelGetDataExternal(false);

        const url = `https://wms.fantasiasmiguel.com.mx/scale/details/workinstruction/${internalNumber}?active=active`;
        this._sendBackgroundMessage(url);
      } else {
        ToastAlert.showAlertFullTop(
          'No se encontró la Columna [Internal Instruction Number], por favor active la columna.'
        );
        console.log('No se encontró el Internal Instruction Number');
      }
    } catch (error) {
      console.error('Error al obtener datos externos:', error);
    }
  }

  _updateDetailsPanelInfo(datos) {
    const { fromZone, toZone } = datos;

    const elementsToUpdate = [
      { element: this.externalPanelElements.fromZone, value: `${fromZone}` },
      { element: this.externalPanelElements.toZone, value: `${toZone}` },
    ];

    this._setDataExternal(elementsToUpdate);
  }
}
