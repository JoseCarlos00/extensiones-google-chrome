class ReceiptManagerTraslados extends ReceiptManagerWithDone<DataTraslados> {
    private inputTrailerId: HTMLInputElement | null = null;
    getLicensePlateInput() { return this.inputLicensePlate; }
    autocompleteForm(): void { ... }
    submitForm(): void { ... }
    updateCounter(): void { ... }
}
