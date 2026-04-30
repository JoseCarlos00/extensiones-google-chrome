export interface RowData {
	receiptId: string;
	licensePlateId: string;
	status: string;
	item: string;
	openQty: string;
}

export interface ReceiptTypeHandler<T = unknown> {
	nameStorage: string;
	eventNameStorage: string;
	pattern: RegExp; // ej: '-TR-111-' o 'TR_E-'
	extractReceiptData(rowData: RowData): T | null;
	handleSaveData(params: { items: Array<T> }): void;
	deleteData(): void;
}
