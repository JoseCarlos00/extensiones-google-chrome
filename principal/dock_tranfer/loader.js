(function () {
	console.log('[loader.js]');

	const script = document.createElement('script');
	// script.type = 'module'; // ¡Esta es la línea clave!
	// Obtenemos la URL del script principal desde los recursos de la extensión.
	script.src = chrome.runtime.getURL('content.js');
	// Lo añadimos al <head> de la página para que se cargue y ejecute.
	(document.head || document.documentElement).appendChild(script);
})();
