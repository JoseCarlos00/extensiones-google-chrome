class ReceiptManagerDevoluciones extends ReceiptManagerWithDone<DataDevoluciones> {
    private inputReceiptId: HTMLInputElement | null = null;
    getLicensePlateInput() { return this.inputLicensePlate; }
    autocompleteForm(): void { ... }
    submitForm(): void { ... }
    updateCounter(): void { ... }
}
