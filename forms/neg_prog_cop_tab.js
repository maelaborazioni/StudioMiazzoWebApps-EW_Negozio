/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"00A111A3-8113-44DB-A1CA-B8FCBEE7123D",variableType:93}
 */
var vGiorno = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"60B3E0BF-B5C5-4387-A885-727C097B175A",variableType:8}
 */
var vSettimana = null;

/**
 * @type {Number}
 *  
 * @properties={typeid:35,uuid:"635568FB-D0D6-4BDB-8216-37E5AEB65386",variableType:8}
 */
var vSettimana_1 = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"E31E81BF-F339-409A-9FC3-EE31517185A2",variableType:8}
 */
var vSettimana_2 = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"C7595378-CD07-4EEA-B28F-7F07FF9328B3",variableType:8}
 */
var vSettimana_3 = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"E49A09E3-AD3A-41A7-97E5-FB73564CF55F",variableType:8}
 */
var vSettimana_4 = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"7F0FCA3D-9AC2-47FA-A55B-BE07634D6D72",variableType:8}
 */
var vSettimana_5 = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"A9310FE5-8BEB-49CD-A699-CA54663BF74B",variableType:8}
 */
var vSettimana_6 = null;

/**
 * @type {Boolean}
 * 
 * @properties={typeid:35,uuid:"654C84DD-5014-4C2B-92DD-547EC666A378",variableType:-4}
 */
var fromSelezione = false;

/**
 *
 * @param {Boolean} firstShow
 * @param {JSEvent} event
 * @param {Boolean} svyNavBaseOnShow
 *
 * @properties={typeid:24,uuid:"7386D152-747B-4A5D-9E9B-58DA8FEB357F"}
 */
