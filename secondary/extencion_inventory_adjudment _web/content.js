function inicio() {
  const item1 = document.querySelector('#ItemInformationItemValueEditingInput');
  const item2 = document.querySelector(
    '#ItemInformationItemValue > div.ui-igeditor-input-container.ui-corner-all > input:nth-child(2)'
  );
  const qty1 = document.querySelector(
    '#ItemInformationItemValue > div.ui-igeditor-input-container.ui-corner-all > input:nth-child(2)'
  );
  const qty2 = document.querySelector(
    '#QuantityInformationQuantityValue > div.ui-igeditor-input-container.ui-corner-all > input[type=hidden]:nth-child(2)'
  );
  const um1 = document.querySelector(
    '#QuantityInformationQuantityUmValue > div > div.ui-igcombo-fieldholder.ui-igcombo-fieldholder-ltr.ui-corner-left > input'
  );

  item1.value = '9923-11125-9486';
  item2.value = '9923-11125-9486';

  qty1.value = '1';
  qty2.value = '1';

  setTimeout(function () {
    qty1.focus();
  }, 2000);

  um1.focus();

  if (stAdj == 'Ajuste Positivo') {
    content();
  }

  function content() {}
}

window.onload = inicio;
