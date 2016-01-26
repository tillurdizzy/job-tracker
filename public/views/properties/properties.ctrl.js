'use strict';

app.controller('PropertiesCtrl',['$state','evoDb','SharedSrvc',function ($state,evoDb,SharedSrvc) {
	var DB =  evoDb;
	var ME = this;
	var S = SharedSrvc;
	ME.controllerName = "PropertiesCtrl";
	ME.managerID = S.managerID;
	ME.managerName = S.managerName;
	ME.selectedPropertyObj = {};

	// data vars
	ME.properties = S.managerProperties;

	ME.showDetails = function(ndx){
		ME.selectedPropertyObj = ME.properties[ndx];
		S.selectProperty(ME.selectedPropertyObj);
		$state.transitionTo("properties.details");
	};

	ME.backToList = function(){
      $state.transitionTo("properties");
    };

 }]);