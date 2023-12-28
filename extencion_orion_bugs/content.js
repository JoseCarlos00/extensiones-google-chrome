(function () {
  function inicio() {
    document.querySelector('body > div.grid-container').style.minHeight = 0;
  }

  window.addEventListener('load', inicio, { once: true });
})();
