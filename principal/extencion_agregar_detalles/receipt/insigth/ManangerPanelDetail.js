class ManangerPanelDetailReceiptInsigth extends ManangerPanelDetail {
  constructor(parameters) {
    super(parameters);
  }

  _insertElementsHtml() {
    return new Promise((resolve, reject) => {
      if (this.elementsToInsert.length === 0) {
        reject('No se Encontraron elementos a insertar');
      }

      const [trailingStatusNumeric, leadingStatusNumeric, internalReceiptNumber, trailerId] =
        this.elementsToInsert;

      if (this.panelDetail.children[2]) {
        this._insertElement({
          insert: this.panelDetail.children[2],
          element: trailingStatusNumeric.element,
          position: 'afterend',
        });
      }

      if (this.panelDetail.children[4]) {
        this._insertElement({
          insert: this.panelDetail.children[4],
          element: leadingStatusNumeric.element,
          position: 'afterend',
        });
      }

      this._insertElement({ insert: this.panelDetail, element: internalReceiptNumber.element });
      this._insertElement({ insert: this.panelDetail, element: trailerId.element });

      setTimeout(resolve, 50);
    });
  }
}