function onShowForm(firstShow, event, svyNavBaseOnShow) 
{
	_super.onShowForm(firstShow, event, svyNavBaseOnShow);
	elements.cmb_settimana.readOnly = false;
	
	// preparazione legenda
	if(firstShow)
	{
		elements.lbl_color_nessuna.bgcolor = 'white';
		elements.lbl_color_presente.bgcolor = globals.Colors.ATTENDANT.background;
		elements.lbl_color_riposo.bgcolor = globals.Colors.REST.background;
		elements.lbl_color_assenza.bgcolor = globals.Colors.ON_HOLIDAYS.background;
	}
	
	plugins.busy.prepare();
	
	var params = {
        message: '', 
        opacity: 0.2,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : '',
        fontType: 'Arial,4,25',
        processArgs: [fromSelezione]
    };
	
	if(fromSelezione || firstShow)
		params.processFunction = process_prepara_copertura;	
	else
		params.processFunction = process_prepara_copertura_settimana;
		
	plugins.busy.block(params);
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
 * @properties={typeid:24,uuid:"67CECF96-FCD9-48ED-A25C-B15A9D1AC609"}
 */
function onDataChangeSettimanaCop(oldValue, newValue, event) 
{
	vGiorno = globals.getDateOfISOWeek(newValue,vGiorno.getFullYear());
    var params = {
        processFunction: process_datachange_sett,
        message: '', 
        opacity: 0.2,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : '',
        fontType: 'Arial,4,25',
        processArgs: [event,vSettimana,vGiorno,oldValue != newValue]
    };
	plugins.busy.block(params);
		
	return true;
}

/**
 * @param bool
 *
 * @properties={typeid:24,uuid:"1C57F38A-7B9E-4499-A4DF-71C43216ABB3"}
 */
function process_prepara_copertura(bool)
{
	try
	{
		var _anno = globals.getAnno();
		var _mese = globals.getMese();
		var _settimana = globals.getSettimana();
		
		var vlsDisplayValues = [];
		var vlsRealValues = [];
		
		// determina la prima settimana per il periodo scelto (serve per compilare la valuelist delle settimane selezionabili)
		var primoGiornoPeriodo = new Date(_anno, _mese - 1,1);
		var primaSettimana = globals.getWeekNumber(primoGiornoPeriodo)['week'];
		var primaSettimanaCalc = primaSettimana;
		if(primaSettimana == 53 || primaSettimana == 52)
			primaSettimanaCalc = 0;
			
		var primoGiornoSettimana = null;
		var ultimoGiornoSettimana = null;
			
		// la settimana corrente è quella impostata, altrimenti è la prima del periodo
		vSettimana = _settimana != null ? _settimana : primaSettimanaCalc;
		vGiorno = primoGiornoPeriodo;
			
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
			var displayTxt = 'Settimana ' + (primaSettimanaCalc + sett == 0 ? primaSettimana : numSetRiferimento) 
							  + ' - [' + 
							globals.getNumGiorno(primoGiornoSettimana) + '/' +
							globals.getNumMese(primoGiornoSettimana.getMonth() + 1) +
							' - ' + 
							globals.getNumGiorno(ultimoGiornoSettimana) + '/' +
							globals.getNumMese(ultimoGiornoSettimana.getMonth() + 1) +']'
			vlsDisplayValues.push(displayTxt);
					    
		}
		
		application.setValueListItems('vls_settimana',vlsDisplayValues,vlsRealValues);
		
		globals.preparaProgrammazioneCopertura(vSettimana,vGiorno.getFullYear(),true);
	    fromSelezione = false;
	
	}
	catch(ex)
	{
		var msg = 'Metodo process_prepara_copertura : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg);
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * @properties={typeid:24,uuid:"7A009225-1E6F-45C3-A217-3DEF6D3A1574"}
 */
function process_prepara_copertura_settimana()
{
	try
	{
		var _anno = globals.getAnno();
		
		vGiorno = globals.getDateOfISOWeek(vSettimana,_anno);
				
		globals.preparaProgrammazioneCopertura(vSettimana,vGiorno.getFullYear(),true);
	    fromSelezione = false;
	}
	catch(ex)
	{
		var msg = 'Metodo process_prepara_copertura_settimana : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * @param {JSEvent} event
 * @param {Number} settimana
 * @param {Date} giorno
 * @param {Boolean} isChanged
 *
 * @properties={typeid:24,uuid:"1224D26D-6D90-4A91-A815-9B08A9EF525B"}
 */
function process_datachange_sett(event,settimana,giorno,isChanged)
{
	try
	{
		globals.preparaProgrammazioneCopertura(settimana,giorno.getFullYear(),isChanged);
	}
	catch(ex)
	{
		var msg = 'Metodo process_datachange_sett : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * Handle changed data.
 *
 * @param {Date} oldValue old value
 * @param {Date} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"870CF18B-DF83-49ED-B3C7-787735013A37"}
 */
function onDataChangeGiornoCop(oldValue, newValue, event) 
{
	if(globals.getWeekNumber(oldValue)['week'] != globals.getWeekNumber(newValue)['week'])
	{
		switch(globals.getWeekNumber(vGiorno))
		{
			case vSettimana_1:
				onActionSettimana_A(event);
				break;
			case vSettimana_2:
			    onActionSettimana_B(event);
			    break;
			case vSettimana_3:
			    onActionSettimana_C(event);
				break;
			case vSettimana_4:
		 	    onActionSettimana_D(event);
				break;
			case vSettimana_5:
			    onActionSettimana_E(event);
				break;
			case vSettimana_6:
			    onActionSettimana_F(event);
				break;
			default:
				break;
		}
		
		globals.preparaProgrammazioneCopertura(vSettimana,vGiorno.getFullYear());
	}
	else
		globals.preparaProgrammazioneCoperturaGiorno(vGiorno,foundset.getSelectedIndex(),globals.getTipoGestoreReteImpresa());
	
	return true;
}


/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"60C26FFA-6E17-4A32-BC11-7655CC85D547"}
 */
function onActionNextDay(event) 
{
	var vGiornoOld = new Date(vGiorno);
	vGiorno = new Date(vGiorno.getFullYear(),vGiorno.getMonth(),vGiorno.getDate() + 1);
	onDataChangeGiornoCop(vGiornoOld,vGiorno,event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D6D7EE69-7E0F-42B7-B8D9-59C04AEBF00E"}
 */
function onActionPrevDay(event) 
{
	var vGiornoOld = new Date(vGiorno);
	vGiorno = new Date(vGiorno.getFullYear(),vGiorno.getMonth(),vGiorno.getDate() - 1);
	onDataChangeGiornoCop(vGiornoOld,vGiorno,event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F9DF9C34-68C3-4BE7-A86D-5FB7059B0D5D"}
 */
function onActionSettimana_A(event) 
{
	var vSettimanaOld = vSettimana;
	vSettimana = vSettimana_1;
	
	// Set background
	elements.btn_settimana_b.bgcolor =
	elements.btn_settimana_c.bgcolor =
	elements.btn_settimana_d.bgcolor =
	elements.btn_settimana_e.bgcolor =
	elements.btn_settimana_f.bgcolor =
		globals.Colors.DISABLED.background;
	elements.btn_settimana_a.bgcolor = globals.Colors.ACTIVE.background;
	
	// Set foreground
	elements.btn_settimana_b.fgcolor =
	elements.btn_settimana_c.fgcolor =
	elements.btn_settimana_d.fgcolor =
	elements.btn_settimana_e.fgcolor =
	elements.btn_settimana_f.fgcolor =
		globals.Colors.DISABLED.foreground;
	elements.btn_settimana_a.fgcolor = globals.Colors.ACTIVE.foreground;
	
	onDataChangeSettimanaCop(vSettimanaOld,vSettimana,event);	
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"21A2E2CB-8D8B-467E-B5E3-0B54BDE7F9FB"}
 */
function onActionSettimana_B(event) 
{
	var vSettimanaOld = vSettimana;
	vSettimana = vSettimana_2;
	
	// Set background
	elements.btn_settimana_a.bgcolor =
	elements.btn_settimana_c.bgcolor =
	elements.btn_settimana_d.bgcolor =
	elements.btn_settimana_e.bgcolor =
	elements.btn_settimana_f.bgcolor =
		globals.Colors.DISABLED.background;
	elements.btn_settimana_b.bgcolor = globals.Colors.ACTIVE.background;
	
	// Set foreground
	elements.btn_settimana_a.fgcolor =
	elements.btn_settimana_c.fgcolor =
	elements.btn_settimana_d.fgcolor =
	elements.btn_settimana_e.fgcolor =
	elements.btn_settimana_f.fgcolor =
	    globals.Colors.DISABLED.foreground;
	elements.btn_settimana_b.fgcolor = globals.Colors.ACTIVE.foreground;
	
	onDataChangeSettimanaCop(vSettimanaOld,vSettimana,event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"2F038116-5324-4A7D-8614-E3224E07079C"}
 */
function onActionSettimana_C(event) 
{
	var vSettimanaOld = vSettimana;
	vSettimana = vSettimana_3;
	
	// Set background
	elements.btn_settimana_a.bgcolor =
	elements.btn_settimana_b.bgcolor =
	elements.btn_settimana_d.bgcolor =
	elements.btn_settimana_e.bgcolor =
	elements.btn_settimana_f.bgcolor =	
		globals.Colors.DISABLED.background;
	elements.btn_settimana_c.bgcolor = globals.Colors.ACTIVE.background;
	
	// Set foreground
	elements.btn_settimana_a.fgcolor =
	elements.btn_settimana_b.fgcolor =
	elements.btn_settimana_d.fgcolor =
	elements.btn_settimana_e.fgcolor =
	elements.btn_settimana_f.fgcolor =	
	    globals.Colors.DISABLED.foreground;
	elements.btn_settimana_c.fgcolor = globals.Colors.ACTIVE.foreground;
	
	onDataChangeSettimanaCop(vSettimanaOld,vSettimana,event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"022559ED-D7E0-4EF8-8D74-ABBB9E81AA35"}
 */
function onActionSettimana_D(event) 
{
	var vSettimanaOld = vSettimana;
	vSettimana = vSettimana_4;
	
	// Set background
	elements.btn_settimana_a.bgcolor =
	elements.btn_settimana_b.bgcolor =
	elements.btn_settimana_c.bgcolor =
	elements.btn_settimana_e.bgcolor =
	elements.btn_settimana_f.bgcolor =	
		globals.Colors.DISABLED.background;
	elements.btn_settimana_d.bgcolor = globals.Colors.ACTIVE.background;
	
	// Set foreground
	elements.btn_settimana_a.fgcolor =
	elements.btn_settimana_b.fgcolor =
	elements.btn_settimana_c.fgcolor =
	elements.btn_settimana_e.fgcolor =
	elements.btn_settimana_f.fgcolor =
	    globals.Colors.DISABLED.foreground;
	elements.btn_settimana_d.fgcolor = globals.Colors.ACTIVE.foreground;

	onDataChangeSettimanaCop(vSettimanaOld,vSettimana,event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"9F278929-0E18-493E-A44C-3AE9350152B0"}
 */
function onActionSettimana_E(event) 
{
	var vSettimanaOld = vSettimana;
	vSettimana = vSettimana_5;
	
	// Set background
	elements.btn_settimana_a.bgcolor =
	elements.btn_settimana_b.bgcolor =
	elements.btn_settimana_c.bgcolor =
	elements.btn_settimana_d.bgcolor =
	elements.btn_settimana_f.bgcolor =
		globals.Colors.DISABLED.background;
	elements.btn_settimana_e.bgcolor = globals.Colors.ACTIVE.background;
	
	// Set foreground
	elements.btn_settimana_a.fgcolor =
	elements.btn_settimana_b.fgcolor =
	elements.btn_settimana_c.fgcolor =
	elements.btn_settimana_d.fgcolor =
	elements.btn_settimana_f.fgcolor =
	    globals.Colors.DISABLED.foreground;
	elements.btn_settimana_e.fgcolor = globals.Colors.ACTIVE.foreground;
	
	onDataChangeSettimanaCop(vSettimanaOld,vSettimana,event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"0C17D671-FEBC-4F90-9C50-B93607BAEAA4"}
 */
function onActionSettimana_F(event) 
{
	var vSettimanaOld = vSettimana;
	vSettimana = vSettimana_6;
	
	// Set background
	elements.btn_settimana_a.bgcolor =
	elements.btn_settimana_b.bgcolor =
	elements.btn_settimana_c.bgcolor =
	elements.btn_settimana_d.bgcolor =
	elements.btn_settimana_e.bgcolor =
		globals.Colors.DISABLED.background;
	elements.btn_settimana_f.bgcolor = globals.Colors.ACTIVE.background;
	
	// Set foreground
	elements.btn_settimana_a.fgcolor =
	elements.btn_settimana_b.fgcolor =
	elements.btn_settimana_c.fgcolor =
	elements.btn_settimana_d.fgcolor =
	elements.btn_settimana_e.fgcolor =
	    globals.Colors.DISABLED.foreground;
	elements.btn_settimana_f.fgcolor = globals.Colors.ACTIVE.foreground;
	
	onDataChangeSettimanaCop(vSettimanaOld,vSettimana,event);
}
