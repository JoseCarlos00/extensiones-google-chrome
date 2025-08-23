const getStorageState = localStorage.getItem("toggleStateHiddenElements") ?? "hide";

if (getStorageState === "show") {
	document.body?.setAttribute("hidden-element", "show");
} else {
	document.body?.setAttribute("hidden-element", "hide");
}

class SwitchHiddeOpction {
	constructor() {
		this.switchhiddeOpction = document.createElement("div");
		this.switchhiddeOpction.classList.add("hidden-option-toggle-container");
	}

	setContet() {
		const getStorageState = localStorage.getItem("toggleStateHiddenElements") ?? "hide";
		const isChecked = getStorageState === "show" ? "" : "checked=true";

		this.switchhiddeOpction.innerHTML = /*html*/ `
      <label class="switch">
        <input class="input" type="checkbox" ${isChecked} />
        <span class="slider"></span>
      </label>
    `;
	}

	setStorageState = (value) => localStorage.setItem("toggleStateHiddenElements", value);

	toggle = (event) => {
		if (event.target.checked) {
			document.body.setAttribute("hidden-element", "hide");
			this.setStorageState("hide");
		} else {
			document.body.setAttribute("hidden-element", "show");
			this.setStorageState("show");
		}
	};

	setEventLisners() {
		const switchToggle = this.switchhiddeOpction.querySelector(".input");

		if (switchToggle) {
			switchToggle.addEventListener("change", (e) => this.toggle(e));
		} else {
			console.error("[setEventLisners] Error: Switch toggle not found");
		}
	}

	render() {
		const elemetToInsert = document.querySelector('form[action*="ReceivingRF.aspx"] [value=Cancel]');

		if (!elemetToInsert) {
			return;
		}

		this.setContet();
		elemetToInsert.insertAdjacentElement("afterend", this.switchhiddeOpction);
		setTimeout(this.setEventLisners(), 50);
	}
}

window.addEventListener("load", () => {
	try {
		inhabiliteStyle();

		const title = document
			.querySelector('#proRfWrapper > form[action*="ReceivingRF.aspx"] > table > tbody > tr.touchscreen-show > td > b')
			?.textContent?.trim();

		if (title !== "Select a receiving preference") {
			return;
		}

		const switchHiddeOpction = new SwitchHiddeOpction();
		switchHiddeOpction.render();
	} catch (error) {
		console.error("Error renderizar SwitHiddeOption: ", error);
	}
});


function inhabiliteStyle() {
	const checkInTittle = document.querySelector('#proRfWrapper > h3')?.textContent?.trim();
	const containerForm = document.querySelector('#proRfWrapper > form');

	if ((checkInTittle === 'Check in' || checkInTittle === 'Putaway group') && containerForm) {
		containerForm.classList.add('check-in-form');
	}
}
