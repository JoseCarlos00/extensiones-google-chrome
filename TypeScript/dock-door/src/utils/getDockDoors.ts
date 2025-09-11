import { CreateTable, type DockListData, type DataContent } from '../CreateTable';

const createObjectDockList = (dockDoorList: DataContent[]): DockListData | null => {
	if (dockDoorList.length === 0) {
		console.warn('[createObjectDockList]: No se encontraron datos en "_webUi.config.ConfigValue["DockDoor_List"]"');
		return null;
	}


	let listEMB: Partial<DataContent>[] = [];
	let listOthers: Partial<DataContent>[] = [];

 dockDoorList.forEach((dockDoor) => {
		if (dockDoor.Description.startsWith('EMB-')) {
			listEMB.push({ Description: dockDoor.Description });
		} else {
			listOthers.push({ Description: dockDoor.Description });
		}
 });

  console.log({ listEMB });
  console.log({ listOthers });
  

	return {
		EMB: {
			data: listEMB,
		},
		Otras: {
			data: listOthers,
		},
	} as DockListData;
};

export const getTableDockDoor = (): HTMLTableElement | null => {
	try {
		// @ts-ignore - _webUi es una variable global del contexto de la página
		console.log('Dock Door List:', _webUi.config.ConfigValue['DockDoor_List']);

		// @ts-ignore - _webUi es una variable global del contexto de la página
		const dockDoorList: DataContent[] = _webUi.config.ConfigValue['DockDoor_List'];
		const parseObject = createObjectDockList(dockDoorList);
    
    if (!parseObject) {
      return null
    }

		const table = CreateTable.createTableDockDoor(parseObject);
		
    return table
	} catch (error) {
    console.error('[getTableDockDoor]: Error: Ha ocurrido un error al crear la tabla Dock Door');
    
		return null;
	}
};
