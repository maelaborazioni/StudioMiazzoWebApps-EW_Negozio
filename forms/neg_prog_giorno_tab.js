/** @type {Date}
 * 
 * @properties={typeid:35,uuid:"DBBA6355-C610-4C01-81DB-C062B5AE124B",variableType:93}
 */
var vGiorno = null;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"4D95B810-61C4-4958-A068-6D1FAC5F897F",variableType:8}
 */
var vIndexSettimana = null; 

/**
 * @type {Array<Number>}
 * 
 * @properties={typeid:35,uuid:"07CD233D-0595-474D-9C83-C76FB56FB2CC",variableType:-4}
 */
var vArrIndexSettimaneModificate = [];

/**
 * @type {Array<Date>}
 * 
 * @properties={typeid:35,uuid:"172FE0E3-7227-42A9-98DD-5B328A934926",variableType:-4}
 */
var vArrGiorniModificati = [];

/**
 * @type {Boolean}
 * 
 * @properties={typeid:35,uuid:"3CC40F0E-2A46-4F82-91D7-FC48D2DE2657",variableType:-4}
 */
var vFromCopertura = false;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"ACDCFBB2-E4A3-4DD6-A00C-80B208C37F1F"}
 */
function annullaProgrammazioneGiorno(event) 
{
	// recupero dei lavoratori effettivi...
	/** @type {Array<Number>}*/
	var arrLavoratori = globals.foundsetToArray(forms['neg_prog_giorno_tbl_temp'].foundset,'idlavoratore');
	var idDitta = globals.getDitta(arrLavoratori[0]);
	globals.preparaProgrammazioneGiornoNegozio(idDitta,arrLavoratori,vGiorno,vIndexSettimana,vFromCopertura);
	
	forms.neg_prog_giorno_tab.elements.btn_next_day.enabled =
	  forms.neg_prog_giorno_tab.elements.btn_previous_day.enabled = true;
	forms.neg_prog_giorno_tab.elements.btn_conferma.enabled =
	  forms.neg_prog_giorno_tab.elements.btn_annulla.enabled = false;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"09DA3C1C-D351-4001-9C1B-0E67F3513B93"}
 */
