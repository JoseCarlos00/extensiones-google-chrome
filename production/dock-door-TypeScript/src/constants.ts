import { CreateTable } from "./CreateTable";

const tableNew = CreateTable.createTableDockDoor();


export const TABLE_DOCK_CONTENT = tableNew ? tableNew.outerHTML : '';

export const TABLE_HTML = /*html*/ `
  <div class="table-content">
    ${TABLE_DOCK_CONTENT}
  </div>
`;

export const MODAL_HTML = /*html*/`
<section class="modal-container">
  <div id="modalShowDockDoor" class="modal">
    <div class="modal-content">

    <button type="button" aria-label="Close" data-balloon-pos="left" class="close">
      <svg aria-hidden="true" focusable="false" data-prefix="fad" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="fa-circle-xmark">
        <path fill="currentColor"
          d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
          class="fa-secondary"></path>
        <path fill="currentColor"
          d="M209 175c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47z"
          class="fa-primary"></path>
      </svg>
    </button>

    <div class="title-modal-container">
      <label class="title-modal">Puertas Libres</label>
      <label class="title-modal">Puertas asignadas</label>
    </div>

      ${TABLE_DOCK_CONTENT}
    </div>
  </div>

</section>
`;

export const NAME_DATA_STORAGE_DOORS = "doorAssignmentList";
