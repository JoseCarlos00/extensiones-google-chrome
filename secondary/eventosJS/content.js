const nameStorage = 'isShowLog';
let isShowLog = JSON.parse(localStorage.getItem(nameStorage) ?? '{"isShowLog":false}');

function setEventStorage() {
	window.addEventListener('storage', (event) => {
		if (event.key === nameStorage) {
			console.log('storage:', {name: event.key, newValue: event.newValue });
			
			isShowLog = JSON.parse(event.newValue ?? '{"isShowLog":false}');
		}
	});
}

function setEventKeydown() {
	const actionsButtons = {
		menuCanvas: document.getElementById('clickMenuCanvas'),
		closeCanvas: document.getElementById('clickCloseCanvas'),
		menuFilter: document.getElementById('clickMenuFilter'),
		actionPlay: document.getElementById('clickActionPlay'),
	};

	const actionInsight = {
		menuCanvas: { action: document.getElementById('menutoggle'), close: document.getElementById('systemmenuclose') },
		actionPlay: document.getElementById('InsightMenuApply'),
		menuFilter: {
			action: document.querySelector('li.navsearch.visible-sm.visible-md.visible-lg > a'),
			content: document.querySelector('.searchpanepart'),
		},
	};

	if (!actionInsight) {
		const { menuCanvas, actionPlay, menuFilter } = actionInsight;

		if (!menuCanvas.action || !actionPlay || !menuFilter.action) {
			return;
		}

		return;
	}

	window.addEventListener('keydown', ({ ctrlKey, shiftKey, altKey, key }) => {
		if (isShowLog && isShowLog.isShowLog === true) {
			console.log({ key, ctrlKey, shiftKey, altKey });
		}

		// Verifica si se presionó Ctrl (Control) y Shift al mismo tiempo
		if (ctrlKey && shiftKey) {
			if (key === 'f' || key === 'F') {
				actionsButtons.menuFilter?.click();
			}
			return;
		}

		/** Menu principal Ctrl + m*/
		if (ctrlKey && (key === 'm' || key === 'M')) {
			actionsButtons.menuCanvas?.click();
			return;
		}

		/** Boton play Alt + p */
		if (altKey && (key === 'p' || key === 'P')) {
			console.log('actionsButtons.actionPlay');

			actionsButtons.actionPlay?.click();
			return;
		}

		if (key === 'Escape') {
			// Cerar modal and filters

			if (document.body.classList.contains('sidr-open')) {
				actionsButtons.closeCanvas?.click();
				return;
			}

			if (actionInsight.menuFilter.content?.style.display === 'block') {
				actionsButtons.menuFilter?.click();
			}
		}
	});

	actionsButtons.menuCanvas.addEventListener('click', () => simulateClickForElement(actionInsight.menuCanvas.action));
	actionsButtons.menuFilter.addEventListener('click', () => simulateClickForElement(actionInsight.menuFilter.action));
	actionsButtons.actionPlay.addEventListener('click', () => simulateClickForElement(actionInsight.actionPlay));

	// Action close
	actionsButtons.closeCanvas.addEventListener('click', () => simulateClickForElement(actionInsight.menuCanvas.close));
}

function simulateClickForElement(element) {
	if (!element) {
		console.error('[simulateClickForElement]: Element is not defined');
		return;
	}

	const clickEvent = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window,
	});

	element.dispatchEvent(clickEvent);
}

function createAnchorElement(id) {
	const anchor = document.createElement('a');
	anchor.href = 'javaScript:void(0)';
	anchor.setAttribute('hidden', true);
	anchor.id = id;

	return anchor;
}

async function insertAnchorElement() {
	const container = document.createElement('div');

	const menuCanvas = createAnchorElement('clickMenuCanvas');
	const closeCanvas = createAnchorElement('clickCloseCanvas');

	const menuFilter = createAnchorElement('clickMenuFilter');
	const actionPlay = createAnchorElement('clickActionPlay');

	container.append(menuCanvas, menuFilter, actionPlay, closeCanvas); // Agregar el anchor al div

	document.body.appendChild(container);

	await new Promise((resolve) => setTimeout(resolve, 100));
}

window.addEventListener('load', async () => {
	try {
		await insertAnchorElement();
		setEventStorage();
		setEventKeydown();
	} catch (error) {
		console.error('Ha ocurrido un error al crear "EVENTOS JS"');
		
	}
});
