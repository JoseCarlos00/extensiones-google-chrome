function inicio() {
  console.log('[Work detail]');
  const urlParams = new URLSearchParams(window.location.search);
  const activeParam = urlParams.get('active');

  if (activeParam) {
    clickForElement()
      .then(input => {
        console.log(input);
        content();
      })
      .catch(err => {
        console.log(err);
      });
  }
}

function clickForElement() {
  return new Promise((resolve, reject) => {
    const referenceInfo = document.querySelector('#sidebar-wrapper > ul > li:nth-child(6) > a');

    if (!referenceInfo) {
      referenceInfo.click();
      resolve('Click con Exito');
    } else {
      reject('No existe el elemento Reference Info');
      chrome.runtime.sendMessage({ action: 'datos_no_encontrados_desde_detail' });
    }
  });
}

function content() {
  const userStampElement = document.querySelector(
    '#WaveDetailsReferenceInfoSectionUserStampValueEditingInput'
  );

  // texto a enviar
  const userStamp = userStampElement ? userStampElement.value : '';

  // Extraer los datos relevantes de la página
  const datos = {
    userStamp,
  };

  console.log(datos);

  // Enviar los datos al script de fondo
  chrome.runtime.sendMessage({ action: 'datos_desde_workinstruction_detail', datos: datos });
  setTimeout(window.close, 50);
}

window.addEventListener('load', inicio);
