export type ReceiptType = 'TRASLADOS' | 'DEVOLUCIONES' | 'TARIMAS' | 'CAJAS';

export type DataTraslados = { licensePlateId: string};
export type DataDevoluciones = { receiptId: string; licensePlateId: string };
export type DataTarimas = { item: string; openQty: number };


// Lo que usa la UI
export type DataTarimasStorage = {
	receiptId: string;
	licensePlateConfig: string;
	currentLp: string;
	items: DataTarimas[];
	currentItem: {
		item: string;
		openQty: number;
		containerQty: number;
		totalTarimas: number;
		processedTarimas: number;
	} | null;
};

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
};
