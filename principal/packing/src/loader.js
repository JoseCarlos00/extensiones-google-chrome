(function () {
	const injectScript = (scriptName) => {
		const script = document.createElement('script');
		script.src = chrome.runtime.getURL(scriptName);
		(document.head || document.documentElement).appendChild(script);
	};

	injectScript('index.js');
})();
