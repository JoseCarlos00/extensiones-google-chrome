import { ModalCreateHTML } from '../modal/ModaCreateHTML';
export async function getHtmlContent({ sectionContainerClass, modalId, formId }: { sectionContainerClass: string; modalId: string, formId: string }): Promise<HTMLElement> {
  const modalContent = /*html*/ `
    <form id="${formId}" class="insertar-item">
      <label for="insertItem"> 
        Insertar Item 
      </label>

      <textarea id="insertItem"  name="insertItem" required placeholder="9413-6209-34996,"></textarea>

      <div class="invalid-feedback">
        Proporciona un item valido.
      </div>

      <div class="container-buttons">
         <button class="button" id="registrarItems">
          <span class="text">Registrar</span>
        </button>
         <button type="reset" class="button-clear" tabindex="0">
          <span class="text">Limpiar</span>
        </button>
      </div>
    </form>
  `;

  const modal = new ModalCreateHTML({ sectionContainerClass, modalId });
  const modalHTML = modal.createModaElement();

  if (!modalHTML) {
		throw new Error('No se pudo crear el ELEMENT HTML del modal');
	}

  modal.insertContentModal(modalContent);

  return modalHTML;
}
