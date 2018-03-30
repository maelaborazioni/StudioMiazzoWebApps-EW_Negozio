/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"8E166E7F-8108-44D8-9140-79EB3BB05D45",variableType:4}
 */
var offsetStdNegozio = 2;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"146B7657-3654-4E9B-9960-D2F988ECC6E3",variableType:4}
 */
var offsetStdGiorno = 5;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"8EDA7045-D037-42CF-8AFF-687792C9933B",variableType:4}
 */
var numGiorniPeriodo = 7;

/**
 * @properties={typeid:24,uuid:"44E3C3EA-33FE-4BDF-99B5-C09648B0C190"}
 */
function selezione_programmazione_negozio()
{
	var isGestoreRete = globals.ma_utl_hasKey(globals.Key.RETE_IMPRESA)
	                    && globals.ma_utl_hasKey(globals.Key.RETE_IMPRESA_GESTORE);
	
	var form = isGestoreRete ? forms.neg_selezione_prog_negozio_gestore : forms.neg_selezione_prog_negozio;
	var formName = form.controller.getName();
		
	globals.ma_utl_setStatus(globals.Status.EDIT,formName);
	
	// Prevent the double click on the menu to open two windows
	if(!application.getWindow(formName))
		globals.ma_utl_showFormInDialog(formName, isGestoreRete ? 'Selezione ditta periodo' : 'Selezione periodo');
}

/**
 * @properties={typeid:24,uuid:"3551C9AF-2DE8-4F34-83C1-75C9CAA7B58D"}
 */
function selezione_programmazione_copertura_negozio()
{
	var isGestoreRete = globals.ma_utl_hasKey(globals.Key.RETE_IMPRESA)
	                    && globals.ma_utl_hasKey(globals.Key.RETE_IMPRESA_GESTORE);
	
	var form = isGestoreRete ? forms.neg_selezione_prog_negozio_gestore_copertura : forms.neg_selezione_prog_negozio_copertura;
	var formName = form.controller.getName();
		
	globals.ma_utl_setStatus(globals.Status.EDIT,formName);
	
	// Prevent the double click on the menu to open two windows
	if(!application.getWindow(formName))
		globals.ma_utl_showFormInDialog(formName, 'Programmazione copertura giornaliera del punto vendita');
}

/**
 * Prepara i dati necessari alla gestione del negozio nel giorno selezionato
 *  
 * @param {Number} idDitta 
 * @param {Array<Number>} arrLavoratori 
 * @param {Date} giorno
 * @param {Number} settimana
 * @param {Boolean} fromCopertura
 * @param {Boolean} [openNewDialog]
 *  
 * @properties={typeid:24,uuid:"DA55D54E-318C-4297-9B6C-E28C83E65D53"}
 */
function preparaProgrammazioneGiornoNegozio(idDitta,arrLavoratori,giorno,settimana,fromCopertura,openNewDialog)
{
    var frm = forms.neg_prog_giorno_tab;
	frm.vFromCopertura = fromCopertura;
    
    // numero lavoratori da visualizzare
    var numLavoratori = arrLavoratori.length;
        
	// creazione dataset con colonne necessarie
	var types = [JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.TEXT];
	var columns = ['idlavoratore','codice','nominativo'];
	var dsGiornoNegozio = databaseManager.createEmptyDataSet(numLavoratori,columns);
			
	types.push(JSColumn.TEXT);
	dsGiornoNegozio.addColumn('e1', 4, JSColumn.TEXT);
		
	types.push(JSColumn.TEXT);
	dsGiornoNegozio.addColumn('u1', 5, JSColumn.TEXT);
	
	types.push(JSColumn.TEXT);
	dsGiornoNegozio.addColumn('e2', 6, JSColumn.TEXT);
		
	types.push(JSColumn.TEXT);
	dsGiornoNegozio.addColumn('u2', 7, JSColumn.TEXT);
		
	// campi standard di riepilogo giorno
	types.push(JSColumn.NUMBER);
	dsGiornoNegozio.addColumn('ore_programmato',8,JSColumn.NUMBER);
	types.push(JSColumn.NUMBER);
	dsGiornoNegozio.addColumn('ore_teorico',9,JSColumn.NUMBER);
	types.push(JSColumn.NUMBER);
	dsGiornoNegozio.addColumn('ore_assenza',10,JSColumn.NUMBER);
	types.push(JSColumn.NUMBER);
	dsGiornoNegozio.addColumn('ore_straordinario',11,JSColumn.NUMBER)
	types.push(JSColumn.NUMBER);
	dsGiornoNegozio.addColumn('id_ditta_fascia_oraria_timbrature',12,JSColumn.NUMBER);
	types.push(JSColumn.NUMBER);
	dsGiornoNegozio.addColumn('id_fascia_oraria',13,JSColumn.NUMBER);
	types.push(JSColumn.NUMBER);
	dsGiornoNegozio.addColumn('modificato',14,JSColumn.NUMBER);
	types.push(JSColumn.NUMBER); 
	dsGiornoNegozio.addColumn('regola_zero_ore',15,JSColumn.NUMBER);
	types.push(JSColumn.NUMBER);
	dsGiornoNegozio.addColumn('tipo_riposo',16,JSColumn.NUMBER);
	types.push(JSColumn.NUMBER);
	dsGiornoNegozio.addColumn('non_attivo',17,JSColumn.NUMBER);
	types.push(JSColumn.NUMBER);
	dsGiornoNegozio.addColumn('ore_festivo',18,JSColumn.NUMBER);
	types.push(JSColumn.NUMBER);
	dsGiornoNegozio.addColumn('ore_ordinario',19,JSColumn.NUMBER);
	
	// compilazione del dataset ad hoc per presentazione 
	for(var l = 1; l <= numLavoratori; l++)
	{	
		for(var i = 1; i <= dsGiornoNegozio.getMaxColumnIndex(); i++)
		{
			//compilazione di default a null
			dsGiornoNegozio.setValue(l,i,null);
		}
		
		dsGiornoNegozio.setValue(l,1,arrLavoratori[l-1]);
		dsGiornoNegozio.setValue(l,2,globals.getCodLavoratore(arrLavoratori[l-1]));
		dsGiornoNegozio.setValue(l,3,globals.getNominativo(arrLavoratori[l-1]));
		dsGiornoNegozio.setValue(l,8,null);
		dsGiornoNegozio.setValue(l,9,null);
		dsGiornoNegozio.setValue(l,10,null);
		dsGiornoNegozio.setValue(l,11,null);
		dsGiornoNegozio.setValue(l,12,null);
		dsGiornoNegozio.setValue(l,13,null);
		dsGiornoNegozio.setValue(l,14,0);
		dsGiornoNegozio.setValue(l,16,0);
		dsGiornoNegozio.setValue(l,18,null);
		dsGiornoNegozio.setValue(l,19,null);
		
		// verifica se lavoratore non ancora assunto o già cessato
		var dataAss = globals.getDataAssunzione(arrLavoratori[l - 1]); 
		var dataCess = globals.getDataCessazione(arrLavoratori[l - 1]);
		if( dataAss > giorno || dataCess != null && dataCess < giorno)
		{
			dsGiornoNegozio.setValue(l,17,1);
			dsGiornoNegozio.setValue(l,8,null);
			dsGiornoNegozio.setValue(l,9,null);
		    continue;
		}
		
		// verifica se lavoratore con regola a zero ore
		var recReg = globals.getRegolaLavoratoreGiorno(arrLavoratori[l-1],giorno);
		if(recReg && recReg.totaleoreperiodo == 0)
			dsGiornoNegozio.setValue(l,15,1);
		
		// recupero dei dati esistenti per la programmazione del giorno
		var recFasciaProg = scopes.giornaliera.getProgrammazioneFasceGiorno(arrLavoratori[l-1],giorno);
		
		// verifica se il giorno è festivo
	    var giornoFestivo = false;
	    if(forms.neg_header_options.vArrGiorniFestivi.indexOf(utils.dateFormat(giorno,globals.ISO_DATEFORMAT)) != -1)
	    	if(globals.getOreFestivitaGoduta(utils.dateFormat(giorno,globals.ISO_DATEFORMAT),arrLavoratori[l - 1]))
			//if(globals.getOreFestivitaDipendente(arrLavoratori[l - 1],giorno,recFasciaProg.idfasciaoraria) != null)
	    	   giornoFestivo = true;
						
		// se non è presente una fascia programmata consideriamo quella a zero ore e la compiliamo automaticamente verificando se sia  anche riposo primario
		if(recFasciaProg == null)
		{	
			// se il giorno è festivo ed il valore delle ore godute è diverso da zero 
			if(giornoFestivo)
			{
				// impostiamo la fascia oraria teorica del dipendente
				var recFasciaTeoricaZero = globals.getFasciaOrariaDaTotaleOre(idDitta,0);
				dsGiornoNegozio.setValue(l,13,recFasciaTeoricaZero.idfasciaoraria);				
			}
			else
				// la fascia oraria teorica è nulla
				dsGiornoNegozio.setValue(l,13,null);
			
			dsGiornoNegozio.setValue(l,9,null);
			dsGiornoNegozio.setValue(l,19,dsGiornoNegozio.getValue(l,9));
						
		}
		// se è una fascia a zero ore (senza avere quindi timbrature programmate) o corrisponde ad un orario inserito
		else 
		{
			/** @type {Number} */
			var oreTeoriche = 0;
			/** @type {Number} */
			var oreProgrammate = 0;//recFasciaProg.e2giornalieraprogfasce_to_e2fo_fasceorarie.totaleorefascia / 100;
			/** @type {Number} */
			var oreFestive = 0;
			
			if(giornoFestivo)
  			   oreFestive = oreTeoriche = globals.getOreFestivitaGoduta(utils.dateFormat(giorno,globals.ISO_DATEFORMAT),arrLavoratori[l - 1]);
			else
			   oreTeoriche = recFasciaProg.e2giornalieraprogfasce_to_e2fo_fasceorarie.totaleorefascia / 100;
			
			if(recFasciaProg.iddittafasciaorariatimbrature != null)
			{				
					// recupero delle informazioni sulla fascia e formattazione della presentazione 
					// mattino : e1-u1
					// pomeriggio : e2-u2
					// giornata completa : e1-u2
					// giornata : e1-u1,e2-u2
					var recFasciaDittaTimbrature = recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature;
					var e1 = recFasciaDittaTimbrature.inizioorario;
					var u1 = recFasciaDittaTimbrature.iniziopausa;
					var e2 = recFasciaDittaTimbrature.finepausa;
					var u2 = recFasciaDittaTimbrature.fineorario;
					
					if(u1 && e2)
					{
						// tutte le 4 timbrature della giornata,2 al mattino e 2 al pomeriggio
						dsGiornoNegozio.setValue(l,4,recFasciaDittaTimbrature.inizio_orario_oremin);
						dsGiornoNegozio.setValue(l,5,recFasciaDittaTimbrature.inizio_pausa_oremin);
						dsGiornoNegozio.setValue(l,6,recFasciaDittaTimbrature.fine_pausa_oremin);
						dsGiornoNegozio.setValue(l,7,recFasciaDittaTimbrature.fine_orario_oremin);
					}
					else
					{
						if(e1 < 1330)
						{
							// caso mattino
							if(u2 != null && u2 <= 1330)
							{
								dsGiornoNegozio.setValue(l,4,recFasciaDittaTimbrature.inizio_orario_oremin);
								dsGiornoNegozio.setValue(l,5,recFasciaDittaTimbrature.fine_orario_oremin);
								dsGiornoNegozio.setValue(l,6,null);
								dsGiornoNegozio.setValue(l,7,null);
							}
							// caso giornata completa
							else
							{
								dsGiornoNegozio.setValue(l,4,recFasciaDittaTimbrature.inizio_orario_oremin);
								dsGiornoNegozio.setValue(l,5,null);
								dsGiornoNegozio.setValue(l,6,null);
								dsGiornoNegozio.setValue(l,7,recFasciaDittaTimbrature.fine_orario_oremin);
							}
						}
						else
						{
							// caso pomeriggio
							dsGiornoNegozio.setValue(l,4,null);
							dsGiornoNegozio.setValue(l,5,null);
							dsGiornoNegozio.setValue(l,6,recFasciaDittaTimbrature.inizio_orario_oremin);
							dsGiornoNegozio.setValue(l,7,recFasciaDittaTimbrature.fine_orario_oremin);
						}
					}
					
					oreProgrammate = recFasciaDittaTimbrature.iniziopausa ? scopes.giornaliera.convertiOrarioInOreCentesimi(recFasciaDittaTimbrature.iniziopausa - recFasciaDittaTimbrature.inizioorario) + 
					                                                        scopes.giornaliera.convertiOrarioInOreCentesimi(recFasciaDittaTimbrature.fineorario - recFasciaDittaTimbrature.finepausa) :
					                                                        scopes.giornaliera.convertiOrarioInOreCentesimi(recFasciaDittaTimbrature.fineorario - recFasciaDittaTimbrature.inizioorario);	
								                                                        
			}
			else
			{
				if(oreTeoriche == 0)
					dsGiornoNegozio.setValue(l,16,recFasciaProg.tiporiposo);
				
			}			
			
			dsGiornoNegozio.setValue(l,8,oreProgrammate > 0 ? oreProgrammate : null);
			dsGiornoNegozio.setValue(l,9,oreTeoriche > 0 ? oreTeoriche : null);
			var deltaOre = oreProgrammate - (oreTeoriche - oreFestive);
			if(deltaOre == 0)
			{
				dsGiornoNegozio.setValue(l,10,null);
				dsGiornoNegozio.setValue(l,11,null);
			}
			else if(deltaOre < 0)
			{
				dsGiornoNegozio.setValue(l,10,-deltaOre);
				dsGiornoNegozio.setValue(l,11,null);
			}
			else
			{
				dsGiornoNegozio.setValue(l,10,null);
				dsGiornoNegozio.setValue(l,11,deltaOre);
			}
			
			dsGiornoNegozio.setValue(l,12,recFasciaProg.iddittafasciaorariatimbrature);
			dsGiornoNegozio.setValue(l,13,recFasciaProg.idfasciaoraria);
			dsGiornoNegozio.setValue(l,18,oreFestive != 0 ? oreFestive : null);
			dsGiornoNegozio.setValue(l,19,oreFestive != 0 ? null : ((oreTeoriche > 0 && oreProgrammate > 0) ? Math.min(oreTeoriche,oreProgrammate) : null));
			
		}
						
	}
	
	// disegno della situazione di programmazione negozio
	var dSGiornoNegozio = dsGiornoNegozio.createDataSource('_giornoNegDataSource_' + idDitta + '_' + utils.dateFormat(giorno,globals.ISO_DATEFORMAT) + '_' + numLavoratori,types);
	globals.disegnaProgrammazioneGiornoNegozio(dSGiornoNegozio,idDitta,giorno,numLavoratori);
	frm.vGiorno = giorno;
	frm.vIndexSettimana = settimana;
	if(openNewDialog)
	{
	   frm.vArrIndexSettimaneModificate = [];	
	   frm.vArrGiorniModificati = [];
	   globals.ma_utl_showFormInDialog(frm.controller.getName(),'Modifica programmazione del giorno');
	}
}

/**
 * @param {Number} indice
 * 
 * @properties={typeid:24,uuid:"D86E7A64-B9B5-4A48-8B20-89CA16768882"}
 */
function aggiornaTotaleOreGiornata(indice)
{
	var frm = forms.neg_prog_settimana_tab;
	var fs = forms['neg_prog_settimana_tbl_temp'].foundset;
	var num_dip = fs.getSize();
	
	var varName = 'vTotOre_' + indice;
	
	frm[varName] = 0;
	
	for(var l = 1; l <= num_dip; l++)
	{
		fs.setSelectedIndex(l);
		frm[varName] += fs['ore_programmato_' + indice];
	}
	
}

/**
 * Restituisce il totale delle ore programmate nel corso della settimana per il lavoratore
 * alla riga corrispondente al valore del parametro indice
 * 
 * @param indice
 *
 * @properties={typeid:24,uuid:"8F9BB8AE-F06E-49E2-8240-B75A903C60F7"}
 */
function getTotaleOreProgrammateSettimana(indice)
{
	var fs = forms['neg_prog_settimana_tbl_temp'].foundset;
	
	var totOre = 0;
	
	for(var g = 1; g <= 7; g++)
	{
		fs.setSelectedIndex(indice);
		totOre += fs['ore_programmato_' + g]
	}
	
	return totOre;
}

/**
 * Prepara i dati necessari alla visualizzazione degli orari della settimana specificata
 *  
 * @param {Number} idDitta
 * @param {Array<Number>} arrLavoratori
 * @param {Number} settimana
 * @param {Number} [selIndex]
 * @param {Boolean} [fromCopertura]
 * 
 * @properties={typeid:24,uuid:"8907CA93-4921-41CB-B6D6-37ADF7B0B063"}
 */
function preparaProgrammazioneSettimanaNegozio(idDitta,arrLavoratori,settimana,selIndex,fromCopertura)
{
	// form che gestisce l'inserimento settimanale
    var frm = forms.neg_prog_settimana_tab;
	    
    // numero lavoratori da visualizzare
    var numLavoratori = arrLavoratori.length;
    
    // primo giorno della settimana ed impostazione variabile di form per successivo recupero giorno da salvare
    var primoGgSett = globals.getDateOfISOWeek(settimana,globals.getAnno());
    frm.vPrimoGiornoSettimana = primoGgSett;
    frm.vIndexSettimana = settimana;
    frm.vFromCopertura = fromCopertura != null ? fromCopertura : false;
    
	// creazione dataset con colonne necessarie
	var types = [JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.TEXT];
	var columns = ['idlavoratore','codice','nominativo'];
	var stdColNumber = 3;
	var dsGiornoNegozio = databaseManager.createEmptyDataSet(numLavoratori,columns);
	
	for(var g = 1 ; g <= 7; g++)
	{
		types.push(JSColumn.TEXT);
		dsGiornoNegozio.addColumn('e1_' + g, stdColNumber + 14 * (g - 1) + 1, JSColumn.TEXT);
			
		types.push(JSColumn.TEXT);
		dsGiornoNegozio.addColumn('u1_' + g, stdColNumber + 14 * (g - 1) + 2, JSColumn.TEXT);
		
		types.push(JSColumn.TEXT);
		dsGiornoNegozio.addColumn('e2_' + g, stdColNumber + 14 * (g - 1) + 3, JSColumn.TEXT);
			
		types.push(JSColumn.TEXT);
		dsGiornoNegozio.addColumn('u2_' + g, stdColNumber + 14 * (g - 1) + 4, JSColumn.TEXT);
			
		// campi standard di riepilogo giorno
		types.push(JSColumn.NUMBER);
		dsGiornoNegozio.addColumn('ore_programmato_' + g,stdColNumber + 14 * (g - 1) + 5,JSColumn.NUMBER);
		types.push(JSColumn.NUMBER);
		dsGiornoNegozio.addColumn('ore_teorico_' + g,stdColNumber + 14 * (g - 1) + 6,JSColumn.NUMBER);
		types.push(JSColumn.NUMBER);
		dsGiornoNegozio.addColumn('ore_assenza_' + g,stdColNumber + 14 * (g - 1) + 7,JSColumn.NUMBER);
		types.push(JSColumn.NUMBER);
		dsGiornoNegozio.addColumn('ore_straordinario_' + g,stdColNumber + 14 * (g - 1) + 8,JSColumn.NUMBER)
		types.push(JSColumn.NUMBER);
		dsGiornoNegozio.addColumn('id_ditta_fascia_oraria_timbrature_' + g,stdColNumber + 14 * (g - 1) + 9,JSColumn.NUMBER);
		types.push(JSColumn.NUMBER);
		dsGiornoNegozio.addColumn('id_fascia_oraria_' + g,stdColNumber + 14 * (g - 1) + 10,JSColumn.NUMBER);
		types.push(JSColumn.NUMBER);
		dsGiornoNegozio.addColumn('modificato_' + g,stdColNumber + 14 * (g - 1) + 11,JSColumn.NUMBER);
		types.push(JSColumn.NUMBER);
		dsGiornoNegozio.addColumn('regola_zero_ore_' + g,stdColNumber + 14 * (g - 1) + 12,JSColumn.NUMBER);
		types.push(JSColumn.NUMBER);
		dsGiornoNegozio.addColumn('tipo_riposo_' + g,stdColNumber + 14 * (g - 1) + 13,JSColumn.NUMBER);
		types.push(JSColumn.NUMBER);
		dsGiornoNegozio.addColumn('non_attivo_' + g,stdColNumber + 14 * (g - 1) + 14,JSColumn.NUMBER);
	}
	
	types.push(JSColumn.NUMBER);
	dsGiornoNegozio.addColumn('ore_programmate',dsGiornoNegozio.getMaxColumnIndex() + 1,JSColumn.NUMBER);
		
	// compilazione del dataset ad hoc per presentazione 
	for(var l = 1; l <= numLavoratori; l++)
	{	
		for(var i = 1; i <= dsGiornoNegozio.getMaxColumnIndex(); i++)
		{
			//compilazione di default a null
			dsGiornoNegozio.setValue(l,i,null);
		}
		
		dsGiornoNegozio.setValue(l,1,arrLavoratori[l-1]);
		dsGiornoNegozio.setValue(l,2,globals.getCodLavoratore(arrLavoratori[l-1]));
		dsGiornoNegozio.setValue(l,3,globals.getNominativo(arrLavoratori[l-1]));
		
		for(g = 1; g <= 7; g++)
		{
			dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 6,null);
			dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 13,0);
			
			// verifica se lavoratore non ancora assunto o già cessato
			var dataAss = globals.getDataAssunzione(arrLavoratori[l - 1]); 
			var dataCess = globals.getDataCessazione(arrLavoratori[l - 1]);
			var giorno = new Date(primoGgSett.getFullYear(),primoGgSett.getMonth(),primoGgSett.getDate() + (g - 1));
			if( dataAss > giorno || dataCess != null && dataCess < giorno)
			   dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 14,1);	
			
			// verifica se lavoratore con regola a zero ore
			var recReg = globals.getRegolaLavoratoreGiorno(arrLavoratori[l-1],giorno);
			if(recReg && recReg.totaleoreperiodo == 0)
				dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 12,1);
			
			// recupero dei dati esistenti per la programmazione del giorno
			var recFasciaProg = scopes.giornaliera.getProgrammazioneFasceGiorno(arrLavoratori[l-1],giorno);
			// se non è presente una fascia programmata consideriamo quella a zero ore
			// e la compiliamo automaticamente verificando se sia  anche riposo primario
			if(recFasciaProg == null)
			{	
				// se il giorno è festivo
				if(forms.neg_header_options.vArrGiorniFestivi.indexOf(giorno) != -1)
				{
					if(globals.getOreFestivitaGoduta(utils.dateFormat(giorno,globals.ISO_DATEFORMAT),arrLavoratori[l - 1]))
					{
					  var recFasciaTeoricaNull = globals.getFasciaTeoricaGiorno(arrLavoratori[l - 1],giorno);
					  // impostiamo la fascia oraria teorica del dipendente
					  dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 10,recFasciaTeoricaNull.idfasciaoraria);
					  dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 6,(recFasciaTeoricaNull.totaleorefascia / 100).toFixed(2));
					  // le fasce della giornaliera devono essere necessariamente programmate
					  dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 11,0);
					}
				}
				else
				{
					// impostiamo la fascia oraria a zero ore
					dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 10,globals.getFasciaOrariaDaTotaleOre(idDitta ? idDitta : globals.getDitta(arrLavoratori[l - 1]),0).idfasciaoraria);
					dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 5,null);
					dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 6,null);
					// le fasce della giornaliera devono essere necessariamente programmate
					dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 11,0);
						
				}
			}
			// se è una fascia a zero ore verifichiamo l'eventuale tipo di riposo della giornata
			else if(recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature == null)
			{
				// se il giorno è festivo
				if(forms.neg_header_options.vArrGiorniFestivi.indexOf(giorno) != -1)
				{	
				   if(globals.isFestivitaGodutaLavoratore(utils.dateFormat(giorno,globals.ISO_DATEFORMAT),arrLavoratori[l - 1]))
                   {
                   	   var recFasciaTeorica = globals.getFasciaTeoricaGiorno(arrLavoratori[l - 1],giorno);
					   // impostiamo la fascia oraria teorica del dipendente
					   dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 10,recFasciaTeorica.idfasciaoraria);
					   dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 5,0);
					   dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 6,(recFasciaTeorica.totaleorefascia / 100));
					   // le fasce della giornaliera devono essere necessariamente programmate
					   dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 11,0);
				   }
				}
				else
				{
					// impostiamo la fascia oraria a zero ore
					dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 10,globals.getFasciaOrariaDaTotaleOre(idDitta ? idDitta : globals.getDitta(arrLavoratori[l - 1]),0).idfasciaoraria);
					// le fasce della giornaliera devono essere necessariamente programmate
					dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 11,0);
					dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 5,0);
					// eventuale tipo di riposo
				    dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 13,recFasciaProg.tiporiposo);
				}
			}
			// altrimenti recuperiamo i dati esistenti
			else
			{
				// recupero delle informazioni sulla fascia e formattazione della presentazione 
				// mattino : e1-u1
				// pomeriggio : e2-u2
				// giornata completa : e1-u2
				// giornata : e1-u1,e2-u2
				var recFasciaDittaTimbrature = recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature;
				var e1 = recFasciaDittaTimbrature.inizioorario;
				var u1 = recFasciaDittaTimbrature.iniziopausa;
				var e2 = recFasciaDittaTimbrature.finepausa;
				var u2 = recFasciaDittaTimbrature.fineorario;
				
				if(u1 && e2)
				{
					// tutte le 4 timbrature della giornata,2 al mattino e 2 al pomeriggio
					dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 1,recFasciaDittaTimbrature.inizio_orario_oremin);
					dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 2,recFasciaDittaTimbrature.inizio_pausa_oremin);
					dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 3,recFasciaDittaTimbrature.fine_pausa_oremin);
					dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 4,recFasciaDittaTimbrature.fine_orario_oremin);
				}
				else
				{
					if(e1 < 1330)
					{
						// caso mattino
						if(u2 != null && u2 <= 1330)
						{
							dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 1,recFasciaDittaTimbrature.inizio_orario_oremin);
							dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 2,recFasciaDittaTimbrature.fine_orario_oremin);
							dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 3,null);
							dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 4,null);
						}
						// caso giornata completa
						else
						{
							dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 1,recFasciaDittaTimbrature.inizio_orario_oremin);
							dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 2,null);
							dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 3,null);
							dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 4,recFasciaDittaTimbrature.fine_orario_oremin);
						}
					}
					else
					{
						// caso pomeriggio
						dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 1,null);
						dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 2,null);
						dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 3,recFasciaDittaTimbrature.inizio_orario_oremin);
						dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 4,recFasciaDittaTimbrature.fine_orario_oremin);
						
					}
				}
								
				dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 5,recFasciaDittaTimbrature.iniziopausa ? 
						scopes.giornaliera.convertiOrarioInOreCentesimi(recFasciaDittaTimbrature.iniziopausa - recFasciaDittaTimbrature.inizioorario) + 
                        scopes.giornaliera.convertiOrarioInOreCentesimi(recFasciaDittaTimbrature.fineorario - recFasciaDittaTimbrature.finepausa) :
                        scopes.giornaliera.convertiOrarioInOreCentesimi(recFasciaDittaTimbrature.fineorario - recFasciaDittaTimbrature.inizioorario));
								
				dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 6,(recFasciaProg.e2giornalieraprogfasce_to_e2fo_fasceorarie.totaleorefascia / 100))//.toFixed(2));
				
				// se il giorno è festivo gestiamo il valore delle ore di assenza e di straordinario
				if(forms.neg_header_options.vArrGiorniFestivi.indexOf(giorno) != -1)
				{
					if(globals.isFestivitaGodutaLavoratore(utils.dateFormat(giorno,globals.ISO_DATEFORMAT),arrLavoratori[l - 1]))
				    {
						dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 7,0);
						dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 8,dsGiornoNegozio.getValue(l,stdColNumber + 14 * (g - 1) + 5));
				    }
				}
				else
				{
					// precompilazione delle ore di assenza e/o straordinario a partire dalla differenza tra teorico ed ore effettive
					dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 7,(dsGiornoNegozio.getValue(l,stdColNumber + 14 * (g - 1) + 6) - dsGiornoNegozio.getValue(l,stdColNumber + 14 * (g - 1) + 5) > 0) ? 
					                               dsGiornoNegozio.getValue(l,stdColNumber + 14 * (g - 1) + 6) - dsGiornoNegozio.getValue(l,stdColNumber + 14 * (g - 1) + 5) : null);
					dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 8,(dsGiornoNegozio.getValue(l,stdColNumber + 14 * (g - 1) + 5) - dsGiornoNegozio.getValue(l,stdColNumber + 14 * (g - 1) + 6) > 0) ?
					                               dsGiornoNegozio.getValue(l,stdColNumber + 14 * (g - 1) + 5) - dsGiornoNegozio.getValue(l,stdColNumber + 14 * (g - 1) + 6) : null);
				
				}
				dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 9,recFasciaProg.iddittafasciaorariatimbrature);
				dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 10,recFasciaProg.idfasciaoraria);
				dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 11,0);
				dsGiornoNegozio.setValue(l,stdColNumber + 14 * (g - 1) + 12,recFasciaProg.tiporiposo);
				dsGiornoNegozio.setValue(l,dsGiornoNegozio.getMaxColumnIndex(),dsGiornoNegozio.getValue(l,dsGiornoNegozio.getMaxColumnIndex()) + dsGiornoNegozio.getValue(l,stdColNumber + 14 * (g - 1) + 5));
			}
						
		}		
	}
			
	// disegno della situazione di programmazione negozio
	globals.disegnaProgrammazioneSettimanaNegozio(dsGiornoNegozio,idDitta,settimana,numLavoratori,selIndex);
	
	for(g = 1; g <= 7; g++)
	{
		// aggiorniamo il riepilogo delle ore relative al giorno g della settimana
		aggiornaTotaleOreGiornata(g);
	}
	
	var formTitle = 'Modifica programmazione della settimana ' + settimana + ' dal ' + utils.dateFormat(primoGgSett,globals.EU_DATEFORMAT) +
	                ' al ' + utils.dateFormat(new Date(primoGgSett.getFullYear(),primoGgSett.getMonth(),primoGgSett.getDate() + 6),globals.EU_DATEFORMAT);
	globals.ma_utl_showFormInDialog(frm.controller.getName()
		                            ,formTitle
									,null
									,false
									,frm.controller.getFormWidth()
									,Math.max(solutionModel.getForm(frm.controller.getName()).getFooterPart().height 
										      ,125 + arrLavoratori.length * 20));
}

/**
 * @param {String} dSource
 * @param {Number} idDitta
 * @param {Date} giorno
 * @param {Number} numDip
 * 
 * @properties={typeid:24,uuid:"ED861926-F2E3-410B-A655-C3336C5427A6"}
 */
