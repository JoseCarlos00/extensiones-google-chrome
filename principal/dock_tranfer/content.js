const NAME_STORAGE_DATA = 'container-for-dock-transfer';
let isStorage = false;

let countRestanteE = null;
let countActualE = null;
let countTotalE = null;
let containerCounter = null


const contenedoresHTML = /*html*/ `
<div class="container">
	<label for="containers">Contenedores</label>
	<textarea id="containers" class="textarea" style="opacity: 1" placeholder="FMA0002459969..." rows="5"></textarea>   
	<button class="bnt-transfer"><span>Button</span></button> 
</div>
`;

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

	countRestanteE && (countRestanteE.innerHTML = countRestante);
	countActualE && (countActualE.innerHTML = countActual);
	countTotalE && (countTotalE.innerHTML = countTotal);
}

function setContainers() {
	let containers = [];
	let counter = 1;

	const textareaE = document.querySelector('.container > .textarea');
	console.log('textareaE:', textareaE);
	
	if (textareaE?.value === '') return;

	const lineas = textareaE?.value?.trim().split('\n') || [];

	console.log('lineas:', lineas);
	
	if (lineas.length === 0) return;

	lineas.forEach((linea) => {
		linea && containers.push({ containerId: linea.trim(), current: counter++ });
	});

	textareaE.value = '';
	console.log('contenedores:', containers);

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
		containerCounter.hidden = true;
		

		updateCounters({
			countRestante: 0,
			countActual: countTotal,
			countTotal: countTotal,
		});

		console.log('[Dock Transfer]: All containers processed successfully.');

		setTimeout(() => {
			updateCounters({ countRestante: 0, countActual: 0, countTotal: 0 });

			if (!document.querySelector('.container')) {
				content();
			}

			manh.ils.utilities.statusBox.show('All containers processed successfully');
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
			reInitialize();
			console.error('Error: Cargar Siguiente LP. Moving to next container.');
			processNextContainer();
		} else {
			manh.ils.form.handleError(error.Message);
		}
	}
}

async function content() {
	document.body?.insertAdjacentHTML('afterbegin', contenedoresHTML);

	await new Promise(setTimeout, 100);
	

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

		sessionStorage.setItem(NAME_STORAGE_DATA, JSON.stringify({ containers, total: countTotal }));

		updateCounters({ countActual: firstContainer.current, countTotal, countRestante });

		insertContainerID(firstContainer.containerId);
	} catch (error) {
		console.error('[Dock Transfer]: Ha ocurrido un error', error);
	}
});
