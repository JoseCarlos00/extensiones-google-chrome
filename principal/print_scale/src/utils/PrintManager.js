export class PrintManager {
	constructor() {
		this.table = document.getElementById('content');
		this.tbodyStringContent;
		this.theadStringContent;

		this.tbodyElementContent;
		this.theadElementContent;

		this.columnIndex = {
			status1: -1,
		};

		this.mapIndex = [{ key: 'status1', values: ['status 1'] }];

		this.init();
	}

	delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

	async init() {
		try {
			this.setTableDataFromParams();
			await this.delay(50);

			this.insertTableInDOM();
			await this.delay(50);

			this.cleanThead();

			await this.setColumnIndex();
			await this.createCheckBox();

			this.filteredRow();

			setTimeout(() => window.print(), 500);
		} catch (error) {
			console.error(error);
		}
	}

	filteredRow() {}

	setTableDataFromParams() {
		const urlParams = new URLSearchParams(window.location.search);
		const thead = urlParams.get('thead');
		const tbody = urlParams.get('tbody');

		if (!thead) {
			throw new Error('thead is empty');
		}

		if (!tbody) {
			throw new Error('tbody is empty');
		}

		this.tbodyStringContent = tbody;
		this.theadStringContent = thead;
	}

	insertTableInDOM() {
		const { table } = this;

		if (!table) {
			throw new Error('No se encontró la <table> a insertar');
		}

		const theadElement = document.createElement('thead');
		const tbodyElement = document.createElement('tbody');

		theadElement.innerHTML = this.theadStringContent;
		tbodyElement.innerHTML = decodeURIComponent(this.tbodyStringContent);

		this.theadElementContent = theadElement;
		this.tbodyElementContent = tbodyElement;

		table.insertAdjacentElement('beforeend', theadElement);
		table.insertAdjacentElement('beforeend', tbodyElement);
	}

	cleanThead() {
		// Seleccionar el <thead> original y las filas <tr> dentro de él
		const originalThead = document.querySelector('#content > thead');
		const headers = originalThead.querySelectorAll('tr th');

		const rowOld = originalThead.querySelector('tr');

		if (!originalThead) {
			console.error('No se encontró el <thead> en la <table>');
			return;
		}

		if (headers.length === 0) {
			console.warn('No hay filas en el <tr>');
			return;
		}

		// Crear un nuevo elemento <tr>
		const rowNew = document.createElement('tr');

		headers.forEach((th) => {
			const thNew = document.createElement('th');
			const thText = th.textContent.trim();

			thNew.textContent = thText;

			rowNew.appendChild(thNew);
		});

		// Reemplazar el <tr> antiguo con el nuevo
		originalThead.replaceChild(rowNew, rowOld);
	}

	async createCheckBox() {}

	async setColumnIndex() {
		const { table } = this;

		if (!table) {
			throw new Error('No se encontró el elemento <table>');
		}

		const headerRow = table.rows[0] ? Array.from(table.rows[0].cells) : [];

		if (headerRow.length === 0) {
			throw new Error('No hay filas en Header Row');
		}

		// Reiniciar índices de columnas a -1
		Object.keys(this.columnIndex).forEach((key) => {
			this.columnIndex[key] = -1;
		});

		// Buscar los índices de las columnas
		headerRow.forEach((th, index) => {
			const text = th.textContent.trim().toLowerCase();

			this.mapIndex.forEach(({ key, values }) => {
				if (values.includes(text)) {
					this.columnIndex[key] = index;
				}
			});
		});
	}
}