function disegnaProgrammazioneGiornoNegozio(dSource,idDitta,giorno,numDip)
{
	var frmNewName = 'neg_prog_giorno_tbl_temp';
	
	forms.neg_prog_giorno_tab.elements.tab_prog_giorno.removeAllTabs();
	if(forms[frmNewName])
	{
		history.removeForm(frmNewName);
	    solutionModel.removeForm(frmNewName);
	}
		
	var dxCodice = 50;
	var dxNominativo = 220;
	var dxTimbr = 65;
	var dxOre = 65;
	var dyLbl = 30;
	var dyFld = 20;
	
	var frmNeg = solutionModel.newForm(frmNewName,dSource,'leaf_style_table',false,dxCodice + dxNominativo + dxTimbr * 4 + dxOre * 6,20 * (numDip + 1));
	frmNeg.navigator = SM_DEFAULTS.NONE;
	frmNeg.view = JSForm.LOCKED_TABLE_VIEW;
	frmNeg.scrollbars = SM_SCROLLBAR.HORIZONTAL_SCROLLBAR_AS_NEEDED | SM_SCROLLBAR.VERTICAL_SCROLLBAR_AS_NEEDED;
//	var frmVarGiorno = frmNeg.newVariable('vGiorno',JSVariable.DATETIME);
//	frmVarGiorno.defaultValue = 'giorno';
	
	// codice lavoratore
	var fldCodice = frmNeg.newTextField('codice',0,dyLbl,dxCodice,dyFld);
	fldCodice.dataProviderID = 'codice';
	fldCodice.name = 'fld_codice';
	fldCodice.styleClass = 'table';
	fldCodice.horizontalAlignment = SM_ALIGNMENT.CENTER;
	fldCodice.visible = false;
	fldCodice.onRender = solutionModel.getGlobalMethod('globals','onRenderGiornoNegozio');
	fldCodice.tabSeq = SM_DEFAULTS.IGNORE;
	var lblCodice = frmNeg.newLabel('Codice',0,0,dxCodice,dyLbl);
	lblCodice.name = 'lbl_codice';
	lblCodice.labelFor = fldCodice.name;
	lblCodice.styleClass = 'table_header';
	lblCodice.visible = false;
	
	// nominativo
	var fldNominativo = frmNeg.newTextField('nominativo',dxCodice,dyLbl,dxNominativo,dyFld);
	fldNominativo.dataProviderID = 'nominativo';
	fldNominativo.name = 'fld_nominativo';
	fldNominativo.styleClass = 'table';
	fldNominativo.onRender = solutionModel.getGlobalMethod('globals','onRenderGiornoNegozio');
	fldNominativo.enabled = false;
	fldNominativo.tabSeq = SM_DEFAULTS.IGNORE;
	var lblNominativo = frmNeg.newLabel('Nominativo',dxCodice,0,dxNominativo,dyLbl);
	lblNominativo.name = 'lbl_nominativo';
	lblNominativo.labelFor = fldNominativo.name;
	lblNominativo.styleClass = 'table_header';
        
	// 2 coppie entrata/uscita standard
	var fldE1 = frmNeg.newTextField('e1',dxCodice + dxNominativo,dyLbl,dxTimbr,dyFld);
	fldE1.dataProviderID = 'e1';
	fldE1.name = 'fld_e1';
	fldE1.styleClass = 'table';
	fldE1.format = '##.##|mask';
	fldE1.onDataChange = solutionModel.getGlobalMethod('globals','onDataChangeTimbr');
	fldE1.horizontalAlignment = SM_ALIGNMENT.CENTER;
	fldE1.onRender = solutionModel.getGlobalMethod('globals','onRenderGiornoNegozio');
	var lblE1 = frmNeg.newLabel('Entrata',dxCodice + dxNominativo,0,dxTimbr,dyLbl);
	lblE1.name = 'lbl_e1';
	lblE1.labelFor = fldE1.name;
	lblE1.styleClass = 'table_header';
	lblE1.horizontalAlignment = SM_ALIGNMENT.CENTER;
		
    var fldU1 = frmNeg.newTextField('u1',dxCodice + dxNominativo + dxTimbr,dyLbl,dxTimbr,dyFld);
	fldU1.dataProviderID = 'u1';
	fldU1.name = 'fld_u1';
	fldU1.styleClass = 'table';
	fldU1.format = '##.##|mask';
	fldU1.onDataChange = solutionModel.getGlobalMethod('globals','onDataChangeTimbr'); 
	fldU1.horizontalAlignment = SM_ALIGNMENT.CENTER;
	fldU1.onRender = solutionModel.getGlobalMethod('globals','onRenderGiornoNegozio');
	var lblU1 = frmNeg.newLabel('Uscita',dxCodice + dxNominativo + dxTimbr,0,dxTimbr,dyLbl);
	lblU1.name = 'lbl_u1';
	lblU1.labelFor = fldU1.name;
	lblU1.styleClass = 'table_header';
	lblU1.horizontalAlignment = SM_ALIGNMENT.CENTER;
		
	var fldE2 = frmNeg.newTextField('e2',dxCodice + dxNominativo + dxTimbr * 2,dyLbl,dxTimbr,dyFld);
	fldE2.dataProviderID = 'e2';
	fldE2.name = 'fld_e2';
	fldE2.format = '##.##|mask';
	fldE2.styleClass = 'table';
	fldE2.onDataChange = solutionModel.getGlobalMethod('globals','onDataChangeTimbr');
	fldE2.horizontalAlignment = SM_ALIGNMENT.CENTER;
	fldE2.onRender = solutionModel.getGlobalMethod('globals','onRenderGiornoNegozio');
	var lblE2 = frmNeg.newLabel('Entrata',dxCodice + dxNominativo + dxTimbr * 2,0,dxTimbr,dyLbl);
	lblE2.name = 'lbl_e2';
	lblE2.labelFor = fldE2.name;
	lblE2.styleClass = 'table_header';
	lblE2.horizontalAlignment = SM_ALIGNMENT.CENTER;
	
	var fldU2 = frmNeg.newTextField('u2',dxCodice + dxNominativo + dxTimbr * 3,dyLbl,dxTimbr,dyFld);
	fldU2.dataProviderID = 'u2';
	fldU2.name = 'fld_u2';
	fldU2.format = '##.##|mask';
	fldU2.styleClass = 'table';
	fldU2.onDataChange = solutionModel.getGlobalMethod('globals','onDataChangeTimbr');
	fldU2.horizontalAlignment = SM_ALIGNMENT.CENTER;
	fldU2.onRender = solutionModel.getGlobalMethod('globals','onRenderGiornoNegozio');
	var lblU2 = frmNeg.newLabel('Uscita',dxCodice + dxNominativo + dxTimbr * 3,0,dxTimbr,dyLbl);
	lblU2.name = 'lbl_u2';
	lblU2.labelFor = fldU2.name;
	lblU2.styleClass = 'table_header';
	lblU2.horizontalAlignment = SM_ALIGNMENT.CENTER;
		
	// ore totali giorno
	var fldOreGiorno = frmNeg.newTextField('ore_programmato',dxCodice + dxNominativo + dxTimbr * 4,dyLbl,dxOre,dyFld);
	fldOreGiorno.dataProviderID = 'ore_programmato';
	fldOreGiorno.name = 'fld_ore_programmato';
	fldOreGiorno.styleClass = 'table';
	fldOreGiorno.horizontalAlignment = SM_ALIGNMENT.CENTER;
	fldOreGiorno.editable = false;
	fldOreGiorno.enabled = false;
	fldOreGiorno.background = '#c8c8c8';
	fldOreGiorno.onRender = solutionModel.getGlobalMethod('globals','onRenderGiornoNegozio');
	var lblOreGiorno = frmNeg.newLabel('Progr.',dxCodice + dxNominativo + dxTimbr * 4,0,dxOre,dyLbl);
	lblOreGiorno.name = 'lbl_ore_periodo';
	lblOreGiorno.labelFor = fldOreGiorno.name;
	lblOreGiorno.styleClass = 'table_header';
	lblOreGiorno.horizontalAlignment = SM_ALIGNMENT.CENTER;
		
	// ore teoriche giorno
	var fldOre = frmNeg.newTextField('ore_teorico',dxCodice + dxNominativo + dxTimbr * 4 + dxOre,dyLbl,dxOre,dyFld);
	fldOre.dataProviderID = 'ore_teorico';
	fldOre.name = 'fld_ore_teorico';
	fldOre.styleClass = 'table';
	fldOre.horizontalAlignment = SM_ALIGNMENT.CENTER;
	fldOre.editable = true;
	var _editable = (globals.ma_utl_hasKey(globals.Key.ADMIN_NEG) || !isFestivitaGoduta(globals.dateFormat(giorno,globals.ISO_DATEFORMAT).toString())); 
	fldOre.enabled = true;
	fldOre.editable = _editable;
	fldOre.onDataChange = solutionModel.getGlobalMethod('globals','onDataChangeOreTeoricheGiorno');
	fldOre.onRender = solutionModel.getGlobalMethod('globals','onRenderGiornoNegozio');
	fldOre.toolTipText = _editable == true ? '' : 'Non è possibile modificare le ore teoriche per un giorno festivo';
	var lblOre = frmNeg.newLabel('Teorico',dxCodice + dxNominativo + dxTimbr * 4 + dxOre,0,dxOre,dyLbl) ;
	lblOre.name = 'lbl_ore_teoriche_giorno';
	lblOre.labelFor = fldOre.name;
	lblOre.styleClass = 'table_header';
	lblOre.horizontalAlignment = SM_ALIGNMENT.CENTER;
	
	// ore ordinarie giorno
	var fldOreOrd = frmNeg.newTextField('ore_ordinario',dxCodice + dxNominativo + dxTimbr * 4 + dxOre * 2,dyLbl,dxOre,dyFld);
	fldOreOrd.dataProviderID = 'ore_ordinario';
	fldOreOrd.name = 'fld_ore_ordinario';
	fldOreOrd.styleClass = 'table';
	fldOreOrd.horizontalAlignment = SM_ALIGNMENT.CENTER;
	fldOreOrd.editable = false;
	fldOreOrd.enabled = false;
	fldOreOrd.background = '#c8c8c8';
	fldOreOrd.onRender = solutionModel.getGlobalMethod('globals','onRenderGiornoNegozio');
	var lblOreOrd = frmNeg.newLabel('Ordinarie',dxCodice + dxNominativo + dxTimbr * 4 +  dxOre * 2,0,dxOre,dyLbl);
	lblOreOrd.name = 'lbl_ore_ordinarie';
	lblOreOrd.labelFor = fldOreOrd.name;
	lblOreOrd.styleClass = 'table_header';
	lblOreOrd.horizontalAlignment = SM_ALIGNMENT.CENTER;
	
	// ore festive giorno
	var fldOreFestive = frmNeg.newTextField('ore_festivo',dxCodice + dxNominativo + dxTimbr * 4 + dxOre * 3,dyLbl,dxOre,dyFld);
	fldOreFestive.dataProviderID = 'ore_festivo';
	fldOreFestive.name = 'fld_ore_festivo';
	fldOreFestive.styleClass = 'table';
	fldOreFestive.horizontalAlignment = SM_ALIGNMENT.CENTER;
	fldOreFestive.enabled = false;
	fldOreFestive.background = '#c8c8c8';
//	fldOreFestive.onDataChange = solutionModel.getGlobalMethod('globals','onDataChangeOreTeoricheGiorno');
	fldOreFestive.onRender = solutionModel.getGlobalMethod('globals','onRenderGiornoNegozio');
	var lblOreFestive = frmNeg.newLabel('Festivo',dxCodice + dxNominativo + dxTimbr * 4 + dxOre * 3,0,dxOre,dyLbl) ;
	lblOreFestive.name = 'lbl_ore_festivo';
	lblOreFestive.labelFor = fldOreFestive.name;
	lblOreFestive.styleClass = 'table_header';
	lblOreFestive.horizontalAlignment = SM_ALIGNMENT.CENTER;
	
	// ore assenza giorno
	var fldOreAssenza = frmNeg.newTextField('ore_assenza',dxCodice + dxNominativo + dxTimbr * 4 + dxOre * 4,dyLbl,dxOre,dyFld);
	fldOreAssenza.dataProviderID = 'ore_assenza';
	fldOreAssenza.name = 'fld_ore_assenza';
	fldOreAssenza.styleClass = 'table';
	fldOreAssenza.horizontalAlignment = SM_ALIGNMENT.CENTER;
	fldOreAssenza.enabled = false;
	fldOreAssenza.background = '#c8c8c8';
	fldOreAssenza.onRender = solutionModel.getGlobalMethod('globals','onRenderGiornoNegozio');
	var lblOreAssenza = frmNeg.newLabel('Assenza',dxCodice + dxNominativo + dxTimbr * 4 + dxOre * 4,0,dxOre,dyLbl);
	lblOreAssenza.name = 'lbl_ore_assenza';
	lblOreAssenza.labelFor = fldOreAssenza.name;
	lblOreAssenza.horizontalAlignment = SM_ALIGNMENT.CENTER;
	lblOreAssenza.styleClass = 'table_header';
				    
	// ore straordinario giorno
	var fldOreStraordinario = frmNeg.newTextField('ore_straordinario',dxCodice + dxNominativo + dxTimbr * 4 + dxOre * 5,dyLbl,dxOre,dyFld);
	fldOreStraordinario.dataProviderID = 'ore_straordinario';
	fldOreStraordinario.name = 'fld_ore_straordinario';
	fldOreStraordinario.styleClass = 'table';
	fldOreStraordinario.horizontalAlignment = SM_ALIGNMENT.CENTER;
	fldOreStraordinario.enabled = false;
	fldOreStraordinario.background = '#c8c8c8';
	fldOreStraordinario.onRender = solutionModel.getGlobalMethod('globals','onRenderGiornoNegozio');
	var lblOreStraordinario = frmNeg.newLabel('Straord.',dxCodice + dxNominativo + dxTimbr * 4 + dxOre * 5,0,dxOre,dyLbl);
	lblOreStraordinario.name = 'lbl_ore_straordinario';
	lblOreStraordinario.labelFor = fldOreStraordinario.name;
	lblOreStraordinario.styleClass = 'table_header';
	lblOreStraordinario.horizontalAlignment = SM_ALIGNMENT.CENTER;
		
	forms.neg_prog_giorno_tab.elements.lbl_header.text = 'Giorno : ' + globals.getNomeInteroGiorno(giorno) + ' ' + globals.getNumGiorno(giorno) + '/' + 
	                                                     globals.getNumMese(giorno.getMonth() + 1) + '/' + giorno.getFullYear();
	forms.neg_prog_giorno_tab.elements.tab_prog_giorno.addTab(frmNewName);

}

/**
 * @param {JSDataSet} dSet
 * @param {Number} idDitta
 * @param {Number} settimana
 * @param {Number} numDip
 * @param {Number} [selIndex]
 * 
 * @properties={typeid:24,uuid:"30DC8413-1533-4B51-B331-BCD7CAFA1D64"}
 */
function disegnaProgrammazioneSettimanaNegozio(dSet,idDitta,settimana,numDip,selIndex)
{
    var frmNewName = 'neg_prog_settimana_tbl_temp';
	
	forms.neg_prog_settimana_tab.elements.tab_prog_settimana.removeAllTabs();
	
	if(forms[frmNewName])
	{
		history.removeForm(frmNewName);
	    solutionModel.removeForm(frmNewName);
	}
		
	var dxCodice = 0;
	var dxNominativo = 170;
	var dxTimbr = 32;
	var dyLbl = 20;
	var dyFld = 20;
	var types = [JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.TEXT,
				JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				JSColumn.NUMBER];
    var dset = dSet.createDataSource(application.getUUID().toString(),types);
	 
	var frmNeg = solutionModel.newForm(frmNewName,dset,'leaf_style_table',false,dxCodice + dxNominativo + dxTimbr * 28,20 * (numDip + 1));
	frmNeg.navigator = SM_DEFAULTS.NONE;
	frmNeg.view = JSForm.RECORD_VIEW;
	frmNeg.scrollbars = SM_SCROLLBAR.HORIZONTAL_SCROLLBAR_NEVER | SM_SCROLLBAR.VERTICAL_SCROLLBAR_NEVER;//SM_SCROLLBAR.HORIZONTAL_SCROLLBAR_AS_NEEDED | SM_SCROLLBAR.VERTICAL_SCROLLBAR_AS_NEEDED;
	
	// creazione labels intestazione
	for(var _g = 1; _g <= 7; _g++)
	{
	//	var lblCodice = frmNeg.newLabel('Codice',0,0,dxCodice,dyLbl);
	//	lblCodice.name = 'lbl_codice';
	//	lblCodice.labelFor = fldCodice.name;
	//	lblCodice.styleClass = 'table_header';
	//	lblCodice.visible = false;
		
		var lblNominativo = frmNeg.newLabel('Nominativo',dxCodice,0,dxNominativo,dyLbl);
		lblNominativo.name = 'lbl_nominativo';
		lblNominativo.styleClass = 'table_header';
	
		var lblE1 = frmNeg.newLabel('E1',dxCodice + dxNominativo + (5 * (_g - 1)) * dxTimbr,0,dxTimbr,dyLbl);
		lblE1.name = 'lbl_e1_' + _g;
		lblE1.styleClass = 'table_header';
		lblE1.horizontalAlignment = SM_ALIGNMENT.CENTER;
	
		var lblU1 = frmNeg.newLabel('U1',dxCodice + dxNominativo + (5 * (_g - 1) + 1) * dxTimbr,0,dxTimbr,dyLbl);
		lblU1.name = 'lbl_u1_' + _g;
		lblU1.styleClass = 'table_header';
		lblU1.horizontalAlignment = SM_ALIGNMENT.CENTER;
	
		var lblE2 = frmNeg.newLabel('E2',dxCodice + dxNominativo + (5 * (_g - 1) + 2) * dxTimbr,0,dxTimbr,dyLbl);
		lblE2.name = 'lbl_e2_' + _g;
		lblE2.styleClass = 'table_header';
		lblE2.horizontalAlignment = SM_ALIGNMENT.CENTER;
	
		var lblU2 = frmNeg.newLabel('U2',dxCodice + dxNominativo + (5 * (_g - 1) + 3) * dxTimbr,0,dxTimbr,dyLbl);
		lblU2.name = 'lbl_u2_' + _g;
		lblU2.styleClass = 'table_header';
		lblU2.horizontalAlignment = SM_ALIGNMENT.CENTER;
		
		var lblOreGiorno = frmNeg.newLabel('Ore',dxCodice + dxNominativo + (5 * (_g - 1) + 4) * dxTimbr,0,dxTimbr,dyLbl);
		lblOreGiorno.name = 'lbl_ore_periodo_' + _g;
		lblOreGiorno.styleClass = 'table_header';
		lblOreGiorno.horizontalAlignment = SM_ALIGNMENT.CENTER;
	}
    var lblOreProgrammate = frmNeg.newLabel('Tot.',dxCodice + dxNominativo + (5 * (_g - 1)) * dxTimbr,0,dxTimbr,dyLbl);
	lblOreProgrammate.name = 'lbl_ore_programmate';
	lblOreProgrammate.styleClass = 'table_header';
	lblOreProgrammate.horizontalAlignment = SM_ALIGNMENT.CENTER;
	
//	var frmVarGiorno = frmNeg.newVariable('vGiorno',JSVariable.DATETIME);
//	frmVarGiorno.defaultValue = 'giorno';
		
	for(var l = 1; l <= numDip; l++)
	{
		// codice lavoratore
		var varCodice = frmNeg.newVariable('codice_' + l,JSVariable.TEXT,"\"" + dSet.getValue(l,2) + "\"");
		var fldCodice = frmNeg.newTextField(varCodice.name,0,l * dyLbl,dxCodice,dyFld);
		fldCodice.styleClass = 'table';
		fldCodice.horizontalAlignment = SM_ALIGNMENT.CENTER;
		fldCodice.visible = false;
        fldCodice.tabSeq = SM_DEFAULTS.IGNORE;
		
		// nominativo
		var varNominativo = frmNeg.newVariable('nominativo_' + l,JSVariable.TEXT,"\"" + dSet.getValue(l,3) + "\"");
		var fldNominativo = frmNeg.newTextField(varNominativo.name,dxCodice,l * dyLbl,dxNominativo,dyFld);
		fldNominativo.styleClass = 'table';
		fldNominativo.enabled = false;
	    
		for(var g = 1; g <= 7; g++)
		{
			// otteniamo la data del giorno interessato 
			var currGiorno = new Date(forms.neg_prog_settimana_tab.vPrimoGiornoSettimana.getFullYear(),
	                                  forms.neg_prog_settimana_tab.vPrimoGiornoSettimana.getMonth(),
				                      forms.neg_prog_settimana_tab.vPrimoGiornoSettimana.getDate() + g - 1);

			// eventuali eventi in giornaliera di budget
			var recGiornBudget = globals.getRecGiornaliera(dSet.getValue(l,1),currGiorno,globals.TipoGiornaliera.BUDGET);
			var haRichiesta = (recGiornBudget 
					           && recGiornBudget.e2giornaliera_to_e2giornalieraeventi
							   && recGiornBudget.e2giornaliera_to_e2giornalieraeventi.idevento) ? true : false;
			
			var isGiornoChiusura = (currGiorno  == globals.getChristmas(forms.neg_prog_settimana_tab.vPrimoGiornoSettimana.getFullYear()) 
									|| currGiorno == globals.getBoxingDay(forms.neg_prog_settimana_tab.vPrimoGiornoSettimana.getFullYear()) 
									|| currGiorno == globals.getFirstYearDay(forms.neg_prog_settimana_tab.vPrimoGiornoSettimana.getFullYear())
									|| currGiorno == globals.getFirstYearDay(forms.neg_prog_settimana_tab.vPrimoGiornoSettimana.getFullYear() + 1));
		    			
			// 2 coppie entrata/uscita standard
			var varE1 = frmNeg.newVariable('e1_' + l + '_' + g,JSVariable.TEXT,"'" + dSet.getValue(l,4 + 14 * (g - 1)) +"'");
			var fldE1 = frmNeg.newTextField(varE1.name,dxCodice + dxNominativo + (5 * (g - 1)) * dxTimbr,l * dyLbl,dxTimbr,dyFld);
			fldE1.name = varE1.name;
			fldE1.tabSeq = (l - 1) * 50 + 5 * (g - 1) + 1;
			fldE1.styleClass = 'table';
			fldE1.format = '##.##|mask';
			fldE1.onFocusGained = solutionModel.getGlobalMethod('globals','onFocusGainedTimbrSettimana');
			fldE1.onDataChange = solutionModel.getGlobalMethod('globals','onDataChangeTimbrSettimana');
			fldE1.horizontalAlignment = SM_ALIGNMENT.CENTER;
			fldE1.margin = '0,0,0,0';
			
			var varU1 = frmNeg.newVariable('u1_' + l + '_' + g,JSVariable.TEXT,"'" + dSet.getValue(l,5 + 14 * (g - 1)) + "'");
		    var fldU1 = frmNeg.newTextField(varU1.name,dxCodice + dxNominativo + (5 * (g - 1) + 1) * dxTimbr,l * dyLbl,dxTimbr,dyFld);
			fldU1.name = varU1.name;
		    fldU1.tabSeq = (l - 1) * 50 + 5 * (g - 1) + 2;
			fldU1.styleClass = 'table';
			fldU1.format = '##.##|mask';
			fldU1.onFocusGained = solutionModel.getGlobalMethod('globals','onFocusGainedTimbrSettimana');
			fldU1.onDataChange = solutionModel.getGlobalMethod('globals','onDataChangeTimbrSettimana'); 
			fldU1.horizontalAlignment = SM_ALIGNMENT.CENTER;
			fldU1.margin = '0,0,0,0';
			
			var varE2 = frmNeg.newVariable('e2_' + l + '_' + g,JSVariable.TEXT,"'" + dSet.getValue(l,6 + 14 * (g - 1)) +"'");
			var fldE2 = frmNeg.newTextField(varE2.name,dxCodice + dxNominativo + (5 * (g - 1) + 2) * dxTimbr,l * dyLbl,dxTimbr,dyFld);
			fldE2.name = varE2.name;
			fldE2.tabSeq = (l - 1) * 50 + 5 * (g - 1) + 3;
			fldE2.format = '##.##|mask';
			fldE2.styleClass = 'table';
			fldE2.onFocusGained = solutionModel.getGlobalMethod('globals','onFocusGainedTimbrSettimana');
			fldE2.onDataChange = solutionModel.getGlobalMethod('globals','onDataChangeTimbrSettimana');
			fldE2.horizontalAlignment = SM_ALIGNMENT.CENTER;
			fldE2.margin = '0,0,0,0';
			
			var varU2 = frmNeg.newVariable('u2_' + l + '_' + g,JSVariable.TEXT,"'" + dSet.getValue(l,7 + 14 * (g - 1)) +"'");
			var fldU2 = frmNeg.newTextField(varU2.name,dxCodice + dxNominativo + (5 * (g - 1) + 3) * dxTimbr,l * dyLbl,dxTimbr,dyFld);
			fldU2.name = varU2.name;
			fldU2.tabSeq = (l - 1) * 50 + 5 * (g - 1) + 4;
			fldU2.format = '##.##|mask';
			fldU2.styleClass = 'table';
			fldU2.onFocusGained = solutionModel.getGlobalMethod('globals','onFocusGainedTimbrSettimana');
			fldU2.onDataChange = solutionModel.getGlobalMethod('globals','onDataChangeTimbrSettimana');
			fldU2.horizontalAlignment = SM_ALIGNMENT.CENTER;
			fldU2.margin = '0,0,0,0';
			
			if(!globals.ma_utl_hasKey(globals.Key.ADMIN_NEG))
			{
				if(isGiornoChiusura)
				{
					fldE1.enabled = fldU1.editable = fldE2.enabled = fldU2.enabled = false;
					fldE1.toolTipText = fldU1.toolTipText = fldE2.toolTipText = fldU2.toolTipText = 'Non è possibile programmare i giorni di chiusura del punto vendita';				
				}
				else if(currGiorno.getMonth() + 1 < forms.neg_header_options.vMese && currGiorno.getFullYear() == forms.neg_header_options.vAnno
				        || forms.neg_header_options.vAnno > currGiorno.getFullYear())
				{
					fldE1.enabled = fldU1.editable = fldE2.enabled = fldU2.enabled = false;
					fldE1.toolTipText = fldU1.toolTipText = fldE2.toolTipText = fldU2.toolTipText = 'Non è possibile programmare i giorni del mese precedente';
				}
			}
			
			if(haRichiesta)
			{
				fldE1.enabled = fldU1.editable = fldE2.enabled = fldU2.enabled = false;
				fldE1.toolTipText = fldU1.toolTipText = fldE2.toolTipText = fldU2.toolTipText = 'Non è possibile programmare i giorni che hanno una richiesta di ferie/permessi associata';
			}
			
			// ore totali giorno
			var varOreGiorno = frmNeg.newVariable('ore_programmato_' + l + '_' + g,JSVariable.TEXT,"'" + dSet.getValue(l,8 + 14 * (g - 1)) + "'");
			var fldOreGiorno = frmNeg.newTextField(varOreGiorno.name,dxCodice + dxNominativo + (5 * (g - 1) + 4) * dxTimbr,l * dyLbl,dxTimbr,dyFld);
			fldOreGiorno.name = varOreGiorno.name;
			fldOreGiorno.styleClass = 'table_tot';
			fldOreGiorno.horizontalAlignment = SM_ALIGNMENT.CENTER;
			fldOreGiorno.editable = false;
			fldOreGiorno.enabled = false;
			fldOreGiorno.tabSeq = SM_DEFAULTS.IGNORE;
			
			// ore teoriche giorno
//			var fldOre = frmNeg.newTextField('ore_teoriche_giorno_' + g,dxCodice + dxNominativo + (g + 3) * dxTimbr + dxOre,dyLbl,dxOre,dyFld);
//			fldOre.dataProviderID = 'ore_teoriche_giorno_' + g;
//			fldOre.name = 'fld_ore_teoriche_giorno_' + g;
//			fldOre.styleClass = 'table';
//			fldOre.horizontalAlignment = SM_ALIGNMENT.CENTER;
//			fldOre.editable = true;
//			fldOre.enabled = true;
//			fldOre.onDataChange = solutionModel.getGlobalMethod('globals','onDataChangeOreTeoricheGiorno');
//			var lblOre = frmNeg.newLabel('Ore',dxCodice + dxNominativo + (g + 3) * dxTimbr + dxOre,0,dxOre,dyLbl) ;
//			lblOre.name = 'lbl_ore_teoriche_giorno_' + g;
//			lblOre.labelFor = fldOre.name;
//			lblOre.styleClass = 'table_header';
//			lblOre.horizontalAlignment = SM_ALIGNMENT.CENTER;
			
			// ore assenza giorno
//			var fldOreAssenza = frmNeg.newTextField('ore_assenza',dxCodice + dxNominativo + dxTimbr * 4 + dxOre * 2,dyLbl,dxOre,dyFld);
//			fldOreAssenza.dataProviderID = 'ore_assenza';
//			fldOreAssenza.name = 'fld_ore_assenza';
//			fldOreAssenza.styleClass = 'table';
//			fldOreAssenza.horizontalAlignment = SM_ALIGNMENT.CENTER;
//			fldOreAssenza.enabled = false;
//			var lblOreAssenza = frmNeg.newLabel('Assenza',dxCodice + dxNominativo + dxTimbr * 4 + dxOre * 2,0,dxOre,dyLbl);
//			lblOreAssenza.name = 'lbl_ore_assenza';
//			lblOreAssenza.labelFor = fldOreAssenza.name;
//			lblOreAssenza.horizontalAlignment = SM_ALIGNMENT.CENTER;
//			lblOreAssenza.styleClass = 'table_header';
						    
			// ore straordinario giorno
//			var fldOreStraordinario = frmNeg.newTextField('ore_straordinario',dxCodice + dxNominativo + dxTimbr * 4 + dxOre * 3,dyLbl,dxOre,dyFld);
//			fldOreStraordinario.dataProviderID = 'ore_straordinario';
//			fldOreStraordinario.name = 'fld_ore_straordinario';
//			fldOreStraordinario.styleClass = 'table';
//			fldOreStraordinario.horizontalAlignment = SM_ALIGNMENT.CENTER;
//			fldOreStraordinario.enabled = false;
//			var lblOreStraordinario = frmNeg.newLabel('Straord.',dxCodice + dxNominativo + dxTimbr * 4 + dxOre * 3,0,dxOre,dyLbl);
//			lblOreStraordinario.name = 'lbl_ore_straordinario';
//			lblOreStraordinario.labelFor = fldOreStraordinario.name;
//			lblOreStraordinario.styleClass = 'table_header';
//			lblOreStraordinario.horizontalAlignment = SM_ALIGNMENT.CENTER;
						
		}
		
		var varOreProgrammate = frmNeg.newVariable('ore_programmate_' + l,JSVariable.TEXT,"'" + dSet.getValue(l,102) + "'");
		var fldOreProgrammate = frmNeg.newTextField(varOreProgrammate.name,dxCodice + dxNominativo + 5 * (g - 1) * dxTimbr,l * dyLbl,dxTimbr,dyLbl);
		fldOreProgrammate.name = varOreProgrammate.name;
		fldOreProgrammate.styleClass = 'table';
		fldOreProgrammate.horizontalAlignment = SM_ALIGNMENT.CENTER;
		fldOreProgrammate.editable = false;
		fldOreProgrammate.enabled = false;
		fldOreProgrammate.tabSeq = SM_DEFAULTS.IGNORE;

	}
	
	// posizionamento fields riepilogo ore nel giorno 
	var frm = forms.neg_prog_settimana_tab;
	var frmElem = frm.elements;
	var tab = frmElem.tab_prog_settimana; 
	var tabSize = dyLbl + numDip * dyFld;
	tab.setSize(tab.getWidth(),tabSize);
	frmElem.fld_totale_ore_lunedi.setLocation(frmElem.fld_totale_ore_lunedi.getLocationX(),tabSize + 22);
	frmElem.fld_totale_ore_martedi.setLocation(frmElem.fld_totale_ore_martedi.getLocationX(),tabSize + 22);
	frmElem.fld_totale_ore_mercoledi.setLocation(frmElem.fld_totale_ore_mercoledi.getLocationX(),tabSize + 22);
	frmElem.fld_totale_ore_giovedi.setLocation(frmElem.fld_totale_ore_giovedi.getLocationX(),tabSize + 22);
	frmElem.fld_totale_ore_venerdi.setLocation(frmElem.fld_totale_ore_venerdi.getLocationX(),tabSize + 22);
	frmElem.fld_totale_ore_sabato.setLocation(frmElem.fld_totale_ore_sabato.getLocationX(),tabSize + 22);
	frmElem.fld_totale_ore_domenica.setLocation(frmElem.fld_totale_ore_domenica.getLocationX(),tabSize + 22);
	
	forms.neg_prog_settimana_tab.elements.tab_prog_settimana.addTab(frmNewName);
		
}

/**
 * Al variare del valore della prima uscita ricerca l'esistenza delle fasce oraria e fittizia
 * 
 * @param oldValue
 * @param newValue
 * @param event
 * 
 * @properties={typeid:24,uuid:"C5CAAFC3-FBE1-4680-8061-394F7CFC3510"}
 * @SuppressWarnings(wrongparameters)
 */
