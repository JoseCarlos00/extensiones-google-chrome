chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'ON',
  });
});

chrome.action.onClicked.addListener(async tab => {
  // Comprueba si la URL de la pestaña actual comienza con las URLs de extensiones o la envio de Chrome.
  if (tab.url.startsWith(inventory) || tab.url.startsWith(envio)) {
    // Obtiene el texto del distintivo (badge) de acción actual para verificar si la extensión está en 'ON' o 'OFF'.
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // El próximo estado siempre será el opuesto al estado actual.
    const nextState = prevState === 'ON' ? 'OFF' : 'ON';

    // Establece el texto del distintivo de acción en el próximo estado.
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });
  }
});