function confermaProgrammazioneGiorno(event) 
{
	var params = {
        processFunction: process_saving,
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
 * @properties={typeid:24,uuid:"836BE60F-D4F4-4706-86DD-710D83D348B2"}
 */
function process_saving(event)
{
	if(verificaProgrammazioneGiorno())
	{
	   // salva in e2giornalieraprogfasce le informazioni dell'utente per lo specifico giorno
		var frm = forms['neg_prog_giorno_tbl_temp']; 
		var fs = frm.foundset;
		
		/** @type {JSFoundSet<db:/ma_presenze/e2giornalieraprogfasce>} */
		var fsFasceProg = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA_PROGFASCE);
		
		// ottenimento dei dati relativi ai lavoratori modificati
		var dsLavModificati = databaseManager.createEmptyDataSet(0,['idlavoratore','idfasciaoraria','iddittafasciaorariatimbrature','tiporiposo']);
		for(var l = 1; l <= fs.getSize(); l++)
		{	
			var cont = 1;
			if(fs.getRecord(l)['modificato'])
			{
				dsLavModificati.addRow(cont,new Array(fs.getRecord(l)['idlavoratore'],
                                                      fs.getRecord(l)['id_fascia_oraria'],
                                                      fs.getRecord(l)['id_ditta_fascia_oraria_timbrature'],
													  fs.getRecord(l)['tipo_riposo']));
			   cont++;
			}
//			else if(fs.getRecord(l)['ore_programmato'] == null
//					&& fs.getRecord(l)['ore_teorico'] == null
//					&& fs.getRecord(l)['tipo_riposo'] == 0)
//			{
//				dsLavModificati.addRow(cont,new Array(fs.getRecord(l)['idlavoratore'],
//													  globals.getFasciaOrariaDaTotaleOre(globals.getDitta(fs.getRecord(l)['idlavoratore']),0).idfasciaoraria,
//                                                      fs.getRecord(l)['id_ditta_fascia_oraria_timbrature'],
//					                                  fs.getRecord(l)['tipo_riposo']));
//			  	cont++;
//			}
				
			
		}
		
		var numLavModificati = dsLavModificati.getMaxRowIndex(); 
		if(numLavModificati > 0)
		{
			// eliminazione di eventuali fasce programmate precedentemente inserite per il dipendente nei giorni modificati
			var sqlProgfasce = "DELETE FROM E2GiornalieraProgFasce WHERE idDip IN (" +
			                    dsLavModificati.getColumnAsArray(1).map(function(pfLav){return pfLav}).join(',') + ")" +
			                   " AND Giorno = ?";
			                   
			var success = plugins.rawSQL.executeSQL(globals.Server.MA_PRESENZE,
				                                   globals.Table.GIORNALIERA_PROGFASCE,
												   sqlProgfasce,
												   [utils.dateFormat(vGiorno,globals.ISO_DATEFORMAT)]);
			if(!success)
			{
				globals.ma_utl_showWarningDialog('Errore durante la cancellazione delle fasce esistenti','Programmazione giornaliera del negozio');
				application.output(plugins.rawSQL.getException().getMessage(), LOGGINGLEVEL.ERROR);
				plugins.busy.unblock();
				return;
			}
			plugins.rawSQL.flushAllClientsCache(globals.Server.MA_PRESENZE,
				                                globals.Table.GIORNALIERA_PROGFASCE);
			// inserimento delle nuove fasce programmate
			databaseManager.startTransaction();
			for(var i = 1; i <= numLavModificati; i++)
			{
				// se è stata indicata una fascia oraria prosegui con l'inserimento altrimenti non inserire nulla in programmazione fasce
				if(dsLavModificati.getValue(i,2) != null)
				{
					if(fsFasceProg.newRecord())
					{
						fsFasceProg.iddip = dsLavModificati.getValue(i,1);
						fsFasceProg.giorno = vGiorno;
						fsFasceProg.idfasciaoraria = dsLavModificati.getValue(i,2);
						fsFasceProg.iddittafasciaorariatimbrature = dsLavModificati.getValue(i,3);
						fsFasceProg.tiporiposo = 0;
                        						
					}
				}
								
			}
				
			if(!databaseManager.commitTransaction())
			{
				globals.ma_utl_showWarningDialog('Errore durante l\'inserimento della programmazione fasce','Programmazione giornaliera del negozio');
				databaseManager.rollbackTransaction();
				plugins.busy.unblock();
				return;
			}
			else
			{		
				// aggiornamento informazioni sulle settimane modificate nel corso degli inserimenti
				if(vArrIndexSettimaneModificate.indexOf(vIndexSettimana) == -1)
					vArrIndexSettimaneModificate.push(vIndexSettimana);
				// aggiornamento informazioni sui giorni modificati nel corso degli inserimenti
				if(vArrGiorniModificati.indexOf(vGiorno) == -1)
					vArrGiorniModificati.push(vGiorno);
				
				forms.neg_prog_giorno_tab.elements.btn_next_day.enabled =
				  forms.neg_prog_giorno_tab.elements.btn_previous_day.enabled = true;
				forms.neg_prog_giorno_tab.elements.btn_conferma.enabled =
				  forms.neg_prog_giorno_tab.elements.btn_annulla.enabled = false;				
			}    
		}
		else
		   globals.svy_mod_closeForm(event);
	}
	plugins.busy.unblock();
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"316FE67E-B7D1-43BD-A5FB-C2DBFD572D1D"}
 */
function process_hiding(event)
{
	onHide(event);
	plugins.busy.unblock();
}

/**
 * Controlla la situazione dei dati inseriti bloccando l'eventuale salvataggio di dati incompleti o spurii
 * 
 * @properties={typeid:24,uuid:"2B35D89C-8F1C-491E-9466-C9A3260C89A3"}
 */
function verificaProgrammazioneGiorno()
{
	// TODO controllo sull'inserimento delle timbrature per tutti i dipendenti dello specifico giorno 
	// TODO controllo presenza simultanea riposi/timbrature
//	var frm = forms['neg_prog_giorno_tbl_temp']; 
//	var fs = frm.foundset;
	
	return true;
}
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B610B772-8841-4A85-9B52-F2C95F4D25DA"}
 */
function onActionPreviousDay(event) 
{
	// controllo passaggio di mese 
	var primoGgProg = new Date(vGiorno.getFullYear(),vGiorno.getMonth(),1);
	var prevGiorno = new Date(vGiorno.getFullYear(),vGiorno.getMonth(),vGiorno.getDate() - 1);
	/**Object { int week, int year }*/
	var dayStruct = globals.getWeekNumber(prevGiorno);
	var prevGiornoSettimana = dayStruct['week'];
	if(prevGiorno < primoGgProg)
	{
		globals.ma_utl_showWarningDialog('Raggiunto il primo giorno del mese','Programmazione del giorno');
		return;
	}
	
	// recupero dei lavoratori effettivi...
	/** @type {Array<Number>}*/
	var arrLavoratori = globals.foundsetToArray(forms['neg_prog_giorno_tbl_temp'].foundset,'idlavoratore');
	var idDitta = globals.getDitta(arrLavoratori[0]);
	globals.preparaProgrammazioneGiornoNegozio(idDitta,arrLavoratori,prevGiorno,prevGiornoSettimana,false);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"52CCA28F-F209-4162-A1A4-447B316BE2C9"}
 */
function onActionNextDay(event) 
{
	// controllo passaggio di mese 
	var nextGiorno = new Date(vGiorno.getFullYear(),vGiorno.getMonth(),vGiorno.getDate() + 1);

	// recupero dei lavoratori effettivi...
	/** @type {Array<Number>}*/
	var arrLavoratori = globals.foundsetToArray(forms['neg_prog_giorno_tbl_temp'].foundset,'idlavoratore');
	var idDitta = globals.getDitta(arrLavoratori[0]);
	globals.preparaProgrammazioneGiornoNegozio(idDitta
		                                       ,arrLavoratori
											   ,nextGiorno
											   ,globals.getWeekNumber(nextGiorno)
											   ,false);
}

/**
*
* @param {JSEvent} event
*
* @properties={typeid:24,uuid:"E6E53552-1C95-41EE-98F2-ED88DDDADC7D"}
*/
function onHide(event) 
{
	globals.svy_mod_closeForm(event);
    
	var frmSettName;
	
	for (var sett = 0; sett < vArrIndexSettimaneModificate.length; sett++) 
	{
		if (vFromCopertura && 
				vArrIndexSettimaneModificate[sett] == forms.neg_prog_cop_tab.vSettimana) {
			frmSettName = 'neg_prog_periodo_settimana_' + vArrIndexSettimaneModificate[sett] + '_cop';		
			var primoGgSett = globals.getDateOfISOWeek(vArrIndexSettimaneModificate[sett], globals.getAnno()); 
			for (var g = 1; g <= 7; g++) {
				var giorno = new Date(primoGgSett.getFullYear(), primoGgSett.getMonth(), primoGgSett.getDate() + g - 1);
				// se il giorno della settimana rientra nei giorni che sono stati modificati dall'inserimento
				if(vArrGiorniModificati.indexOf(giorno) != -1)
				   // costruzione visualizza copertura giorno
				   globals.preparaProgrammazioneCoperturaGiorno(giorno, g, globals.getTipoGestoreReteImpresa(),true);
			}
		} else 
			frmSettName = 'neg_prog_periodo_settimana_' + vArrIndexSettimaneModificate[sett];
		
		/** @type {Form<neg_prog_periodo_settimana>}*/
		var frmSett = forms[frmSettName];
		if(frmSett)
		   frmSett.preparaProgrammazioneSettimanaNegozio(vArrIndexSettimaneModificate[sett]
		                                              	, globals.getAnno()
		                                              	, globals.getTipoGestoreReteImpresa()
		                                              	, vFromCopertura);
	}
	
	
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"44C2EDC4-D31D-4645-BADD-336D8D8CE53E"}
 */
function onActionRiepilogoMensile(event) 
{
	var params = {
        processFunction: process_hiding,
        message: '', 
        opacity: 0.5,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : 'This is the dialog',
        fontType: 'Arial,4,25',
        processArgs: [event]
    };
	plugins.busy.block(params);
    
}

/**
 *
 * @param {Boolean} firstShow
 * @param {JSEvent} event
 * @param {Boolean} svyNavBaseOnShow
 *
 * @properties={typeid:24,uuid:"F597109B-FC50-4E2E-82FB-6E3A3DB6FE11"}
 */
function onShowForm(firstShow, event, svyNavBaseOnShow) 
{
	_super.onShowForm(firstShow, event, svyNavBaseOnShow);
	
	plugins.busy.prepare();
	
	vArrIndexSettimaneModificate = [];
	vArrGiorniModificati = [];
	
	forms.neg_prog_giorno_tab.elements.btn_next_day.enabled =
	  forms.neg_prog_giorno_tab.elements.btn_previous_day.enabled = true;
	forms.neg_prog_giorno_tab.elements.btn_conferma.enabled =
	  forms.neg_prog_giorno_tab.elements.btn_annulla.enabled = false;
}