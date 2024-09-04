class ManangerPanelDetailReceiptInsigth extends ManangerPanelDetail {
  constructor(parameters) {
    super(parameters);
  }

  #insertElement({ insert, element: elementToInsert, position = 'beforeend' }) {
    if (elementToInsert instanceof Element && elementToInsert) {
      insert.insertAdjacentElement(position, elementToInsert);
    } else {
      console.warn('El elemento no es de tipo Html Element');
    }
  }

  _insertElementsHtml() {
    return new Promise((resolve, reject) => {
      if (this.elementsToInsert.length === 0) {
        reject('No se Encontraron elementos a insertar');
      }

      const [
        htmlTrailingStatusNumeric,
        htmlLeadingStatusNumeric,
        htmlInternalReceiptNumber,
        htmlTrailerId,
      ] = this.elementsToInsert;

      if (this.panelDetail.children[2]) {
        this.#insertElement({
          insert: this.panelDetail.children[2],
          element: htmlTrailingStatusNumeric,
          position: 'afterend',
        });
      }

      if (this.panelDetail.children[4]) {
        this.#insertElement({
          insert: this.panelDetail.children[4],
          element: htmlLeadingStatusNumeric,
          position: 'afterend',
        });
      }

      this.#insertElement({
        insert: this.panelDetail,
        element: htmlInternalReceiptNumber,
        position: 'beforeend',
      });

      this.#insertElement({
        insert: this.panelDetail,
        element: htmlTrailerId,
        position: 'beforeend',
      });

      setTimeout(resolve, 50);
    });
  }
}
