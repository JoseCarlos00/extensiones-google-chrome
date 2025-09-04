function inicio() {
	const menuNav = document.querySelector("#ScreenGroupMenu12068");

	// Verificar si hay un estado guardado en el localStorage al cargar la página
	const switchState = localStorage.getItem("newWaveActive");

	const isChecked = switchState === "true" ? "checked=true" : "";

	const html = /*html*/ `
  <div class="switch-toggle-container">
    <div class="checkbox-wrapper-35">
    <input value="private" name="switch" id="switch" type="checkbox" class="switch" ${isChecked}>

    <label for="switch">
      <span class="switch-x-text">New Wave: </span>
      <span class="switch-x-toggletext">
        <span class="switch-x-unchecked"><span class="switch-x-hiddenlabel">Unchecked: </span>Off</span>
        <span class="switch-x-checked"><span class="switch-x-hiddenlabel">Checked: </span>On</span>
      </span>
    </label>
  </div>
  </div>
  `;

	if (!menuNav) return;
	menuNav.insertAdjacentHTML("beforeend", html);

	setTimeout(switchToggle, 50);
}

function switchToggle() {
	// Obtener el elemento del interruptor
	const switchElement = document.getElementById("switch");

	// Agregar un evento de cambio al interruptor
	switchElement.addEventListener("change", function () {
		if (this.checked === true) {
			localStorage.setItem("newWaveActive", true);
		} else {
			localStorage.removeItem("newWaveActive", false);
		}
	});
}

window.addEventListener("load", inicio, { once: true });
