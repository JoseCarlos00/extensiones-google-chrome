import { itemLocation } from '../consts';
import { SentenceSQLManager, type GetSentenceSQLParams, type SentenceSQLValue} from '../SentenceSQL';
import { HandlerTemplate, type QueryElement } from './HandlerTemplate';
const {
	idBtnCopyItemLocation,
	idInputOH,
	idInputAL,
	idInputIT,
	idInputSU,
	idInternalNumberInv,
	idInputItem,
	idInputLocation,
} = itemLocation;

export class ItemLocation extends HandlerTemplate<QueryElementItemLocation> {
	constructor({ prefixClass }: { prefixClass: string }) {
		super({
			prefixClass,
			idBtnCopy: idBtnCopyItemLocation,
			idInputOH,
			idInputAL,
			idInputIT,
			idInputSU,
			idInternalNumberInv,
			idItem: idInputItem,
			idLocation: idInputLocation,
			eventManagerSelectors: {
				containerPrincipalSelector: 'item-location',
				inputCheckboxSelector: 'item-location',
			},
			classType: 'item-location',
			SentenceSQLManager: SentenceSQLManagerItemLocation,
		});
	}

	public async initializeProperties() {
		await super.initializeProperties();
		try {
			this.queryElements.ITEM = document.querySelector(`${this.prefixClass} #${idInputItem}`);
			this.queryElements.LOCATION = document.querySelector(`${this.prefixClass} #${idInputLocation}`);

			if (!this.queryElements.ITEM || !this.queryElements.LOCATION) {
				throw new Error('No se encontraron los elementos ITEM o LOCATION');
			}
		} catch (error: any) {
			console.error('[ItemLocation.initializeProperties]: Error:', error.message);
		}
	}

	protected setElementValues() {
		super.setElementValues();
		const [firstRow] = this.selectedRows;
		if (!firstRow) return;
		this.queryElements.ITEM && (this.queryElements.ITEM.value = firstRow.querySelector(this.selectors.item)?.textContent || '');
		this.queryElements.LOCATION && (this.queryElements.LOCATION.value = firstRow.querySelector(this.selectors.location)?.textContent || '');
	}
}

interface QueryElementItemLocation extends QueryElement {
	ITEM: HTMLInputElement | null;
	LOCATION: HTMLInputElement | null;
}

interface SentenceSQLValueItemLocation extends SentenceSQLValue {
	ITEM: string;
	LOCATION: string;
}

class SentenceSQLManagerItemLocation extends SentenceSQLManager<QueryElementItemLocation> {
	constructor(parameters: GetSentenceSQLParams<QueryElementItemLocation>) {
		super(parameters);
	}

	protected getStatementWhere(values: SentenceSQLValueItemLocation) {
		const { DIV_INTERNAL_NUM, ITEM, LOCATION } = values;
		const selectedRowsNum = DIV_INTERNAL_NUM.split(',\n').length;

		const typeWhereMap = {
			internal: () => {
				const statement = selectedRowsNum > 1 ? `IN (\n${DIV_INTERNAL_NUM}\n)` : `= ${DIV_INTERNAL_NUM}`;
				return `AND internal_location_inv ${statement}`;
			},
			itemLoc: () => `AND location = '${LOCATION}'\nAND item = '${ITEM}'`,
		};

		// Esta lógica debe ser dinámica, por ahora la dejo fija para el ejemplo
		const type = 'itemLoc';

		return `\nWHERE warehouse = 'Mariano'\nAND company = 'FM'\n${typeWhereMaptype as keyof typeof typeWhereMap};`;
	}

	public getStatementSQL(queryElements: QueryElementItemLocation) {
		const baseValues = super.getStatementSQL(queryElements);
		if (!baseValues) return;

		const { ITEM, LOCATION } = queryElements;

		const values: SentenceSQLValueItemLocation = {
			...JSON.parse(baseValues).values, // Reutilizamos los valores base
			ITEM: ITEM?.value?.trim() || '',
			LOCATION: LOCATION?.value?.trim() || '',
		};

		// Lógica para generar el SQL completo con los nuevos valores
		// ... (similar a la lógica de la clase padre pero con getStatementWhere sobreescrito)
		return '...'; // Devuelve el SQL final
	}
}
