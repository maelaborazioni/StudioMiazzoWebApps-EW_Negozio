
/**
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"F9854863-18BC-4597-992A-3A2E14F9874F"}
 */
function confermaDittaPeriodoNegozio(event) 
{
	// apertura form per la gestione del negozio (in base al periodo precompilare le settimane selezionabili)
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
	
	var _periodo = globals.toPeriodo(_anno, _mese);
	var fineInizioGestionePresenze = globals.getPeriodoFinaleGestionePresenze(_idditta);
	if(fineInizioGestionePresenze != null && _periodo > fineInizioGestionePresenze)
	{
		globals.ma_utl_showWarningDialog('Non è possibile utilizzare la funzionalità oltre il periodo di fine gestione','Giornaliera elettronica');
		return;
	}
	
	if(globals.verificaDatiNegozioFtp(_idditta,_idgruppoinst))
		return;
	
	//Salva la selezione corrente per poterla riproporre nella prossima prog. negozio
	salvaSelezione(_codditta.toString(),_anno,_mese,_idgruppoinst,_codgrlav);
	
	// Apri il program della programmazione negozio che sarà disabilitato
	if(vChkReteImpresa == 1)
		globals.apriProgrammazioneCoperturaNegozio(event,_idditta,_anno,_mese,'',-1,'NEG_Cop_Rete');
	else
	    globals.apriProgrammazioneCoperturaNegozio(event,_idditta,_anno,_mese,_codgrlav,_idgruppoinst,'NEG_Cop');
}
