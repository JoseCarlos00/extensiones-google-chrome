async function inicio() {
  const result = await getLocalStorage();

  console.log('result:', result);

  if (!result) return;
  // Código adicional
}

async function getLocalStorage() {
  try {
    const result = await chrome.storage.local.get(['key']);
    return result.key;
  } catch (error) {
    console.error('Error getting doors from storage:', error);
    return null;
  }
}

window.addEventListener('load', inicio);
