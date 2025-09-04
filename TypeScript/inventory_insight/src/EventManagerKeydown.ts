type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

interface HandleKeydownParams {
	input: HTMLInputElement;
	key: ArrowKey;
	ev: KeyboardEvent;
}

export class EventManagerKeyDown {
	readonly validKeys: ArrowKey[] = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

	private isArrowKey(key: string): key is ArrowKey {
		return (this.validKeys as string[]).includes(key);
	}

	public handleEvent({ ev }: { ev: KeyboardEvent }): void {
		const { target, type, key } = ev;

		if (type === 'keydown' && target instanceof HTMLInputElement && this.isArrowKey(key)) {
			this.handleKeydown({ input: target, key, ev });
		}
	}

	private handleKeydown({ input, key, ev }: HandleKeydownParams): void {
		const td = input.closest('td');
		if (!td) return;

		const row = td.parentElement as HTMLTableRowElement;
		if (!row) return;

		const colIndex = Array.from(row.children).indexOf(td);
		if (colIndex === -1) return;

		const getNextCell = (direction: ArrowKey): HTMLInputElement | null => {
			const cellMap: Record<ArrowKey, () => Element | null | undefined> = {
				ArrowUp: () => row.previousElementSibling?.children[colIndex]?.querySelector('input'),
				ArrowDown: () => row.nextElementSibling?.children[colIndex]?.querySelector('input'),
				ArrowLeft: () => row.children[colIndex - 1]?.querySelector('input'),
				ArrowRight: () => row.children[colIndex + 1]?.querySelector('input'),
			};
			return cellMap[direction]() as HTMLInputElement | null;
		};

		const nextCell = getNextCell(key);

		if (nextCell) {
			ev.preventDefault();
			nextCell.focus();
			nextCell.select();
		}
	}
}
