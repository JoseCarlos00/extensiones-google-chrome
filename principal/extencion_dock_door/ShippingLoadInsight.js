const modalHTML = `
<section class="modal-container">
  <div id="myModal" class="modal">
    <div class="modal-content">

    <button type="button" aria-label="Close" data-balloon-pos="left" class="close">
      <svg aria-hidden="true" focusable="false" data-prefix="fad" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="fa-circle-xmark">
        <path fill="currentColor"
          d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
          class="fa-secondary"></path>
        <path fill="currentColor"
          d="M209 175c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47z"
          class="fa-primary"></path>
      </svg>
    </button>

     <table id="content">
    <thead>
      <tr>
        <th colspan="5" align="center">EMB</th>
        <th colspan="2" align="center">Otras</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>EMB-01</td>
        <td>EMB-16</td>
        <td>EMB-31</td>
        <td>EMB-46</td>
        <td>EMB-61</td>
        <td>AMZ-01</td>
        <td>MARIANO CLIENTES</td>
      </tr>
      <tr>
        <td>EMB-02</td>
        <td>EMB-17</td>
        <td>EMB-32</td>
        <td>EMB-47</td>
        <td>EMB-62</td>
        <td>AMZ-02</td>
        <td>MAY-01</td>
      </tr>
      <tr>
        <td>EMB-03</td>
        <td>EMB-18</td>
        <td>EMB-33</td>
        <td>EMB-48</td>
        <td>EMB-63</td>
        <td>DOCK-01</td>
        <td>MAY-02</td>
      </tr>
      <tr>
        <td>EMB-04</td>
        <td>EMB-19</td>
        <td>EMB-34</td>
        <td>EMB-49</td>
        <td>EMB-64</td>
        <td>DOCK-02</td>
        <td>ML-01</td>
      </tr>
      <tr>
        <td>EMB-05</td>
        <td>EMB-20</td>
        <td>EMB-35</td>
        <td>EMB-50</td>
        <td>EMB-65</td>
        <td>DOCK-03</td>
        <td>ML-02</td>
      </tr>
      <tr>
        <td>EMB-06</td>
        <td>EMB-21</td>
        <td>EMB-36</td>
        <td>EMB-51</td>
        <td>EMB-66</td>
        <td>DOCK-04</td>
        <td>TUL-01</td>
      </tr>
      <tr>
        <td>EMB-07</td>
        <td>EMB-22</td>
        <td>EMB-37</td>
        <td>EMB-52</td>
        <td>EMB-67</td>
        <td>EXT-01</td>
        <td>TUL-02</td>
      </tr>
      <tr>
        <td>EMB-08</td>
        <td>EMB-23</td>
        <td>EMB-38</td>
        <td>EMB-53</td>
        <td>EMB-68</td>
        <td>EXT-02</td>
        <td>VIRTUAL-02</td>
      </tr>
      <tr>
        <td>EMB-09</td>
        <td>EMB-24</td>
        <td>EMB-39</td>
        <td>EMB-54</td>
        <td>EMB-69</td>
        <td>EXT-03</td>
        <td></td>
      </tr>
      <tr>
        <td>EMB-10</td>
        <td>EMB-25</td>
        <td>EMB-40</td>
        <td>EMB-55</td>
        <td>EMB-70</td>
        <td>INT-01</td>
        <td></td>
      </tr>
      <tr>
        <td>EMB-11</td>
        <td>EMB-26</td>
        <td>EMB-41</td>
        <td>EMB-56</td>
        <td>EMB-71</td>
        <td>INT-02</td>
        <td></td>
      </tr>
      <tr>
        <td>EMB-12</td>
        <td>EMB-27</td>
        <td>EMB-42</td>
        <td>EMB-57</td>
        <td>EMB-72</td>
        <td>INT-03</td>
        <td></td>
      </tr>
      <tr>
        <td>EMB-13</td>
        <td>EMB-28</td>
        <td>EMB-43</td>
        <td>EMB-58</td>
        <td>EMB-73</td>
        <td>LIMPIEZA</td>
        <td></td>
      </tr>
      <tr>
        <td>EMB-14</td>
        <td>EMB-29</td>
        <td>EMB-44</td>
        <td>EMB-59</td>
        <td>EMB-74</td>
        <td>MAE-01</td>
        <td></td>
      </tr>
      <tr>
        <td>EMB-15</td>
        <td>EMB-30</td>
        <td>EMB-45</td>
        <td>EMB-60</td>
        <td>EMB-75</td>
        <td>MAR-01</td>
        <td></td>
      </tr>
    </tbody>
  </table>

    </div>
  </div>

</section>
`;

