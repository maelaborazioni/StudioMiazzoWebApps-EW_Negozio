/**
 * @properties={typeid:24,uuid:"34A61706-CCBE-4AFB-B4EB-4DD23F68836E"}
 */
function checkExport()
{
	return true;
}

/**
 * Genera il file .pdf con gli orari programmati per la settimana suddividendo mattina e pomeriggio
 * 
 * @param idDitta
 * @param arrDipendenti
 * @param settimana
 * @param anno
 *
 * @properties={typeid:24,uuid:"43FDF24E-205D-410D-9FF9-1ADAB2DDC85A"}
 * @AllowToRunInFind
 */
function exportReportSettimanaMP(idDitta,arrDipendenti,settimana,anno)
{
	// impostazioni parametri del report
	var reportName = idDitta != null ? 'NEG_ProgrammazioneSettimana_MP.jasper' : 'NEG_ProgrammazioneSettimana_MP_Resp.jasper';
	var reportParams = new Object();
	reportParams.ragionesociale = idDitta != null ? globals.getRagioneSociale(idDitta) : globals.svy_sec_username;
	reportParams.settimana = settimana;
	var dal = globals.getDateOfISOWeek(settimana,anno)
	var al = new Date(dal.getFullYear(),dal.getMonth(),dal.getDate() + 6);
	reportParams.dalladata = dal;
	reportParams.alladata = al;
	
	var types = [JSColumn.NUMBER,JSColumn.TEXT,JSColumn.TEXT,
	             JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.NUMBER
				 ];
	var colNames = ['idlavoratore','cognome','nome',
	                'lunedi_mattino','lunedi_pomeriggio','lunedi_apre','lunedi_chiude',
					'martedi_mattino','martedi_pomeriggio','martedi_apre','martedi_chiude',
					'mercoledi_mattino','mercoledi_pomeriggio','mercoledi_apre','mercoledi_chiude',
					'giovedi_mattino','giovedi_pomeriggio','giovedi_apre','giovedi_chiude',
					'venerdi_mattino','venerdi_pomeriggio','venerdi_apre','venerdi_chiude',
					'sabato_mattino','sabato_pomeriggio','sabato_apre','sabato_chiude',
					'domenica_mattino','domenica_pomeriggio','domenica_apre','domenica_chiude'];
	
	// costruzione della base di dati per il report
	var ds = databaseManager.createEmptyDataSet(0,colNames);
	if(ds)
	{
		// ciclo per determinare il minimo orario di apertura 
		// ciclo per ottenimento orari effettivi del dipendente nei giorni
		for(var l = 1; l <= arrDipendenti.length; l++)
		{
			ds.addRow(l,new Array(types.length))
			var arrRow = globals.ottieniDataSetFasceProgrammate(arrDipendenti[l - 1],settimana,anno);
			for(var i = 0; i < arrRow.length; i++)
			{				
				ds.setValue(l,1,arrRow[0]);
				ds.setValue(l,2,arrRow[1]);
				ds.setValue(l,3,arrRow[2]);
				
				for(var g = 0; g <= 6; g++)
				{
					var minOrario = 0//globals.getMinOrarioInizialeGiorno(arrDipendenti,giorno);
					var maxOrario = 2400//globals.getMaxOrarioFinaleGiorno(arrDipendenti,giorno);
					
					// TODO gestione min e max da indicare in stampa
					
					/** @type {JSFoundSet<db:/ma_anagrafiche/ditte_fasceorarietimbrature>}*/
					var fsFasciaTimbr = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.FASCE_ORARIE_DITTA_TIMBRATURE);
					if(fsFasciaTimbr.find())
					{
						fsFasciaTimbr.iddittafasciaorariatimbrature = arrRow[g + 3] != null ? arrRow[g + 3] : -1;
						if(fsFasciaTimbr.search())
						{
							var recFasceDittaTimbr = fsFasciaTimbr;
							if (recFasceDittaTimbr != null) {
								// esistono una o due coppie di timbrature associate alla fascia ed alla giornata corrispondente
								if (recFasceDittaTimbr.iniziopausa != null)
								{
									ds.setValue(l, g * 4 + 4, recFasceDittaTimbr.inizio_orario_oremin + ' - ' + recFasceDittaTimbr.inizio_pausa_oremin);
									ds.setValue(l, g * 4 + 5, recFasceDittaTimbr.fine_pausa_oremin + ' - ' + recFasceDittaTimbr.fine_orario_oremin);
								} 
								else if (recFasceDittaTimbr.inizioorario < 1230) 
								{
									ds.setValue(l, g * 4 + 4, recFasceDittaTimbr.inizio_orario_oremin + ' - ' + recFasceDittaTimbr.fine_orario_oremin);
									ds.setValue(l, g * 4 + 5, null);
									
//									// differenziazione solo mattino o giornata intera
//									if (recFasceDittaTimbr.fineorario <= 1330) {
//										ds.setValue(1, g * 4 + 4, recFasceDittaTimbr.inizio_orario_oremin);
//										ds.setValue(1, g * 4 + 5, recFasceDittaTimbr.fine_orario_oremin);
//										ds.setValue(1, g * 4 + 6, null);
//										ds.setValue(1, g * 4 + 7, null);
//									}
//									// giornata intera
//									else {
//										ds.setValue(1, g * 4 + 4, recFasceDittaTimbr.inizio_orario_oremin);
//										ds.setValue(1, g * 4 + 7, recFasceDittaTimbr.fine_orario_oremin);
//										ds.setValue(1, g * 4 + 6, null);
//										ds.setValue(1, g * 4 + 5, null);
//									}
								}
								else
								{
									ds.setValue(l, g * 4 + 4, null);
									ds.setValue(l, g * 4 + 5, recFasceDittaTimbr.inizio_orario_oremin + ' - ' + recFasceDittaTimbr.fine_orario_oremin);
								}
								
								ds.setValue(l, g * 4 + 6, recFasceDittaTimbr.inizioorario == minOrario ? 1 : 0);
								ds.setValue(l, g * 4 + 7, recFasceDittaTimbr.fineorario == maxOrario ? 1 : 0);
							} 
							else
							{
								ds.setValue(l, g * 4 + 4, null);
								ds.setValue(l, g * 4 + 5, null);
								ds.setValue(l, g * 4 + 6, 0);
								ds.setValue(l, g * 4 + 7, 0);
							}
						}
					}
				}
				
			}
						
		}
		
		// popolamento del foundset da passare come parametro al plugin dei report
		var fs = databaseManager.getFoundSet(ds.createDataSource('dS_ProgrammazioneSettimana_MP',types));
		fs.loadAllRecords();
				
		var bytes = plugins.jasperPluginRMI.runReport(fs,reportName,null,plugins.jasperPluginRMI.OUTPUT_FORMAT.PDF,reportParams,null);
	
		plugins.file.writeFile('Programmazione_' + (idDitta != null ? globals.getCodDitta(idDitta) : globals.svy_sec_username) + 'settimana_' + settimana + '_anno_' + anno + '.pdf',bytes);
	}
}

