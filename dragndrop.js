/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"C649925D-B68B-413C-B88C-9D1E604EA4B8",variableType:8}
 */
var currRow = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"CB014EC3-2682-4133-A25A-D26AE7C39A5B"}
 */
var currFormName = null; 

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"B60A08AC-32C9-4D27-B135-6DA24F01F5F0",variableType:8}
 */
var firstIndex = null;

/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"36F84BC3-B659-41D3-8416-92B94EED5835",variableType:8}
 */
var lastIndex = null;

/**
 * @param {JSDNDEvent} event
 *
 * @properties={typeid:24,uuid:"A8A536D6-D187-4C31-84BC-9BF6C073B759"}
 */
function onDrag(event)
{
	var formName = event.getFormName(); //neg_prog_cop_giorno_ddMMyyyy_dtl
	var elemName = event.getElementName(); //lbl_intervallo_row_col
	
	if(utils.stringLeft(elemName,14) == 'lbl_intervallo')
	{
		var pos_1 = utils.stringPosition(elemName,'_',0,2);
		var pos_2 = utils.stringPosition(elemName,'_',0,3);
		var rIndex = parseInt(utils.stringMiddle(elemName,pos_1 + 1,pos_2 - 1));
		var gIndex = parseInt(utils.stringMiddle(elemName,pos_2 + 1,elemName.length));
				
		currRow = rIndex;
		firstIndex = gIndex;
		currFormName = formName;
		
		forms[formName].elements[elemName].bgcolor = '#44cc44';
		return DRAGNDROP.MOVE|DRAGNDROP.COPY;
	}
	
	return DRAGNDROP.NONE;
}

/**
 * @param {JSDNDEvent} event
 *
 * @properties={typeid:24,uuid:"8D705E70-B854-4724-9B7C-50C5E745D077"}
 */
function onDragEnd(event)
{
	var formName = event.getFormName(); //neg_prog_cop_giorno_ddMMyyyy_dtl
    var elemName = event.getElementName(); //lbl_intervallo_row_col
	
	var pos_1 = utils.stringPosition(elemName,'_',0,2);
	var pos_2 = utils.stringPosition(elemName,'_',0,3);
	var rIndex = parseInt(utils.stringMiddle(elemName,pos_1 + 1,pos_2 - 1));
//	var gIndex = parseInt(utils.stringMiddle(elemName,pos_2 + 1,elemName.length));

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
	
	var oldArray = [];
	for(var i = 1; i <= numIntervalli; i++)
		oldArray.push(currRec['intervallo_' + i]);
	
	var result = event.getDragResult();
//	var resMsg;
//	switch(result)
//	{
//		case DRAGNDROP.COPY:
//		resMsg = 'COPY';
//		break;
//		case DRAGNDROP.MOVE:
//		resMsg = 'MOVE';
//		break;
//		case DRAGNDROP.NONE:
//		resMsg = 'NONE';
//		break;
//		default:
//		resMsg = 'DEFAULT';
//		break;
//	}
	
	if(currFormName == formName && rIndex == currRow)
	{
	   // se la selezione è iniziata da dx verso sx invertiamo gli indici
	   if(firstIndex > lastIndex)	
	   {	
		   var currFirst = firstIndex;
		   firstIndex = lastIndex;
		   lastIndex = currFirst;
	   }
		   
	   for(var g = 1; g <= numIntervalli; g++)
	      if(firstIndex <= g && g <= lastIndex)
		      currRec['intervallo_' + g] = 1;
		
	   if(globals.gestisciModificaCoperturaOrario(currRec,orarioApertura,numIntervalli,giorno))
	   {
		   for(g = 1; g <= numIntervalli; g++)
		   {
			   if(currRec['intervallo_' + g] == 1)
			   {
				   frm.elements['lbl_intervallo_' + currRow + '_' + g].bgcolor = globals.Colors.ATTENDANT.background; 
				   
				   if(oldArray[g - 1] != 1)
				   {
		    		  currRec['totale_ore'] += 0.25;
					  frm.elements['lbl_tot_ore_' + rIndex].text = currRec['totale_ore']; 
		    	      frm['var_pres_' + g] = forms[formName]['var_pres_' + g] + 1;
		    	      frm.elements['lbl_persone_intervallo_' + g].text = forms[formName]['var_pres_' + g];
				   }
			   }
			   else
		       {
		    	   frm.elements['lbl_intervallo_' + currRow + '_' + g].bgcolor = 'white'; 
				   
		    	   if(oldArray[g - 1] == 1)
		    	   {
    	    		  currRec['totale_ore'] -= 0.25;
					  frm.elements['lbl_tot_ore_' + rIndex].text = currRec['totale_ore'];  
		    	      frm['var_pres_' + g] = forms[formName]['var_pres_' + g] - 1;
			          frm.elements['lbl_persone_intervallo_' + g].text = forms[formName]['var_pres_' + g];
		    	   }
		       }
		   }
	   }
	   else
	   {
		   currRec.revertChanges();
		   for(g = 1; g <= numIntervalli; g++)
		   {
			   if(currRec['intervallo_' + g] == 1)
			      frm.elements['lbl_intervallo_' + currRow + '_' + g].bgcolor = globals.Colors.ATTENDANT.background; 
			   else
                  frm.elements['lbl_intervallo_' + currRow + '_' + g].bgcolor = 'white';
		   }
	   }
	   
	   forms[formName].controller.focusFirstField();
	   
	   currRow = null;
 	   currFormName = null;
 	   firstIndex = null;
 	   lastIndex = null;
	}
	else
		globals.ma_utl_showWarningDialog('La selezione delle celle non è valida!','Inserimento orario copertura punto vendita');
	
	currRow = null;
	currFormName = null;
		
	return result;
}

