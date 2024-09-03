class ManangerPanelDetail {
  constructor({ panelDetail, elementsHtmlToInsert = [] }) {
    this.tbody = document.querySelector('#ListPaneDataGrid > tbody');
    this.panelDetail = panelDetail;
    this.elementsToInsert = elementsHtmlToInsert;

    this.panelElements = {};

    this.lastSelectedId = null;
    // this.pedirMasDetalles = false;
    // this.isColumnExist = false;
    this.tiendas = {
      3407: 'Tol-Centro',
      3409: 'Tol-Metepec',
      417: 'Mex-Grande',
      418: 'Mex-Chica',
      444: 'Mex-Adornos',
      1171: 'Mex-Mylin',
      357: 'Mex-Mayoreo',
      350: 'Mex-Lomas',
      351: 'Mex-Satelite',
      352: 'Mex-Coapa',
      353: 'Mex-Tlalne',
      356: 'Mex-Polanco',
      358: 'Internet',
      360: 'Mex-Valle',
      361: 'Mex-Coacalco',
      363: 'Mex-Santa Fe',
      414: 'Mex-Xochimilco',
      415: 'Mex-Interlomas',
      3401: 'Mex-Coyoacan',
      3404: 'Mex-Pedregal',
      4342: 'Ags-Aguascalientes',
      4559: 'BCN-Carrousel',
      4797: 'BCN-Mexicali',
      4757: 'BCN-Tijuana',
      4799: 'Coa-Saltillo',
      4753: 'Coa-Torreon',
      4756: 'Dur-Durango',
      3400: 'Gto-Leon',
      359: 'Jal-Centro',
      4348: 'Jal-Gdl Palomar',
      4345: 'Jal-Gdl Patria',
      354: 'Jal-Zapopan',
      355: 'Mty-Centro',
      3405: 'Mty-Citadel',
      3406: 'Mty-GarzaSada',
      362: 'Mty-SanJeronimo',
      3403: 'Pue-Puebla',
      4798: 'QRO-Arboledas',
      3402: 'Que-Queretaro',
      4570: 'Roo-Cancun',
      4755: 'Sin-Culiacan',
      3408: 'SLP-SanLuis',
      4574: 'Son-Hermosillo',
      4573: 'Ver-Veracruz',
      4346: 'Yuc-Campestre',
      364: 'Yuc-Merida',
      4344: 'ME-Maestros',
    };
  }

  async initialize() {
    try {
      if (!this.tbody) {
        throw new Error('Table body element not found');
      }

      if (!this.panelDetail) {
        throw new Error('Panel detail element not found');
      }

      await this.#insertElementsHtml();
      await this._initializePanelElements();
      this.#setEventsListeners();
      this.#observation();
    } catch (error) {
      console.error(`Error: Ha ocurrido un error al inicializar ManangerDetail: ${error}`);
    }
  }

  async _initializePanelElements() {
    // Vacio
  }

  #insertElementsHtml() {
    return new Promise((resolve, reject) => {
      if (this.elementsToInsert.length === 0) {
        reject('No se Encontraron elementos a insertar');
      }

      this.elementsToInsert.forEach(element => {
        if (element instanceof Element) {
          this.panelDetail.appendChild(element);
        } else {
          console.warn('El elemento no es de tipo Html Element');
        }
      });

      setTimeout(resolve, 50);
    });
  }

  #setEventsListeners() {
    this.tbody.addEventListener('click', e => {
      const tr = e.target.closest('tr[data-id]');
      // console.log('e.target:', tr);

      if (tr) {
        const trDataId = tr.getAttribute('data-id');

        if (this.lastSelectedId !== trDataId) {
          console.log('Nuevo elemento seleccionado:');
          this.lastSelectedId = trDataId;
        }
      }

      this._extraerDatosDeTr(tr);
    });

    // Escuchar el evento de teclado en todo el documento
    this.tbody.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowUp') {
        const trSelected = tbody.querySelector('tr[aria-selected="true"]');
        trSelected && extraerDatosDeTr(trSelected);
      }

      if (event.key === 'ArrowDown') {
        const trSelected = tbody.querySelector('tr[aria-selected="true"]');
        trSelected && extraerDatosDeTr(trSelected);
      }
    });
  }

  #observation() {
    // Función que se ejecutará cuando ocurra una mutación en el DOM
    function handleMutation(mutationsList, observer) {
      // Realiza acciones en respuesta a la mutación
      console.log('Se ha detectado una mutación en el DOM');

      if (mutationsList[0]) {
        const trSelected = mutationsList[0].target.querySelector('tr[aria-selected="true"]');
        if (trSelected) this._extraerDatosDeTr(trSelected);
      }
    }

    // Configuración del observer
    const observerConfig = {
      attributes: false, // Observar cambios en atributos
      childList: true, // Observar cambios en la lista de hijos
      subtree: false, // Observar cambios en los descendientes de los nodos objetivo
    };

    // Crea una instancia de MutationObserver con la función de callback
    const observer = new MutationObserver(handleMutation);

    // Inicia la observación del nodo objetivo y su configuración
    observer.observe(this.tbody, observerConfig);
  }

  async _limpiarPaneldeDetalles() {
    for (const key in this.panelElements) {
      const element = this.panelElements[key];

      element && (element.innerHTML = '');
    }
  }

  _extraerDatosDeTr(tr) {
    console.log('[extraerDatosDeTr]');
    if (!tr) return;
  }

  _insertarTienda(element, shipmentId) {
    const clave = shipmentId.trim().split('-')[0];

    if (tiendas.hasOwnProperty(clave)) {
      element.innerHTML = tiendas[clave];
    }
  }
}
