// types/receipt.types.ts
export type Devoluciones = [string, string];
export type Traslados = string;
export type Tarimas = { item: string; openQty: number };

export type DataTraslados = { trailerId: string; containers: string[] };
export type DataDevoluciones = { receiptId: string; containers: string[] };

export type ReceiptData = Devoluciones | Traslados | Tarimas | null;

export type DataTarimas = {
	receiptId: string;
	licensePlateConfig: string;
	currentLp: string;
	items: Tarimas[];
	currentItem: {
		item: string;
		openQty: number;
		containerQty: number; // leído de <select>#combobox_id
		totalTarimas: number; // Math.floor(openQty / containerQty)
		processedTarimas: number;
	} | null;
};
