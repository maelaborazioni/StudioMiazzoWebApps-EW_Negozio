/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"EBEE296D-09B2-41D4-8F30-7537B4CEF411",variableType:93}
 */
var vData = new Date();

/**
 * @type {Continuation}
 * 
 * @properties={typeid:35,uuid:"DD94D417-1DE0-4DE4-AE7C-5472F8B69602",variableType:-4}
 */
var vDialogContinuation = null;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"6FA1C786-BE41-49B4-8F72-B63E4D0074E4"}
 */
function okAndClose(event) 
{
	if(vData)
	{
		globals.svy_mod_closeForm(event);
		dialogContinuation(vData);
	}
}

/** *
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"25ECD969-D072-4810-8932-13506A1F1334"}
 */
function onShowForm(_firstShow, _event) {
	
	_super.onShowForm(_firstShow, _event);
	vData = null;
	elements.btn_data.enabled = true;
	elements.fld_data.enabled = true;
	
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D3602702-A2CA-4B98-B10B-A9C75D958623"}
 */
function onActionData(event) 
{
	okAndClose(event);
}