function onDataChangeTimbr(oldValue,newValue,event)
{
	var hh = parseInt(utils.stringLeft(newValue,2),10);
	var mm = parseInt(utils.stringRight(newValue,2),10);
	var arrMin = [0,15,30,45];
	var giorno = forms.neg_prog_giorno_tab.vGiorno;
	var giornoIso = utils.dateFormat(giorno,globals.ISO_DATEFORMAT);
	
	var frm = forms['neg_prog_giorno_tbl_temp'];
	var fs = frm.foundset;
	var totOre = null;
	
	// eventuali eventi in giornaliera di budget
	var recGiornBudget = globals.getRecGiornaliera(fs['idlavoratore'],giorno,globals.TipoGiornaliera.BUDGET);
	if(recGiornBudget 
	   && recGiornBudget.e2giornaliera_to_e2giornalieraeventi
	   && recGiornBudget.e2giornaliera_to_e2giornalieraeventi.idevento && newValue != null)
	{
		globals.ma_utl_showWarningDialog('Non è possibile modificare le presenze per un giorno con una richiesta di ferie/permessi associata','Programmazione giorno negozio');
	    return;
	}

	if(newValue != null && (hh >= 24 || arrMin.indexOf(mm) == -1)) 
	{
		globals.ma_utl_showWarningDialog('Controllare l\'orario inserito','Programmazione giorno negozio');
		return;
	}
			
	var e1 = fs['e1'] != null ? parseInt(utils.stringLeft(fs['e1'],2),10) * 100 + parseInt(utils.stringRight(fs['e1'],2),10) : null;
	var u1 = fs['u1'] != null ? parseInt(utils.stringLeft(fs['u1'],2),10) * 100 + parseInt(utils.stringRight(fs['u1'],2),10) : null;
	var e2 = fs['e2'] != null ? parseInt(utils.stringLeft(fs['e2'],2),10) * 100 + parseInt(utils.stringRight(fs['e2'],2),10) : null;
	var u2 = fs['u2'] != null ? parseInt(utils.stringLeft(fs['u2'],2),10) * 100 + parseInt(utils.stringRight(fs['u2'],2),10) : null;
	var inizioOrario = null;
	var inizioPausa = null;
	var finePausa = null;
	var fineOrario = null;
	
	if(e1 && u1)
	{
		if(e1 > u1)
		{
			globals.ma_utl_showWarningDialog('Controllare gli orari inseriti!');
			return;
		}
		
		// caso giornata  
		if(u2 != null && e2 != null)
		{
		   if(e2 > u2 || e1 > e2 || u1 > u2)
		   {
			  globals.ma_utl_showWarningDialog('Controllare gli orari inseriti!');
			  return;
		   }
		   totOre = globals.calcolaOreEventoSemplice(e1,u1) + globals.calcolaOreEventoSemplice(e2,u2);
		   inizioOrario = e1;
		   inizioPausa = u1;
		   finePausa = e2;
		   fineOrario = u2;
		}
		// caso solo mattino
		else if(u2 == null && e2 == null)
		{
		   totOre = globals.calcolaOreEventoSemplice(e1,u1);
		   inizioOrario = e1;
		   fineOrario = u1;
		}
		else
		// caso totale ore non calcolabile
		{
			pulisciFoundsetTimbrature(fs.getSelectedRecord());
			return;
		}
	}
	else if(e1 && u2 && e2 == null && u1 == null)
	{	
		if(e1 > u2)
		{
			globals.ma_utl_showWarningDialog('Controllare gli orari inseriti!');
			return;
		}	
		// caso giornata intera
		totOre = globals.calcolaOreEventoSemplice(e1,u2);
	    inizioOrario = e1;
	    fineOrario = u2;
	}
	else if(e2 && u2 && e1 == null && u1 == null)
	{	
		if(e2 > u2)
		{
			globals.ma_utl_showWarningDialog('Controllare gli orari inseriti!');
			return;
		}	
		// caso solo pomeriggio
		totOre = globals.calcolaOreEventoSemplice(e2,u2);
		inizioOrario = e2;
		fineOrario = u2;
	}
	else
	// caso totale ore non calcolabile
	{
		pulisciFoundsetTimbrature(fs.getSelectedRecord());
		if(e1 == null && e2 == null && u1 == null && u2 == null)
		{
			totOre = 0;
			 forms.neg_prog_giorno_tab.elements.btn_next_day.enabled =
			  forms.neg_prog_giorno_tab.elements.btn_previous_day.enabled = false;
		    forms.neg_prog_giorno_tab.elements.btn_conferma.enabled =
		    	forms.neg_prog_giorno_tab.elements.btn_annulla.enabled = true;
		}
		//else 
		 return;
	}
	
	var idDitta = globals.getDitta(fs['idlavoratore']);
	var recFascia = globals.getFasciaOrariaDaTotaleOre(idDitta,totOre * 100);
	
	// se nessuna fascia relativa alla ditta ha un totale di ore corrispondente a quello inserito
	// aspettiamo che l'utente inserisca una ulteriore coppia entrata/uscita, altrimenti procediamo
	// a recuperare l'id della fascia fittizia  
	if(recFascia != null)
	{
	   var recFasciaOrariaTimbr = globals.getFasciaOrariaDittaTimbrature(idDitta,inizioOrario,inizioPausa,finePausa,fineOrario);
	   
	   // caso fascia oraria esistente ma fascia oraria ditta con timbrature non esistente : inserisci la nuova fascia oraria timbrature avente gli orari specificati
	   if(recFasciaOrariaTimbr == null)
	   {
		  var idFasciaOrariaTimbr = globals.inserisciNuovaFasciaOrariaTimbrature(idDitta,inizioOrario,inizioPausa,finePausa,fineOrario);
		  
		  // la fascia timbrature ditta è stata inserita
		  if(idFasciaOrariaTimbr != -1)
		  	  fs['id_ditta_fascia_oraria_timbrature'] = idFasciaOrariaTimbr;
		  // l'inserimento della nuova fascia oraria ditta con timbrature non è andato a buon fine
		  else
		  {
			 globals.ma_utl_showErrorDialog('Errore durante la creazione della nuova fascia oraria ditta con timbrature. Riprovare.','Inserimento nuova fascia fittizia');
			 pulisciFoundsetTimbrature(fs.getSelectedRecord(),true);
			 return;
		  }
	   }
	   // caso fascia oraria e fascia ditta timbrature con gli orari indicati già esistente
	   else
	   	   fs['id_ditta_fascia_oraria_timbrature'] = recFasciaOrariaTimbr.iddittafasciaorariatimbrature;
	   	   
	   // caso giorno festivo
	   if(forms.neg_header_options.vArrGiorniFestivi.indexOf(giornoIso) != -1
		  && globals.getOreFestivitaGoduta(giornoIso,fs['idlavoratore']))
	   {	   
		   fs['ore_programmato'] = totOre; 
		   fs['ore_ordinario'] = null;
		   var oreFestGod = globals.getOreFestivitaGoduta(giornoIso,fs['idlavoratore']);
		   fs['id_fascia_oraria'] = globals.getFasciaOrariaDaTotaleOre(idDitta,oreFestGod * 100).idfasciaoraria;
		   fs['ore_festivo'] = oreFestGod != 0 ? oreFestGod : null;
		   fs['ore_teorico'] = fs['ore_festivo'];
		   fs['modificato'] = 1;
		   var deltaFest = fs['ore_programmato'] - (fs['ore_teorico'] - fs['ore_festivo']);
		   fs['ore_assenza'] = null; // in giorno festivo le assenze sono sempre a zero
		   fs['ore_straordinario'] = deltaFest > 0 ? deltaFest : null; // nel giorno festivo l'eventuale lavorato è straordinario
		   fs['tipo_riposo'] = 0;
		   
	   }
	   // caso giorno ordinario
	   else
	   { 
		 fs['ore_programmato'] = totOre;
		 fs['ore_teorico'] = recFascia.totaleorefascia / 100;
		 fs['ore_ordinario'] = Math.min(fs['ore_programmato'],fs['ore_teorico']);
		 fs['id_fascia_oraria'] = recFascia.idfasciaoraria;
		 fs['ore_festivo'] = null;
		 
		 fs['modificato'] = 1;
		 var delta = fs['ore_programmato'] - (fs['ore_teorico'] - fs['ore_festivo']);
		 fs['ore_assenza'] = delta < 0 ? (-delta) : null;
		 fs['ore_straordinario'] = delta > 0 ? delta : null;
		 fs['tipo_riposo'] = 0;
		 
	    }
	   
	    forms.neg_prog_giorno_tab.elements.btn_next_day.enabled =
		  forms.neg_prog_giorno_tab.elements.btn_previous_day.enabled = false;
	    forms.neg_prog_giorno_tab.elements.btn_conferma.enabled =
	    	forms.neg_prog_giorno_tab.elements.btn_annulla.enabled = true;
	   
	}
	else
	{
		// nessuna fascia corrispondente al numero di ore indicate
		globals.ma_utl_showWarningDialog('Nessuna fascia con il numero di ore indicato','Modifica numero di ore teoriche');
		pulisciFoundsetTimbrature(fs.getSelectedRecord(),true);
	}
	
}

/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"73713BF2-F59F-4D8A-B4D9-BCBB71350613"}
 */
function onFocusGainedTimbrSettimana(event)
{
   var frm = forms.neg_prog_settimana_tab;
   frm.setStatusNeutral('Pronto per l\'inserimento');
}

/**
 * Al variare del valore della prima uscita ricerca l'esistenza delle fasce oraria e fittizia
 * 
 * @param oldValue
 * @param newValue
 * @param event
 * 
 * @properties={typeid:24,uuid:"5AAA5837-8CBA-4B19-A460-2EC4E10488A3"}
 */
function onDataChangeTimbrSettimana(oldValue,newValue,event)
{
	var elemName = event.getElementName();
	var pos_1 = utils.stringPosition(elemName,'_',0,1);
    var pos_2 = utils.stringPosition(elemName,'_',0,2);
	
    var rIndex = parseInt(utils.stringMiddle(elemName,pos_1 + 1,pos_2 - 1));
    var gIndex = parseInt(utils.stringMiddle(elemName,pos_2 + 1,elemName['length']));
    var prefix = utils.stringLeft(elemName,2);
    
    var hh = parseInt(utils.stringLeft(newValue,2),10);
	var mm = parseInt(utils.stringRight(newValue,2),10);
	var arrMin = [0,15,30,45];
	
	if(newValue != null)
	{
		if(hh >= 24 || arrMin.indexOf(mm) == -1) 
		{
			forms.neg_prog_settimana_tab.setStatusError('Controllare l\'orario inserito','',1500);
			return false;
		}
	}
	
	var frm = forms['neg_prog_settimana_tbl_temp'];
	var fs = frm.foundset;
	var currRec = fs.getRecord(rIndex);
	currRec[prefix + '_' + gIndex] = newValue;	
	
	var totOre = null;
	
	var e1 = currRec['e1_'+ gIndex] != null ? parseInt(utils.stringLeft(currRec['e1_'+ gIndex].toString(),2),10) * 100 + parseInt(utils.stringRight(currRec['e1_'+ gIndex].toString(),2),10) : null;
	var u1 = currRec['u1_'+ gIndex] != null ? parseInt(utils.stringLeft(currRec['u1_'+ gIndex].toString(),2),10) * 100 + parseInt(utils.stringRight(currRec['u1_'+ gIndex].toString(),2),10) : null;
	var e2 = currRec['e2_'+ gIndex] != null ? parseInt(utils.stringLeft(currRec['e2_'+ gIndex].toString(),2),10) * 100 + parseInt(utils.stringRight(currRec['e2_'+ gIndex].toString(),2),10) : null;
	var u2 = currRec['u2_'+ gIndex] != null ? parseInt(utils.stringLeft(currRec['u2_'+ gIndex].toString(),2),10) * 100 + parseInt(utils.stringRight(currRec['u2_'+ gIndex].toString(),2),10) : null;
	var inizioOrario = null;
	var inizioPausa = null;
	var finePausa = null;
	var fineOrario = null;
	
	if(e1 && u1)
	{
		if(e1 > u1)
		{
			forms.neg_prog_settimana_tab.setStatusError('Controllare gli orari inseriti!','',1500);
			return false;
		}
				
		// caso giornata  
		if(u2 != null && e2 != null)
		{
		   if(e2 > u2 || e1 > e2 || u1 > u2)
		   {
			   forms.neg_prog_settimana_tab.setStatusError('Controllare gli orari inseriti!','',1500);
			   return false;
		   }
		   totOre = globals.calcolaOreEventoSemplice(e1,u1) + globals.calcolaOreEventoSemplice(e2,u2);
		   inizioOrario = e1;
		   inizioPausa = u1;
		   finePausa = e2;
		   fineOrario = u2;
		}
		// caso solo mattino
		else if(u2 == null && e2 == null)
		{
		   totOre = globals.calcolaOreEventoSemplice(e1,u1);
		   inizioOrario = e1;
		   fineOrario = u1;
		}
		else
		// caso totale ore non calcolabile
		{
			pulisciFoundsetTimbratureSettimana(fs,fs.getSelectedIndex(),gIndex);
			return true;
		}
	}
	else if(e1 && u2 && e2 == null && u1 == null)
	{	
		if(e1 > u2)
		{
			forms.neg_prog_settimana_tab.setStatusError('Controllare gli orari inseriti!','',1500);
			return false;
		}	
		// caso giornata intera
		totOre = globals.calcolaOreEventoSemplice(e1,u2);
	    inizioOrario = e1;
	    fineOrario = u2;
	}
	else if(e2 && u2 && e1 == null && u1 == null)
	{	
		if(e2 > u2)
		{
			forms.neg_prog_settimana_tab.setStatusError('Controllare gli orari inseriti!','',1500);
			return false;
		}	
		// caso solo pomeriggio
		totOre = globals.calcolaOreEventoSemplice(e2,u2);
		inizioOrario = e2;
		fineOrario = u2;
	}
	else
	// caso totale ore non calcolabile
	{
		pulisciFoundsetTimbratureSettimana(fs,rIndex,gIndex);
		return true;
	}
	
	var giorno = new Date(forms.neg_prog_settimana_tab.vPrimoGiornoSettimana.getFullYear(),
		                   forms.neg_prog_settimana_tab.vPrimoGiornoSettimana.getMonth(),
						   forms.neg_prog_settimana_tab.vPrimoGiornoSettimana.getDate() + gIndex - 1);
	if(forms.neg_prog_settimana_tab.vArrGiorniModificati.indexOf(giorno) == -1)
		forms.neg_prog_settimana_tab.vArrGiorniModificati.push(giorno);
	
	var giornoIso = utils.dateFormat(giorno,globals.ISO_DATEFORMAT);
	
	/** @type {Number} */
	var idLavoratore = currRec['idlavoratore'];
	var idDitta = globals.getDitta(idLavoratore);

	var recFascia = globals.getFasciaOrariaDaTotaleOre(idDitta,totOre * 100); 
	
	// se nessuna fascia relativa alla ditta ha un totale di ore corrispondente a quello inserito
	// aspettiamo che l'utente inserisca una ulteriore coppia entrata/uscita, altrimenti procediamo
	// a recuperare l'id della fascia fittizia  
	if(recFascia != null)
	{
	   var recFasciaOrariaTimbr = globals.getFasciaOrariaDittaTimbrature(idDitta,inizioOrario,inizioPausa,finePausa,fineOrario);
	   
	   // caso fascia oraria esistente ma fascia oraria ditta con timbrature non esistente : inserisci la nuova fascia oraria timbrature avente gli orari specificati
	   if(recFasciaOrariaTimbr == null)
	   {
		  var idFasciaOrariaTimbr = globals.inserisciNuovaFasciaOrariaTimbrature(idDitta,inizioOrario,inizioPausa,finePausa,fineOrario);
		  
		  // la fascia timbrature ditta è stata inserita
		  if(idFasciaOrariaTimbr != -1)
			  currRec['id_ditta_fascia_oraria_timbrature_' + gIndex] = idFasciaOrariaTimbr;
		  // l'inserimento della nuova fascia oraria ditta con timbrature non è andato a buon fine
		  else
		  {
			 forms.neg_prog_settimana_tab.setStatusError('Errore durante la creazione della nuova fascia oraria ditta con timbrature. Riprovare!','',1500);
			 pulisciFoundsetTimbratureSettimana(fs, rIndex, gIndex, true);
			 return true;
		  }
	   }
	   // caso fascia oraria e fascia ditta timbrature con gli orari indicati già esistente
	   else
		   currRec['id_ditta_fascia_oraria_timbrature_' + gIndex] = recFasciaOrariaTimbr.iddittafasciaorariatimbrature;
	   	   
	   // caso giorno festivo
	   if(forms.neg_header_options.vArrGiorniFestivi.indexOf(giornoIso) != -1
	      && globals.getOreFestivitaGoduta(giornoIso,idLavoratore))
	   {
	   		frm['ore_programmato_' + rIndex + '_' + gIndex] = currRec['ore_programmato_' + gIndex] = totOre; 
	   		currRec['ore_ordinario_' + gIndex] = 0;
	   		var oreFestGod = globals.getOreFestivitaGoduta(giornoIso,idLavoratore);
	   		currRec['id_fascia_oraria_' + gIndex] = globals.getFasciaOrariaDaTotaleOre(idDitta,oreFestGod * 100).idfasciaoraria;
	   		currRec['ore_festivo_' +  gIndex] = oreFestGod != 0 ? oreFestGod : 0;
	   		currRec['ore_teorico_' + gIndex] = currRec['ore_festivo_' +  gIndex];
	   		currRec['modificato_' + gIndex] = 1;
	   		var deltaFest = currRec['ore_programmato_' + rIndex + '_' + gIndex] - (currRec['ore_teorico_' + gIndex] - oreFestGod);
	   		currRec['ore_assenza_' + gIndex] = null; // in giorno festivo le assenze sono sempre a zero
	   		currRec['ore_straordinario_' + gIndex] = deltaFest > 0 ? deltaFest : 0; // nel giorno festivo l'eventuale lavorato è straordinario
	   		currRec['tipo_riposo_' + gIndex] = 0;
	   }
	   // caso giorno ordinario
	   else
	   { 
		 frm['ore_programmato_' + rIndex + '_' + gIndex] = currRec['ore_programmato_' + gIndex] = totOre;
		 currRec['ore_teorico_' + gIndex] = (recFascia.totaleorefascia / 100).toFixed(2);
		 currRec['ore_ordinario_' + gIndex] = Math.min(currRec['ore_programmato_' + gIndex],currRec['ore_teorico_' + gIndex]);
		 currRec['id_fascia_oraria_' + gIndex] = recFascia.idfasciaoraria;
		 currRec['ore_festivo_' + gIndex] = null;
		 currRec['modificato_' + gIndex] = 1;
		 var delta = currRec['ore_programmato_' + gIndex] - (currRec['ore_teorico_' + gIndex] - currRec['ore_festivo_' + gIndex]);
		 currRec['ore_assenza_' + gIndex] = delta < 0 ? (-delta) : null;
		 currRec['ore_straordinario_' + gIndex] = delta > 0 ? delta : null;
		 // impostazione automatica giorno riposo primario
		 //currRec['tipo_riposo_' + gIndex] = (totOre == 0 
		 //		                        && getGiornoRiposoSettimanale(currRec['idlavoratore'],giorno,1) == null) ? 1 : 0;
	   }
	   
	   frm['ore_programmate_' + rIndex] = currRec['ore_programmate'] = getTotaleOreProgrammateSettimana(rIndex);
	   aggiornaTotaleOreGiornata(gIndex);
	}
	else
	{
		// nessuna fascia corrispondente al numero di ore indicate
		forms.neg_prog_settimana_tab.setStatusError('Nessuna fascia con il numero di ore indicato','',1500);
		pulisciFoundsetTimbratureSettimana(fs, rIndex, gIndex, true);
	}
	
	return true;
}

/**
 * Gestione dell'inserimento delle ore effettive lavorate dal dipendente nel giorno
 * Se le ore effettive sono maggiori del teorico della fascia scelta la differenza ricadrà negli straordinari
 * Se le ore effettive sono minori del teorico della fascia scelta la differenza ricadrà nelle assenze
 * 
 * @param oldValue
 * @param newValue
 * @param event
 * 
 * @properties={typeid:24,uuid:"1F55005A-E271-4547-80BC-D8042AADF162"}
 */
function onDataChangeOreTeoricheGiorno(oldValue,newValue,event)
{
	var frm = forms['neg_prog_giorno_tbl_temp'];
	var fs = frm.foundset;
	
	// eventuali eventi in giornaliera di budget
	var recGiornBudget = globals.getRecGiornaliera(fs['idlavoratore'],forms.neg_prog_giorno_tab.vGiorno,globals.TipoGiornaliera.BUDGET);
	if(recGiornBudget
  	   && recGiornBudget.e2giornaliera_to_e2giornalieraeventi
	   && recGiornBudget.e2giornaliera_to_e2giornalieraeventi.idevento)
	{
		globals.ma_utl_showWarningDialog('Non è possibile modificare le ore teoriche per un giorno con una richiesta di ferie/permessi associata','Programmazione giorno negozio');
	    newValue = oldValue;
		return true;
	}
	
	var idDitta = globals.getDitta(fs['idlavoratore']);
	var recFasciaNew = globals.getFasciaOrariaDaTotaleOre(idDitta,newValue * 100); 
	
	if(recFasciaNew == null)
	{
		globals.ma_utl_showWarningDialog('Nessuna fascia trovata avente il numero di ore specificate','Impostazione ore teoriche nella giornata');
	    return false;
	}
	
	fs['ore_teorico'] = recFasciaNew.totaleorefascia / 100;
		
    // giorno festivo, aggiornamento delle ore festive in seguito alla modifica del teorico 
	if(forms.neg_header_options.vArrGiorniFestivi.indexOf(utils.dateFormat(forms.neg_prog_giorno_tab.vGiorno,globals.ISO_DATEFORMAT)) != -1
		&& globals.getOreFestivitaGoduta(utils.dateFormat(forms.neg_prog_giorno_tab.vGiorno,globals.ISO_DATEFORMAT),fs['idlavoratore']))
	{
	    fs['ore_ordinario'] = null;
		fs['ore_festivo'] = fs['ore_teorico'];	    
	}
	else
	{
		fs['ore_festivo'] = null;
		fs['ore_ordinario'] = fs['ore_programmato'] != null ? fs['ore_teorico'] : fs['ore_programmato'];
	}
	
	var delta = fs['ore_programmato'] - (fs['ore_teorico'] - fs['ore_festivo']);
	if(delta > 0)
	{
		fs['ore_straordinario'] = delta;
		fs['ore_assenza'] = null;
	}
	else if(delta < 0)
	{
		if(fs['ore_festivo'] <= 0)
		   fs['ore_assenza'] = -delta;
		
		fs['ore_straordinario'] = null;
	}
	else
	{
		fs['ore_assenza'] = null;
		fs['ore_straordinario'] = null;
	}
	
	fs['modificato'] = 1;
	
	forms.neg_prog_giorno_tab.elements.btn_next_day.enabled =
	  forms.neg_prog_giorno_tab.elements.btn_previous_day.enabled = false;
	
	// aggiornamento del valore della fascia oraria da salvare in e2progfasceprogrammate
	var recFascia = globals.getFasciaOrariaDaTotaleOre(globals.getDitta(fs['idlavoratore']),newValue * 100);
	if(recFascia)
	{
		fs['id_fascia_oraria'] = recFascia.idfasciaoraria;
		forms.neg_prog_giorno_tab.elements.btn_conferma.enabled =
    	  forms.neg_prog_giorno_tab.elements.btn_annulla.enabled = true;
	}
	else
	{
		// nessuna fascia corrispondente al numero di ore indicato
		globals.ma_utl_showWarningDialog('Nessuna fascia con il numero di ore indicato','Modifica numero di ore teoriche');
		forms.neg_prog_giorno_tab.elements.btn_annulla.enabled = true;
	}
	return true;
}

/**
 * Calcola il numero delle ore di lavoro a partire dai valori di ingresso ed uscita
 * 
 * @param entrata
 * @param uscita
 * 
 * @return {Number} 
 * 
 * @properties={typeid:24,uuid:"0A94EDE4-1140-4E0F-A543-4967C076C369"}
 */
function calcolaOreEventoSemplice(entrata,uscita)
{
	if(entrata == null || uscita == null)
		return 0.00;
	var vTotale = uscita - entrata; 
	var vTotaleOre = Math.floor(vTotale/100);
	var vTotaleMinuti = vTotale - vTotaleOre * 100;
	var vTotaleMinutiFormat = 0;
	
	switch(vTotaleMinuti)
	{
		case 15:
		case 55:	
			vTotaleMinutiFormat = 0.25;
			break;
		case 30:
		case 50:
		case 70:
		    vTotaleMinutiFormat = 0.50;
			break;
		case 45:
		case 85:
		    vTotaleMinutiFormat = 0.75;
		    break;
		default:
		    vTotaleMinutiFormat = 0;
			break;
	}
	return vTotaleOre + vTotaleMinutiFormat;
	
}

/**
 * @AllowToRunInFind
 * 
 * Calcola il numero di ore associate alla fascia oraria indicata
 * 
 * @param {Number} idDittaFasciaOraria
 * 
 * @return {Number}
 * 
 * @properties={typeid:24,uuid:"8F3D3F40-3628-400F-A686-0BA68407144C"}
 */
function calcolaOreEventoFasciaOraria(idDittaFasciaOraria)
{
	/** @type {JSFoundset<db:/ma_presenze/e2fo_fasceorarie>}*/
	var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.FASCE_ORARIE);
	if(fs.find())
	{
		fs.idfasciaoraria = idDittaFasciaOraria;
		if(fs.search())
			return (fs.totaleorefascia/100);
	}
	
	return 0;
}

/**
 * Restituisce il numero di ore programmate calcolate a partire dai dati della fascia oraria ditta timbrature
 * 
 * @param {Number} idDittaFasciaOrariaTimbrature
 *
 * @properties={typeid:24,uuid:"240626A3-0B9B-4518-9862-5275B5AA6B7D"}
 * @AllowToRunInFind
 */
function calcolaOreEventoFasciaOrariaTimbrature(idDittaFasciaOrariaTimbrature)
{
	if(idDittaFasciaOrariaTimbrature == null)
		return 0;
	
	/** @type {JSFoundset<db:/ma_anagrafiche/ditte_fasceorarietimbrature>}*/
	var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.FASCE_ORARIE_DITTA_TIMBRATURE);
	if(fs.find())
	{
		fs.iddittafasciaorariatimbrature = idDittaFasciaOrariaTimbrature;
		if(fs.search())
		{
			var totale_1,totale_2 = 0;
			if(fs.iniziopausa)
			{
				totale_1 = (fs.iniziopausa - fs.inizioorario); 
				totale_2 = (fs.fineorario - fs.finepausa);
			}
			else
			   totale_1 = fs.fineorario - fs.inizioorario;
		}
	}
	
	return scopes.giornaliera.convertiOrarioInOreCentesimi(totale_1) + scopes.giornaliera.convertiOrarioInOreCentesimi(totale_2);
}

/**
 * Ricerca la fascia oraria fittizia avente i parametri indicati ed associata ad una fascia oraria vera e propria 
 * con un numero di ore pari al parametro oreTeoriche (in base alle ore teoriche ottenute dal calcolo degli orari, 
 * la fascia oraria "vera" è univocamente identificata)
 * 
 * @param {Number} idFasciaOraria 
 * @param {Number} inizioOrario
 * @param {Number} inizioPausa
 * @param {Number} finePausa
 * @param {Number} fineOrario
 *
 * @return {JSRecord<db:/ma_presenze/e2fo_fasceorariefittizie>}
 * 
 * @properties={typeid:24,uuid:"1C11631A-14F5-4E3C-A9CC-708BD874EF65"}
 * @AllowToRunInFind
 */
function getFasciaOrariaFittizia(idFasciaOraria,inizioOrario,inizioPausa,finePausa,fineOrario)
{
	/** @type{JSFoundset<db:/ma_presenze/e2fo_fasceorariefittizie>} */
	var fsFasceOrarieFittizie = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.FASCE_ORARIE_FITTIZIE);
	if(fsFasceOrarieFittizie.find())
	{
		fsFasceOrarieFittizie.idfasciaoraria = idFasciaOraria;
		fsFasceOrarieFittizie.inizioorario = inizioOrario;
		fsFasceOrarieFittizie.iniziopausa = inizioPausa;
		fsFasceOrarieFittizie.finepausa = finePausa;
		fsFasceOrarieFittizie.fineorario = fineOrario;
			
		if(fsFasceOrarieFittizie.search())
			return fsFasceOrarieFittizie.getSelectedRecord();
	
	}
	
	return null;
}

/**
 * Ricerca la fascia oraria delle timbrature ditta avente i parametri indicati ed associata ad una fascia oraria vera e propria 
 * con un numero di ore pari al parametro oreTeoriche (in base alle ore teoriche ottenute dal calcolo degli orari, 
 * la fascia oraria "vera" è univocamente identificata)
 * 
 * @param {Number} idDitta 
 * @param {Number} inizioOrario
 * @param {Number} inizioPausa
 * @param {Number} finePausa
 * @param {Number} fineOrario
 *
 * @return {JSRecord<db:/ma_anagrafiche/ditte_fasceorarietimbrature>}
 * 
 * @properties={typeid:24,uuid:"2D7A0CAE-BAEC-450B-AAAD-FD589A5259B2"}
 * @AllowToRunInFind
 */
function getFasciaOrariaDittaTimbrature(idDitta,inizioOrario,inizioPausa,finePausa,fineOrario)
{
	/** @type{JSFoundset<db:/ma_anagrafiche/ditte_fasceorarietimbrature>} */
	var fsFasceOrarieDittaTimbr = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.FASCE_ORARIE_DITTA_TIMBRATURE);
	if(fsFasceOrarieDittaTimbr.find())
	{
		fsFasceOrarieDittaTimbr.idditta = idDitta;
		fsFasceOrarieDittaTimbr.inizioorario = inizioOrario != null ? inizioOrario : '^';
		fsFasceOrarieDittaTimbr.iniziopausa = inizioPausa != null ? inizioPausa : '^';
		fsFasceOrarieDittaTimbr.finepausa = finePausa != null ? finePausa : '^';
		fsFasceOrarieDittaTimbr.fineorario = fineOrario != null ? fineOrario : '^';
			
		if(fsFasceOrarieDittaTimbr.search())
			return fsFasceOrarieDittaTimbr.getSelectedRecord();
	
	}
	
	return null;
}

/**
 * Ricerca la fascia oraria delle timbrature ditta avente l'identificativo indicato
 * 
 * @param {Number} idFasciaOrariaDittaTimbrature
 *
 * @return {JSRecord<db:/ma_anagrafiche/ditte_fasceorarietimbrature>}
 * 
 * @properties={typeid:24,uuid:"F2FDC73F-B834-4E16-8D85-D76B5AC40762"}
 * @AllowToRunInFind
 */
function getFasciaOrariaDittaTimbratureDaFascia(idFasciaOrariaDittaTimbrature)
{
	/** @type{JSFoundset<db:/ma_anagrafiche/ditte_fasceorarietimbrature>} */
	var fsFasceOrarieDittaTimbr = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.FASCE_ORARIE_DITTA_TIMBRATURE);
	if(fsFasceOrarieDittaTimbr.find())
	{
		fsFasceOrarieDittaTimbr.iddittafasciaorariatimbrature = idFasciaOrariaDittaTimbrature;
			
		if(fsFasceOrarieDittaTimbr.search())
			return fsFasceOrarieDittaTimbr.getSelectedRecord();
	}
	
	return null;
}

/**
 * Gestione dell'inserimento di una nuova fascia oraria su timbrature avente i parametri indicati
 * 
 * @param {Number} idFasciaPadre
 * @param {Number} inizioOrario
 * @param {Number} inizioPausa
 * @param {Number} finePausa
 * @param {Number} fineOrario
 *
 * @return {Number}
 * 
 * @properties={typeid:24,uuid:"FF780F92-3689-4F35-B179-C6FE15BBB7D1"}
 */
function inserisciNuovaFasciaFittizia(idFasciaPadre,inizioOrario,inizioPausa,finePausa,fineOrario)
{
	/** @type{JSFoundset<db:/ma_presenze/e2fo_fasceorariefittizie>} */
	var fsFasceOrarieFittizie = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.FASCE_ORARIE_FITTIZIE);
	var newRecordIndex = fsFasceOrarieFittizie.newRecord(false);
	if(newRecordIndex >= 0)
	{
		var newRec = fsFasceOrarieFittizie.getRecord(newRecordIndex);
		newRec.idfasciaoraria = idFasciaPadre;
		newRec.inizioorario = inizioOrario;
		newRec.iniziopausa = inizioPausa;
		newRec.finepausa = finePausa;
		newRec.fineorario = fineOrario;
		
		if(!databaseManager.saveData(newRec))
		{
			globals.ma_utl_showErrorDialog('Errore durante il salvataggio della fascia, riprovare','Aggiungi una fascia fittizia');
			return -1;
		}
		else
			return newRec.idfasciafittizia;
	}
	else
	{
		globals.ma_utl_showErrorDialog('Errore durante la creazione del nuovo record per la fascia, riprovare','Aggiungi una fascia fittizia');
		return -1;
	}
}

/**
 * Gestione dell'inserimento di una nuova fascia oraria su timbrature avente i parametri indicati
 * 
 * @param {Number} idDitta
 * @param {Number} inizioOrario
 * @param {Number} inizioPausa
 * @param {Number} finePausa
 * @param {Number} fineOrario
 *
 * @return {Number}
 * 
 * @properties={typeid:24,uuid:"516B5D02-ED30-4BD8-B6CF-D9A77A66F814"}
 */
function inserisciNuovaFasciaOrariaTimbrature(idDitta,inizioOrario,inizioPausa,finePausa,fineOrario)
{
	/** @type{JSFoundset<db:/ma_anagrafiche/ditte_fasceorarietimbrature>} */
	var fsFasceOrarieDittaTimbr = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.FASCE_ORARIE_DITTA_TIMBRATURE);
	var newRecordIndex = fsFasceOrarieDittaTimbr.newRecord(false);
	if(newRecordIndex >= 0)
	{
		// TODO inserire ciclo if per verifica orari inizio/fine
		var newRec = fsFasceOrarieDittaTimbr.getRecord(newRecordIndex);
		newRec.idditta = idDitta;
		newRec.inizioorario = inizioOrario;
		newRec.iniziopausa = inizioPausa;
		newRec.finepausa = finePausa;
		newRec.fineorario = fineOrario;
		
		if(!databaseManager.saveData(newRec))
		{
			globals.ma_utl_showErrorDialog('Errore durante il salvataggio della fascia, riprovare','Aggiungi una fascia fittizia');
			return -1;
		}
		else
			return newRec.iddittafasciaorariatimbrature;
	}
	else
	{
		globals.ma_utl_showErrorDialog('Errore durante la creazione del nuovo record per la fascia, riprovare','Aggiungi una fascia fittizia');
		return -1;
	}
}

/**
 * Aggiorna e prepara la visualizzazione degli orari del negozio nel giorno indicato
 * 
 *
 * @param {JSEvent} event the event that triggered the action
 * @param {Date} giorno
 * @param {Number} settimana
 * @param {Boolean} fromCopertura 
 * @param {Boolean} [openNewDialog]
 *  
 * @properties={typeid:24,uuid:"08B90512-63C3-4FC2-8B0E-5F9DED8A49EC"}
 * @AllowToRunInFind
 */
function refreshProgrammazioneGiornoNegozio(event,giorno,settimana,fromCopertura,openNewDialog) 
{
	/** @type Array<Number>*/
	var arrLav = []; 
	
	arrLav = globals.foundsetToArray(forms[event.getFormName()].foundset,'idlavoratore');
	
	if(arrLav.length)
	   globals.preparaProgrammazioneGiornoNegozio(forms.neg_header_dtl.idditta,arrLav,giorno,settimana,fromCopertura,openNewDialog);
	else
		globals.ma_utl_showWarningDialog('Nessun lavoratore programmabile nel giorno','Programmazione giorno della settimana');
}

/**
 * Aggiorna e prepara la visualizzazione degli orari del negozio nel giorno indicato
 * 
 *
 * @param {JSEvent} event the event that triggered the action
 * @param {Date} giorno
 * @param {Number} idLavoratore
 * @param {Number} settimana
 * @param {Boolean} fromCopertura
 * @param {Boolean} [openNewDialog]
 * 
 * @properties={typeid:24,uuid:"AFA88393-5F2B-4D03-AD00-8190A90441DF"}
 * @AllowToRunInFind
 */
function refreshProgrammazioneGiornoNegozioDip(event,giorno,idLavoratore,settimana,fromCopertura,openNewDialog) 
{
	/** @type Array<Number>*/
	var arrLav = []; 
	
	arrLav = idLavoratore ? [idLavoratore] : globals.foundsetToArray(forms[event.getFormName()].foundset,'idlavoratore');
	
	if(arrLav.length)
	   globals.preparaProgrammazioneGiornoNegozio(forms.neg_header_dtl.idditta,arrLav,giorno,settimana,fromCopertura,openNewDialog);
	else
		globals.ma_utl_showWarningDialog('Nessun lavoratore programmabile nel giorno','Programmazione giorno della settimana');
}

/**
 * Aggiorna e prepara la visualizzazione degli orari del negozio per la settimana indicata
 * 
 * @param {JSEvent} event
 * @param {Number} settimana
 * @param {Number} selIndex
 * @param {Boolean} fromCopertura
 *
 * @properties={typeid:24,uuid:"39361843-BE6D-40FE-9A6B-60122DFE7997"}
 */
