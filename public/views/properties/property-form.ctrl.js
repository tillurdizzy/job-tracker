'use strict';
app.controller('ProprtyFormCtrl',['$scope','$state','$element','evoDb',function ($scope,$state,$element,evoDb) {

	var DB = evoDb;
	var ME = this;
    ME.S1 = ""; // Select input
    ME.S2 = "";
    ME.T1 = ""; // Text input
    ME.T2 = "";
    ME.T3 = "";
    ME.T4 = "";
    ME.T5 = "";
    ME.T6 = "";
    ME.T7 = "";
    ME.T8 = "";

    ME.submissionInvalid = false;// form is filled out correctly
    ME.submissionComplete = false;// form is filled out correctly
    
    // Allows ENTER key to submit form
    $element.bind("keydown keypress", function (event) {
        console.log('keypress', event, event.which);
        if(event.which === 38) { // up
            ME.submitForm();
        } else if (event.which === 40) { // down
        } else {
            return;
        }
        event.preventDefault();
    });

    ME.selectS1 = function(objS1){
        ME.selectedS1 = objS1;
    };

    ME.resetForm = function(){
        ME.submissionInvalid = false;
        ME.submissionComplete = false;
        ME.S1 = ME.optionsS1[0];
        ME.S2 = ME.optionsS2[0];
        ME.clearForm();
    };

    ME.backToHome = function(){
      $state.transitionTo("home");
    };

    // S1 = Property type
    ME.optionsS1 = [{label:"Residential",val:"Residential"},{label:"Commercial",val:"Commercial"}]
    ME.S1 = ME.optionsS1[0];

     // S2 = Roof type
    ME.optionsS2 = [{label:"Pitched",val:"Pitched"},{label:"Flat",val:"Flat"}]
    ME.S2 = ME.optionsS2[0];

    ME.submitForm = function(){
        if(ME.A.$valid){
            ME.submissionInvalid = false;
            var dataObj = {};
            dataObj.name = ME.T1;
            dataObj.property = ME.S1.val;
            dataObj.roof = ME.S2.val;
            dataObj.address = ME.T2;
            dataObj.city = ME.T3;
            dataObj.state = ME.T4;
            dataObj.zip = ME.T5;
            dataObj.contact = ME.T6;
            dataObj.phone = ME.T7;
            dataObj.email = ME.T8;
            dataObj.status = 0;
            dataObj.date1 = new Date().getTime();
            var result = DB.putProspect(dataObj)
                .then(function(result){
                    if(result != false){
                        ME.clearForm();
                        ME.submissionComplete = true;
                    }else{
                       
                    }                 
                },function(error){
                    ME.dataError();
                });
        }else{
            ME.submissionInvalid = true;// triggers form errors to show 
        };
    };

    ME.dataError = function(){

    };

    ME.clearForm = function(){
        ME.T1="";
        ME.T2="";
        ME.T3="";
        ME.T4="";
        ME.T5="";
        ME.T6="";
        ME.T7="";
        ME.T8="";
    };

 }]);