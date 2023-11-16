(function () {
  function inicio() {
    document.querySelector('head').insertAdjacentHTML(
      'beforeend',
      `
    <style>
    .textarea-container{
      position: absolute;
      right: 0;
      top: 110px;
    }
    
    .textarea {
      resize: none;
      height: 206px;
      width: 200px;
      font-size: 34px;
      font-weight: bold;
    }

    .next-button {
      cursor: pointer;
      position: absolute;
      top: 0;
      right: -40px
    }
    </style>
    `
    );

    const textarea = `
      <div class="textarea-container">
        <textarea class="textarea" spellcheck="false" data-ms-editor="true"></textarea>
        <button class="next-button">Sig</button>
      </div>`;

    const divFather = document.querySelectorAll(
      'div.container.inv-container > .row .col.text-center.inv_heading'
    );

    divFather.forEach(div => {
      div.classList.add('position-relative');
      div.insertAdjacentHTML('beforeend', textarea);
    });

    function antesDeImprimir() {
      document.querySelectorAll('.textarea').forEach(text => {
        text.style.border = 'none';
      });

      document.querySelectorAll('.next-button').forEach(btn => {
        btn.style.display = 'none';
      });
    }

    function despuesDeImprimir() {
      document.querySelectorAll('.textarea').forEach(text => {
        text.style.border = '1px solid #000';
      });

      document.querySelectorAll('.next-button').forEach(btn => {
        btn.style.display = 'block';
      });
    }

    window.addEventListener('beforeprint', antesDeImprimir);
    window.addEventListener('afterprint', despuesDeImprimir);

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
  }

  window.addEventListener('load', inicio);
})();
