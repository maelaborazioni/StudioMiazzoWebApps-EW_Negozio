/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"52033712-B557-4B3E-9A03-5E3797E59639",variableType:4}
 */
var vChkProgrammato = 1;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"78D8CF18-E357-4EF7-B732-AACE73B6952C",variableType:4}
 */
var vChkTeorico = 0;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"34322110-C75E-4005-A72A-D72111A19EB8",variableType:4}
 */
var vChkOrdinario = 0;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"A1ECD982-1D91-462E-BA72-9F4C68BE3B39",variableType:4}
 */
var vChkFestivo = 1;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"5E1F1849-B228-4CB0-8C6E-E4832B91DF10",variableType:4}
 */
var vChkAssenza = 1;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"798101CF-F7D6-4DFB-B39D-45176361E6C0",variableType:4}
 */
var vChkStraordinario = 1;

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
 * @properties={typeid:24,uuid:"EE8A6B58-B7C9-4CA7-A34A-14A7DA402D21"}
 */
function onDataChangeProgrammato(oldValue, newValue, event)
{
	return true
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
 * @properties={typeid:24,uuid:"1F89AC6E-D503-4E1A-9F0C-D017D703BFE9"}
 */
function onDataChangeTeorico(oldValue, newValue, event) {
	// TODO Auto-generated method stub
	return true
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
 * @properties={typeid:24,uuid:"A9D1812B-B06D-4C22-B01F-3CE999EEA634"}
 */
function onDataChangeOrdinario(oldValue, newValue, event) {
	// TODO Auto-generated method stub
	return true
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
 * @properties={typeid:24,uuid:"F80721FA-EFA3-4F8B-84B0-60A2B7B55CFD"}
 */
function onDataChangeFestivo(oldValue, newValue, event) {
	// TODO Auto-generated method stub
	return true
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
 * @properties={typeid:24,uuid:"F32B5273-3AD3-4350-8F29-7494305A5A33"}
 */
function onDataChangeAssenza(oldValue, newValue, event) {
	// TODO Auto-generated method stub
	return true
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
 * @properties={typeid:24,uuid:"A4C4DFA7-EC02-49C2-A78D-829007F29071"}
 */
function onDataChangeStraordinario(oldValue, newValue, event) {
	// TODO Auto-generated method stub
	return true
}
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"89FD3051-3E9B-4A12-A15C-B3141BAE3570"}
 */
function confermaOpzioniVisualizzazione(event) 
{
	// ridisegna la programmazione mensile per settimana con le colonne da visualizzare aggiornate
    globals.preparaProgrammazioneSettimanalePeriodoNegozio(forms.neg_header_options.vVisualizzazioneSettPrec);
	globals.svy_mod_closeForm(event);
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"371B779D-4F0B-468B-B033-A349F88BF072"}
 */
function annullaOpzioniVisualizzazione(event) {
	
	globals.svy_mod_closeForm(event);
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"7A082D54-9272-4A54-9876-A73EA0EB80A5"}
 */
function onShow(firstShow, event) {
	
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
}
