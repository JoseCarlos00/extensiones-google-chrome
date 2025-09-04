export interface RowData {
	item: string | null;
	location: string | null;
}

export class QueryBuilder {
	private readonly rowsData: RowData[];

	constructor(rowsData: RowData[]) {
		// Filtramos filas que no tengan un item válido desde el inicio
		this.rowsData = rowsData.filter((row) => row.item && row.item.trim() !== '');
	}

	private getFormattedItems(): string {
		return this.rowsData
			.map((row) => (row.item ? `'${row.item}'` : null))
			.filter(Boolean)
			.join(',\n');
	}

	public buildItemLocation(): string {
		return this.rowsData.map((row) => `${row.item}\t${row.location}`).join('\n');
	}

	public buildItemSql(): string {
		return this.getFormattedItems();
	}

	public buildItemExistQuery(): string {
		const items = this.getFormattedItems();
		if (!items) return '';
		return `SELECT DISTINCT\n item\n\nFROM item_location_assignment\n\nWHERE item\nIN (\n${items}\n  );`;
	}

	public buildUpdateCapacityQuery(): string {
		const items = this.getFormattedItems();
		if (!items) return '';
		return `UPDATE item_location_capacity\nSET\nMAXIMUM_QTY = 2,\nQUANTITY_UM = 'CJ',\nMINIMUM_RPLN_PCT = 50\n\nWHERE location_type = 'Generica Permanente S'\nAND item IN (\n${items}\n  );`;
	}

	public buildShowCapacityQuery(): string {
		const items = this.getFormattedItems();
		if (!items) return '';
		const SELECT = `SELECT DISTINCT\n  I.item,\n  I.item_color,\n  CAST(ILC.MAXIMUM_QTY AS INT) AS MAXIMUM_QTY,\n  ILC.quantity_um,\n  ILC.MINIMUM_RPLN_PCT,\n  ILC.location_type`;
		const FROM = `FROM item I\nLEFT JOIN item_location_capacity ILC  ON  ILC.item = I.item`;
		const AND1 = `AND (I.item_category1 <> 'Bulk' OR I.item_category1 IS NULL)`;
		const AND2 = `AND (ILC.location_type NOT LIKE 'Generica Permanente R' OR  ILC.location_type IS NULL)`;
		const AND3 = `AND I.item IN (\n${items}\n  )`;
		const WHERE = `WHERE I.company='FM'\n${AND1}\n${AND2}\n${AND3}\n`;
		return `${SELECT}\n\n${FROM}\n\n${WHERE}\nORDER BY 1;`;
	}

	public buildInsertIntoQuery(): string {
		const MAXIMUM_QTY = 2;
		const QUANTITY_UM = 50;

		const INSERT_INTO = `INSERT INTO item_location_capacity  (ITEM, COMPANY, LOCATION_TYPE, MAXIMUM_QTY, QUANTITY_UM, MINIMUM_RPLN_PCT, USER_STAMP, DATE_TIME_STAMP, MAXIMUM_RPLN_FILL_PCT, MINIMUM_TOPOFF_RPLN_PCT)\nVALUES\n`;

		const values = this.rowsData
			.map(
				(row) =>
					` ('${row.item}', 'FM', 'Generica Permanente S', '${MAXIMUM_QTY}', 'CJ', '${QUANTITY_UM}', 'JoseCarlos', DATEADD(HOUR, 6, GETDATE()), '100', '0')`
			)
			.join(',\n');

		if (!values) return '';

		return INSERT_INTO + values;
	}
}
