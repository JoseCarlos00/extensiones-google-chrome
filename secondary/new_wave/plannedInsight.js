function loadSearchFilterNameScript () {
	console.log('[plannedInsight.ts]');

	const script = document.createElement('script');
	// script.type = 'module'; // ¡Esta es la línea clave!
	// Obtenemos la URL del script principal desde los recursos de la extensión.
	script.src = chrome.runtime.getURL('searchFilterName.js');
	// Lo añadimos al <head> de la página para que se cargue y ejecute.
	(document.head || document.documentElement).appendChild(script);
};

// Constants for local/session storage keys to avoid magic strings
const NEW_WAVE_ACTIVE_KEY = 'newWaveActive';
const WAVE_DATA_KEY = 'waveData';
const LASTED_WAVE_KEY = 'lastedWave';


const waveFlowElementString = /* html */ `
 <li class="pull-left menubutton ">
    <label for="wave-flow-select"
      style="margin: 0;padding: 0;margin-top: 12px;width: auto;height: 25px;display: block;font-size: 14px;font-weight: 500;">
      <select id="wave-flow-select"
        style="height: 25px; width: 100%; text-align: left; color: #fff; background-color: #2d2f3b; border-radius: 4px; cursor: pointer;">
        <option value="Flujo Express">Flujo Express</option>
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

/**
 * Saves the wave flow and name data to session storage.
 * @param {HTMLSelectElement} waveFlowSelect The select element for wave flow.
 * @param {HTMLInputElement} waveNameInput The input element for wave name.
 */
function saveDataInStorage(waveFlowSelect, waveNameInput) {
	const data = {
		waveFlow: waveFlowSelect.value,
		waveName: waveNameInput.value,
	};

	localStorage.setItem(LASTED_WAVE_KEY, waveFlowSelect.value);

	sessionStorage.setItem(WAVE_DATA_KEY, JSON.stringify(data));
	localStorage.setItem(NEW_WAVE_ACTIVE_KEY, 'true');
	console.log('[saveDataInStorage]: Guardado', data);
}

/**
 * Sets up event listeners for the "New Wave" toggle switch.
 */
function setupSwitchToggle() {
	const switchElement = document.getElementById('switch-new-wave');
	if (!switchElement) {
		console.error('[setupSwitchToggle]: Switch element not found');
		return;
	}

	switchElement.addEventListener('change', function () {
		if (this.checked) {
			localStorage.setItem(NEW_WAVE_ACTIVE_KEY, 'true');
		} else {
			localStorage.removeItem(NEW_WAVE_ACTIVE_KEY);
		}
		console.log(`[New Wave] Active: ${this.checked}`);
	});
}

/**
 * Inserts the custom menu for creating a new wave and sets up its event listeners.
 */
async function insertMenuNewWave() {
	const insertToElement = document.querySelector('#InsightMenuActionCollapse')?.closest('li');

	if (!insertToElement) {
		console.error('[insertMenuNewWave]: Target element for insertion not found');
		return;
	}

	insertToElement.insertAdjacentHTML('afterend', waveFlowElementString);

	// A small delay might be necessary for the page's framework to process the new DOM elements.
	// A more robust solution could be using a MutationObserver if this proves unreliable.
	await new Promise((resolve) => setTimeout(resolve, 50));

	const waveFlowSelect = document.querySelector('#wave-flow-select');
	const waveNameInput = document.querySelector('#wave-name-input');

	if (!waveFlowSelect || !waveNameInput) {
		console.error('[insertMenuNewWave]: Custom menu elements not found after insertion');
		return;
	}

	const lastWaveFlow = localStorage.getItem(LASTED_WAVE_KEY);
	if (lastWaveFlow) {
		waveFlowSelect.value = lastWaveFlow;
	}

	// Inicializa los datos de la ola en sessionStorage.
	saveDataInStorage(waveFlowSelect, waveNameInput);

	const saveData = () => {
		saveDataInStorage(waveFlowSelect, waveNameInput);
	};

	waveFlowSelect.addEventListener('change', saveData);
	waveNameInput.addEventListener('input', saveData);
	waveNameInput.addEventListener('change', saveData);

	const addShipmentToWave = document.querySelector('#ListPaneMenuActionAddShipmentToWave');

	if (!addShipmentToWave) {
		console.error('[initialize]: Add Shipment to Wave button not found.');
		return;
	}

	const tableManager = new TableManager();
	tableManager.initialize();

	addShipmentToWave.addEventListener('click', () => {
		if (waveNameInput.value.trim() !== '') return;

		const waveName = tableManager.getWaveName();
		if (!waveName) return;

		const data = {
			waveFlow: 'Flujo Express',
			waveName,
		};

		sessionStorage.setItem(WAVE_DATA_KEY, JSON.stringify(data));
		localStorage.setItem(NEW_WAVE_ACTIVE_KEY, 'true');
		console.log('[saveDataInStorage]: Guardado', data);
	});
}

/**
 * Initializes the script by inserting UI elements and setting up event listeners.
 */
async function initialize() {
	const { extensionEnabled } = await chrome.storage.local.get({ extensionEnabled: true });
	if (!extensionEnabled) {
		document.body.classList.add('new-wave-disabled');
		console.log('[New Wave] Extensión deshabilitada. No se ejecutará plannedInsight.js.');
		return;
	}

	loadSearchFilterNameScript();
	
	// Espera a que el DOM esté completamente cargado.
	const menuNav = document.querySelector('#ScreenGroupMenu12068');

	if (!menuNav) {
		console.error('[initialize]: Main menu navigation element not found.');
		return;
	}

	await insertMenuNewWave();

	const switchState = localStorage.getItem(NEW_WAVE_ACTIVE_KEY);
	const isChecked = switchState === 'true' ? 'checked' : '';

	const switchHtml = /* html */ `
  <div class="switch-toggle-container">
    <div class="checkbox-wrapper-35">
      <input id="switch-new-wave" type="checkbox" class="switch" ${isChecked}>
      <label for="switch-new-wave">
        <span class="switch-x-text">New Wave: </span>
        <span class="switch-x-toggletext">
          <span class="switch-x-unchecked"><span class="switch-x-hiddenlabel">Unchecked: </span>Off</span>
          <span class="switch-x-checked"><span class="switch-x-hiddenlabel">Checked: </span>On</span>
        </span>
      </label>
    </div>
  </div>
  `;

	menuNav.insertAdjacentHTML('beforeend', switchHtml);

	// A small delay might be necessary for the page's framework to process the new DOM elements.
	await new Promise((resolve) => setTimeout(resolve, 50));
	setupSwitchToggle();
}

window.addEventListener('load', initialize, { once: true });
