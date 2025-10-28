import { internalNumber } from '../consts';
import { HandlerTemplate } from './HandlerTemplate';
const { idBtnCopyInternalNumber, idInputOh, idInputAl, idInputIt, idInputSu, idInternalNumberInv } = internalNumber;

export class InternalNUmber extends HandlerTemplate {
	constructor({ prefixClass }: { prefixClass: string }) {
		super({
			prefixClass,
			idBtnCopy: idBtnCopyInternalNumber,
			idInputOh,
			idInputAl,
			idInputIt,
			idInputSu,
			idInternalNumberInv,
			eventManagerSelectors: {
				containerPrincipalSelector: 'internal-number',
				inputCheckboxSelector: 'internal-number',
			},
			classType: 'internal-number',
		});
	}
}
