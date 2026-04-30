// types/receipt.types.ts
export type Devoluciones = [string, string];
export type Traslados = string;
export type Tarimas = { item: string; openQty: number };

export type DataTraslados = { trailerId: string; containers: string[] };
export type DataDevoluciones = { receiptId: string; containers: string[] };
export type DataTarimas = { ... };
