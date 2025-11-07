import { ModalCreateHTML } from "../modal/ModaCreateHTML"
import { TabsComponent } from "../utils/TabsComponent"
import { containerMain as containerMainInternalNum } from "./content/internalNum"
import { containerMain as contentModalAddInventory } from "./content/addInventory"
import { containerMain as contentModalItemLocation } from "./content/itemLocation"



export async function getHtmlContent({ sectionContainerClass, modalId }: { sectionContainerClass: string, modalId: string }): Promise<HTMLElement> {
	const modal = new ModalCreateHTML({ sectionContainerClass, modalId });
	const modalHTML = modal.createModaElement();

	if (!modalHTML) {
		throw new Error('No se pudo crear el ELEMENT HTML del modal');
	}

	const tabs = [
		{ tab: 'Internal Num', content: containerMainInternalNum },
		{ tab: "Item - Location", content: contentModalItemLocation },
		{ tab: "Add Inv", content: contentModalAddInventory }
	];

	const tabsContainer = TabsComponent.getTabs({ tabs });

	if (!tabsContainer) {
		throw new Error('No se pudo crear el contenedor de tabs');
	}

	modal.insertContentModal(tabsContainer);

	return modalHTML;
}
