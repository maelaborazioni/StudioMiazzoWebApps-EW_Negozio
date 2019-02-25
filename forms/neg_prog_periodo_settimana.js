/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B16C96ED-A138-482F-9596-1C31012162C9"}
 */
function onActionExpand(event) 
{
	// espande l'area di visualizzazione del riepilogo settimanale
	var frmName = event.getFormName();
	var numSettimana = utils.stringMiddle(frmName,28,frmName.length - 27);
	
	forms['neg_prog_periodo_settimane_tab_temp'].elements['tab_prog_settimana_tabpanel_' + numSettimana].setSize(640,250);
	
//	elements.tab_neg_prog_settimana.setSize(640,250);	
//	var width = forms[frmName].elements['tab_neg_prog_settimana'].getWidth();
//	var height = 250;
//	forms[frmName].elements['tab_neg_prog_settimana'].setSize(width,height);
//	forms['neg_prog_periodo_settimane_tab_temp'].elements['tab_prog_settimana_tabpanel_' + numSettimana].setSize(width,height);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 * 
 * @private 
 *
 * @properties={typeid:24,uuid:"BA15B72D-BF57-4BEE-A9BA-B9C762B60A2F"}
 */
function onActionReduce(event) 
{
	// riduce l'area di visualizzazione del riepilogo settimanale
	var frmName = event.getFormName();
    var numSettimana = utils.stringMiddle(frmName,28,frmName.length - 27);

    forms['neg_prog_periodo_settimane_tab_temp'].elements['tab_prog_settimana_tabpanel_' + numSettimana].setSize(640,30);
    
//    elements.tab_neg_prog_settimana.setSize(640,210);
//    var width = forms[frmName].elements['tab_neg_prog_settimana'].getWidth();
//	var height = 40;
//	forms[frmName].elements['tab_neg_prog_settimana'].setSize(width,height);
	
}

/**
 * @param {Number} settimana
 * @param {Number} anno
 * @param {Number} [tipoReteImpresa]
 * @param {Boolean} [fromCopertura]
 * @param {Boolean} [forzaRidisegno]
 * 
 * @properties={typeid:24,uuid:"EE77D593-C2B1-42CE-91C7-28D361757A9A"}
 * @AllowToRunInFind
 */
function preparaProgrammazioneSettimanaNegozio(settimana,anno,tipoReteImpresa,fromCopertura,forzaRidisegno)
{
	// form delle opzioni
	var frmOpt = forms.neg_header_options;
	
	// recupero dei dipendenti da visualizzare
	var primoGGSettimana = globals.getDateOfISOWeek(settimana,anno);
	var ultimoGGSettimana = new Date(primoGGSettimana.getFullYear(),primoGGSettimana.getMonth(),primoGGSettimana.getDate() + 6);
	var arrLav = [];
	
	switch(tipoReteImpresa)
	{
		case 0:
            arrLav = globals.getLavoratoriSettimanaAnno(primoGGSettimana,ultimoGGSettimana);
			break;
		case 1:
		    arrLav = globals.getLavoratoriDittaSettimanaAnno(forms.neg_header_dtl.idditta,primoGGSettimana,ultimoGGSettimana);
			break;
		case 2:
		    arrLav = globals.getLavoratoriReteImpresaSettimanaAnno(primoGGSettimana,ultimoGGSettimana)
			break;
		default:
			break;
		
	} 		
			
	// recupera le informazioni sulla situazione della settimana per il negozio
    var cols = ['nominativo','lunedi','martedi','mercoledi','giovedi','venerdi','sabato','domenica',
                'ore_programmato','riposi','idlavoratore','ore_regola','ore_teorico','tooltipRiposi',
				'ore_straordinario','ore_assenza','ore_festivita','ore_ordinario','tooltipDipendente',
				'tooltipLU','tooltipMA','tooltipME','tooltipGI','tooltipVE','tooltipSA','tooltipDO',
				'assunto','cessato','cod_ditta','ruolo','tirocinante'];
    var types = [JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,
				 JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.NUMBER,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.TEXT,
				 JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,
				 JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.TEXT,JSColumn.NUMBER];
    
	var _nDataSetSettimana = databaseManager.createEmptyDataSet(0,cols);
	
	// controllo eventuali giornate festive non ancora programmate con il valore di default 
	globals.inizializzaGiornProgFasceFestivita(arrLav,primoGGSettimana,ultimoGGSettimana,tipoReteImpresa);
	
	for(var l = 1; l <= arrLav.length; l++)
	{
		// controlli assunzione/cessazione in corso di settimana e gestione possibile cambio regola in corso di settimana
		var dataAssunzione = globals.getDataAssunzione(arrLav[l - 1]);
		var dataCessazione = globals.getDataCessazione(arrLav[l - 1]);
		var recRegolaInizio = primoGGSettimana >= dataAssunzione ? 
				              globals.getRegolaLavoratoreGiorno(arrLav[l - 1],primoGGSettimana) :
				              globals.getRegolaLavoratoreGiorno(arrLav[l - 1],dataAssunzione);
		var recRegolaFine = ultimoGGSettimana <= dataCessazione ? 
			                  globals.getRegolaLavoratoreGiorno(arrLav[l - 1],ultimoGGSettimana) :
			                  globals.getRegolaLavoratoreGiorno(arrLav[l - 1],dataCessazione);
		if(recRegolaInizio == null)
			throw new Error('Per il lavoratore ' + globals.getNominativo(arrLav[l-1]) + ' della ditta ' + globals.getRagioneSociale(globals.getDitta(arrLav[l-1])) + ' assunto il giorno ' + globals.dateFormat(globals.getDataAssunzione(arrLav[l-1]),globals.EU_DATEFORMAT) + 
				            ' non è stata indicata una regola oraria valida. <br/>Contattare il servizio di assistenza.');
        if(recRegolaInizio && recRegolaFine	&&(recRegolaInizio.idregole != recRegolaFine.idregole))
  			throw new Error('Per il lavoratore ' + globals.getNominativo(arrLav[l-1]) + ' è avvenuto un cambio regola in corso della ' + settimana + 'a settimana nel giorno ' +
  				                             globals.getGiornoUltimaRegola(arrLav[l - 1]) + '.<br/>Al momento non è considerato nel calcolo del superamento dell\'orario!');
		
        // calcolo dei numeri di giorni di riposo (per tipo) definiti dalla regola del blocco 
	    var numRiposiPrimariTeorico = 0;
	    var numRiposiSecondariTeorico = 0;
	    var numRiposiPrimari = 0;
	    var numRiposiSecondari = 0;
	    var giornoRiposoPrimario = null;
	    var giornoRiposoSecondario = null;
	    
		/** @type {JSFoundSet<db:/ma_presenze/e2regolefasce>} */
	    var fsRegoleFasce = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.REGOLE_FASCE);
	    if(fsRegoleFasce.find())
	    {
	    	fsRegoleFasce.idregole = recRegolaInizio.idregole;
	    	if(fsRegoleFasce.search())
	    	{
	    		for(var r = 1; r <= fsRegoleFasce.getSize(); r++)
	    		{
	    			switch(fsRegoleFasce.getRecord(r).tiporiposo)
					{
						case 1 :
							numRiposiPrimariTeorico++;
							break;
						case 2 : 
							numRiposiSecondariTeorico++;
							break;
						default :
							break;
					}
	    		}
	    	}
	    }
		
	    // costruzione array dati
		var arr = new Array(globals.getNominativo(arrLav[l - 1]),null,null,null,null,null,null,null,0
			                ,null,arrLav[l - 1],recRegolaInizio.totaleoreperiodo/100,0,0,0,0,0,null,'',null,null);
				
		// compilazione dati su regola (e fascia oraria?) del lavoratore : prendiamo di base il primo giorno della 
		// settimana che è quello stabilito per gli eventuali cambi regola
		var regola = globals.getRegolaLavoratoreGiorno(arrLav[l - 1],primoGGSettimana < dataAssunzione ? dataAssunzione : primoGGSettimana);
		var tooltipDipendente = 'Regola oraria : ' + (regola ? regola.codiceregola : 'Regola non definita') + ' - ' + (regola ? regola.descrizioneregola : '') + '<br/>';
		
		arr[11] = regola.totaleoreperiodo / 100;
		
		// ciclo for per compilazione dati relativi al giorno
		for(var g = 0; g <= 6; g++)
		{
			var giorno = new Date(primoGGSettimana.getFullYear(),primoGGSettimana.getMonth(),primoGGSettimana.getDate() + g);
			var giornoIso = utils.dateFormat(giorno,globals.ISO_DATEFORMAT);
			
			tooltipDipendente += 'Giorno ' + giorno.getDate() + ' : ';
			
			// eventuali eventi in giornaliera di budget
			var recGiornBudget = globals.getRecGiornaliera(arrLav[l - 1],giorno,globals.TipoGiornaliera.BUDGET);
			var recsGiornEvBudget = recGiornBudget != null ? globals.getRecsGiornalieraEventi(recGiornBudget.idgiornaliera) : null;
			var recGiornEvBudget = recsGiornEvBudget != null ? recsGiornEvBudget.getRecord(1) : null; // per semplicità consideriamo solo il primo record
			// eventuale programmazione fasce inserita
			var recFasciaProg = scopes.giornaliera.getProgrammazioneFasceGiorno(arrLav[l-1],giorno);
			
			// ore teoriche del giorno 
			/** @type {Number}*/
			var oreTeoGiorno = 0;
			// ore festive del giorno
			var oreFestGiorno = 0;
			// ore ordinarie del giorno
			var oreOrdGiorno = 0;
			// ore programmate del giorno
			var oreProgGiorno = 0;
			
			// se per il giorno è stata programmata una particolare fascia 
			if(recFasciaProg && recFasciaProg.e2giornalieraprogfasce_to_e2fo_fasceorarie)
			{
				oreProgGiorno = (recFasciaProg.iddittafasciaorariatimbrature ? 
						             globals.calcolaOreEventoFasciaOrariaTimbrature(recFasciaProg.iddittafasciaorariatimbrature)
									 : 0);
															
				var isGiornoFestivo = frmOpt.vArrGiorniFestivi.indexOf(giornoIso) != -1 && globals.getOreFestivitaGoduta(giornoIso,arrLav[l - 1]);
				var tipoRiposoGiorno = recFasciaProg.tiporiposo;
				
                switch(tipoRiposoGiorno)
				{
					case 1:
						giornoRiposoPrimario = giorno;
						numRiposiPrimari++;
						break;
					case 2:
						giornoRiposoSecondario = giorno;
						numRiposiSecondari++;
						break;
					default:
				        if(isGiornoFestivo
						   && globals.getOreFestivitaGoduta(giornoIso,arrLav[l - 1]))
						{
							// se la fascia è già stata salvata, prendi il valore nel database (se l'orario teorico è stato modificato manualmente
							// da un utente a cui è consentito, questo ha priorità sul valore di default) 
							if(recFasciaProg.e2giornalieraprogfasce_to_e2fo_fasceorarie.totaleorefascia)
								oreFestGiorno = recFasciaProg.e2giornalieraprogfasce_to_e2fo_fasceorarie.totaleorefascia / 100;
							else
							    oreFestGiorno =  globals.getOreFestivitaGoduta(giornoIso,arrLav[l - 1]);
							
							oreOrdGiorno = oreTeoGiorno = oreFestGiorno;
						}
						else
						{
							oreFestGiorno = 0;
							oreTeoGiorno = recFasciaProg.e2giornalieraprogfasce_to_e2fo_fasceorarie.totaleorefascia / 100;
							oreOrdGiorno = Math.min(oreTeoGiorno,oreProgGiorno);
						}
						break;
				}
											
				// ore giorno g
				switch(oreProgGiorno)
				{
					case 0:
						if(isGiornoFestivo && oreFestGiorno >= 0 && oreTeoGiorno > 0)
							arr[g + 1] = 'FS ' + oreFestGiorno;
						else if(oreTeoGiorno > 0)
						{
							// verificare se corrispondente evento PD in giornaliera di budget
							if(recGiornBudget)
							{
							   if(recGiornEvBudget)
							   	  arr[g + 1] = recGiornEvBudget.e2giornalieraeventi_to_e2eventi.evento + ' ' + recGiornEvBudget.ore / 100;
							}
							else
							    arr[g + 1] = '? ' + (oreTeoGiorno - oreProgGiorno);
						}
						else
							if(tipoRiposoGiorno != 0)
								arr[g + 1] = 'Riposo';
							else
							    arr[g + 1] = null; 
						break;
					default:
						if(oreFestGiorno > 0 && oreProgGiorno > 0)
							arr[g + 1] = 'FS ' + oreFestGiorno + ('(S ' + oreProgGiorno + ')');
						else if(oreProgGiorno - oreTeoGiorno > 0)
							arr[g + 1] = (tipoRiposoGiorno != 0 ? 'Rip.' : oreProgGiorno.toString()) + '(S ' + (oreProgGiorno - oreTeoGiorno) + ')';
						else if(oreProgGiorno - oreTeoGiorno < 0)
						{
							// verificare se corrispondente evento PD in giornaliera di budget
							if(recGiornBudget && recGiornEvBudget)
							  arr[g + 1] = oreProgGiorno.toString() + '(' + recGiornEvBudget.e2giornalieraeventi_to_e2eventi.evento + ' ' + recGiornEvBudget.ore / 100 + ')';
							else
  							   arr[g + 1] = oreProgGiorno.toString() + '(? ' + (oreTeoGiorno - oreProgGiorno) + ')';
						}
						else
					        arr[g + 1] = oreProgGiorno.toString();	
					    break;
				}
								
				// gestione informazioni giornaliere sugli orari per il dipendente
				if(recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature)
				{
					var tooltipGiorno = '';
					tooltipGiorno += (recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.inizio_orario_oremin) + ' - ';
				    if(recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.iniziopausa)
					   tooltipGiorno += (recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.inizio_orario_oremin + ', ' 
							                + recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.fine_pausa_oremin + ' - ');
				    tooltipGiorno += recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.fine_orario_oremin;
				    tooltipDipendente += tooltipGiorno;
				    arr[19 + g] = tooltipGiorno;
				}
				else
					arr[19 + g] = ' - ';
				tooltipDipendente += '<br/>';
					
			}
			else
			{
				// controllo caso nessuna programmazione fasce ma presenza di eventi in budget
				// verificare se corrispondente evento PD in giornaliera di budget
				if(recGiornBudget) 
				{
					if(recGiornEvBudget && recGiornEvBudget.ore)
					{
						arr[g + 1] = recGiornEvBudget.e2giornalieraeventi_to_e2eventi.evento + ' ' + recGiornEvBudget.ore / 100;
						oreTeoGiorno = recGiornEvBudget.ore / 100;
					}
				}
			}
			
			// gestione ore straordinario ed assenza
			var deltaOre = (isGiornoFestivo 
					        && globals.getOreFestivitaGoduta(giornoIso,arrLav[l - 1])) ?
							//globals.getOreFestivitaDipendente(arrLav[l - 1],giorno,recFasciaProg.idfasciaoraria)) != 0 ?
					        oreProgGiorno : oreProgGiorno - oreTeoGiorno; 
			
			if(deltaOre > 0)
			   arr[14] = arr[14] + deltaOre;     // straordinari
			else if(deltaOre < 0)
			   arr[15] = arr[15] + ( - deltaOre); // assenze
			
			// totale ore programmate settimana 
			arr[8] = arr[8] + oreProgGiorno + oreFestGiorno;
			
			// totale ore teoriche settimana 
			arr[12] = arr[12] + oreTeoGiorno;
			
			// totale ore ordinarie settimana
			arr[17] = arr[17] + oreOrdGiorno;
			
			// totale ore festività settimana
			arr[16] = arr[16] + oreFestGiorno;
						
		}
		
		// gestione informazioni su orari settimanali
		arr[18] = tooltipDipendente;
		
//		// gestione tipo riposo
//		if(numRiposiPrimari == 0)
//		{
//			//  nel caso sia stato modificato un giorno di riposo trasformandolo in giorno lavorato, va impostato il primo tra gli altri giorni a zero
//			// ore (se esiste) come riposo primario
//			//TODO estendere update giorno di riposo secondario
//			for(g = 0; g <= 6; g++)
//			{
//				if(arr[g + 1] == 0)
//				{
//					giorno = new Date(primoGGSettimana.getFullYear(),primoGGSettimana.getMonth(),primoGGSettimana.getDate() + g);
//					recFasciaProg = globals.getFasciaProgrammataGiorno(arrLav[l-1],giorno);
//					
//					databaseManager.startTransaction();
//					
//					recFasciaProg.tiporiposo = 1;
//					
//					if(!databaseManager.commitTransaction())
//					{
//						databaseManager.rollbackTransaction();
//						globals.ma_utl_showErrorDialog('Non è stato possibile aggiornare automaticamente il giorno di riposo','Aggiorna giorno di riposo');
//						
//					}
//					else
//					{
//						giornoRiposoPrimario = recFasciaProg.giorno;
//						numRiposiPrimari++;
//					}
//				}
//																
//			}
//		}
				
		arr[9] = (numRiposiPrimari == numRiposiPrimariTeorico && numRiposiSecondari == numRiposiSecondariTeorico) ? 1 : 0; 
		// gestione tooltip informazioni ore programmate ed ore settimanali
		arr[13] = 'Totale ore programmate : ' + arr[8] + '<br/>Totale ore teoriche : ' + arr[12] + '<br/>Ore settimanali regola : ' + arr[11] + '<br/>';
		
		// gestione tooltip ore festività
		var tooltipFestivita = 'Ore di festività goduta : ' + arr[16] + '<br/>';
		arr[13] += tooltipFestivita;
		
		// gestione tooltip informazioni riposi settimanali 
		var tooltipRiposi = '';
		if(numRiposiPrimariTeorico)
			tooltipRiposi += 'La regola oraria prevede ' + numRiposiPrimariTeorico + ' riposi primari.<br/>';
		if(numRiposiSecondariTeorico)
			tooltipRiposi += 'La regola oraria prevede ' + numRiposiSecondariTeorico + ' riposi secondari.<br/>';
		
		tooltipRiposi += 'Riposo primario il giorno : ';
		tooltipRiposi += (giornoRiposoPrimario != null ? globals.getNumGiorno(giornoRiposoPrimario) : 'da inserire');
		if(numRiposiSecondari)
		{
			tooltipRiposi += '<br/>Riposo secondario il giorno : ';
		    tooltipRiposi += (giornoRiposoSecondario != null ? globals.getNumGiorno(giornoRiposoSecondario) : 'da inserire');
		}
		
		arr[13] +=  tooltipRiposi;
		
		// flags per assunti/cessati in corso di settimana
		arr[26] = dataAssunzione > primoGGSettimana ? 1 : 0; 
		arr[27] = dataCessazione && dataCessazione < ultimoGGSettimana ? 1 : 0;
		if(arr[26])
			arr[13] += '<br/>ASSUNTO IL ' + globals.dateFormat(dataAssunzione,globals.EU_DATEFORMAT);
		if(arr[27])
			arr[13] += '<br/>CESSATO IL ' + globals.dateFormat(dataCessazione,globals.EU_DATEFORMAT);
		
		// codice ditta appartenenza
		arr[28] = globals.getCodDitta(globals.getDitta(arrLav[l - 1]));
		// ruolo dell'utente
		arr[29] = globals.getUserFromIdLavoratore(arrLav[l - 1],globals.svy_sec_lgn_owner_id).sec_user_to_lavoratori_to_sec_user.sec_user_to_sec_user_org.sec_user_org_to_sec_organization.name;
		
		// tirocinante?
		arr[30] = globals.isTirocinante(arrLav[l - 1]);
		
		_nDataSetSettimana.addRow(l,arr);
	}
	
	var _nDataSourceSettimana = _nDataSetSettimana.createDataSource('_nDataSourceSettimana_'
		                                                            + settimana 
																	+ (fromCopertura ? '_cop' : '')
																	,types);
	
	disegnaProgrammazioneSettimanaleNegozio(arrLav,settimana,anno,_nDataSourceSettimana,forzaRidisegno);
}

