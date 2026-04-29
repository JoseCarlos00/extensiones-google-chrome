export const namesStorages = {
	traslados: 'dataContainersTraslados',
	devoluciones: 'dataContainersDevoluciones',
	tarimas: 'dataContainersTarimas',

	values: (): string[] => Object.values(namesStorages).filter(value => typeof value === 'string') as string[],
} as const;


export type ReceiptType = 'TRASLADOS' | 'DEVOLUCIONES';

// Objeto Para Almacenar los datos de los contenedores
export interface DataContainer {
	receiptType: ReceiptType;
	dataContainer: Array<string>;
	trailerId?: string;
};
