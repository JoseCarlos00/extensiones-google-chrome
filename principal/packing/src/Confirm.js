import ToastAlert from './ToastAlert';
import { PACKING_PROMPT_ID } from "./index";

const nameStorageItemsForPacking = 'ListOFItemsForPacking';
const eventItemsForPacking = 'packing-items-updated';


export class Confirm {
	static elementToInsert = document.querySelector('#navigationActions > ul.nav.navbar-nav.navbar-left.navbarposition');

	constructor() {
		this.idButtonAction = 'insertButtonAction';
		this.idBUttonInitPacking = 'initPackingButton';
		this.idButtonUpdateInfo = 'updateInfoButton';
		this.idButtonInsertList = 'insetListButtonAction';

		this.inputItem1 = document.querySelector('#ItemInputEditingInput');
		this.inputItem2 = this.inputItem1?.parentElement?.querySelector('input[type=hidden]');

		this.inputQTY1 = document.querySelector('#QuantityToPackEditorValue');
		this.inputQTY2 = this.inputQTY1?.parentElement?.querySelector('input[type=hidden]');

		this.inputContainerId = document.querySelector('#ContainerIdInputEditingInput');

		this.PackingDetails = _webUi.detailsScreenBinding.entityInJsonFormat.PackingDetails;
		this.DetailsToPack = this.PackingDetails?.DetailsToPack ?? [];

		this.dataToInsert = [...this.DetailsToPack];
		this.buttonAdd = document.querySelector('#AddQuantity');

		this.data = [];
	}

	async initialize() {
		try {
			this.insertButtonAction();
			await new Promise((resolve) => setTimeout(resolve, 100));
			this.setupEventListener();
		} catch (error) {
			console.error('Error:');
		}
	}

	insertButtonAction() {
		const liButtons = `
		 <li style=" margin-left: 23px; ">
      <a id="${this.idButtonInsertList}" href="javascript:;" data-toggle="detailpane" aria-label="Insertar un Item" data-balloon-pos="right" style="color: #fff;">
        <i class="far fa-plus-circle navimage"></i>
      </a>
    </li>

    <li style=" margin-left: 23px; ">
      <a id="${this.idButtonAction}" href="javascript:;" data-toggle="detailpane" aria-label="Insertar un Item" data-balloon-pos="right" style="color: #fff;">
        <i class="far fa-clipboard navimage"></i>
      </a>
    </li>

		<li style=" margin-left: 23px; ">
      <button id="${this.idBUttonInitPacking}" data-toggle="detailpane" style="background-color: #4F93E4; color: #fff; margin-top: 10px; border: none; border-radius: 2px;">
        Iniciar Packing Automatico
      </button>
    </li>

		<li style=" margin-left: 23px; ">
      <a id="${this.idButtonUpdateInfo}" href="javascript:;" data-toggle="detailpane" aria-label="Actualizar Información" data-balloon-pos="right" style="color: #fff;">
        <i class="far fa-sync navimage"></i>
      </a>
    </li>
		`;

		if (!Confirm.elementToInsert) {
			throw new Error('No se encontró el elemento <ul> a insertar para los botones.');
		}

		const existingPrompt = document.getElementById(PACKING_PROMPT_ID);

		if (existingPrompt) {
			// Replace the prompt with the buttons
			existingPrompt.outerHTML = liButtons;
		} else {
			// Insert the buttons if no prompt exists (shouldn't happen if index.js runs first)
			Confirm.elementToInsert.insertAdjacentHTML('beforeend', liButtons);
		}
	}

	/**
	 * Waits for a given condition to be true.
	 * @param {function(): boolean} conditionFn - The function that returns true when the condition is met.
	 * @param {number} maxTime - Maximum time to wait in milliseconds.
	 * @param {number} interval - Interval to check the condition in milliseconds.
	 * @returns {Promise<void>} A promise that resolves when the condition is met or rejects if maxTime is exceeded.
	 */
	async waitForCondition(conditionFn, maxTime = 8000, interval = 100) {
		const startTime = Date.now();
		return new Promise((resolve, reject) => {
			const check = () => {
				if (conditionFn()) {
					resolve();
				} else if (Date.now() - startTime >= maxTime) {
					reject(new Error(`Condition not met within ${maxTime}ms`));
				} else {
					setTimeout(check, interval);
				}
			};
			check();
		});
	}

