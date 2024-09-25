import { PrintManangerDetail } from './PrintMangerDetail.js';
// Espera a que la página haya cargado antes de ejecutar la función inicio
window.addEventListener(
  'load',
  () => {
    new PrintManangerDetail();
  },
  { once: true }
);
