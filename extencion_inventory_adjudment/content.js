function inicio() {
  function getAdjType(iIndex) {
    if (iIndex == 0) return 'Ajuste Negativo';
    if (iIndex == 1) return 'Ajuste Negativo LPN';
    if (iIndex == 2) return 'Ajuste Positivo';
    if (iIndex == 3) return 'Ajustes';
    if (iIndex == 4) return 'Cambio de Estatus';
    if (iIndex == 5) return 'Status Change';
    if (iIndex == 6) return 'Transferencia Manual';
    if (iIndex == 7) return 'Transferencia Manual LP';
    return '';
  }

  function showProcImg() {
    var layerRef = 'document.all';
    var styleRef = '.style';
    var imageRef = 'document.images';

    eval(layerRef + '["' + 'procImg' + '"]' + styleRef + '.visibility = "visible"');
  }

  var stAdj = getAdjType(form1.adjType.selectedIndex);

  if (stAdj == 'Ajuste Positivo') {
    content();
  }

  function content() {
    var iNumOfSubmits = 0;
    var stOldLoc = '';
    var oldLP = '';
    var validationRequired = true;

    function insertarDatos() {
      return new Promise((resolve, reject) => {
        var stAdj = getAdjType(form1.adjType.selectedIndex);
        form1.location.value = 'STG-01';
        var stLocation = form1.location.value;

        if (stLocation == '') {
          reject('Error: stLocation está vacío');
          return;
        }

        form1.quantity.value = 1;
        var qty = form1.quantity.value;

        if (qty == '') {
          reject('Error: stQuantity no está definido');
          return;
        }

        // showProcImg();
        form1.HIDDENadjType.value = ' + stAdj +';

        // Simula una operación asincrónica, por ejemplo, un temporizador
        setTimeout(function () {
          resolve('insertarDatos completado exitosamente');
        }, 5000);
      });
    }

    function insertarItem() {
      return new Promise((resolve, reject) => {
        form1.item.value = '7173-2034-9122';
        var stItem = form1.item.value;

        if (stItem == '') {
          reject('Error: item está vacío');
          return;
        }

        // showProcImg();
        form1.HIDDENadjType.value = ' + stAdj +';
        form1.action = 'InventoryManagementRF.aspx?item=' + stItem;

        // No es necesario usar resolve(form1.submit()), simplemente usa form1.submit();
        form1.submit();
        resolve(); // Resuelves la promesa después de enviar el formulario
      });
    }

    insertarItem()
      .then(() => {
        // Aquí puedes realizar acciones adicionales después de insertarItem()
        console.log('insertarItem completado exitosamente');
        form1.submit();
        // Luego, puedes ejecutar insertarDatos()
        return insertarDatos();
      })
      .then(resultado => {
        console.log(resultado);
        // Aquí puedes hacer algo después de que insertarDatos() se complete
        form1.submit();
        // No es necesario form1.submit() aquí, ya que ya se ha hecho en insertarItem()
      })
      .catch(error => {
        console.error(error);
        // Aquí manejas cualquier error que ocurra durante la ejecución de insertarItem() o insertarDatos()
      });
  }
}

window.onload = inicio;
