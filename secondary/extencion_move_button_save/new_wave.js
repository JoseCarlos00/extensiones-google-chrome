function inicio() {
  let altura = '';

  const anchoElemento1 = document.querySelector(
    '#ScreenGroupSubAccordion12898 > div:nth-child(2) > div:nth-child(1)'
  );
  const anchoElemento2 = document.querySelector('#ScreenControlToggleSwitch37984 > div');

  setTimeout(() => {
    // Auto realise
    document.querySelector('#ScreenControlToggleSwitch37984 > div > div > div').click();
  }, 1000);

  setTimeout(() => {
    document
      .querySelector('#NewWaveMenu > li.dropdownaction.pull-right.menubutton.menubuttonsave')
      .classList.add('my-botton-save');
    document
      .querySelector('#NewWaveMenu > li.dropdownaction.pull-right.menubutton.menubuttonsave')
      .classList.remove('pull-right');

    if (anchoElemento1 && anchoElemento2) {
      altura = Number(anchoElemento1.offsetWidth) + Number(anchoElemento2.offsetWidth) + 15;

      if (
        document.querySelector(
          '#NewWaveMenu > li.dropdownaction.menubutton.menubuttonsave.my-botton-save'
        )
      ) {
        document.querySelector(
          '#NewWaveMenu > li.dropdownaction.menubutton.menubuttonsave.my-botton-save'
        ).style.left = `${altura}px`;
      }
    }
  }, 2000);

  const btnCancel = document.querySelector('#AddWaveActionCancel');

  if (btnCancel) {
    btnCancel.addEventListener('click', function (e) {
      localStorage.removeItem('newWaveActive');
    });
  }
}

const btnSave = document.querySelector(
  '#NewWaveMenu > li.dropdownaction.menubutton.menubuttonsave.my-botton-save'
);

const area = document.querySelector('#ui-id-13').getBoundingClientRect();
btnSave.style.top = area.bottom + 'px';

const area2 = btnYes.getBoundingClientRect();
btnSave.style.left = area2.right + 'px';

window.addEventListener('load', inicio, { once: true });
