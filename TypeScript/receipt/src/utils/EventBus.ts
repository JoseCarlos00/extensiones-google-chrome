type AppEvents = {
	STORAGE_CHANGED: void;
	DATA_SAVED: { type: string };
	DATA_DELETED: { type: string };
};

type EventHandler<T> = (payload: T) => void;

export class EventBus {
	private listeners: {
		[K in keyof AppEvents]?: EventHandler<AppEvents[K]>[];
	} = {};

	on<K extends keyof AppEvents>(event: K, handler: EventHandler<AppEvents[K]>) {
		this.listeners[event] ??= [];
		this.listeners[event]!.push(handler);
	}

	off<K extends keyof AppEvents>(event: K, handler: EventHandler<AppEvents[K]>) {
		const handlers = this.listeners[event];
		if (!handlers) return;

		const index = handlers.indexOf(handler);
		if (index !== -1) handlers.splice(index, 1);
	}

	emit<K extends keyof AppEvents>(event: K, payload: AppEvents[K]) {
		this.listeners[event]?.forEach((handler) => handler(payload));
	}
}

export const eventBus = new EventBus();
