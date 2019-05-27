/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"98FC91F2-D069-45C6-B2EF-A98E18FE0CBB"}
 */
var vTooltipLU = '';
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"D1D70142-0AD6-4D95-81BC-821399C49035"}
 */
var vTooltipMA = '';
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"D1315AF3-4BD1-436A-9968-8B8A07EE7868"}
 */
var vTooltipME = '';
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"CC5A9E01-D06C-44F2-A435-1AF04E7B2BBF"}
 */
var vTooltipGI = '';
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"C04F4515-C300-4FC4-ADF9-EEB267FDFC7A"}
 */
var vTooltipVE = '';
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"0A3B0B72-DA1B-460E-81B5-2DE172EBB9F3"}
 */
var vTooltipSA = '';
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"9413B70E-30C3-400A-ABBE-57E76E6DE8B4"}
 */
var vTooltipDO = '';
/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"521597B4-861A-4B7C-9D82-C3854F8335E8",variableType:93}
 */
var last_click_timestamp = null;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"A568C8EC-6FFD-48F9-A6B3-BF03943AF4B4",variableType:8}
 */
var last_selected_recordindex = 0;

/**
 * Perform the element right-click action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"E155487B-5DC1-478B-82F0-E31515E9A687"}
 * @SuppressWarnings(wrongparameters)
 */
