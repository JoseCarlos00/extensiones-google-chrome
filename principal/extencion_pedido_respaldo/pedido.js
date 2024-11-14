class PedidoRespaldoManager extends ManagerContent {
	constructor() {
		super();

		this.inputInsertCode = document.querySelector(
			"#plc_lt_znContent_pageplaceholder_pageplaceholder_lt_zoneCenter_Pedido_userControlElem_boxCodigoBarras"
		);

		this.inputInsertQty = document.querySelector(
			"#plc_lt_znContent_pageplaceholder_pageplaceholder_lt_zoneCenter_Pedido_userControlElem_boxCantidadCart"
		);

		this.nameDataStorage = "pedido_respaldo";

		this.elementToInsert = document.querySelector(
			"#plc_lt_znContent_pageplaceholder_pageplaceholder_lt_zoneCenter_Pedido_userControlElem_panel1"
		);
	}

	insertButtonsAdd() {
		const getButton = (id) => {
			return `
			<div class="btn-insert-add">
				<a id="${id}" role="button" class="btn-add btn-azul tr_all_hover r_corners color_light">Add</a>
			</div>
		`;
		};

		const elementToInsertButtonCode = this.inputInsertCode?.closest("td");
		const elemetoToInsertButonCode1 = document
			.querySelector(
				"#plc_lt_znContent_pageplaceholder_pageplaceholder_lt_zoneCenter_Pedido_userControlElem_btnSearchCodigoBarras"
			)
			?.closest("div");

		if (elemetoToInsertButonCode1) {
			elemetoToInsertButonCode1.insertAdjacentHTML("beforebegin", getButton("insertCode"));
		} else if (elementToInsertButtonCode) {
			elementToInsertButtonCode.insertAdjacentHTML("beforeend", getButton("insertCode"));
		} else {
			console.error("No existe el elemento para insertar el botón [insert Code]");
		}

		const elementoToInsertButtonQty = this.inputInsertQty?.closest("td");
		const elemetInsert1 = document.querySelector(
			"#plc_lt_znContent_pageplaceholder_pageplaceholder_lt_zoneCenter_Pedido_userControlElem_panel1 > table.table_type_2.full_width.t_align_l.r_corners.wraper.shadow.bg_light_color_1 > tbody > tr:nth-child(6) > td > div:nth-child(2)"
		);
		if (elemetInsert1) {
			elemetInsert1.insertAdjacentHTML("beforebegin", getButton("insertQty"));
		} else if (elementoToInsertButtonQty) {
			elementoToInsertButtonQty.insertAdjacentHTML("beforeend", getButton("insertQty"));
		} else {
			console.error("No existe el elemento para insertar el botón [insert Qty]");
		}

		setTimeout(() => this.setEventsButtonsAdd(), 50);
	}
}