function refreshProgrammazioneSettimanaNegozio(event,settimana,selIndex,fromCopertura)
{
	/** @type Array<Number>*/
    var arrLav = []; 
	    
	arrLav = globals.foundsetToArray(forms[event.getFormName()].foundset,'idlavoratore');
	
	if(arrLav.length)
	   globals.preparaProgrammazioneSettimanaNegozio(forms.neg_header_dtl.idditta,arrLav,settimana,selIndex,fromCopertura);
	else
		globals.ma_utl_showWarningDialog('Nessun lavoratore programmabile','Programmazione orario del punto vendita');
}

/**
 * Resetta ai valori vuoti i campi del record del foundset delle timbrature
 * passato come parametro
 * 
 * @param {JSRecord} rec
 * @param {Boolean} [pulisciTimbrature]
 * 
 * @properties={typeid:24,uuid:"AE6F5890-ED47-4AE8-B868-87F0E695AB21"}
 */
function pulisciFoundsetTimbrature(rec,pulisciTimbrature)
{
	if(pulisciTimbrature)
	   rec['e1'] = rec['u1'] = rec['e2'] = rec['u2'] = null;
			
	rec['tipo_riposo'] = 0;
	rec['id_ditta_fascia_oraria_timbrature'] = null;
	rec['id_fascia_oraria'] = globals.getFasciaOrariaDaTotaleOre(globals.getDitta(rec['idlavoratore']),0).idfasciaoraria;	
	
	rec['ore_programmato'] = null;
	rec['ore_ordinario'] = null;
	rec['ore_assenza'] = null;
	rec['ore_straordinario'] = null;
	rec['modificato'] = 1;
	
	// gestione giorno festivo : cancellando le timbrature il numero di ore festive e teoriche si aggiorna in base al totale di ore festive teoriche del giorno
	var giorno = forms.neg_prog_giorno_tab.vGiorno;
	var giornoIso = utils.dateFormat(giorno,globals.ISO_DATEFORMAT);
	if(forms.neg_header_options.vArrGiorniFestivi.indexOf(giornoIso) != -1)
	{
		var oreFestGod = globals.getOreFestivitaGoduta(giornoIso,rec['idlavoratore']);
		if(oreFestGod >= 0)
		{
			var recFasciaOrariaTeo = globals.getFasciaOrariaDaTotaleOre(globals.getDitta(rec['idlavoratore']),oreFestGod * 100);
			rec['id_fascia_oraria'] = recFasciaOrariaTeo.idfasciaoraria;
			rec['ore_teorico'] = recFasciaOrariaTeo.totaleorefascia / 100; 
			rec['ore_festivo'] = oreFestGod;
		}
	}
	else
		rec['ore_teorico'] = null;
	
}

/**
 * Resetta ai valori vuoti i campi del record del foundset delle timbrature
 * passato come parametro
 * 
 * @param {JSFoundSet} fs
 * @param {Number} rIndex
 * @param {Number} gIndex
 * @param {Boolean} [pulisciTimbrature]
 * 
 * @properties={typeid:24,uuid:"57B28778-F801-41D7-A294-52FDABEDC581"}
 */
function pulisciFoundsetTimbratureSettimana(fs,rIndex,gIndex,pulisciTimbrature)
{
	var frm = forms['neg_prog_settimana_tbl_temp'];
	var rec = fs.getRecord(rIndex);
	
	if(pulisciTimbrature)
	   rec['e1_'+ gIndex] = rec['u1_'+ gIndex] = rec['e2_'+ gIndex] = rec['u2_'+ gIndex] = null;
	
	// id del lavoratore
	/** @type {Number}*/
	var idLav = rec['idlavoratore'];
	
	// caso giorno ordinario
	var vGiorno = new Date(forms.neg_prog_settimana_tab.vPrimoGiornoSettimana.getFullYear(),
		                   forms.neg_prog_settimana_tab.vPrimoGiornoSettimana.getMonth(),
						   forms.neg_prog_settimana_tab.vPrimoGiornoSettimana.getDate() + gIndex - 1); 
	var vGiornoIso = utils.dateFormat(vGiorno,globals.ISO_DATEFORMAT);
	
	// mantenimento della situazione nel caso di giorno riposo primario
	var tipoRiposo = getGiornoRiposoSettimanale(idLav,vGiorno,1) == null ? 1 : 0
	rec['tipo_riposo_' + gIndex] = tipoRiposo;
	rec['id_ditta_fascia_oraria_timbrature_' + gIndex] = null;
	rec['id_fascia_oraria_' + gIndex] = globals.getFasciaOrariaDaTotaleOre(globals.getDitta(idLav),0).idfasciaoraria;	
	
	frm['ore_programmato_' + rIndex + '_' + gIndex] = rec['ore_programmato_' + gIndex] = null;
	rec['ore_ordinario_' + gIndex] = null;
	rec['ore_assenza_' + gIndex] = null;
	rec['ore_straordinario_' + gIndex] = null;
	rec['modificato_' + gIndex] = 1;
			
	// gestione giorno festivo : cancellando le timbrature il numero di ore festive e teoriche si aggiorna in base al totale di ore festive teoriche del giorno
	if(forms.neg_header_options.vArrGiorniFestivi.indexOf(vGiornoIso) != -1)
	{	
		var oreFestGod = globals.getOreFestivitaGoduta(vGiornoIso,idLav);
		if(oreFestGod)
		{	
			var recFasciaOrariaTeo = globals.getFasciaOrariaDaTotaleOre(globals.getDitta(idLav),oreFestGod * 100);
			rec['id_fascia_oraria_' + gIndex] = recFasciaOrariaTeo.idfasciaoraria;
			rec['ore_teorico_' + gIndex] = recFasciaOrariaTeo.totaleorefascia / 100; 
			rec['ore_festivo_' + gIndex] = oreFestGod;
		}
	}
	else
		rec['ore_teorico_' + gIndex] = null;
	
	aggiornaTotaleOreGiornata(gIndex);
}

/**
 * @AllowToRunInFind
 * 
 * Restituisce l'array con gli identificativi dei lavoratori della ditta relativamente alla settimana dell'anno
 * 
 * @param {Date} primoGGSettimana
 * @param {Date} ultimoGGSettimana
 *  
 * @return {Array<Number>}
 * 
 * @properties={typeid:24,uuid:"14341BD1-DE76-4547-90C2-25906C628CCE"}
 */
function getLavoratoriSettimanaAnno(primoGGSettimana,ultimoGGSettimana)
{	
	var arrLavSettimana = [];
	
	// ordinamento in base a livello gerarchico per inserimento orari da parte del responsabile
    var arrLivGer = globals.ma_sec_getUsers(globals.svy_sec_lgn_organization_id,true);
    // se sono presenti utenti dello stesso livello o di qualche sottolivello dell'organizzazione
    if(arrLivGer)
    {
		var arrLav = []; 
		
		// recuperiamo i lavoratori/utenti attivi nella settimana
		/** @type {JSFoundset<db:/ma_anagrafiche/lavoratori>}*/
		var fsLav = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.LAVORATORI);
		if(fsLav.find())
		{
			fsLav.cessazione = '^||>='  + globals.formatForFind(primoGGSettimana);
			fsLav.assunzione = '<='  + globals.formatForFind(ultimoGGSettimana);
			
			if(fsLav.search())
				arrLav = globals.foundsetToArray(fsLav,'idlavoratore');
			
	    }
		
	    // confrontiamo gli array ottenuti creando quello effettivo
	    for(var lg = 0; lg < arrLivGer.length; lg++)
	    {
	    	if(arrLav.indexOf(arrLivGer[lg]) != -1)
	    		arrLavSettimana.push(arrLivGer[lg])
	    }
	    
    }
    
	return arrLavSettimana;
}

/**
 * @AllowToRunInFind
 * 
 * Restituisce l'array con gli identificativi dei lavoratori della ditta relativamente alla settimana dell'anno
 * 
 * @param {Number} idDitta
 * @param {Date} primoGGSettimana
 * @param {Date} ultimoGGSettimana
 *   
 * @return {Array<Number>}
 * 
 * @properties={typeid:24,uuid:"F996DEB2-EF26-483B-9DB2-85ED2724E339"}
 */
function getLavoratoriDittaSettimanaAnno(idDitta,primoGGSettimana,ultimoGGSettimana)
{	
	var arrLavSettimana = [];
	
	// ordinamento in base a livello gerarchico per inserimento orari da parte del gestore 
    var arrLivGer = globals.ma_sec_getUsers(globals.svy_sec_lgn_organization_id,true,true);
    
    // eliminazione di eventuali lavoratori (user_id) doppi (appartenenti a più organizzazioni aventi
    // livello gerarchico inferiore)
    arrLivGer = (function(arr){
    	  var m = {}, newarr = []
    	  for (var i=0; i<arr.length; i++) {
    	    var v = arr[i];
    	    if (!m[v]) {
    	      newarr.push(v);
    	      m[v]=true;
    	    }
    	  }
    	  return newarr;
    	})(arrLivGer);
    
    // se sono presenti utenti dello stesso livello o di qualche sottolivello dell'organizzazione
    if(arrLivGer)
    {
		var arrLav = []; 
		
		// recuperiamo i lavoratori/utenti attivi nella settimana
		/** @type {JSFoundset<db:/ma_anagrafiche/lavoratori>}*/
		var fsLav = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.LAVORATORI);
		if(fsLav.find())
		{
			var params = globals.inizializzaParametriAttivaMese(idDitta
														        ,globals.getAnno() * 100 + globals.getMese()
														        ,globals.getGruppoInstallazioneDitta(idDitta)
														        ,''
																,globals.TipoConnessione.CLIENTE);

			var arrLavGruppo = globals.getLavoratoriGruppo(params,params.idditta);
		    fsLav.idlavoratore = arrLavGruppo;
			fsLav.cessazione = '^||>='  + globals.formatForFind(primoGGSettimana);
			fsLav.assunzione = '<='  + globals.formatForFind(ultimoGGSettimana);
			
			if(fsLav.search())
			{
				fsLav.sort('lavoratori_to_persone.nominativo asc');
				arrLav = globals.foundsetToArray(fsLav,'idlavoratore');
			}
	    }
		
	    // confrontiamo gli array ottenuti creando quello effettivo
	    for(var l = 0; l < arrLivGer.length; l++)
	    {
	    	if(arrLav.indexOf(arrLivGer[l]) != -1)
	    		arrLavSettimana.push(arrLivGer[l])
	    }
	    
    }
    
	return arrLavSettimana;
}

/**
 * @AllowToRunInFind
 * 
 * Restituisce l'array con gli identificativi dei lavoratori della ditta relativamente alla settimana dell'anno
 * 
 * @param {Date} primoGGSettimana
 * @param {Date} ultimoGGSettimana
 *   
 * @return {Array<Number>}
 * 
 * @properties={typeid:24,uuid:"917CDD24-AAEF-4DEA-8350-2B6CC5802065"}
 */
function getLavoratoriReteImpresaSettimanaAnno(primoGGSettimana,ultimoGGSettimana)
{	
	var arrLavSettimana = [];
	
	// ordinamento in base a livello gerarchico per inserimento orari da parte del responsabile
    var arrLivGer = globals.ma_sec_getUsers(globals.svy_sec_lgn_organization_id,true,true);
   
    arrLivGer = (function(arr){
  	  var m = {}, newarr = []
  	  for (var i=0; i<arr.length; i++) {
  	    var v = arr[i];
  	    if (!m[v]) {
  	      newarr.push(v);
  	      m[v]=true;
  	    }
  	  }
  	  return newarr;
  	})(arrLivGer);
    
    // se sono presenti utenti dello stesso livello o di qualche sottolivello dell'organizzazione
    if(arrLivGer)
    {
		var arrLav = []; 
		
		// recuperiamo i lavoratori/utenti attivi nella settimana
		/** @type {JSFoundset<db:/ma_anagrafiche/lavoratori>}*/
		var fsLav = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.LAVORATORI);
		if(fsLav.find())
		{
			fsLav.idlavoratore = arrLivGer;
			fsLav.cessazione = '^||>='  + globals.formatForFind(primoGGSettimana);
			fsLav.assunzione = '<='  + globals.formatForFind(ultimoGGSettimana);
			if(fsLav.search())
				arrLav = globals.foundsetToArray(fsLav,'idlavoratore');
			
	    }
		
	    // confrontiamo gli array ottenuti creando quello effettivo
	    for(var l = 0; l < arrLivGer.length; l++)
	    {
	    	if(arrLav.indexOf(arrLivGer[l]) != -1)
	    		arrLavSettimana.push(arrLivGer[l])
	    }
	    
    }
    
	return arrLavSettimana;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 * @param {Boolean} [visualizzaSettPrec]
 * 
 * @properties={typeid:24,uuid:"D55D3F9C-9ECF-4990-A643-AC83D5D069A0"}
 */
function refreshProgrammazioneNegozio(event,visualizzaSettPrec) 
{
	// recupera i dati necessari per la programmazione degli orari del negozio
	preparaProgrammazioneSettimanalePeriodoNegozio(visualizzaSettPrec);
}

/**
 * @param event
 * 
 * @properties={typeid:24,uuid:"8AC8A2E0-5D3B-4A6B-B20B-B5BAE475CB77"}
 */
function refreshProgrammazioneNegozioAccordion(event) 
{
	// recupera i dati necessari per la programmazione degli orari del negozio
	preparaProgrammazioneSettimanalePeriodoNegozioAccordion();
}

/**
 * Preparazione e disegno del riepilogo mensile con visualizzazione per
 * tutte le settimane del periodo selezionato
 * (se indicato visualizza anche le due settimane precedenti alla prima normalmente visualizzabile)
 * 
 * @param {Boolean} [visualizzaPrec]
 * 
 * @properties={typeid:24,uuid:"8208AF46-CAD0-43F8-B093-E81C1E492123"}
 * @AllowToRunInFind
 */
function preparaProgrammazioneSettimanalePeriodoNegozio(visualizzaPrec)
{
	forms.neg_prog_periodo_tab.vSettimanaDaCopiare = null;
	forms.neg_prog_periodo_tab.vDipendenteDaCopiare = null;
	forms.neg_prog_periodo_tab.vSettimanaDipendenteDaCopiare = null;
	
	var _anno = globals.getAnno();
	var _mese = globals.getMese();
	var _tipoGestoreReteImpresa = globals.getTipoGestoreReteImpresa();
	forms.neg_prog_periodo_tab._tipoGestoreReteImpresa = _tipoGestoreReteImpresa;
	
	// settaggio form contenitore
	var oriForm = forms.neg_prog_periodo_settimane_tab;
	var oriFormName = oriForm.controller.getName();
	var newFormName = oriFormName + '_temp';
	
	// rimozione di tabpanels precedenti
	forms.neg_prog_periodo_tab.elements.tab_prog_periodo.removeAllTabs();
	
	// rimozione eventuali forms con lo stesso nome
	if(solutionModel.getForm(newFormName))
    {
    	history.removeForm(newFormName);
    	solutionModel.removeForm(newFormName);
    }
	// creazione della nuova form dinamica
	var newForm = solutionModel.newForm(newFormName,solutionModel.getForm(oriFormName));
	newForm.navigator = SM_DEFAULTS.NONE;
		
	var primoGiornoPeriodo = new Date(_anno, _mese - 1,1);
	var primaSettimana = globals.getWeekNumber(primoGiornoPeriodo);
	var primaSettimanaCalc = primaSettimana;
	if(primaSettimana == 53 || primaSettimana == 52)
		primaSettimanaCalc = 0;
	else if(visualizzaPrec) 
	{
		if(primaSettimanaCalc >= 2)
	        primaSettimanaCalc -= 2;
	    else if(primaSettimanaCalc >= 1)
		    primaSettimanaCalc -= 1;
	}	
	forms.neg_prog_periodo_tab._primaSettimanaCalc = primaSettimanaCalc;
	
	var primoGiornoSettimana = null;
	var ultimoGiornoSettimana = null;
	primoGiornoSettimana = globals.getDateOfISOWeek(primaSettimanaCalc,_anno);
	ultimoGiornoSettimana = new Date(primoGiornoSettimana.getFullYear(),primoGiornoSettimana.getMonth(),primoGiornoSettimana.getDate() + 6);
	
	// per la visualizzazione di una situazione il più possibile basata sui dati effettivi, recuperiamo il numero dei lavoratori 
	// attivi nella varie settimane in maniera da poter definire precisamente le dimensioni degli elementi
	var arrLav = [];
	// definiremo l'altezza in base al numero di lavoratori attivi ottenuti in precedenza 
	var tabHeight = 0;
	
	var x=0;
    var y=0;
    var tabWidth = 640;
        
	// ciclo su settimane del mese selezionato (10 valore casuale, l'algoritmo si interrompe al cambio di mese)
	for(var sett = 0; sett <= 10; sett++)
	{
		primoGiornoSettimana = globals.getDateOfISOWeek(primaSettimanaCalc + sett,_anno);
		// se il primo giorno della settimana che stiamo valutando appartiene al mese successivo 
		// la settimana in questione andrà valutata nella gestione settimanale del mese corrispondente 
		if((_mese == 1 && primoGiornoSettimana.getMonth() > (_mese - 1) && primoGiornoSettimana.getFullYear() >= _anno)
			|| ((_mese != 1 && primoGiornoSettimana.getMonth() > (_mese - 1)) || primoGiornoSettimana.getFullYear() > _anno))
			break;
		
		ultimoGiornoSettimana = new Date(primoGiornoSettimana.getFullYear(),primoGiornoSettimana.getMonth(),primoGiornoSettimana.getDate() + 6);
		
		// array dei lavoratori attivi nella specifica settimana
		switch(_tipoGestoreReteImpresa)
		{
			// caso responsabile del punto vendita -> i dipendenti sono quelli corrispondenti agli utenti con livello gerarchico inferiore
			case 0:
			arrLav = globals.getLavoratoriSettimanaAnno(primoGiornoSettimana,ultimoGiornoSettimana);
			break;
			// caso gestore con ditta selezionata
			case 1:
			arrLav = globals.getLavoratoriDittaSettimanaAnno(forms.neg_header_dtl.idditta,primoGiornoSettimana,ultimoGiornoSettimana);
			break;
			// caso gestore intera rete di impresa
			case 2: 
			arrLav = globals.getLavoratoriReteImpresaSettimanaAnno(primoGiornoSettimana,ultimoGiornoSettimana);
			break;
		}
		
		// altezza del tab relativo alla settimana
		tabHeight = 50 + (arrLav.length + 1) * 20;
		
		// rimozione forms dettaglio copertura settimana precedente
		var numSetRiferimento = primaSettimanaCalc + sett //((primaSettimana + sett) <= _numSett ? (primaSettimana + sett) : (primaSettimana + sett - _numSett));
		var settCopFormOri = forms.neg_prog_periodo_settimana_copertura;
		var settCopFormOriName = settCopFormOri.controller.getName();
		var settCopFormName = settCopFormOriName + '_' + numSetRiferimento;
		
		if(solutionModel.getForm(settCopFormName))
		{
			history.removeForm(settCopFormName);
			solutionModel.removeForm(settCopFormName);
		}
		
		// rimozione forms contenitore del dettaglio eliminato in precedenza
		var settFormOri = forms.neg_prog_periodo_settimana;
		var settFormOriName = settFormOri.controller.getName();
		var settFormName = settFormOriName + '_' + numSetRiferimento;
		
		if(solutionModel.getForm(settFormName))
		{
			// ulteriore rimozione dei tabs interni con l'effettivo riepilogo
			forms[settFormName].elements.tab_neg_prog_settimana.removeAllTabs();
			history.removeForm(settFormName);
			solutionModel.removeForm(settFormName);
		}
				
        var settForm = solutionModel.cloneForm(settFormName,solutionModel.getForm(settFormOriName))
			
		var tabPanelSettimana = newForm.newTabPanel('tab_prog_settimana_tabpanel_' + numSetRiferimento
											        ,x
													,y
													,tabWidth
													,tabHeight);
	    tabPanelSettimana.visible = true;
	    tabPanelSettimana.transparent = true;
	    tabPanelSettimana.tabOrientation = SM_ALIGNMENT.TOP;
	    tabPanelSettimana.anchors = SM_ANCHOR.NORTH | SM_ANCHOR.EAST | SM_ANCHOR.WEST | SM_ANCHOR.SOUTH;
	    tabPanelSettimana.scrollTabs = false;
    	    
	    var tabPanelSettHeader = 'Settimana ' + (primaSettimanaCalc + sett == 0 ? primaSettimana : numSetRiferimento) 
											  + ' - [' + 
		                         globals.getNomeInteroGiorno(primoGiornoSettimana) + ' ' +
								 globals.getNumGiorno(primoGiornoSettimana) + '/' +
								 globals.getNumMese(primoGiornoSettimana.getMonth() + 1) +
		                         ' - ' + 
								 globals.getNomeInteroGiorno(ultimoGiornoSettimana) + ' '+ 
								 globals.getNumGiorno(ultimoGiornoSettimana) + '/' +
								 globals.getNumMese(ultimoGiornoSettimana.getMonth() + 1) +']';
	    tabPanelSettimana.newTab('tab_prog_settimana_' + numSetRiferimento
								 ,tabPanelSettHeader
								 ,settForm);
	
		y += (tabHeight + 10);
	}
	forms.neg_prog_periodo_tab._numSett = sett;
	
	solutionModel.getForm(newFormName).getBodyPart().height = (tabHeight + 15) * sett;
	
	forms.neg_prog_periodo_tab.elements.tab_prog_periodo.addTab(newFormName,newFormName);
	
	// per ogni settimana visualizzata prepara il riepilogo della situazione
	for (var s = 0; s < sett; s++)
	{
		var currFrmName = 'neg_prog_periodo_settimana_' + (primaSettimanaCalc + s);
		/** @type {Form<neg_prog_periodo_settimana>}*/
		var currFrm = forms[currFrmName];

		// lancia la preparazione del riepilogo settimanale
		currFrm.preparaProgrammazioneSettimanaNegozio(primaSettimanaCalc + s
													  ,_anno
													  ,_tipoGestoreReteImpresa);
	}
	
}

/**
 * Preparazione e disegno del riepilogo mensile con visualizzazione per 
 * settimana singola tramite accordion panel
 *  
 * @param {Number} [settimana]
 *
 * @properties={typeid:24,uuid:"6A883328-CE50-46B8-BC20-DFDC92C81897"}
 */
function preparaProgrammazioneSettimanalePeriodoNegozioAccordion(settimana)
{
	forms.neg_prog_periodo_tab.vSettimanaDaCopiare = settimana;
	forms.neg_prog_periodo_tab.vDipendenteDaCopiare = null;
	forms.neg_prog_periodo_tab.vSettimanaDipendenteDaCopiare = null;
	
	var _anno = globals.getAnno();
	var _numSett = globals.getNumSettimaneAnno(_anno);
	var _mese = globals.getMese();
	
	// settaggio form contenitore
	var oriForm = forms.neg_prog_periodo_settimane_tab;
	var oriFormName = oriForm.controller.getName();
	var newFormName = oriFormName + '_temp';
	
	// rimozione di tabpanels precedenti
	forms.neg_prog_periodo_tab.elements.tab_prog_periodo.removeAllTabs();
	// rimozione eventuali forms con lo stesso nome
	if(solutionModel.getForm(newFormName))
    {
    	history.removeForm(newFormName);
    	solutionModel.removeForm(newFormName);
    }
	// creazione della nuova form dinamica
	var newForm = solutionModel.newForm(newFormName,solutionModel.getForm(oriFormName));
	newForm.navigator = SM_DEFAULTS.NONE;
	newForm.styleClass = 'leaf_style';
	
	var primoGiornoPeriodo = new Date(_anno, _mese - 1,1);
	var primaSettimana = globals.getWeekNumber(primoGiornoPeriodo);
	var primoGiornoSettimana = null;
	var ultimoGiornoSettimana = null;
	
	primoGiornoSettimana = globals.getDateOfISOWeek(primaSettimana,_anno);
	ultimoGiornoSettimana = new Date(primoGiornoSettimana.getFullYear(),primoGiornoSettimana.getMonth(),primoGiornoSettimana.getDate() + 6);
	
	// per la visualizzazione di una situazione il più possibile basata sui dati effettivi, recuperiamo il numero delle settimane 
	// nel periodo considerato ed il numero dei lavoratori attivi nella prima settimana in maniera da poter definire le dimensioni
	// degli elementi il più vicino possibile a quelle effettive
	var arrLav = globals.getLavoratoriSettimanaAnno(primoGiornoSettimana,ultimoGiornoSettimana);
	
	// per definire l'altezza in base al numero di lavoratori attivi nella settimana
	var tabHeight = (arrLav.length + 1) * 30;
	
	var x=0;
    var y=0;
    var tabWidth = 640;
    
    var tabPanelSettimana = newForm.newTabPanel('tab_prog_settimana_tabpanel_' + (primaSettimana + sett)
										        ,x
												,y
												,tabWidth
												,tabHeight + 40 * 4);
    tabPanelSettimana.visible = true;
    tabPanelSettimana.transparent = true;
    tabPanelSettimana.tabOrientation = JSTabPanel.ACCORDION_PANEL;
    tabPanelSettimana.anchors = SM_ANCHOR.NORTH | SM_ANCHOR.EAST | SM_ANCHOR.WEST | SM_ANCHOR.SOUTH;
    tabPanelSettimana.scrollTabs = false;
        
	// ciclo su settimane del mese selezionato (10 valore casuale, l'algoritmo si interrompe al cambio di mese)
	for(var sett = 0; sett <= 10; sett++)
	{		
		primoGiornoSettimana = globals.getDateOfISOWeek(primaSettimana + sett,_anno);
		// se il primo giorno della settimana che stiamo valutando appartiene al mese successivo 
		// la settimana in questione andrà valutata nella gestione settimanale del mese corrispondente 
		if((_mese == 1 && primoGiornoSettimana.getMonth() > (_mese - 1) && primoGiornoSettimana.getFullYear() >= _anno)
				|| ((_mese != 1 && primoGiornoSettimana.getMonth() > (_mese - 1)) || primoGiornoSettimana.getFullYear() > _anno))
				break;
		
		ultimoGiornoSettimana = new Date(primoGiornoSettimana.getFullYear(),primoGiornoSettimana.getMonth(),primoGiornoSettimana.getDate() + 6);
		
		// rimozione forms dettaglio copertura settimana precedente
		var settCopFormOri = forms.neg_prog_periodo_settimana_copertura;
		var settCopFormOriName = settCopFormOri.controller.getName();
		var settCopFormName = settCopFormOriName + '_' + (primaSettimana + sett);
		
		if(solutionModel.getForm(settCopFormName))
		{
			history.removeForm(settCopFormName);
			solutionModel.removeForm(settCopFormName);
		}
		
		// rimozione forms contenitore del dettaglio eliminato in precedenza
		var settFormOri = forms.neg_prog_periodo_settimana;
		var settFormOriName = settFormOri.controller.getName();
		var settFormName = settFormOriName + '_' + (primaSettimana + sett);
		
		if(solutionModel.getForm(settFormName))
		{
			// ulteriore rimozione dei tabs interni con l'effettivo riepilogo
			forms[settFormName].elements.tab_neg_prog_settimana.removeAllTabs();
			history.removeForm(settFormName);
			solutionModel.removeForm(settFormName);
		}
				
        var settForm = solutionModel.cloneForm(settFormName,solutionModel.getForm(settFormOriName))
	    solutionModel.getForm(settFormName).getBodyPart().height = (tabHeight - 20);
        
		var tabPanelSettHeader = 'Settimana ' + (primaSettimana + sett) + ' - [' + 
		                         globals.getNomeInteroGiorno(primoGiornoSettimana) + ' ' +
								 globals.getNumGiorno(primoGiornoSettimana) + '/' +
								 globals.getNumMese(primoGiornoSettimana.getMonth() + 1) +
		                         ' - ' + 
								 globals.getNomeInteroGiorno(ultimoGiornoSettimana) + ' '+ 
								 globals.getNumGiorno(ultimoGiornoSettimana) + '/' +
								 globals.getNumMese(ultimoGiornoSettimana.getMonth() + 1) +']';
	    tabPanelSettimana.newTab('tab_prog_settimana_' + 
	    	                     ((primaSettimana + sett) <= _numSett ? (primaSettimana + sett) : (primaSettimana + sett - _numSett))
								 ,tabPanelSettHeader
								 ,settForm);
	    forms[settFormName].elements['tab_neg_prog_settimana'].setSize(forms[settFormName].elements['tab_neg_prog_settimana'].getWidth(),tabHeight - 20);
	    
		y += tabHeight;
	}
	
	solutionModel.getForm(newFormName).getBodyPart().height = tabHeight * sett;
	
	forms.neg_prog_periodo_tab.elements.tab_prog_periodo.addTab(newFormName,newFormName);
	
	// per ogni settimana visualizzata prepara il riepilogo della situazione
	for (var s = 0; s < sett; s++)
	{
		primoGiornoSettimana = globals.getDateOfISOWeek(primaSettimana + s,_anno);
		ultimoGiornoSettimana = new Date(primoGiornoSettimana.getFullYear(),primoGiornoSettimana.getMonth(),primoGiornoSettimana.getDate() + 6);
		
		var currFrmName = 'neg_prog_periodo_settimana_' + (primaSettimana + s);
		/** @type {Form<neg_prog_periodo_settimana>}*/
		var currFrm = forms[currFrmName];

		//preparazione del riepilogo settimanale del negozio
		currFrm.preparaProgrammazioneSettimanaNegozio(primaSettimana + s
													  ,_anno)
	}
	
}

/**
 * Visualizzazione grafica delle righe in programmazione giorno
 * 
 * @param {JSRenderEvent} event the render event
 *
 * @properties={typeid:24,uuid:"FE13F8B6-FED3-492F-8618-B3AEA5810FBB"}
 */
function onRenderGiornoNegozio(event)
{
	var rec = event.getRecord();
	var ren = event.getRenderable();
	var elemName = ren.getName();
	
	if(rec) 
	{
		if(rec['non_attivo'] == 1)
		{
			ren.bgcolor = 'gray';
			ren.toolTipText = 'Dipendente non ancora assunto o già cessato non modificabile';
			ren.enabled = false;
		}
		else if(rec['regola_zero_ore'] == 1)
		{
			ren.bgcolor = 'gray';
			ren.toolTipText = 'Dipendente con regola a zero ore non modificabile';
			ren.enabled = false;
		}
		
		if(elemName == 'fld_ore_programmato' || elemName == 'fld_ore_ordinario'  || elemName == 'fld_ore_festivo' || elemName == 'fld_ore_straordinario' || elemName == 'fld_ore_assenza')
		{
			ren.bgcolor = '#c8c8c8';
			ren.enabled = false;			
		}
		
	}
}

/**
 * Visualizzazione grafica delle righe in programmazione giorno
 * 
 * @param {JSRenderEvent} event the render event
 *
 *
 * @properties={typeid:24,uuid:"AB9F0B45-D940-4FC5-8812-E02AF622D99E"}
 */
function onRenderSettimanaNegozio(event)
{
	var rec = event.getRecord();
	var ren = event.getRenderable();
	var elemName = ren.getName();
	var elemIndex = parseInt(utils.stringRight(elemName,1),10);
	
	if(rec) 
	{
		if(utils.stringLeft(elemName,5) == 'fld_E' || utils.stringLeft(elemName,5) == 'fld_U')
		{
			if(rec['non_attivo_' + elemIndex] == 1)
			{
				ren.bgcolor = 'gray';
				ren.toolTipText = 'Dipendente non ancora assunto o già cessato non modificabile';
				ren.enabled = false;
			}
			else if(rec['regola_zero_ore_' + elemIndex] == 1)
			{
				ren.bgcolor = 'gray';
				ren.toolTipText = 'Dipendente con regola a zero ore non modificabile';
				ren.enabled = false;
		    }
		    
		}
				
	}
}

/**
 * Visualizzazione grafica delle righe in programmazione giorno
 * 
 * @param {JSRenderEvent} event the render event
 *
 * @properties={typeid:24,uuid:"0F5A0162-9829-48B0-B8D2-F31E1762CB0C"}
 */
function onRenderGiornoNegozioOreTeoriche(event)
{
	var rec = event.getRecord();
	var ren = event.getRenderable();
	
	if(rec)
	{
		if(rec['non_attivo'] == 1)
		{
			ren.bgcolor = '#c8c8c8';
			ren.toolTipText = 'Dipendente non ancora assunto o già cessato non modificabile';
			ren.enabled = false;
		}
		else if(rec['regola_zero_ore'] == 1)
		{
			ren.bgcolor = '#c8c8c8';
			ren.toolTipText = 'Dipendente con regola a zero ore non modificabile';
			ren.enabled = false;
		}

	}
}

/**
 * Visualizzazione grafica delle righe in programmazione settimana
 * 
 * @param {JSRenderEvent} event
 *
 * @properties={typeid:24,uuid:"7C1A3509-F297-4CB3-9842-6BD9DC6EB509"}
 */
function onRenderOreProgSettimana(event)
{
	var ren = event.getRenderable();
	
	ren.bgcolor = '#c8c8c8';
	ren.transparent = false;
}

/**
 * Costruisce la stringa per il riepilogo della situazione timbrature per il tooltip sul giorno della programamzione settimanale
 *  
 * @param {Array<Number>} arrLavoratori
 * @param {Date} giorno
 *
 * @properties={typeid:24,uuid:"DA4FB698-2519-44FD-9EB2-D69F6106BE21"}
 */
