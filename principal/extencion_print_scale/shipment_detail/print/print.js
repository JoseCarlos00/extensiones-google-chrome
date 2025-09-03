import { PrintManagerDetail } from './PrintMangerDetail.js';
// Espera a que la página haya cargado antes de ejecutar la función inicio
window.addEventListener(
  'load',
  () => {
    new PrintManagerDetail();
  },
  { once: true }
);
