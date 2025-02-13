class ErrorSegurity {
	constructor({ historyList = [] }) {
		console.log("[ErrorSegurity]");

		this.historyList = Array.from(historyList);
	}

	async render() {
		try {
			console.log("[ErrorSegurity] RENDER");
			console.log("historyList:", this.historyList);
			await this.insertButtonRefresh();
		} catch (error) {
			console.error("Ha ocurrido un error al renderizar [ErrorSegurity]:", error?.message, error);
		}
	}

	getHtmlLiElemnts() {
		if (this.historyList.length === 0) {
			return;
		}

		const optionsHtml = this.historyList
			.map(({ title, url }) => {
				return `<li><a href="${url}">${title}</a></li`;
			})
			.join("\n");

		return optionsHtml;
	}

	insertButtonRefresh() {
		return new Promise((resolve, reject) => {
			const ulElementoToInsert = document.querySelector(
				"#topNavigationBar > nav > ul.nav.navbar-nav.navbar-left.visible-sm.visible-md.visible-lg.navbarposition"
			);

			const li = `
				<li class="history-scale">
					<div id="navHistory" class="nav dropdown open">
							<a href="#" class="navbar-text dropdown-toggle navbaraction" data-toggle="dropdown" style="text-decoration: none" aria-expanded="true"><i class="far fa-history"></i><b class="caret"></b></a>
							<ul class="dropdown-menu" id="navTrail">
								${this.getHtmlLiElemnts()}
							</ul>
					</div>
				</li>
        `;

			if (!ulElementoToInsert) {
				reject("[insertModalInDOM] No se encontró el elemento <ul> a insertar");
			}

			ulElementoToInsert.insertAdjacentHTML("beforeend", li);

			setTimeout(resolve, 50);
		});
	}
}

window.addEventListener("load", async () => {
	const NAME_STORAGE = "history_scale";
	console.log("[errorSegurity]");

	const historyList = JSON.parse(sessionStorage.getItem(NAME_STORAGE)) || [];
	const currentTitle = document.title.trim();
	const isErrorPage = currentTitle === "Security access violation";

	console.log("isErrorPage", isErrorPage);
	if (isErrorPage) {
		const errorPage = new ErrorSegurity({ historyList });
		console.log(errorPage);
		await errorPage.render();
	}
});
