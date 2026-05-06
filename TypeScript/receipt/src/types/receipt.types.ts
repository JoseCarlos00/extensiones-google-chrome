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

export type CurrentItemState = {
	item: string;
	openQty: number;
	containerQty: number; // huella leída del DOM
	totalUnits: number; // Math.floor(openQty / containerQty)
	processedUnits: number; // cuántas ya se procesaron
};

// Lo que usa la UI
export type DataTarimasStorage = {
	receiptId: string;
	items: DataTarimas[];
	currentItem: CurrentItemState | null; // null = aún no iniciado
	currentLp: string;
};
