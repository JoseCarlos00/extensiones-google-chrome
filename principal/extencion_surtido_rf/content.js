function inicio() {
  console.log('Surtido RF: content.js');

  const itemContainer = document.querySelector('#FORM1 > table > tbody > tr:nth-child(3)');
  if (!itemContainer) return;

  const switchState = localStorage.getItem('surtidoOrderActive');
  const switchElement = document.getElementById('switch');

  if (switchState === 'true' && switchElement) {
    switchElement.checked = true;
    processContent();
  }

  function processContent() {
    const itemElement = document.querySelector('#HIDDENitem');
    const LP1Element = document.querySelector("#FORM1 tr td input[name='TRANSCONTID']");
    const LP2Element = document.querySelector('#FORM1 tr:nth-last-child(4) td');

    if (!itemElement || !LP1Element || !LP2Element) return;

    const item = itemElement.value;

    setTimeout(() => {
      handleItem(LP1Element, LP2Element, item);
    }, 500);
  }

  function handleItem(LP1Element, LP2Element, item) {
    console.log('LP1 AND LP2');
    const itemInput = document.querySelector("#FORM1 tr td input[name='itemNum']");

    if (itemInput) {
      itemInput.value = item;
      LP1Element.focus();

      if (LP2Element.innerText.includes('Cont:')) {
        LP1Element.value = LP2Element.innerText.replace('Cont: ', '');
        setTimeout(() => {
          document.querySelector('#bOK').click();
          console.log('CLICK');
        }, 500);
      }
    }
  }
}

window.addEventListener('load', inicio, { once: true });
