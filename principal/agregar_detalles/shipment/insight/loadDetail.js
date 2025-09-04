function inicio() {
  console.log('[Load detail]');
  const urlParams = new URLSearchParams(window.location.search);
  const activeParam = urlParams.get('active');

  if (activeParam) {
    setTimeout(content, 100);
  }
}

function content() {
  const dockDoorElement = document.querySelector(
    '#ShippingLoadInfoSectionDockDoorValue > div > div.ui-igcombo-fieldholder.ui-igcombo-fieldholder-ltr.ui-corner-left > input'
  );

  // texto a enviar
  const dockDoor = dockDoorElement ? dockDoorElement.value : '';

  if (dockDoor === '') {
    chrome.runtime.sendMessage({
      action: 'datos_no_encontrados_desde_detail',
      data: 'Load detail',
    });
    setTimeout(window.close, 50);
    return;
  }

  const datos = {
    dockDoor,
  };

  console.log(datos);

  // Enviar los datos al script de fondo
  chrome.runtime.sendMessage({ action: 'datos_desde_load_detail', datos: datos });
  setTimeout(window.close, 50);
}

window.addEventListener('load', inicio);
