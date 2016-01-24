'use strict';
app.controller('ClientFormCtrl',['$scope','$state','$element','evoDb','SharedSrvc',function ($scope,$state,$element,evoDb,SharedSrvc) {

	var DB = evoDb;
	var Me = this;
    var S = SharedSrvc;
    Me.managerName = S.managerName;
    // Form elements
   
    Me.T1="";
    Me.T2="";
    Me.T3="";
    Me.T4="";
    Me.T5="";
    Me.T6="";
    Me.T7="";
    Me.T8="";
   
   
    Me.submissionInvalid = false;// form is filled out correctly
    Me.submissionComplete = false;// form is filled out correctly
    

    Me.resetForm = function(){
        Me.submissionInvalid = false;
        Me.submissionComplete = false;
        Me.clearForm();
    };

  
    Me.submitForm = function(){
        if(Me.FormA.$valid){
            Me.submissionInvalid = false;
            var dataObj = {};
            dataObj.manager = S.manager;
            dataObj.company = Me.T1;
            dataObj.name_first = Me.T2;
            dataObj.name_last = Me.T3;
            dataObj.street = Me.T4;
            dataObj.city = Me.T5;
            dataObj.state = Me.T6;
            dataObj.zip = Me.T7;
            dataObj.phone_bus = Me.T8;
            dataObj.phone_cell = Me.T9;
            dataObj.email = Me.T10;
            var result = DB.putClient(dataObj)
                .then(function(result){
                    if(result != false){
                       Me.backToHome();
                    }else{
                       
                    }                 
                },function(error){
                    Me.dataError();
                });
        }else{
            Me.submissionInvalid = true;// triggers form errors to show 
        };
    };

    Me.dataError = function(){

    };

    Me.getSharedVars = function(){
        Me.T1 = Me.Job.name; // Text inputs
        Me.T2 = Me.Job.address;
        Me.T3 = Me.Job.city;
        Me.T4 = Me.Job.state;
        Me.T5 = Me.Job.zip;
        Me.T6 = Me.Job.contact;
        Me.T7 = Me.Job.phone;
        Me.T8 = Me.Job.email;
        Me.jobStatus = Me.Job.status;
    };

    Me.getSharedVars();

   
 }]);