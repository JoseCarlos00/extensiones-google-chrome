export type StorageData<T> = {
	data: T[];
	receiptType: string;
};

export abstract class WidgetHTML<T> {
    // Propiedades que necesita el widget — vienen de ReceiptManagerRF
    protected abstract readonly nameStorage: string;
    protected abstract readonly currentReceiptType: string;
    protected abstract dataStorage: StorageData<T> | null;

    // Abstractos — cada hijo de ReceiptManagerRF implementa
    protected abstract getInfoHTML(): string;
    protected abstract getCountersHTML(): string;

    private readonly SESSION_KEY = 'receiptManagerStatus';

    	// init(): void {
      // 	this.insertWidget(); // crea e inserta el HTML en el DOM
      // 	this.setEventListeners(); // registra eventos
      // 	this.updateCounter(); // llena los contadores con datos del storage
      // }


    // Concretos — iguales para todos
    protected getHeaderHTML(): string {
		const { label, color } = this.getStatusIndicator();
		return `
        <div style="display: flex; align-items: center; justify-content: space-between; 
                    margin-bottom: 10px; border-bottom: 0.5px solid #444; padding-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 6px;">
                <div style="width: 7px; height: 7px; border-radius: 50%; background: ${color};"></div>
                <span style="font-size: 11px; color: #aaa;">${label}</span>
            </div>
            <span style="font-size: 10px; color: #888;">${this.currentReceiptType}</span>
        </div>
    `;
	}

    
  protected getStatusIndicator(): { label: string; color: string } {
    switch (this.getStatus()) {
        case 'idle':       return { label: 'Sin datos',   color: '#888'    };
        case 'ready':      return { label: 'Listo',       color: '#3a7bd5' };
        case 'processing': return { label: 'En proceso',  color: '#4ade80' };
        case 'completed':  return { label: 'Completado',  color: '#f59e0b' };
    }
}

   protected refreshWidget(): void {
		const info = document.getElementById('receipt-info');
		const counters = document.getElementById('receipt-counters');

		if (info) info.innerHTML = this.getInfoHTML();
		if (counters) counters.innerHTML = this.getCountersHTML();

		this.availableButtonInitReceipt();
	}

    protected insertWidget(): void { ... }


    	getStatus(): ReceiptStatus {
		return (sessionStorage.getItem(this.SESSION_KEY) as ReceiptStatus) ?? 'idle';
	}

	setStatus(status: ReceiptStatus): void {
		sessionStorage.setItem(this.SESSION_KEY, status);
	}
  
  updateCounter(): void {
		const el = document.getElementById('receipt-counters');
		if (el) el.innerHTML = this.getCountersHTML();
	}

  availableButtonInitReceipt(): void {
		const hasData = this.dataContainerStorage.length > 0;
		const status = this.getStatus();

		if (!hasData) {
			this.setStatus('idle');
		} else if (status !== 'processing') {
			this.setStatus('ready'); // hay datos pero no se ha iniciado
		}
		// 'processing' solo lo cambia el click en Iniciar
	}
}
