
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"8DACFDB9-A7B5-46BA-B3E5-D30923A07ED6"}
 */
function onActionBtnDelete(event) 
{
	if(globals.deleteProgFasceBlocco(idlavoratore,giorno))
	{
		globals.ma_utl_showInfoDialog('Sblocco della programmazione avvenuto correttamente per il dipendente ' + globals.getNominativo(idlavoratore) 
			                          + ' nel giorno ' + globals.dateFormat(giorno,globals.EU_DATEFORMAT),'Programmazione negozio')
	    databaseManager.refreshRecordFromDatabase(foundset,-1);
	}
	else
		globals.ma_utl_showErrorDialog('L\'operazione di blocco della programmazione non è riuscita','Programmazione negozio');
	
	
}
