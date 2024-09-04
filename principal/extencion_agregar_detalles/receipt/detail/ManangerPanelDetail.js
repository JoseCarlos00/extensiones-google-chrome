class ManangerPanelDetailReceiptDetail extends ManangerPanelDetail {
  constructor(parameters) {
    super(parameters);
  }

  _insertElementsHtml() {
    return new Promise((resolve, reject) => {
      const [htmlReceiptId, htmlInternalReceiptNumber] = this.elementsToInsert;
      if (this.elementsToInsert.length === 0) {
        reject('No se Encontraron elementos a insertar');
      }

      if (htmlReceiptId instanceof Element) {
        this.panelDetail.insertAdjacentElement('afterbegin', htmlReceiptId);
      } else {
        console.warn('El elemento no es de tipo Html Element');
      }

      if (htmlInternalReceiptNumber instanceof Element) {
        this.panelDetail.insertAdjacentElement('beforeend', htmlInternalReceiptNumber);
      } else {
        console.warn('El elemento no es de tipo Html Element');
      }

      setTimeout(resolve, 50);
    });
  }
}
