class ModalManagerShippingContainer extends ModalManager {
	constructor(configuration) {
		super(configuration);
	}

	async setEventListeners() {
		try {
			super.setEventListeners();

			// Event to copy
			const btnCopy = document.querySelector(".btn-copy-code");
			if (btnCopy) {
				btnCopy.addEventListener("click", () => this.modalHandler.handleCopyToClipBoar());
			}

			this.initEventsTabs();
		} catch (error) {
			console.error("Error:[setEventListeners] Ha ocurrido un error al crear los eventListener", error);
		}
	}

	initEventsTabs() {
		const tabs = document.querySelectorAll(".MuiTabs-container-principal .MuiTabs-list button");
		const panels = document.querySelectorAll(".MuiTabs-container-principal [role='tabpanel']");
		const indicator = document.querySelector(".MuiTabs-container-principal .MuiTabs-indicator");

		const tabSelected = document.querySelector(".MuiTabs-container-principal .MuiTabs-list button.Mui-selected");

		console.log("initEventsTabs");
		console.log({ tabs, panels, indicator, tabSelected });

		tabs.forEach((tab, index) => {
			tab.addEventListener("click", function () {
				// Remover clase activa de todos los tabs
				tabs.forEach((t) => t.classList.remove("Mui-selected"));

				// Agregar clase activa al tab clickeado
				this.classList.add("Mui-selected");

				// Mostrar el panel correspondiente y ocultar los demás
				panels.forEach((panel) => (panel.hidden = true));
				document.getElementById(`tabpanel-${index}`).hidden = false;

				// Actualizar aria-selected
				tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
				this.setAttribute("aria-selected", "true");

				// Mover indicador visual
				indicator.style.left = `${this.offsetLeft}px`;
				indicator.style.width = `${this.offsetWidth}px`;
			});
		});

		if (tabSelected) {
			indicator.style.left = `${tabSelected.offsetLeft}px`;
			indicator.style.width = `${tabSelected.offsetWidth}px`;
		}
	}
}
