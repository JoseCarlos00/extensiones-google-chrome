import { addInventory } from '../consts';
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
		});
	}
}
