const tableHTML = `
<div class="table-content">
  <table id="content">
    <thead>
      <tr>
        <th colspan="5" align="center">EMB</th>
        <th colspan="2" align="center">Otras</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>EMB-01</td>
        <td>EMB-16</td>
        <td>EMB-31</td>
        <td>EMB-46</td>
        <td>EMB-61</td>
        <td>AMZ-01</td>
        <td>MARIANO CLIENTES</td>
      </tr>
      <tr>
        <td>EMB-02</td>
        <td>EMB-17</td>
        <td>EMB-32</td>
        <td>EMB-47</td>
        <td>EMB-62</td>
        <td>AMZ-02</td>
        <td>MAY-01</td>
      </tr>
      <tr>
        <td>EMB-03</td>
        <td>EMB-18</td>
        <td>EMB-33</td>
        <td>EMB-48</td>
        <td>EMB-63</td>
        <td>DOCK-01</td>
        <td>MAY-02</td>
      </tr>
      <tr>
        <td>EMB-04</td>
        <td>EMB-19</td>
        <td>EMB-34</td>
        <td>EMB-49</td>
        <td>EMB-64</td>
        <td>DOCK-02</td>
        <td>ML-01</td>
      </tr>
      <tr>
        <td>EMB-05</td>
        <td>EMB-20</td>
        <td>EMB-35</td>
        <td>EMB-50</td>
        <td>EMB-65</td>
        <td>DOCK-03</td>
        <td>ML-02</td>
      </tr>
      <tr>
        <td>EMB-06</td>
        <td>EMB-21</td>
        <td>EMB-36</td>
        <td>EMB-51</td>
        <td>EMB-66</td>
        <td>DOCK-04</td>
        <td>TUL-01</td>
      </tr>
      <tr>
        <td>EMB-07</td>
        <td>EMB-22</td>
        <td>EMB-37</td>
        <td>EMB-52</td>
        <td>EMB-67</td>
        <td>EXT-01</td>
        <td>TUL-02</td>
      </tr>
      <tr>
        <td>EMB-08</td>
        <td>EMB-23</td>
        <td>EMB-38</td>
        <td>EMB-53</td>
        <td>EMB-68</td>
        <td>EXT-02</td>
        <td>VIRTUAL-02</td>
      </tr>
      <tr>
        <td>EMB-09</td>
        <td>EMB-24</td>
        <td>EMB-39</td>
        <td>EMB-54</td>
        <td>EMB-69</td>
        <td>EXT-03</td>
        <td></td>
      </tr>
      <tr>
        <td>EMB-10</td>
        <td>EMB-25</td>
        <td>EMB-40</td>
        <td>EMB-55</td>
        <td>EMB-70</td>
        <td>INT-01</td>
        <td></td>
      </tr>
      <tr>
        <td>EMB-11</td>
        <td>EMB-26</td>
        <td>EMB-41</td>
        <td>EMB-56</td>
        <td>EMB-71</td>
        <td>INT-02</td>
        <td></td>
      </tr>
      <tr>
        <td>EMB-12</td>
        <td>EMB-27</td>
        <td>EMB-42</td>
        <td>EMB-57</td>
        <td>EMB-72</td>
        <td>INT-03</td>
        <td></td>
      </tr>
      <tr>
        <td>EMB-13</td>
        <td>EMB-28</td>
        <td>EMB-43</td>
        <td>EMB-58</td>
        <td>EMB-73</td>
        <td>LIMPIEZA</td>
        <td></td>
      </tr>
      <tr>
        <td>EMB-14</td>
        <td>EMB-29</td>
        <td>EMB-44</td>
        <td>EMB-59</td>
        <td>EMB-74</td>
        <td>MAE-01</td>
        <td></td>
      </tr>
      <tr>
        <td>EMB-15</td>
        <td>EMB-30</td>
        <td>EMB-45</td>
        <td>EMB-60</td>
        <td>EMB-75</td>
        <td>MAR-01</td>
        <td></td>
      </tr>
    </tbody>
  </table>

</div>
`;
async function getLocalStorage() {
	try {
		const result = await chrome.storage.local.get(["key"]);
		if (!result || !result.key) {
			console.error("No se encontró key en Chrome Storage");
			return [];
		}
		return result.key;
	} catch (error) {
		console.error("Error al obtener doors desde el almacenamiento:", error);
		return [];
	}
}

async function main() {
	let doors = [];

	const inputDockDoor = document.querySelector(
		"#ShippingLoadInfoSectionDockDoorValue > div > div.ui-igcombo-fieldholder.ui-igcombo-fieldholder-ltr.ui-corner-left > input"
	);

	const doorAssigned = inputDockDoor ? inputDockDoor.value : "";

	try {
		const result = await getLocalStorage();
		console.log("result:", result);

		// Asegúrate de que result es un array antes de verificar su longitud
		if (!Array.isArray(result) || result.length === 0) return;

		doors = result;
		console.log("doors:", doors);
		// Código adicional
		await insertTable();
		insertDoockNotAvailable();

		setEventSave();
		hiddenDoorLIst();
	} catch (error) {
		console.error("Error:", error);
		return;
	}

	function insertTable() {
		return new Promise((resolve, reject) => {
			const elementToInsert = document.querySelector("#ScreenGroupSubAccordion11736");

			if (!elementToInsert) {
				reject("No existe el Elemento a insertar la tabla");
				return;
			}

			elementToInsert.insertAdjacentHTML("beforeend", tableHTML);
			resolve();
		});
	}

	async function insertDoockNotAvailable() {
		try {
			const table = document.getElementById("content");
			if (!table) return; // Asegurarse de que la tabla existe

			const rows = Array.from(table.querySelectorAll("tbody tr td"));
			if (rows.length === 0) return; // Asegurarse de que hay filas en la tabla

			// await cleanClass('not-available');

			if (!doors) {
				return;
			}

			rows.forEach((td) => {
				const content = td.innerHTML;
				if (doors.includes(content)) {
					td.classList.add("not-available");
				}
			});
		} catch (error) {
			console.error(error);
			return;
		}
	}

	function setEventSave() {
		const btnSave = document.querySelector("#ShippingLoadMenuActionSave");

		btnSave && btnSave.addEventListener("click", addToDoorLocalStorage);

		document.addEventListener("keydown", function (event) {
			if (event.key === "Enter") {
				addToDoorLocalStorage();
			}
		});
	}

	async function addToDoorLocalStorage() {
		try {
			if (!doors || !Array.isArray(doors)) {
				return;
			}

			const valueINput = inputDockDoor ? inputDockDoor.value : "";

			if (doorAssigned !== valueINput) {
				// Elimina doorAssigned del array doors si es diferente a valueINput
				doors = doors.filter((door) => door !== doorAssigned);
			}

			if (valueINput) {
				doors.push(valueINput);

				await chrome.storage.local.set({ key: doors });
				console.log("Doors Save Storage");
			}
		} catch (error) {
			console.error("Error saving doors to storage:", error);
		}
	}

	function hiddenDoorLIst() {
		const doorList = document.querySelectorAll(
			"body > div:nth-child(27) ul.ui-igcombo-listitemholder > li.ui-igcombo-listitem .comboInfo .emphasizedText"
		);

		if (!doorList) return;

		doorList.forEach((doorElement) => {
			const content = doorElement.innerText;

			const liElement = doorElement.closest("li.ui-igcombo-listitem");

			if (doors.includes(content)) {
				liElement && liElement.classList.add("hidden");
			}
		});
	}
}

window.addEventListener("load", main);
