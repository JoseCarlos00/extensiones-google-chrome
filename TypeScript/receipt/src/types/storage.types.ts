import { CurrentItemState, DataCajas, DataTarimas } from './receipt.types';

export type ReceiptStorageMap = {
	TRASLADOS: {
		trailerId: string;
		containers: string[];
	};
	DEVOLUCIONES: {
		receiptId: string;
		containers: string[];
	};
	TARIMAS: DataTarimas;
	CAJAS: DataCajas;
};

export type WithItem = 'TARIMAS' | 'CAJAS';
export type WithDone = 'TRASLADOS' | 'DEVOLUCIONES';


export type StorageDataByType<K extends keyof ReceiptStorageMap> = {
	[K2 in keyof ReceiptStorageMap]: K2 extends K
		? {
				receiptType: K2;
				data: ReceiptStorageMap[K2][];
			} & (K2 extends 'TRASLADOS' ? { trailerId: string } : {}) &
			(K2 extends WithItem ? { currentItem: CurrentItemState | null } : {})
		: never;
}[keyof ReceiptStorageMap];

/**
 * Analogía rápida
 * Piensa que ReceiptStorageMap es un diccionario:
 * - La clave es el tipo de recibo (TRASLADOS, DEVOLUCIONES, etc.)
 * 
 * K extends keyof ... es como decir:
 * 👉 “Dame una clave válida del diccionario, y te doy su tipo correspondiente”
 * 
 * ✅ Regla mental
 * keyof X → “las llaves de X”
 * K extends keyof X → “K solo puede ser una llave válida de X”
 * X[K] → “el tipo asociado a esa llave”
 * 
 * class ReceiptManagerRF<K extends keyof ReceiptStorageMap> {
		protected dataStorage: Extract<StorageData, { receiptType: K }> | null;
	}
 */
