export const namesStorages = {
	traslados: 'dataStorageTraslados',
	devoluciones: 'dataStorageDevoluciones',
	tarimas: 'dataStorageTarimas',
	cajas: 'dataStorageCajas',

	values: (): string[] => Object.values(namesStorages).filter(value => typeof value === 'string') as string[],
} as const;

export const nameStorageEvents = {
	traslados: 'eventStorageTraslados',
	devoluciones: 'eventStorageDevoluciones',
	tarimas: 'eventStorageTarimas',
	cajas: 'eventStorageCajas',

	values: (): string[] => Object.values(nameStorageEvents).filter(value => typeof value === 'string') as string[],
}
