/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"2743D65C-E4BB-4402-9C04-0EE1DF8B9F92",variableType:8}
 */
var _settimana = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"13D03272-DEA7-4D13-94D7-4FCD5A01C18B",variableType:4}
 */
var vChkReteImpresa = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"A6284560-5DAF-44BD-8F86-9787CE2ABDD0",variableType:4}
 */
var vChkPrimaRiepilogo = 1;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"FE0D9C9D-4F3D-4CE0-A84A-1A4923637B01"}
 */
function confermaDittaPeriodoNegozio(event) 
{
	if(!vChkPrimaRiepilogo && _settimana == null)
	{
		globals.ma_utl_showWarningDialog('Selezionare la settimana da programmare');
		return;
	}
	
	// apertura form per la gestione del negozio (in base al periodo precompilare le settimane selezionabili)
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	
	var params = {
        processFunction: process_programmazione_responsabile_negozio,
        message: '', 
        opacity: 0.5,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : '',
        fontType: 'Arial,4,25',
        processArgs: [event]
    };
	plugins.busy.block(params);
		
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"7FAAED69-60C8-463A-AAE6-B97CE55A91B7"}
 */
function process_programmazione_responsabile_negozio(event)
{
	try
	{	
		globals.apriProgrammazioneNegozio(event,
			                              globals.getDitta(_to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore),
			                              _anno,
										  _mese,
										  '',
										  -1,
										  vChkPrimaRiepilogo ? 'NEG_CR_2' : 'NEG_CR',
										  _settimana);
		forms.neg_prog_cop_tab.fromSelezione = true;
	}
	catch(ex)
	{
		var msg = 'Metodo process_mese_abilita : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	    globals.svy_mod_closeForm(event);
	}
}

/**
 * Handle changed data.
 *
 * @param {Number} oldValue old value
 * @param {Number} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"2D59D653-BC46-4EDC-AC3A-F541F46E01C8"}
 */
function onDataChangeReteImpresa(oldValue, newValue, event)
{
	elements.fld_cod_ditta.enabled 	= elements.lbl_codice.enabled =
		elements.btn_selditta.enabled =
		elements.fld_ragionesociale.enabled = elements.lbl_ragione_sociale.enabled =
			elements.fld_anno.enabled = elements.lbl_anno.enabled = 
				elements.fld_mese.enabled = elements.lbl_mese.enabled =
					newValue == 1 ? false : true;
	globals.ma_utl_setStatus(newValue == 1 ? globals.Status.BROWSE : globals.Status.EDIT,controller.getName());
	elements.chk_rete_impresa.enabled = true;
	return true;
}

/**
*
* @param _firstShow
* @param _event
*
* @properties={typeid:24,uuid:"8BF70434-6A07-41AF-967B-8DBD73B85011"}
*/
function onShowForm(_firstShow, _event)
{
	_mese = globals.TODAY.getMonth() + 1;
	_anno = globals.TODAY.getFullYear();
	
	aggiornaVlsSettimane(_anno,_mese);
	
}

/**
 * @param {Number} _anno
 * @param {Number} _mese
 *
 * @properties={typeid:24,uuid:"DE687EEB-C99E-4621-AB16-8E3684C6C3DE"}
 */
function aggiornaVlsSettimane(_anno,_mese)
{
	var vlsRealValues = [];
	var vlsDisplayValues = [];
	var primaSettimanaCalc = globals.getPrimaSettimanaPeriodo(_anno,_mese);
	
	var primoGiornoSettimana = null;
	var ultimoGiornoSettimana = null;
		
	// ciclo su settimane del mese selezionato (10 valore casuale, l'algoritmo si interrompe al cambio di mese)
	for(var sett = 0; sett <= 10; sett++)
	{
		var numSetRiferimento = primaSettimanaCalc + sett;
		primoGiornoSettimana = globals.getDateOfISOWeek(primaSettimanaCalc + sett,_anno);
		ultimoGiornoSettimana = new Date(primoGiornoSettimana.getFullYear(),primoGiornoSettimana.getMonth(),primoGiornoSettimana.getDate() + 6);
		
		// se il primo giorno della settimana che stiamo valutando appartiene al mese successivo 
		// la settimana in questione andrà valutata nella gestione settimanale del mese corrispondente 
		if((_mese == 1 && primoGiornoSettimana.getMonth() > (_mese - 1) && primoGiornoSettimana.getFullYear() >= _anno)
			|| ((_mese != 1 && primoGiornoSettimana.getMonth() > (_mese - 1)) || primoGiornoSettimana.getFullYear() > _anno))
			break;
	    
		vlsRealValues.push(primaSettimanaCalc +  sett);
		var displayTxt = 'Settimana ' + numSetRiferimento 
						  + ' - [' + 
						globals.getNumGiorno(primoGiornoSettimana) + '/' +
						globals.getNumMese(primoGiornoSettimana.getMonth() + 1) +
						' - ' + 
						globals.getNumGiorno(ultimoGiornoSettimana) + '/' +
						globals.getNumMese(ultimoGiornoSettimana.getMonth() + 1) +']'
		vlsDisplayValues.push(displayTxt);
	}
	
	application.setValueListItems('vls_settimana',vlsDisplayValues,vlsRealValues);
}

/**
*
* @param oldValue
* @param newValue
* @param {JSEvent} event
*
* @properties={typeid:24,uuid:"72BE0260-9DAD-40CE-8609-EEF87F650894"}
*/
function onDataChangeMese(oldValue, newValue, event) 
{
	aggiornaVlsSettimane(_anno,_mese);
}

/**
 * Handle changed data.
 *
 * @param {String} oldValue old value
 * @param {String} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"439B8FC4-B453-44B2-90D1-304E9783D21D"}
 */
function onDataChangeAnno(oldValue, newValue, event)
{
	aggiornaVlsSettimane(_anno,_mese);
	return true;
}

/**
 * Handle changed data.
 *
 * @param {Number} oldValue old value
 * @param {Number} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"2133ADF2-2661-4C2A-97DF-6B77EC10E53C"}
 */
function onDataChangeChkPrimaRiepilogo(oldValue, newValue, event) 
{
	elements.lbl_settimana.enabled = elements.cmb_settimana.enabled = !newValue;
	return true;
}
