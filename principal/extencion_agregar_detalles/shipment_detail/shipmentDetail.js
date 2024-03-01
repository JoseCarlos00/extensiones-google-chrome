function inicio() {
  console.log('[shipmentDetail.js]');
  const urlParams = new URLSearchParams(window.location.search);
  const activeParam = urlParams.get('active');

  if (activeParam) {
    content();
  }
}

function content() {
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

    dateElemet && (date = dateElemet.value);

    if (internalNUmberElement) {
      internalShipmentNumber = internalNUmberElement.value.replace(/\D/g, '');
    }
    if (waveNumberElement) {
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
    chrome.runtime.sendMessage({ action: 'datos_desde_shipment_detail', datos: datos });

    setTimeout(window.close, 50);
  }, 100);
}

window.addEventListener('load', inicio);
