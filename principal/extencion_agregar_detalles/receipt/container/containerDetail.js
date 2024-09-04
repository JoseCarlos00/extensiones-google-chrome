function inicio() {
  console.log('[Receipt Container Detail]');
  const urlParams = new URLSearchParams(window.location.search);
  const activeParam = urlParams.get('active');

  if (activeParam) {
    content();
  }
}

function content() {
  const elements = [
    document.querySelector('#sidebar-wrapper > ul > li:nth-child(6) > a'),
    document.querySelector('#sidebar-wrapper > ul > li:nth-child(8) > a'),
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
      // console.log('promiseChain1:', promiseChain);
    });
    // console.log('promiseChain2:', promiseChain);
    return promiseChain;
  }

  function insertarInfo() {
    // Obtener elementos del DOM
    const parentElement = document.querySelector(
      '#ReceiptContParentContSectionParentContIdValueEditingInput'
    );
    const receiptDateElement = document.querySelector(
      '#ReceiptContDatesSectionReceiptDateValueEditingInput'
    );
    const userStampElement = document.querySelector(
      '#RferenceInfoSectionUserStampValueEditingInput'
    );
    const checkInElement = document.querySelector(
      '#ReferenceInfoSectionDateTimeStampValueEditingInput'
    );

    // texto a enviar
    const parent = parentElement ? parentElement.value : '';
    const receiptDate = receiptDateElement ? receiptDateElement.value : '';
    const userStamp = userStampElement ? userStampElement.value : '';
    const checkIn = checkInElement ? checkInElement.value : '';

    if (parent === '' && receiptDate === '' && userStamp === '' && checkIn === '') {
      chrome.runtime.sendMessage({
        action: 'datos_no_encontrados_desde_detail',
        data: 'Receipt Container Detail',
      });
      setTimeout(window.close, 50);
      return;
    }

    // Extraer los datos relevantes de la página
    const datos = {
      parent,
      receiptDate,
      userStamp,
      checkIn,
    };

    console.log(datos);

    // Enviar los datos al script de fondo
    chrome.runtime.sendMessage({ action: 'datos_desde_receipt_container_detail', datos: datos });

    setTimeout(window.close, 50);
  }

  clickElementsSequentially()
    .then(() => {
      console.log('Todos los elementos han sido clicados.');
      insertarInfo();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

window.addEventListener('load', inicio);
