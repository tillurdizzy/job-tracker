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

	ME.showDetails = function(ndxStr){
		var ndx = Number(ndxStr);
		for (var i = 0; i < ME.clients.length; i++) {
			if(ME.clients[i].PRIMARY_ID == ndx){
				ME.selectedClientObj = ME.clients[i];
				continue;
			}
		};
		
		// Send client selection to shared
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

    ME.goNewClient = function(){
      $state.transitionTo("addNewClient");
    };

    $scope.$on('data-refreshed', function() {
     	ME.clients = S.managerClients;
    });

    $scope.$watch('$viewContentLoaded', function() {
       var loggedIn = S.loggedIn;
       if(!loggedIn){
       		$state.transitionTo('login');
       }
    });

 }]);