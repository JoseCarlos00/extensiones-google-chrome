import { ToastAlert } from "../utils/ToastAlert"
import type { QueryElement } from "./handlers/HandlerTemplate"

export interface GetSentenceSQLParams {
  queryElements: QueryElement;
  prefixClass: string;
}

export interface SentenceSQLValue {
  OH: string;
  AL: string;
  IT: string;
  SU: string;
  DIV_INTERNAL_NUM: string;
}

export class SentenceSQLManager {
	protected prefixClass: string;
	public queryElements: QueryElement;

	constructor({ queryElements, prefixClass }: GetSentenceSQLParams) {
		this.queryElements = queryElements;
		this.prefixClass = prefixClass;
	}

	protected getStatementWhere(values: SentenceSQLValue) {
		const { DIV_INTERNAL_NUM } = values;
		const selectedRowsNum = DIV_INTERNAL_NUM.split(',\n').length;

		const typeWhereMap = {
			internal: () => {
				const statement = selectedRowsNum > 1 ? `IN (\n${DIV_INTERNAL_NUM}\n)` : `= ${DIV_INTERNAL_NUM}`;
				return `AND internal_location_inv ${statement}`;
			},
		};

		return `\nWHERE warehouse = 'Mariano'\nAND company = 'FM'\n${typeWhereMap['internal']()};`;
	}

	protected getStatementSet(values: SentenceSQLValue) {
		const inputOptionsSet = Array.from(
			document.querySelectorAll(`.main-code-container.${this.prefixClass} .opts-btn-container input`)
		) as HTMLInputElement[];

		if (inputOptionsSet.length === 0) {
			console.error('No se seleccionó ninguna opción para el tipo de sentencia [SET]');
			ToastAlert.showAlertFullTop('No se seleccionó ninguna opción para el tipo de sentencia [SET]');
			return;
		}

		const typeSetMap = {
			OH: () => `  ON_HAND_QTY = ${values.OH}`,
			AL: () => `  ALLOCATED_QTY = ${values.AL}`,
			IT: () => `  IN_TRANSIT_QTY = ${values.IT}`,
			SU: () => `  SUSPENSE_QTY = ${values.SU}`,
		};

		const result = inputOptionsSet
			.filter((item) => {
				const type = item.dataset.type as keyof typeof typeSetMap;
				const val = values[type];
				// Solo incluir si el input está seleccionado o tiene valor, Y si el valor correspondiente existe
				return item.value !== '' && val !== undefined && val !== null && val !== '';
			})
			.map((item) => {
				const type = item.dataset.type as keyof typeof typeSetMap;
				return typeSetMap[type]();
			})
			.join(',\n');

		if (!result) {
			console.warn('No se generó ninguna parte del SET porque no hay valores válidos.');
			ToastAlert.showAlertFullTop('No se generó ninguna parte del SET porque no hay valores válidos.');
			return;
		}

		return result;
	}

	public getStatementSQL() {
		try {
			const { OH, AL, IT, SU, DIV_INTERNAL_NUM } = this.queryElements;

			const values: SentenceSQLValue = {
				OH: OH?.value?.trim() || '',
				AL: AL?.value?.trim() || '',
				IT: IT?.value?.trim() || '',
				SU: SU?.value?.trim() || '',
				DIV_INTERNAL_NUM: DIV_INTERNAL_NUM?.textContent?.trim() || '',
			};

			const statementWhere = this.getStatementWhere(values);
			const statementSET = this.getStatementSet(values);

			if (!statementWhere || !statementSET) {
				throw new Error('Error al generar las declaraciones SQL.');
			}

			return `UPDATE location_inventory\nSET\n${statementSET}\n${statementWhere}`;
		} catch (error) {
			console.error('Error: Ha ocurrido un error al  generar las sentencias SQL', error);
			return;
		}
	}
}