async function main() {
  console.log('[Inventory Insight Modal]');
  try {
    setLocalStorage([]);

    const ul =
      document.querySelector('#topNavigationBar > nav > ul.collapsepane.nav.navbar-nav') ?? null;

    const li = `
    <li class="navdetailpane visible-sm visible-md visible-lg">
      <a id='openModalBtn' href="#" data-toggle="detailpane" class="navimageanchor visiblepane" aria-label="Abrir Modal" data-balloon-pos="right">
        <i class="far fa-door-open navimage"></i>
      </a>
    </li>
    `;

    if (!ul) return;
    ul.insertAdjacentHTML('beforeend', li);

    modalFunction();

    const tbody = document.querySelector('#ListPaneDataGrid > tbody');
    tbody && observacion(tbody);

    const btnNewWave = document.querySelector('#ListPaneMenuActionNew');
    const btnEditWave = document.querySelector('#ListPaneMenuActionEdit');

    btnNewWave && btnNewWave.addEventListener('click', saveDoorToClick);
    btnEditWave && btnEditWave.addEventListener('click', saveDoorToClick);

    await verificarHeaderDockDoor(true);
  } catch (error) {
    console.error('Error:', error);
    return;
  }
}

async function saveDoorToClick(alert) {
  try {
    let alerta = alert ? true : false;

    await verificarHeaderDockDoor(alerta);
    await verificarTbodyDoockDoor();

    setLocalStorage();
  } catch (error) {
    console.error('Error:', error);
    setLocalStorage([]);
    return;
  }
}

async function setLocalStorage(doorParams) {
  try {
    const door = doorParams || (await getDoockDoor());

    await chrome.storage.local.set({ key: door });
    console.log('Doors Save Storage');
  } catch (error) {
    console.error('Error saving doors to storage:', error);
  }
}

function observacion(tbody) {
  console.log('[Observacion]');
  // Función que se ejecutará cuando ocurra una mutación en el DOM
  function handleMutation(mutationsList, observer) {
    // Realiza acciones en respuesta a la mutación
    console.log('Se ha detectado una mutación en el DOM');
    saveDoorToClick(true);
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

function insertModal() {
  return new Promise((resolve, reject) => {
    const body = document.querySelector('body');

    if (!body) {
      reject('No se encontro elemento a insertar el Modal');
      return;
    }

    body.insertAdjacentHTML('beforeend', modalHTML);
    resolve();
  });
}

function modalFunction() {
  insertModal()
    .then(() => {
      const modal = document.getElementById('myModal');
      const btnOpen = document.getElementById('openModalBtn');
      const btnClose = document.querySelector('.modal-container .close');

      setEventListener({ modal, btnOpen, btnClose });
    })
    .catch(err => console.error('Error:', err));
}

function setEventModalOpenClose(elements) {
  const { btnOpen, btnClose, modal } = elements;

  // Cuando el usuario hace clic en el botón, abre el modal
  btnOpen.addEventListener('click', async function () {
    try {
      await verificarHeaderDockDoor(true);

      modal.style.display = 'block';

      await verificarTbodyDoockDoor(true);

      insertDoockNotAvailable();
    } catch (error) {
      console.error(error);
      return;
    }
  });

  // Cuando el usuario hace clic en <span> (x), cierra el modal
  btnClose.addEventListener('click', function () {
    modal.style.display = 'none';

    cleanClass('not-available');
  });
}

function verificarHeaderDockDoor(alertTrue) {
  return new Promise((resolve, reject) => {
    const dock_door_header = document.querySelector('#ListPaneDataGrid_DOCK_DOOR_LOCATION');

    if (!dock_door_header) {
      alertTrue && showAlert('Active la columna Dock Door', 'error');

      reject('No existe la columna Dock Door');
      return;
    }

    resolve();
  });
}

function verificarTbodyDoockDoor(alertTrue) {
  return new Promise((resolve, reject) => {
    const dock_doors = document.querySelectorAll(
      'td[aria-describedby="ListPaneDataGrid_DOCK_DOOR_LOCATION"]'
    );

    if (dock_doors.length === 0) {
      alertTrue && showAlert('No se encontraron puertas', 'error');

      reject('No se encontraron los elementos Dock Door');
      return;
    }

    resolve();
  });
}

function setEventListener(elements) {
  const { modal } = elements;

  setEventModalOpenClose(elements);

  // Cuando el usuario hace clic fuera del modal, ciérralo
  window.addEventListener('click', function (e) {
    const element = e.target;

    if (element === modal) {
      modal.style.display = 'none';
    }
  });

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (modal.style.display === 'block') {
        modal.style.display = 'none';
      }
    }
  });
}

