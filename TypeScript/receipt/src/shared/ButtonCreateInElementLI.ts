export type BalloonPosition = 'up' | 'down' | 'left' | 'right';

export interface ButtonElementLIConfiguration {
	buttonId?: string;
	iconButton?: string;
	textLabel?: string;
	textLabelPosition?: BalloonPosition;
}

/**
 * Clase que representa un botón
 */
export class ButtonCreateElementLI {
	private readonly buttonId: string;
	private readonly iconButton: string;
	private readonly textLabel: string;
	private readonly textLabelPosition: BalloonPosition;

	/**
	 * Constructor de la clase ButtonCreateElementLI.
	 * @param {Object} params - Parámetros para configurar el botón.
	 * @param {string} params.buttonId - ID del botón.
	 * @param {string} params.iconButton - Clase del icono que se mostrará en el botón.
	 * @param {string} params.textLabel - Texto que se mostrará en el botón.
	 * @param {string} params.textLabelPosition - Posición del texto en relación al icono.
	 */
	constructor({
		buttonId = '',
		iconButton = 'fa-bug',
		textLabel = 'ERROR',
		textLabelPosition = 'right',
	}: ButtonElementLIConfiguration) {
		this.buttonId = buttonId;
		this.iconButton = iconButton;
		this.textLabel = textLabel;
		this.textLabelPosition = textLabelPosition;
	}

	/**
	 * Crea un elemento `<li>` que contendrá el botón.
	 * @returns {HTMLLIElement} - El elemento `<li>` creado.
	 */
	private getLiElement(): HTMLLIElement {
		const li = document.createElement('li');
		li.className = 'navdetailpane visible-sm visible-md visible-lg';

		return li;
	}

	/**
	 * Crea un elemento `<a>` que actuará como el botón.
	 * @returns {HTMLAnchorElement} - El elemento `<a>` creado.
	 */
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

	/**
	 * Crea un elemento `<i>` que representa el icono del botón.
	 * @returns {HTMLElement} - El elemento `<i>` creado.
	 */
	private getIconoElement(): HTMLElement {
		const icono = document.createElement('i');
		icono.className = `far ${this.iconButton} navimage`;
		icono.id = this.buttonId;
		return icono;
	}

	/**
	 * Crea el botón completo como un elemento `<li>` que contiene un <a> con un icono.
	 * @returns {HTMLLIElement} - El elemento `<li>` que contiene el botón.
	 */
	private createButton(): HTMLLIElement {
		const li = this.getLiElement();
		const a = this.getAnchorElement();
		const icono = this.getIconoElement();

		a.appendChild(icono);
		li.appendChild(a);

		return li;
	}

	/**
	 * Método estático para crear un botón.
	 * @param {Object} configuration - Configuración para el botón.
	 * @returns {HTMLElement} - El elemento `<li>` que representa el botón.
	 */
	public static getButtonElement(configuration: ButtonElementLIConfiguration): HTMLLIElement | undefined {
		try {
			const button = new ButtonCreateElementLI(configuration);
			return button.createButton();
		} catch (error) {
			console.error('Error: Ha ocurrido un error al crear un Elemento <li> button', error);
			return undefined; // Es buena práctica devolver undefined en caso de error.
		}
	}
}
