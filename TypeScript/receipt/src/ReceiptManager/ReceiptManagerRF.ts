import type { DataDevoluciones, DataTarimas, DataTraslados } from "../save-data/IReceiptTypeHandler"
import { LocalStorageHelper } from "../utils/LocalStorageHelper"

type ContainerItem = {
	containers: string[];
};

type StorageData<T> = {
	dataContainer: T[];
	receiptType: string;
};

type StorageDataTraslados = StorageData<DataTraslados>;
type StorageDataDevoluciones = StorageData<DataDevoluciones>;
type StorageDataTarimas = StorageData<DataTarimas>;

export interface ReceiptManagerRFConfig<T>  {
	autoComplete: boolean;
	confirmOk: boolean;
	confirmDelay: number;
	receiptType: string;
	eventStorageChange: string;
	nameDataStorage: string;
}

export abstract class ReceiptManagerRF<T> {
	protected autoComplete: boolean;
	protected confirmOk: boolean;
	protected confirmDelay: number;
	protected dataStorage: StorageData<T> | null;
	protected dataContainerStorage: T[];
	protected btnOk: HTMLButtonElement | null = null;

	private initReceipt: boolean;
	private currentReceiptType: string;
	private receiptType: string | undefined;

	private inputLicensePlate: HTMLInputElement | null = null;
	private btnDone: HTMLButtonElement | null = null;

	private readonly nameStorage = {
		autoComplete: 'autoCompleteReceipt',
		confirmOk: 'confirmOkReceipt',
		confirmDelay: 'confirmDelayReceipt',
		initReceipt: 'initReceipt',
	};

	private readonly nameDataStorage: string;
	private readonly eventStorageChange: string;
	private inputTrailerId: HTMLInputElement | null = null;
	private inputReceiptId: HTMLInputElement | null = null;
	private timeoutId: number | null = null;

	constructor({
		autoComplete,
		confirmDelay,
		confirmOk,
		receiptType,
		eventStorageChange = 'storageChange',
		nameDataStorage,
	}: ReceiptManagerRFConfig<T>) {
		this.eventStorageChange = eventStorageChange;
		this.nameDataStorage = nameDataStorage;

		// Configuración inicial
		this.autoComplete = autoComplete;
		this.confirmOk = confirmOk;
		this.confirmDelay = confirmDelay;
		this.initReceipt = this.getInitReceiptStorage();
		this.currentReceiptType = receiptType;

		// Storage
		this.dataStorage = LocalStorageHelper.get(this.nameDataStorage);
		this.dataContainerStorage = this.dataStorage?.dataContainer || [];
		this.receiptType = this.dataStorage?.receiptType;
	}

	abstract processNextItem(): void;
	abstract autocompleteForm(): void;
	abstract submitForm(): void;
	abstract updateCounter(): void;

	getInitReceiptStorage() {
		const storage = sessionStorage.getItem('initReceipt');
		const initReceiptStorage = storage ? JSON.parse(storage) : false;
		return initReceiptStorage;
	}

	// Recuperar configuraciones almacenadas en localStorage
	recoverSettingsStorage() {
		const savedAutocomplete = localStorage.getItem(this.nameStorage.autoComplete);
		const savedConfirmOk = localStorage.getItem(this.nameStorage.confirmOk);

		// Recuperar y verificar si confirmOk es válido (no ha pasado más de 1 hora)
		if (savedConfirmOk !== null) {
			const confirmOkData = JSON.parse(savedConfirmOk);
			const currentTime = Date.now();
			const oneHour = 60 * 60 * 1000; // 1 hora en milisegundos

			// Verificar si ha pasado más de 1 hora
			if (currentTime - confirmOkData.timestamp > oneHour) {
				localStorage.removeItem(this.nameStorage.confirmOk); // Eliminar de localStorage
				this.confirmOk = false; // Restaurar valor predeterminado
			} else {
				this.confirmOk = confirmOkData.value;
			}
		}

		this.autoComplete = savedAutocomplete === null ? this.autoComplete : JSON.parse(savedAutocomplete);
	}

