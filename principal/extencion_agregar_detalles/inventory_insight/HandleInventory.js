class HandlePanelDetailInventory extends HandlePanelDetail {
  constructor() {
    super();
    this.backgroundMessage = 'actualizar_datos_de_inventory_detai';

    this.selectorsId = {
      internalLocationInv: '#DetailPaneHeaderinternalLocationInv',
      logisticsUnit: '#DetailPaneHeaderlogisticsUnit',
      parentLogisticsUnit: '#DetailPaneHeaderParentLogisticsUnit',
      receiptDateTime: '#DetailPaneHeaderReceiptDateTime',
      userStamp: '#DetailPaneHeaderUserStamp',
      dateTimeStamp: '#DetailPaneHeaderDateTimeStamp',
      allocation: '#DetailPaneHeaderAllocation',
      locating: '#DetailPaneHeaderLocating',
      workZone: '#DetailPaneHeaderWorkZone',
      attribute1: '#DetailPaneHeaderAttribute1',
      seeMoreInformation: '#seeMoreInformation',
    };

    this.externalPanelElements = {
      userStamp: null,
      dateTimeStamp: null,
      allocation: null,
      locating: null,
      workZone: null,
      attribute1: null,
    };

    this.internalPanelElements = {
      internalLocationInv: null,
      logisticsUnit: null,
      parentLogisticsUnit: null,
    };

    this.panelElements = {
      ...this.internalPanelElements,
      ...this.externalPanelElements,
      seeMoreInformation: null,
    };

    this.internalData = {
      internalLocationInv: "[aria-describedby='ListPaneDataGrid_INTERNAL_LOCATION_INV']",
      logisticsUnit: "[aria-describedby='ListPaneDataGrid_LOGISTICS_UNIT']",
      parentLogisticsUnit: "[aria-describedby='ListPaneDataGrid_PARENT_LOGISTICS_UNIT']",
    };

    this._listeningToBackgroundMessages();
  }

  _initializeInternalPanelElements() {
    return {
      internalLocationInv: document.querySelector(this.selectorsId.internalLocationInv),
      logisticsUnit: document.querySelector(this.selectorsId.logisticsUnit),
      parentLogisticsUnit: document.querySelector(this.selectorsId.parentLogisticsUnit),
    };
  }

  _initializeExternalPanelElements() {
    return {
      userStamp: document.querySelector(this.selectorsId.userStamp),
      dateTimeStamp: document.querySelector(this.selectorsId.dateTimeStamp),
      allocation: document.querySelector(this.selectorsId.allocation),
      locating: document.querySelector(this.selectorsId.locating),
      workZone: document.querySelector(this.selectorsId.workZone),
      attribute1: document.querySelector(this.selectorsId.attribute1),
    };
  }

  _initializePanelElements() {
    return new Promise((resolve, reject) => {
      const internalElements = this._initializeInternalPanelElements();
      const externalElements = this._initializeExternalPanelElements();

      // Combina todos los elementos
      const allElements = {
        ...internalElements,
        ...externalElements,
        seeMoreInformation: document.querySelector(this.selectorsId.seeMoreInformation),
      };

      const missingOptions = Object.entries(allElements)
        .filter(([key, value]) => !value)
        .map(([key]) => key);

      if (missingOptions.length > 0) {
        reject(
          `No se encontraron los elementos necesarios para inicializar HandlePanelDetail: [${missingOptions.join(
            ', '
          )}]`
        );
      }

      // Asigna los elementos validados a sus respectivos objetos
      this.internalPanelElements = internalElements;
      this.externalPanelElements = externalElements;
      this.panelElements = allElements;

      setTimeout(resolve, 50);
    });
  }

  _extraerDatosDeTr(tr) {
    if (!tr) return;

    const internalNumElement = tr.querySelector(this.internalData.internalLocationInv);
    const logisticsUnitElement = tr.querySelector(this.internalData.logisticsUnit);
    const ParentLPElement = tr.querySelector(this.internalData.parentLogisticsUnit);

    const internalLocationInv = internalNumElement ? internalNumElement.innerText : '';
    const logisticsUnit = logisticsUnitElement ? logisticsUnitElement.innerText : '';
    const parentLogisticsUnit = ParentLPElement ? ParentLPElement.innerText : '';

    const insert = [
      { element: this.panelElements.internalLocationInv, value: internalLocationInv },
      { element: this.panelElements.logisticsUnit, value: logisticsUnit },
      { element: this.panelElements.parentLogisticsUnit, value: parentLogisticsUnit },
    ];

    // Llamar a insertarInfo con los datos extraídos
    this._insertarInfo({
      insert,
    });
  }

  _insertarInfo({ insert = [] }) {
    super._insertarInfo({ insert });
    const { seeMoreInformation } = this.panelElements;

    if (seeMoreInformation) {
      seeMoreInformation.innerHTML = 'Ver mas info...';

      // Elimina cualquier event listener previo
      seeMoreInformation.removeEventListener('click', this._handleSeeMoreInformationClick);

      // Define la función manejadora por separado
      this._handleSeeMoreInformationClick = () => this._solicitarDatosExternos();

      // Agrega el event listener una vez
      seeMoreInformation.addEventListener('click', this._handleSeeMoreInformationClick, {
        once: true,
      });
    }
  }

  _solicitarDatosExternos() {
    const { internalLocationInv: internalLocationInvElement, seeMoreInformation } =
      this.panelElements;

    // Deshabilitar temporalmente el botón para evitar múltiples llamadas
    if (seeMoreInformation) seeMoreInformation.disabled = true;

    if (internalLocationInvElement) {
      const internalNumberText = internalLocationInvElement.textContent.trim();

      if (internalNumberText === '-1' || internalNumberText === '0') {
        alert(`Internal Number: ${internalNumberText}`);
        if (seeMoreInformation) seeMoreInformation.disabled = false; // Reactivar el botón
        return;
      }

      this._waitFordata();

      const internalLocationInv = internalNumberText + '&active=active';

      chrome.runtime.sendMessage(
        {
          action: 'some_action',
          url: `https://wms.fantasiasmiguel.com.mx/scale/trans/inventory?InternalLocationInv=${internalLocationInv}`,
        },
        response => {
          console.log('Respuesta de background.js:', response.status);
          if (seeMoreInformation) seeMoreInformation.disabled = false; // Reactivar el botón
        }
      );
    } else {
      alert('No se encontró el Internal Location Inv, por favor active la columna.');
      console.log('No se encontró el Internal Location Inv');
      if (seeMoreInformation) seeMoreInformation.disabled = false; // Reactivar el botón
    }
  }

  _actualizarInterfaz(datos) {
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
      { element: this.panelElements.dateTimeStamp, value: dateTimeStamp },
      { element: this.panelElements.allocation, value: allocation },
      { element: this.panelElements.locating, value: locating },
      { element: this.panelElements.workZone, value: workZone },
      { element: this.panelElements.attribute1, value: attribute1 },
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