/**
 * Genera il file .pdf con gli orari programmati per la settimana
 *
 * @param idDitta
 * @param arrDipendenti
 * @param settimana
 * @param anno
 *
 * @properties={typeid:24,uuid:"65222486-5078-4AF6-A00A-23809A8A677F"}
 */
function exportReportSettimana(idDitta,arrDipendenti,settimana,anno)
{
	var types = [JSColumn.NUMBER,JSColumn.TEXT,JSColumn.TEXT,
	             JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,
				 JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT];
	var colNames = ['idlavoratore','cognome','nome',
	                'lunedi','martedi','mercoledi','giovedi','venerdi','sabato','domenica'];
	
	var ds = databaseManager.createEmptyDataSet(0,colNames);
	if(ds)
	{
		for(var l = 1; l <= arrDipendenti.length; l++)
		{
			var arrRow = globals.ottieniDataSetTimbrProgrammate(arrDipendenti[l - 1],settimana,anno);
			ds.addRow(arrRow);
		}
		
		var fs = databaseManager.getFoundSet(ds.createDataSource('dS_ProgrammazioneSettimana',types));
		fs.loadAllRecords();
		
		var reportParams = new Object();
		reportParams.ragionesociale = globals.getRagioneSociale(idDitta);
		reportParams.settimana = settimana;
		var dal = globals.getDateOfISOWeek(settimana,anno)
		reportParams.dalladata = dal;
		reportParams.alladata = new Date(dal.getFullYear(),dal.getMonth(),dal.getDate() + 6);
		
		var bytes = plugins.jasperPluginRMI.runReport(fs,'NEG_ProgrammazioneSettimana.jasper',null,plugins.jasperPluginRMI.OUTPUT_FORMAT.PDF,reportParams,null);
	
		plugins.file.writeFile('Programmazione_settimana_' + settimana + '_anno_' + anno,bytes);
	}
}

/**
 * Genera il report con la copertura del giorno desiderato
 * 
 * @param {Date} giorno
 * @param {Number} tipoGestoreReteImpresa
 * @param {Number} idDittaNegozio
 *
 * @properties={typeid:24,uuid:"A41BF2CC-0042-4D38-8923-4D81DC809F60"}
 */
