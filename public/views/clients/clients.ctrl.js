'use strict';

app.controller('ClientsCtrl',['$location','$state','evoDb','$scope','SharedSrvc',function ($location,$state,evoDb,$scope,SharedSrvc) {
	var DB =  evoDb;
	var ME = this;
	var S = SharedSrvc;

	ME.managerID = S.managerID;
	ME.managerName = S.managerName;

	// data vars
	ME.clients = S.managerClients;

	//form vars
	ME.newJobForm = false;
	ME.invalid = false;

	ME.editClient = function(ndx){
		var clientObj = ME.clients[ndx];
		// Send job selection to shared
		S.selectClient(clientObj);
		$state.transitionTo("editClient");
	};

 }]);