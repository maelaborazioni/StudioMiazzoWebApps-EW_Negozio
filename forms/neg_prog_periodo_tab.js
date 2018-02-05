/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"5508F014-A50F-414A-984F-F815DF70B802"}
 */
var vPeriodoStr = '';

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"6AAD6304-9B76-4C1F-A05A-F007BF18FC9D",variableType:8}
 */
var vSettimanaDaCopiare = null;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"EADAA6C8-189F-46A6-8501-C63920BED127",variableType:8}
 */
var vDipendenteDaCopiare = null;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"901A5979-1F67-4831-ABC5-63B44AFB1C2C",variableType:8}
 */
var vSettimanaDipendenteDaCopiare = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"ADB9A33B-DD2D-4A5E-AEA8-AE1E24876F3B",variableType:8}
 */
var _numSett = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"A9D30F5E-FDBB-4A14-B5FF-E6AF52379806",variableType:8}
 */
var _primaSettimanaCalc = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"5FFFCA87-D90D-46F2-807F-613E89F919C5",variableType:8}
 */
var _tipoGestoreReteImpresa = null;

/**
 * @type {Boolean}
 * 
 * @properties={typeid:35,uuid:"8015EFAC-3F5C-49E9-910E-6B58CD046797",variableType:-4}
 */
var fromSelezione = false;

/**
 * @param {Boolean} firstShow
 * @param {JSEvent} event
 * @param {Boolean} svyNavBaseOnShow
 *
 * @properties={typeid:24,uuid:"32B1734A-B9A7-4067-A334-72D5AD60B0DA"}
 */
function onShowForm(firstShow, event, svyNavBaseOnShow) 
{
	_super.onShowForm(firstShow, event, svyNavBaseOnShow);
	
	var _idditta = globals.getDittaTab();
	var _mese = globals.getMese();
	var _anno = globals.getAnno();
	var _programName = forms.svy_nav_fr_openTabs.vOpenTabs[forms.svy_nav_fr_openTabs.vSelectedTab];
	vPeriodoStr = 'Periodo : ' + globals.getNomeMese(_mese) + ' ' + _anno;
	
	if(!fromSelezione)
	{
		plugins.busy.prepare();
		
		var params = {
	        processFunction: process_prepara_programmazione_periodo,
	        message: '', 
	        opacity: 0.2,
	        paneColor: '#434343',
	        textColor: '#EC1C24',
	        showCancelButton: false,
	        cancelButtonText: '',
	        dialogName : '',
	        fontType: 'Arial,4,25',
	        processArgs: [fromSelezione,_idditta,_anno,_mese,_programName]
	    };
		
		plugins.busy.block(params);
	}
	else
		process_prepara_programmazione_periodo(!fromSelezione,_idditta,_anno,_mese,_programName);
	   
}

/**
 * @param bool
 * @param _idditta
 * @param _anno
 * @param _mese
 * @param _programName
 * 
 * @properties={typeid:24,uuid:"351625A0-E10C-4C96-9711-EC9EE0B6A5BD"}
 */
function process_prepara_programmazione_periodo(bool,_idditta,_anno,_mese,_programName)
{
	try
	{
		// caricamento objParams corretto
		globals.preparaParametriProgrammazioneNegozio(_idditta,_anno,_mese,_programName);
		globals.preparaProgrammazioneSettimanalePeriodoNegozio(forms.neg_header_options.vVisualizzazioneSettPrec);
	    fromSelezione = false;
	}
	catch(ex)
	{
		var msg = 'Metodo process_prepara_programmazione_periodo : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		if(!bool)
		   plugins.busy.unblock();
	}
}

