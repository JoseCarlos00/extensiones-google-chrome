class ManangerPanelDetail {
  constructor({ panelDetail, elementsHtmlToInsert = [], handlePanelDetail }) {
    this.tbody = document.querySelector('#ListPaneDataGrid > tbody');
    this.panelDetail = panelDetail;
    this.elementsToInsert = elementsHtmlToInsert;

    this.handlePanelDetail = handlePanelDetail;

    this.lastSelectedId = null;
    // this.pedirMasDetalles = false;
    // this.isColumnExist = false;
  }

  async initialize() {
    try {
      if (!this.tbody) {
        throw new Error('Table body element not found');
      }

      if (!this.panelDetail) {
        throw new Error('Panel detail element not found');
      }

      if (!this.handlePanelDetail) {
        throw new Error('HandlePanelDetail element not found');
      }

      await this.#insertElementsHtml();
      await this.#initializePanelElements();
      this.#setEventsListeners();
      this.#observation();
    } catch (error) {
      console.error(`Error: Ha ocurrido un error al inicializar ManangerDetail: ${error}`);
    }
  }

  async #initializePanelElements() {
    await this.handlePanelDetail._initializePanelElements();
  }

  #extraerDatosDeTr(tr) {
    this.handlePanelDetail._extraerDatosDeTr(tr);
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
          this.lastSelectedId = trDataId;
        }
        this.#extraerDatosDeTr(tr);
      }
    });

    // Escuchar el evento de teclado en el <tbody>
    this.tbody.addEventListener('keydown', e => {
      const { key } = e;

      if (key === 'ArrowUp' || key === 'ArrowDown') {
        const tr = this.tbody.querySelector('tr[aria-selected="true"]');
        tr && this.#extraerDatosDeTr(tr);
      }
    });
  }

  #observation() {
    // Función que se ejecutará cuando ocurra una mutación en el DOM
    const handleMutation = mutationsList => {
      if (mutationsList[0]) {
        const trSelected = mutationsList[0].target.querySelector('tr[aria-selected="true"]');
        trSelected && this.#extraerDatosDeTr(trSelected);
      }
    };

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
}
