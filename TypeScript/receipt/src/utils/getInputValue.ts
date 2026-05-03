export function getInputValue(formName: string, inputName: string): string {
	const form = document.forms.namedItem(formName);
	const input = form?.elements.namedItem(inputName) as HTMLInputElement | null;
	return input?.value.trim() ?? '';
}