function exportReportProgrammazioneGiorno(giorno,tipoGestoreReteImpresa,idDittaNegozio)
{
	var dsProgGiorno = globals.ottieniDataSetReportCoperturaGiorno(giorno,tipoGestoreReteImpresa)

	var types = [JSColumn.TEXT,
	             JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.NUMBER];
	
	var fs = databaseManager.getFoundSet(dsProgGiorno.createDataSource('dS_ProgrammazioneGiorno',types));
    fs.loadAllRecords();
    
    var reportParams = new Object();
	reportParams.pgiorno = giorno;
	reportParams.pnegozio = globals.getRagioneSociale(idDittaNegozio);
	
	var bytes = plugins.jasperPluginRMI.runReport(fs,'NEG_CoperturaGiorno.jasper',null,plugins.jasperPluginRMI.OUTPUT_FORMAT.PDF,reportParams,null);

	plugins.file.writeFile('Copertura_giorno_' + globals.dateFormat(giorno,globals.ISO_DATEFORMAT) + '_Negozio_' + globals.getCodDitta(idDittaNegozio) +'.pdf',bytes);
}

/**
 * Genera il report comprendente i giorni del periodo desiderato
 * 
 * @param {Date} giornoDal
 * @param {Date} giornoAl
 * @param {Number} tipoGestoreReteImpresa
 * @param {Number} idDittaNegozio
 *
 * @properties={typeid:24,uuid:"B8CFE705-623E-46E8-B215-E27BEA8B9494"}
 */
function exportReportProgrammazionePeriodo(giornoDal,giornoAl,tipoGestoreReteImpresa,idDittaNegozio)
{
	var dsProgSettimana = globals.ottieniDataSetReportCoperturaPeriodo(giornoDal,giornoAl,tipoGestoreReteImpresa)

	var types = [JSColumn.TEXT,
	             JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.NUMBER,
				 JSColumn.DATETIME];
	
	var fs = databaseManager.getFoundSet(dsProgSettimana.createDataSource('dS_ProgrammazioneSettimana',types));
    fs.loadAllRecords();
    
    var reportParams = new Object();
    /**Object { int week, int year }*/
	var dayStruct = globals.getWeekNumber(giornoDal);
	reportParams.psettimana = dayStruct['week'];
	reportParams.pgiornodal = giornoDal;
	reportParams.pgiornoal = giornoAl;
	reportParams.pnegozio = globals.getRagioneSociale(idDittaNegozio);
	
	var bytes = plugins.jasperPluginRMI.runReport(fs,'NEG_CoperturaSettimana.jasper',null,plugins.jasperPluginRMI.OUTPUT_FORMAT.PDF,reportParams,null);

	plugins.file.writeFile('Copertura_Periodo_Dal_' + globals.dateFormat(giornoDal,globals.ISO_DATEFORMAT) + '_Al_' + globals.dateFormat(giornoAl,globals.ISO_DATEFORMAT) + '_Negozio_' + globals.getCodDitta(idDittaNegozio) +'.pdf',bytes);
}

/**
 * Produce ed esporta il report con la programmazione del negozio per il periodo richiesto 
 * 
 * @param idDitta
 * @param anno
 * @param mese
 * @param tipoGestoreReteImpresa
 *
 * @properties={typeid:24,uuid:"CE4CD0E6-F4B3-434D-B0C7-B2FD426BF6BF"}
 * @SuppressWarnings(unused)
 */
