(function () {
	console.log('[newWave.ts]');

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

	await delay(150);
}

async function inicio() {
	console.log('[newWave.js]: Inicio');
	
	document.body.classList.add('new-wave');

	await insertNewButtonSave();
	
	const isAutoRealize = await recoveryAutoREalizeValue();

	// Auto realize
	const autoRealize = document.querySelector(selector.autoRealize);

	try {
		if (autoRealize && isAutoRealize) {
			const storage = sessionStorage.getItem('waveData') ?? '{}';
			const { waveFlow, waveName } = JSON.parse(storage);
			console.log('[newWave.js]:', { waveFlow, waveName });
			if (!waveFlow || !waveName) {
				console.log('Auto Realice');
				autoRealize.click();
			}
		}
	} catch (error) {
		console.error('Ha ocurrido un error al asignar el valor de AutoRealize', error);
	}

	const btnCancel = document.querySelector('#AddWaveActionCancel');
	if (btnCancel) {
		btnCancel.addEventListener('click', () => localStorage.removeItem('newWaveActive'));
	} else {
		console.warn('[newWave.js]: No existe el button Cancel');
	}

	const newButtonSave = document.querySelector('.save-personality .new-button-save');
	if (newButtonSave) {
		newButtonSave.addEventListener('click', simulateClickSave);
	} else {
		console.warn('[newWave.js]: No existe el button Save');
	}

	const btnWaveMaster = document.querySelector('#ui-id-12');
	if (btnWaveMaster) {
		btnWaveMaster.addEventListener('click', () => document.body.classList.remove('new-wave'));
	} else {
		console.warn('[newWave.js]: No existe el button Wave Master');
	}

	const tbody = document.querySelector('#WaveFlowGrid > tbody');


	if (tbody) {
		tbody.addEventListener('dblclick', (e) => {
			console.log('dblclick');
			simulateClickSave();
		});
	} else {
		console.warn('[newWave.js]: tbody no encontrado');
	}

	console.log('[newWave.js]: Fin');
	
}


function simulateClickSave() {
	// Obtener el elemento para enviar un evento de clic
	const btnSave = document.querySelector('#NewWaveActionSave');
	console.log('[simulateClickSave]:', btnSave);
	

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

window.addEventListener('load', ()=> {
	try {
		inicio()
	} catch (error) {
		console.error('[newWave.js]: Error al iniciar', error);
	}
}, { once: true });
