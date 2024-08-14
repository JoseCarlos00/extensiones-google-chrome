function inicio() {
  console.log('[Packing JS]');

  const buttonNewPack = document.querySelector('#PackingActionStart');

  if (!buttonNewPack) return;

  const selector = '#packingdetailkoGrid > tbody';

  // buttonNewPack.addEventListener('click', contentProcess);

  // window.addEventListener('keydown', function (event) {
  //   if (event.key === 'Enter') {
  //     contentProcess(selector);
  //   }
  // });

  function contentProcess() {
    waitForElement(selector)
      .then(elementFound => {
        console.log(' found:', elementFound);
        tbodyProces(elementFound);
        // observacion(elementFound);
        setEventRefresh();
      })
      .catch(error => {
        console.error(error.message);
      });
  }

  window.addEventListener('click', function (e) {
    const element = e.target;
    const nodeName = e.target.nodeName;

    if (nodeName === 'INPUT') {
      element.select();
    }
  });
}

function setEventRefresh() {
  const btnRefresh = document.querySelector('#PackingActionRefresh');

  if (!btnRefresh) return;

  btnRefresh.addEventListener('click', () => {
    const selector = '#packingdetailkoGrid > tbody';

    waitForElement(selector)
      .then(elementFound => {
        console.log(' found:', elementFound);
        tbodyProces(elementFound);
      })
      .catch(error => {
        console.error(error.message);
      });
  });
}

function waitForElement(selector, maxTime = 8000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    function checkElement() {
      const element = document.querySelector(selector);
      console.log('checkElement INNER:', element?.innerHTML);
      if (element) {
        resolve(element);
      } else if (Date.now() - startTime >= maxTime) {
        reject(new Error(`Element with selector "${selector}" not found within ${maxTime}ms`));
      } else {
        requestAnimationFrame(checkElement);
      }
    }

    checkElement();
  });
}

function observacion(tbody) {
  console.log('[Observacion]');
  // Función que se ejecutará cuando ocurra una mutación en el DOM
  function handleMutation(mutationsList, observer) {
    // Realiza acciones en respuesta a la mutación
    console.log('Se ha detectado una mutación en el DOM');

    console.log('[mutationsList]:', mutationsList);

    // if (mutationsList[0]) {
    //   const trSelected = mutationsList[0].target.querySelector('tr[aria-selected="true"]') ?? null;
    //   if (trSelected) extraerDatosDeTr(trSelected);
    // }
  }

  // Configuración del observer
  const observerConfig = {
    attributes: false, // Observar cambios en atributos
    childList: true, // Observar cambios en la lista de hijos
    subtree: false, // Observar cambios en los descendientes de los nodos objetivo
  };

  // Crea una instancia de MutationObserver con la función de callback
  const observer = new MutationObserver(handleMutation);

  // Inicia la observación del nodo objetivo y su configuración
  observer.observe(tbody, observerConfig);
}

function tbodyProces(tbodyElement) {
  console.log('[tbodyProces] INNER:', tbodyElement?.innerHTML);

  if (!tbodyElement) return;

  const rows = Array.from(tbodyElement.getElementsByTagName('tr'));
  const columnIndexToModify = 2; // [item] Índice de la columna que deseas modificar (0-based)

  if (!rows) return;

  rows.forEach(row => {
    const cells = row.getElementsByTagName('td');

    if (cells[columnIndexToModify]) {
      const cellContent = cells[columnIndexToModify].textContent;
      console.log('cellContent:', cellContent);

      // console.log('[cells[columnIndexToModify]', insertInput(cellContent));
      cells[columnIndexToModify].innerHTML = insertInput(cellContent);

      // console.log('cells[columnIndexToModify].innerHTML:', cells[columnIndexToModify].innerHTML);
    }
  });
}

function insertInput(textContent) {
  return (input = `<input value="${textContent}" readonly class="input-text">`);
}

window.addEventListener('load', inicio, { once: true });
