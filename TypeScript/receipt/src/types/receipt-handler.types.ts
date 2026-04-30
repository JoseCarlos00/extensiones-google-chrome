export interface RowData {
	receiptId: string;
	licensePlateId: string;
	status: string;
	item: string;
	openQty: string;
}


export type Devoluciones = string[];
export type Traslados = string;
export type Tarimas = { item: string; openQty: string };

export type ReceiptData = Devoluciones | Traslados | null;

export type DataTraslados = { trailerId: string; containers: string[] };
export type DataDevoluciones = { receiptId: string; containers: Devoluciones };
export type DataTarimas = { receiptId: string; items: Tarimas[] };


export interface IReceiptTypeHandler<T = unknown> {
	nameStorage: string;
	pattern: RegExp; // ej: '-TR-111-' o 'TR_E-'
	extractReceiptData(rowData: RowData): T | null; // método para extraer los datos específicos de cada tipo de recibo
	handleSaveData(params: { items: Array<T> }): void;
	deleteData(): void;
}
