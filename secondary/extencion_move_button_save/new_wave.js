const selector = {
  autoRelise: '#ScreenControlToggleSwitch37984 > div > div > div',
  btnYes: '#ScreenControlToggleSwitch37984 > div > div',
  btnSave: '#NewWaveMenu > li.dropdownaction.menubutton.menubuttonsave',
};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function inicio() {
  const btnSave = document.querySelector(selector.btnSave);

  await delay(250);
  await clickMenuWaveMaster();

  // Auto realise
  const autoRealise = document.querySelector(selector.autoRelise);
  autoRealise && autoRealise.click();

  const btnCancel = document.querySelector('#AddWaveActionCancel');
  btnCancel && btnCancel.addEventListener('click', () => localStorage.removeItem('newWaveActive'));

  await delay(250);

  btnSave.classList.add('my-botton-save');
  btnSave.classList.remove('pull-right');

  await delay(150);
  setPositionButtonSave(btnSave);

  // Agregar el listener para el evento resize
  window.addEventListener('resize', () => setPositionButtonSave(btnSave));
}

function setPositionButtonSave(btnSave) {
  const btnYes = document.querySelector(selector.btnYes);
  const area = document.querySelector('#ui-id-13')?.getBoundingClientRect();
  const area2 = btnYes?.getBoundingClientRect();

  btnSave.style.top = area.bottom - 4 + 'px';
  btnSave.style.left = area2.right + 'px';
}

function clickMenuWaveMaster() {
  return new Promise((resolve, reject) => {
    const btn = document.querySelector('#ui-id-12');

    if (!btn) reject('No existe el button Wave Master');
    btn.click();
    resolve();
  });
}

window.addEventListener('load', inicio, { once: true });
