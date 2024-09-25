export class PrintMananger {
  constructor() {
    this.table = document.getElementById('content');

    this.columnIndex = {
      status1: -1,
    };

    this.mapIndex = [{ key: 'status1', values: ['status 1'] }];

    this.init();
  }

  async init() {
    try {
      const response = await this.getTableFromParmas();
      await this.insertTableInDOM(response);
      await this.cleanThead();
      await this.setColumnIndex();
      await this.createCheckBox();

      setTimeout(() => window.print(), 500);
    } catch (error) {
      console.error(error);
    }
  }

  getTableFromParmas() {
    return new Promise((resolve, reject) => {
      const urlParams = new URLSearchParams(window.location.search);
      const thead = urlParams.get('thead');
      const tbody = urlParams.get('tbody');

      if (!thead) {
        reject('thead is empty');
        return;
      }

      if (!tbody) {
        reject('tbody is empty');
        return;
      }

      resolve({ thead, tbody });
    });
  }

  async insertTableInDOM({ thead, tbody }) {
    const { table } = this;

    if (!table) {
      console.error('No se encontro la <table> a insertar');
      return;
    }

    const theadElement = document.createElement('thead');
    const tbodyElement = document.createElement('tbody');

    theadElement.innerHTML = thead;
    tbodyElement.innerHTML = decodeURIComponent(tbody);

    table.insertAdjacentElement('beforeend', theadElement);
    table.insertAdjacentElement('beforeend', tbodyElement);
  }

  cleanThead() {
    return new Promise(resolve => {
      // Seleccionar el <thead> original y las filas <tr> dentro de él
      const originalThead = document.querySelector('#content > thead');
      const headers = originalThead.querySelectorAll('tr th');

      const rowOld = originalThead.querySelector('tr');

      if (!originalThead) {
        console.error('No se encontro el <thead> en la <table>');
        return;
      }

      if (headers.length === 0) {
        console.warn('No hay filas en el <tr>');
        resolve();
        return;
      }

      // Crear un nuevo elemento <tr>
      const rowNew = document.createElement('tr');

      headers.forEach(th => {
        const thNew = document.createElement('th');
        const thText = th.textContent.trim();

        thNew.textContent = thText;

        rowNew.appendChild(thNew);
      });

      // Reemplazar el <tr> antiguo con el nuevo
      originalThead.replaceChild(rowNew, rowOld);
      resolve();
    });
  }

  async createCheckBox() {}

  async setColumnIndex() {
    const { table } = this;

    if (!table) {
      console.error('No se encontró el elemento <table>');
      return;
    }

    const headerRow = table.rows[0] ? Array.from(table.rows[0].cells) : [];

    if (headerRow.length === 0) {
      console.error('No hay filas en Header Row');
      return;
    }

    // Reiniciar índices de columnas a -1
    Object.keys(this.columnIndex).forEach(key => {
      this.columnIndex[key] = -1;
    });

    // Buscar los índices de las columnas
    headerRow.forEach((th, index) => {
      const text = th.textContent.trim().toLowerCase();

      this.mapIndex.forEach(({ key, values }) => {
        if (values.includes(text)) {
          this.columnIndex[key] = index;
        }
      });
    });
  }
}
