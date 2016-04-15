'use strict';
// This service is used only for passing short term vars between views/controllers.
app.service('TempVarSrvc',[function sharedTemp(){
	var self = this;

	self.multiUnitProperty = null; //Used on New Property form when Client is a Business and property is a multi-unit like apartments.
	self.lastResultID = null; 
	
}]);