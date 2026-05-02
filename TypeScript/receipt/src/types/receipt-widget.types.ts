import { ReceiptStatus } from "./storage.types"

export interface WidgetDataProvider {
	getInfoHTML(): string;
	getCountersHTML(): string;
	getStatus(): ReceiptStatus;
	setStatus(status: ReceiptStatus): void;
	receiptType: string;
}
