(function () {
	const injectScript = (scriptName) => {
		const script = document.createElement('script');
		script.src = chrome.runtime.getURL(scriptName);
		(document.head || document.documentElement).appendChild(script);
	};

	// Inject ToastAlert.js first, as Confirm.js might depend on it
	injectScript('ToastAlert.js');
	injectScript('Confirm.js');
})();
