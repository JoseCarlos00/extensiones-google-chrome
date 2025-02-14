/**
 * Clase que representa un botón para abrir un modal.
 */
class ButtonOpenModal {
	/**
	 * Constructor de la clase ButtonOpenModal.
	 * @param {Object} params - Parámetros para configurar el botón.
	 * @param {string} params.buttonId - ID del botón.
	 * @param {string} params.iconoModal - Clase del icono que se mostrará en el botón.
	 * @param {string} params.textLabel - Texto que se mostrará en el botón.
	 * @param {string} params.textLabelPosition - Posición del texto en relación al icono.
	 */
	constructor({ buttonId, iconoModal, textLabel, textLabelPosition }) {
		this.buttonId = buttonId ?? "";
		this.iconoModal = iconoModal ? iconoModal : "fa-bug";
		this.textLabel = textLabel ?? "ERROR";
		this.textLabelPosition = textLabelPosition ?? "right";
	}

	/**
	 * Crea un elemento `<li>` que contendrá el botón.
	 * @returns {HTMLElement} - El elemento `<li>` creado.
	 */
	_getLiElement() {
		const li = document.createElement("li");
		li.className = "navdetailpane visible-sm visible-md visible-lg";

		return li;
	}

	/**
	 * Crea un elemento `<a>` que actuará como el botón.
	 * @returns {HTMLElement} - El elemento `<a>` creado.
	 */
	_getAnchorElement() {
		const a = document.createElement("a");
		a.href = "javascript: void(0)";
		a.id = this.buttonId;
		a.className = "navimageanchor visiblepane";
		a.setAttribute("data-toggle", "detailpane");
		a.setAttribute("aria-label", this.textLabel);
		a.setAttribute("data-balloon-pos", this.textLabelPosition);

		return a;
	}

	/**
	 * Crea un elemento `<i>` que representa el icono del botón.
	 * @returns {HTMLElement} - El elemento `<i>` creado.
	 */
	_getIconoElement() {
		const icono = document.createElement("i");
		icono.className = `far ${this.iconoModal} navimage`;
		icono.id = this.buttonId + "Icono";
		return icono;
	}

	/**
	 * Crea el botón completo como un elemento `<li>` que contiene un <a> con un icono.
	 * @returns {HTMLElement} - El elemento `<li>` que contiene el botón.
	 */
	_createButton() {
		const li = this._getLiElement();
		const a = this._getAnchorElement();
		const icono = this._getIconoElement();

		a.appendChild(icono);
		li.appendChild(a);

		return li;
	}

	/**
	 * Método estático para crear un botón abierto de modal.
	 * @param {Object} configuration - Configuración para el botón.
	 * @returns {HTMLElement} - El elemento `<li>` que representa el botón.
	 */
	static async getButtonOpenModal(confiuration) {
		try {
			const button = new ButtonOpenModal(confiuration);
			return button._createButton();
		} catch (error) {
			console.error("Error: Ha ocurrido un error al crear un Elemento `<li>` button", error);
			throw new Error("Error al crear un Elemento `<li>` button");
		}
	}
}
