export class UiIggridIndicator {
	private static readonly SORT_ORDER_CONTENT = {
		asc: '<span class="ui-iggrid-colindicator-asc ui-icon ui-icon-arrowthick-1-n"></span>',
		desc: '<span class="ui-iggrid-colindicator-desc ui-icon ui-icon-arrowthick-1-s"></span>',
	};

	private static readonly SORT_ORDER_TITLES = {
		asc: 'ordenado ascendente',
		desc: 'ordenado descendente',
	};

	public static showIndicator(element: HTMLElement, sortOrder: 'asc' | 'desc'): void {
		if (!element) {
			console.error('[UiIggridIndicator.showIndicator] El elemento proporcionado es nulo.');
			return;
		}

		const indicatorContainer = element.querySelector<HTMLElement>('.ui-iggrid-indicatorcontainer');
		if (!indicatorContainer) {
			console.error(
				'[UiIggridIndicator.showIndicator] No se encontró el contenedor del indicador en el elemento.',
				element
			);
			return;
		}

		// Set title on the parent header element
		element.setAttribute('title', this.SORT_ORDER_TITLES[sortOrder]);

		// Set indicator content
		indicatorContainer.innerHTML = this.SORT_ORDER_CONTENT[sortOrder];
	}

	/**
	 * Deletes all sorting indicators from the table headers.
	 */
	public static deleteAllIndicators(): void {
		const indicators = document.querySelectorAll(
			'#myModalShowTable #tableContent .ui-iggrid-indicatorcontainer span'
		);
		
		indicators.forEach((indicator) => indicator.remove());
	}
}
