class ManangerPanelDetailReceiptInsight extends ManangerPanelDetail {
  constructor(parameters) {
    super(parameters);
  }

  _insertElementsHtml() {
    return new Promise((resolve, reject) => {
      if (this.elementsToInsert.length === 0) {
        reject('No se Encontraron elementos a insertar');
      }

      const [trailingStsNum, leadingStsNum, ...rest] = this.elementsToInsert;

      const trailingElment = this.panelDetail.querySelector('#ScreenControlLabel36193');
      const leadingElement = this.panelDetail.querySelector('#ScreenControlLabel36194');

      if (trailingElment) {
        this._insertElement({
          insert: trailingElment,
          element: trailingStsNum.element,
          position: 'afterend',
        });
      }

      if (leadingElement) {
        this._insertElement({
          insert: leadingElement,
          element: leadingStsNum.element,
          position: 'afterend',
        });
      }

      if (rest.length > 0) {
        rest.forEach(({ element }) => {
          this._insertElement({ insert: this.panelDetail, element });
        });
      }

      setTimeout(resolve, 50);
    });
  }
}
