class ButtonOpenModal {
	constructor({ buttonId, iconoModal, textLabel, textLabelPosition, title }) {
		this.buttonId = buttonId ?? "";
		this.iconoModal = iconoModal ?? "";
		this.textLabel = textLabel ?? "ERROR";
		this.textLabelPosition = textLabelPosition ?? "right";
		this.title = title ?? "";
	}

	async _getLiElement() {
		const li = document.createElement("li");
		return li;
	}

	async _getAnchorElement() {
		const a = document.createElement("a");
		a.href = "javascript: void(0)";
		a.title = this.title;
		a.id = this.buttonId;
		a.className = "navimageanchor visiblepane";
		a.setAttribute("data-toggle", "detailpane");
		a.setAttribute("aria-label", this.textLabel);
		a.setAttribute("data-balloon-pos", this.textLabelPosition);

		return a;
	}

	async _getIconoElement() {
		const icono = document.createElement("svg");
		icono.innerHTML = this.iconoModal;

		return icono;
	}

	async _createButton() {
		const li = await this._getLiElement();
		const a = await this._getAnchorElement();
		const icono = await this._getIconoElement();

		a.appendChild(icono);
		li.appendChild(a);

		return li;
	}

	static async getButtonOpenModal(confiuration) {
		try {
			const button = new ButtonOpenModal(confiuration);
			return await button._createButton();
		} catch (error) {
			console.error("Error: Ha ocurrido un error al crear un Elemento <li> button", error);
		}
	}
}
