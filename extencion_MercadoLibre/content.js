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
    </style>
    `
    );

    const textarea = `
      <div class="textarea-container">
        <textarea class="textarea" spellcheck="false" data-ms-editor="true"></textarea>
        <button class="next-button">Siguiente</button>
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
    }

    function despuesDeImprimir() {
      document.querySelectorAll('.textarea').forEach(text => {
        text.style.border = '1px solid #000';
      });
    }

    function moveToNextTextarea(event) {
      const currentTextarea = event.target.previousElementSibling;
      const nextTextarea =
        currentTextarea.parentElement.nextElementSibling.querySelector('.textarea');

      if (nextTextarea) {
        nextTextarea.focus();
      }
    }

    window.addEventListener('beforeprint', antesDeImprimir);
    window.addEventListener('afterprint', despuesDeImprimir);

    document.querySelectorAll('.next-button').forEach(button => {
      button.addEventListener('click', moveToNextTextarea);
    });
  }

  window.addEventListener('load', inicio);
})();
