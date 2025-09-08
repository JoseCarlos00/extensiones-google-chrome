const waveFlowElementString = /*html*/ `
 <li class="pull-left menubutton ">
    <label for="wave-flow-select"
      style="margin: 0;padding: 0;margin-top: 12px;width: auto;height: 25px;display: block;font-size: 14px;font-weight: 500;">
      <select id="wave-flow-select"
        style="height: 25px; width: 100%; text-align: left; color: #fff; background-color: #2d2f3b; border-radius: 4px; cursor: pointer;">
        <option value="Flujo Express" selected>Flujo Express</option>
        <option value="Mariano STD Auto ACTIVA">Mariano STD Auto ACTIVA</option>
        <option value="Mariano STD No Rpln">Mariano STD No Rpln</option>
      </select>
    </label>
</li>

<li class="pull-left menubutton ">
	<div class="ui-state-default" style="width: 100%;height: 25px;text-align: center;display: block;margin-top: 12px; font-size: 14px;">
    <div class="ui-igeditor-input-container">
      <input list="wave-name-datalist" name="waveName" id="wave-name-input" class="ignore ui-igedit-input ui-igedit-placeholder blurLabel"
        type="text" placeholder="Wave Name" role="textbox" style="height: 100%;text-align: left;color: #fff; background-color: #2d2f3b !important;">
      
      <datalist id="wave-name-datalist">
        <option value="Mariano Express"></option>
        <option value="Mariano STD No Rpln"></option>
        <option value="Tiendas"></option>
        <option value="Clientes"></option>
      </datalist>
    </div>
  </div>
</li>
`;

function inicio() {
	const menuNav = document.querySelector("#ScreenGroupMenu12068");

	insertMenuNewWave();

	// Verificar si hay un estado guardado en el localStorage al cargar la página
	const switchState = localStorage.getItem("newWaveActive");

	const isChecked = switchState === "true" ? "checked=true" : "";

	const html = /*html*/ `
  <div class="switch-toggle-container">
    <div class="checkbox-wrapper-35">
    <input value="private" name="switch" id="switch-new-wave" type="checkbox" class="switch" ${isChecked}>

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
	const switchElement = document.getElementById("switch-new-wave");

	// Agregar un evento de cambio al interruptor
	switchElement.addEventListener("change", function () {
		if (this.checked === true) {
			localStorage.setItem("newWaveActive", true);
		} else {
			localStorage.removeItem("newWaveActive", false);
		}
	});
}

async function insertMenuNewWave() {
	const insertToElement = document.querySelector('#InsightMenuActionCollapse')?.closest('li');

	if (!insertToElement) {
		console.error('[insertMenuNewWave]: Elemento no encontrado');
		return;
	}

	insertToElement.insertAdjacentHTML('afterend', waveFlowElementString);

	await new Promise((resolve) => setTimeout(resolve, 50));

	const waveFlowSelect = document.querySelector('#wave-flow-select');
	const waveNameInput = document.querySelector('#wave-name-input');

	if (!waveFlowSelect || !waveNameInput) {
		console.error('[insertMenuNewWave]: Elementos no encontrados');
		return;
	}

	// función común para guardar
	const saveData = () => {
		console.log('[saveData]: Guardando');
		saveDataInStorage(waveFlowSelect, waveNameInput);
	};

	// asignar listeners
	waveFlowSelect.addEventListener('change', saveData);
	waveNameInput.addEventListener('input', saveData);
	waveNameInput.addEventListener('blur', saveData);
	waveNameInput.addEventListener('change', saveData);
}

function saveDataInStorage(waveFlowSelect, waveNameInput) {
	const data = {
		waveFlow: waveFlowSelect.value,
		waveName: waveNameInput.value,
	};

	sessionStorage.setItem('waveData', JSON.stringify(data));
	console.log('[saveDataInStorage]: Guardado', data);
}


window.addEventListener("load", inicio, { once: true });
