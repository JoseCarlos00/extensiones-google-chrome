/**
 * Acciones enviadas DESDE los content scripts HACIA el background script.
 */
export const BackgroundActions = {
	OPEN_NEW_TAB: 'open_new_tab',
	DATA_NOT_FOUND_FROM_DETAIL: 'datos_no_encontrados_desde_detail',
	DATA_FROM_SHIPMENT_DETAIL: 'datos_desde_shipment_detail',
	DATA_FROM_INVENTORY_DETAIL: 'datos_desde_inventory_detail',
	DATA_FROM_RECEIPT_CONTAINER_DETAIL: 'datos_desde_receipt_container_detail',
	DATA_FROM_RECEIPT_DETAIL: 'datos_desde_receipt_detail',
	DATA_FROM_SHIPPING_CONTAINER_DETAIL: 'datos_desde_shipping_container_detail',
	DATA_FROM_WAVE_DETAIL: 'datos_desde_wave_detail',
	DATA_FROM_WORK_INSTRUCTION_DETAIL: 'datos_desde_work_instruction_detail',
	DATA_FROM_LOAD_DETAIL: 'datos_desde_load_detail',
	DATA_FROM_ITEM_UOM: 'datos_desde_item_unit_of_measure',
} as const;

/**
 * Acciones enviadas DESDE el background script HACIA los content scripts.
 */
export const ContentScriptActions = {
	DATA_NOT_FOUND: 'datos_no_encontrados',
	UPDATE_SHIPMENT_DETAIL: 'actualizar_datos_de_shipment_detail',
	UPDATE_INVENTORY_DETAIL: 'actualizar_datos_de_inventory_detail',
	UPDATE_RECEIPT_CONTAINER_DETAIL: 'actualizar_datos_de_receipt_container_detail',
	UPDATE_RECEIPT_DETAIL: 'actualizar_datos_de_receipt_detail',
	UPDATE_SHIPPING_CONTAINER_DETAIL: 'actualizar_datos_shipping_container_detail',
	UPDATE_WAVE_DETAIL: 'actualizar_datos_de_wave_detail',
	UPDATE_WORK_INSTRUCTION_DETAIL: 'actualizar_datos_de_work_instruction_detail',
	UPDATE_LOAD_DETAIL: 'actualizar_datos_de_load_detail',
	UPDATE_ITEM_UOM: 'actualizar_datos_de_item_unit_of_measure',
} as const;

type ValueOf<T> = T[keyof T];
export type BackgroundAction = ValueOf<typeof BackgroundActions>;
export type ContentScriptAction = ValueOf<typeof ContentScriptActions>;