function getTooltipProgrammazioneSettimanale(arrLavoratori,giorno)
{
	var tooltipText = 'Programmazione per il giorno ' + globals.getNomeInteroGiorno(giorno) + ' ' + globals.getNumGiorno(giorno) +
	                  ' ' + globals.getNomeMese(giorno.getMonth() + 1) + ' :<br/><br/>';
	for(var l = 1; l <= arrLavoratori.length; l++)
	{
		tooltipText += globals.getNominativo(arrLavoratori[l-1]);
		
		tooltipText += '  ';
		
		var recFascia = scopes.giornaliera.getProgrammazioneFasceGiorno(arrLavoratori[l-1],giorno);
		if(recFascia != null)
		{
			var recDittaTimbr = globals.getFasciaOrariaDittaTimbratureDaFascia(recFascia.iddittafasciaorariatimbrature);
			if(recDittaTimbr != null)
			{
				tooltipText += recDittaTimbr.inizio_orario_oremin;
				tooltipText += ' - ';
				if(recDittaTimbr.inizio_pausa_oremin)
				{
					tooltipText += recDittaTimbr.inizio_pausa_oremin;
					tooltipText += ',';
					tooltipText += recDittaTimbr.fine_pausa_oremin;
					tooltipText += ' - ';
				}
				tooltipText += recDittaTimbr.fine_orario_oremin;
			}
		}
		tooltipText += '<br/>';
	}
	
	return tooltipText;
}

/**
 * Ottiene il dataset contenente le timbrature associate alla fascia oraria ditta timbrature
 * salvate nelle fasce programmate suddivedendole tra appartenenti alla mattina ed al pomeriggio
 *  
 * @param {Number} idLavoratore
 * @param {Number} settimana
 * @param {Number} anno
 *
 * @return {Array}
 * 
 * @properties={typeid:24,uuid:"DF2EE79F-7F24-4693-A27C-61881BCC9223"}
 * @AllowToRunInFind
 */
function ottieniDataSetFasceProgrammate(idLavoratore, settimana, anno) 
{
	var primoGgSettimana = globals.getDateOfISOWeek(settimana, anno);

	/** @type {JSFoundset<db:/ma_presenze/e2giornalieraprogfasce>} */
	var fsProg = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.GIORNALIERA_PROGFASCE);

	var colNames = ['idlavoratore','cognome', 'nome',
					'lunedi_fascia','martedi_fascia','mercoledi_fascia','giovedi_fascia',
					'venerdi_fascia','sabato_fascia','domenica_fascia'];
	var dsFasceProgrammate = databaseManager.createEmptyDataSet(1, colNames);

	// idlavoratore
	dsFasceProgrammate.setValue(1, 1, idLavoratore);
	// cognome
	dsFasceProgrammate.setValue(1, 2, globals.getCognome(idLavoratore));
	// nome
	dsFasceProgrammate.setValue(1, 3, globals.getNome(idLavoratore));

	for (var g = 0; g <= 6; g++) {
		var giorno = new Date(primoGgSettimana.getFullYear(), primoGgSettimana.getMonth(), primoGgSettimana.getDate() + g)
		if (fsProg.find()) {
			fsProg.iddip = idLavoratore;
			fsProg.giorno = giorno;
			// se è stata programmata una fascia nella giornata
			var recIndex = fsProg.search();
			if (recIndex) 
				dsFasceProgrammate.setValue(1,g + 4,fsProg.iddittafasciaorariatimbrature);
		}
	}

	return dsFasceProgrammate.getRowAsArray(1);
}

/**
 * @AllowToRunInFind
 * 
 * Ritorna l'orario minimo programmato per i lavoratori passati relativamente al giorno indicato
 *  
 * @param {Array<Number>} arrLavoratori
 * @param {Date} giorno
 *
 * @properties={typeid:24,uuid:"940A03E1-6146-4AC6-AA74-E2A7209DDC8F"}
 */
function getMinOrarioInizialeGiorno(arrLavoratori,giorno)
{
	var minOrario = 2359;
	/** @type {JSFoundset<db:/ma_presenze/e2giornalieraprogfasce>} */
	var fsProg = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.GIORNALIERA_PROGFASCE);
    if(fsProg.find())
    {
    	fsProg.iddip = arrLavoratori;
    	fsProg.giorno = giorno;
    	if(fsProg.search())
    	{
    		for(var p = 1; p <= fsProg.getSize(); p++)
    		{
    			if(fsProg.getRecord(p).e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.inizioorario < minOrario)
    				minOrario = fsProg.getRecord(p).e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.inizioorario;
    		}
    	}
    }
    
    return minOrario;
}

/**
 * @AllowToRunInFind
 * 
 * Ritorna l'orario massimo programmato per i lavoratori passati relativamente al giorno indicato
 *  
 * @param {Array<Number>} arrLavoratori
 * @param {Date} giorno
 *
 * @properties={typeid:24,uuid:"F2330329-BFA9-4731-BC14-A01D08D70FC2"}
 */
function getMaxOrarioFinaleGiorno(arrLavoratori,giorno)
{
	var maxOrario = 0;
	/** @type {JSFoundset<db:/ma_presenze/e2giornalieraprogfasce>} */
	var fsProg = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.GIORNALIERA_PROGFASCE);
	if(fsProg.find())
    {
    	fsProg.iddip = arrLavoratori;
    	fsProg.giorno = giorno;
    	if(fsProg.search())
    	{
    		for(var p = 1; p <= fsProg.getSize(); p++)
    		{
    			if(maxOrario < fsProg.getRecord(p).e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.fineorario)
    				maxOrario = fsProg.getRecord(p).e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.fineorario;
    		}
    	}
    }
    
    return maxOrario;
}

/**
 * Ottiene il dataset contenente le timbrature associate alla fascia oraria ditta timbrature
 * salvate nelle fasce programmate 
 *  
 * @param {Number} idLavoratore
 * @param {Number} settimana
 * @param {Number} anno
 *
 * @return {Array}
 * 
 * @properties={typeid:24,uuid:"F49557DA-3E93-47FA-8FCC-932F33BA094E"}
 * @AllowToRunInFind
 */
function ottieniDataSetTimbrProgrammate(idLavoratore, settimana, anno) 
{
	var primoGgSettimana = globals.getDateOfISOWeek(settimana, anno);

	/** @type {JSFoundset<db:/ma_presenze/e2giornalieraprogfasce>} */
	var fsProg = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.GIORNALIERA_PROGFASCE);

	var colNames = ['idlavoratore','cognome', 'nome', 'lunedi', 'martedi', 'mercoledi', 'giovedi','venerdi','sabato','domenica'];
	var dsTimbrProgrammate = databaseManager.createEmptyDataSet(1, colNames);

	// idlavoratore
	dsTimbrProgrammate.setValue(1, 1, idLavoratore);
	// cognome
	dsTimbrProgrammate.setValue(1, 2, globals.getCognome(idLavoratore));
	// nome
	dsTimbrProgrammate.setValue(1, 3, globals.getNome(idLavoratore));

	for (var g = 0; g <= 6; g++) {
		
		var timbrStr = '';
		dsTimbrProgrammate.setValue(1,g + 4,timbrStr);
		
		var giorno = new Date(primoGgSettimana.getFullYear(), primoGgSettimana.getMonth(), primoGgSettimana.getDate() + g)
		if (fsProg.find()) {
			fsProg.iddip = idLavoratore;
			fsProg.giorno = giorno;
			// se è stata programmata una fascia nella giornata
			var recIndex = fsProg.search();
			if (recIndex) {
				var recFasceDittaTimbr = fsProg.getRecord(recIndex).e2giornalieraprogfasce_to_ditte_fasceorarietimbrature;
				if (recFasceDittaTimbr != null) {
					
					// esistono una o due coppie di timbrature associate alla fascia ed alla giornata corrispondente
					if (recFasceDittaTimbr.iniziopausa != null) {
						timbrStr += recFasceDittaTimbr.inizio_orario_oremin;
						timbrStr += ' - ';
						timbrStr += recFasceDittaTimbr.inizio_pausa_oremin;
						timbrStr += ','//'           ';
						timbrStr += recFasceDittaTimbr.fine_pausa_oremin;
						timbrStr += ' - ';
						timbrStr += recFasceDittaTimbr.fine_orario_oremin;
					} else
					{
						timbrStr += recFasceDittaTimbr.inizio_orario_oremin;
						timbrStr += ' - ';
						timbrStr += recFasceDittaTimbr.fine_orario_oremin;
					}
					dsTimbrProgrammate.setValue(1,g + 4,timbrStr);
				} 
				
			}
		}
	}

	return dsTimbrProgrammate.getRowAsArray(1);
}

/**
 * Restituisce, per la settimana relativa al giorno richiesto, il giorno al quale corrisponde il 
 * riposo del tipo specificato per il lavoratore. Se non fosse stato impostato alcun riposo per il lavoratore all'interno della setiimana,
 * ritorna il valore null
 *  
 * @param {Number} idLavoratore
 * @param {Date} giorno
 * @param {Number} tipoRiposo
 *
 * @return {Date}
 * 
 * @properties={typeid:24,uuid:"54A0DE09-85A6-40E3-B71F-022C62BD194C"}
 * @AllowToRunInFind
 */
function getGiornoRiposoSettimanale(idLavoratore,giorno,tipoRiposo)
{
	var settimana = globals.getWeekNumber(giorno);
	var primoGgSettimana = globals.getDateOfISOWeek(settimana,giorno.getFullYear());
	var ultimoGgSettimana = new Date(primoGgSettimana.getFullYear(),primoGgSettimana.getMonth(),primoGgSettimana.getDate() + 6);

	/** @type {JSFoundset<db:/ma_presenze/e2giornalieraprogfasce>} */
	var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA_PROGFASCE);
	if(fs.find())
	{
		
		fs.iddip = idLavoratore;
		fs.giorno = utils.dateFormat(primoGgSettimana,globals.ISO_DATEFORMAT) + '...' + utils.dateFormat(ultimoGgSettimana,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
	
		if(fs.search())
		{
			for(var g = 1; g <= fs.getSize(); g++)
			{
				if(fs.getRecord(g).tiporiposo == tipoRiposo)
					return fs.getRecord(g).giorno;
			}
		}
	}
	
	return null;
}

/**
 * Ritorna true se la programmazione inserita rispetta le specifiche del raggiungimento dell'orario teorico periodico
 * e dei riposi definiti dalla regola oraria dei lavoratori
 *  
 * @param {Number} idDitta
 * @param {Array<Number>} arrLav
 * @param {Number} settimana
 * @param {Number} anno
 *
 * @properties={typeid:24,uuid:"7CF43936-59D2-4259-80D4-342C96DBC352"}
 */
function verificaProgrammazioneSettimanale(idDitta,arrLav,settimana,anno)
{
	var abilita = true;
	
	var primoGGSett = globals.getDateOfISOWeek(settimana,anno);
	var ultimoGGSett = new Date(primoGGSett.getFullYear(),primoGGSett.getMonth(),primoGGSett.getDate() + 6);
		
	for(var l = 1; l <= arrLav.length; l++)
	{
		var assunzione = globals.getDataAssunzione(arrLav[l - 1]);
		var regola = globals.getRegolaLavoratoreGiorno(arrLav[l - 1],primoGGSett < assunzione ? assunzione : primoGGSett);
		var totOreRegola = regola.totaleoreperiodo / 100;
		var totOreProgrammate = getTotaleOreProgrammateDalAl(arrLav[l - 1],primoGGSett,ultimoGGSett);
			
		if(totOreRegola != totOreProgrammate)
		{	
			abilita = false;
		    break;
		}
			
	}
	return abilita;
}

/**
 * Verifica la presenza di dati ditta/dipendenti ancora da scaricare : se presenti, viene visualizzato un messaggio
 * con l'invito a contattare al gestore per procedre con lo scarico
 *
 * @param {Number} idDitta
 * @param {Number} idGruppoInst
 *
 * @properties={typeid:24,uuid:"84FCB705-8651-4505-B559-255144FED89E"}
 */
function verificaDatiNegozioFtp(idDitta,idGruppoInst)
{
	return false;
// TODO ripristinare	
//	var params = inizializzaParametriRiceviTabelle(idDitta,idGruppoInst,"", globals.TipoConnessione.CLIENTE);
//
//	if(verificaDatiSuFtp(params,0) ||
//	   verificaDatiSuFtp(params,1) ||
//	   verificaDatiSuFtp(params,2))
//	{
//		globals.ma_utl_showWarningDialog('<html>Sono presenti nuovi dati inviati dallo studio e non ancora acquisiti per la ditta : <br/>' +
//			                              globals.getRagioneSociale(idDitta) + '.<br/>Contattare il gestore della giornaliera per l\'acquisizione</html>','Verifica presenza di dati da acquisire');
//	    return true;
//	}
//	
//	return false;
}

/**
 * Ottiene il numero delle ore associate alla festività goduta del giorno per il dipendente
 * avente la fascia oraria associata
 * 
 * @param {Number} idLavoratore
 * @param {Date} giorno
 * @param {Number} idFasciaOraria
 * 
 * @properties={typeid:24,uuid:"C0EA0995-A210-48D8-A779-A7A8E7A369D1"}
 */
function getOreFestivitaDipendente(idLavoratore,giorno,idFasciaOraria)
{
	var url = globals.WS_URL + '/Eventi/OreFestivitaGiorno';
	var params = {
		idditta : globals.getDitta(idLavoratore),
		periodo : giorno.getFullYear() * 100 + giorno.getMonth() + 1,
		giorniselezionati: [giorno.getDate()],
		iddipendenti: [idLavoratore],
		idevento: 633,
		ore: 0,
		codproprieta: '',
		tipoconnessione : globals.TipoConnessione.CLIENTE,
		idfasciaoraria : idFasciaOraria
	};

	var _response = globals.getWebServiceResponse(url, params);
	if (_response) 
		return _response['ore'];
	else {
		globals.ma_utl_showErrorDialog('Recupero delle ore di festività non riuscito', 'Errore del server');
		return null;
	}
}

/**
 * Apre il program per la programmazione degli orari del negozio
 * 
 * @param {JSEvent} _event
 * @param {Number} _idditta
 * @param {Number} _anno
 * @param {Number} _mese
 * @param {String} _grLav
 * @param {Number} _grInst
 * @param {String} _programName
 * @param {Number} [_settimana]
 * 
 * @properties={typeid:24,uuid:"91F57688-E94C-4B6C-8516-D25DE773F0D8"}
 */
function apriProgrammazioneNegozio(_event,_idditta,_anno,_mese,_grLav,_grInst,_programName,_settimana)
{
	// riepilogo festività
	preparaParametriProgrammazioneNegozio(_idditta,_anno,_mese,_programName);
	
	var _tipoGestoreReteImpresa = 0;
	
	switch(_programName)
	{
		case 'NEG_Programmazione':
		case 'NEG_CR':
		case 'NEG_CR_2':	
			_tipoGestoreReteImpresa = 0;
			break;
		case 'NEG':
			_tipoGestoreReteImpresa = 1;
			break;
		case 'NEG_Rete':
			_tipoGestoreReteImpresa = 2;
			break;
		default:
			break;
	}
	
    var parObj = {
    	idditta : _idditta,
    	anno : _anno,
		mese : _mese,
		periodo : _anno * 100 + _mese, // necessario per distinguere i programs nel caso di programmazione del responsabile 
		gruppolav : _grLav,
		gruppoinst : _grInst,
		tipogestorereteimpresa : _tipoGestoreReteImpresa,
		settimana : _settimana
    };
    
    globals.openProgram(_programName,parObj,true);

}

/**
 * Imposta l'oggetto contenente i parametri pe rla programamzione del negozio 
 * 
 * @param {Number} _idditta
 * @param {Number} _anno
 * @param {Number} _mese
 * @param {String} _programName
 *
 * @properties={typeid:24,uuid:"7E0A1600-27F8-4574-907C-CFED6382547D"}
 */
function preparaParametriProgrammazioneNegozio(_idditta,_anno,_mese,_programName)
{
	// gestione dei parametri mensili delle festività e della rete di impresa
	var frm = forms.neg_header_options;
    frm.vAnno = _anno;
    frm.vMese = _mese;
    frm.vArrGiorniFestivi = [];
    frm.vArrRiepilogoFestivita = [];
    frm.vArrGiorniFestivi = [];
    
    var periodo = _anno * 100 + _mese;
    
    // parametri per il recupero dei giorni festivi nel mese selezionato
    var parFestivita = null;
    // parametri per il recupero dei giorni festivi nel mese precedente al selezionato (quando è gennaio)
    var parFestivitaMP = null;
    // parametri per il recupero dei giorni festivi nel mese successivo al selezionato (quando è dicembre)
    var parFestivitaMS = null;
    // url dell'operazione relativa per il calcolo delle festività    
    var url;
   	
	// apertura del program e conseguente visualizzazione
	var filterProgNegozio = [];
	if(_programName == 'NEG')
		filterProgNegozio = { filter_name: 'ftr_idditta', 
			                  filter_field_name: 'idditta',
							  filter_operator: '=',
							  filter_value: _idditta };
	
	var progObj = globals.nav.program[_programName];
	progObj.foundset = null;
	progObj.filter = [filterProgNegozio];
	
	var arrDipGerarchia = [];
	var arrDitte = [];
	
	switch(_programName)
	{
		case 'NEG_Programmazione':
		case 'NEG_CR':
		case 'NEG_CR_2':	
			arrDipGerarchia = ma_sec_getUsers(globals.svy_sec_lgn_organization_id,true); 
			url = globals.WS_URL + "/Trattamenti/RiepilogoFestivitaDittaPeriodo";
			for(var l = 0; l < arrDipGerarchia.length; l++)
			{
				var idDittaLavoratore = globals.getDitta(arrDipGerarchia[l]);
				if(arrDitte.indexOf(idDittaLavoratore) == -1)
					arrDitte.push(idDittaLavoratore);
			}
			break;
		case 'NEG':
		case 'NEG_Rete':
		    if(parFestivitaMP != null)
		    	parFestivitaMP.iddipendenti = [];
		    if(parFestivitaMS != null)
		    	parFestivitaMS.iddipendenti = [];
			url = globals.WS_URL + "/Trattamenti/RiepilogoFestivitaDittaPeriodo";
			arrDitte.push(_idditta);
			break;
		default:
			break;
	}
	
	for(var d = 0; d < arrDitte.length; d++)
	{
		parFestivita = {
	    	tipoconnessione : globals.TipoConnessione.CLIENTE,
			databasecliente : globals.customer_dbserver_name,
			periodo : periodo,
			idditta : arrDitte[d],
			iddipendenti : [],
			gruppolavoratori : ''
	    }
		
		if(_mese == 1)
		{
			parFestivitaMP = {
		    	tipoconnessione : globals.TipoConnessione.CLIENTE,
				databasecliente : globals.customer_dbserver_name,
				periodo : (_anno - 1) * 100 + 12,
				idditta : arrDitte[d],
				iddipendenti : [],
				gruppolavoratori : ''
		    }
		}
		else if(_mese == 12)
		{
			parFestivitaMS = {
		    	tipoconnessione : globals.TipoConnessione.CLIENTE,
				databasecliente : globals.customer_dbserver_name,
				periodo : (_anno + 1) * 100 + 1,
				idditta : arrDitte[d],
				iddipendenti : [],
				gruppolavoratori : ''
		    }
		}
		
		/** @type {{ returnValue: Boolean, riepilogoFestivita: Array<Array> }} */
		var response = globals.getWebServiceResponse(url, parFestivita);
		/** @type {{ returnValue: Boolean, riepilogoFestivita: Array<Array> }} */
		var responseMP = parFestivitaMP != null ? globals.getWebServiceResponse(url, parFestivitaMP) : null;
		/** @type {{ returnValue: Boolean, riepilogoFestivita: Array<Array> }} */
		var responseMS = parFestivitaMS != null ? globals.getWebServiceResponse(url, parFestivitaMS) : null;
		
		if (response && response.returnValue === true
			&& (responseMP == null || responseMP && responseMP.returnValue == true)
			&& (responseMS == null || responseMS && responseMS.returnValue == true)
			)
		{
	       // gestione delle informazioni ottenute : salvataggio della struttura di riepilogo e popolamento degli array delle festività
	       var arrRiepFestivita = response.riepilogoFestivita;
	       for(var f = 0; f < arrRiepFestivita.length; f++)
	       {   
	    	   if(arrRiepFestivita[f])
	           {
	        	   //  visualizziamo solamente le festività godute che concorrono all'orario di riferimento
	        	   var festivitaGod = false;
	    	       var vArrFesta = arrRiepFestivita[f][2];
	    		   for(var j = 0; j < vArrFesta.length; j++)
	    		   {
	        		   if(utils.stringLeft(vArrFesta[j][2],2) == "FG")
	        			   festivitaGod = true;
	        	   } 
	        	           	   
	        	   if(festivitaGod && frm.vArrGiorniFestivi.indexOf(arrRiepFestivita[f][0]) == -1)
	       	          frm.vArrGiorniFestivi.push(arrRiepFestivita[f][0].toString());
	       	   }
	       }
	              
	       if(responseMP != null)
	       {
	    	   var arrRiepFestivitaMP = responseMP.riepilogoFestivita;
	           for(f = 0; f < arrRiepFestivitaMP.length; f++)
	           {   
	        	   if(arrRiepFestivitaMP[f])
	               {
	            	   //  visualizziamo solamente le festività godute che concorrono all'orario di riferimento
	            	   var festivitaGodMP = false;
	        	       var vArrFestaMP = arrRiepFestivitaMP[f][2];
	        		   for(j = 0; j < vArrFestaMP.length; j++)
	        		   {
	            		   if(utils.stringLeft(vArrFestaMP[j][2],2) == "FG")
	            			   festivitaGodMP = true;
	            	   } 
	            	           	   
	            	   if(festivitaGodMP)
	           	          frm.vArrGiorniFestivi.push(arrRiepFestivitaMP[f][0].toString());
	           	   
	            	   if(arrRiepFestivita.indexOf(arrRiepFestivitaMP[f]) == -1)
	            	      arrRiepFestivita.push(arrRiepFestivitaMP[f]);
	               }
	        	             	   
	           }    	   
	       }
	       
	       if(responseMS != null)
	       {
	    	   var arrRiepFestivitaMS = responseMS.riepilogoFestivita;
	           for(f = 0; f < arrRiepFestivitaMS.length; f++)
	           {   
	        	   if(arrRiepFestivitaMS[f])
	               {
	            	   //  visualizziamo solamente le festività godute che concorrono all'orario di riferimento
	            	   var festivitaGodMS = false;
	        	       var vArrFestaMS = arrRiepFestivitaMS[f][2];
	        		   for(j = 0; j < vArrFestaMS.length; j++)
	        		   {
	            		   if(utils.stringLeft(vArrFestaMS[j][2],2) == "FG")
	            			   festivitaGodMS = true;
	            	   } 
	            	           	   
	            	   if(festivitaGodMS)
	           	          frm.vArrGiorniFestivi.push(arrRiepFestivitaMS[f][0].toString());
	            	   
	            	   if(arrRiepFestivita.indexOf(arrRiepFestivitaMS[f]))
	            	      arrRiepFestivita.push(arrRiepFestivitaMS[f]);
	           	   }
	           }
	       }
	       
	       for(f = 0; f < arrRiepFestivita.length; f++)
	           frm.vArrRiepilogoFestivita.push(arrRiepFestivita[f]);
		}
		else
		{
			globals.ma_utl_showErrorDialog('Errore durante il recupero delle festività, contattare il servizio di assistenza.','Riepilogo festività del periodo');
			return;
		}
	}
	
//	// gestione dei parametri mensili delle festività e della rete di impresa
//	var frm = forms.neg_header_options;
//    frm.vAnno = _anno;
//    frm.vMese = _mese;
//    frm.vArrGiorniFestivi = [];
//       
//    var periodo = _anno * 100 + _mese;
//    
//    // parametri per il recupero dei giorni festivi nel mese selezionato
//    var parFestivita = null;
//    // parametri per il recupero dei giorni festivi nel mese precedente al selezionato (quando è gennaio)
//    var parFestivitaMP = null;
//    // parametri per il recupero dei giorni festivi nel mese successivo al selezionato (quando è dicembre)
//    var parFestivitaMS = null;
//    // url dell'operazione relativa per il calcolo delle festività    
//    var url;
//   	
//	// apertura del program e conseguente visualizzazione
//	var filterProgNegozio = [];
//	if(_programName == 'NEG')
//		filterProgNegozio = { filter_name: 'ftr_idditta', 
//			                  filter_field_name: 'idditta',
//							  filter_operator: '=',
//							  filter_value: _idditta };
//	
//	var progObj = globals.nav.program[_programName];
//	progObj.foundset = null;
//	progObj.filter = [filterProgNegozio];
//	
//	var arrDipGerarchia = [];
//	
//	parFestivita = {
//    	tipoconnessione : globals.TipoConnessione.CLIENTE,
//		databasecliente : globals.customer_dbserver_name,
//		periodo : periodo,
//		idditta : _idditta,
//		gruppolavoratori : ''
//    }
//	
//	if(_mese == 1)
//	{
//		parFestivitaMP = {
//	    	tipoconnessione : globals.TipoConnessione.CLIENTE,
//			databasecliente : globals.customer_dbserver_name,
//			periodo : (_anno - 1) * 100 + 12,
//			idditta : _idditta,
//			gruppolavoratori : ''
//	    }
//	}
//	else if(_mese == 12)
//	{
//		parFestivitaMS = {
//	    	tipoconnessione : globals.TipoConnessione.CLIENTE,
//			databasecliente : globals.customer_dbserver_name,
//			periodo : (_anno + 1) * 100 + 1,
//			idditta : _idditta,
//			gruppolavoratori : ''
//	    }
//	}
//	
//	switch(_programName)
//	{
//		case 'NEG_Programmazione':
//		case 'NEG_CR':
//		case 'NEG_CR_2':	
//			arrDipGerarchia = ma_sec_getUsers(globals.svy_sec_lgn_organization_id,true); 
//			parFestivita.iddipendenti = [-1].concat(arrDipGerarchia);
//		    if(parFestivitaMP != null)
//		    	parFestivitaMP.iddipendenti = [-1].concat(arrDipGerarchia);
//		    if(parFestivitaMS != null)
//		    	parFestivitaMS.iddipendenti = [-1].concat(arrDipGerarchia);
//			url = globals.WS_URL + "/Trattamenti/RiepilogoFestivitaDittaPeriodoLavoratori";
//			break;
//		case 'NEG':
//			parFestivita.iddipendenti = []; 
//			if(parFestivitaMP != null)
//		    	parFestivitaMP.iddipendenti = [];
//		    if(parFestivitaMS != null)
//		    	parFestivitaMS.iddipendenti = [];
//			url = globals.WS_URL + "/Trattamenti/RiepilogoFestivitaDittaPeriodo";
//			break;
//		case 'NEG_Rete':
//			parFestivita.iddipendenti = [];
//			if(parFestivitaMP != null)
//		    	parFestivitaMP.iddipendenti = [];
//		    if(parFestivitaMS != null)
//		    	parFestivitaMS.iddipendenti = [];
//		    url = globals.WS_URL + "/Trattamenti/RiepilogoFestivitaDittaPeriodo";
//			break;
//		default:
//			break;
//	}
		
//	/** @type {{ returnValue: Boolean, riepilogoFestivita: Array<Array> }} */
//	var response = globals.getWebServiceResponse(url, parFestivita);
//	/** @type {{ returnValue: Boolean, riepilogoFestivita: Array<Array> }} */
//	var responseMP = parFestivitaMP != null ? globals.getWebServiceResponse(url, parFestivitaMP) : null;
//	/** @type {{ returnValue: Boolean, riepilogoFestivita: Array<Array> }} */
//	var responseMS = parFestivitaMS != null ? globals.getWebServiceResponse(url, parFestivitaMS) : null;
//	
//	if (response && response.returnValue === true
//		&& (responseMP == null || responseMP && responseMP.returnValue == true)
//		&& (responseMS == null || responseMS && responseMS.returnValue == true)
//		)
//	{
//       // gestione delle informazioni ottenute : salvataggio della struttura di riepilogo e popolamento degli array delle festività
//       frm.vArrRiepilogoFestivita = [];
//       frm.vArrGiorniFestivi = [];
//       
//       var arrRiepFestivita = response.riepilogoFestivita;
//       for(var f = 0; f < arrRiepFestivita.length; f++)
//       {   
//    	   if(arrRiepFestivita[f])
//           {
//        	   //  visualizziamo solamente le festività godute che concorrono all'orario di riferimento
//        	   var festivitaGod = false;
//    	       var vArrFesta = arrRiepFestivita[f][2];
//    		   for(var j = 0; j < vArrFesta.length; j++)
//    		   {
//        		   if(utils.stringLeft(vArrFesta[j][2],2) == "FG")
//        			   festivitaGod = true;
//        	   } 
//        	           	   
//        	   if(festivitaGod)
//       	          frm.vArrGiorniFestivi.push(arrRiepFestivita[f][0]);
//       	   }
//       }
//              
//       if(responseMP != null)
//       {
//    	   var arrRiepFestivitaMP = responseMP.riepilogoFestivita;
//           for(f = 0; f < arrRiepFestivitaMP.length; f++)
//           {   
//        	   if(arrRiepFestivitaMP[f])
//               {
//            	   //  visualizziamo solamente le festività godute che concorrono all'orario di riferimento
//            	   var festivitaGodMP = false;
//        	       var vArrFestaMP = arrRiepFestivitaMP[f][2];
//        		   for(j = 0; j < vArrFestaMP.length; j++)
//        		   {
//            		   if(utils.stringLeft(vArrFestaMP[j][2],2) == "FG")
//            			   festivitaGodMP = true;
//            	   } 
//            	           	   
//            	   if(festivitaGodMP)
//           	          frm.vArrGiorniFestivi.push(arrRiepFestivitaMP[f][0]);
//           	   
//            	   arrRiepFestivita.push(arrRiepFestivitaMP[f]);
//               }
//        	             	   
//           }    	   
//       }
//       
//       if(responseMS != null)
//       {
//    	   var arrRiepFestivitaMS = responseMS.riepilogoFestivita;
//           for(f = 0; f < arrRiepFestivitaMS.length; f++)
//           {   
//        	   if(arrRiepFestivitaMS[f])
//               {
//            	   //  visualizziamo solamente le festività godute che concorrono all'orario di riferimento
//            	   var festivitaGodMS = false;
//        	       var vArrFestaMS = arrRiepFestivitaMS[f][2];
//        		   for(j = 0; j < vArrFestaMS.length; j++)
//        		   {
//            		   if(utils.stringLeft(vArrFestaMS[j][2],2) == "FG")
//            			   festivitaGodMS = true;
//            	   } 
//            	           	   
//            	   if(festivitaGodMS)
//           	          frm.vArrGiorniFestivi.push(arrRiepFestivitaMS[f][0]);
//            	   
//            	   arrRiepFestivita.push(arrRiepFestivitaMS[f]);
//           	   }
//           }
//       }
//       
//       frm.vArrRiepilogoFestivita = arrRiepFestivita;
//	}
//	else
//	{
//		globals.ma_utl_showErrorDialog('Errore durante il recupero delle festività, contattare il servizio di assistenza.','Riepilogo festività del periodo');
//		return;
//	}
}

/**
 * Apre il program per la programmazione degli orari del negozio
 * 
 * @param {JSEvent} _event
 * @param {Number} _idditta
 * @param {Number} _anno
 * @param {Number} _mese
 * @param {String} _grLav
 * @param {Number} _grInst
 * @param {String} _programName
 * 
 * @properties={typeid:24,uuid:"EAD0C383-B349-44FA-8633-A9AADA498933"}
 */
function apriProgrammazioneCoperturaNegozio(_event,_idditta,_anno,_mese,_grLav,_grInst,_programName)
{
	// gestione dei parametri mensili delle festività e della rete di impresa
	var frm = forms.neg_header_options;
    frm.vAnno = _anno;
    frm.vMese = _mese;
    frm.vArrGiorniFestivi = [];
        
    var periodo = _anno * 100 + _mese;
    
    // parametri per il recupero dei giorni festivi nel mese selezionato
    var parFestivita = {
    	tipoconnessione : globals.TipoConnessione.CLIENTE,
		databasecliente : 'Cliente_' + globals.customer_dbserver_name,
		periodo : periodo,
		idditta : _idditta,
		iddipendenti : [],
		gruppolavoratori : ''
    }

    // gestione festività del mese selezionato
    var url = globals.WS_URL + "/Trattamenti/RiepilogoFestivitaDittaPeriodo";
	/** @type {{ returnValue: Boolean, riepilogoFestivita: Array<Array> }} */
	var response = globals.getWebServiceResponse(url, parFestivita);
	if (response && response.returnValue === true)
	{
       // gestione delle informazioni ottenute : salvataggio della struttura di riepilogo e popolamento degli array delle festività
       frm.vArrRiepilogoFestivita = response.riepilogoFestivita;
       frm.vArrGiorniFestivi = [];
       for(var f = 0; f < frm.vArrRiepilogoFestivita.length; f++)
       	   frm.vArrGiorniFestivi.push(frm.vArrRiepilogoFestivita[f][0]);
    }
    
	// apertura del program e conseguente visualizzazione
	var filterProgNegozio = [];
	if(_programName == 'NEG_Cop')
		filterProgNegozio = { filter_name: 'ftr_idditta', filter_field_name: 'idditta', filter_operator: '=', filter_value: _idditta };
	
	var progObj = globals.nav.program[_programName];
	progObj.foundset = null;
	progObj.filter = [filterProgNegozio];
	
	var _tipoGestoreReteImpresa = 0;
	switch(_programName)
	{
		case 'NEG_Cop_Programmazione':
			_tipoGestoreReteImpresa = 0;
			break;
		case 'NEG_Cop':
			_tipoGestoreReteImpresa = 1;
			break;
		case 'NEG_Cop_Rete':
			_tipoGestoreReteImpresa = 2;
			break;
		default:
			break;
	}
	
    var parObj = {
    	idditta : _idditta,
    	anno : _anno,
		mese : _mese,
		gruppolav : _grLav,
		gruppoinst : _grInst,
		tipogestorereteimpresa : _tipoGestoreReteImpresa
    };
    
    globals.openProgram(_programName,parObj,true);
		
}

/**
 * @param {Number} settimana
 * @param {Number} anno
 * @param {Boolean} [forzaRidisegno]
 * 
 * @properties={typeid:24,uuid:"DDB20FE6-7EC8-4610-8A03-D6158D33A3DF"}
 */