	setupEventListener() {
		const buttonAction = document.getElementById(this.idButtonAction);
		const buttonInitPacking = document.getElementById(this.idBUttonInitPacking);

		if (!buttonAction) {
			throw new Error('No se encontró el button action element');
		}

		buttonAction.addEventListener('click', () => {
			if (!this.verifyExistContainerId()) {
				return;
			}

			this.handleEvent();
		});

		window.addEventListener('keydown', (e) => {
			if ((e.key === 'k' && e.ctrlKey) || (e.key === 'K' && e.ctrlKey)) {
				e.preventDefault();

				if (!this.verifyExistContainerId()) {
					return;
				}

				this.handleEvent();
			}
		});

		window.addEventListener(eventItemsForPacking, () => {
			this.handleStorageItems();
		});

		if (!buttonInitPacking) {
			throw new Error('No se encontró el button init packing element');
		}

		buttonInitPacking.addEventListener('click', async () => {
			await this.startAutomaticPacking();
		});

		const buttonUpdateInfo = document.getElementById(this.idButtonUpdateInfo);

		if (!buttonUpdateInfo) {
			throw new Error('No se encontró el button update info element');
		}

		buttonUpdateInfo.addEventListener('click', () => {
			this.dataToInsert = [...this.DetailsToPack];

			if (this.dataToInsert.length > 0) {
				const buttonAction = document.getElementById(this.idButtonAction);
				buttonAction.classList.remove('disabled');
				ToastAlert.showAlertMinBottom('Información actualizada', 'success');
			}
		});
	}

	handleStorageItems() {
		const storedData = window.sessionStorage.getItem(nameStorageItemsForPacking);

		if (!storedData) {
			return;
		}

		try {
			const items = JSON.parse(storedData);

			if (!Array.isArray(items) || items.length === 0) {
				return;
			}

			console.log('Items del modal:', items);

			this.dataToInsert = items.map(({ sku, qty }) => ({
				ITEM: sku,
				AVAIL_QTY: Number(qty),
			}));

			this.startAutomaticPacking();
		} catch (error) {
			console.error('Error leyendo los items:', error);
		}
	}

	async startAutomaticPacking() {
		const buttonInitPacking = document.getElementById(this.idBUttonInitPacking);

		if (!buttonInitPacking) {
			console.error('No se encontró el botón de init packing');
			return;
		}

		buttonInitPacking.disabled = true;

		const processNext = async () => {
			if (!this.verifyExistContainerId()) {
				buttonInitPacking.disabled = false;
				return;
			}

			if (this.dataToInsert.length > 0) {
				const initialDataLength = this.DetailsToPack.length;

				this.handleEvent();

				const confirmButton = document.querySelector(
					'#ScreenGroupPanel13162 > scale-packing > div.row.packcomponent > span > div.row > div.col-md-9.col-lg-9 > div.row.infoPane > div.buttoncolumn.faIconSpacing.faIconRightMargin.pull-left > span:nth-child(1) > span > div',
				);

				this.inputQTY1?.focus();

				setTimeout(() => {
					confirmButton?.click();
				}, 200);

				try {
					await this.waitForCondition(() => {
						return this.DetailsToPack.length < initialDataLength;
					}, 15000);

					await processNext();
				} catch (error) {
					console.error('Error al esperar la actualización de datos de la UI:', error.message);

					ToastAlert.showAlertFullTop('Error al procesar el packing. Intente de nuevo.', 'error');

					buttonInitPacking.disabled = false;
				}
			} else {
				buttonInitPacking.disabled = false;

				console.log('Todos los elementos han sido procesados.');

				// buttonInitPacking.remove();
			}
		};

		await processNext();
	}

	handleStorageItems() {
		const storedData = window.sessionStorage.getItem(nameStorageItemsForPacking);

		if (!storedData) {
			return;
		}

		try {
			const items = JSON.parse(storedData);

			if (!Array.isArray(items) || items.length === 0) {
				return;
			}

			console.log('Items recibidos desde sessionStorage:', items);

			this.dataToInsert = items.map(({ sku, qty }) => ({
				ITEM: sku,
				AVAIL_QTY: Number(qty),
			}));

			this.startAutomaticPacking();
		} catch (error) {
			console.error('Error al leer ListOFItemsForPacking:', error);
		}
	}

	verifyExistContainerId() {
		if (this.inputContainerId && this.inputContainerId.value.trim() === '') {
			ToastAlert.showAlertFullTop('Ingrese un Contenedor para continuar', 'error');
			return false;
		}
		return true;
	}

	handleEvent() {
		if (this.dataToInsert.length === 0) {
			return;
		}

		const firstRow = this.dataToInsert.shift();

		console.log('firstRow:', firstRow);

		if (!firstRow) {
			const buttonAction = document.getElementById(this.idButtonAction);
			buttonAction?.classList.add('disabled');
			return;
		}

		const { ITEM, AVAIL_QTY } = firstRow;

		if (!ITEM || AVAIL_QTY == null) {
			return;
		}

		this.inputItem1.value = ITEM;
		this.inputItem2.value = ITEM;

		this.inputItem1.focus();

		const quantity = typeof AVAIL_QTY === 'function' ? AVAIL_QTY() : Number(AVAIL_QTY);

		if (this.buttonAdd) {
			for (let i = 1; i < quantity; i++) {
				this.buttonAdd.click();
			}
		}
	}
}
