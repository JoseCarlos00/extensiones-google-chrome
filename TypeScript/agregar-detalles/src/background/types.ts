import type { BackgroundAction, ContentScriptAction } from '../messaging/actions';

/**
 * Estructura de los mensajes enviados DESDE los content scripts HACIA el background script.
 */
export interface BackgroundMessage {
	action: BackgroundAction;
	url?: string;
	data?: any;
}

/**
 * Estructura de los mensajes enviados DESDE el background script HACIA los content scripts.
 */
export interface ContentScriptMessage {
	action: ContentScriptAction;
	data: any;
}
