const body = document.querySelector('body');

const html = `
<div class="switch-toggle-container">
  <div class="checkbox-wrapper-35">
  <input value="private" name="switch" id="switch" type="checkbox" class="switch">
  <label for="switch">
    <span class="switch-x-text">Surtido: </span>
    <span class="switch-x-toggletext">
      <span class="switch-x-unchecked"><span class="switch-x-hiddenlabel">Unchecked: </span>Off</span>
      <span class="switch-x-checked"><span class="switch-x-hiddenlabel">Checked: </span>On</span>
    </span>
  </label>
</div>
</div>
`;

body.insertAdjacentHTML('beforeend', html);

switchToggle();

function switchToggle() {
  // Verificar si hay un estado guardado en el localStorage al cargar la página
  const switchState = localStorage.getItem('surtidoOrderActive');
  const switchElement = document.getElementById('switch');

  if (switchState === 'true') {
    switchElement && (switchElement.checked = true);
  }

  // Agregar un evento de cambio al interruptor
  switchElement.addEventListener('change', function () {
    if (this.checked === true) {
      localStorage.setItem('surtidoOrderActive', true);
    } else {
      localStorage.removeItem('surtidoOrderActive');
    }
  });
}

window.addEventListener('load', inicio, { once: true });
