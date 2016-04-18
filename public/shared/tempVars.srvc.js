'use strict';
// This service is used only for passing short term vars between views/controllers.
app.service('TempVarSrvc',[function sharedTemp(){
	var self = this;

	self.multiUnitProperty;
	self.lastResultID;

	self.roofDescriptionData;

	self.resetAll = function(){
		self.multiUnitProperty = null;
		self.lastResultID = null;
		self.propertyStreetAddress = null;
		self.roofDescriptionData = {};
		self.roofDescriptionData.mode = "";
		self.roofDescriptionData.address = "";
		self.roofDescriptionData.propID = "";
		self.roofDescriptionData.multiUnit = "0";
		self.roofDescriptionData.bldgName = "";
	}

	self.resetAll();
	
}]);