'use strict';

app.controller('MgrCtrl',['$location','$state','evoDb','$scope','SharedAdmin',function ($location,$state,evoDb,$scope,SharedAdmin) {
	var DB =  evoDb;
	var Me = this;
	var S = SharedAdmin;
	
	var Me.T1 = "";
	var Me.T2 = "";
	var Me.T3 = "";
	var Me.T4 = "";

	Me.submitManager = function(){
		var dataObj = {};
		dataObj.name_first = Me.T1;
		dataObj.name_last = Me.T2;
		dataObj.name_user = Me.T3;
		dataObj.pin = Me.T4;
		var result = DB.putItem(0,dataObj)
            .then(function(result){
                if(result != false){
                    Me.clearForm();
                    Me.submissionComplete = true;
                    $state.transitionTo("admin");
                }else{
                   
                }                 
            },function(error){
                Me.dataError();
            });
    }

    Me.dataError = function(){

    };


	Me.clearForm = function(){
		Me.T1 = "";
		Me.T2 = "";
		Me.T3 = "";
		Me.T4 = "";
		
	};
	
	$scope.$on('$viewContentLoaded', function() {
 		
    });

 }]);