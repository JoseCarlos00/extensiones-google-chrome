import type { ReceiptStatus, StorageData } from '../../types/storage.types';
import { LocalStorageHelper } from '../../utils/LocalStorageHelper';

export interface ReceiptManagerRFConfig {
	receiptType: string;
	nameStorage: string;
}

export abstract class ReceiptManagerRF<T> {
	protected container!: HTMLElement;
	protected confirmDelay: number = 500;

	protected readonly receiptType: string;
	protected readonly nameStorage: string;
	protected dataStorage: StorageData<T> | null;

	// UI — solo lo universal
	protected btnOk: HTMLButtonElement | null = null;

	private readonly SESSION_KEY = 'receiptManagerStatus';

	constructor({ receiptType, nameStorage }: ReceiptManagerRFConfig) {
		this.nameStorage = nameStorage;
		this.receiptType = receiptType;

		// this.initReceipt = this.getInitReceiptStorage();
		this.dataStorage = LocalStorageHelper.get(this.nameStorage) ?? null;
	}

	// — Widget —
	protected insertWidget(): void {
		const wrapper = document.createElement('div');
		wrapper.innerHTML = this.getWidgetHTML();
		document.body.appendChild(wrapper);

		document.getElementById('init-receipt')?.addEventListener('click', () => {
			this.setStatus('processing');
			this.refreshWidget();
		});

		document.getElementById('cancel-receipt')?.addEventListener('click', () => {
			window.dispatchEvent(new Event('cancel-receipt-event'));
		});
	}

	// — Status —
	getStatus(): ReceiptStatus {
		return (sessionStorage.getItem(this.SESSION_KEY) as ReceiptStatus) ?? 'idle';
	}

	setStatus(status: ReceiptStatus): void {
		sessionStorage.setItem(this.SESSION_KEY, status);
	}

	protected getWidgetHTML(): string {
		return `
      <nav class="menu-config">
        ${this.getHeaderHTML()}
        <div id="receipt-info">${this.getInfoHTML()}</div>
        <div id="receipt-counters">${this.getCountersHTML()}</div>
        <div class="receipt-buttons">
          <button id="init-receipt" disabled>Iniciar</button>
          <button id="cancel-receipt">Cancelar</button>
        </div>
      </nav>
    `;
	}

	// — Header —
	protected getHeaderHTML(): string {
		const { label, color } = this.getStatusIndicator();
		return `
            <div style="display:flex; align-items:center; justify-content:space-between;
                        margin-bottom:10px; border-bottom:0.5px solid #444; padding-bottom:8px;">
                <div style="display:flex; align-items:center; gap:6px;">
                    <div style="width:7px; height:7px; border-radius:50%; background:${color};"></div>
                    <span style="font-size:11px; color:#aaa;">${label}</span>
                </div>
                <span style="font-size:10px; color:#888;">${this.receiptType}</span>
            </div>
        `;
	}

	private getStatusIndicator(): { label: string; color: string } {
		switch (this.getStatus()) {
			case 'idle':
				return { label: 'Sin datos', color: '#888' };
			case 'ready':
				return { label: 'Listo', color: '#3a7bd5' };
			case 'processing':
				return { label: 'En proceso', color: '#4ade80' };
			case 'completed':
				return { label: 'Completado', color: '#f59e0b' };
		}
	}

	// Subclases definen esto
	protected abstract getInfoHTML(): string;
	protected abstract getCountersHTML(): string;
	protected abstract processData(): void; // orquesta: procesa, guarda, llama refreshWidget()

	// Actualiza solo las partes dinámicas, no reconstruye todo el DOM
	// protected refreshWidget(): void {
	// 	document.getElementById('receipt-info')!.innerHTML = this.getInfoHTML();
	// 	document.getElementById('receipt-counters')!.innerHTML = this.getCountersHTML();
	// 	// también actualiza el header si el status cambió
	// 	this.container.querySelector('.status-area')!.outerHTML = this.getHeaderHTML();
	// }

	protected refreshWidget(): void {
		const info = document.getElementById('receipt-info');
		const counters = document.getElementById('receipt-counters');

		if (info) info.innerHTML = this.getInfoHTML();
		if (counters) counters.innerHTML = this.getCountersHTML();

		this.updateButtonState((this.dataStorage?.data?.length ?? 0) > 0);
	}

	updateCounter(): void {
		const el = document.getElementById('receipt-counters');
		if (el) el.innerHTML = this.getCountersHTML();
	}

	protected updateButtonState(hasData: boolean): void {
		const btn = document.getElementById('init-receipt');
		btn?.toggleAttribute('disabled', !hasData);
		btn?.classList.toggle('bounce', hasData);

		if (!hasData) {
			this.setStatus('idle');
		} else if (this.getStatus() !== 'processing') {
			this.setStatus('ready');
		}
	}

	// Llamado una vez al cargar la página
	injectWidget(): void {
		this.container = document.createElement('div');
		this.container.innerHTML = this.getWidgetHTML();
		document.body.appendChild(this.container);
	}
}
