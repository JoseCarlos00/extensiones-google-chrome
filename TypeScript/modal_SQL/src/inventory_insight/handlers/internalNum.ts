import { internalNumber } from '../consts';
import { SentenceSQLManager } from '../SentenceSQL'
import { HandlerTemplate } from './HandlerTemplate';
const { idBtnCopyInternalNumber, idInputOH, idInputAL, idInputIT, idInputSU, idInternalNumberInv } = internalNumber;

export class InternalNUmber extends HandlerTemplate {
	constructor({ prefixClass }: { prefixClass: string }) {
		super({
			prefixClass,
			idBtnCopy: idBtnCopyInternalNumber,
			idInputOH,
			idInputAL,
			idInputIT,
			idInputSU,
			idInternalNumberInv,
			eventManagerSelectors: {
				containerPrincipalSelector: 'internal-number',
				inputCheckboxSelector: 'internal-number',
			},
			classType: 'internal-number',
			SentenceSQLManager: SentenceSQLManager,
		});
	}
}
