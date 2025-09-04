// Define un tipo más específico para la posición del globo de texto.
export type BalloonPosition = 'up' | 'down' | 'left' | 'right';

export interface ButtonOpenModalConfiguration {
	buttonId?: string;
	iconoModal?: string;
	textLabel?: string;
	textLabelPosition?: BalloonPosition;
}

export class ButtonOpenModal {
	// Declarar propiedades de clase con tipos y modificadores de acceso.
	private readonly buttonId: string;
	private readonly iconoModal: string;
	private readonly textLabel: string;
	private readonly textLabelPosition: BalloonPosition;

	constructor({
		buttonId = '',
		iconoModal = 'fa-bug',
		textLabel = 'ERROR',
		textLabelPosition = 'right',
	}: ButtonOpenModalConfiguration) {
		this.buttonId = buttonId;
		this.iconoModal = iconoModal;
		this.textLabel = textLabel;
		this.textLabelPosition = textLabelPosition;
	}

	private getLiElement(): HTMLLIElement {
		const li = document.createElement('li');
		li.className = 'navdetailpane visible-sm visible-md visible-lg';
		return li;
	}

	private getAnchorElement(): HTMLAnchorElement {
		const a = document.createElement('a');
		a.href = 'javascript: void(0)';
		a.id = this.buttonId;
		a.className = 'navimageanchor visiblepane';
		a.setAttribute('data-toggle', 'detailpane');
		a.setAttribute('aria-label', this.textLabel);
		a.setAttribute('data-balloon-pos', this.textLabelPosition);
		return a;
	}

	private getIconoElement(): HTMLElement {
		const icono = document.createElement('i');
		icono.className = `far ${this.iconoModal} navimage`;
		return icono;
	}

	private createButton(): HTMLLIElement {
		const li = this.getLiElement();
		const a = this.getAnchorElement();
		const icono = this.getIconoElement();

		a.appendChild(icono);
		li.appendChild(a);

		return li;
	}
	
	public static getButtonOpenModal(configuration: ButtonOpenModalConfiguration): HTMLLIElement | undefined {
		try {
			const button = new ButtonOpenModal(configuration);
			return button.createButton();
		} catch (error) {
			console.error('Error: Ha ocurrido un error al crear un Elemento <li> button', error);
			return undefined; // Es buena práctica devolver undefined en caso de error.
		}
	}
}
