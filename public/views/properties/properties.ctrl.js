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

    ME.getManagerJobs = function(){
		var result = DB.getManagerJobs()
        .then(function(result){
            if(result != false){
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

 }]);