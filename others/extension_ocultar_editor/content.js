(() => {
  document.querySelector('head').insertAdjacentHTML(
    'beforeend',
    `
    <style>
        
        @media print {
            body > deepl-input-controller {
              display: none;
            }
          }
            deepl-input-controller {
            display: none;
            }
    </style>
    `
  );
})();
