class ManangerPanelDetailReceiptDetail extends ManangerPanelDetail {
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

      const [htmlReceiptId, htmlInternalReceiptNumber] = this.elementsToInsert;

      this.#insertElement({
        insert: this.panelDetail,
        element: htmlReceiptId,
        position: 'afterbegin',
      });

      this.#insertElement({
        insert: this.panelDetail,
        element: htmlInternalReceiptNumber,
        position: 'beforeend',
      });

      setTimeout(resolve, 50);
    });
  }
}
