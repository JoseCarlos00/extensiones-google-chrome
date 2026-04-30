import type { ReceiptTypeHandler, RowData } from "../types/receipt-handler.types";
import type { ReceiptData } from "../types/receipt.types"
import { eventBus } from "../utils/EventBus"

export interface EventClickManagerStorageConfiguration {
	tbodyTable: HTMLTableSectionElement;
	receiptTypeHandlers: ReceiptTypeHandler[]
}

export class EventClickManagerStorage {
	private readonly tbodyTable: HTMLTableSectionElement;
	private readonly licensePlateId = 'ListPaneDataGrid_LICENSE_PLATE_ID';
	private readonly status = 'ListPaneDataGrid_STATUS_NAME';
	private readonly receiptId = 'ListPaneDataGrid_RECEIPT_ID';
	private readonly item = 'ListPaneDataGrid_ITEM';
	private readonly openQty = 'ListPaneDataGrid_OPEN_QTY';

	private readonly receiptTypeHandlers: ReceiptTypeHandler<unknown>[];

	constructor({ tbodyTable, receiptTypeHandlers }: EventClickManagerStorageConfiguration) {
		this.tbodyTable = tbodyTable;
		this.receiptTypeHandlers = receiptTypeHandlers;
	}

	public handleEvent() {
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
		this.handleAndNotify(handler, dataReceipt);
	}

	private handleAndNotify(handler: ReceiptTypeHandler<unknown>, data: unknown[]) {
		handler.handleSaveData({ items: data });
		eventBus.emit('STORAGE_CHANGED', undefined);
	}

	private extractItems(rows: HTMLTableRowElement[], handler: ReceiptTypeHandler<unknown>): ReceiptData[] {
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

					return handler.extractReceiptData(rowData) as ReceiptData | null;
				})
				.filter((item): item is NonNullable<typeof item> => item !== null);
		} catch (error: any) {
			console.error(`Error: [extractItems]: ${error?.message}`);
			return [];
		}
	}
}
