(function () {
  function inicio() {}

  const container = document.querySelectorAll('.container.inv-container');

  container.forEach(content => {
    const images = content.querySelectorAll('img');

    const logoFM = images[0];
    const ultimaImagen = images[images.length - 1];
    const penultimaImagen = images[images.length - 2];

    logoFM.classList.add('pd-left');
    ultimaImagen.classList.add('guia');
    penultimaImagen.classList.add('guia');
  });

  const textarea = `
  <div class="col col-2 textarea-container">
    <textarea class="textarea" spellcheck="false" data-ms-editor="true"></textarea>
    <button class="next-button button"><span class="text">Sig</span></button>
  </div>`;

  const divFather = document.querySelectorAll('div.container.inv-container > div.row:nth-child(1)');

  divFather.forEach(div => {
    div.classList.add('position-relative');
    div.insertAdjacentHTML('beforeend', textarea);
  });

  // Selecciona todos los botones "Sig"
  const nextButtons = document.querySelectorAll('.next-button');

  // Agrega un controlador de eventos clic a cada boton "Sig"
  nextButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      // Encuentra todos los elementos de area de texto
      const textareas = document.querySelectorAll('.textarea');

      // Verifica si hay mas areas de texto despues del actual
      if (index < textareas.length - 1) {
        // Tambien puedes enfocar automaticamente el siguiente area de texto si es necesario
        textareas[index + 1].focus();
      }
    });
  });

  function contarPedidos() {
    const pedidosContainer = `
    <p class="container-numPedidos">Nun. Pedidos: <span class="numPedidos">0</span>
    </p>`;

    // Obten todos los elementos que contienen numeros de pedido
    const numPedidos = document.querySelectorAll(
      '.col.text-center.inv_heading > h3:nth-child(5)'
    ).length;

    document.querySelector('body').insertAdjacentHTML('beforeend', pedidosContainer);

    document.querySelector(' p.container-numPedidos > span.numPedidos').innerHTML = numPedidos;
    console.log('Num pedidos:', numPedidos);
  }

  contarPedidos();

  window.addEventListener('load', inicio, { once: true });
})();
