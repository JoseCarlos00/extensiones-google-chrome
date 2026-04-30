import { ReceiptManagerRF } from "./ReceiptManagerRF"

abstract class ReceiptManagerWithItem<T> extends ReceiptManagerRF<T> {
    protected inputReceiptId: HTMLInputElement | null = null;
    protected inputItem: HTMLInputElement | null = null;

    protected getContainerQty(): number {
        const option = document.querySelector<HTMLOptionElement>('#combobox_id option');
        const match = option?.textContent?.match(/\(([0-9,]+)\)/);
        return match ? parseInt(match[1].replace(/,/g, '')) : 0;
    }

    protected calcularUnidades(openQty: number): number {
        return Math.floor(openQty / this.getContainerQty());
    }

    protected generateLp(): string { ... } // lógica compartida de LP aleatorio+incremental
}