	setValueLicensePlate() {
		// Verifica si el array `dataContainerStorage` tiene elementos
		if (this.dataContainerStorage?.length === 0 && this.inputLicensePlate) {
			console.log('No hay datos en dataContainerStorage.');
			return;
		}

		// Obtén el primer objeto del array
		const firstObject = this.dataContainerStorage?.[0];

		// Verifica si el objeto tiene un array `containers` válido
		// Actualiza e elimina el primer Objeto de dataContainerStorage
		if (!firstObject?.containers || firstObject?.containers?.length === 0) {
			// Elimina el objeto si su `containers` está vacío
			this.dataContainerStorage?.shift();
			console.log('[1] El primer objeto fue eliminado porque `containers` está vacío.');

			LocalStorageHelper.save(this.nameDataStorage, {
				...this.dataStorage,
				dataContainer: this.dataContainerStorage,
			});

			console.warn('No hay datos guardados');
			return;
		}

		// Obtén y procesa el primer elemento de `containers`
		const firstLicensePlate = firstObject.containers.shift();
		console.log(`Procesando placa: ${firstLicensePlate}`);

		LocalStorageHelper.save(this.nameDataStorage, {
			...this.dataStorage,
			dataContainer: this.dataContainerStorage,
		});

		/**
		 * Si después de eliminar el primer elemento de `containers`,
		 * el array `containers` está vacío, elimina el objeto completo
		 *  Actualiza e elimina el primer Objeto de dataContainerStorage
		 */
		//
		if (firstObject.containers?.length === 0) {
			this.dataContainerStorage.shift();
			LocalStorageHelper.save(this.nameDataStorage, {
				...this.dataStorage,
				dataContainer: this.dataContainerStorage,
			});
			console.log('[2] El primer objeto fue eliminado porque `containers` quedó vacío.');
		}

		if (firstLicensePlate === 'DONE') {
			this.onclickButtonDonde();
			return;
		}

		this.inputLicensePlate?.value && (this.inputLicensePlate.value = firstLicensePlate!);

		console.log('Click en oK');
		this.submitForm();
	}

	onclickButtonDonde() {
		if (!this.btnDone) {
			console.error('No se encontró el botón DONE');
			return;
		}

		if (!this.confirmOk) {
			console.warn('DONE: confirmOK está Inhabilitado');
			return;
		}

		setTimeout(() => {
			this.btnDone?.click();
		}, this.confirmDelay);
	}

	handleGetData() {
		this.dataStorage = LocalStorageHelper.get(this.nameDataStorage);
		this.dataContainerStorage = this.dataStorage?.dataContainer || [];
		this.receiptType = this.dataStorage?.receiptType;

		this.availableButtonInitReceipt();
		this.autocompleteForm();
	}

	setEventListeners() {
		console.log('setEventListeners');

		const form = document.getElementById('form-config');
		if (!form) {
			console.error('No se encontró el formulario con id "form-config".');
			return;
		}

		const { confirmToggle, autoCompleteToggle } = form as HTMLFormElement & {
			confirmToggle: HTMLInputElement;
			autoCompleteToggle: HTMLInputElement;
		};

		this.autocompleteForm();
		this.availableButtonInitReceipt();

		const handleNewRegister = () => {
			this.initReceipt = true;
			this.confirmOk = true;
			this.autoComplete = true;

			confirmToggle.checked = true;
			autoCompleteToggle.checked = true;

			const newEventFormControl = new Event('event-form-control');
			window.dispatchEvent(newEventFormControl);

			this.handleGetData();
		};

		// Evento que se dispara cuando se guardar los datos del formulario <textarea>
		window.addEventListener(this.eventStorageChange, handleNewRegister);

		// Evento Cuando se da click en el button #btnInitReceipt
		window.addEventListener('init-receipt-event', handleNewRegister);

		window.addEventListener('cancel-receipt-event', () => {
			this.initReceipt = false;
			this.inputReceiptId && (this.inputReceiptId.value = '');
			this.inputTrailerId && (this.inputTrailerId.value = '');
		});
	}

	availableButtonInitReceipt() {
		const btnInitReceipt = document.getElementById('init-receipt');

		if (btnInitReceipt && this.dataContainerStorage?.length > 0 && this.currentReceiptType === this.receiptType) {
			btnInitReceipt.removeAttribute('disabled');
			btnInitReceipt.classList.add('bounce');
		} else {
			btnInitReceipt?.setAttribute('disabled', 'true');
			btnInitReceipt?.classList.remove('bounce');
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

		this.timeoutId = setTimeout(() => this.submitForm(), 1000);

		// Limpiar el timeout original después de 10 minutos
		setTimeout(
			() => {
				this.clearExistingTimeout();
				console.log('Timeout de 10 minutos alcanzado, timeout original limpiado.');
			},
			10 * 60 * 1000,
		);
	}

	init() {
		// Eventos
		this.setEventListeners();
	}
}
