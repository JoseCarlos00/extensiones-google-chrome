function main() {
  try {
    const titleHeader = document.querySelector('#header') ?? '';

    if (!titleHeader || titleHeader.textContent.trim() !== 'Location inquiry results') {
      throw new Error('No se encontró el título de Header o no coincide');
    }

    // código adicional aquí
  } catch (error) {
    console.error('Error:', error);
  }

  function tranfer(LP, QTY) {
    FORM1.toContID.value = LP;
    FORM1.putAwayQty.value = QTY;

    setTimeout(() => {
      document.querySelector('#OK').click();
    }, 1000);
  }

  // let fila = 9;
  // tranfer(data[fila].LP, data[fila].QTY);
}

window.addEventListener('load', main, { once: true });
