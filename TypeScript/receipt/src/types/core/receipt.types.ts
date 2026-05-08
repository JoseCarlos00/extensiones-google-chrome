export type ReceiptType = 'TRASLADOS' | 'DEVOLUCIONES' | 'TARIMAS' | 'CAJAS';

export type DataTraslados = { licensePlateId: string };
export type DataDevoluciones = { receiptId: string; licensePlateId: string };
export type DataTarimas = { item: string; openQty: string; receiptId: string };
export type DataCajas = { item: string; openQty: string; receiptId: string };

export type ReceiptData =
	| {
			[K in keyof ReceiptInputMap]: {
				type: K;
				data: ReceiptInputMap[K];
			};
	  }[keyof ReceiptInputMap]
	| null;

export type ReceiptInputMap = {
	TRASLADOS: DataTraslados;
	DEVOLUCIONES: DataDevoluciones;
	TARIMAS: DataTarimas;
	CAJAS: DataCajas;
};

type ItemStatus = 'pending' | 'processing' | 'completed' | 'skipped';

export type CurrentItemState = {
	item: string;
	processedUnits: number;
	totalUnits: number;
	receiptId: string;
	currentLp: string;
	status: ItemStatus;
};
