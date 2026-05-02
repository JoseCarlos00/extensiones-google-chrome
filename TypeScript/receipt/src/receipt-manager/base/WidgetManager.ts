import { WidgetDataProvider } from "../../types/receipt-widget.types"



// WidgetManager recibe la interfaz, no la clase
export class WidgetManager {
	constructor(private readonly provider: WidgetDataProvider) {}

	inject(): void {
    const container = document.createElement('div');
    container.innerHTML = this.getWidgetHTML();
    document.body.appendChild(container);
    this.bindEvents();
  }

  refresh(dataLength: number): void {
		const counters = document.getElementById('receipt-counters');
		// Aquí llama a la interfaz — pero en runtime ejecuta
		// el método de ReceiptManagerTarimas o quien sea
		if (counters) counters.innerHTML = this.provider.getCountersHTML();
	}

  private bindEvents(): void {
    document.getElementById('init-receipt')?.addEventListener('click', () => {
      this.manager.setStatus('processing');
      this.refresh(/* dataLength */);
    });
    document.getElementById('cancel-receipt')?.addEventListener('click', () => {
      window.dispatchEvent(new Event('cancel-receipt-event'));
    });
  }

  private updateButtonState(dataLength: number): void { ... }
  private getWidgetHTML(): string { ... }
  private getHeaderHTML(): string { ... }
  private getStatusIndicator(): { label: string; color: string } { ... }
}
