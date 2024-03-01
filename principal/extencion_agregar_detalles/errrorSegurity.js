function inicio() {
  console.log('errrorSegurity.js');
  chrome.runtime.sendMessage({ action: 'datos_no_encontrados_desde_detail' });
}

window.addEventListener('load', inicio, { once: true });
