/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"0FBB74E5-7EC2-4748-B1AA-10A1F2C3711C",variableType:8}
 */
var vTotOre_1 = null;
/**
 * @type {Number}
 *  
 * @properties={typeid:35,uuid:"9CC85EFF-9273-43B9-A50C-3A96224189A6",variableType:8}
 */
var vTotOre_2 = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"AEF23B0A-8AE9-4540-830A-755A50544676",variableType:8}
 */
var vTotOre_3 = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"0C9EE310-99EF-4801-A759-41D1A96FA000",variableType:8}
 */
var vTotOre_4 = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"83368C71-4BC3-419B-AB98-090B3CC23FA0",variableType:8}
 */
var vTotOre_5 = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"FD2D673E-3366-4C78-B8C2-5DA27035F6A5",variableType:8}
 */
var vTotOre_6 = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"0F2E482C-B533-4FC2-B599-C51366F0270F",variableType:8}
 */
var vTotOre_7 = null;

/** @type {Date}
 * 
 * @properties={typeid:35,uuid:"3CB96F47-866B-4EBA-9FD0-887FB1DD1A93",variableType:93}
 */
var vPrimoGiornoSettimana = null;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"7BF4CAF9-4208-41F3-800F-6E83B5C83E37",variableType:8}
 */
var vIndexSettimana = null;

/**
 * @param {Array<Date>} 
 * 
 * @properties={typeid:35,uuid:"8992314C-ACE7-4BAF-A646-A94857542C5E",variableType:-4}
 */
var vArrGiorniModificati = [];

/**
 * @param {Boolean}
 * 
 * @properties={typeid:35,uuid:"56312EE9-AFDC-4393-BAAC-B8631A480353",variableType:-4}
 */
var vFromCopertura  = false;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"426EA239-2785-4CDC-9BA8-EF977217AF0C"}
 */
var testo = '';
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"FAF667FD-CEAC-4BCF-BACF-3645AB507FDE"}
 */
function annullaProgrammazioneSettimana(event) 
{
	setStatusWarning('Elaborazione in corso, attendere...','',100);
	vArrGiorniModificati = [];
//	globals.svy_mod_closeForm(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"902841BB-7343-4B1E-ADB0-53928A3EAC5A"}
 */
function confermaProgrammazioneSettimana(event) 
{    			
	var params = {
        processFunction: process_prog_settimana,
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
  * @properties={typeid:24,uuid:"87306262-7868-4B9F-9EB4-1E9494EAA056"}
 */
function process_prog_settimana(event)
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	
	// ciclo sui giorni ed i lavoratori modificati nella settimana
	for (var g = 1; g <= 7; g++)
	{
		var vGiorno = new Date(vPrimoGiornoSettimana.getFullYear(),vPrimoGiornoSettimana.getMonth(),vPrimoGiornoSettimana.getDate() + (g - 1));
		if(verificaProgrammazioneGiornoSettimana(vGiorno))
		{
		    // salva in e2giornalieraprogfasce le informazioni dell'utente per lo specifico giorno
			var frm = forms['neg_prog_settimana_tbl_temp']; 
			var fs = frm.foundset;
			
			/** @type {JSFoundset<db:/ma_presenze/e2giornalieraprogfasce>} */
			var fsFasceProg = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA_PROGFASCE);
			
			// ottenimento dei dati relativi ai lavoratori modificati
			var dsLavModificati = databaseManager.createEmptyDataSet(0,['idlavoratore','idfasciaoraria','iddittafasciaorariatimbrature','tiporiposo']);
			for(var l = 1; l <= fs.getSize(); l++)
			{		
				var cont = 1;
				if(fs.getRecord(l)['modificato_' + g])
				{
					dsLavModificati.addRow(cont,new Array(fs.getRecord(l)['idlavoratore'],
	                                                      fs.getRecord(l)['id_fascia_oraria_' + g],
	                                                      fs.getRecord(l)['id_ditta_fascia_oraria_timbrature_' + g],
														  fs.getRecord(l)['tipo_riposo_' + g]));
				   cont++;
				}
//				else if(fs.getRecord(l)['ore_programmato_' + g] == null
//						&& fs.getRecord(l)['ore_teorico_' + g] == null
//						&& fs.getRecord(l)['tipo_riposo_' + g] == 0)
//				{
//					dsLavModificati.addRow(cont,new Array(fs.getRecord(l)['idlavoratore'],
//														  globals.getFasciaOrariaDaTotaleOre(globals.getDitta(fs.getRecord(l)['idlavoratore']),0).idfasciaoraria,
//	                                                      fs.getRecord(l)['id_ditta_fascia_oraria_timbrature_' + g],
//						                                  fs.getRecord(l)['tipo_riposo_' + g]));
//				  	cont++;
//				}
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
					setStatusError('Errore durante la cancellazione delle fasce esistenti, riprovare.','',500);
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
					if(fsFasceProg.newRecord())
					{
						fsFasceProg.iddip = dsLavModificati.getValue(i,1);
						fsFasceProg.giorno = vGiorno;
						fsFasceProg.idfasciaoraria = dsLavModificati.getValue(i,2);
						fsFasceProg.iddittafasciaorariatimbrature = dsLavModificati.getValue(i,3);
						fsFasceProg.tiporiposo = 0;
					
					}
					else
						break;
				}
					
				if(!databaseManager.commitTransaction())
				{
					setStatusError('Errore durante l\'inserimento della programmazione fasce! Riprovare.','',500);
					var failed = databaseManager.getFailedRecords();
					application.output(failed);
					databaseManager.rollbackTransaction();
					plugins.busy.unblock();
					return;
				}
				else
				{				
					setStatusNeutral('Pronto per l\'inserimento');
					onHide(event);
				}    
			}
			
			onHide(event);
		}
		
	}
	
    plugins.busy.unblock();
}

