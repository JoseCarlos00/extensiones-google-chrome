class Confirm {
	constructor() {
		this.idButtonAction = 'insertButtonAction';
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
      <a id="${this.idButtonAction}" href="#" data-toggle="detailpane" aria-label="Confirmar" data-balloon-pos="right" class="">
        <i class="far fa-clipboard navimage"></i>
      </a>
    </li>`;

		if (!ul) {
			throw new Error('No se encontró el elemento <ul> a insertar');
		}

		ul.insertAdjacentHTML('beforeend', li);
	}

	setupEventListener() {
		const buttonAction = document.getElementById(this.idButtonAction);

		if (!buttonAction) {
			throw new Error('No se encontró el button action element');
		}

		buttonAction.addEventListener('click', (e) => this.handleEvent(e));

		window.addEventListener('keydown', (e) => {
			if ((e.key === 'k' && e.ctrlKey) || (e.key === 'K' && e.ctrlKey)) {
				e.preventDefault();
				this.handleEvent();
			}
		});
	}

	handleEvent() {
		const firstRow = this.dataToInsert?.shift();
		console.log('firstRow:', firstRow);

		if (!firstRow) {
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
