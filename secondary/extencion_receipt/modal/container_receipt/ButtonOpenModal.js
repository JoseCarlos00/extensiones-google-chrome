class ButtonOpenModal {
	constructor({ buttonId, iconoModal, textLabel, textLabelPosition }) {
		this.buttonId = buttonId ?? "";
		this.iconoModal = iconoModal ? iconoModal : "fa-bug";
		this.textLabel = textLabel ?? "ERROR";
		this.textLabelPosition = textLabelPosition ?? "right";
	}

	async _getLiElement() {
		const li = document.createElement("li");
		li.className = "navdetailpane visible-sm visible-md visible-lg";

		return li;
	}

	async _getAnchorElement() {
		const a = document.createElement("a");
		a.href = "javascript: void(0)";
		a.id = this.buttonId;
		a.className = "navimageanchor visiblepane";
		a.setAttribute("data-toggle", "detailpane");
		a.setAttribute("aria-label", this.textLabel);
		a.setAttribute("data-balloon-pos", this.textLabelPosition);

		return a;
	}

	async _getIconoElement() {
		const icono = document.createElement("i");
		icono.className = `far ${this.iconoModal} navimage`;
		icono.id = this.buttonId + "Icono";
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
