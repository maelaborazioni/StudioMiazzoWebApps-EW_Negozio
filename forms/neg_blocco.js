/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"B3883BF1-9239-478A-BC5B-F57B9C734E17",variableType:93}
 */
var vDataBlocco = globals.TODAY;

/**
 * @type {Array<Number>}
 *
 * @properties={typeid:35,uuid:"51B09833-0283-45AD-89D7-0C18A85D5FFF",variableType:-4}
 */
var vArrDitte = [];

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"22E4F907-C85F-48B4-A910-BC1F50FB9144"}
 * @AllowToRunInFind
 */
function onActionBtnFilterData(event) 
{
	if(foundset.find())
	{
		foundset.giorno = globals.dateFormat(vDataBlocco,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
		foundset.search();
	}
	
	elements.btn_filter.enabled = false;
	elements.btn_unfilter.enabled = true;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C4681FA3-AB19-4730-A935-303E8532E011"}
 */
function onActionBtnUnfilterData(event) 
{
	vDataBlocco = null;
	foundset.loadAllRecords();
	
	elements.btn_filter.enabled = true;
	elements.btn_unfilter.enabled = false;
}

/**
 * @properties={typeid:24,uuid:"BB01C20D-3161-4CAD-BF6B-82E3981C5D40"}
 */
function scegliDataBlocco()
{
	var form = forms.neg_data;
	
	globals.ma_utl_setStatus(globals.Status.EDIT,form.controller.getName());
	
	return globals.ma_utl_showFormInDialog(form.controller.getName(), 'Data blocco', null, true);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"CCB14516-9EA6-4A81-A580-EFFA5A20A6EC"}
 */
function onActionBtnAddBlocks(event) 
{
	vDataBlocco = scegliDataBlocco();
	
	vArrDitte = globals.ma_utl_showLkpWindow({ event: event, 
		                                          lookup: 'AG_Lkp_Ditta',
												  multiSelect : true,
												  allowInBrowse : true
												  });
	var fsLavBloccati = globals.getProgFasceBlocco(globals.getLavoratoriDittaDalAl(vArrDitte),
		                                           vDataBlocco);
	
	var arrLavBloccati = globals.foundsetToArray(fsLavBloccati,'idlavoratore');
	application.output('Lavoratori bloccati : ' + arrLavBloccati);
	
	/** @type {Array<Number>} */
	var arrLavSelezionati = globals.ma_utl_showLkpWindow({event: event, 
		                                          lookup: 'AG_Lkp_Lavoratori',
												  methodToAddFoundsetFilter : 'filterLavoratoriBlocco',
												  multiSelect : true,
												  allowInBrowse : true,
												  disabledElements : arrLavBloccati
												  });
	if(!arrLavSelezionati || arrLavSelezionati.length == 0)
	{
		globals.ma_utl_showWarningDialog('Nessun lavoratore selezionato');
		return;
	}
	
	if(globals.setProgFasceBlocco(arrLavSelezionati,vDataBlocco))
	    globals.ma_utl_showInfoDialog('Blocco della programmazione avvenuto correttamente nel giorno ' + globals.dateFormat(vDataBlocco,globals.EU_DATEFORMAT),'Programmazione negozio');	
	else
		globals.ma_utl_showErrorDialog('L\'operazione di blocco della programmazione non è riuscita','Programmazione negozio');
	
	databaseManager.refreshRecordFromDatabase(foundset,-1);
}

/**
 * @param {JSFoundSet<db:/ma_anagrafiche/lavoratori>} fs
 * 
 * @properties={typeid:24,uuid:"BA5A529D-F44C-4122-9826-3357762F8DE9"}
 * @AllowToRunInFind
 */
function filterLavoratoriBlocco(fs)
{
	if(vDataBlocco == null)
		vDataBlocco = globals.TODAY;
	
	var arrLav = globals.getLavoratoriDittaDalAl(vArrDitte,vDataBlocco,vDataBlocco);
	fs.addFoundSetFilterParam('idlavoratore','IN',arrLav);
	
	return fs;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"E2C17AA5-152C-4493-BC69-AC7196FFBC3D"}
 */
function onActionBtnConfirm(event) 
{
	globals.svy_mod_closeForm(event);
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"653718EC-722A-4E90-A993-995BC4B04EBD"}
 */
function onShow(firstShow, event) 
{
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
	foundset.loadAllRecords();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"42AFA74D-0A9D-4FBD-BB62-7C142D75AC98"}
 */
function onActionClose(event) 
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	closeAndContinue(event);
}