function exportReportProgrammazioneNegozioPeriodo(idDitta,anno,mese,tipoGestoreReteImpresa)
{
	// array dei lavoratori attivi nel periodo
	var arrLav = [];
	/** @type {Date}*/
	var primoGgPeriodo = globals.getFirstDatePeriodo(anno * 100 + mese);
	/** @type {Date}*/
	var ultimoGgPeriodo = globals.getLastDatePeriodo(anno * 100 + mese); 
	switch(tipoGestoreReteImpresa)
	{
		// caso responsabile del punto vendita -> i dipendenti sono quelli corrispondenti agli utenti con livello gerarchico inferiore
		case 0:
		arrLav = globals.getLavoratoriSettimanaAnno(primoGgPeriodo,ultimoGgPeriodo);
		break;
		// caso gestore con ditta selezionata
		case 1:
		arrLav = globals.getLavoratoriDittaSettimanaAnno(forms.neg_header_dtl.idditta,primoGgPeriodo,ultimoGgPeriodo);
		break;
		// caso gestore intera rete di impresa
		case 2: 
		arrLav = globals.getLavoratoriReteImpresaSettimanaAnno(primoGgPeriodo,ultimoGgPeriodo);
		break;
	}
	
	var primaSett = globals.getPrimaSettimanaPeriodo(anno,mese);
	var columnNames = ['idlavoratore','codice','nominativo','assunzione','cessazione','percpt'
	                   ,'giorno','testo','codicefascia','descrizionefascia','codiceregola','descrizioneregola'];
	var columnTypes = [JSColumn.NUMBER,JSColumn.TEXT,JSColumn.TEXT,JSColumn.DATETIME,JSColumn.DATETIME,JSColumn.NUMBER
	                   ,JSColumn.DATETIME,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT];
	var dsProgNegozioPeriodo = databaseManager.createEmptyDataSet(0,columnNames);
		
	for(var s = primaSett; s < primaSett + 10; s++)
	{
		var frmName = 'neg_prog_periodo_settimana_copertura_' + s;
		var primoGgSett = globals.getDateOfISOWeek(s,anno);
		if(primoGgSett > ultimoGgPeriodo)
		   break;
		
		var frm = forms[frmName];
		var fs = frm.foundset;
		
		for(var l = 1; l <= fs.getSize(); l++)
		{
			for(var g = 1; g <= 7; g++)
			{
				var idLavoratore = fs.getRecord(l)['idlavoratore'];
				var arrProgNegozioPeriodo = new Array();
				arrProgNegozioPeriodo.push(idLavoratore);
				arrProgNegozioPeriodo.push(globals.getCodLavoratore(idLavoratore));
				arrProgNegozioPeriodo.push(globals.getNominativo(idLavoratore));
				arrProgNegozioPeriodo.push(globals.getDataAssunzione(idLavoratore));
				arrProgNegozioPeriodo.push(globals.getDataCessazione(idLavoratore));
				var percPt = globals.getPercentualePartTime(idLavoratore);
				arrProgNegozioPeriodo.push(percPt != 0 ? percPt : null);
				
				var giorno = new Date(primoGgSett.getFullYear(),primoGgSett.getMonth(),primoGgSett.getDate() + (g - 1));
				
				if(giorno < primoGgPeriodo || giorno > ultimoGgPeriodo)
					continue;
				
				arrProgNegozioPeriodo.push(giorno);
				switch (g)
				{
					case 1:
						arrProgNegozioPeriodo.push(fs.getRecord(l)['lunedi']);
						break;
					case 2:
						arrProgNegozioPeriodo.push(fs.getRecord(l)['martedi']);
						break;
					case 3:
						arrProgNegozioPeriodo.push(fs.getRecord(l)['mercoledi']);
						break;
					case 4:
						arrProgNegozioPeriodo.push(fs.getRecord(l)['giovedi']);
						break;
					case 5:
						arrProgNegozioPeriodo.push(fs.getRecord(l)['venerdi']);
						break;
					case 6:
						arrProgNegozioPeriodo.push(fs.getRecord(l)['sabato']);
						break;
					case 7:
						arrProgNegozioPeriodo.push(fs.getRecord(l)['domenica']);
						break;
					default:
						break;
				}
				var fasciaProg = globals.getFasciaProgrammataGiorno(idLavoratore,giorno);
				arrProgNegozioPeriodo.push(fasciaProg != null ? fasciaProg.codicefascia : '');
				arrProgNegozioPeriodo.push(fasciaProg != null ? fasciaProg.descrizione_fascia : '');
				var regola = globals.getRegolaLavoratoreGiorno(idLavoratore,giorno);
				arrProgNegozioPeriodo.push(regola != null ? regola.codiceregola : '');
				arrProgNegozioPeriodo.push(regola != null ? regola.descrizioneregola : '');
				
				dsProgNegozioPeriodo.addRow(arrProgNegozioPeriodo);
			}
		}
	}
	
	var fsReport = databaseManager.getFoundSet(dsProgNegozioPeriodo.createDataSource('dS_ProgNegozioPeriodo',columnTypes));
    fsReport.loadAllRecords();
    fsReport.sort('nominativo asc,giorno');
    
    var reportParams = new Object();
	reportParams.pcodditta = globals.getCodDitta(idDitta);
	reportParams.pperiodo = mese + " / " + anno;
	reportParams.pragionesociale = globals.getRagioneSociale(idDitta);
	
	var bytes = plugins.jasperPluginRMI.runReport(fsReport,'NEG_RiepilogoPresenzePeriodo.jasper',null,plugins.jasperPluginRMI.OUTPUT_FORMAT.PDF,reportParams,null);

	plugins.file.writeFile('Riepilogo_Presenze_Periodo_' + (anno * 100 + mese) +'.pdf',bytes);
			
}

