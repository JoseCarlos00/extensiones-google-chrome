(function () {
  function inicio() {
    const style = `
    <style>
    .guia, .ultima-imagen{
        object-fit: cover;
        object-position: top;
        width: 830px;
      }

      .guia {
        height: 900px;
      }

      .ultima-imagen {
        height: 500px;
      }

    </style>
    `;
    document.querySelector('head').insertAdjacentHTML('beforeend', style);

    function intercabiarIMG() {
      return new Promise(resolve => {
        const guias = document.querySelectorAll('.container.inv-container img:first-of-type');

        guias.forEach(guia => {
          guia.classList.add('guia');

          // Obtén el nodo padre de la imagen
          const parent = guia.parentNode;

          // Obtén todas las imágenes dentro del mismo nodo padre
          const siblingImages = parent.querySelectorAll('img');
          const ultimaImagen = siblingImages[siblingImages.length - 1];
          ultimaImagen.classList.add('ultima-imagen');

          const h3 = parent.querySelectorAll('h3');
          const tercerH3 = h3[2];
          const ultimoH3 = h3[h3.length - 1];
          tercerH3.style.display = 'none';
          // Obtén todos los elementos con la clase "page-break" del contenedor
          const pageBreaks = parent.querySelectorAll('.page-break');

          if (pageBreaks.length >= 2) {
            segundoBreak = pageBreaks[1];
            segundoBreak.classList.remove('page-break');
          }

          // Intercambia las posiciones de las imágenes
          parent.insertBefore(siblingImages[0], ultimoH3);
        });

        // Resuelve la promesa después de intercambiar imágenes
        resolve();
      });
    }

    function resolverLimite() {
      const referencia = document.querySelectorAll('.container.inv-container .guia');

      referencia.forEach(guia => {
        const parent = guia.parentNode;

        const tables = parent.querySelectorAll('.container.inv-container table tbody > tr');
        const ultimaImagen = parent.querySelector('.container.inv-container .ultima-imagen');
        const lineas = tables.length - 1;

        // Si las lineas del pedido paa el limete para mostrar de 6 Mostrar una Hoja Completa
        if (lineas >= 7 && lineas <= 18) {
          ultimaImagen.classList.remove('ultima-imagen');
        }

        if (lineas >= 25 && lineas <= 36) {
          ultimaImagen.classList.remove('ultima-imagen');
        }

        if (lineas >= 43 && lineas <= 54) {
          ultimaImagen.classList.remove('ultima-imagen');
        }

        if (lineas >= 61 && lineas <= 72) {
          ultimaImagen.classList.remove('ultima-imagen');
        }
      });
    }

    // Llama a intercabiarIMG
    intercabiarIMG().then(() => {
      console.log('Imagenes Intercambiadas');
      resolverLimite();
    });
  }

  window.addEventListener('load', inicio);
})();
