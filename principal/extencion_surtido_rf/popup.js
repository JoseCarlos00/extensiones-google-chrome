function inicio() {
  console.log('Surtido RF');
  const toLoc =
    document.querySelector('#FORM1 > table > tbody > tr:nth-child(1) > td > input[type=text]') ??
    null;

  if (!toLoc) return;

  // const loc = document.querySelector('#FORM1 > table > tbody > tr:nth-child(1) > td');
  const loc = document.querySelector('#HIDDENFROMLOC'); //BANDA
  const loc2 = document.querySelector('#HIDDENcheckDigit'); // EMPAQUE

  function insertar() {
    setTimeout(() => {
      if (loc) {
        if (
          loc.value.includes('BANDA') ||
          loc.value.includes('ASCENSOR') ||
          loc.value.includes('PREPACK')
        ) {
          toLoc.value = loc.value;
        } else {
          toLoc.value = loc2.value;
        }
      }
    }, 100);
  }

  insertar();

  setInterval(() => {
    if (toLoc.value === '') {
      insertar();
    }
  }, 800);
}

window.addEventListener('load', inicio, { once: true });
