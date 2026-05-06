/**
 * 'idle'       → sin datos en storage
 * 'ready'      → hay datos, botón Iniciar habilitado, aún no se inició
 * 'processing' → se dio click en Iniciar, proceso activo
 * 'completed'  → dataContainerStorage queda vacío
 */
export type ReceiptStatus = 'idle' | 'ready' | 'processing' | 'completed';

export interface WidgetDataProvider {
	receiptType: string;

	getInfoHTML(): string;
	getCountersHTML(): string;
	getStatus(): ReceiptStatus;
	setStatus(status: ReceiptStatus): void;
	onCancel(): void;
	onInitReceipt(): void;
}
