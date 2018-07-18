/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"370BD2F2-F410-42DB-869C-4FCDFC9E5942",variableType:8}
 */
var vIdLavoratore = null;

/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"49BBAE52-C8CF-4E79-B8F3-D4F45E1D3AAA",variableType:93}
 */
var vGiorno = null;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"7DA6F261-65A0-461A-9EFD-AFF4B11B7F86",variableType:8}
 */
var vSettimana = null;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"2B3C4B38-1D34-4213-BBCC-3C8F8FC1F186",variableType:8}
 */
var vTipoGestoreReteImpresa = null;

/**
 * @properties={typeid:35,uuid:"F9D134B3-DFBD-45B4-B4E3-08825F79E3B8",variableType:-4}
 */
var vCopertura = true;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"F4CA1C1E-9323-4C6D-B211-1D82F881BB13",variableType:8}
 */
var vOreAssenza = null;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"70F019AA-149F-4D33-B312-3BED81A3648B"}
 */
function onActionConfermaOreAssenza(event) 
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
	gestioneOreAssenza(vIdLavoratore,vOreAssenza,vGiorno,vSettimana,vCopertura);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"EECB8D32-C677-4279-BA82-2D1DF71CBA71"}
 */
function onActionAnnullaOreAssenza(event) 
{
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
    vOreAssenza = null;
    globals.svy_mod_closeForm(event);
}

/**
 * @AllowToRunInFind
 * 
 * Gestisce l'operazione di inserimento delle ore di assenza nel giorno indicato
 * per il dipendente 
 * 
 * @param {Number} idLavoratore
 * @param {Number} oreAssenza
 * @param {Date} giorno
 * @param {Number} settimana
 * @param {Boolean} fromCopertura
 *
 * @properties={typeid:24,uuid:"E93A0CBE-A6E3-4987-AE03-F5CB29490D35"}
 */
