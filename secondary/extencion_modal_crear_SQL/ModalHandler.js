class ModalHandler {
  constructor(modal) {
    if (!modal) {
      throw new Error('No se encontró el modal para abrir');
    }

    this.modal = modal;
    this.selectors = {
      internalContainerNum: "td[aria-describedby='ListPaneDataGrid_INTERNAL_CONTAINER_NUM']",
      containerId: "td[aria-describedby='ListPaneDataGrid_CONTAINER_ID']",
      tbody: '#ListPaneDataGrid > tbody',
      internalContainerNumElement: 'internal-container-id-num',
      internalParentContainerNumElement: 'internal-parent-container-id-num',
      internalContainerNumbersElement: 'numbers-internals-containers',
      containerIdElement: 'container-id',
      parentContainerIdElement: 'parent-container-id',
    };
    this.internalData = {
      internalNumContainerId: '',
      internalNumParentContainerId: [],
      LP: '',
      internalsNumbers: [],
    };
    this.internalContainerNumElement = null;
    this.internalParentContainerNumElement = null;
    this.internalContainerNumbersElement = null;
    this.containerIdElement = null;
    this.parentContainerIdElement = null;
  }

  async handleOpenModal() {
    try {
      await this.verifyValidTable();
      await this.processInternalTableData();
      await this.setElementValues();
      await this.openModal();
    } catch (error) {
      console.error(`Error en handleOpenModal: ${error.message}`);
    }
  }

  async verifyValidTable() {
    return new Promise((resolve, reject) => {
      const containers_ids = Array.from(
        document.querySelectorAll(
          "#ListPaneDataGrid > tbody > tr > td[aria-describedby='ListPaneDataGrid_CONTAINER_ID']"
        )
      );

      if (containers_ids.length === 0) {
        ToastAlert.showAlert('No Hay filas en la tabla');
        reject({ message: 'No Hay filas en la tabla' });
      } else {
        const containersFound = containers_ids.map(td => td.textContent.trim()).filter(Boolean);

        if (containersFound.length > 1 || !containersFound.length) {
          ToastAlert.showAlert('No se encontro un formato valido en la tabla');
          reject({ message: 'No Se encontro un formato valido en la tabla' });
        }

        resolve();
      }
    });
  }

  /**
   * Initializes the variables by selecting DOM elements.
   * Throws an error if any element is not found.
   */
  async initialVariables() {
    // Select elements
    this.internalContainerNumElement = document.getElementById(
      this.selectors.internalContainerNumElement
    );
    this.internalParentContainerNumElement = document.getElementById(
      this.selectors.internalParentContainerNumElement
    );
    this.internalContainerNumbersElement = document.getElementById(
      this.selectors.internalContainerNumbersElement
    );
    this.containerIdElement = document.getElementById(this.selectors.containerIdElement);
    this.parentContainerIdElement = document.getElementById(
      this.selectors.parentContainerIdElement
    );

    // Check if all elements are selected
    await this.verifyAllElement();
  }

  async verifyAllElement() {
    if (
      !this.internalContainerNumElement ||
      !this.internalParentContainerNumElement ||
      !this.internalContainerNumbersElement ||
      !this.containerIdElement ||
      !this.parentContainerIdElement
    ) {
      throw new Error('No se encontraron los elementos para inicializar los variables');
    }
  }

  async openModal() {
    this.modal.style.display = 'block';
  }

  async processInternalTableData() {
    const tbody = document.querySelector('#ListPaneDataGrid > tbody');
    if (!tbody) {
      throw new Error('No se encontró <tbody>');
    }

    const rows = Array.from(tbody.querySelectorAll('tr'));
    await this.setInternalData(rows);
  }

  async cleanInternalData() {
    this.internalData.internalNumContainerId = '';
    this.internalData.internalNumParentContainerId.length = 0;
    this.internalData.internalsNumbers.length = 0;
    this.internalData.LP = '';
  }

  async setInternalData(rows) {
    const { internalContainerNum, containerId } = this.selectors;

    if (rows.length === 0) {
      throw new Error('No se encontraron filas en el <tbody>');
    }

    await this.cleanInternalData();

    rows.forEach(row => {
      const internalContainerNumElement = row.querySelector(internalContainerNum);
      const containerIdElement = row.querySelector(containerId);

      if (internalContainerNumElement && containerIdElement) {
        const containerIdText = containerIdElement.textContent.trim();
        const internalNumText = internalContainerNumElement.textContent.trim();

        if (containerIdText && internalNumText) {
          this.internalData.internalNumContainerId = internalNumText;
          this.internalData.internalsNumbers.push(internalNumText);
        } else if (!containerIdText && internalNumText) {
          this.internalData.internalNumParentContainerId.push(internalNumText);
          this.internalData.internalsNumbers.push(internalNumText);
        }
      }
    });
  }

  async setElementValues() {
    await this.verifyAllElement();

    this.internalContainerNumElement.textContent = `'${this.internalData.internalNumContainerId}'`;
    this.internalParentContainerNumElement.textContent =
      this.internalData.internalNumParentContainerId.map(i => `'${i}'`).join(', ');
    this.internalContainerNumbersElement.textContent = this.internalData.internalsNumbers
      .map(i => `'${i}'`)
      .join(', ');
  }
}

// const modalHandler = new ModalHandler(modalElement);
