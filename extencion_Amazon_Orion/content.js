(function () {
  function inicio() {}
  const style = `<style>
     .guia {
    //   max-width: 1140px;
    //   object-fit: cover;
    //   object-position: left;
      height: 1500px !important;
     }


    .textarea-container{
     position: relative;
      right: 39px;
      top: 28px;
      z-index: 10;
    }
    
    .textarea {
      position: absolute;
      resize: none;
      min-height: 206px;
      height: 254px;
      width: 200px;
      font-size: 24px;
      font-weight: bold;
    }

    .next-button {
      cursor: pointer;
      position: absolute;
      top: 0;
      right: -60px;
      padding: 3px 3px !important;
      font-size: 15px;
    }


    .container-numPedidos {
      position: absolute;
      top: 0;
      right: 15px;

      & .numPedidos {
        font-weight: bold;
      }
    }

    .button {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 10px 15px;
      gap: 15px;
      background-color: #007ACC;
      outline: 3px #007ACC solid;
      outline-offset: -3px;
      border-radius: 5px;
      border: none;
      cursor: pointer;
      transition: 400ms;
    }
    
    .button .text {
      color: white;
      font-weight: 700;
      font-size: 1em;
      transition: 400ms;
      margin: 0;
    }
    
    .button:hover {
      background-color: transparent;
    }
    
    .button:hover .text {
      color: #007ACC;
    }
    

    @media print {
      .next-button {
        display: none;
      }

      .container-numPedidos {
        display: none;
      }

      .textarea {
        border: none
      }

      .container-principal {
        display: none;
      }

      body > div:nth-child(7) > div:nth-child(2) > div:nth-child(2) {
        flex: 0 0 58.33333%;
        max-width: 58.33333%;    
    }
    }
  </style>
  `;

  document.querySelector('head').insertAdjacentHTML('beforeend', style);

  const container = document.querySelectorAll('.container.inv-container');

  container.forEach(content => {
    const images = content.querySelectorAll('img');
    const ultimaImagen = images[images.length - 1];
    const penultimaImagen = images[images.length - 2];

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