function preparaProgrammazioneCopertura(settimana,anno,forzaRidisegno)
{
	var _tipoGestoreReteImpresa = globals.getTipoGestoreReteImpresa();
	var primoGiornoSett = globals.getDateOfISOWeek(settimana,anno);
	
	// costruzione visualizzazione copertura settimana corrispondente
//	preparaProgrammazioneCoperturaSettimana(settimana,anno,_tipoGestoreReteImpresa,forzaRidisegno);	
	
	// settaggio nome form contenitore
	var oriForm = forms.neg_prog_cop_giorno_tab;
	var oriFormName = oriForm.controller.getName();
	var newFormName = oriFormName + '_' + settimana;
	var tabForm = forms.neg_prog_cop_tab;
	
    // rimozione di tabpanels precedenti
    tabForm.elements.tab_cop_giorni.removeAllTabs();
    tabForm.elements.tab_cop_giorni.transparent = false;
    
    if(solutionModel.getForm(newFormName))
    {
    	history.removeForm(newFormName);
    	solutionModel.removeForm(newFormName);
    }
    
    var x=0;
    var y=0;
    var tabWidth = 640;
    var tabHeight = 135;
    var totHeight = 0;    
    var dyIntestazione = 25;
    var dy = 20;
    var dyLbl = 15;
    var dyLblOrario = 75;
    
    // creazione della nuova form dinamica 
    var newForm = solutionModel.newForm(newFormName,solutionModel.getForm(oriFormName));
    var giorno;
    
    for (var g = 1; g <= 7; g++)
    {
    	giorno = new Date(primoGiornoSett.getFullYear(),primoGiornoSett.getMonth(),primoGiornoSett.getDate() + g - 1);
    	var dsCopGiorno = globals.ottieniDataSetCoperturaGiorno(giorno,_tipoGestoreReteImpresa);
    	// numero di lavoratori da visualizzare nel giorno
    	var numLav = dsCopGiorno.getMaxRowIndex();
    	
    	tabHeight = dyIntestazione + dyLbl + dyLblOrario + numLav * (dy + 1) + 5;
    	totHeight += tabHeight;    	
    	
        // rimozione forms lavoratori con anomalie
        var giornoFormOri = forms.neg_prog_cop_giorno;
    	var giornoFormOriName = giornoFormOri.controller.getName();
    	var giornoFormName = giornoFormOriName + '_' + g;
    	
    	if(solutionModel.getForm(giornoFormName))
        {
        	history.removeForm(giornoFormName);
        	solutionModel.removeForm(giornoFormName);
        }
    	    	    	
        var tabPanelCopGiorno = newForm.newTabPanel('tabpanel_cop_giorno_' + g
                                                   ,x
		                                           ,y
		                                           ,tabWidth
		                                           ,tabHeight);
        tabPanelCopGiorno.visible = true;
        tabPanelCopGiorno.transparent = true;
        tabPanelCopGiorno.tabOrientation = SM_ALIGNMENT.TOP;
        tabPanelCopGiorno.anchors = SM_ANCHOR.NORTH | SM_ANCHOR.EAST | SM_ANCHOR.WEST | SM_ANCHOR.SOUTH;
        tabPanelCopGiorno.scrollTabs = false;
        
    	var giornoForm = solutionModel.cloneForm(giornoFormName
    	                                         ,solutionModel.getForm(giornoFormOriName));
    	giornoForm.navigator = SM_DEFAULTS.NONE;
    	var tabCopGiornoHeader = giorno;
    	tabPanelCopGiorno.newTab('tab_cop_giorno_' + g
    		                     ,globals.getNomeInteroGiorno(giorno) + ' ' + globals.dateFormat(tabCopGiornoHeader,globals.EU_DATEFORMAT)
								 ,giornoForm);
    	
    	y += tabHeight;									  
  
    }
           
    solutionModel.getForm(newFormName).getBodyPart().height = totHeight; 
    
    tabForm.elements.tab_cop_giorni.addTab(newFormName,newFormName);
	
    for (g = 1; g <= 7; g++)
    {
    	giorno = new Date(primoGiornoSett.getFullYear(),primoGiornoSett.getMonth(),primoGiornoSett.getDate() + g - 1);
	    // costruzione visualizza copertura giorno
		preparaProgrammazioneCoperturaGiorno(giorno,g,_tipoGestoreReteImpresa,forzaRidisegno);
    }
        
//    tabForm.elements.tab_cop_settimana.setSize(tabForm.elements.tab_cop_settimana.getWidth(),(arrLavSett.length + 1) * 20);
    
}

/**
 * @param {Date} giorno
 * @param {Number} index
 * @param {Number} tipoReteImpresa
 * @param {Boolean} [forzaRidisegno]
 * 
 * @properties={typeid:24,uuid:"D437A07A-4857-4D0A-8EC3-9DD0F3766898"}
 */
function preparaProgrammazioneCoperturaGiorno(giorno,index,tipoReteImpresa,forzaRidisegno)
{
	var arrLav = [];
	switch(tipoReteImpresa)
	{
		case 0:
            arrLav = globals.getLavoratoriSettimanaAnno(giorno,giorno);
			break;
		case 1:
		    arrLav = globals.getLavoratoriDittaSettimanaAnno(forms.neg_header_dtl.idditta,giorno,giorno);
			break;
		case 2:
		    arrLav = globals.getLavoratoriReteImpresaSettimanaAnno(giorno,giorno);
			break;
		default:
			break;
		
	}
	
	// numero di lavoratori da visualizzare
	var numLav = arrLav.length;
	
	// controllo eventuali giornate festive non ancora programmate con il valore di default 
	globals.inizializzaGiornProgFasceFestivita(arrLav,giorno,giorno,tipoReteImpresa);
	
	var dsCopGiorno = globals.ottieniDataSetCoperturaGiorno(giorno,tipoReteImpresa,arrLav);
		
	// numero di ore programmabili //TODO da orario di apertura
	var orarioApertura = globals.getOrarioApertura();
	var orarioChiusura = globals.getOrarioChiusura();
	var numOreProg = orarioChiusura - orarioApertura; 
	var numIntervalli = (numOreProg * 0.04);
	
    disegnaProgrammazioneCoperturaGiorno(dsCopGiorno,giorno,index,numIntervalli,numLav,orarioApertura,forzaRidisegno);
}

/**
 * TODO generated, please specify type and doc for the params
 * @param dsCopGiorno
 * @param giorno
 * @param index
 * @param numIntervalli
 * @param numLav
 * @param orarioApertura
 * @param [forzaRidisegno]
 *
 * @properties={typeid:24,uuid:"7B1B3C51-815F-4D8A-9941-018578DDC2F2"}
 */
function disegnaProgrammazioneCoperturaGiorno(dsCopGiorno,giorno,index,numIntervalli,numLav,orarioApertura,forzaRidisegno)
{
	// definizione del nome della form da creare 
	var cgFormName = 'neg_prog_cop_giorno_' + globals.dateFormat(giorno,globals.ISO_DATEFORMAT) + '_dtl';
	
	if(solutionModel.getForm(cgFormName) == null || forzaRidisegno)
	{
	// preparazione disegno
	var contFormTabPanelName = forms.neg_prog_cop_tab.elements.tab_cop_giorni.getTabFormNameAt(1);
	var contFormTabName = forms[contFormTabPanelName].elements['tabpanel_cop_giorno_' + index].getTabFormNameAt(1);
    
	if(forms[contFormTabName].elements['tab_giorno'])
		forms[contFormTabName].elements['tab_giorno'].removeAllTabs();
	if(solutionModel.getForm(cgFormName))
	{
		history.removeForm(cgFormName);
		solutionModel.removeForm(cgFormName);
	}
	
	var dxNominativo = 270;
	var dxIntervallo = 15;
	var dy = 20;
	var dyHeaderInt = 50;
	 var dxTotOre = 45;
	
	var dSCopGiorno = dsCopGiorno.createDataSource('dSCopGiorno_' + globals.dateFormat(giorno,globals.ISO_DATEFORMAT));
	var cgForm = solutionModel.newForm(cgFormName,dSCopGiorno,'leaf_style_table',false,dxNominativo + dxIntervallo * numIntervalli + dxTotOre,dyHeaderInt + dy * (numLav + 2));
	cgForm.navigator = SM_DEFAULTS.NONE;
	cgForm.view = JSForm.RECORD_VIEW;
	cgForm.scrollbars = SM_SCROLLBAR.HORIZONTAL_SCROLLBAR_NEVER | SM_SCROLLBAR.VERTICAL_SCROLLBAR_NEVER;
	cgForm.onDrag = solutionModel.getGlobalMethod('dragndrop','onDrag');
	cgForm.onDragEnd = solutionModel.getGlobalMethod('dragndrop','onDragEnd');
	cgForm.onDragOver = solutionModel.getGlobalMethod('dragndrop','onDragOver');
	cgForm.onDrop = solutionModel.getGlobalMethod('dragndrop','onDrop');
	
	// TODO label intestazione
//	var lblIntestazione = cgForm.newLabel('Orario di apertura punto vendita',dxNominativo,0,dxHeaderIntestazione,dy);
//    lblIntestazione.name = 'lbl_intestazione';
//    lblIntestazione.styleClass = 'table_header';
//    lblIntestazione.horizontalAlignment = SM_ALIGNMENT.CENTER;
	
	// prima fila con le labels riportante le intestazioni : nominativi ed orari
	var lblNominativo = cgForm.newLabel('Nominativo',0,dyHeaderInt - dy,dxNominativo,dy);
	lblNominativo.name = 'lbl_nominativo_' + l;
	lblNominativo.styleClass = 'table_header';
	lblNominativo.transparent = false;
	lblNominativo.margin = '0,2,0,0';
	
	// crea l'etichetta per l'intestazione per ogni intervallo
	for(var h = 1; h <= numIntervalli; h++)
	{
		var lblIntervallo_h = cgForm.newLabel('',dxNominativo + dxIntervallo * (h - 1),0,dxIntervallo,dyHeaderInt);
		var intervallo_l = scopes.giornaliera.convertiOrarioInOreCentesimi(orarioApertura) + (h - 1) * 0.25;
		var hours_l = Math.floor(intervallo_l);
		var minutes_l = '';
		switch(intervallo_l - hours_l)
		{
			case 0:
				minutes_l = '00';
				break;
			case .25:
				minutes_l = '15';
				break;
			case .50:
				minutes_l = '30';
			    break;
			case .75:
				minutes_l = '45';
				break;
			default:
				break;
		};
		
		var txtIntervallo_h = hours_l + '.' + minutes_l;
		                      
		lblIntervallo_h.name = 'lbl_intervallo_header_' + h;
		lblIntervallo_h.text = txtIntervallo_h;
		lblIntervallo_h.borderType = solutionModel.createMatteBorder(1,1,1,0,'#AAAAAA');
		lblIntervallo_h.background = '#d0d0d0';
		lblIntervallo_h.transparent = false;
		lblIntervallo_h.rotation = 270;
		lblIntervallo_h.horizontalAlignment = SM_ALIGNMENT.CENTER;
				
	} 
	
	var lblTotOre_h = cgForm.newLabel('',dxNominativo + dxIntervallo * (h - 1),0,dxTotOre,dyHeaderInt);
	lblTotOre_h.name = 'lbl_tot_ore_' + l;
	lblTotOre_h.background = '#d0d0d0';
	lblTotOre_h.borderType = solutionModel.createMatteBorder(0,1,1,0,'#AAAAAA');
	lblTotOre_h.enabled = true;
	lblTotOre_h.text = 'Totale';
	lblTotOre_h.rotation = 270;
	lblTotOre_h.horizontalAlignment = SM_ALIGNMENT.CENTER;
	
	// creazione variabili per gestione presenza nell'intervallo
	for(h = 1; h <= numIntervalli; h++)
	   cgForm.newVariable('var_pres_' + h,JSVariable.INTEGER,'0');
		
	// per ogni lavoratore presente
	for(var l = 1; l <= numLav; l++)
	{
		// crea il campo per la visualizzazione del nominativo
		var varNominativo = cgForm.newVariable('nominativo_' + l,JSVariable.TEXT,'"' + dsCopGiorno.getValue(l,1) + '"');
		var fldNominativo = cgForm.newTextField(varNominativo.name,0,(dyHeaderInt + dy * (l - 1)),dxNominativo,dy);
		fldNominativo.borderType = solutionModel.createMatteBorder(0,1,1,0,'#AAAAAA');
		if(l % 2 != 0)
           fldNominativo.background = globals.Colors.ODD.background; 
		else
			fldNominativo.background = globals.Colors.EVEN.background;
		
		fldNominativo.enabled = true;
		fldNominativo.editable = false;
		
		// crea l'etichetta per la visualizzazione della presenza o meno all'interno di ogni intervallo
		for(var i = 1; i <= numIntervalli; i++)
		{
			var lblIntervallo_i = cgForm.newLabel('',dxNominativo + dxIntervallo * (i - 1),dyHeaderInt + dy * (l - 1),dxIntervallo,dy);
			lblIntervallo_i.name = 'lbl_intervallo_' + l + '_' + i;
			lblIntervallo_i.borderType = solutionModel.createMatteBorder(0,1,1,0,'#AAAAAA');
			switch(dsCopGiorno.getValue(l,i + 1))
			{
				case 0:
					lblIntervallo_i.background = 'white';
				    break;
				case 1:
                    lblIntervallo_i.background = globals.Colors.ATTENDANT.background;
                    cgForm.getVariable('var_pres_' + i).defaultValue = parseInt(cgForm.getVariable('var_pres_' + i).defaultValue,10) + 1;
					break;
				case 2:
				    lblIntervallo_i.background = globals.Colors.REST.background;
					break;
				case 3:
					lblIntervallo_i.background = globals.Colors.ON_HOLIDAYS.background;
					break;
//				case 4:
//					lblIntervallo_i.background = globals.Colors.HOLYDAYS.background;
//					break;
				default:
					break;
			}
			lblIntervallo_i.transparent = false;
			lblIntervallo_i.onAction = solutionModel.getGlobalMethod('globals','onActionIntervallo');
		    lblIntervallo_i.showClick = false;
		    lblIntervallo_i.onRightClick = solutionModel.getGlobalMethod('globals','onRightClickIntervallo');
		   
		}
		
		var lblTotOre_l = cgForm.newLabel('',dxNominativo + dxIntervallo * (i - 1),dyHeaderInt + dy * (l - 1),dxTotOre,dy);
		lblTotOre_l.name = 'lbl_tot_ore_' + l;
		lblTotOre_l.background = '#BBBBBB';
		lblTotOre_l.foreground = '#FFFFFF';
		lblTotOre_l.borderType = solutionModel.createMatteBorder(0,1,1,0,'#AAAAAA');
		lblTotOre_l.enabled = true;
		lblTotOre_l.horizontalAlignment = SM_ALIGNMENT.CENTER;
		lblTotOre_l.text = dsCopGiorno.getValue(l,i + 1);
		lblTotOre_l.transparent = false;
		
//		var lblAssOre_l = cgForm.newLabel('',dxNominativo + dxIntervallo * i,dyHeaderInt + dy * (l - 1),dxTotOre,dy);
//		lblAssOre_l.name = 'lbl_ass_ore_' + l;
//		lblAssOre_l.background = '#BBBBBB';
//		lblAssOre_l.foreground = '#FFFFFF';
//		lblAssOre_l.borderType = solutionModel.createMatteBorder(0,1,1,0,'#AAAAAA');
//		lblAssOre_l.enabled = true;
//		lblAssOre_l.horizontalAlignment = SM_ALIGNMENT.CENTER;
//		lblAssOre_l.text = dsCopGiorno.getValue(l,i + 2);
//		lblAssOre_l.transparent = false;
	}
	
	// disegno del riepilogo dipendenti presenti nello specifico intervallo
	var lblPersoneIntervallo = cgForm.newLabel('Dipendenti presenti',0,dyHeaderInt + dy * (l - 1) + 2,dxNominativo,dy);
	lblPersoneIntervallo.name = 'lbl_persone_intervallo';
	lblPersoneIntervallo.styleClass = 'table';
	lblPersoneIntervallo.transparent = false;
	lblPersoneIntervallo.margin = '0,2,0,0';
	
	for(h = 1; h <= numIntervalli; h++)
	{
		var lblPersoneIntervallo_i = cgForm.newLabel(cgForm.getVariable('var_pres_' + h).defaultValue,dxNominativo + dxIntervallo * (h - 1),dyHeaderInt + dy * (l - 1) + 2,dxIntervallo,dy);
		lblPersoneIntervallo_i.name = 'lbl_persone_intervallo_' + h;
		lblPersoneIntervallo_i.borderType = solutionModel.createMatteBorder(1,1,1,0,'#AAAAAA');
		lblPersoneIntervallo_i.transparent = false;
		lblPersoneIntervallo_i.background = 'white';
		lblPersoneIntervallo_i.horizontalAlignment = SM_ALIGNMENT.CENTER;
	}
	
	forms[contFormTabName].elements['tab_giorno'].addTab(cgFormName, cgFormName + '_' + application.getUUID());
	}
}

/**
 * @param {Number} settimana
 * @param {Number} anno
 * @param {Number} tipoGestoreReteImpresa
 * @param {Boolean} [forzaRidisegno]
 * 
 * @properties={typeid:24,uuid:"5C7CE6E8-774C-4073-BC54-149FDC2A8F6F"}
 */
function preparaProgrammazioneCoperturaSettimana(settimana,anno,tipoGestoreReteImpresa,forzaRidisegno)
{
	var contForm = forms.neg_prog_cop_tab;
	
	var oriForm = forms.neg_prog_periodo_settimana;
	var oriFormName = oriForm.controller.getName();
	var newFormName = oriFormName + '_' + settimana + '_cop';
	
	if(forzaRidisegno == true)
	{
		contForm.elements.tab_cop_giorni.removeAllTabs();
		history.removeForm(newFormName);
	    solutionModel.removeForm(newFormName);
	}
	
	if(solutionModel.getForm(newFormName) == null
		|| forzaRidisegno == true)
	{
		var newForm = solutionModel.cloneForm(newFormName,solutionModel.getForm(oriFormName)); 
		contForm.elements.tab_cop_giorni.addTab(newForm.name);
	}	
	
	/** @type {Form<neg_prog_periodo_settimana>}*/
	var currForm = forms[newFormName];
	
	currForm.preparaProgrammazioneSettimanaNegozio(settimana
												  ,anno
												  ,tipoGestoreReteImpresa
												  ,true
												  ,forzaRidisegno);
}

/**
 * Ottieni il dataset relativo ai lavoratori associati al punto vendita nel giorno ed 
 * alla loro relativa presenza o meno nell'intervallo, tra tutti gli intervalli determinati
 * dagli orari di apertura e chiusura del punto vendita
 * 
 * @param {Date} giorno
 * @param {Number} tipoGestoreReteImpresa
 * @param {Array<Number>} [arrLavoratori]
 * 
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"7315AAF8-4642-4840-91DC-82054C915E5C"}
 */
function ottieniDataSetCoperturaGiorno(giorno,tipoGestoreReteImpresa,arrLavoratori)
{
	// ottenimento dati dei lavoratori presenti nel giorno
    var arrLav = [];
    if(arrLavoratori)
    	arrLav = arrLavoratori;
    else
    {
		switch(tipoGestoreReteImpresa)
		{
			case 0:
	            arrLav = globals.getLavoratoriSettimanaAnno(giorno,giorno);
				break;
			case 1:
			    arrLav = globals.getLavoratoriDittaSettimanaAnno(forms.neg_header_dtl.idditta,giorno,giorno);
				break;
			case 2:
			    arrLav = globals.getLavoratoriReteImpresaSettimanaAnno(giorno,giorno);
				break;
			default:
				break;
			
		}
    }
    
	var dsCopGiorno = databaseManager.createEmptyDataSet();
	dsCopGiorno.addColumn('nominativo',1,JSColumn.TEXT);
	
	// ottenimento dati punto vendita
	var orarioApertura = getOrarioApertura();
	var orarioChiusura = getOrarioChiusura();
	var numInt = (orarioChiusura - orarioApertura) * 0.04;
	for(var i = 1; i <= numInt; i++)
		dsCopGiorno.addColumn('intervallo_' + i,i + 1,JSColumn.NUMBER);
	dsCopGiorno.addColumn('totale_ore',i + 1,JSColumn.NUMBER);
	dsCopGiorno.addColumn('idlavoratore',i + 2,JSColumn.NUMBER);
	//dsCopGiorno.addColumn('ore_assenza',i + 3,JSColumn.NUMBER);
	
	for(var l = 1; l <= arrLav.length; l++)
	{
		dsCopGiorno.addRow([]);
		dsCopGiorno.setValue(l,1,globals.getNominativo(arrLav[l - 1]));
		dsCopGiorno.setValue(l,i + 2,arrLav[l - 1]);
				
		//TODO caso giornaliera precompilata da eventi gestiti con storico
//		var recGiorn = globals.getRecGiornaliera(arrLav[l - 1],giorno,globals.TipoGiornaliera.NORMALE);
//		if(recGiorn != null 
//		   && recGiorn.e2giornaliera_to_e2giornalieraeventi != null
//		   && recGiorn.e2giornaliera_to_e2giornalieraeventi.e2giornalieraeventi_to_e2eventi.e2eventi_to_e2eventiclassi.gestitoconstorico)
//		{
//			dsCopGiorno.setValue(l, i + 1, 10); // 10 messo a caso...verificare cosa si è messo di malattia
//		}
		
		var recFasciaProg = scopes.giornaliera.getProgrammazioneFasceGiorno(arrLav[l - 1],giorno);
		if (recFasciaProg != null 
			&& recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature != null
			&& recFasciaProg.e2giornalieraprogfasce_to_e2fo_fasceorarie.totaleorefascia != 0)
		{
				var inizioOrario = recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.inizioorario;
				var inizioPausa = recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.iniziopausa;
				var finePausa = recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.finepausa;
				var fineOrario = recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.fineorario;
                
				var inizioInt = orarioApertura;
				var fineInt;

				for (i = 1; i <= numInt; i++) {
					var inizioIntHr = parseInt(utils.stringLeft(inizioInt.toString(), inizioInt.toString().length - 2), 10);
					var inizioIntMin = parseInt(utils.stringRight(inizioInt.toString(), 2), 10);

					switch (inizioIntMin) {
					case 45:
						fineInt = (inizioIntHr + 1) * 100;
						break;
					default:
						fineInt = inizioInt + 15;
						break
					}

					if (inizioPausa != null) {
						if (inizioOrario <= inizioInt && inizioInt < inizioPausa || finePausa <= inizioInt && inizioInt < fineOrario)
							dsCopGiorno.setValue(l, i + 1, 1);
						else
							dsCopGiorno.setValue(l, i + 1, 0);
					} else {
						if (inizioInt >= inizioOrario && fineInt <= fineOrario)
							dsCopGiorno.setValue(l, i + 1, 1);
						else
							dsCopGiorno.setValue(l, i + 1, 0);
					}

					inizioInt = fineInt;
				}
						
		}
		else if(recFasciaProg != null 
				&& recFasciaProg.e2giornalieraprogfasce_to_e2fo_fasceorarie.totaleorefascia == 0)
		{
			if(recFasciaProg.tiporiposo)
				for (i = 1; i <= numInt; i++)
				    dsCopGiorno.setValue(l, i + 1, 2);
			else
				for (i = 1; i <= numInt; i++)
				    dsCopGiorno.setValue(l, i + 1, 0);
			
		}
		else {
			// verifica eventuali assenze (ferie, malattie, etc)
			for (i = 1; i <= numInt; i++)
				if(recFasciaProg != null)
//				   if(forms.neg_header_options.vArrGiorniFestivi.indexOf(giornoIso) != -1)
//					   dsCopGiorno.setValue(l, i + 3, 4); // assenza per festività
//				   else
				       dsCopGiorno.setValue(l, i + 1, 3); // assenze programmate
				else
                   dsCopGiorno.setValue(l, i + 1, 0); 	
		}
		
		// se la fascia è stata programmata aggiorna il riepilogo del totale ore
		if(recFasciaProg && recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature)
		   dsCopGiorno.setValue(l,i + 1,globals.calcolaOreEventoFasciaOrariaTimbrature(recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.iddittafasciaorariatimbrature));
		else
			dsCopGiorno.setValue(l,i + 1,0);	
	}
	
	return dsCopGiorno;
}

/**
 * Ottieni la copertura degli intervalli (a quarto d'ora) del giorno selezionato 
 * @param giorno
 * @param tipoGestoreReteImpresa
 * 
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"1C343A9A-6F17-46AF-ABE0-3FB838013AEA"}
 */
function ottieniDataSetReportCoperturaGiorno(giorno,tipoGestoreReteImpresa)
{
	// ottenimento dati dei lavoratori presenti nel giorno
    var arrLav = [];
	switch(tipoGestoreReteImpresa)
	{
		case 0:
            arrLav = globals.getLavoratoriSettimanaAnno(giorno,giorno);
			break;
		case 1:
		    arrLav = globals.getLavoratoriDittaSettimanaAnno(forms.neg_header_dtl.idditta,giorno,giorno);
			break;
		case 2:
		    arrLav = globals.getLavoratoriReteImpresaSettimanaAnno(giorno,giorno);
			break;
		default:
			break;
		
	}
	
	var dsCopGiorno = databaseManager.createEmptyDataSet();
	dsCopGiorno.addColumn('nominativo',1,JSColumn.TEXT);
	
	// ottenimento dati punto vendita
	var orarioApertura = getOrarioApertura();
	var orarioChiusura = getOrarioChiusura();
	var numInt = (orarioChiusura - orarioApertura) * 0.04;
	for(var i = 1; i <= numInt; i++)
		dsCopGiorno.addColumn('intervallo_' + i,i + 1,JSColumn.NUMBER);
	dsCopGiorno.addColumn('totale_ore',i + 1,JSColumn.NUMBER);
	
	for(var l = 1; l <= arrLav.length; l++)
	{
		dsCopGiorno.addRow([]);
		dsCopGiorno.setValue(l,1,globals.getNominativo(arrLav[l - 1]));
		var recFasciaProg = scopes.giornaliera.getProgrammazioneFasceGiorno(arrLav[l - 1],giorno);
		if (recFasciaProg != null 
			&& recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature != null
			&& recFasciaProg.e2giornalieraprogfasce_to_e2fo_fasceorarie.totaleorefascia != 0)
		{
				var inizioOrario = recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.inizioorario;
				var inizioPausa = recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.iniziopausa;
				var finePausa = recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.finepausa;
				var fineOrario = recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.fineorario;

				var inizioInt = orarioApertura;
				var fineInt;

				for (i = 1; i <= numInt; i++) {
					var inizioIntHr = parseInt(utils.stringLeft(inizioInt.toString(), inizioInt.toString().length - 2), 10);
					var inizioIntMin = parseInt(utils.stringRight(inizioInt.toString(), 2), 10);

					switch (inizioIntMin) {
					case 45:
						fineInt = (inizioIntHr + 1) * 100;
						break;
					default:
						fineInt = inizioInt + 15;
						break
					}

					if (inizioPausa != null) {
						if (inizioOrario <= inizioInt && inizioInt < inizioPausa || finePausa <= inizioInt && inizioInt < fineOrario)
							dsCopGiorno.setValue(l, i + 1, 1);
						else
							dsCopGiorno.setValue(l, i + 1, null);
					} else {
						if (inizioInt >= inizioOrario && fineInt <= fineOrario)
							dsCopGiorno.setValue(l, i + 1, 1);
						else
							dsCopGiorno.setValue(l, i + 1, null);
					}

					inizioInt = fineInt;
				}
						
		}
		else if(recFasciaProg != null 
				&& recFasciaProg.e2giornalieraprogfasce_to_e2fo_fasceorarie.totaleorefascia == 0)
		{
			if(recFasciaProg.tiporiposo)
				for (i = 1; i <= numInt; i++)
				    dsCopGiorno.setValue(l, i + 1, null);
			else
				for (i = 1; i <= numInt; i++)
				    dsCopGiorno.setValue(l, i + 1, null);
			
		}
		else {
			// verifica eventuali assenze (ferie, malattie, etc)
			for (i = 1; i <= numInt; i++)
				if(recFasciaProg != null)
				   dsCopGiorno.setValue(l, i + 1, null); // assenze programmate
				else
                   dsCopGiorno.setValue(l, i + 1, null); 	
		}
		
		// se la fascia è stata programmata aggiorna il riepilogo del totale ore
		if(recFasciaProg && recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature)
		   dsCopGiorno.setValue(l,i + 1,globals.calcolaOreEventoFasciaOrariaTimbrature(recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.iddittafasciaorariatimbrature));
		else
			dsCopGiorno.setValue(l,i + 1,0);	
	}
	
	return dsCopGiorno;
}

/**
 * Ottieni la copertura degli intervalli (a quarto d'ora) del giorno selezionato 
 * 
 * @param giornoDal
 * @param giornoAl
 * @param tipoGestoreReteImpresa
 *
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"EE31839A-A8CF-421E-B4E7-BADD034344D4"}
 */
function ottieniDataSetReportCoperturaPeriodo(giornoDal,giornoAl,tipoGestoreReteImpresa)
{
	// ottenimento dati dei lavoratori presenti nel periodo
    var arrLav = [];
	switch(tipoGestoreReteImpresa)
	{
		case 0:
            arrLav = globals.getLavoratoriSettimanaAnno(giornoDal,giornoAl);
			break;
		case 1:
		    arrLav = globals.getLavoratoriDittaSettimanaAnno(forms.neg_header_dtl.idditta,giornoDal,giornoAl);
			break;
		case 2:
		    arrLav = globals.getLavoratoriReteImpresaSettimanaAnno(giornoDal,giornoAl);
			break;
		default:
			break;
		
	}
	
	var dsCopSett = databaseManager.createEmptyDataSet();
	dsCopSett.addColumn('nominativo',1,JSColumn.TEXT);
	
	// ottenimento dati punto vendita
	var orarioApertura = getOrarioApertura();
	var orarioChiusura = getOrarioChiusura();
	var numInt = (orarioChiusura - orarioApertura) * 0.04;
	for(var i = 1; i <= numInt; i++)
		dsCopSett.addColumn('intervallo_' + i,i + 1,JSColumn.NUMBER);
	dsCopSett.addColumn('totale_ore',i + 1,JSColumn.NUMBER);
	dsCopSett.addColumn('giorno',i + 2,JSColumn.DATETIME);
	var gDiff = globals.dateDiff(giornoDal,giornoAl,1000 * 60 * 60 * 24);
	for (var g = 1; g <= gDiff; g++) 
	{
		var giorno = new Date(giornoDal.getFullYear(),giornoDal.getMonth(),giornoDal.getDate() + (g - 1));
		for (var l = 1; l <= arrLav.length; l++) 
		{
			dsCopSett.addRow([]);
			var rowIndex = dsCopSett.getMaxRowIndex();
			dsCopSett.setValue(rowIndex, 1, globals.getNominativo(arrLav[l - 1]));
			var recFasciaProg = scopes.giornaliera.getProgrammazioneFasceGiorno(arrLav[l - 1], giorno);
			if (recFasciaProg != null && recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature != null && recFasciaProg.e2giornalieraprogfasce_to_e2fo_fasceorarie.totaleorefascia != 0) {
				var inizioOrario = recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.inizioorario;
				var inizioPausa = recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.iniziopausa;
				var finePausa = recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.finepausa;
				var fineOrario = recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.fineorario;

				var inizioInt = orarioApertura;
				var fineInt;

				for (i = 1; i <= numInt; i++) {
					var inizioIntHr = parseInt(utils.stringLeft(inizioInt.toString(), inizioInt.toString().length - 2), 10);
					var inizioIntMin = parseInt(utils.stringRight(inizioInt.toString(), 2), 10);

					switch (inizioIntMin) {
					case 45:
						fineInt = (inizioIntHr + 1) * 100;
						break;
					default:
						fineInt = inizioInt + 15;
						break
					}

					if (inizioPausa != null) {
						if (inizioOrario <= inizioInt && inizioInt < inizioPausa || finePausa <= inizioInt && inizioInt < fineOrario)
							dsCopSett.setValue(rowIndex, i + 1, 1);
						else
							dsCopSett.setValue(rowIndex, i + 1, null);
					} else {
						if (inizioInt >= inizioOrario && fineInt <= fineOrario)
							dsCopSett.setValue(rowIndex, i + 1, 1);
						else
							dsCopSett.setValue(rowIndex, i + 1, null);
					}

					inizioInt = fineInt;
				}

			} else if (recFasciaProg != null && recFasciaProg.e2giornalieraprogfasce_to_e2fo_fasceorarie.totaleorefascia == 0) {
				if (recFasciaProg.tiporiposo)
					for (i = 1; i <= numInt; i++)
						dsCopSett.setValue(rowIndex, i + 1, null);
				else
					for (i = 1; i <= numInt; i++)
						dsCopSett.setValue(rowIndex, i + 1, null);

			} else {
				// TODO verifica eventuali assenze (ferie, malattie, etc)
				for (i = 1; i <= numInt; i++)
					if (recFasciaProg != null)
						dsCopSett.setValue(rowIndex, i + 1, null); // assenze programmate
					else
						dsCopSett.setValue(rowIndex, i + 1, null);
			}

			// se la fascia è stata programmata aggiorna il riepilogo del totale ore
			if (recFasciaProg && recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature)
				dsCopSett.setValue(rowIndex, i + 1, globals.calcolaOreEventoFasciaOrariaTimbrature(recFasciaProg.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.iddittafasciaorariatimbrature));
			else
				dsCopSett.setValue(rowIndex, i + 1, 0);
			
			dsCopSett.setValue(rowIndex,i + 2,giorno);
		}
	}
	return dsCopSett;
}

/**
 * @properties={typeid:24,uuid:"988595A4-4F06-4447-973A-F7966BD9CDCC"}
 */
