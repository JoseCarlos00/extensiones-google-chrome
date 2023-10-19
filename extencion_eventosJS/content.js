function inicio() {
  window.addEventListener('keydown', event => {
    // Verifica si se presionó Ctrl (Control) y Shift al mismo tiempo
    if (event.ctrlKey && event.shiftKey) {
      if (event.key === 'f') {
        const menuFillter =
          document.querySelector(
            '#topNavigationBar > nav > ul.collapsepane.nav.navbar-nav > li.navsearch.visible-sm.visible-md.visible-lg > a'
          ) ?? false;

        if (menuFillter) menuFillter.click();
      }
    }

    /**Menu  principal  Ctrl + m*/
    if (event.ctrlKey && event.key === 'm') {
      const menuCanvas = document.querySelector('#menutoggle') ?? false;

      if (menuCanvas) {
        menuCanvas.click();
        document.addEventListener(
          'keydown',
          e => {
            if (e.key === 'Escape') {
              document.querySelector('#systemmenuclose').click();
            }
          },
          { once: true }
        );
      }
    }
  });
}

window.addEventListener('load', inicio, { once: true });
