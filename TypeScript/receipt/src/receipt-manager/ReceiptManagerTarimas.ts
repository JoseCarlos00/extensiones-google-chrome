import { STORAGE_LPS_KEYS } from "../constants"
import { LocalStorageHelper } from "../utils/LocalStorageHelper"
import { ReceiptManagerRFConfig } from "./base/ReceiptManagerRF"
import { type BasePageState, ReceiptManagerWithItem } from "./base/ReceiptManagerWithItem"

type TarimasPageState = BasePageState | 'form-item-success' | 'form-lp' | 'form-lp-invalid';

export default class ReceiptManagerTarimas extends ReceiptManagerWithItem<'TARIMAS', TarimasPageState> {
	protected nameStorageLPs = STORAGE_LPS_KEYS.tarimas;
	protected currentLabelCounter = 'CaJas';

	constructor(config: ReceiptManagerRFConfig<'TARIMAS'>) {
		super(config);

		this.registerHandlers({
			'form-item-success': () => this.processStateSuccessful(),
			'form-lp': () => this.handleLicensePlate(),
			'form-lp-invalid': () => console.warn('LP Tarimas inválido'),
		});
	}

	// ─── Lógica de negocio ───────────────────────────────
	// Tarimas — input disabled, solo click OK
	protected fillCheckInForm(): void {} // no hace nada — el form no es editable

	private processStateSuccessful(): void {
		const current = this.storage?.currentItem;

		console.log(
			'[DEV - processStateSuccessful ]:',
			{
				status: this.detectPageState(this.getPageSignals()),
				previousState: this.previousState,
			},
			current,
		);

		// Estado inconsistente:
		// llegamos a success pero no existe currentItem
		if (!current) {
			console.warn('form-item-success sin currentItem. Abortando para evitar duplicados.');
			alert('form-item-success sin currentItem. Abortando');
			this.completeReceipt('missing-currentItem-on-success');

			return;
		}

		// Solo incrementa cuando realmente venimos de LP
		if (this.previousState === 'form-lp') {
			current.processedUnits++;

			if (current.processedUnits >= current.totalUnits) {
				current.status = 'completed';
			}

			this.saveProcessedLP();
			LocalStorageHelper.save(this.nameStorage, this.storage!);

			this.refreshCounters();
		}

		this.processCurrentItem();
	}
}
