export class TabsComponent {
	private tabs: { tab: string; content: string | Element }[];

	constructor({ tabs = [] }: { tabs: { tab: string; content: string | Element }[] }) {
		this.tabs = tabs;
	}

	private getContainerPrincipal() {
		const container = document.createElement('div');
		container.className = 'MuiTabs-container-principal';
		return container;
	}

	private getSectionSecondaryTabs() {
		const section = document.createElement('section');
		section.className = 'MuiTabs-section-secondary';
		return section;
	}

	private getHeaderContainer() {
		const headerContainer = document.createElement('header');
		headerContainer.className = 'MuiTabs-container';
		return headerContainer;
	}

	private getNavScroller() {
		const navScroller = document.createElement('nav');
		navScroller.className = 'MuiTabs-scroller';
		return navScroller;
	}

	private getButtonTabs = (index: number) => {
		const tabItem = document.createElement('button');

		tabItem.className = index === 0 ? 'Mui-Button Mui-selected' : 'Mui-Button';
		tabItem.id = `tab-${index}`;
		tabItem.type = 'button';
		tabItem.role = 'tab';
		tabItem.tabIndex = index === 0 ? 0 : -1;
		tabItem.setAttribute('aria-controls', `tabpanel-${index}`);
		tabItem.setAttribute('aria-selected', index === 0 ? 'true' : 'false');

		return tabItem;
	};

	private getTabList() {
		if (this.tabs.length === 0) {
			console.error('[getTabList]: No tabs provided');
			throw new Error('No tabs provided');
		}

		const tabList = document.createElement('div');
		tabList.className = 'MuiTabs-list MuiTabs-flexContainer';

		this.tabs.forEach(({ tab }, index) => {
			const tabItem = this.getButtonTabs(index);
			tabItem.innerHTML = tab + '<span class="animation"></span>';

			tabList.appendChild(tabItem);
		});

		return tabList;
	}

	private getTabIndicator() {
		const tabIndicator = document.createElement('span');
		tabIndicator.className = 'MuiTabs-indicator';
		tabIndicator.style = 'left: 0; width: 70px;';

		return tabIndicator;
	}

	private getSectionTabs() {
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
	private getTabPanel(index: number) {
		const tabPanel = document.createElement('div');

		tabPanel.id = `tabpanel-${index}`;
		tabPanel.role = 'tabpanel';
		tabPanel.setAttribute('aria-labelledby', `tab-${index}`);

		if (index !== 0) {
			tabPanel.hidden = true;
		}

		return tabPanel;
	}

	private getContainerTabContent() {
		const section = document.createElement('section');
		return section;
	}

	private getSectionContent() {
		if (this.tabs.length === 0) {
			console.error('[getSectionContent]: No tabs provided');
			throw new Error('No tabs provided');
		}

		const sectionContent = this.getContainerTabContent();

		this.tabs.forEach(({ content }, index) => {
			const tabPanel = this.getTabPanel(index);

			const container = document.createElement('div');
			container.className = 'MuiTabs-content';

			// Verificar si content es un elemento HTML
			if (content instanceof Element) {
				container.appendChild(content);
			} else if (typeof content === 'string') {
				container.innerHTML += content;
			} else {
				throw new Error('El tipo de contenido no es soportado');
			}

			tabPanel.appendChild(container);
			sectionContent.appendChild(tabPanel);
		});

		return sectionContent;
	}

	private getTabs() {
		try {
			const containerPrincipal = this.getContainerPrincipal();
			const sectionTabs = this.getSectionTabs();
			const sectionContent = this.getSectionContent();

			sectionTabs && containerPrincipal.appendChild(sectionTabs);
			containerPrincipal.appendChild(sectionContent);

			return containerPrincipal;
		} catch (error: any) {
			console.error('[getTabs]: Error', error.message);
			throw error;
		}
	}

	static getTabs({ tabs }: { tabs: { tab: string; content: string | Element }[] }) {
		try {
			// Validaciones más estrictas
			if (!Array.isArray(tabs) || tabs.length === 0) {
				throw new Error("TabsComponent: 'tabs' debe ser un array con al menos un elemento.");
			}

			const tabsComponent = new TabsComponent({ tabs });
			const container = tabsComponent.getTabs();

			if (!container) {
				throw new Error('TabsComponent: Error al generar el contenedor de pestañas.');
			}

			return container;
		} catch (error: any) {
			console.error('[getTabs (static)]:', error.message);
			return null;
		}
	}
}