function onRightClickGiorno(event) 
{
	// nel caso di visualizzazione dell'intera rete non permettiamo la gestione diretta per evitare errori
	if(globals.nav_program_name == 'NEG_Rete')
    	return;
	
	var frmName = event.getFormName();
	var elemName = event.getElementName();
	var fromCopertura = utils.stringRight(frmName,3) == 'cop' ? true : false;	
	
	var numSettimana = parseInt(utils.stringMiddle(frmName,38,frmName.length - 37),10);
	
	var anno = forms.neg_header_options.vAnno; 
	var primoGgSettimana = globals.getDateOfISOWeek(numSettimana,anno);
    var ultimoGgSettimana = new Date(primoGgSettimana.getFullYear(),primoGgSettimana.getMonth(), primoGgSettimana.getDate() + 6);
    
    var offsetGiornoSettimana = -1; 
	switch(elemName)
	{
		case 'fld_lunedi':
		offsetGiornoSettimana = 0;
			break;
		case 'fld_martedi':
		offsetGiornoSettimana = 1; 
		    break;	
		case 'fld_mercoledi':
		offsetGiornoSettimana = 2;
		    break;
		case 'fld_giovedi':
		offsetGiornoSettimana = 3;
		    break;
		case 'fld_venerdi':
		offsetGiornoSettimana = 4;
		    break;    
		case 'fld_sabato':
		offsetGiornoSettimana = 5;
		    break;
		case 'fld_domenica':
		offsetGiornoSettimana = 6;
		    break;    
//		case 'fld_totale':
//		case 'fld_riposi':	
//		    break;
        default:
        	break;
	}
	
	var giorno = new Date(primoGgSettimana.getFullYear(),primoGgSettimana.getMonth(), primoGgSettimana.getDate() + offsetGiornoSettimana);

	//  non sarà più necessario quando sarà introdotto il blocco della programmazione multiplo sugli specifici giorni     
//	if(!globals.ma_utl_hasKey(globals.Key.ADMIN_NEG)
//		&& (giorno == globals.getChristmas(anno) 
//			|| giorno == globals.getBoxingDay(anno) 
//			|| giorno == globals.getFirstYearDay(anno)
//			|| giorno == globals.getFirstYearDay(anno + 1)))
//    {
//    	globals.ma_utl_showWarningDialog('Non è possibile programmare i giorni di chiusura del punto vendita','Prepara programmazione giorno');
//        return;
//    }
	
    // TODO ripristinare blocco su settimana trascorsa
	// la modifica della settimana (o del singolo giorno) è bloccata se l'utente non è gestore
	// e l'ultimo giorno della settimana è < di oggi
    var enabled = true;//globals.ma_utl_hasKey(globals.Key.AUT_GESTORE) || globals.TODAY > ultimoGgSettimana;
	    	
	var popUpMenu = plugins.window.createPopupMenu();
    
	// blocco per ulteriore programmazione fasce
	if(globals.ma_utl_hasKey(globals.Key.NEGOZIO_BLOCCO))
	{
		var fsProgFasceBlocco = globals.getProgFasceBlocco(forms[frmName].foundset['idlavoratore'],giorno);
		if(fsProgFasceBlocco && fsProgFasceBlocco.getSize())
		{
			var sbloccaProg = popUpMenu.addMenuItem('Rimuovi blocco programmazione giorno per dipendente',globals.sbloccaProgrammazione);
			sbloccaProg.methodArguments = [forms[frmName].foundset['idlavoratore'],giorno]; 
		    sbloccaProg.enabled = true;
		}
		else
		{
			var bloccaProg = popUpMenu.addMenuItem('Imposta blocco programmazione giorno per dipendente',globals.bloccaProgrammazione);
			bloccaProg.methodArguments = [forms[frmName].foundset['idlavoratore'],giorno]; 
		    bloccaProg.enabled = true;
		}
	    popUpMenu.addSeparator();
	}
    
	var modificaSett = popUpMenu.addMenuItem('Modifica la settimana',globals.apriPopupProgrammazioneSettimana);
	modificaSett.methodArguments = [event,numSettimana,giorno,forms[frmName].foundset.getSelectedIndex(),fromCopertura];
	modificaSett.enabled = enabled;
		
	var modificaGiorno = popUpMenu.addMenuItem('Modifica il giorno',globals.apriPopupGiornoSettimana)
	modificaGiorno.methodArguments = [event,numSettimana,giorno,forms[frmName].foundset.getSelectedIndex(),fromCopertura];
	modificaGiorno.enabled = enabled;
		
	var modificaGiornoDip = popUpMenu.addMenuItem('Modifica il giorno del dipendente',globals.apriPopupGiornoSettimanaDip,fromCopertura);
	modificaGiornoDip.methodArguments = [event,numSettimana,giorno,forms[frmName].foundset['idlavoratore']];
	modificaGiornoDip.enabled = enabled;
	
	var eliminaGiorno = popUpMenu.addMenuItem('Elimina la programmazione del giorno per il dipendente',globals.eliminaProgrammazioneGiornoNegozio);
	eliminaGiorno.methodArguments = [event,[forms[frmName].foundset['idlavoratore']],giorno,fromCopertura];
	eliminaGiorno.enabled = enabled;
	
	popUpMenu.addSeparator();
	
//	var impostaRiposoP = popUpMenu.addMenuItem('Riposo primario',impostaRiposo);
//	impostaRiposoP.methodArguments = [event,foundset['idlavoratore'],numSettimana,elemName,1];
//	
//	var impostaRiposoS = popUpMenu.addMenuItem('Riposo secondario',impostaRiposo);
//	impostaRiposoS.methodArguments = [event,foundset['idlavoratore'],numSettimana,elemName,2];
	
	var giornoRip = globals.getGiornoRiposoSettimanale(foundset['idlavoratore'],giorno,1);
	var impostaRiposoPr = popUpMenu.addMenuItem('Imposta riposo',globals.impostaRiposo);
	impostaRiposoPr.methodArguments = [event,foundset['idlavoratore'],numSettimana,elemName,1,fromCopertura,giorno];
	impostaRiposoPr.enabled = giornoRip == giorno ? false : true;
	var togliRiposo = popUpMenu.addMenuItem('Togli riposo',globals.impostaRiposo);
	togliRiposo.methodArguments = [event,foundset['idlavoratore'],numSettimana,elemName,0,fromCopertura,giorno];
	togliRiposo.enabled = giornoRip == giorno ? true : false;
	
	popUpMenu.addSeparator();
		
	if(!fromCopertura)
	{
		var copiaDip = popUpMenu.addMenuItem('Copia programmazione dipendente',globals.copiaProgrammazioneSettimanaDipendente);
		copiaDip.methodArguments = [event,numSettimana,foundset['idlavoratore']];
		copiaDip.enabled = true;
		var incollaDip = popUpMenu.addMenuItem('Incolla settimana dipendente',globals.incollaProgrammazioneSettimanaDipendente);
		incollaDip.methodArguments = [event,numSettimana,foundset['idlavoratore']];
		incollaDip.enabled = (forms.neg_prog_periodo_tab.vDipendenteDaCopiare != null 
				              && forms.neg_prog_periodo_tab.vSettimanaDipendenteDaCopiare != null) ? true : false;
		
		popUpMenu.addSeparator();
		
		var copia = popUpMenu.addMenuItem('Copia programmazione settimana',globals.copiaProgrammazioneSettimana);
		copia.methodArguments = [event,numSettimana];
		copia.enabled = true;
		var incolla = popUpMenu.addMenuItem('Incolla programmazione settimana',globals.incollaProgrammazioneSettimana);
		incolla.methodArguments = [event,numSettimana];
		incolla.enabled = forms.neg_prog_periodo_tab.vSettimanaDaCopiare != null ? true : false;
	}
	
	popUpMenu.addSeparator();
	
	var impostaAssenza = popUpMenu.addMenuItem('Inserisci assenza',globals.inserisciAssenza);
	impostaAssenza.methodArguments = [event,foundset['idlavoratore'],numSettimana,giorno,false];
	impostaAssenza.enabled = (giornoRip == giorno 
			                  || globals.getOreFestivitaGoduta(globals.dateFormat(giorno,globals.ISO_DATEFORMAT),foundset['idlavoratore']) > 0) ? false : true;
	
	popUpMenu.addSeparator();
	
	var stampaSettimana = popUpMenu.addMenuItem('Stampa il programma settimanale',scopes.neg_reports.confermaEsportazioneReportSettimana);
	stampaSettimana.methodArguments = [event,forms.neg_header_dtl.idditta,numSettimana,globals.getAnno(),globals.getTipoGestoreReteImpresa()];
	
	popUpMenu.addSeparator();
	
	var stampaCopGiorno = popUpMenu.addMenuItem('Stampa la copertura del giorno',scopes.neg_reports.confermaEsportazioneProgrammazioneGiorno);
	stampaCopGiorno.methodArguments = [event,forms.neg_header_dtl.idditta,giorno,globals.getTipoGestoreReteImpresa()];
	var stampaCopSett = popUpMenu.addMenuItem('Stampa la copertura della settimana',scopes.neg_reports.confermaEsportazioneProgrammazionePeriodo);
	stampaCopSett.methodArguments = [event,forms.neg_header_dtl.idditta,primoGgSettimana,ultimoGgSettimana,globals.getTipoGestoreReteImpresa()];
	
	if(security.getUserName() == 'ASSISTENZA')
	{
		var stampaProgNegozioPeriodo = popUpMenu.addMenuItem('Stampa la programmazione del periodo',scopes.neg_reports.confermaEsportazioneProgrammazioneNegozioPeriodo);
		stampaProgNegozioPeriodo.methodArguments = [event,forms.neg_header_dtl.idditta,forms.neg_header_options.vAnno,forms.neg_header_options.vMese];
	}	
	popUpMenu.show(event.getSource());
		
}



