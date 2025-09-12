import { ModalCreateHTML } from "../modal/ModaCreateHTML"
import { TabsComponent } from "../utils/TabsComponent"
import { contentModalAjtPositive } from "./content/adjustmentPositive"
import { contentModal } from "./content/updateContainer"
import { contentModalSts } from "./content/updateStatus"


export async function getHtmlContent({ sectionContainerClass, modalId }: { sectionContainerClass: string, modalId: string }): Promise<HTMLElement> {
	const modal = new ModalCreateHTML({ sectionContainerClass, modalId, widthContent: "1200px" });
	const modalHTML = modal.createModaElement();

	if (!modalHTML) {
		throw new Error('No se pudo crear el ELEMENT HTML del modal');
	}

	const tabs = [
		{ tab: "Cambio de Contenedor", content: contentModal },
		{ tab: "Cambio de Status", content: contentModalSts },
		{ tab: "Ajuste Positivo", content: contentModalAjtPositive },
	];

	const tabsContainer = TabsComponent.getTabs({ tabs });

	if (!tabsContainer) {
		throw new Error('No se pudo crear el contenedor de tabs');
	}

	modal.insertContentModal(tabsContainer);

	return modalHTML;
}
