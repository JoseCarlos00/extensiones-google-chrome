const NAME_STORAGE_DATA = 'container-for-dock-transfer';
const NAME_STORAGE_DATA_ERROR = 'container-for-dock-transfer-error';
const NAME_STORAGE_DATA_ERROR_MSG = 'container-for-dock-transfer-error-msg';

let isStorage = false;

let countRestanteE = null;
let countActualE = null;
let countTotalE = null;
let containerCounter = null

let labelTitle = null;

const contenedoresHTML = /*html*/ `
<div class="container">
	<label class="label-title" for="containers">Contenedores</label>
	<textarea id="containers" class="textarea" style="opacity: 1" placeholder="FMA0002459969..." rows="5"></textarea>   
	<button class="bnt-transfer"><span>Button</span></button> 
</div>
`;

function saveErrorContainer(containerId, msg) {
	if (!containerId) return;

	const joinMsg = `${containerId}: ${msg}`;

	const storageData = JSON.parse(sessionStorage.getItem(NAME_STORAGE_DATA_ERROR) || '[]') || [];
	const storageDataMsg = JSON.parse(sessionStorage.getItem(NAME_STORAGE_DATA_ERROR_MSG) || '[]') || [];

	const uniqueContainers = new Set(storageDataMsg);
	if (uniqueContainers.has(joinMsg)) return;

	storageDataMsg.push(joinMsg);
	storageData.push(containerId);

	sessionStorage.setItem(NAME_STORAGE_DATA_ERROR_MSG, JSON.stringify(storageDataMsg));
	sessionStorage.setItem(NAME_STORAGE_DATA_ERROR, JSON.stringify(storageData));
}

function getErrorContainer() {
	const storageData = JSON.parse(sessionStorage.getItem(NAME_STORAGE_DATA_ERROR) || '[]') || [];
	const storageDataMsg = JSON.parse(sessionStorage.getItem(NAME_STORAGE_DATA_ERROR_MSG) || '[]') || [];

	return { storageData, storageDataMsg };
}

function setErrorContainer(labelTitle) {
	const { storageData, storageDataMsg } = getErrorContainer();
	console.log('Mensajes con error:');
	console.log(storageDataMsg.join('\n'));
	

	if (storageData.length === 0) return;

	const textareaE = document.querySelector('.container > .textarea');
	if (!textareaE) return;

	textareaE.value = storageData.join('\n');
	sessionStorage.removeItem(NAME_STORAGE_DATA_ERROR);
	sessionStorage.removeItem(NAME_STORAGE_DATA_ERROR_MSG);

	labelTitle && (labelTitle.textContent = 'Contenedores con errores');
}

/** Métodos ILS SCALE */
function validateCont() {
	if (jQuery.trim(_contIdObj.value).length == 0) {
		focusContainerId();

		if (isStorage) {
			saveErrorContainer(_contIdObj.value, document.getElementById('ContErrorMsg').value);
			reInitialize();
			console.error('Error: Cargar Siguiente LP. Moving to next container.');
			processNextContainer();
		} else {
			manh.ils.form.handleError(document.getElementById('ContErrorMsg').value);
		}
		return false;
	} else return true;
}

function validateDestLoc() {
	if (jQuery.trim(_destLocObj.value).length == 0) {
		focusDestinationLocation();

		if (isStorage) {
			saveErrorContainer(_contIdObj.value, document.getElementById('DestLocErrorMsg').value);
			reInitialize();
			console.error('Error: Cargar Siguiente LP. Moving to next container.');
			processNextContainer();
		} else {
			manh.ils.form.handleError(document.getElementById('DestLocErrorMsg').value);
		}
		return false;
	} else return true;
}

function handleTransferContainer(httpResponse) {
	if (httpResponse.statusCode == 200) {
		//read success message from server response
		manh.ils.utilities.statusBox.show(httpResponse.responseObject.Message);
		var currentTime = new Date().getTime();
		_processStartTime = '/Date(' + currentTime + '+0000)/';
		reInitialize();

		if (isStorage) {
			console.warn('Success: Cargar Siguiente LP');
			processNextContainer();
		}
	} else {
		var error = httpResponse.responseObject;
		if (error.ErrorType == manh.ils.errorType.toLocation) focusDestinationLocation();
		else focusContainerId();

		if (isStorage) {
			saveErrorContainer(_contIdObj.value, error.Message);
			reInitialize();
			console.error('Error: Cargar Siguiente LP. Moving to next container.');
			processNextContainer();
		} else {
			manh.ils.form.handleError(error.Message);
		}
	}
}

/** FIN */
function insertContainerID(containerID = '') {
	if (!containerID) return;

	_contIdObj.value = containerID;

	setTimeout(() => {
		getContainer();

		setTimeout(onSubmit, 1000);
	}, 1500);
}


