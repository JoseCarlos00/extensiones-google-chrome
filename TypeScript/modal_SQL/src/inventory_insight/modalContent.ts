import { ModalCreateHTML } from "../modal/ModaCreateHTML"
import { TabsComponent } from "../utils/TabsComponent"
import { containerMain } from "./content/internalNum"
// import { contentModal } from "./content/updateContainer"
// import { contentModalSts } from "./content/updateStatus"


export async function getHtmlContent({ sectionContainerClass, modalId }: { sectionContainerClass: string, modalId: string }): Promise<HTMLElement> {
	const modal = new ModalCreateHTML({ sectionContainerClass, modalId });
	const modalHTML = modal.createModaElement();

	if (!modalHTML) {
		throw new Error('No se pudo crear el ELEMENT HTML del modal');
	}

	const tabs = [
		{ tab: 'Internal Num', content: containerMain },
		{ tab: "Item - Location", content: '' },
		{ tab: "Add Inv", content: '' }
	];

	const tabsContainer = TabsComponent.getTabs({ tabs });

	if (!tabsContainer) {
		throw new Error('No se pudo crear el contenedor de tabs');
	}

	modal.insertContentModal(tabsContainer);

	return modalHTML;
}
