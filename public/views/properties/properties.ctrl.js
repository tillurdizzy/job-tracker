'use strict';

app.controller('PropertiesCtrl',['$scope','$state','evoDb','SharedSrvc',function ($scope,$state,evoDb,SharedSrvc) {
	var DB =  evoDb;
	var ME = this;
	var S = SharedSrvc;
	ME.controllerName = "PropertiesCtrl";
	ME.managerID = S.managerID;
	ME.managerName = S.managerName;
	ME.selectedPropertyObj = {};

	// data vars
	ME.properties = S.managerProperties;

	ME.showDetails = function(ndxStr){
		var ndx = Number(ndxStr);
		for (var i = 0; i < ME.properties.length; i++) {
			if(ME.properties[i].PRIMARY_ID == ndx){
				ME.selectedPropertyObj = ME.properties[i];
				continue;
			}
		};
		
		// Send client selection to shared
		S.selectProperty(ME.selectedPropertyObj);
		$state.transitionTo("properties.details");
	};

	ME.goClients = function(){
      $state.transitionTo("clients");
    };

    ME.goJobs = function(){
      $state.transitionTo("jobs");
    };

	ME.backToList = function(){
      $state.transitionTo("properties");
    };
    
    ME.goNewProperty = function(){
      $state.transitionTo("addNewProperty");
    };

    ME.getManagerJobs = function(){
		var result = DB.getManagerJobs()
        .then(function(result){
             if(typeof result != "boolean"){
            	// DB sent the data to the SharedSrvc
				
            }else{
              ME.dataError("JobsCtrl-getManagerJobs()-1",result); 
            }
        },function(error){
            ME.dataError("JobsCtrl-getManagerJobs()-2",result);
        });
	};

	ME.dataError = function(loc,error){
		console.log(loc + " : " + error);
	};


    $scope.$watch( function () { return S.managerProperties; }, function ( jobs ) {
	  ME.properties = S.managerProperties;
	});

	$scope.$watch('$viewContentLoaded', function() {
       var loggedIn = S.loggedIn;
       if(!loggedIn){
       		$state.transitionTo('login');
       }
    });

 }]);