import { ReceiptStatus } from "./storage.types"

export interface WidgetDataProvider {
	receiptType: string;

	getInfoHTML(): string;
	getCountersHTML(): string;
	getStatus(): ReceiptStatus;
	setStatus(status: ReceiptStatus): void;
	onCancel(): void;
}
