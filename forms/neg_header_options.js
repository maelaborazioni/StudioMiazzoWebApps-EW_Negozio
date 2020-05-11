/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"D19D9BC8-77B5-43E3-9AE6-E889EC77D9FE",variableType:4}
 */
var vMese = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"AB87419A-3FEB-4D0D-ACC4-84A056462EAC",variableType:4}
 */
var vAnno = null;

/** 
 * @type {Array<String>}
 * 
 * @properties={typeid:35,uuid:"AA005EFF-D6D1-4131-9D24-A96480160D0E",variableType:-4}
 */
var vArrGiorniFestivi = [];

/**
 * @type {Boolean}
 * 
 * @properties={typeid:35,uuid:"742CE28F-3D44-4EFE-856D-893DA1D0F539",variableType:-4}
 */
var vIsGestoreRete = false;

/**
 * @type {Array<Array>}
 * 
 * @properties={typeid:35,uuid:"1D8A8F35-1390-4F05-AF22-10E5F75A4209",variableType:-4}
 */
var vArrRiepilogoFestivita = [];

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"7B37F012-2392-47D1-81E2-50E41DD4C9AE",variableType:4}
 */
var vVisualizzazione = 1;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"18F92832-06E3-41B4-9581-5E350EF0B311",variableType:-4}
 */
var vVisualizzazioneSettPrec = false;
/**
 * Handle changed data.
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D244BDFD-3413-455F-A572-281B1BDB509C"}
 */
function onDataChangeVisualizzazione(oldValue, newValue, event) 
{
	switch(newValue)
	{
		case 1:
			globals.refreshProgrammazioneNegozio(event)
			break;
		case 2:
			globals.refreshProgrammazioneNegozioAccordion(event);
			break;
		default:
			break;
	}
	return true;
}
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1D68AC2B-056B-4D94-B448-60DCD89E7B55"}
 */
function apriPopupOpzioniNegozio(event)
{
	var source = event.getSource();
	var popUpMenu = plugins.window.createPopupMenu();
	
	var optColumns = popUpMenu.addMenuItem('Vai alla selezione delle colonne visualizzabili',visualizzaOpzioniColonne);
	    optColumns.methodArguments = [event];
	
	popUpMenu.addSeparator();
	
	var optPrevWeeks = popUpMenu.addMenuItem('Visualizza le due settimane del mese precedente',visualizzaSettPrec);
	    optPrevWeeks.methodArguments = [event,true];
	    optPrevWeeks.enabled = vVisualizzazioneSettPrec ? false : true;
	var optRemPrevWeeks = popUpMenu.addMenuItem('Visualizza solo il mese corrente',visualizzaSettPrec);
	    optRemPrevWeeks.methodArguments = [event,false];	
	    optRemPrevWeeks.enabled = vVisualizzazioneSettPrec ? true : false;
	if(source != null)
		   popUpMenu.show(source);	    
}

/**
 * Passa alla visualizzazione per settimane della programmazione negozio
 * 
 * @param event
 *
 * @properties={typeid:24,uuid:"2BF4C2BB-C8E7-4E2A-BDE9-F79700F0D798"}
 */
function vaiAllaVisualizzazioneSettimanale(event)
{
	vVisualizzazione = 2;
	globals.refreshProgrammazioneNegozioAccordion(event);
}

/**
 * Passa alla visualizzazione del mese completoo della programmazione negozio
 * 
 * @param {JSEvent} event
 * 
 * @properties={typeid:24,uuid:"DEB1175A-540B-45F2-BAFA-538D12247417"}
 */
function vaiAllaVisualizzazioneMensile(event)
{
	vVisualizzazione = 1;
	globals.refreshProgrammazioneNegozio(event);
}

/**
 * Aggiorna il valore delle ore di festività goduta, relativamente alla data indicata,
 * nella struttura di riepilogo (quando avviene ad esempio una modifica nell'orario teorico di
 * una giornata festiva)
 * 
 * @param {String} dataFesta
 * @param {Number} idLavoratore
 * @param {Number} ore
 *
 * @properties={typeid:24,uuid:"6E987617-CA82-497B-AC83-B50C0DA414D6"}
 * @SuppressWarnings(wrongparameters)
 */
function setOreFestivitaGodutaGiorno(dataFesta,idLavoratore,ore)
{
	for(var i = 0; i < vArrRiepilogoFestivita.length; i++)
	{
		if(vArrRiepilogoFestivita[i][0] == dataFesta)
		{
			/** @type {Array} */
			var vArrFesta = vArrRiepilogoFestivita[i][2];
			for(var j = 0; j < vArrFesta.length; j++)
			{
				if(vArrFesta[j][0] == idLavoratore && utils.stringLeft(vArrFesta[j][2],2) == "FG")
				{
					vArrFesta[j][1] = ore;
				    break;
				}
			}
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
 * @properties={typeid:24,uuid:"1B4FCA93-3491-4D7C-B49F-9F8B223BB7A7"}
 */
function onActionCambiaVisualizzazione(event)
{
	if(vVisualizzazione == 1)
		vaiAllaVisualizzazioneSettimanale(event);
	else
		vaiAllaVisualizzazioneMensile(event);
}


/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 * 
 * @properties={typeid:24,uuid:"B84E91A0-FAB4-4A04-99D0-47228692CB4D"}
 */
function visualizzaOpzioniColonne(_itemInd,_parItem,_isSel,_parMenTxt,_menuTxt,_event)
{
	var frmOpt = forms.neg_header_options_cols; 
	globals.ma_utl_showFormInDialog(frmOpt.controller.getName(),'Opzioni di visualizzazione');
}

/**
 * @param {Number} _itemInd
 * @param {Number} _parItem
 * @param {Boolean} _isSel
 * @param {String} _parMenTxt
 * @param {String} _menuTxt
 * @param {JSEvent} _event
 * @param {Boolean} _settPrec
 * 
 * @properties={typeid:24,uuid:"B3AD4AEF-D9AA-407B-ABC6-F091CDEFF723"}
 */
function visualizzaSettPrec(_itemInd,_parItem,_isSel,_parMenTxt,_menuTxt,_event,_settPrec)
{
	vVisualizzazioneSettPrec = _settPrec;
	globals.preparaProgrammazioneSettimanalePeriodoNegozio(_settPrec);
}
