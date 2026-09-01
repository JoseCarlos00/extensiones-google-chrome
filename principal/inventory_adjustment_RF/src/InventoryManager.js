// Se puede definir a nivel de módulo o como propiedad estática de InventoryManager
const SUBMIT_ERROR_CODES = {
	MSG_ITEM24: { field: 'item', message: 'The item and company combination does not exist.' },
	MSG_LOCATION08: { field: 'location', message: 'Location does not exist.' },
	MSG_INVVAL49: { field: 'LP', message: 'Adjustment failure. License plate must be specified.' },
};

export class InventoryManager {
	constructor({ formularioHTML, nameDataStorage, adjType, currentAdjType }) {
		this.formularioHTML = formularioHTML;
		this.nameDataStorage = nameDataStorage;
		this.adjType = adjType;
		this.currentAdjType = currentAdjType;

		this.objectStorage = this.getContentFromSessionStorage();
		this.dataStorage = this.objectStorage?.data ?? [];

		this.delaySubmit = 800;
		this.nameDataStoragePause = nameDataStorage + '_pause';
		this.pauseSubmit = this.getValuePauseSubmit();

		this.form = null;
		this.textareaForm = null;

		this.actionButton = {
			pause: null,
			cancel: null,
			insertData: null,
		};

		this.timeoutId = null;

		this.nameDataStoragePending = nameDataStorage + '_pending';
		this.nameDataStorageErrors = nameDataStorage + '_errors';
		this.errorsStorage = JSON.parse(sessionStorage.getItem(this.nameDataStorageErrors)) ?? [];

		if (this.adjType !== this.currentAdjType) {
			throw new Error(
				`El adjType actual:[${this.currentAdjType}] es diferente del adjType solicitado: ${this.adjType}`,
			);
		}

		console.log('objectStorage:', this.objectStorage);
	}

	delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

	async render() {
		try {
			this.processSubmitResult();

			this.renderCounters();
			await this.delay(50);

			this.renderForm();
			await this.delay(50);

			this.initializeElementsDOM();
			this.setEventsListener();
			this.setPauseValueInDOM();

			this.recoveryDataFromSessionStorage();

			// 2. Si ya no queda nada por insertar, mostrar resumen
			if (this.dataStorage?.length === 0 && this.errorsStorage.length > 0) {
				this.renderErrorSummary();
			}
		} catch (error) {
			console.error('Error al renderizar el formulario:', error.message);
		}
	}

	renderForm() {
		if (!this.formularioHTML) {
			throw new Error('Formulario no encontrado');
		}

		document.body.insertAdjacentHTML('afterbegin', this.formularioHTML);
		document.body.classList.add('change');
	}

	renderCounters() {
		const contadores = `
      <div class="contadores-container">
        <p>
        	Restantes:<spam id="countRestante">${this.dataStorage?.length}</spam>
        </p>
      </div>
      `;

		document.body.insertAdjacentHTML('beforeend', contadores);
	}

	getValuePauseSubmit() {
		return sessionStorage.getItem(this.nameDataStoragePause) === 'true';
	}

	initializeElementsDOM() {
		this.form = document.querySelector('#registroForm');

		if (!this.form) throw new Error('Formulario no encontrado [#registroForm]');

		const { dataToInsert, pause, cancel, insertData } = this.form;

		this.textareaForm = dataToInsert;
		this.actionButton.pause = pause;
		this.actionButton.cancel = cancel;
		this.actionButton.insertData = insertData;

		if (!this.textareaForm) throw new Error('Textarea element no encontrado');
		if (!this.actionButton.pause) throw new Error('Button de pausa no encontrado');
		if (!this.actionButton.cancel) throw new Error('Button de cancelar no encontrado');
		if (!this.actionButton.insertData) throw new Error('Button de insertar datos no encontrado');
	}

