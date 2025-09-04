class UiIggridIndicator {
  constructor() {
    this.indicator = null;
    this.elementSelected = null;
  }

  #validateElement(element) {
    if (!element) {
      throw new Error('El elemento proporcionado es nulo o indefinido.');
    }
  }

  setElementSelected(element) {
    this.#validateElement(element);
    this.elementSelected = element;
    this.#setContainerIndicator();
  }

  #setContainerIndicator() {
    if (!this.elementSelected) {
      throw new Error('No se ha seleccionado un elemento. Llama a setElementSelected primero.');
    }

    this.indicator = this.elementSelected.querySelector('.ui-iggrid-indicatorcontainer');
    if (!this.indicator) {
      throw new Error('No se encontró el contenedor del indicador en el elemento seleccionado.');
    }
  }

  #setContentIndicator(sortOrder) {
    if (!this.indicator) {
      throw new Error(
        'El contenedor del indicador no está definido. Llama a setContainerIndicator primero.'
      );
    }

    const sortOrderContent = {
      asc: '<span class="ui-iggrid-colindicator-asc ui-icon ui-icon-arrowthick-1-n"></span>',
      desc: '<span class="ui-iggrid-colindicator-desc ui-icon ui-icon-arrowthick-1-s"></span>',
    };

    const content = sortOrderContent[sortOrder];
    if (!content) {
      throw new Error(`El valor de sortOrder proporcionado (${sortOrder}) no es válido.`);
    }

    this.indicator.innerHTML = content;
  }

  #setAttributeTitle(sortOrder) {
    if (!this.elementSelected) {
      throw new Error('No se ha seleccionado un elemento. Llama a setElementSelected primero.');
    }

    const sortOrderTitles = {
      asc: 'ordenado ascendente',
      desc: 'ordenado descendente',
    };

    const title = sortOrderTitles[sortOrder];
    if (!title) {
      throw new Error(`El valor de sortOrder proporcionado (${sortOrder}) no es válido.`);
    }

    this.elementSelected.setAttribute('title', title);
  }

  showIndicator(sortOrder) {
    try {
      this.#setAttributeTitle(sortOrder);
      this.#setContentIndicator(sortOrder);
    } catch (error) {
      console.error(
        'Error: [showIndicator] Ha ocurrido un error al mostrar el indicador de ordenamiento:',
        error
      );
    }
  }

  static deleteAllIndicator() {
    const uiIndicators = Array.from(
      document.querySelectorAll(
        '#myModalShowTable #tableContent thead  th .ui-iggrid-indicatorcontainer span'
      )
    );

    if (uiIndicators.length === 0) {
      console.warn('No se encontraron elemento indicadores .ui-iggrid-indicatorcontainer span');
      return;
    }

    uiIndicators.forEach(item => {
      item.remove();
    });
  }
}
