import { namesStorages } from '../constants';
import { getButtonElementLiSaveData } from './buttons/buttons'
import { ReceiptTypeDevoluciones } from './handlers/ReceiptTypeDevoluciones';
import { ReceiptTypeTraslados } from './handlers/ReceiptTypeTraslados';
import { SaveDataManager } from './SaveDataManager'

const { buttonDeleteData, buttonSaveData } = getButtonElementLiSaveData();

const manager = new SaveDataManager({
	buttonSaveData,
	buttonDeleteData,

	receiptTypeHandlers: [
		new ReceiptTypeTraslados({ nameStorage: namesStorages.traslados }),
		new ReceiptTypeDevoluciones({ nameStorage: namesStorages.devoluciones }),
	],
});

manager.initialize();
