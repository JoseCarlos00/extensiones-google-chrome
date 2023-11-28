(function () {
  function inicio() {
    const style = `
    <style>
      .container.inv-container > img { 
        object-fit: cover;
        object-position: top;
        width: 826px;
        height: 900px;
      }

      .container.inv-container img:first-of-type {
        height: 400px;
      }

      .container.inv-container .page-break:nth-child(9), .container.inv-container .page-break:nth-child(9) + h3 {
        display: none;
      }
    </style>
    `;
    document.querySelector('head').insertAdjacentHTML('beforeend', style);

    function intercabiarIMG() {
      return new Promise(resolve => {
        const images = document.querySelectorAll('.container.inv-container img:first-of-type');

        images.forEach(image => {
          const parent = image.parentNode;

          // Obtén todas las imágenes dentro del mismo nodo padre
          const siblingImages = parent.querySelectorAll('img');

          // Intercambia las posiciones de las imágenes
          parent.insertBefore(siblingImages[1], siblingImages[0]);
        });

        // Resuelve la promesa después de intercambiar imágenes
        resolve();
      });
    }

    function moverH3() {
      const images = document.querySelectorAll('.container.inv-container img:first-of-type');

      images.forEach(image => {
        const parent = image.parentNode;

        // Obtiene la primera imagen como punto de referencia y el h3 de cada contenedor padre
        const img = parent.querySelector('img:nth-child(7)');
        const h3 = parent.querySelector('.container.inv-container img + h3');

        // Intercambia las posiciones de las imágenes
        parent.insertBefore(h3, img);
        h3.style = 'margin-bottom: 80px;';
      });
    }

    // Llama a intercabiarIMG y luego a moverH3 cuando se resuelva la promesa
    intercabiarIMG().then(() => moverH3());
  }

  window.addEventListener('load', inicio);
})();