	async handleSubmitEvent(e) {
		try {
			e.preventDefault();

			const { dataToInsert } = this.form;

			if (!dataToInsert) {
				throw new Error("No se encontró el campo de texto [name='dataToInsert']");
			}

			if (!dataToInsert?.value?.trim()) {
				return;
			}

			// Dividir el texto en líneas
			const lineas =
				dataToInsert?.value
					?.trim()
					?.split('\n')
					?.map((i) => i?.trim()?.toUpperCase())
					?.filter(Boolean) ?? [];

			if (lineas.length === 0) {
				throw new Error('No hay líneas para insertar');
			}

			this.registerData({ lineas });
		} catch (error) {
			console.error('Error al manejar el evento handleSubmitEvent', error.message);
		}
	}

	setEventsListener() {
		try {
			const { textareaForm, actionButton, form } = this;

			textareaForm.addEventListener('keydown', ({ key }) => key === 'Enter' && (textareaForm.value += '\n'));

			form.addEventListener('submit', (e) => this.handleSubmitEvent(e));

			actionButton.cancel.addEventListener('click', (e) => this.handleCancelInsertData(e));
			actionButton.pause.addEventListener('click', () => this.handlePauseInsertData());
		} catch (error) {
			console.error('Error al agregar eventos:', error.message);
		}
	}

	handlePauseInsertData() {
		this.pauseSubmit = !this.pauseSubmit;
		this.saveDataToSessionStorage(this.nameDataStoragePause, this.pauseSubmit);

		this.setPauseValueInDOM(pause);
	}

	handleCancelInsertData() {
		const timeDelayReload = 250;

		if (this.dataStorage?.length === 0) {
			return;
		}

		// Mostrar una alerta que permita al usuario cancelar la ejecución de la función
		const confirmation = confirm(`¿Quieres cancelar?\nSe borraran los datos ingresados`);

		try {
			if (confirmation) {
				// Si el usuario confirma, cancelar la ejecución de la función
				sessionStorage.removeItem(this.nameDataStorage);

				setTimeout(() => {
					window.location.reload();
				}, timeDelayReload);
			}
		} catch (error) {
			console.error('Error: al cancelar: ', error.message);
		}
	}

	setPauseValueInDOM() {
		const value = this.pauseSubmit ? 'on' : 'off';
		this.actionButton.pause.setAttribute('pause-active', value);
		this.actionButton.pause.innerHTML = `Pausa: ${value}`;
	}

	saveDataToSessionStorage(nameStorage, data) {
		sessionStorage.setItem(nameStorage, JSON.stringify(data));
	}

	getContentFromSessionStorage() {
		return JSON.parse(sessionStorage.getItem(this.nameDataStorage)) ?? {};
	}

	updateCounter(value) {
		const counterE = document.querySelector('#countRestante');

		if (counterE) {
			counterE.innerHTML = `${value ?? ''}`;
		} else {
			console.warn('No se encontró el elemento #countRestante');
		}
	}

	recoveryDataFromSessionStorage() {
		// Objeto para almacenar los datos
		const { dataStorage } = this;

		if (!dataStorage) {
			console.error('No se encontró el Objeto [datosStorage] en la sesión:');
			return;
		}

		if (dataStorage?.length === 0) {
			console.warn('No hay datos guardados en la sesión');
			return;
		}

		if (this.pauseSubmit) {
			alert('Tiene activado la pausa, por favor desactivarla enviar formulario');
		}

		this.textareaForm.setAttribute('disabled', true);
		this.actionButton.insertData.setAttribute('disabled', true);

		console.log('Se encontraron datos guardados:', dataStorage?.length, dataStorage);

		this.updateCounter(dataStorage?.length);
		this.insertData(this.objectStorage);
	}

	registerData({ lineas }) {
		if (!Array.isArray(lineas) || lineas.length === 0) return;

		const data = lineas.map((linea) => this.parseLine(linea)).filter((entry) => entry !== null);

		if (data.length === 0) return;

		console.log('datos:', data);
		this.updateCounter(data.length);
		this.insertData({ type: this.adjType, data });
	}