/**
 * Disegna la situazione della settimana per i lavoratori indicati
 * 
 * @param {Array<Number>} arrDipendenti
 * @param {Number} settimana
 * @param {Number} anno
 * @param {String} datasource
 * @param {Boolean} [forzaRidisegno]
 *
 * @properties={typeid:24,uuid:"3D10DD3A-7A09-4016-8E2C-B9030D04C5BC"}
 */
function disegnaProgrammazioneSettimanaleNegozio(arrDipendenti,settimana,anno,datasource,forzaRidisegno)
{
	var templateFormName = forms.neg_prog_periodo_settimana_copertura.controller.getName();
	var cloneFormName = templateFormName + '_'  //+ idDitta + '_' 
	                    + settimana;
	if(utils.stringRight(datasource,3) == 'cop')
		cloneFormName += '_cop';
	
    var primoGgSettimana = globals.getDateOfISOWeek(settimana,anno);
        
	if (forms[cloneFormName] == null || forzaRidisegno)
	{
		elements.tab_neg_prog_settimana.removeAllTabs();
		history.removeForm(cloneFormName);
		solutionModel.removeForm(cloneFormName);

		var cloneForm = solutionModel.cloneForm(cloneFormName, solutionModel.getForm(templateFormName));
		// Associamo alla form temporanea il datasource ottenuto in precedenza
		cloneForm.dataSource = datasource;

		var nominativoField = cloneForm.getField('fld_nominativo');
		nominativoField.dataProviderID = 'nominativo';
		nominativoField.displaysTags = true;
		nominativoField.toolTipText = '%%nominativo%%' + '<br/>' + '%%tooltipdipendente%%';

		var lunediFld = cloneForm.getField('fld_lunedi');
		lunediFld.dataProviderID = 'lunedi';
		lunediFld.displaysTags = true;
		lunediFld.toolTipText = '%%tooltiplu%%';
		var lunediLbl = cloneForm.getLabel('lbl_lunedi');
		var lunedi = new Date(primoGgSettimana.getFullYear(), primoGgSettimana.getMonth(), primoGgSettimana.getDate());
		lunediLbl.text = 'LU ' + globals.getNumGiorno(lunedi);
		if (forms.neg_header_options.vArrGiorniFestivi.indexOf(utils.dateFormat(lunedi, globals.ISO_DATEFORMAT)) != -1)
			lunediLbl.foreground = 'white';
        lunediLbl.toolTipText = 'Lunedì ' + globals.dateFormat(lunedi,globals.EU_DATEFORMAT);
		
		var martediFld = cloneForm.getField('fld_martedi');
		martediFld.dataProviderID = 'martedi';
		martediFld.displaysTags = true;
		martediFld.toolTipText = '%%tooltipma%%';
		var martediLbl = cloneForm.getLabel('lbl_martedi');
		var martedi = new Date(primoGgSettimana.getFullYear(), primoGgSettimana.getMonth(), primoGgSettimana.getDate() + 1);
		martediLbl.text = 'MA ' + globals.getNumGiorno(martedi);
		if (forms.neg_header_options.vArrGiorniFestivi.indexOf(utils.dateFormat(martedi, globals.ISO_DATEFORMAT)) != -1)
			martediLbl.foreground = 'white';
		martediLbl.toolTipText = 'Martedì ' + globals.dateFormat(martedi,globals.EU_DATEFORMAT);

		var mercolediFld = cloneForm.getField('fld_mercoledi');
		mercolediFld.dataProviderID = 'mercoledi';
		mercolediFld.displaysTags = true;
		mercolediFld.toolTipText = '%%tooltipme%%';
		var mercolediLbl = cloneForm.getLabel('lbl_mercoledi');
		var mercoledi = new Date(primoGgSettimana.getFullYear(), primoGgSettimana.getMonth(), primoGgSettimana.getDate() + 2);
		mercolediLbl.text = 'ME ' + globals.getNumGiorno(mercoledi);
		if (forms.neg_header_options.vArrGiorniFestivi.indexOf(utils.dateFormat(mercoledi, globals.ISO_DATEFORMAT)) != -1)
			mercolediLbl.foreground = 'white';
		mercolediLbl.toolTipText = 'Mercoledì ' + globals.dateFormat(mercoledi,globals.EU_DATEFORMAT);

		var giovediFld = cloneForm.getField('fld_giovedi');
		giovediFld.dataProviderID = 'giovedi';
		giovediFld.displaysTags = true;
		giovediFld.toolTipText = '%%tooltipgi%%';
		var giovediLbl = cloneForm.getLabel('lbl_giovedi');
		var giovedi = new Date(primoGgSettimana.getFullYear(), primoGgSettimana.getMonth(), primoGgSettimana.getDate() + 3);
		giovediLbl.text = 'GI ' + globals.getNumGiorno(giovedi);
		if (forms.neg_header_options.vArrGiorniFestivi.indexOf(utils.dateFormat(giovedi, globals.ISO_DATEFORMAT)) != -1)
			giovediLbl.foreground = 'white';
		giovediLbl.toolTipText = 'Giovedì ' + globals.dateFormat(giovedi,globals.EU_DATEFORMAT);

		var venerdiFld = cloneForm.getField('fld_venerdi');
		venerdiFld.dataProviderID = 'venerdi';
		venerdiFld.displaysTags = true;
		venerdiFld.toolTipText = '%%tooltipve%%';
		var venerdiLbl = cloneForm.getLabel('lbl_venerdi');
		var venerdi = new Date(primoGgSettimana.getFullYear(), primoGgSettimana.getMonth(), primoGgSettimana.getDate() + 4);
		venerdiLbl.text = 'VE ' + globals.getNumGiorno(venerdi);
		if (forms.neg_header_options.vArrGiorniFestivi.indexOf(utils.dateFormat(venerdi, globals.ISO_DATEFORMAT)) != -1)
			venerdiLbl.foreground = 'white';
		venerdiLbl.toolTipText = 'Venerdì ' + globals.dateFormat(venerdi,globals.EU_DATEFORMAT);

		var sabatoFld = cloneForm.getField('fld_sabato');
		sabatoFld.dataProviderID = 'sabato';
		sabatoFld.displaysTags = true;
		sabatoFld.toolTipText = '%%tooltipsa%%';
		var sabatoLbl = cloneForm.getLabel('lbl_sabato');
		var sabato = new Date(primoGgSettimana.getFullYear(), primoGgSettimana.getMonth(), primoGgSettimana.getDate() + 5);
		sabatoLbl.text = 'SA ' + globals.getNumGiorno(sabato);
		if (forms.neg_header_options.vArrGiorniFestivi.indexOf(utils.dateFormat(sabato, globals.ISO_DATEFORMAT)) != -1)
			sabatoLbl.foreground = 'white';
		sabatoLbl.toolTipText = 'Sabato ' + globals.dateFormat(sabato,globals.EU_DATEFORMAT);

		var domenicaFld = cloneForm.getField('fld_domenica');
		domenicaFld.dataProviderID = 'domenica';
		domenicaFld.displaysTags = true;
		domenicaFld.toolTipText = '%%tooltipdo%%';
		var domenicaLbl = cloneForm.getLabel('lbl_domenica');
		var domenica = new Date(primoGgSettimana.getFullYear(), primoGgSettimana.getMonth(), primoGgSettimana.getDate() + 6);
		domenicaLbl.text = 'DO ' + globals.getNumGiorno(domenica);
		if (forms.neg_header_options.vArrGiorniFestivi.indexOf(utils.dateFormat(domenica, globals.ISO_DATEFORMAT)) != -1)
			domenicaLbl.foreground = 'white';
		domenicaLbl.toolTipText = 'Domenica ' + globals.dateFormat(domenica,globals.EU_DATEFORMAT);

		var totaleProgFld = cloneForm.getField('fld_totale_programmato');
		totaleProgFld.dataProviderID = 'ore_programmato';
		totaleProgFld.displaysTags = true;
		totaleProgFld.toolTipText = '%%tooltipriposi%%';
		totaleProgFld.visible = forms.neg_header_options_cols.vChkProgrammato;

		var totaleTeoFld = cloneForm.getField('fld_totale_teorico');
		totaleTeoFld.dataProviderID = 'ore_teorico';
		totaleTeoFld.toolTipText = '%%tooltipriposi%%';
		totaleTeoFld.visible = forms.neg_header_options_cols.vChkTeorico;

		var totaleOrdFld = cloneForm.getField('fld_totale_ordinario');
		totaleOrdFld.dataProviderID = 'ore_ordinario';
		totaleOrdFld.displaysTags = true;
		totaleOrdFld.toolTipText = '%%tooltipriposi%%';
		totaleOrdFld.visible = forms.neg_header_options_cols.vChkOrdinario;

		var totaleStraoFld = cloneForm.getField('fld_totale_straordinario');
		totaleStraoFld.dataProviderID = 'ore_straordinario';
		totaleStraoFld.displaysTags = true;
		totaleStraoFld.toolTipText = '%%tooltipriposi%%';
		totaleStraoFld.visible = forms.neg_header_options_cols.vChkStraordinario;

		var totaleAssenzaFld = cloneForm.getField('fld_totale_assenza');
		totaleAssenzaFld.dataProviderID = 'ore_assenza';
		totaleAssenzaFld.displaysTags = true;
		totaleAssenzaFld.toolTipText = '%%tooltipriposi%%';
		totaleAssenzaFld.visible = forms.neg_header_options_cols.vChkAssenza;

		var totaleFestivitaFld = cloneForm.getField('fld_totale_festivita');
		totaleFestivitaFld.dataProviderID = 'ore_festivita';
		totaleFestivitaFld.displaysTags = true;
		totaleFestivitaFld.toolTipText = '%%tooltipriposi%%';
		totaleFestivitaFld.visible = forms.neg_header_options_cols.vChkFestivo;

		var ruoloFld = cloneForm.getField('fld_ruolo');
		ruoloFld.dataProviderID = 'ruolo';
		ruoloFld.displaysTags = true;
		ruoloFld.toolTipText = '';
		ruoloFld.visible = true;//(globals.nav_program_name == 'NEG_Rete' || globals.nav_program_name == 'NEG');
		
		elements.tab_neg_prog_settimana.addTab(cloneForm.name);
	}
				
}

