'use strict';

app.controller('ClientsCtrl',['$scope','$state','evoDb','SharedSrvc',function ($scope,$state,evoDb,SharedSrvc) {
	var DB =  evoDb;
	var ME = this;
	var S = SharedSrvc;

	ME.managerID = S.managerID;
	ME.managerName = S.managerName;

	// data vars
	ME.clients = S.managerClients;
	ME.selectedClientObj = {};

	ME.editClient = function(ndx){
		ME.selectedClientObj = ME.clients[ndx];
		// Send job selection to shared
		S.selectClient(ME.selectedClientObj);
		$state.transitionTo("clients.details");
	};

	ME.refreshList = function(){
		ME.getManagerJobs();
	};

	// Triggers all 3 data queries (Clients, Properties, Jobs)
	ME.getManagerJobs = function(){
        var result = DB.getManagerJobs()
        .then(function(result){
            if(result != false){
                console.log("Successful getting job data");
            }else{
              ME.dataError("ClientsCtrl-getManagerJobs()-1",result); 
            }
        },function(error){
            ME.dataError("ClientsCtrl-getManagerJobs()-2",result);
        });
    };

	ME.backToList = function(){
      $state.transitionTo("clients");
    };

    $scope.$on('data-refreshed', function() {
     	ME.clients = S.managerClients;
    });

 }]);