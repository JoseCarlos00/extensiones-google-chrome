function inicio() {
  console.log('[Inventory Detail]');

  const urlParams = new URLSearchParams(window.location.search);
  const activeParam = urlParams.get('active');

  if (activeParam) {
    content();
  }
}

function content() {
  const elements = [
    document.querySelector('#sidebar-wrapper > ul > li:nth-child(6) > a'),
    document.querySelector('#sidebar-wrapper > ul > li:nth-child(9) > a'),
    document.querySelector('#sidebar-wrapper > ul > li:nth-child(10) > a'),
    document.querySelector('#sidebar-wrapper > ul > li:nth-child(11) > a'),
  ];

  function clickElement(element) {
    return new Promise((resolve, reject) => {
      if (element) {
        element.click();
        setTimeout(resolve, 250);
      } else {
        reject('Elemento no encontrado');
      }
    });
  }

  function clickElementsSequentially() {
    let promiseChain = Promise.resolve();

    elements.forEach(element => {
      promiseChain = promiseChain.then(() => clickElement(element));
      console.log('promiseChain1:', promiseChain);
    });
    console.log('promiseChain2:', promiseChain);
    return promiseChain;
  }

  clickElementsSequentially()
    .then(() => {
      console.log('Todos los elementos han sido clicados.');
      insertarInfo();
    })
    .catch(error => {
      console.error('Error:', error);
    });

  function insertarInfo() {
    const receivedDateTimeElement = document.querySelector('#DatesReceivedDatesValueEditingInput');
    const attribute1Element = document.querySelector('#AttributesAttribute1ValueEditingInput');
    const allocationElement = document.querySelector('#ZonesAllocationValueEditingInput');
    const locatingElement = document.querySelector('#ZonesLocatingValueEditingInput');
    const workZoneElement = document.querySelector('#ZonesWorkValueEditingInput');
    const userStampElement = document.querySelector('#ReferenceInfoUserStampValueEditingInput');
    const dateTimeStampElement = document.querySelector('#InventoryDateTimeStampValueEditingInput');

    // texto a enviar
    const receivedDateTime = receivedDateTimeElement ? receivedDateTimeElement.value : '';
    const attribute1 = attribute1Element ? attribute1Element.value : '';
    const allocation = allocationElement ? allocationElement.value : '';
    const locating = locatingElement ? locatingElement.value : '';
    const workZone = workZoneElement ? workZoneElement.value : '';
    const userStamp = userStampElement ? userStampElement.value : '';
    const dateTimeStamp = dateTimeStampElement ? dateTimeStampElement.value : '';

    const datos = {
      receivedDateTime,
      attribute1,
      allocation,
      locating,
      workZone,
      userStamp,
      dateTimeStamp,
    };

    if (
      receivedDateTime === '' &&
      attribute1 === '' &&
      allocation === '' &&
      locating === '' &&
      workZone === '' &&
      userStamp === '' &&
      dateTimeStamp === ''
    ) {
      chrome.runtime.sendMessage({
        action: 'datos_no_encontrados_desde_detail',
        data: 'Inventory Detail',
      });
      setTimeout(window.close, 50);
      return;
    }

    console.log(datos);

    // Enviar los datos al script de fondo
    chrome.runtime.sendMessage({ action: 'datos_desde_inventory_detail', datos: datos });

    setTimeout(window.close, 50);
  }
}

window.addEventListener('load', inicio, { once: true });
