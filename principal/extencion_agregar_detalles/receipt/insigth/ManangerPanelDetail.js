class ManangerPanelDetailReceiptInsigth extends ManangerPanelDetail {
  constructor(parameters) {
    super(parameters);
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
        this._insertElement({
          insert: this.panelDetail.children[2],
          element: htmlTrailingStatusNumeric,
          position: 'afterend',
        });
      }

      if (this.panelDetail.children[4]) {
        this._insertElement({
          insert: this.panelDetail.children[4],
          element: htmlLeadingStatusNumeric,
          position: 'afterend',
        });
      }

      this._insertElement({ insert: this.panelDetail, element: htmlInternalReceiptNumber });
      this._insertElement({ insert: this.panelDetail, element: htmlTrailerId });

      setTimeout(resolve, 50);
    });
  }
}
