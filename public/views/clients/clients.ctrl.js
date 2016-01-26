'use strict';

app.controller('ClientsCtrl',['$state','evoDb','SharedSrvc',function ($state,evoDb,SharedSrvc) {
	var DB =  evoDb;
	var ME = this;
	var S = SharedSrvc;

	ME.managerID = S.managerID;
	ME.managerName = S.managerName;

	// data vars
	ME.clients = S.managerClients;
	ME.selectedClientObj = {};


	//form vars
	ME.newJobForm = false;
	ME.invalid = false;

	ME.editClient = function(ndx){
		ME.selectedClientObj = ME.clients[ndx];
		// Send job selection to shared
		S.selectClient(ME.selectedClientObj);
		$state.transitionTo("clients.details");
	};

	ME.backToList = function(){
      $state.transitionTo("clients");
    };

 }]);