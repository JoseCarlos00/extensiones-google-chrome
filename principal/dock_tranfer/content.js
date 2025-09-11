const NAME_STORAGE_DATA = 'container-for-dock-transfer';
let isStorage = false;

const contenedoresHTML = /*html*/ `
<div class="container">
	<button class="dockTransfer-button"><svg fill="currentColor" class="icon" title="Inserta lista de contenedores" width="32" height="36" viewBox="0 0 49 38" xmlns="http://www.w3.org/2000/svg">
		<path d="M0.299927 10.6164V9.11638C0.299927 7.87372 1.30727 6.86638 2.54993 6.86638H36.2999V2.36638C36.2999 0.363223 38.728 -0.637558 40.141 0.775348L47.641 8.27535C48.5196 9.15407 48.5196 10.5787 47.641 11.4573L40.141 18.9573C38.7333 20.3647 36.2999 19.3779 36.2999 17.3664V12.8664H2.54993C1.30727 12.8664 0.299927 11.859 0.299927 10.6164ZM46.0499 24.8664H12.2999V20.3664C12.2999 18.3682 9.87536 17.3589 8.4589 18.7753L0.958895 26.2753C0.0802705 27.1541 0.0802705 28.5787 0.958895 29.4573L8.4589 36.9573C9.86777 38.3661 12.2999 37.3761 12.2999 35.3664V30.8664H46.0499C47.2926 30.8664 48.2999 29.859 48.2999 28.6164V27.1164C48.2999 25.8737 47.2926 24.8664 46.0499 24.8664Z"></path>
		</svg>
	</button>

	<textarea class="textarea" style="opacity: 0" placeholder="FMA0002459969..." rows="5"></textarea>    
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

async function insertarContadores({ countActual = 0, countTotal = 0, countRestante = 0 }) {
	const countersHtml = /*html*/ `
    <div class="containerContadores">
      <p id='countRestante'>${countRestante}</p>
      <p>LP: <span id="countActual">${countActual}</span> DE <span id="countTotal">${countTotal}</span></p>
    </div>
    `;

	body.insertAdjacentHTML('afterbegin', countersHtml);

	await new Promise(setTimeout, 100);

	// const countRestanteE = document.querySelector('#countRestante');
	// const countActualE = document.querySelector('#countActual');
	// const countTotalE = document.querySelector('#countTotal');

	// countRestanteE.innerHTML = countRestante;
	// countActualE.innerHTML = countActual;
	// countTotalE.innerHTML = countTotal;
}

function setContainers() {
	let containers = [];
	let counter = 1;

	const textareaE = document.querySelector('div.container-contenedores > .textarea');
	if (textareaE.value === '') return;

	const lineas = textareaE?.value?.trim().split('\n') || [];

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
	
	if (countTotal > 0) {
		sessionStorage.setItem(NAME_STORAGE_DATA, JSON.stringify({ containers, total: countTotal }));
	}
	
	insertarContadores({ countActual: countTotal, countTotal, countRestante: countTotal }).finally(() => {
		// insertContainerID(firstContainer.containerId);
	});;

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
			// insertContainerID('LP');
		}
	} else {
		var error = httpResponse.responseObject;
		if (error.ErrorType == manh.ils.errorType.toLocation) focusDestinationLocation();
		else focusContainerId();

		if (isStorage) {
			reInitialize();
			console.error('Error: Cargar Siguiente LP');
			// insertContainerID('FMA0003646895');
		} else {
			manh.ils.form.handleError(error.Message);
		}
	}
}

async function content() {
	document.body?.insertAdjacentHTML('afterbegin', contenedoresHTML);

	await new Promise(setTimeout, 100);

	document.querySelector('.dockTransfer-button').addEventListener(
		'click',
		() => {
			document.querySelector('div.container > .textarea').style.opacity = 1;
			document.querySelector('.dockTransfer-button')?.addEventListener('click', setContainers, { once: true });
		},
		{ once: true }
	);
}

window.addEventListener('load', async () => {
	isStorage = false;

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

		sessionStorage.setItem(NAME_STORAGE_DATA, JSON.stringify({ containers, total }));

		await insertarContadores({ countActual: firstContainer.current, countTotal, countRestante });

		// insertContainerID(firstContainer.containerId);
	} catch (error) {
		console.error('[Dock Transfer]: Ha ocurrido un error', error);
	}
});