function cleanClass(clase) {
  return new Promise((resolve, reject) => {
    try {
      const clases = document.querySelectorAll(`table#content .${clase}`);

      if (clases.length === 0) {
        resolve(); // Resuelve la promesa incluso si no hay elementos
        return;
      }

      clases.forEach(td => td.classList.remove(clase));
      resolve(); // Resuelve la promesa después de eliminar la clase
    } catch (error) {
      reject(error); // Rechaza la promesa en caso de error
    }
  });
}

function getDoockDoor() {
  let door = [];

  return new Promise(resolve => {
    const dock_doors = document.querySelectorAll(
      'td[aria-describedby="ListPaneDataGrid_DOCK_DOOR_LOCATION"]'
    );

    if (dock_doors.length === 0) {
      resolve([]);
      return;
    }

    dock_doors.forEach(doorElement => {
      const content = doorElement.innerHTML;

      if (content) {
        door.push(content.replace(/&nbsp;/, ' '));
      }
    });

    resolve(door);
  });
}

async function insertDoockNotAvailable() {
  console.log('[insertDoockNotAvailable]');

  try {
    const table = document.getElementById('content');
    if (!table) return; // Asegurarse de que la tabla existe

    const rows = Array.from(table.querySelectorAll('tbody tr td'));
    if (rows.length === 0) return; // Asegurarse de que hay filas en la tabla

    const door = await getDoockDoor();

    if (!Array.isArray(door) || door.length === 0) {
      setLocalStorage(door);
      await cleanClass('not-available');
      return;
    }

    rows.forEach(td => {
      const content = td.innerHTML;
      if (door.includes(content)) {
        td.classList.add('not-available');
      }
    });
  } catch (error) {
    console.error(error);
    return;
  }
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function showAlert(message, type) {
  const alertHtml = `
  <div id="alerta-copy" aria-live="polite"
    style="position: fixed;left: 0;width: 100%;display: flex;z-index: 1000000;padding: 4px;opacity: 1;transition-property: opacity, transform;transition-duration: 270ms;transition-timing-function: ease;top: 60px;">
    <div class="alert-box"
      style="background: ${
        type === 'success' ? 'rgb(47, 153, 47)' : 'rgb(153, 47, 47)'
      }; color: rgb(211, 211, 211);border-radius: 8px;padding: 11px 16px;box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.2) 0px 5px 10px, rgba(15, 15, 15, 0.4) 0px 15px 40px;margin: 0px auto;font-size: 16px;display: flex;align-items: center;justify-content: center;letter-spacing: 2px;">
      ${message}
      <div style="margin-left: 4px; margin-right: -4px"></div>
    </div>
  </div>
  `;

  const body = document.querySelector('body');

  if (!body) return;
  body.insertAdjacentHTML('beforeend', alertHtml);

  const alertElement = document.getElementById('alerta-copy');
  if (!alertElement) return;

  await delay(10);
  alertElement.style.opacity = '1';

  await delay(1800);
  alertElement.style.opacity = '0';

  await delay(270);
  alertElement.remove();
}

window.addEventListener('load', main);
