class ElementsHtml {
	replaceText = (element, text) => {
		const label = element.querySelector("label");
		label.textContent = text;
	};

	static seeMoreInformation() {
		const div = document.createElement("div");
		div.className = "ScreenControlHyperlink summarypaneheadermediumlabel hideemptydiv row";

		const a = document.createElement("a");
		a.id = "seeMoreInformation";
		a.className = "detailpaneheaderlabel ScreenControlHyperlink anchorPanelDetail";
		a.setAttribute("role", "buttton");
		a.href = "javascript:void(0);";
		a.title = "Pedir datos externos";

		div.appendChild(a);
		return div;
	}

	static createElementAnchor({ id, title = "" }) {
		const div = document.createElement("div");
		div.className = "summarypaneheadermediumlabel hideemptydiv row";

		const a = document.createElement("a");
		a.id = id.replace("#", "");
		a.className = "detailpaneheaderlabel ScreenControlHyperlink, anchorPanelDetail";
		a.setAttribute("role", "buttton");
		a.href = "javascript:void(0);";
		a.title = title;

		div.appendChild(a);
		return div;
	}

	static createElement({ id, title = "", bold = false, color = false }) {
		const div = document.createElement("div");
		div.className = "ScreenControlLabel summarypaneheadermediumlabel hideemptydiv row detailpaneheaderDiv";

		const label = document.createElement("label");
		label.id = id.replace("#", "");
		label.className = "detailpaneheaderlabel detailpaneheaderlabelPersonality ";
		label.title = title;

		if (bold && color) {
			label.style = "color: #4f93e4 !important; font-weight: bold;";
		} else if (bold) {
			label.style = "font-weight: bold; letter-spacing: 1px;";
		} else if (color) {
			label.style = "color: #4f93e4";
		}

		div.appendChild(label);

		return div;
	}
}
