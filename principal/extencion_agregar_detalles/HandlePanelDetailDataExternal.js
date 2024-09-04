class HandlePanelDetailDataExternal extends HandlePanelDetail {
  constructor() {
    super();
    this.externalPanelElements = {};
    this.internalPanelElements = {};
    this.isCancelGetDataExternal = false;
  }

  setIsCancelGetDataExternal(value = true) {
    this.isCancelGetDataExternal = value;
  }

  _initializeInternalPanelElements() {
    return {};
  }

  _initializeExternalPanelElements() {
    return {};
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

  _insertInfo({ insert = [] }) {
    super._insertInfo({ insert });
    const { seeMoreInformation } = this.panelElements;

    if (seeMoreInformation) {
      seeMoreInformation.classList.remove('disabled');
      seeMoreInformation.innerHTML = 'Ver mas info...';
    }
  }

  _waitFordata() {
    const text = '1346-863-28886...';

    for (const key in this.externalPanelElements) {
      const element = this.externalPanelElements[key];

      if (element) {
        element.innerHTML = text;
        element.classList.add('wait');
      }
    }
  }

  _removeClassWait() {
    const text = 'No encontrado';
    for (const key in this.externalPanelElements) {
      const element = this.externalPanelElements[key];

      if (element) {
        element.innerHTML = text;
        element.classList.remove('wait');
      }
    }
  }

  _updateDetailsPanelInfo(datos) {
    // Actualizar la interfaz con los datos recibidos
  }

  _listeningToBackgroundMessages() {
    // Escuchar los mensajes enviados desde el script de fondo
    const { backgroundMessage } = this;

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === backgroundMessage) {
        // Actualizar la interfaz de usuario con los datos recibidos
        if (this.isCancelGetDataExternal) {
          return;
        }

        const datos = message.datos;
        this._updateDetailsPanelInfo(datos);
      } else if (message.action === 'datos_no_encontrados') {
        const errorMessage = message.datos;
        console.log('No encotrado:', errorMessage);
        this._removeClassWait();
      }
    });
  }

  _getDataExternal() {
    // Obtener los datos de la API externa
  }

  _setEventSeeMore() {
    const { seeMoreInformation } = this.panelElements;
    // Agregar evento al botón "Ver más"
    if (!seeMoreInformation) {
      console.warn('No se encontró el botón "Ver más"');
      return;
    }

    seeMoreInformation.addEventListener('click', e => {
      seeMoreInformation.classList.add('disabled');
      this._getDataExternal();
    });
  }

  _initializeDataExternal() {
    this._listeningToBackgroundMessages();
    this._setEventSeeMore();
  }

  async _initializeHandlePanelDetail() {
    try {
      await this._initializePanelElements();
      this._initializeDataExternal();
    } catch (error) {
      console.error('Error: ha ocurrido un error al inizicailar HandleInventory:', error);
    }
  }
}