function getOrarioApertura()
{
	return 800;
}

/**
 * @properties={typeid:24,uuid:"239EF8B1-8475-47C5-AA6C-EA6DCE9D29F3"}
 */
function getOrarioChiusura()
{
	return 2100;
}

/**
 * Ottiene il valore delle ore di festività goduta, relativamente alla data indicata,
 * per il dipendente nella struttura di riepilogo 
 * 
 * @param {String} dataFesta
 * @param {Number} idLavoratore
 *  
 * @return Number
 *  
 * @properties={typeid:24,uuid:"5D73D756-3AC1-484B-A806-744A473696BB"}
 */
function getOreFestivitaGoduta(dataFesta,idLavoratore)
{
	var frmOpt = forms.neg_header_options;
	for(var i = 0; i < frmOpt.vArrRiepilogoFestivita.length; i++)
	{
		if(frmOpt.vArrRiepilogoFestivita[i][0] == dataFesta)
		{
			/** @type {Array<Array<Object>>}*/
			var vArrFesta = frmOpt.vArrRiepilogoFestivita[i][2];
			for(var j = 0; j < vArrFesta.length; j++)
			{
				if(vArrFesta[j][0] == idLavoratore && utils.stringLeft(vArrFesta[j][2].toString(),2) == "FG")
					return vArrFesta[j][1];
				
			}
		}
	}
	
	return 0;
}

/**
 * Restituisce true se la data rientra tra i giorni di festività ed ha la proprietà 
 * di goduta, false altrimenti
 * 
 * @param {String} dataFesta
 * 
 * @return Boolean 
 *  
 * @properties={typeid:24,uuid:"861B5CEE-54B3-4E97-8639-678170E1AC32"}
 */
function isFestivitaGoduta(dataFesta)
{
	var frmOpt = forms.neg_header_options;
	for(var i = 0; i < frmOpt.vArrRiepilogoFestivita.length; i++)
	{
		if(frmOpt.vArrRiepilogoFestivita[i][0] == dataFesta)
		{
			/** @type{Array<Array<Object>>}*/
			var vArrFesta = frmOpt.vArrRiepilogoFestivita[i][2];
			for(var j = 0; j < vArrFesta.length; j++)
			{
				if(utils.stringLeft(vArrFesta[j][2].toString(),2) == "FG")
					return true;
				
			}
		}
	}
	
	return false;
}

/**
 * Restituisce true se la data rientra tra i giorni di festività ed ha la proprietà 
 * di goduta, false altrimenti
 * 
 * @param {String} dataFesta
 * @param {Number} idLavoratore
 * 
 * @return Boolean 
 *  
 * @properties={typeid:24,uuid:"236BDA22-8B42-4741-A752-6FAA53188C2F"}
 */
function isFestivitaGodutaLavoratore(dataFesta,idLavoratore)
{
	var frmOpt = forms.neg_header_options;
	for(var i = 0; i < frmOpt.vArrRiepilogoFestivita.length; i++)
	{
	    if(frmOpt.vArrRiepilogoFestivita[i][0] == dataFesta)
		{
			/** @type {Array<Array<Object>>}*/
			var vArrFesta = frmOpt.vArrRiepilogoFestivita[i][2];
			for(var j = 0; j < vArrFesta.length; j++)
			{
				if(vArrFesta[j][0] == idLavoratore && utils.stringLeft(vArrFesta[j][2].toString(),2) == "FG")
					return true;
				
			}
		}
	}
	
	return false;
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"89D38A7E-175B-4823-8CF5-7ABD2C570C0E"}
 */
function onActionIntervallo(event)
{
	var formName = event.getFormName();
	var elemName = event.getElementName();
	
	var pos_1 = utils.stringPosition(elemName,'_',0,2);
	var pos_2 = utils.stringPosition(elemName,'_',0,3);
	var rIndex = parseInt(utils.stringMiddle(elemName,pos_1 + 1,pos_2 - 1));
	var gIndex = parseInt(utils.stringMiddle(elemName,pos_2 + 1,elemName.length));
	
	var giornoIso = utils.stringMiddle(formName,21,8);
	var gg = parseInt(utils.stringRight(giornoIso,2),10);
	var yy = parseInt(utils.stringLeft(giornoIso,4),10);
	var MM = parseInt(utils.stringMiddle(giornoIso,5,2),10);
	var giorno = new Date(yy,MM - 1,gg);
	
	var frm = forms[formName];
	var fs = frm.foundset;
	var currRec = fs.getRecord(rIndex);
	var orarioApertura = globals.getOrarioApertura();
	var orarioChiusura = globals.getOrarioChiusura();
	var numOreProg = orarioChiusura - orarioApertura; 
	var numIntervalli = (numOreProg * 0.04);
	
	var oldValue = currRec['intervallo_' + gIndex];
	switch(oldValue)
	{
		case 0:
		case 3:	
			currRec['intervallo_' + gIndex] = 1;
			
			if(gestisciModificaCoperturaOrario(currRec,orarioApertura,numIntervalli,giorno))
			{
				// inserendo la programmazione, se si parte da una situazione a zero ore ed è un giorno festivo 
				// ridisegnamo l'assenza per festività (la fascia a zero ore è già stata inserita)
				if(currRec['totale_ore'] == 0
				   && forms.neg_header_options.vArrGiorniFestivi.indexOf(giornoIso) != -1)
				   for(var i = 1; i <= numIntervalli; i++)
						frm.elements['lbl_intervallo_' + rIndex + '_' + i].bgcolor = 'white';			
								
				frm.elements[elemName].bgcolor = globals.Colors.ATTENDANT.background;	
				currRec['totale_ore'] += 0.25;
				forms[formName].elements['lbl_tot_ore_' + rIndex].text = currRec['totale_ore'];
				forms[formName]['var_pres_' + gIndex] = forms[formName]['var_pres_' + gIndex] + 1;
				forms[formName].elements['lbl_persone_intervallo_' + gIndex].text = forms[formName]['var_pres_' + gIndex]; 
								
			}
			else
				currRec['intervallo_' + gIndex] = 0;
			break;
		case 1:
			currRec['intervallo_' + gIndex] = 0;
			
			if(gestisciModificaCoperturaOrario(currRec,orarioApertura,numIntervalli,giorno))
			{
				currRec['totale_ore'] -= 0.25;
				forms[formName].elements['lbl_tot_ore_' + rIndex].text = currRec['totale_ore'];
				forms[formName]['var_pres_' + gIndex] = forms[formName]['var_pres_' + gIndex] - 1;
				forms[formName].elements['lbl_persone_intervallo_' + gIndex].text = forms[formName]['var_pres_' + gIndex];
			
				// togliendo la programmazione, se si è arrivati a zero ore ed è un giorno festivo 
				// assegnamo il teorico relativo alle ore festive e ridisegnamo l'assenza per festività
				if(currRec['totale_ore'] == 0
				   && forms.neg_header_options.vArrGiorniFestivi.indexOf(giornoIso) != -1)
				{
					var oreFest = globals.getOreFestivitaGoduta(giornoIso,currRec['idlavoratore']);
					if(oreFest != 0)
						for(var j = 1; j <= numIntervalli; j++)
							if(frm.elements['lbl_intervallo_' + rIndex + '_' + i])
							   frm.elements['lbl_intervallo_' + rIndex + '_' + i].bgcolor = globals.Colors.ON_HOLIDAYS.background;			
				}
				else
					frm.elements[elemName].bgcolor = 'white';
					 
			}
			else
				currRec['intervallo_' + gIndex] = 1;
		    break;
		default:
		    globals.ma_utl_showWarningDialog('TODO : caso ' + oldValue + ' ...under construction');
			break;
	}
		
}

/**
 * Apre il menu contestuale per la programmazione della copertura del giorno
 *  
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"47C5219D-CEB9-4B56-874E-AECBF6AB5EF4"}
 */
function onRightClickIntervallo(event)
{
	var elemName = event.getElementName();
	
	// nel caso di visualizzazione dell'intera rete non permettiamo la gestione diretta per evitare errori
	if(globals.nav_program_name == 'NEG_Rete')
    	return;
	
	var frmName = event.getFormName();
	var isoDateString = utils.stringMiddle(frmName,21,8);
	var anno = parseInt(utils.stringLeft(isoDateString,4),10);
	var mese = parseInt(utils.stringMiddle(isoDateString,5,2),10);
	var gg = parseInt(utils.stringRight(isoDateString,2),10);
	var giorno = new Date(anno,mese - 1,gg);
	var numSettimana = globals.getWeekNumber(giorno); 
	var index =  parseInt(utils.stringMiddle(elemName,utils.stringPosition(elemName,'_',0,2) + 1,utils.stringPosition(elemName,'_',0,3) - (utils.stringPosition(elemName,'_',0,2) + 1)),10);
	var primoGgSettimana = globals.getDateOfISOWeek(numSettimana,forms.neg_header_options.vAnno);
    var ultimoGgSettimana = new Date(primoGgSettimana.getFullYear(),primoGgSettimana.getMonth(), primoGgSettimana.getDate() + 6);
    
    // TODO ripristinare blocco su settimana trascorsa
	// la modifica della settimana (o del singolo giorno) è bloccata se l'utente non è gestore
	// e l'ultimo giorno della settimana è < di oggi
    var enabled = true;//globals.ma_utl_hasKey(globals.Key.AUT_GESTORE) || globals.TODAY > ultimoGgSettimana;
 		
    // TODO DA RIMETTERE !!!: verifica se il giorno selezionato appartiene ad un periodo già elaborato
//    if(periodo <= globals.ma_utl_getUltimoCedolinoStampato(forms.neg_header_dtl.idditta))
//    {
//    	globals.ma_utl_showWarningDialog('Non è possibile programmare i giorni di un periodo già elaborato','Prepara programmazione giorno');
//        return;
//    }
    // verifica se il giorno selezionato appartiene al mese precedente
    if(!globals.ma_utl_hasKey(globals.Key.ADMIN_NEG)
    	&& (giorno == globals.getChristmas(anno) 
    		|| giorno == globals.getBoxingDay(anno)
			|| giorno == globals.getFirstYearDay(anno))
			|| giorno == globals.getFirstYearDay(anno + 1))
    {
    	globals.ma_utl_showWarningDialog('Non è possibile programmare i giorni di chiusura del punto vendita','Prepara programmazione giorno');
        return;
    }
    
	var popUpMenu = plugins.window.createPopupMenu();
    
	var modificaSett = popUpMenu.addMenuItem('Modifica la settimana',apriPopupProgrammazioneSettimana);
	modificaSett.methodArguments = [event,numSettimana,giorno,index,true];
	modificaSett.enabled = enabled;
		
	var modificaGg = popUpMenu.addMenuItem('Modifica il giorno',apriPopupGiornoSettimana)
	modificaGg.methodArguments = [event,numSettimana,giorno,index,true];
	modificaGg.enabled = enabled;
		
	var modificaGiornoDip = popUpMenu.addMenuItem('Modifica il giorno del dipendente',apriPopupGiornoSettimanaDip,true);
	modificaGiornoDip.methodArguments = [event,numSettimana,giorno,forms[frmName].foundset.getRecord(index)['idlavoratore']];
	modificaGiornoDip.enabled = enabled;
		
	popUpMenu.addSeparator();
	
//	var impostaRiposoP = popUpMenu.addMenuItem('Riposo primario',impostaRiposo);
//	impostaRiposoP.methodArguments = [event,foundset['idlavoratore'],numSettimana,elemName,1];
//	
//	var impostaRiposoS = popUpMenu.addMenuItem('Riposo secondario',impostaRiposo);
//	impostaRiposoS.methodArguments = [event,foundset['idlavoratore'],numSettimana,elemName,2];
	
	var giornoRip = globals.getGiornoRiposoSettimanale(forms[frmName].foundset.getRecord(index)['idlavoratore'],giorno,1);
	var impostaRiposoPr = popUpMenu.addMenuItem('Imposta riposo',impostaRiposo);
	impostaRiposoPr.methodArguments = [event,forms[frmName].foundset.getRecord(index)['idlavoratore'],numSettimana,elemName,1,true,giorno];
	impostaRiposoPr.enabled = giornoRip == giorno ? false : true;
	var togliRiposo = popUpMenu.addMenuItem('Togli riposo',impostaRiposo);
	togliRiposo.methodArguments = [event,forms[frmName].foundset.getRecord(index)['idlavoratore'],numSettimana,elemName,0,true,giorno];
	togliRiposo.enabled = giornoRip == giorno ? true : false;
	
    popUpMenu.addSeparator();
	
	var impostaAssenza = popUpMenu.addMenuItem('Inserisci assenza',inserisciAssenza);
	impostaAssenza.methodArguments = [event,forms[frmName].foundset.getRecord(index)['idlavoratore'],numSettimana,giorno,true];
	impostaAssenza.enabled = giornoRip == giorno ? false : true;
	
	popUpMenu.addSeparator();
	
	// chiusura negozio
//	var chiusuraNegozio = popUpMenu.addMenuItem('Punto vendita chiuso',impostaChiusuraNegozio);
//	chiusuraNegozio.methodArguments = [event,globals.foundsetToArray(foundset,'idlavoratore'),numSettimana,elemName,fromCopertura];
//	
//	var sep3 = popUpMenu.addSeparator();
		
	var stampaSettimana = popUpMenu.addMenuItem('Stampa il programma settimanale',scopes.neg_reports.confermaEsportazioneReportSettimana);
	stampaSettimana.methodArguments = [event,forms.neg_header_dtl.idditta,numSettimana,globals.getAnno(),globals.getTipoGestoreReteImpresa()];
	
	popUpMenu.addSeparator();
	
	var stampaGiorno = popUpMenu.addMenuItem('Stampa la copertura del giorno',scopes.neg_reports.confermaEsportazioneProgrammazioneGiorno);
	stampaGiorno.methodArguments = [event,forms.neg_header_dtl.idditta,giorno,globals.getTipoGestoreReteImpresa()];
	var stampaCopSett = popUpMenu.addMenuItem('Stampa la copertura della settimana',scopes.neg_reports.confermaEsportazioneProgrammazionePeriodo);
	stampaCopSett.methodArguments = [event,forms.neg_header_dtl.idditta,primoGgSettimana,ultimoGgSettimana,globals.getTipoGestoreReteImpresa()];
	
	popUpMenu.show(event.getSource());
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"F197EAFF-4CDB-40E2-B878-91BA33DBB55A"}
 */
function onDoubleClickIntervallo(event)
{
	var elemName = event.getElementName();
	globals.ma_utl_showInfoDialog(elemName + ': onDoubleClick');
}

/**
 * @param _itemInd
 * @param _parItem
 * @param _isSel
 * @param _parMenTxt
 * @param _menuTxt
 * @param event
 * @param settimana
 * @param giorno
 * @param selIndex
 * @param fromCopertura
 *
 * @properties={typeid:24,uuid:"B8292472-2CD7-45B0-8E64-FBD797EFB35C"}
 */
function apriPopupProgrammazioneSettimana(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt,event,settimana,giorno,selIndex,fromCopertura)
{
	globals.refreshProgrammazioneSettimanaNegozio(event,settimana,selIndex,fromCopertura);
}

/**
 * @param _itemInd
 * @param _parItem
 * @param _isSel
 * @param _parMenTxt
 * @param _menuTxt
 * @param event
 * @param settimana
 * @param giorno
 * @param selIndex
 * @param fromCopertura
 * 
 * @properties={typeid:24,uuid:"A70CA70F-E061-4936-847E-05F0B30763FF"}
 */
function apriPopupGiornoSettimana(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt,event,
	                              settimana,giorno,selIndex,fromCopertura)
{
	var anno = globals.getAnno();
	var mese = globals.getMese();
		
    // TODO DA RIMETTERE !!!: verifica se il giorno selezionato appartiene ad un periodo già elaborato
//    if(periodo <= globals.ma_utl_getUltimoCedolinoStampato(forms.neg_header_dtl.idditta))
//    {
//    	globals.ma_utl_showWarningDialog('Non è possibile programmare i giorni di un periodo già elaborato','Prepara programmazione giorno');
//        return;
//    }
    // verifica se il giorno selezionato appartiene al mese precedente
    if(anno == giorno.getFullYear() && mese > giorno.getMonth() + 1 || anno > giorno.getFullYear())
    {
    	globals.ma_utl_showWarningDialog('Non è possibile programmare i giorni della settimana del mese precedente','Prepara programmazione giorno');
        return;
    }
    else if(security.getUserName() != 'ASSISTENZA' 
    	    && (giorno == globals.getChristmas(anno) 
   	    		|| giorno == globals.getBoxingDay(anno)
				|| giorno == globals.getFirstYearDay(anno))
				|| giorno == globals.getFirstYearDay(anno + 1))
    {
    	globals.ma_utl_showWarningDialog('Non è possibile programmare i giorni di chiusura','Prepara programmazione giorno');
        return;
    }
    
    globals.refreshProgrammazioneGiornoNegozio(event,giorno,settimana,fromCopertura,true);
}

/**
 * @param _itemInd
 * @param _parItem
 * @param _isSel
 * @param _parMenTxt
 * @param _menuTxt
 * @param event
 * @param settimana
 * @param giorno
 * @param idLavoratore
 * @param fromCopertura
 *
 * @properties={typeid:24,uuid:"5C0F4ED3-298C-43A4-9A51-B361BC02503D"}
 */
function apriPopupGiornoSettimanaDip(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt,event,settimana,giorno,idLavoratore,fromCopertura)
{
	var anno = globals.getAnno();
	var mese = globals.getMese();
		
    // TODO DA RIMETTERE !!!: verifica se il giorno selezionato appartiene ad un periodo già elaborato
//    if(periodo <= globals.ma_utl_getUltimoCedolinoStampato(forms.neg_header_dtl.idditta))
//    {
//    	globals.ma_utl_showWarningDialog('Non è possibile programmare i giorni di un periodo già elaborato','Prepara programmazione giorno');
//        return;
//    }
    // verifica se il giorno selezionato appartiene al mese precedente
    if(anno == giorno.getFullYear() && mese > giorno.getMonth() + 1 || anno > giorno.getFullYear())
    {
    	globals.ma_utl_showWarningDialog('Non è possibile programmare i giorni della settimana del mese precedente','Prepara programmazione giorno');
        return;
    }
    else if(!globals.ma_utl_hasKey(globals.Key.ADMIN_NEG) 
    	    && (giorno == globals.getChristmas(anno) 
   	    		|| giorno == globals.getBoxingDay(anno)
				|| giorno == globals.getFirstYearDay(anno))
				|| giorno == globals.getFirstYearDay(anno + 1))
    {
    	globals.ma_utl_showWarningDialog('Non è possibile programmare i giorni di chiusura','Prepara programmazione giorno');
        return;
    }
    
    globals.refreshProgrammazioneGiornoNegozioDip(event,giorno,idLavoratore,settimana,fromCopertura,true);
}

/**
 * Prepara la copia della programmazione settimanale di un singolo lavoratore
 * selezionata per la sovrascrittura su di un'altra
 * 
 * @param _itemInd
 * @param _parItem
 * @param _isSel
 * @param _parMenTxt
 * @param _menuTxt
 * @param event
 * @param settimana
 * @param idLavoratore
 *
 * @properties={typeid:24,uuid:"0DE6FEA5-66D5-4752-8346-C4C1A747735E"}
 */
function copiaProgrammazioneSettimanaDipendente(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt,event,settimana,idLavoratore)
{
	forms.neg_prog_periodo_tab.vDipendenteDaCopiare = idLavoratore;
	forms.neg_prog_periodo_tab.vSettimanaDipendenteDaCopiare = settimana;
	forms.neg_prog_periodo_tab.vSettimanaDaCopiare = null;
}

/**
 * Imposta il tipo di riposo programmato per il dipendente nel giorno indicato
 * 
 * @param _itemInd
 * @param _parItem
 * @param _isSel
 * @param _parMenTxt
 * @param _menuTxt
 * @param event
 * @param {Number} idLavoratore
 * @param settimana
 * @param elemName
 * @param tiporiposo //0 - nessuno, 1 - primario, 2- secondario
 * @param fromCopertura
 * @param giorno
 *
 * @properties={typeid:24,uuid:"4DAB4CC7-92DE-49CE-85D8-AD330F776F94"}
 * @AllowToRunInFind
 */
