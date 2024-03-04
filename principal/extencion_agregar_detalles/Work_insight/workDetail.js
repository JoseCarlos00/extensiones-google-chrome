function inicio() {
  console.log('[Work detail]');
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
    const location = document.querySelector('#sidebar-wrapper > ul > li:nth-child(5) > a');

    if (location) {
      location.click();
      resolve('Click con Exito');
    } else {
      reject('No existe el elemento Reference Info');
    }
  });
}

function content() {
  const fromZoneElement = document.querySelector(
    '#LocationFromZoneValue > div > div.ui-igcombo-fieldholder.ui-igcombo-fieldholder-ltr.ui-corner-left > input'
  );
  const toZoneElement = document.querySelector(
    '#LocationFromZoneValue > div > div.ui-igcombo-fieldholder.ui-igcombo-fieldholder-ltr.ui-corner-left > input'
  );

  // texto a enviar

  const fromZone = fromZoneElement ? fromZoneElement.value : '';
  const toZone = toZoneElement ? toZoneElement.value : '';

  if (toZone === '' && fromZone === '') {
    chrome.runtime.sendMessage({
      action: 'datos_no_encontrados_desde_detail',
      data: 'Work detail',
    });
    setTimeout(window.close, 50);
    return;
  }

  const datos = {
    fromZone,
    toZone,
  };

  console.log(datos);

  // Enviar los datos al script de fondo
  chrome.runtime.sendMessage({ action: 'datos_desde_workinstruction_detail', datos: datos });
  setTimeout(window.close, 50);
}

window.addEventListener('load', inicio);
