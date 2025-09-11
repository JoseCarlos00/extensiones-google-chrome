import DockDoorList from "./dockList.json";

export type DataContent = {
	Description: string;
	Identifier?: string;
	IdentifierAndDescription?: string;
	DisplayText?: string;
	IsDescUsedForDisplay?: true;
	ParentComboKey?: null;
	Default?: Boolean;
};

export interface DockGroup {
	data: DataContent[];
}

export interface DockListData {
	[type: string]: DockGroup;
}

export class CreateTable {
	private dockDoorList: DockListData | null = null;

	constructor(dockList?: DockListData | null) {
		if (dockList) {
			this.dockDoorList = dockList;
		} else {
			this.dockDoorList = DockDoorList as DockListData;
		}
	}

	private createTable() {
		const table = document.createElement('table');
		table.id = 'tableDockDoor';
		table.classList.add('hidden');

		const thead = this.createHeader();
		const tbody = this.createBody();

		table.appendChild(thead);
		table.appendChild(tbody);

		return table;
	}

	private createHeader() {
		const thead = document.createElement('thead');
		const tr = document.createElement('tr');

		const thEmb = document.createElement('th');
		thEmb.textContent = 'EMB';
		thEmb.setAttribute('colspan', '5');
		thEmb.setAttribute('align', 'center');
    
		const thOthers = document.createElement('th');
		thOthers.textContent = 'Otras';
		thOthers.setAttribute('colspan', '2');
		thOthers.setAttribute('align', 'center');
    
		tr.appendChild(thEmb);
		tr.appendChild(thOthers);

		thead.appendChild(tr);

		return thead;
	}

	private createBody() {
		const tbody = document.createElement('tbody');

		if (!this.dockDoorList) {
			return tbody;
		}

		const dockListData = this.dockDoorList;
		const groupOrder = ['EMB', 'Otras']; // Order based on thead
		const groupColumns: { [key: string]: number } = {
			EMB: 5,
			Otras: 2,
		};
    
		const numRows = 15;

		for (let i = 0; i < numRows; i++) {
			const tr = this.createRow();

			for (const groupName of groupOrder) {
				const group = dockListData[groupName];
				const numCols = groupColumns[groupName];

				if (group) {
					for (let j = 0; j < numCols; j++) {
						const index = i + j * numRows;
						const cellData = group.data[index] || { Description: '' };
						const td = this.createCell();
						td.textContent = cellData.Description;
						tr.appendChild(td);
					}
				} else {
					// Fill with empty cells to maintain table structure if group is missing
					for (let j = 0; j < numCols; j++) {
						tr.appendChild(this.createCell());
					}
				}
			}
			tbody.appendChild(tr);
		}
		return tbody;
	}

	private createRow() {
		const tr = document.createElement('tr');
		return tr;
	}

  private createCell() {
		const td = document.createElement('td');
		return td;
	}


	public static createTableDockDoor(dockList?: DockListData | null): HTMLTableElement | null {
		try {
      const createTable = new CreateTable(dockList);
			const table = createTable.createTable();

			return table;
    } catch (error) {
      console.error('Error al crear la tabla de dock doors:', error);
      return null;
    }
	}
}
