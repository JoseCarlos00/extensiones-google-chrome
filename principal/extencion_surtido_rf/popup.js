function inicio() {
  console.log('Surtido RF: popup.js');

  const toLoc =
    document.querySelector('#FORM1 > table > tbody > tr:nth-child(1) > td > input[type=text]') ??
    null;

  console.log('ToLoc:', toLoc);
  if (!toLoc) return;

  // Verificar si hay un estado guardado en el localStorage al cargar la página
  const switchState = localStorage.getItem('surtidoOrderActive');
  const switchElement = document.getElementById('switch');

  if (switchState === 'true') {
    switchElement && (switchElement.checked = true);
    // content(toLoc);
  }

  function content(toLoc) {
    const loc = document.querySelector('#HIDDENFROMLOC'); //BANDA
    const loc2 = document.querySelector('#HIDDENcheckDigit'); // EMPAQUE

    function insertar() {
      setTimeout(() => {
        if (!loc || !loc2) return;

        if (
          loc.value.includes('BANDA') ||
          loc.value.includes('ASCENSOR') ||
          loc.value.includes('PREPACK')
        ) {
          if (toLoc) {
            toLoc.value = loc.value;
          }
        } else {
          if (toLoc) {
            toLoc.value = loc2.value;
          }
        }
      }, 100);
    }

    insertar();

    setInterval(() => {
      if (toLoc?.value === '') {
        insertar();
      }
    }, 800);
  }
}

window.addEventListener('load', inicio, { once: true });
