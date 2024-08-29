class SearchStore {
  constructor({ liElement }) {
    this.liElement = liElement;
    this.searchInput = null;
    this.clearButton = null;
  }

  async initialize() {
    try {
      await this.#insertElemet();
      this.#initializeVariables();
      this.#addEventListeners();
    } catch (error) {
      console.error('Error: Ha ocurido un error al inicializar [Search Store]:', error);
    }
  }

  #insertElemet() {
    return new Promise((resolve, reject) => {
      const ul = document.querySelector('#topNavigationBar > nav > ul.nav.navbar-nav.navbar-right');

      if (!ul) {
        reject('No se enotro el elemento a insertar <ul>');
      }

      if (!(this.liElement instanceof Element)) {
        reject('El elemento a insertar no es un elemento HTML');
      }

      ul.insertAdjacentElement('afterbegin', this.liElement);
      setTimeout(resolve, 50);
    });
  }

  #initializeVariables() {
    this.searchInput = document.querySelector('#search_store_input');
    this.clearButton = document.querySelector('#search_store_clearButton');

    if (!this.searchInput) {
      throw new Error('Error: No se encontro el elemento #search_store_input');
    }

    if (!this.clearButton) {
      throw new Error('Error: No se encontro el elemento #search_store_clearButton');
    }
  }

  #addEventListeners() {
    window.addEventListener('keydown', e => {
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();

        this.searchInput.focus();
      }
    });

    this.clearButton.addEventListener('click', e => {
      e.preventDefault();
      this.searchInput.value = '';
    });
  }
}

window.addEventListener(
  'load',
  async () => {
    const liElement = await getLiContaier();

    const searchManager = new SearchStore({ liElement });
    searchManager.initialize();
  },
  { once: true }
);
