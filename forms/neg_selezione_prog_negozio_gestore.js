/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"623AA209-17E3-43CE-A0C4-7FCD9C6A1016",variableType:4}
 */
var vChkReteImpresa = 0;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"E4199402-6932-4C69-829D-CEE427B95CA6"}
 */
function confermaDittaPeriodoNegozio(event) 
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	
	forms.neg_prog_periodo_tab.fromSelezione = true;
	
	var params = {
        processFunction: process_conferma_ditta_periodo,
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
 * @properties={typeid:24,uuid:"9B3A0120-3A23-4288-B9D4-DF7B2892A580"}
 * @SuppressWarnings(wrongparameters)
 */
function process_conferma_ditta_periodo(event)
{
	try
	{
		// apertura form per la gestione del negozio (in base al periodo precompilare le settimane selezionabili)
		var _periodo = globals.toPeriodo(_anno, _mese);
		var fineInizioGestionePresenze = globals.getPeriodoFinaleGestionePresenze(_idditta);
		if(fineInizioGestionePresenze != null && _periodo > fineInizioGestionePresenze)
		{
			plugins.busy.unblock();
			globals.ma_utl_showWarningDialog('Non è possibile utilizzare la funzionalità oltre il periodo di fine gestione','Giornaliera elettronica');
			return;
		}
		
		if(globals.verificaDatiNegozioFtp(_idditta,_idgruppoinst))
		{
			plugins.busy.unblock();
			globals.svy_mod_closeForm(event);
			return;
		}
		
		//Salva la selezione corrente per poterla riproporre nella prossima prog. negozio
		salvaSelezione(_codditta,_anno,_mese,_idgruppoinst,_codgrlav);
			
		// Apri il program della programmazione negozio che sarà disabilitato
		if(vChkReteImpresa == 1)
			globals.apriProgrammazioneNegozio(new JSEvent,_idditta,_anno,_mese,'',-1,'NEG_Rete');
		else
		    globals.apriProgrammazioneNegozio(new JSEvent,_idditta,_anno,_mese,_codgrlav,_idgruppoinst,'NEG');
	}
	catch(ex)
	{
		var msg = 'Metodo process_conferma_ditta_periodo : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		globals.svy_mod_closeForm(event);
		plugins.busy.unblock();
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
 * @properties={typeid:24,uuid:"D10D2DC6-C5B3-4189-9849-1850BE2397F2"}
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
* @properties={typeid:24,uuid:"99B7C8B6-1966-4554-8A93-BB6D359F9BFC"}
*/
function onShowForm(_firstShow, _event)
{
	_super.onShowForm(_firstShow,_event);
	
	var isGestoreRete = globals.ma_utl_hasKey(globals.Key.RETE_IMPRESA)	&& globals.ma_utl_hasKey(globals.Key.RETE_IMPRESA_GESTORE);
	elements.chk_rete_impresa.visible = elements.lbl_rete_impresa.visible = isGestoreRete;
	
	plugins.busy.prepare();
}