function gestioneOreAssenza(idLavoratore,oreAssenza,giorno,settimana,fromCopertura)
{
	try {
		if(!verificaOreAssenza())
		{
			globals.ma_utl_showWarningDialog('Controllare i parametri inseriti e riprovare!');
			return;
		}
		
		var anno = globals.getAnno();
		var gg = globals.getDateOfISOWeek(settimana,anno);
		var index = globals.dateDiff(gg,giorno,1000 * 60 * 60 * 24);
		
		// controllo validità selezione del giorno rispetto a date di assunzione e cessazione
		var assunzione = globals.getDataAssunzione(idLavoratore);
        var cessazione = globals.getDataCessazione(idLavoratore);
        if(giorno < assunzione)
           throw new Error('Il dipendente non risulta ancora assunto nel giorno selezionato!');
		if(cessazione != null && giorno > cessazione)
           throw new Error('Il dipendente risulta già cessato nel giorno selezionato!');
		        
		// controllo giorno festivo
        if(forms.neg_header_options.vArrGiorniFestivi.indexOf(utils.dateFormat(giorno,globals.ISO_DATEFORMAT)) != -1)
		{
			if(globals.isFestivitaGodutaLavoratore(utils.dateFormat(giorno,globals.ISO_DATEFORMAT),idLavoratore))
			   throw new Error('Non è possibile inserire una assenza in un giorno festivo!');
		}

		/** @type {JSFoundSet<db:/ma_presenze/e2giornalieraprogfasce>} */
		var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.GIORNALIERA_PROGFASCE);
		if (fs.find()) 
		{
			fs.iddip = idLavoratore;
			fs.giorno = utils.dateFormat(giorno, globals.ISO_DATEFORMAT) + '|yyyyMMdd';

			var idFasciaOrariaNew = null;
			var idFasciaTimbrOld = null;
			
			// se per il giorno è già stata programmata un orario a fascia questa non deve essere associata ad un idfasciatimbrature
			// e dev'essere impostata al numero di ore richiesto
			if (fs.search())
			{
				if(fs.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature)
				   idFasciaTimbrOld = fs.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.iddittafasciaorariatimbrature;
				var totaleOreProg = idFasciaTimbrOld != null ? globals.calcolaOreEventoFasciaOrariaTimbrature(idFasciaTimbrOld) : 0;
				var totaleOreOld = fs.e2giornalieraprogfasce_to_e2fo_fasceorarie.totaleorefascia / 100;
				
				if(totaleOreProg > totaleOreOld)
					throw new Error('Nel giorno è stato precedentemente programmato uno straordinario, non è possibile inserire un\'assenza');
				else if(totaleOreProg < totaleOreOld)
					throw new Error('Non è possibile inserire un\'ulteriore assenza nel giorno');
				
				idFasciaOrariaNew = globals.getFasciaOrariaDaTotaleOre(globals.getDitta(idLavoratore),(totaleOreOld + vOreAssenza) * 100).idfasciaoraria
				if(idFasciaOrariaNew == null)
					throw new Error('Nessuna fascia con un numero di ore corrispondente alla selezione');
				
				databaseManager.startTransaction();
				fs.iddittafasciaorariatimbrature = idFasciaTimbrOld;
				fs.idfasciaoraria = idFasciaOrariaNew;
			}
			// se non è ancora associata una fascia programmata, procediamo ad inserirla come fascia con numero di ore richiesto
			else
			{
				databaseManager.startTransaction();
				var newProg = fs.getRecord(fs.newRecord())
				if (!newProg)
					throw new Error('Errore durante la creazione del record nella tabella E2GiornalieraProgFasce');

				newProg.iddip = idLavoratore;
				newProg.giorno = giorno;
				newProg.idfasciaoraria = globals.getFasciaOrariaDaTotaleOre(globals.getDitta(idLavoratore), vOreAssenza * 100).idfasciaoraria;
				newProg.tiporiposo = 0;
				newProg.idfasciaorariafittizia = null;
				newProg.iddittafasciaorariatimbrature = null;
				newProg.festivo = false;
			}
			
			var success = databaseManager.commitTransaction();
			if (!success) {
				var failedrecords = databaseManager.getFailedRecords();
				if (failedrecords && failedrecords.length > 0)
					throw new Error('Errore durante il salvataggio dell\'impostazione del giorno di riposo');
			}
			else
			{
				if(fromCopertura)
					globals.preparaProgrammazioneCoperturaGiorno(giorno,index,globals.getTipoGestoreReteImpresa(),true);
				else
				{ 
					// prepara programmazione settimanale
					var frmSettName = 'neg_prog_periodo_settimana_' + settimana;
					/** @type {Form<neg_prog_periodo_settimana>}*/
					var frmSett = forms[frmSettName];
					frmSett.preparaProgrammazioneSettimanaNegozio(settimana,anno,globals.getTipoGestoreReteImpresa(),fromCopertura);
				}
				
			}
		} else
			throw new Error('Cannot go to find mode');
	} catch (ex) {
		application.output(ex.message, LOGGINGLEVEL.ERROR);
		databaseManager.rollbackTransaction();
		globals.ma_utl_showErrorDialog(ex.message);
	}
}

/**
 * @properties={typeid:24,uuid:"13AA3E55-D84F-4C5D-ACAD-8161E1AD058D"}
 */
function verificaOreAssenza()
{
	// TODO verifica ore assenza
	return true;
}


/**
*
* @param {Boolean} _firstShow
* @param {JSEvent} _event
*
* @properties={typeid:24,uuid:"6CBD1344-F0E3-43FC-A818-7829308E5751"}
*/
function onShowForm(_firstShow, _event) 
{
	_super.onShowForm(_firstShow, _event);
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
    vOreAssenza = null;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"8C829514-BD54-4EA1-A81C-60584562E7DD"}
 */
function onActionOreAssenza(event) 
{
	onActionConfermaOreAssenza(event);
}
