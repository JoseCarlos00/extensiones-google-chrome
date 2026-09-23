console.log('[background.js]');

chrome.runtime.onMessage.addListener((message, sender) => {
	if (message.command !== 'openNewTab') {
		return;
	}

	if (!sender.tab) {
		console.error('[Print Container] sender.tab no existe');
		return;
	}

	const printUrl = chrome.runtime.getURL(`${message.urlPrefix}print/print.html`);

	const url =
		printUrl +
		'?thead=' +
		encodeURIComponent(message.theadToPrint) +
		'&tbody=' +
		encodeURIComponent(message.tbodyToPrint);

	console.log('[Print Container] Abriendo:', url.slice(0, 100));

	chrome.tabs.create({
		url,
		index: sender.tab.index + 1,
		active: true,
	});
});
