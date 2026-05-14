class ModalManagerInventory extends ModalManager {
	constructor(configuration) {
		super(configuration);

		this.containerPrincipal = null;
		this.mapType = {
			itemLoc: (elemento) => {
				this._toggleClass(elemento, 'item-loc', 'internal-num');
			},
			internal: (elemento) => {
				this._toggleClass(elemento, 'internal-num', 'item-loc');
			},
			addInternal: (elemento) => {
				console.log('Cambio de clases');
			},
		};
	}

	_toggleClass(elemento, addClass, removeClass) {
		elemento.classList.add(addClass);
		elemento.classList.remove(removeClass);
	}

	updateModalContent(e) {
		const elemento = e.target;

		if (!elemento) {
			console.error('[updateModalContent] No se encontró el elemento');
			return;
		}

		const { type: inputType, dataset } = elemento;

		if (!dataset.type) {
			console.error('[updateModalContent] No se encontró el atributo [data-type].');
			return;
		}

		if (!this.containerPrincipal) {
			console.error('[updateModalContent] No se encontró el elemento .main-code-container');
			return;
		}

		if (inputType === 'checkbox') {
			this.containerPrincipal.classList.toggle(dataset.type, elemento.checked);
		} else if (inputType === 'radio' && this.mapType[dataset.type]) {
			this.mapType[dataset.type](this.containerPrincipal);
		}
	}

	_setEventListeners(selector, eventType = 'change') {
		const elements = document.querySelectorAll(selector);

		if (elements.length === 0) {
			console.error(`[setEventListeners] No se encontraron elementos para el selector: ${selector}`);
			return;
		}

		elements.forEach((element) => {
			element.addEventListener(eventType, (e) => this.updateModalContent(e));
		});
	}

	setEventListenerOpction() {
		const inputOptions = document.querySelectorAll(
			`#${this.modalId} .main-code-container .opcs-btn-container input.opc-btn`,
		);

		let lastClick = 0;
		let lastInput = null;

		inputOptions.forEach((input) => {
			input.addEventListener('click', (e) => {
				const now = Date.now();
				const isDoubleClick = now - lastClick < 300 && lastInput === input;

				if (isDoubleClick) {
					inputOptions.forEach((i) => (i.checked = false));

					input.checked = true;

					this.containerPrincipal.classList.remove('OH', 'AL', 'IT', 'SU');

					this.containerPrincipal.classList.add(input.dataset.type);
					setTimeout(() => {
						this.modalElement.querySelector(`.main-code-container .code-container #input_${input.dataset.type}`)?.focus();
					}, 100);
				} else {
					this.updateModalContent(e);
				}

				lastClick = now;
				lastInput = input;
			});
		});
	}


	setEventListenerOptionType() {
		this._setEventListeners(
			`#${this.modalId} .main-code-container .radio-container .radio-inputs input[name="type-mode"][type="radio"]`,
			'change',
		);
	}

	setEventListeners() {
		try {
			super.setEventListeners();

			// Event to copy
			const btnCopy = document.querySelector('.btn-copy-code');
			if (btnCopy) {
				btnCopy.addEventListener('click', () => this.modalHandler.handleCopyToClipBoar());
			}

			this.setEventListenerOpction();
			this.setEventListenerOptionType();
		} catch (error) {
			console.error('Error:[setEventListeners] Ha ocurrido un error al crear los eventListener', error);
		}
	}

	async modalFunction() {
		await super.modalFunction();
		this.containerPrincipal = document.querySelector(`#${this.modalId} .main-code-container`);
	}

	closeModal() {
		super.closeModal();
		this.modalHandler.resetSelectedRows();
	}
}