/**
 * @param {JSDNDEvent} event
 * @return {Boolean}
 * @properties={typeid:24,uuid:"2648608E-6AE2-4D7D-9F57-BDA1463D8930"}
 */
function onDragOver(event)
{
//	var src = event.getSource();
	var formName = event.getFormName(); //neg_prog_cop_giorno_ddMMyyyy_dtl
	var elemName = event.getElementName(); //lbl_intervallo_row_col
	
	if(elemName != null)
	{
		var pos_1 = utils.stringPosition(elemName,'_',0,2);
		var pos_2 = utils.stringPosition(elemName,'_',0,3);
		var rIndex = parseInt(utils.stringMiddle(elemName,pos_1 + 1,pos_2 - 1));
		var gIndex = parseInt(utils.stringMiddle(elemName,pos_2 + 1,elemName.length));
		
		if(currFormName == formName && rIndex == currRow)
		{
	    	lastIndex = gIndex;
			forms[formName].elements[elemName].bgcolor = '#44cc44';
	    	return true;
		}
	}
	return false;
}

/**
 * @param {JSDNDEvent} event
 * @return {Boolean}
 * @properties={typeid:24,uuid:"19368BBB-DD2D-434B-A9C0-2A87BB0C644A"}
 */
function onDrop(event)
{
	var formName = event.getFormName(); //neg_prog_cop_giorno_ddMMyyyy_dtl
	var elemName = event.getElementName(); //lbl_intervallo_row_col
	
	var pos_1 = utils.stringPosition(elemName,'_',0,2);
	var pos_2 = utils.stringPosition(elemName,'_',0,3);
	var rIndex = parseInt(utils.stringMiddle(elemName,pos_1 + 1,pos_2 - 1));
	var gIndex = parseInt(utils.stringMiddle(elemName,pos_2 + 1,elemName.length));
		
	if(rIndex == currRow && currFormName == formName)
	{
		lastIndex = gIndex;
		return true;
	}
	return false;
}