import { ReceiptStatus } from "../receipt-manager/base/ReceiptManagerRF"

export interface WidgetDataProvider {
	receiptType: string;

	getInfoHTML(): string;
	getCountersHTML(): string;
	getStatus(): ReceiptStatus;
	setStatus(status: ReceiptStatus): void;
	onCancel(): void;
	onInitReceipt(): void;
}