	// Insertar datos en el Formulario
	insertData(dataStorage) {
		try {
			if (!dataStorage || !dataStorage.data || dataStorage.data.length === 0) return;
			console.log('insertarDatos', dataStorage);

			// Obtener la primera fila del Array
			const firstDataToInsert = dataStorage.data.shift() ?? null;

			if (!form1) {
				throw new Error('Formulario no encontrado [#form1]');
			}

			if (!firstDataToInsert) {
				throw new Error('No hay datos para insertar [firstDataToInsert]');
			}

			// Asignar valores al formulario
			this.valuesIntoForm({ firstDataToInsert });
			this.saveDataToSessionStorage(this.nameDataStorage, dataStorage);

			sessionStorage.setItem(this.nameDataStoragePending, JSON.stringify(firstDataToInsert));

			this.submitFormData();
		} catch (error) {
			console.error('Error al insertar datos:', error.message);
		}
	}

	clearExistingTimeout() {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}
	}

	setTimeoutSubmitForm() {
		this.clearExistingTimeout();

		this.timeoutId = setTimeout(() => this.submitFormData, 1000);

		// Limpiar el timeout original después de 10 minutos
		setTimeout(
			() => {
				this.clearExistingTimeout();
				console.log('Timeout de 10 minutos alcanzado, timeout original limpiado.');
			},
			10 * 60 * 1000,
		);
	}

	submitFormData() {
		if (this.pauseSubmit) {
			console.warn('El envío de datos se encuentra en pausa');
			return;
		}

		const dataInsertOk = this.verifyFormInsertData();

		if (!dataInsertOk) {
			console.warn(' No se pudo insertar los datos [dataInsertOk]');
			return;
		}

		const btnSubmit = document.querySelector('#submit1');

		if (!btnSubmit) {
			console.error('No se encontró el botón de submit');
			return;
		}

		setTimeout(() => {
			btnSubmit.click();
			console.log('click en OK');

			this.setTimeoutSubmitForm();
		}, this.delaySubmit);
	}

	// Lee el mensaje del servidor y decide si fue error o éxito
	processSubmitResult() {
		const params = new URLSearchParams(location.search);
		const msgCode = params.get('msg');

		const result = this.classifySubmitMessage(msgCode);

		if (result.status === 'error') {
			const pending = JSON.parse(sessionStorage.getItem(this.nameDataStoragePending)) ?? null;

			this.errorsStorage.push({
				...pending,
				code: result.code,
				field: result.field,
				message: result.message,
			});
			sessionStorage.setItem(this.nameDataStorageErrors, JSON.stringify(this.errorsStorage));
		}

		sessionStorage.removeItem(this.nameDataStoragePending);

		if (msgCode) {
			history.replaceState(null, '', location.pathname);
		}
	}

	classifySubmitMessage(msgCode) {
		if (!msgCode) {
			return { status: 'success' };
		}

		const known = SUBMIT_ERROR_CODES[msgCode];

		if (known) {
			return { status: 'error', code: msgCode, field: known.field, message: known.message };
		}

		// Código de error que aún no está mapeado: lo tratamos como error genérico
		// para no perder el registro silenciosamente.
		console.warn('Código de error no mapeado:', msgCode);
		return { status: 'error', code: msgCode, field: null, message: `Error desconocido (${msgCode})` };
	}

	renderErrorSummary() {
		const list = this.errorsStorage.map((e) => `<li>${e.item ?? ''} — ${e.msg}</li>`).join('');

		document.body.insertAdjacentHTML(
			'beforeend',
			`<div class="resumen-errores"><h3>Registros con error (${this.errorsStorage.length})</h3><ul>${list}</ul></div>`,
		);

		sessionStorage.removeItem(this.nameDataStorageErrors);
	}

	/* Métodos abstractos que deben ser implementados en las clases hijas */
	parseLine(_line) {
		throw new Error('Método parseLine() debe ser implementado en la subclase');
	}

	verifyFormInsertData() {
		throw new Error('verifyFormInsertData() no implementado');
	}
}