function impostaRiposo(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt,event,idLavoratore,settimana,elemName,tiporiposo,fromCopertura,giorno)
{
	try {
		var anno = globals.getAnno();
		var gg = globals.getDateOfISOWeek(settimana,anno);
		var index = globals.dateDiff(gg,giorno,1000 * 60 * 60 * 24);
		
		// controllo validità selezione del giorno rispetto a date di assunzione e cessazione
		var assunzione = globals.getDataAssunzione(idLavoratore);
        var cessazione = globals.getDataCessazione(idLavoratore);
        if(giorno < assunzione)
        {
        	globals.ma_utl_showWarningDialog('Il dipendente non risulta ancora assunto nel giorno selezionato!');
			return;
        }
        if(cessazione != null && giorno > cessazione)
        {
        	globals.ma_utl_showWarningDialog('Il dipendente risulta già cessato nel giorno selezionato!');
			return;
        }
        
        // controllo festività
        if(security.getUserName() != 'ASSISTENZA')
        {
			if(globals.getOreFestivitaGoduta(globals.dateFormat(giorno,globals.ISO_DATEFORMAT).toString(),idLavoratore))
			{
				globals.ma_utl_showWarningDialog('Non è possibile eliminare la programmazione per un giorno festivo','Programmazione giorno negozio');
			    return;
			}
        }
        
		// controllo presenza di eventi in budget relativi a richieste ferie /permessi
	    var recGiornBudget = globals.getRecGiornaliera(idLavoratore,giorno,globals.TipoGiornaliera.BUDGET);
		if(recGiornBudget
   		   && recGiornBudget.e2giornaliera_to_e2giornalieraeventi
		   && recGiornBudget.e2giornaliera_to_e2giornalieraeventi.idevento)
		{
			globals.ma_utl_showWarningDialog('Non è possibile eliminare la programmazione per un giorno con una richiesta di ferie/permessi associata','Programmazione giorno negozio');
		    return;
		}
        
		// controllo duplicazione riposo primario o secondario
		if (tiporiposo == 1 && globals.getGiornoRiposoSettimanale(idLavoratore, giorno, tiporiposo)) {
			globals.ma_utl_showWarningDialog('Riposo primario precedentemente impostato per la settimana!');
			return;
		} else if (tiporiposo == 2 && globals.getGiornoRiposoSettimanale(idLavoratore, giorno, tiporiposo)) {
			globals.ma_utl_showWarningDialog('Riposo secondario precedentemente impostato per la settimana!');
			return;
		}
	    		
		/** @type {JSFoundset<db:/ma_presenze/e2giornalieraprogfasce>} */
		var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.GIORNALIERA_PROGFASCE);
		if (fs.find()) {
			fs.iddip = idLavoratore;
			fs.giorno = utils.dateFormat(giorno, globals.ISO_DATEFORMAT) + '|yyyyMMdd';

			// se per il giorno è già stata programmata una fascia programmata questa non deve essere associata ad un idfasciatimbrature
			// e dev'essere a zero ore per poterla impostare come riposo
			if (fs.search()) {
				var answer = true;
				var msg = '';
				
				databaseManager.startTransaction();
				
				if(tiporiposo != 0)
				{
					if (fs.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature 
							&& (fs.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.inizioorario || fs.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.fineorario)) 
					{
						if(forms.neg_header_options.vArrGiorniFestivi.indexOf(utils.dateFormat(giorno,globals.ISO_DATEFORMAT)) != -1)
						{
							if(globals.getOreFestivitaGoduta(utils.dateFormat(giorno,globals.ISO_DATEFORMAT),idLavoratore))
							   msg += 'Il giorno è festivo. Le eventuali ore programmate in precedenza verranno eliminate.';
						}
						else
							msg += 'Le eventuali ore programmate in precedenza per il giorno diventeranno ore di straordinario.';
					}
					else if (globals.getTotaleOreFascia(fs.e2giornalieraprogfasce_to_e2fo_fasceorarie.idfasciaoraria) != 0) 
						msg += 'L\'impostazione del giorno di riposo eliminerà la fascia precedentemente inserita.';
					
					if(msg != '')
					   answer = globals.ma_utl_showYesNoQuestion(msg + '\nProseguire comunque?','Imposta riposo');	

					if(answer)
					{    
						if(forms.neg_header_options.vArrGiorniFestivi.indexOf(utils.dateFormat(giorno,globals.ISO_DATEFORMAT)) != -1)
						{  
							if(globals.getOreFestivitaGoduta(utils.dateFormat(giorno,globals.ISO_DATEFORMAT),idLavoratore))
						       fs.iddittafasciaorariatimbrature = null;
						}
						fs.idfasciaoraria = globals.getFasciaOrariaDaTotaleOre(globals.getDitta(idLavoratore),0).idfasciaoraria;
						fs.tiporiposo = tiporiposo;
					}

				}
				else
				{
					if(answer)
					{
						var totOreProg = globals.calcolaOreEventoFasciaOrariaTimbrature(fs.iddittafasciaorariatimbrature);
						if(totOreProg == 0
						   && forms.neg_header_options.vArrGiorniFestivi.indexOf(utils.dateFormat(giorno,globals.ISO_DATEFORMAT)) != -1)
						   totOreProg = globals.getOreFestivitaGoduta(utils.dateFormat(giorno,globals.ISO_DATEFORMAT),idLavoratore);
						fs.idfasciaoraria = globals.getFasciaOrariaDaTotaleOre(globals.getDitta(idLavoratore),totOreProg * 100).idfasciaoraria;
						fs.tiporiposo = tiporiposo;
						
					}
				}
				
								
			}
			// se non è ancora associata una fascia programmata, procediamo ad inserirla come fascia a zero ore e tipo di riposo indicato
			else {
				databaseManager.startTransaction();
				var newProg = fs.getRecord(fs.newRecord())
				if (!newProg)
					throw new Error('Errore durante la creazione del record nella tabella E2GiornalieraProgFasce');

				newProg.iddip = idLavoratore;
				newProg.giorno = giorno;
				newProg.idfasciaoraria = globals.getFasciaOrariaDaTotaleOre(globals.getDitta(idLavoratore), 0).idfasciaoraria;
				newProg.tiporiposo = tiporiposo;
				newProg.idfasciaorariafittizia = null;
				newProg.iddittafasciaorariatimbrature = null;
				newProg.festivo = false;
				if(forms.neg_header_options.vArrGiorniFestivi.indexOf(utils.dateFormat(giorno, globals.ISO_DATEFORMAT)) != -1)
					if(globals.getOreFestivitaGoduta(utils.dateFormat(giorno,globals.ISO_DATEFORMAT),idLavoratore))
					   newProg.festivo = 1;
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
 * Apre la finestra per l'inserimento diretto di una assenza nel giorno
 * 
 * @param _itemInd
 * @param _parItem
 * @param _isSel
 * @param _parMenTxt
 * @param _menuTxt
 * @param event
 * @param idLavoratore
 * @param settimana
 * @param giorno
 * @param copertura
 * 
 * @properties={typeid:24,uuid:"D3B2CCCB-3793-48AA-90EA-E8E8AE8E976C"}
 */
function inserisciAssenza(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt,event,idLavoratore,settimana,giorno,copertura)
{
	var frm = forms.neg_prog_cop_ore_assenza;
	frm.vIdLavoratore = idLavoratore;
	frm.vGiorno = giorno;
	frm.vSettimana = settimana;
	frm.vCopertura = copertura;
	
	globals.ma_utl_setStatus(globals.Status.EDIT,frm.controller.getName());
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Inserisci assenza');
}

/**
* @param _itemInd
* @param _parItem
* @param _isSel
* @param _parMenTxt
* @param _menuTxt
* @param event
* @param arrLavoratori
* @param settimana
* @param elemName
* @param fromCopertura
*
* @properties={typeid:24,uuid:"9B2230F0-C40A-42C9-80F7-A4E420F9F68C"}
* @AllowToRunInFind
*/
function impostaChiusuraNegozio(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt,event,
	                            arrLavoratori,settimana,elemName,fromCopertura)
{
	try {
		var frmSettName = 'neg_prog_periodo_settimana_' + settimana;
		/** @type {Form<neg_prog_periodo_settimana>}*/
		var frmSett = forms[frmSettName];

		var anno = globals.getAnno();

		var offsetGiornoSettimana = -1;
		switch (elemName) {
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
		default:
			break;
		}

		// trova il giorno corrispondente
		var primoGgSettimana = globals.getDateOfISOWeek(settimana, anno);
		var giorno = new Date(primoGgSettimana.getFullYear(), primoGgSettimana.getMonth(), primoGgSettimana.getDate() + offsetGiornoSettimana);

		for (var l = 0; l < arrLavoratori.length; l++) {
			var idLavoratore = arrLavoratori[l];

			/** @type {JSFoundset<db:/ma_presenze/e2giornalieraprogfasce>} */
			var fs = databaseManager.getFoundSet(globals.Server.MA_PRESENZE, globals.Table.GIORNALIERA_PROGFASCE);
			if (fs.find()) {
				fs.iddip = idLavoratore;
				fs.giorno = utils.dateFormat(giorno, globals.ISO_DATEFORMAT) + '|yyyyMMdd';

				// se per il giorno è già stata programmata una fascia programmata questa non deve essere associata ad un idfasciatimbrature
				// e dev'essere a zero ore per poterla impostare come riposo
				if (fs.search()) {
					databaseManager.startTransaction();

					//impostiamo la fascia a zero ore corrispondente
					fs.idfasciaoraria = globals.getFasciaOrariaDaTotaleOre(globals.getDitta(idLavoratore), 0).idfasciaoraria;
					fs.iddittafasciaorariatimbrature = null;
					fs.idfasciaorariafittizia = null;
					//se non è ancora stato inserito un giorno di riposo per la settimana impostalo automaticamente per il giorno di chiusura
					//fs.tiporiposo = globals.getGiornoRiposoSettimanale(idLavoratore, giorno, 1) != null ? 0 : 1;
					fs.festivo = false;
					if(forms.neg_header_options.vArrGiorniFestivi.indexOf(utils.dateFormat(giorno, globals.ISO_DATEFORMAT)) != -1)
						if(globals.getOreFestivitaGoduta(utils.dateFormat(giorno,globals.ISO_DATEFORMAT),idLavoratore))
//						if(globals.getOreFestivitaDipendente(idLavoratore,giorno,fs.idfasciaoraria)) 
						  fs.festivo = 1;
					if (!databaseManager.commitTransaction()) {
						databaseManager.rollbackTransaction();
						globals.ma_utl_showErrorDialog('Errore durante la gestione del giorno di chiusura del punto vendita', 'Imposta punto vendita chiuso');
						return;
					} else
					// prepara programmazione settimanale
						frmSett.preparaProgrammazioneSettimanaNegozio(settimana,anno,globals.getTipoGestoreReteImpresa());

				}
				// se non è ancora associata una fascia programmata, procediamo ad inserirla come fascia a zero ore e tipo di riposo indicato
				else {
					databaseManager.startTransaction();
					var newProg = fs.getRecord(fs.newRecord())
					if (!newProg)
						throw new Error('Errore durante la creazione del record nella tabella E2GiornalieraProgFasce');

					newProg.iddip = idLavoratore;
					newProg.giorno = giorno;
					newProg.idfasciaoraria = globals.getFasciaOrariaDaTotaleOre(globals.getDitta(idLavoratore), 0).idfasciaoraria;
					newProg.tiporiposo = globals.getGiornoRiposoSettimanale(idLavoratore, giorno, 1) != null ? 0 : 1;
					newProg.idfasciaorariafittizia = null;
					newProg.iddittafasciaorariatimbrature = null;
					newProg.festivo = false;
					if(forms.neg_header_options.vArrGiorniFestivi.indexOf(utils.dateFormat(giorno, globals.ISO_DATEFORMAT)) != -1)
						if(globals.getOreFestivitaGoduta(utils.dateFormat(giorno,globals.ISO_DATEFORMAT),idLavoratore))
//						if(globals.getOreFestivitaDipendente(idLavoratore,giorno,newProg.idfasciaoraria) != null)
							newProg.festivo = true;

					var success = databaseManager.commitTransaction();
					if (!success) {
						var failedrecords = databaseManager.getFailedRecords();
						if (failedrecords && failedrecords.length > 0)
							throw new Error('Errore durante il salvataggio del record nella tabella E2GiornalieraProgFasce');
					}
					// prepara programmazione settimanale
					frmSett.preparaProgrammazioneSettimanaNegozio(settimana,anno,globals.getTipoGestoreReteImpresa());

				}
			} else
				throw new Error('Cannot go to find mode');
		}
	} catch (ex) {
		application.output(ex.message, LOGGINGLEVEL.ERROR);
		databaseManager.rollbackTransaction();
		globals.ma_utl_showErrorDialog(ex.message);
	}
}

/**
 * Copia la settimana selezionata in precedenza come da copiare e la riporta in quella selezionata
 * per il dipendente selezionato
 * 
 * @param _itemInd
 * @param _parItem
 * @param _isSel
 * @param _parMenTxt
 * @param _menuTxt
 * @param event
 * @param settimana
 * @param idLavoratoreDaIncollare
 *
 * @properties={typeid:24,uuid:"022A7C2E-532A-4E1A-A58A-AFFA28CAF0BF"}
 */
function incollaProgrammazioneSettimanaDipendente(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt,event,settimana,idLavoratoreDaIncollare)
{
	var answer = globals.ma_utl_showYesNoQuestion('Eventuali dati di programmazione già inseriti verranno sovrascritti. <br/>Procedere ugualmente con l\'operazione di copia/incolla? ','Copia programmazione settimanale');
	if(!answer)
		return;
	var settimanaDaCopiare = forms.neg_prog_periodo_tab.vSettimanaDipendenteDaCopiare;
	var primoGgSettimanaDaCopiare = globals.getDateOfISOWeek(settimanaDaCopiare,globals.getAnno());
	var primoGgSettimanaDaIncollare = globals.getDateOfISOWeek(settimana,globals.getAnno());
	var ultimoGgSettimanaDaCopiare = new Date(primoGgSettimanaDaCopiare.getFullYear(),primoGgSettimanaDaCopiare.getMonth(),primoGgSettimanaDaCopiare.getDate() + 6);
	var ultimoGgSettimanaDaIncollare = new Date(primoGgSettimanaDaIncollare.getFullYear(),primoGgSettimanaDaIncollare.getMonth(),primoGgSettimanaDaIncollare.getDate() + 6);
	
	var idLavDaCopiare = forms.neg_prog_periodo_tab.vDipendenteDaCopiare;
	var idLavDaIncollare = idLavoratoreDaIncollare;
	
	// blocco della copia nel caso di eventuali eventi in giornaliera di budget settimana da copiare
	var recsGiornBudgetCopia = globals.getRecsGiornaliera(idLavDaCopiare,primoGgSettimanaDaCopiare,ultimoGgSettimanaDaCopiare,globals.TipoGiornaliera.BUDGET);
	if(recsGiornBudgetCopia != null)
	{
		var copiaMsg = 'Il dipendente ' + globals.getNominativo(idLavDaCopiare) + ' ha degli eventi precedentemente assegnatigli in budget. La sua situazione settimanale non può essere copiata.';
		globals.ma_utl_showWarningDialog(copiaMsg,'Copia/incolla settimana');
		return;
	}
	// blocco della copia nel caso di eventuali eventi in giornaliera di budget settimana da incollare
	var recsGiornBudgetIncolla = globals.getRecsGiornaliera(idLavDaIncollare,primoGgSettimanaDaIncollare,ultimoGgSettimanaDaIncollare,globals.TipoGiornaliera.BUDGET);
	if(recsGiornBudgetIncolla != null)
	{
		var incollaMsg = 'Il dipendente ' + globals.getNominativo(idLavDaIncollare) + ' ha degli eventi precedentemente assegnatigli in budget. La sua situazione settimanale non può essere incollata.';
		globals.ma_utl_showWarningDialog(incollaMsg,'Copia/incolla settimana');
		return;
	}
	
	// segnalazione nel caso di copia/incolla da/su settimane con festività
	var arrFestivita = forms.neg_header_options.vArrGiorniFestivi;
	var bFestCopia = false;
	var bFestIncolla  = false;
	for(var f = 0; f < arrFestivita.length; f++)
	{
		if(parseInt(arrFestivita[f],10) >= parseInt(globals.dateFormat(primoGgSettimanaDaCopiare,globals.ISO_DATEFORMAT).toString(),10)
		   && parseInt(arrFestivita[f],10) <= parseInt(globals.dateFormat(ultimoGgSettimanaDaCopiare,globals.ISO_DATEFORMAT).toString(),10))
		{
			bFestCopia = true;
			continue;
		}
					
		if(parseInt(arrFestivita[f],10) >= parseInt(globals.dateFormat(primoGgSettimanaDaIncollare,globals.ISO_DATEFORMAT).toString(),10)
		   && parseInt(arrFestivita[f],10) <= parseInt(globals.dateFormat(ultimoGgSettimanaDaIncollare,globals.ISO_DATEFORMAT).toString(),10))
		{
			bFestIncolla = true;
			continue;
		}
	}
	
	if(bFestCopia)
	{
		answer = globals.ma_utl_showYesNoQuestion('La settimana che si sta copiando contiene un giorno festivo. <br/>\
										           Si desidera proseguire comunque?<br/>\
										           Controllare nella settimana incollata i valori delle ore teoriche e di straordinario per il giorno corrispondente','Copia programmazione settimana');
        if(!answer)
           return;
	}
	
	if(bFestIncolla)
	{
		answer = globals.ma_utl_showYesNoQuestion('La settimana sulla quale si sta per incollare contiene un giorno festivo. <br/>\
		                                           Per tale giorno le ore teoriche non verranno riportate ma rimarranno quelle di default.\
		                                           Si desidera proseguire comunque?<br/>\
                                                   Controllare nella settimana incollata i valori delle ore teoriche e di straordinario per il giorno corrispondente','Incolla programmazione settimana');
		if(!answer)
			return;
	}
		
    // eliminazione di eventuali fasce programmate precedentemente inserite per i dipendenti nei giorni modificati
	if(!globals.eliminaFasceProgrammate([idLavDaIncollare]
		                               ,primoGgSettimanaDaIncollare
									   ,ultimoGgSettimanaDaIncollare))
	return;
	
	// acquisizione dei dati della settimana da copiare ed inserimento nella settimana da incollare
	/** @type {JSFoundset<db:/ma_presenze/e2giornalieraprogfasce>} */
	var fsFasceProg = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA_PROGFASCE);
		
	databaseManager.startTransaction();
	
	for(var g = 0; g < 7; g++)
	{
		var recFasceCopia = scopes.giornaliera.getProgrammazioneFasceGiorno(idLavDaCopiare,
						                                                     new Date(primoGgSettimanaDaCopiare.getFullYear()
																			          ,primoGgSettimanaDaCopiare.getMonth()
																			          ,primoGgSettimanaDaCopiare.getDate() + g));
		if(recFasceCopia != null)
		{
			if(fsFasceProg.newRecord())
			{
				// se il giorno su cui si va ad incollare è festivo, le ore teoriche sono uguali alle ore delle festività teoriche 
				// le ore programmate costituiranno straordinario
				var currGiorno = new Date(primoGgSettimanaDaIncollare.getFullYear(),primoGgSettimanaDaIncollare.getMonth(),primoGgSettimanaDaIncollare.getDate() + g);
				var totaleOre = 0;
				var isFestivo = forms.neg_header_options.vArrGiorniFestivi.indexOf(utils.dateFormat(currGiorno,globals.ISO_DATEFORMAT)) != -1;
				if(isFestivo)
					totaleOre = globals.getOreFestivitaGoduta(utils.dateFormat(currGiorno,globals.ISO_DATEFORMAT),idLavDaIncollare) * 100;
				else
					totaleOre = recFasceCopia.e2giornalieraprogfasce_to_e2fo_fasceorarie.totaleorefascia;
				
				var recFasciaIncolla = globals.getFasciaOrariaDaTotaleOre(globals.getDitta(idLavDaIncollare),totaleOre);
				var inizioOrario = recFasceCopia.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature ? recFasceCopia.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.inizioorario : null;
				var inizioPausa = recFasceCopia.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature ? recFasceCopia.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.iniziopausa : null;
				var finePausa = recFasceCopia.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature ? recFasceCopia.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.finepausa : null;
				var fineOrario = recFasceCopia.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature ? recFasceCopia.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.fineorario : null;
				
				var recFasciaTimbIncolla = globals.getFasciaOrariaDittaTimbrature(globals.getDitta(idLavDaIncollare)
					                                                              ,inizioOrario
																				  ,inizioPausa
																				  ,finePausa
																				  ,fineOrario);
				
				// TODO : verifica effettiva esistenza delle due fasce per la ditta del dipendente di destinazione!!!
				
				fsFasceProg.iddip = idLavDaIncollare;
				fsFasceProg.giorno = currGiorno;
				fsFasceProg.idfasciaoraria = recFasciaIncolla.idfasciaoraria;//recFasceCopia.idfasciaoraria;
				fsFasceProg.iddittafasciaorariatimbrature = recFasciaTimbIncolla != null ? recFasciaTimbIncolla.iddittafasciaorariatimbrature : null;//recFasceCopia.iddittafasciaorariatimbrature;
				fsFasceProg.tiporiposo = isFestivo ? 0 : recFasceCopia.tiporiposo;
			}
		}
	}
		
	if(!databaseManager.commitTransaction())
	{
		globals.ma_utl_showWarningDialog('Errore durante l\'inserimento della programmazione fasce','Copia programmazione settimanale del negozio');
		databaseManager.rollbackTransaction();
//		return;
	}
	
	// ridisegno della situazione mensile
	var frmName = 'neg_prog_periodo_settimana_' + settimana;
	/** @type {Form<neg_prog_periodo_settimana>}*/
	var frm = forms[frmName]; 
	frm.preparaProgrammazioneSettimanaNegozio(settimana,globals.getAnno(),globals.getTipoGestoreReteImpresa());
}

/**
 * Prepara la copia della programmazione settimanale selezionata per la sovrascrittura su di un'altra
 * 
 * @param _itemInd
 * @param _parItem
 * @param _isSel
 * @param _parMenTxt
 * @param _menuTxt
 * @param event
 * @param settimana
 *
 * @properties={typeid:24,uuid:"223CC89A-1486-4C4F-A96F-AAA0E47ABC45"}
 */
function copiaProgrammazioneSettimana(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt,event,settimana)
{
	forms.neg_prog_periodo_tab.vSettimanaDaCopiare = settimana;
	forms.neg_prog_periodo_tab.vDipendenteDaCopiare = null;
	forms.neg_prog_periodo_tab.vSettimanaDipendenteDaCopiare = null;
}

/**
 * TODO generated, please specify type and doc for the params
 * @param _itemInd
 * @param _parItem
 * @param _isSel
 * @param _parMenTxt
 * @param _menuTxt
 * @param event
 * @param settimana
 *
 * @properties={typeid:24,uuid:"44589E3A-E744-442C-BE6D-A395F560DBBA"}
 */
function incollaProgrammazioneSettimana(_itemInd, _parItem, _isSel, _parMenTxt, _menuTxt,event,settimana)
{
	var answer = globals.ma_utl_showYesNoQuestion('Eventuali dati di programmazione già inseriti verranno sovrascritti. <br/>Procedere ugualmente con l\'operazione di copia/incolla? ','Copia programmazione settimanale');
	if(!answer)
		return;
		
	var settimanaDaCopiare = forms.neg_prog_periodo_tab.vSettimanaDaCopiare;
	var primoGgSettimanaDaCopiare = globals.getDateOfISOWeek(settimanaDaCopiare,globals.getAnno());
	var ultimoGgSettimanaDaCopiare = new Date(primoGgSettimanaDaCopiare.getFullYear(),primoGgSettimanaDaCopiare.getMonth(),primoGgSettimanaDaCopiare.getDate() + 6);
	var primoGgSettimanaDaIncollare = globals.getDateOfISOWeek(settimana,globals.getAnno());
	var ultimoGgSettimanaDaIncollare = new Date(primoGgSettimanaDaIncollare.getFullYear(),primoGgSettimanaDaIncollare.getMonth(),primoGgSettimanaDaIncollare.getDate() + 6);
	
	// confronto numero di lavoratori (da terminare)
    var arrLavDaCopiare = globals.foundsetToArray(forms['neg_prog_periodo_settimana_copertura_' + settimanaDaCopiare].foundset,'idlavoratore');
    var arrLavDaIncollare = globals.foundsetToArray(forms['neg_prog_periodo_settimana_copertura_' + settimana].foundset,'idlavoratore');
	// verifica di eventuali differenze nell'organico dovute a cessazioni/assunzioni tra le due settimane
	if(arrLavDaCopiare.length != arrLavDaIncollare.length)
	{
		globals.ma_utl_showWarningDialog('Il numero di righe tra la settimana da copiare e quella da incollare è differente. <br/>\
		                                  La programmazione settimanale non verrà copiata.','Copia/incolla programmazione settimana');
		return;
	}
			
	// segnalazione nel caso di copia/incolla da/su settimane con festività
	var arrFestivita = forms.neg_header_options.vArrGiorniFestivi;
	var bFestCopia = false;
	var bFestIncolla  = false;
	for(var f = 0; f < arrFestivita.length; f++)
	{
		if(parseInt(arrFestivita[f],10) >= parseInt(globals.dateFormat(primoGgSettimanaDaCopiare,globals.ISO_DATEFORMAT).toString(),10)
		   && parseInt(arrFestivita[f],10) <= parseInt(globals.dateFormat(ultimoGgSettimanaDaCopiare,globals.ISO_DATEFORMAT).toString(),10))
		{
			bFestCopia = true;
		    continue;
		}
	}
				   
	for(f = 0; f < arrFestivita.length; f++)
	{			
		if(parseInt(arrFestivita[f],10) >= parseInt(globals.dateFormat(primoGgSettimanaDaIncollare,globals.ISO_DATEFORMAT).toString(),10)
		   && parseInt(arrFestivita[f],10) <= parseInt(globals.dateFormat(ultimoGgSettimanaDaIncollare,globals.ISO_DATEFORMAT).toString(),10))
		{
			bFestIncolla = true;
		    continue;
		}
	}
	
	if(bFestCopia)
	{
		answer = globals.ma_utl_showYesNoQuestion('La settimana che si sta copiando contiene un giorno festivo. <br/>\
            Si desidera proseguire comunque?<br/>\
            Controllare nella settimana incollata i valori delle ore teoriche e di straordinario per il giorno corrispondente','Copia programmazione settimana');
		if(!answer)
			return;
	}
	
	if(bFestIncolla)
	{
	   answer = globals.ma_utl_showYesNoQuestion('La settimana sulla quale si sta per incollare contiene un giorno festivo. <br/>\
	                                              Per tale giorno le ore teoriche non verranno riportate ma rimarranno quelle di default.\
	                                              Si desidera proseguire comunque?<br/>\
                                                  Controllare nella settimana incollata i valori delle ore teoriche e di straordinario per il giorno corrispondente','Incolla programmazione settimana');
		if(!answer)
			return;
	}
		
	// acquisizione dei dati della settimana da copiare ed inserimento nella settimana da incollare
	/** @type {JSFoundset<db:/ma_presenze/e2giornalieraprogfasce>} */
	var fsFasceProg = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA_PROGFASCE);
		
	for (var l = 0; l < arrLavDaIncollare.length; l++) 
	{
		// blocco della copia nel caso di eventuali eventi in giornaliera di budget settimana da copiare
		var recsGiornBudgetCopia = globals.getRecsGiornaliera(arrLavDaCopiare[l],primoGgSettimanaDaCopiare,ultimoGgSettimanaDaCopiare,globals.TipoGiornaliera.BUDGET);
		if(recsGiornBudgetCopia != null)
		{
			var copiaMsg = 'Il dipendente ' + globals.getNominativo(arrLavDaCopiare[l]) + ' ha degli eventi precedentemente assegnatigli in budget. La sua situazione settimanale non può essere copiata.';
			globals.ma_utl_showWarningDialog(copiaMsg,'Copia/incolla settimana');
			continue;
		}
		// blocco della copia nel caso di eventuali eventi in giornaliera di budget settimana da incollare
		var recsGiornBudgetIncolla = globals.getRecsGiornaliera(arrLavDaIncollare[l],primoGgSettimanaDaIncollare,ultimoGgSettimanaDaIncollare,globals.TipoGiornaliera.BUDGET);
		if(recsGiornBudgetIncolla != null)
		{
			var incollaMsg = 'Il dipendente ' + globals.getNominativo(arrLavDaIncollare[l]) + ' ha degli eventi precedentemente assegnatigli in budget. La sua situazione settimanale non può essere incollata.';
			globals.ma_utl_showWarningDialog(incollaMsg,'Copia/incolla settimana');
			continue;
		}		
		
		// eliminazione di eventuali fasce programmate precedentemente inserite per i dipendenti nei giorni modificati
		if (globals.eliminaFasceProgrammate([arrLavDaIncollare[l]]
											, primoGgSettimanaDaIncollare
											, new Date(primoGgSettimanaDaIncollare.getFullYear(), primoGgSettimanaDaIncollare.getMonth(), primoGgSettimanaDaIncollare.getDate() + 6))) {
			databaseManager.startTransaction();

			for (var g = 0; g < 7; g++) 
			{				
				var recFasceCopia = scopes.giornaliera.getProgrammazioneFasceGiorno(arrLavDaCopiare[l], 
																				     new Date(primoGgSettimanaDaCopiare.getFullYear()
																		                      ,primoGgSettimanaDaCopiare.getMonth()
																		                      ,primoGgSettimanaDaCopiare.getDate() + g));
				if (recFasceCopia != null) {
					var inizioOrario = recFasceCopia.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature ? recFasceCopia.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.inizioorario : null;
					var inizioPausa = recFasceCopia.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature ? recFasceCopia.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.iniziopausa : null;
					var finePausa = recFasceCopia.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature ? recFasceCopia.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.finepausa : null;
					var fineOrario = recFasceCopia.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature ? recFasceCopia.e2giornalieraprogfasce_to_ditte_fasceorarietimbrature.fineorario : null;

					if (fsFasceProg.newRecord()) {
						// se il giorno su cui si va ad incollare è festivo, le ore teoriche sono uguali alle ore delle festività teoriche 
						// le ore programmate costituiranno straordinario
						var currGiorno = new Date(primoGgSettimanaDaIncollare.getFullYear(),primoGgSettimanaDaIncollare.getMonth(),primoGgSettimanaDaIncollare.getDate() + g);
						var totaleOre = 0;
						var isFestivo = forms.neg_header_options.vArrGiorniFestivi.indexOf(utils.dateFormat(currGiorno,globals.ISO_DATEFORMAT)) != -1; 
						if(isFestivo)
							totaleOre = globals.getOreFestivitaGoduta(utils.dateFormat(currGiorno,globals.ISO_DATEFORMAT),arrLavDaIncollare[l]) * 100;
						else
							totaleOre = recFasceCopia.e2giornalieraprogfasce_to_e2fo_fasceorarie.totaleorefascia;
						
						var recFasciaIncolla = globals.getFasciaOrariaDaTotaleOre(globals.getDitta(arrLavDaIncollare[l]),totaleOre);
						var recFasciaTimbIncolla = globals.getFasciaOrariaDittaTimbrature(globals.getDitta(arrLavDaIncollare[l])
							                                                              ,inizioOrario
																						  ,inizioPausa
																						  ,finePausa
																						  ,fineOrario);
						
						// TODO : verifica effettiva esistenza delle due fasce per la ditta del dipendente di destinazione!!!
						
						fsFasceProg.iddip = arrLavDaIncollare[l];
						fsFasceProg.giorno = new Date(primoGgSettimanaDaIncollare.getFullYear(),primoGgSettimanaDaIncollare.getMonth(),primoGgSettimanaDaIncollare.getDate() + g);
						fsFasceProg.idfasciaoraria = recFasciaIncolla.idfasciaoraria;//recFasceCopia.idfasciaoraria;
						fsFasceProg.iddittafasciaorariatimbrature = recFasciaTimbIncolla != null ? recFasciaTimbIncolla.iddittafasciaorariatimbrature : null;//recFasceCopia.iddittafasciaorariatimbrature;
						fsFasceProg.tiporiposo = recFasceCopia.tiporiposo;
												
					}
				}
			}

			if (!databaseManager.commitTransaction()) {
				var failedRecords = databaseManager.getFailedRecords();
				application.output(failedRecords);
				globals.ma_utl_showWarningDialog('Errore durante l\'inserimento della programmazione fasce per il dipendente : ' + globals.getNominativo(arrLavDaIncollare[l]),
					'Copia programmazione settimanale del negozio');
				databaseManager.rollbackTransaction();
				//			return;
			}
		} else
			globals.ma_utl_showWarningDialog('Errore durante l\'eliminazione della programmazione fasce per il dipendente : ' + globals.getNominativo(arrLavDaIncollare[l]),
				'Copia programmazione settimanale del negozio');
	}
		
	// ridisegno della situazione mensile
	var frmName = 'neg_prog_periodo_settimana_' + settimana;
	/** @type {Form<neg_prog_periodo_settimana>}*/
	var frm = forms[frmName]; 
	frm.preparaProgrammazioneSettimanaNegozio(settimana,globals.getAnno(),globals.getTipoGestoreReteImpresa());
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"B0C9226E-2309-4465-944A-F384E4D23B15"}
 */
function modificaGiorno(event)
{
	var frmName = event.getFormName();
	var elemName = event.getElementName();
	var fromCopertura = utils.stringRight(frmName,3) == 'cop' ? true : false;	
	
	var numSettimana = parseInt(utils.stringMiddle(frmName,38,frmName.length - 37),10);
	var primoGgSettimana = globals.getDateOfISOWeek(numSettimana,forms.neg_header_options.vAnno);
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
    
	if(!globals.ma_utl_hasKey(globals.Key.ADMIN_NEG)
		&& (giorno == globals.getChristmas(primoGgSettimana.getFullYear()) 
    		|| giorno == globals.getBoxingDay(primoGgSettimana.getFullYear())
			|| giorno == globals.getFirstYearDay(primoGgSettimana.getFullYear()))
			|| giorno == globals.getFirstYearDay(primoGgSettimana.getFullYear() + 1))
    {
    	globals.ma_utl_showWarningDialog('Non è possibile programmare i giorni di chiusura del punto vendita','Prepara programmazione giorno');
        return;
    }
	
	globals.refreshProgrammazioneGiornoNegozio(event,giorno,numSettimana,fromCopertura,true);
	
}

/**
 * @param {JSRecord} currRec
 * @param {Number} orarioApertura
 * @param {Number} numIntervalli
 * @param {Date} giorno
 * 
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"B3AC48C8-3E05-459B-B588-4061C6479A45"}
 */
function gestisciModificaCoperturaOrario(currRec,orarioApertura,numIntervalli,giorno)
{
	// aggiornamento fascia oraria timbrature (esiste/non esiste ancora)
	var e1 = null;
	var u1 = null;
	var pausa = false;
	var coppia = false;
	var e2 = null;
	var u2 = null;
	var currOrario 
	var currOrarioCent = scopes.giornaliera.convertiOrarioInOreCentesimi(orarioApertura);
	
	for(var i = 1; i <= numIntervalli; i++)
	{
		currOrario = scopes.giornaliera.convertiOrarioInNumero(currOrarioCent);
				
		if(currRec['intervallo_' + i] == 1)
		{	
			// se è già stato inserita una coppia di intervalli di entrata/uscita
			if(coppia)
			{
				globals.ma_utl_showErrorDialog('La programmazione deve essere al massimo di due intervalli temporali','Inserimento orario copertura punto vendita');
			    return false;
			}
			
			if(e1 == null)
			{
				e1 = currOrario;
			    u1 = currOrario;
			}
			else if(u1 == null || !pausa)
				u1 = scopes.giornaliera.convertiOrarioInNumero(currOrarioCent + 0.25);
			else if(e2 == null && pausa)
				e2 = currOrario;
			else 
				u2 = scopes.giornaliera.convertiOrarioInNumero(currOrarioCent + 0.25);
			
		}
		else
		{
			if(u1 != null && !pausa)
				pausa = true;
			else if(e1 != null && u1 != null && e2 != null && u2 != null)
				coppia = true;
		}
		
		currOrarioCent += 0.25;
		
	}
	
	var idLavoratore = currRec['idlavoratore'];
	var idDitta = globals.getDitta(idLavoratore);
	var totOre = (e2 != null) ? calcolaOreEventoSemplice(e1,u1) + calcolaOreEventoSemplice(e2,u2) : calcolaOreEventoSemplice(e1,u1);
	var recFasciaProg = getFasciaOrariaDaTotaleOre(idDitta,totOre * 100);
	if(e2 == null)
	{
		u2 = u1;
		u1 = null;
	}
			
	var recDittaFasciaTimbr = getFasciaOrariaDittaTimbrature(idDitta,e1,u1,e2,u2);
	var idFasciaProg = null;
	var idDittaFasciaProg = null;
	
	// verifica esistenza fascia oraria corrispondente all'inserimento
	if(recFasciaProg != null)
	{
	   idFasciaProg = recFasciaProg.idfasciaoraria;
	   
	   // caso fascia oraria esistente ma fascia oraria ditta con timbrature non esistente : inserisci la nuova fascia oraria timbrature avente gli orari specificati
	   if(recDittaFasciaTimbr == null)
	   {
		  idDittaFasciaProg = globals.inserisciNuovaFasciaOrariaTimbrature(idDitta,e1,u1,e2,u2);
		  
          // l'inserimento della nuova fascia oraria ditta con timbrature non è andato a buon fine
		  if(idDittaFasciaProg == -1)
		  {
			 globals.ma_utl_showErrorDialog('Errore durante la creazione della nuova fascia oraria ditta con timbrature. Riprovare.','Inserimento orario copertura punto vendita');
			 return false;
		  }
	   }
	   // caso fascia oraria e fascia ditta timbrature con gli orari indicati già esistente
	   else
	      idDittaFasciaProg = recDittaFasciaTimbr.iddittafasciaorariatimbrature; 	
	}
	else
	{
		globals.ma_utl_showErrorDialog('Nessuna fascia oraria corrispondente.','Inserimento orario copertura punto vendita');
		return false;
	}
	   
	// eliminazione di eventuali fasce programmate precedentemente inserite per il dipendente nei giorni modificati
	/** @type {JSFoundset<db:/ma_presenze/e2giornalieraprogfasce>} */
	var fsFasceProg = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA_PROGFASCE);
	
	var sqlProgfasce = "DELETE FROM E2GiornalieraProgFasce WHERE idDip = ? AND Giorno = ?";
	                   
	var success = plugins.rawSQL.executeSQL(globals.Server.MA_PRESENZE,
		                                   globals.Table.GIORNALIERA_PROGFASCE,
										   sqlProgfasce,
										   [idLavoratore,utils.dateFormat(giorno,globals.ISO_DATEFORMAT)]);
	if(!success)
	{
		globals.ma_utl_showWarningDialog('Errore durante la cancellazione delle fasce esistenti','Inserimento orario copertura punto vendita');
		application.output(plugins.rawSQL.getException().getMessage(), LOGGINGLEVEL.ERROR);
		return false;
	}
	plugins.rawSQL.flushAllClientsCache(globals.Server.MA_PRESENZE,
		                                globals.Table.GIORNALIERA_PROGFASCE);
	// inserimento della nuova fascia programmata per il dipendente
	databaseManager.startTransaction();
	
	// se è stata indicata una fascia oraria prosegui con l'inserimento altrimenti non inserire nulla in programmazione fasce
	if(fsFasceProg.newRecord())
	{
		fsFasceProg.iddip = idLavoratore;
		fsFasceProg.giorno = giorno;
		fsFasceProg.idfasciaoraria = idFasciaProg;
		fsFasceProg.iddittafasciaorariatimbrature = idDittaFasciaProg;
		fsFasceProg.tiporiposo = 0;
		
	}
			
	if(!databaseManager.commitTransaction())
	{
		globals.ma_utl_showWarningDialog('Errore durante l\'inserimento della programmazione fasce','Inserimento orario copertura punto vendita');
		databaseManager.rollbackTransaction();
		return false;
	}
//	else
//	{		
//		// TODO verificare indice per ridisegno
//		preparaProgrammazioneCoperturaGiorno(giorno,2,getTipoGestoreReteImpresa(),true);				
//	}
	
	// TODO ridisegno della programamzione della copertura
	//globals.preparaProgrammazioneCoperturaSettimana(globals.getWeekNumber(giorno),giorno.getFullYear(),globals.getTipoGestoreReteImpresa());

	return true;
}

/**
 * @AllowToRunInFind
 * 
 * Restituisce il numero di ore programmate che sono state inserite
 * per il lavoratore nel periodo richiesto
 * 
 * @param {Number} idLavoratore
 * @param {Date} dal
 * @param {Date} al
 *
 * @return {Number}
 * 
 * @properties={typeid:24,uuid:"E54DF912-6E43-4360-A7A3-AF545CF45835"}
 */
function getTotaleOreProgrammateDalAl(idLavoratore,dal,al)
{
	var totOreProgrammate = 0;
	
	/** @type {JSFoundSet<db:/ma_presenze/e2giornalieraprogfasce>}*/
	var fsPrgFasce = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA_PROGFASCE);
	if(fsPrgFasce.find())
	{
		fsPrgFasce.iddip = idLavoratore;
		fsPrgFasce.giorno = '=' + globals.dateFormat(dal,globals.ISO_DATEFORMAT) + '...' + globals.dateFormat(al,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
		var res = fsPrgFasce.search();
		if(res)
		{
			for(var r = 1; r <= res; r++)
				totOreProgrammate += fsPrgFasce.getRecord(r).e2giornalieraprogfasce_to_e2fo_fasceorarie.totaleorefascia;
		}
	}
	
	return totOreProgrammate / 100;
}

/**
 * Inizializza nella tabella e2giornalieraprogfasce i giorni di festività goduta della settimana
 * per i dipendenti interessati 
 * 
 * @param {Array<Number>} arrLav
 * @param {Date} primoGGSettimana
 * @param {Date} ultimoGGSettimana
 * @param {Number} tipoReteImpresa
 *
 * @properties={typeid:24,uuid:"6267789A-CF02-4836-A59B-2C70581DBDDD"}
 */
function inizializzaGiornProgFasceFestivita(arrLav,primoGGSettimana,ultimoGGSettimana,tipoReteImpresa)
{
	// controllo eventuali giornate non compilate : se non sono riposi le pre-impostiamo a zero ore
	for(var l = 0; l < arrLav.length; l++)
	{
		/** @type {Date} */
		var g;
		for(g = primoGGSettimana; g <= ultimoGGSettimana; g = new Date(g.getFullYear(),g.getMonth(),g.getDate() + 1))
		{
		    if(scopes.giornaliera.getProgrammazioneFasceGiorno(arrLav[l],g) != null)
				continue;
			else
			{
				var assunzione = globals.getDataAssunzione(arrLav[l]);
				var cessazione = globals.getDataCessazione(arrLav[l]);
				if(g < assunzione || cessazione != null && g > cessazione)
			    	continue;
				
				// TODO una volta a posto la funzione per determinare le ore teoriche di festività goduta, toglierla
				if(tipoReteImpresa == 2)
					continue;
				
				/** @type {JSFoundset<db:/ma_presenze/e2giornalieraprogfasce>} */
				var fsFasceProg = databaseManager.getFoundSet(globals.Server.MA_PRESENZE,globals.Table.GIORNALIERA_PROGFASCE);
				databaseManager.startTransaction();
				
                var oreFestGod = globals.getOreFestivitaGoduta(globals.dateFormat(g,globals.ISO_DATEFORMAT).toString(),arrLav[l]);
				
				if(oreFestGod > 0)
				{
					fsFasceProg.newRecord();
					fsFasceProg.giorno = g;
					fsFasceProg.iddip = arrLav[l];
					fsFasceProg.idfasciaorariafittizia = null;
					fsFasceProg.iddittafasciaorariatimbrature = null;
					fsFasceProg.idfasciaoraria = globals.getFasciaOrariaDaTotaleOre(globals.getDitta(arrLav[l]),oreFestGod * 100).idfasciaoraria;
					fsFasceProg.tiporiposo = 0;
				}
				if(!databaseManager.commitTransaction())
				{
					globals.ma_utl_showErrorDialog('Errore durante l\'inserimento automatico delle fasce a zero ore \
					                                per il dipendente ' + globals.getNominativo(arrLav[l]) + ' nel giorno \
					                                ' + globals.dateFormat(g,globals.EU_DATEFORMAT),'Programmazione negozio');
				    databaseManager.rollbackTransaction();
				}
				
			}
		}
	}
}

/**
 * Elimina la programmazione per il giorno per i dipendenti selezionati
 * 
 * @param _itemInd
 * @param _parItem
 * @param _isSel
 * @param _parMenTxt
 * @param _menuTxt
 * @param _event
 * @param {Array<Number>} arrLav
 * @param {Date} giorno
 * @param {Boolean} fromCopertura
 * 
 * 
 * @properties={typeid:24,uuid:"501BCBDD-37A8-40B2-A3A1-AC8E007E04D1"}
 */
function eliminaProgrammazioneGiornoNegozio(_itemInd,_parItem,_isSel,_parMenTxt,_menuTxt,_event,arrLav,giorno,fromCopertura)
{
	// controllo festività
	for(var l = 0; l < arrLav.length; l++)
	{
		if(globals.getOreFestivitaGoduta(globals.dateFormat(giorno,globals.ISO_DATEFORMAT).toString(),arrLav[l]))
		{
			globals.ma_utl_showWarningDialog('Non è possibile eliminare la programmazione per un giorno festivo','Programmazione giorno negozio');
		    return;
		}
	}
	// controllo presenza di eventi in budget relativi a richieste ferie /permessi
    for(l = 0; l < arrLav.length; l++)
    {
		var recGiornBudget = globals.getRecGiornaliera(arrLav[l],giorno,globals.TipoGiornaliera.BUDGET);
		if(recGiornBudget 
		   && recGiornBudget.e2giornaliera_to_e2giornalieraeventi
		   && recGiornBudget.e2giornaliera_to_e2giornalieraeventi.idevento)
		{
			globals.ma_utl_showWarningDialog('Non è possibile eliminare la programmazione per un giorno con una richiesta di ferie/permessi associata','Programmazione giorno negozio');
		    return;
		}
    }
    
	var msg =  'Proseguire con l\'eliminazione della programmazione del giorno' + globals.dateFormat(giorno,globals.EU_DATEFORMAT);
	if(arrLav.length == 1)
	   msg += ' per il/la dipendente ' + globals.getNominativo(arrLav[0]);
	msg += ' ?';
	var answer = globals.ma_utl_showYesNoQuestion(msg ,'Eliminazione fasce programmate');
	if(!answer)
		return;
	
	globals.eliminaFasceProgrammate(arrLav,giorno,giorno);
	
    var settimana = globals.getWeekNumber(giorno);
	
	if(fromCopertura)
	{
		var gg = globals.getDateOfISOWeek(settimana,giorno.getFullYear());
		var index = globals.dateDiff(gg,giorno,1000 * 60 * 60 * 24);		
		globals.preparaProgrammazioneCoperturaGiorno(giorno,index,globals.getTipoGestoreReteImpresa(),true);
	}
	else
	{ 		
		// prepara programmazione settimanale
		var frmSettName = 'neg_prog_periodo_settimana_' + settimana;
		/** @type {Form<neg_prog_periodo_settimana>}*/
		var frmSett = forms[frmSettName];
		frmSett.preparaProgrammazioneSettimanaNegozio(settimana,giorno.getFullYear(),globals.getTipoGestoreReteImpresa(),fromCopertura);
	}
}
