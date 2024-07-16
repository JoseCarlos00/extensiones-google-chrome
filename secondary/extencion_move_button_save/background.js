console.log('injectScript');
async function getTabId() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      tabs => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else if (tabs.length === 0) {
          reject(new Error('No active tab found'));
        } else {
          resolve(tabs[0].id);
        }
      }
    );
  });
}

async function injectScript() {
  try {
    const tabId = await getTabId();
    const tab = await chrome.tabs.get(tabId);

    // Verifica si la URL contiene el patrón deseado
    const urlPattern =
      'https://wms.fantasiasmiguel.com.mx/scale/trans/newwave?excludeFromNavTrail=Y';

    if (tab.url.includes(urlPattern)) {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['script.js'],
      });
      console.log('Script injected');
    } else {
      console.log('URL does not match');
    }
  } catch (error) {
    console.error('Error injecting script:', error);
  }
}

// Escucha eventos específicos o invoca `injectScript` directamente según sea necesario
chrome.action.onClicked.addListener(injectScript);
