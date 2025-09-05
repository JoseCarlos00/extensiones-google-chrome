export function sortTable({ columnIndex, table, sortOrder = 'asc' }: {
	columnIndex: number; table: HTMLTableElement | null; sortOrder?: 'asc' | 'desc';
}) {
	if (!table) {
		throw new Error('La tabla proporcionada es nula');
	}

	const tbody = table.querySelector('tbody');

	if (!tbody) {
		throw new Error('El elemento tbody no se encontró en la tabla proporcionada');
	}

	const rows = Array.from(tbody.querySelectorAll('tr'));

	if (rows.length === 0) {
		console.warn('No se encontraron filas para ordenar');
		return;
	}

	rows.sort((a, b) => {
		// Obtener los inputs de las filas a y b
		const inputA = a.cells[columnIndex].querySelector('input');
		const inputB = b.cells[columnIndex].querySelector('input');

		// Verificar si alguna fila tiene la clase 'item-exist'
		const hasClassA = a.cells[columnIndex].classList.contains('item-exist');
		const hasClassB = b.cells[columnIndex].classList.contains('item-exist');

		let comparison = 0;

		// Ordenar primero por 'item-exist' y luego por valor de input
		if (hasClassA && !hasClassB) {
			// return -1; // a viene antes que b
			comparison = -1; // a viene antes que b
		} else if (!hasClassA && hasClassB) {
			// return 1; // b viene antes que a
			comparison = 1; // b viene antes que a
		} else {
			// Ambas tienen o no tienen 'item-exist', ordenar por valor del input
			const aValue = inputA?.value ?? '';
			const bValue = inputB?.value ?? '';
			comparison = aValue.localeCompare(bValue);
		}

		// Si sortOrder es 'desc', invertir la comparación
		return sortOrder === 'desc' ? -comparison : comparison;
	});

	// Limpiar y reordenar las filas en el tbody
	rows.forEach((row) => tbody.appendChild(row));
}