async function insertarContadores() {
	const countersHtml = /*html*/ `
    <div class="containerContadores hidden">
      <p id='countRestante'>0</p>
      <p>LP: <span id="countActual">0</span> DE <span id="countTotal">0</span></p>
    </div>
    `;

	document.body?.insertAdjacentHTML('afterbegin', countersHtml);

	await new Promise(setTimeout, 100);

	countRestanteE = document.querySelector('#countRestante');
	countActualE = document.querySelector('#countActual');
	countTotalE = document.querySelector('#countTotal');
	containerCounter = document.querySelector('.containerContadores');
}

function updateCounters({ countRestante, countActual, countTotal }) {
	containerCounter && containerCounter.classList.remove('hidden');
	containerCounter && (containerCounter.hidden = false);

	countRestanteE && (countRestanteE.innerHTML = countRestante);
	countActualE && (countActualE.innerHTML = countActual);
	countTotalE && (countTotalE.innerHTML = countTotal);
}

function setContainers() {
	let containers = [];
	let counter = 1;

	const textareaE = document.querySelector('.container > .textarea');
	labelTitle && (labelTitle.textContent = 'Contenedores');

	if (textareaE?.value === '') return;

	const lineas = textareaE?.value?.trim().split('\n') || [];

	if (lineas.length === 0) return;

	lineas.forEach((linea) => {
		linea && containers.push({ containerId: linea.trim(), current: counter++ });
	});

	textareaE.value = '';
	
	const countTotal = containers.length;

	if (countTotal === 0) return;

	isStorage = true;
	const firstContainer = containers.shift();
	
	if (containers.length > 0) {
		sessionStorage.setItem(NAME_STORAGE_DATA, JSON.stringify({ containers, total: countTotal }));
	}

	updateCounters({ countActual: firstContainer.current, countTotal, countRestante: countTotal });
	insertContainerID(firstContainer.containerId);
}

function processNextContainer() {
	const storageData = sessionStorage.getItem(NAME_STORAGE_DATA);
	if (!storageData) {
		isStorage = false;

		if (!document.querySelector('.container')) {
			content();
		}
		return;
	}

	const dataContainerStorage = JSON.parse(storageData);
	let { containers = [], total: countTotal } = dataContainerStorage;
	const countRestante = containers.length;

	if (countRestante === 0) {
		// Last container was processed.
		sessionStorage.removeItem(NAME_STORAGE_DATA);
		isStorage = false;

		updateCounters({
			countRestante: 0,
			countActual: countTotal,
			countTotal: countTotal,
		});

		console.log('[Dock Transfer]: All containers processed successfully.');

		setTimeout(() => {
			updateCounters({ countRestante: 0, countActual: 0, countTotal: 0 });

			containerCounter.hidden = true;
			containerCounter.classList.add('hidden');

			if (!document.querySelector('.container')) {
				content();
			}

			manh.ils.utilities.statusBox.show('All containers processed successfully');
			setErrorContainer(labelTitle);
		}, 2000);

		return;
	}

	const nextContainer = containers.shift();
	sessionStorage.setItem(NAME_STORAGE_DATA, JSON.stringify({ containers, total: countTotal }));

	updateCounters({
		countActual: nextContainer.current,
		countTotal,
		countRestante,
	});

	insertContainerID(nextContainer.containerId);
}

async function content() {
	document.body?.insertAdjacentHTML('afterbegin', contenedoresHTML);

	await new Promise(setTimeout, 100);
	
	labelTitle = document.querySelector('.label-title');

	document.querySelector('.bnt-transfer')?.removeEventListener('click', setContainers);
	document.querySelector('.bnt-transfer')?.addEventListener('click', setContainers);
}

window.addEventListener('load', async () => {
	isStorage = false;
	await insertarContadores();


	try {
		const storageData = sessionStorage.getItem(NAME_STORAGE_DATA);

		if (!storageData) {
			content();
			return;
		}

		const dataContainerStorage = JSON.parse(storageData) || {};
		const { containers = [], total: countTotal } = dataContainerStorage;

		const countRestante = containers.length;

		if (containers.length === 0) {
			sessionStorage.removeItem(NAME_STORAGE_DATA);
			content();
			return;
		}

		// Obtén el primer objeto del array
		const firstContainer = containers.shift();
		if (!firstContainer) content();

		isStorage = true;
		containerCounter && containerCounter.classList.remove('hidden');
		containerCounter && (containerCounter.hidden = false);

		sessionStorage.setItem(NAME_STORAGE_DATA, JSON.stringify({ containers, total: countTotal }));

		updateCounters({ countActual: firstContainer.current, countTotal, countRestante });

		insertContainerID(firstContainer.containerId);
	} catch (error) {
		console.error('[Dock Transfer]: Ha ocurrido un error', error);
	}
});
