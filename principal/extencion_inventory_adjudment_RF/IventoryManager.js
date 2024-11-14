class IventoryManager {
	constructor() {
		this.type = form1?.adjType?.value;
		this.formularioHTML = "";
	}

	async render() {
		try {
			await this.renderForm();
		} catch (error) {}
	}

	async renderForm() {}
}
