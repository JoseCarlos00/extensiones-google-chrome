import type { WidgetDataProvider } from "../../types";

export class WidgetManager {
	private isBound = false;
	private root: HTMLElement | null = null;

	constructor(private readonly provider: WidgetDataProvider) {}

	inject(): void {
		if (document.getElementById('receipt-widget-root')) return;

		const wrapper = document.createElement('div');
		wrapper.id = 'receipt-widget-root';
		wrapper.innerHTML = this.getWidgetHTML();

		document.body.appendChild(wrapper);

		this.root = wrapper;
		this.bindEvents();
	}

	refresh(dataLength: number): void {
		this.refreshInfo();
		this.refreshCounters();

		this.updateButtonState(dataLength > 0);
	}

	refreshCounters(): void {
		const counters = this.root?.querySelector('#receipt-counters');
		if (counters) counters.innerHTML = this.provider.getCountersHTML();
	}

	refreshHeader(): void {
		const header = this.root?.querySelector('#receipt-header');
		if (header) header.innerHTML = this.getHeaderHTML();
	}
	refreshInfo(): void {
		const info = this.root?.querySelector('#receipt-info');
		if (info) info.innerHTML = this.provider.getInfoHTML();
	}

	private bindEvents(): void {
		if (this.isBound) return;
		this.isBound = true;

		document.getElementById('init-receipt')?.addEventListener('click', () => {
			this.provider.setStatus('processing');
			this.provider.onInitReceipt();
		});

		document.getElementById('cancel-receipt')?.addEventListener('click', () => {
			this.provider.onCancel();
		});
	}

	private getWidgetHTML(): string {
		return `
        <div class="widget-container">
            <div id="receipt-header">${this.getHeaderHTML()}</div>
            <div id="receipt-info">${this.provider.getInfoHTML()}</div>
            <div id="receipt-counters">${this.provider.getCountersHTML()}</div>
            <div class="receipt-buttons">
                <button id="init-receipt" disabled>Iniciar</button>
                <button id="cancel-receipt">Cancelar</button>
            </div>
        </div>
    `;
	}

	private getHeaderHTML(): string {
		const { label, color } = this.getStatusIndicator();
		return `
        <div class="widget-header">
            <div class="widget-header-status">
                <div class="status-dot" style="background:${color};"></div>
                <span class="status-label">${label}</span>
            </div>
            <span class="receipt-type-label">${this.provider.receiptType}</span>
        </div>
    `;
	}	

	private getStatusIndicator(): { label: string; color: string } {
		switch (this.provider.getStatus()) {
			case 'idle':
				return { label: 'Sin datos', color: '#888' };
			case 'ready':
				return { label: 'Listo', color: '#3a7bd5' };
			case 'processing':
				return { label: 'En proceso', color: '#4ade80' };
			case 'completed':
				return { label: 'Completado', color: '#f59e0b' };
			default:
				return { label: 'Unknown', color: '#999' };
		}
	}

	private updateButtonState(hasData: boolean): void {
		const btn = this.root?.querySelector('#init-receipt') as HTMLButtonElement | null;
		
		if (!btn) return;

		// Si no hay datos, forzar idle
		if (!hasData) {
			this.provider.setStatus('idle');
		} else if (this.provider.getStatus() !== 'processing') {
			this.provider.setStatus('ready');
		}

		this.refreshHeader();
		

		switch (this.provider.getStatus()) {
			case 'idle':
				btn.disabled = true;
				btn.classList.remove('bounce');
				break;
			case 'ready':
				btn.disabled = false;
				btn.classList.add('bounce');
				break;
			case 'processing':
				btn.disabled = false;
				btn.classList.remove('bounce');
				break;
			case 'completed':
				btn.disabled = true;
				btn.classList.remove('bounce');
				break;
		}
	}
}
