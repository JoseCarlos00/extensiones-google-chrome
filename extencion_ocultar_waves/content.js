function inicio() {
  const tbody = document.querySelector('#WaveFlowGrid > tbody').childNodes;

  const autoActiva = '1155736963';
  const sinRabasto = '1265266259';
  const express = '2168485273';
  const nacionalizacion = '655614933';

  setTimeout(() => {
    tbody.forEach(tr => {
      const DATA_ID = tr.getAttribute('data-id');

      if (DATA_ID !== autoActiva) {
        tr.style = 'opacity: 0; display: none;';
      } else {
        tr.firstChild.style = 'padding: 1rem;';
      }
    });
  }, 700);

  // Reducir spaciado
  document.querySelector('#GridPlaceHolder').style = 'min-height: 20px;';

  const style = `
      <style> 
          .my-botton-save {
              position: absolute !important;
              bottom: -938% !important;
              left: 32% !important;
              height: 35px !important;
              border: 1px solid #BCBCBC;
  
              & a#NewWaveActionSave {
                  padding-top: 0.35rem !important;
                  height: 33px !important;
              }
  
              & a#NewWaveActionSave:hover {
                  background-color: #a233c1;;
                  height: 33px !important;
                  color: #fff;
              }
  
          }
  
          .nav > li.disabled {
            background-color: #494e53;
          }
          .nav > li.disabled > a#NewWaveActionSave {
              background-color: transparent;
          }
          
      </style>`;

  setTimeout(() => {
    document
      .querySelector('#NewWaveMenu > li.dropdownaction.pull-right.menubutton.menubuttonsave')
      .classList.add('my-botton-save');
    document
      .querySelector('#NewWaveMenu > li.dropdownaction.pull-right.menubutton.menubuttonsave')
      .classList.remove('pull-right');
    document.querySelector('head').insertAdjacentHTML('beforeend', style);
  }, 2000);

  // Auto realise
  setTimeout(() => {
    document.querySelector('#ScreenControlToggleSwitch37984 > div > div > div').click();
  }, 1000);
}

window.onload = inicio;