/**
 * @param _itemInd
 * @param _parItem
 * @param _isSel
 * @param _parMenTxt
 * @param _menuTxt
 * @param event
 * @param idDitta
 * @param settimana
 * @param anno
 * @param tipoGestore
 *  
 * @properties={typeid:24,uuid:"4CFD3714-3CD1-4367-8A62-86EDB595EFBE"}
 */
function confermaEsportazioneReportSettimana(_itemInd,_parItem,_isSel,_parMenTxt,_menuTxt,event,idDitta,settimana,anno,tipoGestore)
{
	var primoGiornoSettimana = globals.getDateOfISOWeek(settimana,anno);
	var ultimoGiornoSettimana = new Date(primoGiornoSettimana.getFullYear(),primoGiornoSettimana.getMonth(),primoGiornoSettimana.getDay() + 6);
	var arrLav = [];
	
	switch(tipoGestore)
	{
		// caso responsabile del punto vendita -> i dipendenti sono quelli corrispondenti agli utenti con livello gerarchico inferiore
		case 0:
		arrLav = globals.getLavoratoriSettimanaAnno(primoGiornoSettimana,ultimoGiornoSettimana);
		break;
		// caso gestore con ditta selezionata
		case 1:
		idDitta = forms.neg_header_dtl.idditta;	
		arrLav = globals.getLavoratoriDittaSettimanaAnno(idDitta,primoGiornoSettimana,ultimoGiornoSettimana);
		break;
		// caso gestore intera rete di impresa
		case 2: 
		arrLav = globals.getLavoratoriReteImpresaSettimanaAnno(primoGiornoSettimana,ultimoGiornoSettimana);
		break;
	}
	
	exportReportSettimanaMP(idDitta,arrLav,settimana,anno);
	
	// codice precedente con blocco su settimane non ancora compilate correttamente
//	if(globals.verificaProgrammazioneSettimanale(idDitta,arrLav,settimana,anno))
//	   exportReportSettimanaMP(idDitta,arrLav,settimana,anno);
//	else
//	{
//		globals.ma_utl_showWarningDialog('La settimana risulta squadrata od incompleta. Controllate la programmazione e la presenza di un giorno di riposo.<br/>Non è possibile stampare la programmazione.','Stampa il programma settimanale');
//		return;
//	}
}

/**
 * @param _itemInd
 * @param _parItem
 * @param _isSel
 * @param _parMenTxt
 * @param _menuTxt
 * @param event
 * @param idDitta
 * @param giorno
 * @param tipoGestore
 *  
 * @properties={typeid:24,uuid:"D71DA19B-EFAA-41A1-A15B-2387D883298F"}
 */
function confermaEsportazioneProgrammazioneGiorno(_itemInd,_parItem,_isSel,_parMenTxt,_menuTxt,event,idDitta,giorno,tipoGestore)
{
    exportReportProgrammazioneGiorno(giorno,tipoGestore,idDitta);
}

/**
 * @param _itemInd
 * @param _parItem
 * @param _isSel
 * @param _parMenTxt
 * @param _menuTxt
 * @param event
 * @param idDitta
 * @param giornoDal
 * @param giornoAl
 * @param tipoGestore
 *  
 * @properties={typeid:24,uuid:"C02EAD8B-9981-4000-BA75-A66780E907F4"}
 */
function confermaEsportazioneProgrammazionePeriodo(_itemInd,_parItem,_isSel,_parMenTxt,_menuTxt,event,idDitta,giornoDal,giornoAl,tipoGestore)
{
    exportReportProgrammazionePeriodo(giornoDal,giornoAl,tipoGestore,idDitta);
}

/**
 * @param _itemInd
 * @param _parItem
 * @param _isSel
 * @param _parMenTxt
 * @param _menuTxt
 * @param event
 * @param idDitta
 * @param anno
 * @param mese
 * @param tipoGestoreReteImpresa
 *
 * @properties={typeid:24,uuid:"3031826D-DA6F-4CC5-A463-980F743704CE"}
 */
function confermaEsportazioneProgrammazioneNegozioPeriodo(_itemInd,_parItem,_isSel,_parMenTxt,_menuTxt,event,idDitta,anno,mese,tipoGestoreReteImpresa)
{
	exportReportProgrammazioneNegozioPeriodo(idDitta,anno,mese,tipoGestoreReteImpresa);
}