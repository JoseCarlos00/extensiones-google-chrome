function inicio() {
  console.log('errrorSegurity.js');
  chrome.runtime.sendMessage({
    action: 'datos_no_encontrados_desde_detail',
    data: 'Security access violation',
  });
  setTimeout(window.close, 50);
}

window.addEventListener('load', inicio, { once: true });
