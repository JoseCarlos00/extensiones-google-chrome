function inicio() {
  console.log('Surtido RF');
  const itemContainer = document.querySelector('#FORM1 > table > tbody > tr:nth-child(3)') ?? null;

  if (!itemContainer) return;

  const item = document.querySelector('#HIDDENitem').value;
  const qty = document.querySelector('#HIDDENTOTALQTY').value;
  const LP1 = document.querySelector("#FORM1 tr td input[name='TRANSCONTID']") ?? null;

  const LP2 = document.querySelector('#FORM1 tr:nth-last-child(4) td') ?? null;

  setTimeout(() => {
    if (LP2 && LP1) {
      console.log('LP1 AND LP2');
      document.querySelector("#FORM1 tr td input[name='itemNum']").value = item;

      if (LP2.innerText.includes('Cont:')) {
        LP1.value = LP2.innerText.replace('Cont: ', '');
        setTimeout(() => {
          document.querySelector('#bOK').click();
          console.log('CLIK');
        }, 50);
      }
    }
  }, 500);
}

window.addEventListener('load', inicio, { once: true });
