import { addInventory } from '../consts';
import { SentenceSQLManager, type GetSentenceSQLParams, type SentenceSQLValue } from '../SentenceSQL';
import { ToastAlert } from '../../utils/ToastAlert';
import { HandlerTemplate } from './HandlerTemplate';
const { idBtnCopyAddInventory, idInputOH, idInputAL, idInputIT, idInputSU, idInternalNumberInv } = addInventory;

export class AddInventory extends HandlerTemplate {
	constructor({ prefixClass }: { prefixClass: string }) {
		super({
			prefixClass,
			idBtnCopy: idBtnCopyAddInventory,
			idInputOH,
			idInputAL,
			idInputIT,
			idInputSU,
			idInternalNumberInv,
			eventManagerSelectors: {
				containerPrincipalSelector: 'add-inventory',
				inputCheckboxSelector: 'add-inventory',
			},
			classType: 'add-inventory',
			SentenceSQLManager: SentenceSQLManagerAddInv,
		});
	}
}

class SentenceSQLManagerAddInv extends SentenceSQLManager {
	constructor(parameters: GetSentenceSQLParams) {
		super(parameters);
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
			OH: () => `  ON_HAND_QTY = ON_HAND_QTY + ${values.OH}`,
			AL: () => `  ALLOCATED_QTY = ALLOCATED_QTY + ${values.AL}`,
			IT: () => `  IN_TRANSIT_QTY = IN_TRANSIT_QTY + ${values.IT}`,
			SU: () => `  SUSPENSE_QTY = SUSPENSE_QTY + ${values.SU}`,
		};

		const result = inputOptionsSet
			.filter((item) => {
				const type = item.dataset.type as keyof typeof typeSetMap;
				const val = values[type];
				// Solo incluir si el input está seleccionado Y si el valor correspondiente existe y no está vacío.
				return item.checked && val;
			})
			.map((item) => {
				const type = item.dataset.type as keyof typeof typeSetMap;
				return typeSetMap[type]();
			})
			.join(',\n');

		if (!result) {
			ToastAlert.showAlertFullTop('No se generó ninguna parte del SET porque no hay valores válidos.');
			return;
		}

		return result;
	}
}
