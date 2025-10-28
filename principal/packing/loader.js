(function () {
	const script = document.createElement('script');
	script.src = chrome.runtime.getURL('Confirm.js');

	(document.head || document.documentElement).appendChild(script);
})();
