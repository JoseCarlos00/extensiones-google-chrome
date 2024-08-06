// script.js
let selectedElement = null;

async function main() {
  try {
    await insertMenu();

    const optionCopyMenu = document.getElementById('copy-option');

    if (!optionCopyMenu) {
      throw new Error('No de encotro la opcion del menu para copiar <li>Copiar</li>');
    }

    optionCopyMenu.addEventListener('click', handleClickCopy);

    document.addEventListener('contextmenu', handleOpenMenu);

    document.addEventListener('click', function () {
      // Oculta el menú cuando se hace clic en cualquier lugar
      const contextMenu = document.getElementById('context-menu');
      contextMenu && (contextMenu.style.display = 'none');
    });

    document.addEventListener('dblclick', function (e) {
      const element = e.target;
      if (element.nodeName === 'TD') {
        copy(element.textContent);
      }
    });

    document.getElementById('paste-option').addEventListener('click', handlePaste);
  } catch (error) {
    console.error('Error:', error);
  }
}

function insertMenu() {
  const menu = `
    <div id="context-menu" class="context-menu">
      <ul>
        <li id="copy-option">Copiar</li>
        <li id="paste-option">Pegar</li>
      </ul>
    </div>
  `;

  const alertHtml = `
  <div id="alerta-copy" aria-live="polite"
    style="bottom: 150px; position: fixed; left: 0px; width: 100%; display: none; z-index: 1000000; padding: 4px; opacity: 0; transition-property: opacity, transform; transition-duration: 270ms; transition-timing-function: ease;">
    <div
      style="background: rgb(47, 47, 47); color: rgb(211, 211, 211); border-radius: 8px; padding: 11px 16px; box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px,   rgba(15, 15, 15, 0.2) 0px 5px 10px,   rgba(15, 15, 15, 0.4) 0px 15px 40px; margin: 0px auto; font-size: 14px; display: flex; align-items: center;">
      Copiado al portapapeles
      <div style="margin-left: 4px; margin-right: -4px"></div>
    </div>
  </div>
  `;

  return new Promise((resolve, reject) => {
    const body = document.querySelector('body');

    if (!body) {
      console.error('No se encontro el elemento <body>');
      reject();
      return;
    }

    body.insertAdjacentHTML('beforeend', menu);
    body.insertAdjacentHTML('beforeend', alertHtml);
    resolve();
  });
}

function handleOpenMenu(e) {
  e.preventDefault();

  const element = e.target;
  const nodeName = e.target.nodeName;

  // Almacena la referencia al elemento TD
  if (nodeName === 'TD') {
    selectedElement = element;
  } else {
    selectedElement = null; // No es un TD, no almacenes nada
  }

  // Obtén la posición del clic
  const x = e.pageX;
  const y = e.pageY;

  // Muestra el menú en la posición del clic
  const contextMenu = document.getElementById('context-menu');

  if (!contextMenu) {
    console.error('No se encontró el menú');
    return;
  }

  contextMenu.style.display = 'block';
  contextMenu.style.left = `${x}px`;
  contextMenu.style.top = `${y}px`;
}

function handleClickCopy() {
  if (selectedElement) {
    const contentText = selectedElement.textContent;
    copy(contentText);
  } else {
    alert('No hay un elemento seleccionado para copiar');
  }

  // Oculta el menú después de copiar
  document.getElementById('context-menu').style.display = 'none';
}

async function copy(textoACopiar) {
  try {
    if (!textoACopiar) {
      throw new Error('No se encontro el contenido a copiar');
    }

    await navigator.clipboard.writeText(textoACopiar);

    const alerta = document.querySelector('#alerta-copy');

    alerta && alerta.classList.add('show-alert');
    setTimeout(() => {
      alerta && alerta.classList.remove('show-alert');
    }, 4000);
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
    alert('Error al copiar al portapapeles:');
  }
}

async function handlePaste(e) {
  try {
    const clipboardText = await navigator.clipboard.readText();
    const pasteArea1 = document.querySelector('#ItemInputEditingInput');
    const pasteArea2 = document.querySelector(
      '#ItemInput > div.ui-igeditor-input-container.ui-corner-all > input[type=hidden]:nth-child(2)'
    );

    if (!pasteArea1 || !pasteArea2) {
      console.error('No se encotro el area de pegado');
      return;
    }

    pasteArea2.value = clipboardText;
    pasteArea1.value = clipboardText;

    setTimeout(() => {
      document.querySelector('#ItemInputEditingInput').select();
      document.querySelector('#ItemInputEditingInput').focus();
    }, 50);

    console.log('Contenido pegado:', clipboardText);
  } catch (error) {
    console.error('Error al pegar:', error);
  }
  document.getElementById('context-menu').style.display = 'none';
}

window.addEventListener('load', main, { once: true });
