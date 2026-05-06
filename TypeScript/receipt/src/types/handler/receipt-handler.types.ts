import { ReceiptInputMap } from "./receipt.types";

export interface RowData {
	receiptId: string;
	licensePlateId: string;
	status: string;
	item: string;
	openQty: string;
}

export interface ReceiptTypeHandler<K extends keyof ReceiptInputMap> {
	type: K;

	nameStorage: string;
	eventNameStorage: string;
	pattern: RegExp; // ej: '-TR-111-' o 'TR_E-'
	
	extractReceiptData(rowData: RowData): ReceiptInputMap[K] | null;
	handleSaveData(params: { items: Array<ReceiptInputMap[K]> }): Promise<void>;
	deleteData(silent: boolean): void;
}

export type AnyReceiptHandler = {
	[K in keyof ReceiptInputMap]: ReceiptTypeHandler<K>;
}[keyof ReceiptInputMap];
