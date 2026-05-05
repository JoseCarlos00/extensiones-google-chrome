import { ReceiptManagerRF, ReceiptManagerRFConfig } from './ReceiptManagerRF';

export abstract class ReceiptManagerWithItem<T> extends ReceiptManagerRF<T> {
	protected inputReceiptId: HTMLInputElement | null = null;
	protected inputItem: HTMLInputElement | null = null;

    protected tittleCurrentPage: string = '';
	protected messageInvalideLicensePlate: string = '';
	protected isValideLicensePlate: boolean = false;

    
	abstract nameStorageLPs: string;

    constructor(config: ReceiptManagerRFConfig) {
            super(config);
            // this.btnDone = document.querySelector<HTMLInputElement>('input[type="button"][value="Done"]');
            // this.inputLicensePlate = this.getInput('Form1', 'CONTID');
    
            this.tittleCurrentPage = this.getTextByIndex('h3', 0);
            this.messageInvalideLicensePlate = this.getTextByIndex('h3', 1);
            this.isValideLicensePlate = this.tittleCurrentPage === 'License plate';
        }

	

	protected getContainerQty(): number {
		const option = document.querySelector<HTMLOptionElement>('#combobox_id option');
		const match = option?.textContent?.match(/\(([0-9,]+)\)/);
		return match ? parseInt(match[1].replace(/,/g, '')) : 0;
	}

	protected calcularUnidades(openQty: number): number {
		return Math.floor(openQty / this.getContainerQty());
	}

	protected generateLp(): string {
		// lógica compartida de LP aleatorio+incremental
		const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
		const timestampPart = Date.now().toString(36).toUpperCase();
		return `${randomPart}-${timestampPart}`;
	}
}
