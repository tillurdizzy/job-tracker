'use strict';

app.controller('InvtCtrl',['$location','$state','invtDb','$scope','SharedAdmin',function ($location,$state,invtDb,$scope,SharedAdmin) {
	var DB =  invtDb;
	var Me = this;
	var S = SharedAdmin;

	Me.T1 = "";
	Me.T2 = "";
	Me.T3 = "";
	Me.T4 = "";
	Me.T5 = "";
	Me.T6 = "";
	Me.T7 = "";
	Me.showForm = 0;
	
	Me.optionsS1 = S.invtCategories;
	Me.S1 = Me.optionsS1[0];

	Me.selectCategory = function(){
		Me.showForm = Me.S1.val;
	}

	Me.unitOptions = S.invtUnits;
	Me.selectorA = Me.unitOptions[0];

	Me.manufacturerOptions = S.invtManufacturers;
	Me.selectorC = Me.manufacturerOptions[0];

	Me.submitForm = function(int){
		var dataObj = {};
		dataObj.Manufacturer = Me.selectorC.val;
		dataObj.Item = Me.T1;
		dataObj.Description = Me.T2;
		dataObj.Qty = Me.T3;
		dataObj.Unit = Me.selectorA.val;
		dataObj.Price = Me.T4;
		var result = DB.putItem(int,dataObj)
            .then(function(result){
                if(result != false){
                    Me.clearForm();
                    Me.submissionComplete = true;
                }else{
                   
                }                 
            },function(error){
                Me.dataError();
            });
    }


	Me.submitMembrane = function(){
		var dataObj = {};
		dataObj.Manufacturer = Me.selectorC.val;
		dataObj.Type = Me.T1;
		dataObj.Width = Me.T2;
		dataObj.Length = Me.T3;
		dataObj.SqFtRoll = Me.T5;
		dataObj.RollsPallet = Me.T6;
		dataObj.WeightRoll = Me.T7;
		dataObj.Price = Me.T4;
		var result = DB.putItem(0,dataObj)
            .then(function(result){
                if(result != false){
                    Me.clearForm();
                    Me.submissionComplete = true;
                }else{
                   
                }                 
            },function(error){
                Me.dataError();
            });
    }

    Me.dataError = function(){

    };


	Me.clearForm = function(){
		Me.T2 = "";
		Me.T3 = "";
		Me.T4 = "";
		Me.T5 = "";
		Me.T6 = "";
		Me.T7 = "";
	};

	
	$scope.$on('$viewContentLoaded', function() {
 		
    });

 }]);