/**
 * Controlla la situazione dei dati inseriti bloccando l'eventuale salvataggio di dati incompleti o spurii
 * 
 * @param {Date} giorno
 * 
 * @properties={typeid:24,uuid:"C16D472B-6A44-4980-80FF-A91ECAA967E5"}
 */
function verificaProgrammazioneGiornoSettimana(giorno)
{
	// TODO controllo sull'inserimento delle timbrature per tutti i dipendenti dello specifico giorno 
	// TODO controllo presenza simultanea riposi/timbrature
//	var frm = forms['neg_prog_settimana_tbl_temp']; 
//	var fs = frm.foundset;
	
	return true;
}

/**
 * @properties={typeid:24,uuid:"67572ECA-6396-4E1D-A04D-A21FEED62815"}
 */
function aggiornaSituazioneRiposoPrimarioSettimana()
{
	var frm = forms['neg_prog_settimana_tbl_temp']; 
	var fs = frm.foundset;
	
	for(var l = 1; l <= fs.getSize(); l++)
	{
		// variabile per verifica impostazione riposo primario
		var riposoImpostato = false;
		
		// record relativo al l-esimo lavoratore
		var rec = fs.getRecord(l);
		
		// ciclo per verifica giorno di riposo primario impostato
		for(var g = 1; g <= 7; g++)
		{
			if(rec['tipo_riposo_' + g] == 1)
			{
				riposoImpostato = true;
				break;
			}
		}
		
		if(!riposoImpostato)
		{
			// ciclo per impostazione automatica giorno di riposo 
			for(g = 1; g <= 7; g++)
			{
				if(rec['tipo_riposo_' + g] == 0 
					&& rec['ore_giorno_' + g] == 0)
				{
					rec['tipo_riposo_' + g] = 1;
					break;
				}
			}
		}
	}
}

/**
 *
 * @param {Boolean} firstShow
 * @param {JSEvent} event
 * @param {Boolean} svyNavBaseOnShow
 *
 * @properties={typeid:24,uuid:"0467664A-8CC0-4CB4-B4B8-68F1101D4F2E"}
 */
function onShowForm(firstShow, event, svyNavBaseOnShow) 
{
	_super.onShowForm(firstShow, event, svyNavBaseOnShow);
	vArrGiorniModificati = [];
	setStatusNeutral('Pronto per l\'inserimento');
	
	plugins.busy.prepare();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"5570CB4A-2584-4268-8EE6-00E6D1875A10"}
 */
function onActionRiepilogoMensile(event) 
{
	onHide(event);
}

/**
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"D96BD9ED-9D98-4FF2-8D8F-AB484029B152"}
 */
function onHide(event)
{
	globals.svy_mod_closeForm(event);
	
	var frmSettName;
	
	if(vFromCopertura &&
		vIndexSettimana == forms.neg_prog_cop_tab.vSettimana)
	{
		frmSettName = 'neg_prog_periodo_settimana_' + vIndexSettimana + '_cop';
		var primoGgSett = globals.getDateOfISOWeek(vIndexSettimana, globals.getAnno());
		for (var g = 1; g <= 7; g++) {
			var giorno = new Date(primoGgSett.getFullYear(), primoGgSett.getMonth(), primoGgSett.getDate() + g - 1);
			// se il giorno della settimana rientra nei giorni che sono stati modificati dall'inserimento
			if(vArrGiorniModificati.indexOf(giorno) != -1)
			   // costruzione visualizza copertura giorno
			   globals.preparaProgrammazioneCoperturaGiorno(giorno, g, globals.getTipoGestoreReteImpresa(),true);
		}
	}
	else
	    frmSettName = 'neg_prog_periodo_settimana_' + vIndexSettimana;
	
	/** @type {Form<neg_prog_periodo_settimana>}*/
	var frmSett = forms[frmSettName]; 
	if(frmSett)
		frmSett.preparaProgrammazioneSettimanaNegozio(vIndexSettimana
		                                          ,globals.getAnno()
												  ,globals.getTipoGestoreReteImpresa()
												  ,vFromCopertura);
	
}
