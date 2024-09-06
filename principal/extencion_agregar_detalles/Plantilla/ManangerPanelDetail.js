class ManangerPanelDetailShiptmentInsight extends ManangerPanelDetail {
  constructor(parameters) {
    super(parameters);
  }

  _insertElementsHtml() {
    return new Promise((resolve, reject) => {
      if (this.elementsToInsert.length === 0) {
        reject('No se Encontraron elementos a insertar');
      }

      const [trailingStatusNumeric, leadingStatusNumeric, ...rest] = this.elementsToInsert;
      const trailingElment = this.panelDetail.querySelector('#ScreenControlLabel38608');
      const leadingElement = this.panelDetail.querySelector('#ScreenControlLabel38609');

      if (trailingElment) {
        this._insertElement({
          insert: trailingElment,
          element: trailingStatusNumeric.element,
          position: 'afterend',
        });
      }

      if (leadingElement) {
        this._insertElement({
          insert: leadingElement,
          element: leadingStatusNumeric.element,
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
