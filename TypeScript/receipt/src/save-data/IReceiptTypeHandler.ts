export interface RowData {
	receiptId: string;
	licensePlateId?: string;
	status?: string;
	item?: string;
	openQty?: string;
}

export type ReceiptData = [string, string] | string | null;


export interface IReceiptTypeHandler<T = unknown> {
	nameStorage: string;
	pattern: RegExp; // ej: '-TR-111-' o 'TR_E-'
	extractReceiptData(rowData: RowData): T | null; // método para extraer los datos específicos de cada tipo de recibo
	handleSaveData(params: { items: Array<T> }): void;
	deleteData(): void;
}
