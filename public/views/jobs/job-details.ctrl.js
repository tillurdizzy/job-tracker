'use strict';
app.controller('JobDetailsCtrl',['$scope','$state','evoDb','SharedSrvc',function ($scope,$state,evoDb,SharedSrvc) {

	var DB = evoDb;
	var Me = this;
    Me.S = SharedSrvc;

    Me.selectedJobObj = Me.S.selectedJobObj;
    Me.selectedClientObj = Me.S.selectedClientObj;
    Me.selectedPropertyObj = Me.S.selectedPropertyObj;
    Me.jobStatus = [];

    Me.selectedMode = null;// Set below 

    // Form elements
    Me.S1 = ""; // Select inputs
    Me.S2 = "";
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
    
   

    Me.selectS1 = function(objS1){
        Me.selectedS1 = objS1;
    };

    Me.resetForm = function(){
        Me.submissionInvalid = false;
        Me.submissionComplete = false;
        Me.S1 = Me.optionsS1[0];
        Me.S2 = Me.optionsS2[0];
        Me.S3 = Me.optionsS3[0];
        Me.clearForm();
    };

    Me.backToList = function(){
      $state.transitionTo("jobs");
    };

    Me.goProposal = function(){
        $state.transitionTo("proposal");
    }

    // S1 = Property type
    Me.optionsS1 = [{label:"Residential",val:0},{label:"Commercial",val:1}]
    Me.S1 = Me.optionsS1[0];

    // S2 = Roof type
    Me.optionsS2 = [{label:"Pitched",val:0},{label:"Flat",val:1}]
    Me.S2 = Me.optionsS2[0];

     // S3 = Status
    Me.optionsS3 = [{label:"Proposal",val:0},{label:"Contract",val:1},{label:"Active",val:1},{label:"Complete",val:1}]
    Me.S3 = Me.optionsS3[0];


    Me.editModes = [{label:"---Select Action---",val:-1},{label:"Change job status",val:0},{label:"Update details",val:1},{label:"Proposal",val:2}]
    Me.selectedMode = Me.editModes[0];
    Me.selectEditMode = function(){
        switch(Me.selectedMode.val){
            case 0:$state.transitionTo("jobs.edit.status");break;
            case 1:$state.transitionTo("jobs.edit.details");break;
            case 2:$state.transitionTo("jobs.edit.proposalShingle");break;
        }
    };

    Me.submitStatusChange = function(){
       if(Me.B.$valid){ 
         var dataObj = {};
         dataObj.PRIMARY_ID =  Me.Job.PRIMARY_ID;
         dataObj.status =  Me.S3.label;

         var result = DB.updateStatus(dataObj)
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
        }
    };

    Me.submitForm = function(){
        if(Me.A.$valid){
            Me.submissionInvalid = false;
            var dataObj = {};
            dataObj.PRIMARY_ID = Me.Job.PRIMARY_ID;
            dataObj.name = Me.T1;
            dataObj.property = Me.S1.label;
            dataObj.roof = Me.S2.label;
            dataObj.address = Me.T2;
            dataObj.city = Me.T3;
            dataObj.state = Me.T4;
            dataObj.zip = Me.T5;
            dataObj.contact = Me.T6;
            dataObj.phone = Me.T7;
            dataObj.email = Me.T8;
            
            var result = DB.updateDetails(dataObj)
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

    Me.getDetailData = function(){

    }

   //Me.getSharedVars();
  
   
 }]);