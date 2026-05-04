import type { AnyReceiptHandler, ReceiptTypeHandler, RowData } from '../types/receipt-handler.types';
import type { ReceiptInputMap } from '../types/receipt.types';
import { eventBus } from '../utils/EventBus';

export interface EventClickManagerStorageConfiguration {
	tbodyTable: HTMLTableSectionElement;
	receiptTypeHandlers: AnyReceiptHandler[];
}

export class EventClickManagerStorage {
	private readonly tbodyTable: HTMLTableSectionElement;
	private readonly licensePlateId = 'ListPaneDataGrid_LICENSE_PLATE_ID';
	private readonly status = 'ListPaneDataGrid_STATUS_NAME';
	private readonly receiptId = 'ListPaneDataGrid_RECEIPT_ID';
	private readonly item = 'ListPaneDataGrid_ITEM';
	private readonly openQty = 'ListPaneDataGrid_OPEN_QTY';

	private readonly receiptTypeHandlers: AnyReceiptHandler[];

	constructor({ tbodyTable, receiptTypeHandlers }: EventClickManagerStorageConfiguration) {
		this.tbodyTable = tbodyTable;
		this.receiptTypeHandlers = receiptTypeHandlers;
	}

	public async handleEvent() {
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

		switch (handler.type) {
			case 'DEVOLUCIONES':
			case 'TRASLADOS':
			case 'TARIMAS':
				await this.process(handler, rows);
				break;
		}
	}

	private async process<K extends keyof ReceiptInputMap>(handler: ReceiptTypeHandler<K>, rows: HTMLTableRowElement[]) {
		const data = this.extractItems(rows, handler);
		await this.handleAndNotify(handler, data);
	}

	private async handleAndNotify<K extends keyof ReceiptInputMap>(
		handler: ReceiptTypeHandler<K>,
		data: Array<{ type: K; data: ReceiptInputMap[K] }>,
	) {
		await handler.handleSaveData({
			items: data.map((d) => d.data),
		});

		eventBus.emit('STORAGE_CHANGED', undefined);
	}

	private extractItems<K extends keyof ReceiptInputMap>(
		rows: HTMLTableRowElement[],
		handler: ReceiptTypeHandler<K>,
	): Array<{ type: K; data: ReceiptInputMap[K] }> {
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

					const data = handler.extractReceiptData(rowData);

					if (!data) return null;

					return {
						type: handler.type,
						data,
					};
				})
				.filter((item): item is { type: K; data: ReceiptInputMap[K] } => item !== null);
		} catch (error: any) {
			console.error(`Error: [extractItems]: ${error?.message}`);
			return [];
		}
	}
}
