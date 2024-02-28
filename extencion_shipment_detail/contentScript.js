console.log('[contentScript.js] 1');
// Contenido del contentScript.js en la segunda pestaña
// Este script se ejecuta en la segunda pestaña

function inicio() {
  const panelStatus = document.querySelector('#sidebar-wrapper > ul > li:nth-child(7) > a');

  if (panelStatus) {
    panelStatus.click();
  }

  // texto a enviar
  let date = '';
  let internalShipmentNumber = '';
  let waveNumber = '';

  setTimeout(() => {
    const dateElemet = document.querySelector('#StatusCreatedByDateEditingInput');
    const internalNUmberElement = document.querySelector(
      '#ReferenceInfoInternalShipmentNumValueEditingInput'
    );
    const waveNumberElement = document.querySelector('#ReferenceInfoWaveNumberValueEditingInput');

    if (dateElemet) date = dateElemet.value;
    if (internalNUmberElement) {
      // Limpiar el número interno antes de asignarlo
      internalShipmentNumber = internalNUmberElement.value.replace(/\D/g, '');
    }
    if (waveNumberElement) {
      // Limpiar el número de onda antes de asignarlo
      waveNumber = waveNumberElement.value.replace(/\D/g, '');
    }

    // Extraer los datos relevantes de la página
    let datos = {
      date,
      internalShipmentNumber,
      waveNumber,
    };

    console.log(datos);

    // Enviar los datos al script de fondo
    chrome.runtime.sendMessage({ action: 'datos_desde_segunda_pestaña', datos: datos });

    setTimeout(window.close, 50);
  }, 150);
}

window.addEventListener('load', inicio);
