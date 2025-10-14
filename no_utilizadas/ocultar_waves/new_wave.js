function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function inicio() {
  const btnSave = document.querySelector(
    '#NewWaveMenu > li.dropdownaction.menubutton.menubuttonsave'
  );

  // Espera 1 segundo
  await delay(1000);

  // Auto realise
  const autoRealise = document.querySelector('#ScreenControlToggleSwitch37984 > div > div > div');
  autoRealise?.click();

  const btnCancel = document.querySelector('#AddWaveActionCancel');
  btnCancel?.addEventListener('click', () => localStorage.removeItem('newWaveActive'));

  // Espera 500 milisegundos adicionales
  await delay(500);

  btnSave.classList.add('my-botton-save');
  btnSave.classList.remove('pull-right');

  // Espera 500 milisegundos adicionales
  await delay(500);
  setPositionButtonSave(btnSave);

  // Agregar el listener para el evento resize
  window.addEventListener('resize', () => setPositionButtonSave(btnSave));
}

function setPositionButtonSave(btnSave) {
  const btnYes = document.querySelector('#ScreenControlToggleSwitch37984 > div > div');
  const area = document.querySelector('#ui-id-13')?.getBoundingClientRect();
  const area2 = btnYes?.getBoundingClientRect();

  btnSave.style.top = area.bottom + 'px';
  btnSave.style.left = area2.right + 'px';
}

window.addEventListener('load', inicio, { once: true });
