import { ReceiptType } from "./receipt.types"

/**
 * 'idle'       → sin datos en storage
 * 'ready'      → hay datos, botón Iniciar habilitado, aún no se inició
 * 'processing' → se dio click en Iniciar, proceso activo
 * 'completed'  → dataContainerStorage queda vacío
 */
export type ReceiptStatus = 'idle' | 'ready' | 'processing' | 'completed';

export type StorageData<T> = {
	receiptType: ReceiptType;
	trailerId?: string;
	data: T[];
};
