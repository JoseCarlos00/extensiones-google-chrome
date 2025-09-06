export interface ConfigurationHide {
	[key: string]: {
		name: string;
		hide: boolean;
	};
}

export const configurationInitial: ConfigurationHide = {
	'copy-table': {
		name: 'Copiar Tabla',
		hide: false,
	},
	'insert-item': {
		name: 'Insertar Item',
		hide: true,
	},
	'insert-row': {
		name: 'Insertar Fila',
		hide: true,
	},
	'copy-item': {
		name: 'Copiar Item',
		hide: true,
	},
	'counter-row': {
		name: 'Contar Filas',
		hide: false,
	},
};


export const hideElementsIds = {
	copyTable: 'copy-table',
	insertItem: 'insert-item',
	insertRow: 'insert-row',
	copyItems: 'copy-items',
	counterRow: 'counter-row',
};

export const idModalPrincipal = 'myModalShowTable';
export const idModalInsertItem = 'myModalInserToItem';
