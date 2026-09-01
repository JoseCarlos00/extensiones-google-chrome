import { InventoryManager } from "./InventoryManager.js";

// Transferencia Manual LP
export class InventoryTransferLP extends InventoryManager {
	constructor({ formularioHTML, nameDataStorage, adjType }) {
		super({ formularioHTML, nameDataStorage, adjType });
		console.log('Class InventoryTransfer LP');
	}


}
