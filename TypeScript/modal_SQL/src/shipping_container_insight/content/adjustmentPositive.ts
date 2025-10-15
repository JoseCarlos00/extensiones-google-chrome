import { buttonCopyRoundedLeft } from '../../utils/buttonCopy'
import { adjustmentPositive } from '../consts';
const { idBtnCopyAjsPositive, idAdjustmentPositiveForm } = adjustmentPositive;

const btnCopyAjsPositive = buttonCopyRoundedLeft(idBtnCopyAjsPositive);

export const contentModalAjtPositive = /*html*/ `
  <pre class="position-relative adjustment-positive">
  ${btnCopyAjsPositive}
  <label class="label-ajuste-positivo" style="font-weight: 600;margin-bottom: 4px; margin: 0;padding: 0;width: 470px;display: inline-block;">
    <span style=" width: 111px; display: inline-block; ">Item</span> <span style=" width: 45px; display: inline-block; ">Qty</span> <span>Location</span>
  </label>
  <textarea id="${idAdjustmentPositiveForm}" style="width: 470px; height: 150px; border-color: #c4c3c9; border-radius: 8px; padding: 8px;"></textarea>
  </pre>
`;
