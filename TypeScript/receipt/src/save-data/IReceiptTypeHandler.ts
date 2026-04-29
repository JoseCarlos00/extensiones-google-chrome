export interface RowData {
	licensePlateId: string;
	status: string;
	receiptId?: string;
}

export interface IReceiptTypeHandler {
	nameStorage: string;
	pattern: string; // ej: '-TR-111-' o 'TR_E-'
	extractReceiptData(rowData: RowData): [string, string] | null; // método para extraer los datos específicos de cada tipo de recibo
	handleSaveData(params: { items: Array<unknown> }): void;
	deleteData(): void;
}
