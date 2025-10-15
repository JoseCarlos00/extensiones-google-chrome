interface EventManagerOptions {
	containerPrincipalSelector: string;
  inputCheckboxSelector: string;
}

export class EventManager {
	private containerPrincipal: HTMLElement | null = null;
  private inputCheckboxSelector: string;

	constructor({ containerPrincipalSelector, inputCheckboxSelector }: EventManagerOptions) {
    this.inputCheckboxSelector = inputCheckboxSelector;
		this.containerPrincipal = document.querySelector(containerPrincipalSelector);
	}

  public initialize () {
    try {
      this.setEventListeners();
    } catch (error: any) {
      console.error('[EventManager.initialize] Error:', error.message);
    }
  }

	private updateModalContent(e: Event) {
		const element = e.target as HTMLInputElement;

		if (!element) {
			console.error('[updateModalContent] No se encontró el elemento');
			return;
		}

    const dataset = element.dataset;

		if (!dataset.type) {
			console.error('[updateModalContent] No se encontró el atributo [data-type].');
			return;
		}

		if (!this.containerPrincipal) {
			console.error('[updateModalContent] No se encontró el elemento .main-code-container');
			return;
		}

		this.containerPrincipal.classList.toggle(dataset.type, element.checked);
	}

	private setEventListeners() {
    const inputsCheckbox = document.querySelectorAll(this.inputCheckboxSelector);

    if (!inputsCheckbox || inputsCheckbox.length === 0) {
      throw new Error('No se encontraron inputs con el selector proporcionado');
    }

    inputsCheckbox.forEach(input => {
      input.addEventListener('change', (e) => this.updateModalContent(e));
    });
	}
}
