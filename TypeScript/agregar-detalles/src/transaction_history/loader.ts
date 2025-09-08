// Este script se ejecuta como un content script tradicional.
// Su única función es inyectar el script principal (main.js) en la página,
// pero como un módulo, lo que le permite usar 'import'.

(function () {
	console.log('[loader.ts]');
	
	const script = document.createElement('script');
	script.type = 'module'; // ¡Esta es la línea clave!
	// Obtenemos la URL del script principal desde los recursos de la extensión.
	script.src = chrome.runtime.getURL('transaction_history/main.js');
	// Lo añadimos al <head> de la página para que se cargue y ejecute.
	(document.head || document.documentElement).appendChild(script);
})();
