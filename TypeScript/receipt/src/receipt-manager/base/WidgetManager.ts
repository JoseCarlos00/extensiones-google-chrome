import { WidgetDataProvider } from "../../types/receipt-widget.types"
import { ReceiptStatus } from "../../types/storage.types"

export class WidgetManager {
	protected wrapper!: HTMLElement;

	constructor(private readonly provider: WidgetDataProvider) {}

	inject(): void {
		const wrapper = document.createElement('div');
		wrapper.innerHTML = this.getWidgetHTML();
		document.body.appendChild(wrapper);
		this.bindEvents();
	}

	refresh(dataLength: number): void {
		const info = document.getElementById('receipt-info');
		const counters = document.getElementById('receipt-counters');

		if (info) info.innerHTML = this.provider.getInfoHTML();
		if (counters) counters.innerHTML = this.provider.getCountersHTML();

		this.updateButtonState(dataLength > 0); // siempre al final de refresh
	}

	private bindEvents(): void {
		document.getElementById('init-receipt')?.addEventListener('click', () => {
			this.provider.setStatus('processing');
		});

		document.getElementById('cancel-receipt')?.addEventListener('click', () => {
			this.provider.onCancel();
		});
	}

	private getWidgetHTML(): string {
		return `
      <div class="menu-config">
        ${this.getHeaderHTML()}
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
		}
	}

	private updateButtonState(hasData: boolean): void {
		const btn = document.getElementById('init-receipt') as HTMLButtonElement | null;
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
