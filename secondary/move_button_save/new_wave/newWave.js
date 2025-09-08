(function () {
	console.log('[loader.ts]');

	const script = document.createElement('script');
	// script.type = 'module'; // ¡Esta es la línea clave!
	// Obtenemos la URL del script principal desde los recursos de la extensión.
	script.src = chrome.runtime.getURL('new_wave/createNewWave.js');
	// Lo añadimos al <head> de la página para que se cargue y ejecute.
	(document.head || document.documentElement).appendChild(script);
})();


const selector = {
	autoRealize: '#ScreenControlToggleSwitch37984 > div > div > div',
	btnYes: '#ScreenControlToggleSwitch37984 > div > div',
	btnSave: '#NewWaveMenu > li.dropdownaction.menubutton.menubuttonsave',
};

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function recoveryAutoREalizeValue() {
	const storedData = (await chrome.storage.local.get('autoRealize')) || {};
	const autoRealize = storedData.autoRealize || false;

	return autoRealize;
}

async function insertNewButtonSave() {
	const elementForReference = document.querySelector('#ScreenControlToggleSwitch37984 > div');
	const newButton = /*html*/ `
		<div tabindex="0" class="save-personality">
    	<input class="btn new-button-save" value="Save" type="button" />
		</div>`;

	if (!elementForReference) {
		console.error('[insertNewButtonSave]: Elemento no encontrado');
		return;
	}

	elementForReference.insertAdjacentHTML('beforeend', newButton);
}

async function inicio() {
	document.body.classList.add('new-wave');

	await insertNewButtonSave();
	// const liElementSave = document.querySelector(selector.btnSave);
	const isAutoRealize = await recoveryAutoREalizeValue();

	await delay(150);

	// Auto realize
	const autoRealize = document.querySelector(selector.autoRealize);
	if (autoRealize && isAutoRealize) {
		autoRealize.click();
	}

	const btnCancel = document.querySelector('#AddWaveActionCancel');
	btnCancel?.addEventListener('click', () => localStorage.removeItem('newWaveActive'));

	const newButtonSave = document.querySelector('.save-personality .new-button-save');
	newButtonSave?.addEventListener('click', simulateClickSave);

	await delay(150);

	const btnWaveMaster = document.querySelector('#ui-id-12');
	btnWaveMaster?.addEventListener('click', () => document.body.classList.remove('new-wave'));

	const tbody = document.querySelector('#WaveFlowGrid > tbody');
	const btnSave = document.querySelector('#NewWaveActionSave');

	if (tbody) {
		tbody.addEventListener('dblclick', (e) => {
			btnSave?.click();
		});
	}
}


function simulateClickSave() {
	// Obtener el elemento para enviar un evento de clic
	const btnSave = document.querySelector('#NewWaveActionSave');

	if (!btnSave) {
		console.error('[simulateClickSave]: Elemento no encontrado');
		return;
	}

	// Crear un MouseEvent de clic artificial
	let evt = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window,
	});

	// Enviar el evento al elemento de la casilla de verificación
	btnSave.dispatchEvent(evt);
}

function setEventClickMenuWaveMaster() {
	const btn = document.querySelector('#ui-id-12');

	if (!btn) {
		console.warn('No existe el button Wave Master');
		return;
	}

	btn.addEventListener('click', () => {
		document.body.classList.remove('new-wave');
	});
}

window.addEventListener('load', inicio, { once: true });
