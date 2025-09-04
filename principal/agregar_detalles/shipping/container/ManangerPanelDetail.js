class ManangerPanelDetailShippingContainer extends ManangerPanelDetail {
  constructor(parameters) {
    super(parameters);
  }

  _insertElementsHtml() {
    return new Promise((resolve, reject) => {
      if (this.elementsToInsert.length === 0) {
        reject('No se Encontraron elementos a insertar');
        return;
      }

      const [status1Numeric, parentContainerId, ...rest] = this.elementsToInsert;
      const status1 = this.panelDetail.querySelector('#ScreenControlLabel36547');
      const contanerId = this.panelDetail.querySelector('#ScreenControlHyperlink36546');

      if (status1) {
        this._insertElement({
          insert: status1,
          element: status1Numeric.element,
          position: 'afterend',
        });
      }

      if (contanerId) {
        this._insertElement({
          insert: contanerId,
          element: parentContainerId.element,
          position: 'afterend',
        });
      }

      if (rest.length > 0) {
        rest.forEach(({ element, position }) => {
          this._insertElement({ insert: this.panelDetail, element, position });
        });
      }

      setTimeout(resolve, 50);
    });
  }
}
