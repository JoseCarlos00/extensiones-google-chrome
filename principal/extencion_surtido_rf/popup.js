function inicio() {
  console.log('Surtido RF: popup.js');

  const toLoc = document.querySelector(
    '#FORM1 > table > tbody > tr:nth-child(1) > td > input[type=text]'
  );
  console.log('ToLoc:', toLoc);
  if (!toLoc) return;

  const switchElement = document.getElementById('switch');
  const switchState = localStorage.getItem('surtidoOrderActive');

  if (switchState === 'true') {
    if (switchElement) switchElement.checked = true;
    processContent(toLoc);
  }

  function processContent(toLoc) {
    const loc = document.querySelector('#HIDDENFROMLOC');
    const loc2 = document.querySelector('#HIDDENcheckDigit');
    const specialLocations = ['BANDA', 'ASCENSOR', 'ETIQUETADO', 'PREPACK'];
    const regex = /^[A-Za-z]{3}\d{3}$/;

    function updateToLoc() {
      console.log('[updateToLoc]');
      if (!loc || !loc2 || !toLoc) return;

      if (specialLocations.some(location => loc.value.includes(location))) {
        toLoc.value = loc.value;
      } else if (
        specialLocations.some(location => loc2.value.includes(location)) ||
        regex.test(loc2.value)
      ) {
        toLoc.value = loc2.value;
      }
    }

    updateToLoc();

    setInterval(() => {
      if (toLoc.value === '') {
        updateToLoc();
      }
    }, 800);
  }
}

window.addEventListener('load', inicio, { once: true });
