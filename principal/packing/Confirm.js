class Confirm {
	constructor() {
		this.idButtonAction = 'insertButtonAction';
		this.idBUttonInitPacking = 'initPackingButton';
		this.idButtonUpdateInfo = 'updateInfoButton';

		this.inputItem1 = document.querySelector('#ItemInputEditingInput');
		this.inputItem2 = this.inputItem1?.parentElement?.querySelector('input[type=hidden]');

		this.inputQTY1 = document.querySelector('#QuantityToPackEditorValue');
		this.inputQTY2 = this.inputQTY1?.parentElement?.querySelector('input[type=hidden]');

		this.dataToInsert = [..._webUi.detailsScreenBinding.entityInJsonFormat.PackingDetails.DetailsToPack];
		this.buttonAdd = document.querySelector('#AddQuantity');

		this.initialize();
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
		const ul = document.querySelector('#navigationActions > ul.nav.navbar-nav.navbar-left.navbarposition');

		const li = `
    <li style=" margin-left: 23px; ">
      <a id="${this.idButtonAction}" href="javascript:;" data-toggle="detailpane" aria-label="Confirmar" data-balloon-pos="right" style="color: #fff;">
        <i class="far fa-clipboard navimage"></i>
      </a>
    </li>

		<li style=" margin-left: 23px; ">
      <button id="${this.idBUttonInitPacking}" data-toggle="detailpane" style="background-color: #4F93E4; color: #fff; margin-top: 10px; border: none; border-radius: 2px;">
        Iniciar Packing
      </button>
    </li>

		<li style=" margin-left: 23px; ">
      <a id="${this.idButtonUpdateInfo}" href="javascript:;" data-toggle="detailpane" aria-label="Actualizar Información" data-balloon-pos="right" style="color: #fff;">
        <i class="far fa-sync navimage"></i>
      </a>
    </li>
		`;

		if (!ul) {
			throw new Error('No se encontró el elemento <ul> a insertar');
		}

		ul.insertAdjacentHTML('beforeend', li);
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

		buttonAction.addEventListener('click', () => this.handleEvent());

		window.addEventListener('keydown', (e) => {
			if ((e.key === 'k' && e.ctrlKey) || (e.key === 'K' && e.ctrlKey)) {
				e.preventDefault();
				this.handleEvent();
			}
		});

		if (!buttonInitPacking) {
			throw new Error('No se encontró el button init packing element');
		}

		buttonInitPacking.addEventListener('click', async () => { // Make the event listener async
			// Deshabilitar el botón para evitar clics múltiples mientras se procesa
			buttonInitPacking.disabled = true;

			const processNext = async () => { // Make processNext async
				if (this.dataToInsert.length > 0) {
					const initialDataLength = _webUi.detailsScreenBinding.entityInJsonFormat.PackingDetails.DetailsToPack.length;

					this.handleEvent(); // Ejecuta el evento con el elemento

					const confirmButton = document
						.querySelector(
							'#ScreenGroupPanel13162 > scale-packing > div.row.packcomponent > span > div.row > div.col-md-9.col-lg-9 > div.row.infoPane > div.buttoncolumn.faIconSpacing.faIconRightMargin.pull-left > span:nth-child(1) > span > div'
						);

					this.inputQTY1?.focus();
					
					setTimeout(() => {
						confirmButton?.click(); // Simula el clic en el botón Confirmar después de un pequeño retraso
					}, 200);  // Delay to ensure UI is ready
					

					// Esto permite que la interfaz de usuario se actualice y evita bloqueos
					try {
						await this.waitForCondition(() => {
							return _webUi.detailsScreenBinding.entityInJsonFormat.PackingDetails.DetailsToPack.length < initialDataLength;
						}, 15000); // Increased maxTime to 15 seconds for UI processing
						processNext(); // Call next iteration after condition is met
					} catch (error) {
						console.error('Error al esperar la actualización de datos de la UI:', error.message);
						ToastAlert.showAlertFullTop('Error al procesar el packing. Intente de nuevo.', 'error');
						buttonInitPacking.disabled = false; // Re-enable button on error
					}
				} else {
					// Cuando dataToInsert está vacío, habilita el botón nuevamente
					buttonInitPacking.disabled = false;
					console.log('Todos los elementos han sido procesados.');
					buttonInitPacking.remove(); // Opcional: eliminar el botón después de completar
				}
			}

			await processNext(); // Start the async processing
		});


		const buttonUpdateInfo = document.getElementById(this.idButtonUpdateInfo);

		if (!buttonUpdateInfo) {
			throw new Error('No se encontró el button update info element');
		}

		buttonUpdateInfo.addEventListener('click', () => {
			this.dataToInsert = [..._webUi.detailsScreenBinding.entityInJsonFormat.PackingDetails.DetailsToPack];
			
			if (this.dataToInsert.length > 0) {
				const buttonAction = document.getElementById(this.idButtonAction);
				buttonAction.classList.remove('disabled');
			}

		})
	}

	handleEvent() {
		const firstRow = this.dataToInsert?.shift();
		console.log('firstRow:', firstRow);

		if (!firstRow) {
			const buttonAction = document.getElementById(this.idButtonAction);
			buttonAction.classList.add('disabled');
			return;
		}

		const { ITEM, AVAIL_QTY } = firstRow;

		if (!ITEM || !AVAIL_QTY) {
			return;
		}

		this.inputItem1.value = ITEM;
		this.inputItem2.value = ITEM;

		this.inputItem1.focus();

		if (this.buttonAdd) {
			for (let i = 1; i < AVAIL_QTY(); i++) {
				this.buttonAdd.click();
			}
		}
	}
}

const handleKey = (e) => {
	if ((e.key === 'k' && e.ctrlKey) || (e.key === 'K' && e.ctrlKey)) {
		e.preventDefault();
		new Confirm();
		window.removeEventListener('keydown', handleKey);
	}
};

window.addEventListener('keydown', handleKey);
