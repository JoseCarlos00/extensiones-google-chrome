import type { ReceiptType } from "../constants";
import type { IReceiptTypeHandler, RowData } from "./IReceiptTypeHandler"

export interface EventClickManagerStorageConfiguration {
	tbodyTable: HTMLTableSectionElement;
	receiptTypeHandlers: IReceiptTypeHandler[]
}

export class EventClickManagerStorage {
	private readonly tbodyTable: HTMLTableSectionElement;
	private readonly licensePlateId = 'ListPaneDataGrid_LICENSE_PLATE_ID';
	private readonly status = 'ListPaneDataGrid_STATUS_NAME';
	private readonly receiptId = 'ListPaneDataGrid_RECEIPT_ID';
	private readonly item = 'ListPaneDataGrid_ITEM';
	private readonly openQty = 'ListPaneDataGrid_OPEN_QTY';

	private readonly receiptTypeHandlers: IReceiptTypeHandler[];

	constructor({ tbodyTable, receiptTypeHandlers }: EventClickManagerStorageConfiguration) {
		this.tbodyTable = tbodyTable;
		this.receiptTypeHandlers = receiptTypeHandlers;
	}

	handleEvent() {
		const rows = Array.from(this.tbodyTable?.rows) || [];
		if (rows.length === 0) return;

		const firstRow = rows[0];
		const receiptId = firstRow.querySelector(`td[aria-describedby="${this.receiptId}"]`)?.textContent?.trim();

		if (!receiptId) return;

		// Dinámico: busca el handler que coincida con el patrón
		const handler = this.receiptTypeHandlers.find((h) => h.pattern.test(receiptId));

		if (!handler) {
			console.warn(`No handler found for receiptId: ${receiptId}`);
			return;
		}

		const dataReceipt = this.extractItems(rows, handler);
		handler.handleSaveData({ items: dataReceipt });
	}

	private extractItems(rows: HTMLTableRowElement[], handler: IReceiptTypeHandler): Array<unknown> {
		try {
			const normalize = (el: Element | null | undefined) =>
				el?.textContent?.normalize('NFKC')?.replace(/\s+/g, ' ')?.trim() ?? '';

			const normalizeNumber = (el: Element | null | undefined): string => {
				const text = el?.textContent?.normalize('NFKC')?.trim() ?? '';

				if (!text) return '';

				const cleaned = text.replace(/,/g, ''); // quitar separadores de miles
				const num = Number(cleaned);

				return isNaN(num) ? '' : num.toString();
			};

			return rows
				.map((row) => {
					const rowData: RowData = {
						licensePlateId: normalize(row.querySelector(`td[aria-describedby=${this.licensePlateId}]`)),
						status: normalize(row.querySelector(`td[aria-describedby=${this.status}]`)),
						receiptId: normalize(row.querySelector(`td[aria-describedby=${this.receiptId}]`)),
						item: normalize(row.querySelector(`td[aria-describedby=${this.item}]`)),
						openQty: normalizeNumber(row.querySelector(`td[aria-describedby=${this.openQty}]`)),
					};

					return handler.extractReceiptData(rowData);
				})
				.filter((item): item is NonNullable<typeof item> => item !== null);
		} catch (error: any) {
			console.error(`Error: [extractItems]: ${error?.message}`);
			return [];
		}
	}
}
