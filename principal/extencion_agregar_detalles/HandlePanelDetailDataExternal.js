class HandlePanelDetailDataExternal extends HandlePanelDetail {
  constructor() {
    super();
    this.seeMoreInformationSelector = { seeMoreInformation: '#seeMoreInformation' };
    this.externalPanelElements = {};
    this.internalPanelElements = {};
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
    const { backgroundMessage = 'invalidate' } = this;

    const messageMap = {
      [backgroundMessage]: datos => this._updateDetailsPanelInfo(datos),
      datos_no_encontrados: () => this._removeClassWait(),
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

  _setDataExternal(elementsToUpdate = []) {
    if (elementsToUpdate.length === 0) {
      console.warn('[setDataExternal]: [elementsToUpdate] esta vacio');
      return;
    }

    // Iterar sobre elementsToUpdate
    elementsToUpdate.forEach(({ element, value }) => {
      // Actualizar el valor del elemento
      if (element) {
        element.innerText = value;
        element.classList.remove('wait');
      }
    });
  }

  _sendBackgroundMessage(urlParams) {
    chrome.runtime.sendMessage(
      {
        action: 'some_action',
        url: urlParams,
      },
      response => {
        console.log('Respuesta de background.js:', response.status);
      }
    );
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
