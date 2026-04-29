export const nameStorageContainer = 'dataContainersReceipt';
export const eventNameStorageChange = 'dataContainersReceiptChange';

// Objeto Para Almacenar los datos de los contenedores
export interface DataContainer {
	receiptType: string;
	dataContainer: Array<string>;
	trailerId: string;
};
