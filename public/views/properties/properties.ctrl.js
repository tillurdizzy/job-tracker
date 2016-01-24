'use strict';

app.controller('PropertiesCtrl',['$state','evoDb','SharedSrvc',function ($state,evoDb,SharedSrvc) {
	var DB =  evoDb;
	var ME = this;
	var S = SharedSrvc;
	ME.controllerName = "PropertiesCtrl";
	ME.managerID = S.managerID;
	ME.managerName = S.managerName;
	ME.selectedProperty = {};

	// data vars
	ME.properties = S.managerClients;

	
	ME.showDetails = function(ndx){
		ME.selectedProperty = ME.properties[ndx];
		S.selectProperty(ME.selectedProperty);
		$state.transitionTo("detailsProperty");
	};

 }]);