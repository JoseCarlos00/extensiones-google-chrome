export class TabsComponent {
	constructor({ tabs = [] }) {
		this.tabs = tabs;
	}

	getContanerPrincipal() {
		const container = document.createElement("div");
		container.className = "MuiTabs-container-principal";
		return container;
	}

	getSectionSecondaryTabs() {
		const section = document.createElement("section");
		section.className = "MuiTabs-section-secondary";
		return section;
	}

	getHeaderContainer() {
		const headerContainer = document.createElement("header");
		headerContainer.className = "MuiTabs-contaier";
		return headerContainer;
	}

	getNavScroller() {
		const navScroller = document.createElement("nav");
		navScroller.className = "MuiTabs-scroller";
		return navScroller;
	}

	getButtonTabs = (index) => {
		const tabItem = document.createElement("button");

		tabItem.className = index === 0 ? "Mui-Button Mui-selected" : "Mui-Button";
		tabItem.id = `tab-${index}`;
		tabItem.type = "button";
		tabItem.role = "tab";
		tabItem.tabIndex = index === 0 ? "0" : "-1";
		tabItem.setAttribute("aria-controls", `tabpanel-${index}`);
		tabItem.setAttribute("aria-selected", index === 0 ? "true" : "false");

		return tabItem;
	};

	getTabList() {
		if (this.tabs.length === 0) {
			console.error("[getTabList]: No tabs provided");
			throw new Error("No tabs provided");
		}

		const tabList = document.createElement("div");
		tabList.className = "MuiTabs-list MuiTabs-flexContainer";

		this.tabs.forEach(({ tab }, index) => {
			const tabItem = this.getButtonTabs(index);
			tabItem.innerHTML = tab + '<span class="animation"></span>';

			tabList.appendChild(tabItem);
		});

		return tabList;
	}

	getTabIndicator() {
		const tabIndicator = document.createElement("span");
		tabIndicator.className = "MuiTabs-indicator";
		tabIndicator.style = "left: 0; width: 70px;";

		return tabIndicator;
	}

	getSectionTabs() {
		const sectionTabs = this.getSectionSecondaryTabs();
		const headerContainer = this.getHeaderContainer();
		const navScroller = this.getNavScroller();
		const tabIndicator = this.getTabIndicator();
		const tabList = this.getTabList();

		if (!tabList) {
			return null;
		}

		navScroller.appendChild(tabIndicator);
		navScroller.appendChild(tabList);
		headerContainer.appendChild(navScroller);
		sectionTabs.appendChild(headerContainer);

		return sectionTabs;
	}

	/** Insert Content */
	getTabPanel(index) {
		const tabPanel = document.createElement("div");

		tabPanel.id = `tabpanel-${index}`;
		tabPanel.role = "tabpanel";
		tabPanel.setAttribute("aria-labelledby", `tab-${index}`);

		if (index !== 0) {
			tabPanel.hidden = true;
		}

		return tabPanel;
	}

	getContainerTabContent() {
		const section = document.createElement("section");
		return section;
	}

	getSectionContent() {
		if (this.tabs.length === 0) {
			console.error("[getSectionContent]: No tabs provided");
			throw new Error("No tabs provided");
		}

		const sectionContent = this.getContainerTabContent();

		this.tabs.forEach(({ content }, index) => {
			const tabPanel = this.getTabPanel(index);

			const container = document.createElement("div");
			container.className = "MuiTabs-content";
			container.appendChild(content);

			tabPanel.appendChild(container);
			sectionContent.appendChild(tabPanel);
		});

		return sectionContent;
	}

	getTabs() {
		try {
			const containerPrincipal = this.getContanerPrincipal();
			const sectionTabs = this.getSectionTabs();
			const sectionContent = this.getSectionContent();

			containerPrincipal.appendChild(sectionTabs);
			containerPrincipal.appendChild(sectionContent);

			return containerPrincipal;
		} catch (error) {
			console.error("[getTabs]: Error", error.message);
			throw error;
		}
	}

	static getTabs({ tabs }) {
		try {
			// Validaciones más estrictas
			if (!Array.isArray(tabs) || tabs.length === 0) {
				throw new Error("TabsComponent: 'tabs' debe ser un array con al menos un elemento.");
			}

			const tabsComponent = new TabsComponent({ tabs, contents });
			const container = tabsComponent.getTabs();

			if (!container) {
				throw new Error("TabsComponent: Error al generar el contenedor de pestañas.");
			}

			return container;
		} catch (error) {
			console.error("[getTabs (static)]:", error.message);
			return null;
		}
	}
}
