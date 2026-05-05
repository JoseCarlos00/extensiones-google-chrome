import { DataCajas, DataTarimas, ReceiptInputMap, ReceiptType } from './receipt.types';

/**
 * 'idle'       → sin datos en storage
 * 'ready'      → hay datos, botón Iniciar habilitado, aún no se inició
 * 'processing' → se dio click en Iniciar, proceso activo
 * 'completed'  → dataContainerStorage queda vacío
 */
export type ReceiptStatus = 'idle' | 'ready' | 'processing' | 'completed';

export type StorageData2<T> = {
	receiptType: ReceiptType;
	trailerId?: string;
	data: T[];
};

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

export type StorageData = {
	[K in keyof ReceiptStorageMap]: {
		receiptType: K;
		data: ReceiptStorageMap[K][];
	} & (K extends 'TRASLADOS' ? { trailerId: string } : {});
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
