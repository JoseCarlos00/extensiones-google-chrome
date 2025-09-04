class HistoryScale {
	#NAME_STORAGE = "history_scale";

	constructor() {
		console.log("[HistoryScale]");
		this.historyList = JSON.parse(sessionStorage.getItem(this.#NAME_STORAGE)) || [];
		this.currentTitle = document.title.trim();
		this.currentUrl = location.href;

		this.isErrorPage = this.currentTitle === "Security access violation";

		this.init();
	}

	init() {
		if (this.isErrorPage) {
			return;
		}

		// Verificar si la última URL en el historial es la misma
		if (this.historyList.length === 0 || this.historyList[this.historyList.length - 1]?.url !== this.currentUrl) {
			this.addToHistory();
		}
	}

	addToHistory() {
		// Eliminar instancias anteriores con el mismo título
		this.historyList = this.historyList.filter((entry) => entry.title !== this.currentTitle);

		const entry = {
			title: this.currentTitle,
			url: this.currentUrl,
			timestamp: new Date().toISOString(),
		};

		this.historyList.push(entry);

		// Limitar el historial a las últimas 15 entradas
		if (this.historyList.length > 10) {
			this.historyList.shift();
		}

		sessionStorage.setItem(this.#NAME_STORAGE, JSON.stringify(this.historyList));
	}

	getHistory() {
		return this.historyList;
	}

	clearHistory() {
		this.historyList = [];
		sessionStorage.removeItem(this.#NAME_STORAGE);
	}
}

// Instancia la clase para que comience a guardar el historial
const historyManager = new HistoryScale();
console.log("historyManager:", historyManager);
