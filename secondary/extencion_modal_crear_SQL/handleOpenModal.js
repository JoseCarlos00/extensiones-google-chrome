// vaiables global

const dataToInsert = {
  internalNumContainerId: '',
  internalNumParentContainerId: [],
  LP: '',
  internalsNumbers: [],
};

async function handleOpenModal(modal) {
  try {
    if (!modal) {
      throw new Error('No se encontro el modal al abrr');
    }

    document.getElementById('$internalNumContainerId');
    document.getElementById('$internalNumParentContainerId');
    document.getElementById('$internalContainersNumbers');

    document.getElementById('$containerId');
    document.getElementById('$parentContainerContainerId');

    await getDataInternalTable();

    modal.style.display = 'block';

    console.log('Modal abierto');
  } catch (error) {
    console.error('Error al manejar OpenModal:', error);
  }

  async function getDataInternalTable() {
    const tbody = document.querySelector('#ListPaneDataGrid > tbody');

    if (!tbody) {
      throw new Error('No se elcontro <tbody>');
    }

    const rows = Array.from(tbody.querySelectorAll('tr'));
    await setValuesDataToInsert(rows);

    console.log('dataInsert [1]:', dataToInsert);
  }

  function setValuesDataToInsert(rows = []) {
    return new Promise(resolve => {
      if (!rows.length) {
        console.error('No se encontraron filas en el <tbody>');
        reject();
        return;
      }

      const internalData = {
        internalContainerNum: "td[aria-describedby='ListPaneDataGrid_INTERNAL_CONTAINER_NUM']",
        containerId: "td[aria-describedby='ListPaneDataGrid_CONTAINER_ID']",
      };

      rows.forEach(row => {
        const internalContainerNum = row.querySelector(internalData.internalContainerNum);
        const containerId = row.querySelector(internalData.containerId);

        if (internalContainerNum && containerId) {
          const containerIdText = containerId.textContent.trim();
          const internalNumText = internalContainerNum.textContent.trim();

          if (containerIdText && internalNumText) {
            console.log('Container_ID SQL:', internalNumText);
            dataToInsert.internalNumContainerId = internalNumText;
            dataToInsert.internalsNumbers.push(internalNumText);
          } else if (!containerIdText && internalNumText) {
            console.log('Parent_Container_ID SQL:', internalNumText);
            dataToInsert.internalNumParentContainerId.push(internalNumText);
            dataToInsert.internalsNumbers.push(internalNumText);
          }
        }
      });

      console.log('dataInsert [2]:', dataToInsert);
      resolve();
    });
  }
}