/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B71BF6E3-1AC9-43B1-81F3-DB5FB753E67A"}
 */
function onRenderTotaleOre(event)
{
	// evidenzia lo sfondo in verde se ok, rosso se le ore programmate più quelle di assenza superano
	// quelle teoriche definite dalla regola oraria
	var rec = event.getRecord();
	var ren = event.getRenderable();
	
	if(rec)
	{
		var totOreTeorico = rec['ore_teorico'];
		var totOreStraordinario = rec['ore_straordinario'];
		var oreRegola = rec['ore_regola']
		var riposi = rec['riposi'];
		var assuntoInCorsoSettimana = rec['assunto'];
		var cessatoInCorsoSettimana = rec['cessato'];
		var tirocinante = rec['tirocinante'];
		
		if(totOreTeorico == oreRegola && riposi == 1
			|| (assuntoInCorsoSettimana || cessatoInCorsoSettimana) && totOreTeorico <= oreRegola
			|| tirocinante)
		{
			if(totOreStraordinario > 0)
			{
				ren.bgcolor = globals.Colors.OVERTIME.background;
				ren.fgcolor = 'white';
			}
			else
			{
			   ren.bgcolor = globals.Colors.ATTENDANT.background;
			   ren.fgcolor = 'white';
			}
		}
		else
		{
			ren.bgcolor = 'red';
		    ren.fgcolor = 'white';
		}
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"DF9CC5C2-B202-4CD3-A6ED-47CD20CBC4D8"}
 */
function onFieldSelection(event) 
{
	var _recordIndex = foundset.getSelectedIndex();
	var _timeStamp = event.getTimestamp();
	var _lastClickTimeStamp = last_click_timestamp;
	var _lastSelectedRecordIndex = last_selected_recordindex;
	
	if(_recordIndex == _lastSelectedRecordIndex)
	{
		if(_timeStamp - _lastClickTimeStamp < globals.intervalForDblClk)
			globals.modificaGiorno(event);
		
		last_click_timestamp = _timeStamp;
	}
	else
	{
		last_selected_recordindex = _recordIndex;
		last_click_timestamp = _timeStamp;
	}
}

