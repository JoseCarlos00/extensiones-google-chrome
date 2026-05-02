import { WidgetDataProvider } from "../../types/receipt-widget.types"

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
		const header = this.root?.querySelector('#receipt-header');
		const info = this.root?.querySelector('#receipt-info');
		const counters = this.root?.querySelector('#receipt-counters');

		if (header) header.innerHTML = this.getHeaderHTML();
		if (info) info.innerHTML = this.provider.getInfoHTML();
		if (counters) counters.innerHTML = this.provider.getCountersHTML();

		this.updateButtonState(dataLength > 0);
	}

	refreshCounters(): void {
		const counters = this.root?.querySelector('#receipt-counters');
		if (counters) counters.innerHTML = this.provider.getCountersHTML();
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
      <div class="menu-config">
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
            <div style="display:flex; align-items:center; justify-content:space-between;
                        margin-bottom:10px; border-bottom:0.5px solid #444; padding-bottom:8px;">
                <div style="display:flex; align-items:center; gap:6px;">
                    <div style="width:7px; height:7px; border-radius:50%; background:${color};"></div>
                    <span style="font-size:11px; color:#aaa;">${label}</span>
                </div>
                <span style="font-size:10px; color:#888;">${this.provider.receiptType}</span>
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
		} else if (this.provider.getStatus() === 'idle') {
			// Solo avanza a ready si estaba idle — respeta processing y completed
			this.provider.setStatus('ready');
		}

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
