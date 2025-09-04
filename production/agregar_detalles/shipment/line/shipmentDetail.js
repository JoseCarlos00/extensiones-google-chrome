function inicio() {
  console.log('[shipmentDetail.js]');
  const urlParams = new URLSearchParams(window.location.search);
  const activeParam = urlParams.get('active');

  if (activeParam) {
    clickForElement()
      .then(input => {
        console.log(input);
        setTimeout(content, 100);
      })
      .catch(err => {
        console.log(err);
      });
  }
}

function clickForElement() {
  return new Promise((resolve, reject) => {
    const status = document.querySelector('#sidebar-wrapper > ul > li:nth-child(7) > a');

    if (status) {
      status.click();
      resolve('Click con Exito');
    } else {
      reject('No existe el elemento Reference Info');
    }
  });
}

function content() {
  const dateElemet = document.querySelector('#StatusCreatedByDateEditingInput');
  const internalNUmberElement = document.querySelector(
    '#ReferenceInfoInternalShipmentNumValueEditingInput'
  );
  const waveNumberElement = document.querySelector('#ReferenceInfoWaveNumberValueEditingInput');

  // texto a enviar
  const date = dateElemet ? dateElemet.value : '';
  const internalShipmentNumber = internalNUmberElement
    ? internalNUmberElement.value.replace(/\D/g, '')
    : '';
  const waveNumber = waveNumberElement ? waveNumberElement.value.replace(/\D/g, '') : '';

  if (date === '' && internalShipmentNumber === '' && waveNumber === '') {
    chrome.runtime.sendMessage({
      action: 'datos_no_encontrados_desde_detail',
      data: 'Shipment Detail',
    });
    setTimeout(window.close, 50);
    return;
  }

  const datos = {
    date,
    internalShipmentNumber,
    waveNumber,
  };

  console.log(datos);

  // Enviar los datos al script de fondo
  chrome.runtime.sendMessage({ action: 'datos_desde_shipment_detail', datos: datos });

  setTimeout(window.close, 50);
}

window.addEventListener('load', inicio);
