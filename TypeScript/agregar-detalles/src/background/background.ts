import type { BackgroundMessage, ContentScriptMessage } from './types';
import { BackgroundActions, ContentScriptActions, type BackgroundAction, type ContentScriptAction } from '../messaging/actions';

// Este script se ejecuta en segundo plano
console.log('[background.ts] Service Worker running.');

/**
 * Envía un mensaje al content script de la pestaña activa.
 * @param action La acción para el content script.
 * @param data El payload de datos.
 */
async function sendMessageToContentScript(action: ContentScriptAction, data: any): Promise<void> {
	console.log('[sendMessageToContentScript]', action, data);
	try {
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

		if (tab?.id) {
			const message: ContentScriptMessage = { action, data };
			chrome.tabs.sendMessage(tab.id, message);
		} else {
			console.error('No se encontró una pestaña activa para enviar el mensaje.');
		}
	} catch (error) {
		// Este error puede ocurrir si el content script aún no está listo para recibir mensajes.
		console.warn('Error al enviar mensaje al content script:', error);
	}
}

/**
 * Mapa para reenviar mensajes de un tipo de acción a otro.
 * La clave es la acción entrante y el valor es la acción saliente.
 */
const actionForwardMap: Partial<Record<BackgroundAction, ContentScriptAction>> = {
	[BackgroundActions.DATA_FROM_SHIPMENT_DETAIL]: ContentScriptActions.UPDATE_SHIPMENT_DETAIL,
	[BackgroundActions.DATA_FROM_INVENTORY_DETAIL]: ContentScriptActions.UPDATE_INVENTORY_DETAIL,
	[BackgroundActions.DATA_FROM_RECEIPT_CONTAINER_DETAIL]: ContentScriptActions.UPDATE_RECEIPT_CONTAINER_DETAIL,
	[BackgroundActions.DATA_FROM_RECEIPT_DETAIL]: ContentScriptActions.UPDATE_RECEIPT_DETAIL,
	[BackgroundActions.DATA_FROM_SHIPPING_CONTAINER_DETAIL]: ContentScriptActions.UPDATE_SHIPPING_CONTAINER_DETAIL,
	[BackgroundActions.DATA_FROM_WAVE_DETAIL]: ContentScriptActions.UPDATE_WAVE_DETAIL,
	[BackgroundActions.DATA_FROM_WORK_INSTRUCTION_DETAIL]: ContentScriptActions.UPDATE_WORK_INSTRUCTION_DETAIL,
	[BackgroundActions.DATA_FROM_LOAD_DETAIL]: ContentScriptActions.UPDATE_LOAD_DETAIL,
	[BackgroundActions.DATA_FROM_ITEM_UOM]: ContentScriptActions.UPDATE_ITEM_UOM,
};

/**
 * Manejador principal de mensajes para el service worker.
 * Debe devolver `true` si `sendResponse` se va a usar de forma asíncrona.
 */
chrome.runtime.onMessage.addListener((message: BackgroundMessage, sender, sendResponse) => {
	console.log(`[background.ts] Acción recibida: ${message.action}`);

	const { action, url, data } = message;

	// --- Manejadores especiales ---
	if (action === BackgroundActions.OPEN_NEW_TAB) {
		console.log('[OPEN_NEW_TAB]');
		
		if (url && sender.tab?.index !== undefined) {
			chrome.tabs.create({ url, index: sender.tab.index + 1, active: false });
			sendResponse({ status: 'OK' });
		} else {
			console.error(`Falta URL o información de la pestaña para "${BackgroundActions.OPEN_NEW_TAB}"`);
			sendResponse({ status: 'Error', message: 'Falta URL o información de la pestaña.' });
		}
		return; // Respuesta síncrona, no es necesario devolver true.
	}

	if (action === BackgroundActions.DATA_NOT_FOUND_FROM_DETAIL) {
		console.log('[No Data Found GET]');
		const responseData = {
			header: data,
			message: 'Datos no encontrados',
		};
		sendMessageToContentScript(ContentScriptActions.DATA_NOT_FOUND, responseData);
		return;
	}

	// --- Manejador de reenvío genérico ---
	const forwardAction = actionForwardMap[action];
	if (forwardAction) {
		console.log(`[Acción de reenvío] De: ${action} -> A: ${forwardAction}`);
		sendMessageToContentScript(forwardAction, data);
		return;
	}

	// --- Manejador para acciones desconocidas ---
	console.error(`Acción desconocida recibida: ${action}`);
	// Para evitar que el puerto se cierre si el remitente espera una respuesta,
	// podrías enviar una respuesta de error.
	// sendResponse({ status: 'Error', message: `Acción desconocida: ${action}` });
});
