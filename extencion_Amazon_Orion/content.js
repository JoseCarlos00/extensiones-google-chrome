(function () {
  function inicio() {}
  const style = `<style>
    .guia {
      width: 680px;
      object-fit: cover;
      object-position: left;
    }
  </style>
  `;

  const pageBreak = `<div class="page-break"></div>`;
  document.querySelector('head').insertAdjacentHTML('beforeend', style);

  const container = document.querySelectorAll('.container.inv-container');

  container.forEach(content => {
    const images = content.querySelectorAll('img');
    const ultimaImagen = images[images.length - 1];
    ultimaImagen.classList.add('guia');

    content.insertAdjacentHTML('beforeend', pageBreak);
  });

  window.addEventListener('load', inicio, { once: true });
})();
