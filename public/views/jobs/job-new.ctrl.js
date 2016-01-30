'use strict';
app.controller('NewJobCtrl',['$scope','$state','evoDb','SharedSrvc',function ($scope,$state,evoDb,SharedSrvc) {

	var DB = evoDb;
	var Me = this;
    var S = SharedSrvc;
    Me.inputField = "INFO";
    Me.managerName = S.managerName;
    Me.clientList = S.managerClients;
    Me.propertyList = S.managerProperties;
    var numFields = 2;
    Me.inputMsg = "Field 1 of " + numFields;
    // Form elements
    Me.S1 = Me.clientList[0];
    Me.S2 = ""; // Property
    Me.T1;
    Me.T2;
    

    Me.submitS1 = function(){
        Me.inputMsg = "";
        Me.isError = false;
        if(Me.S1==""){//company/client
            Me.isError = true;
            Me.inputMsg = "This field cannot be blank.";
        }else{
            Me.inputField="S2";
            Me.inputMsg = "Field 2 of " + numFields;
            S.selectedClientObj = Me.S1;
        };
   };

   Me.submitS2 = function(){
        Me.inputMsg = "";
        Me.isError = false;
        if(Me.S2==""){//company/client
            Me.isError = true;
            Me.inputMsg = "This field cannot be blank.";
        }else{
            Me.T1 = "Prospect";
            var d = new Date();
            Me.T2 = d.valueOf();
            Me.inputField="REVIEW";
            Me.inputMsg = "";
            S.selectedPropertyObj = Me.S2;
        };
   };

    // When user selects Client, filter properties for only tha client
    Me.filterProperties = function(){
        Me.propertyOptions = [];
        for (var i = 0; i < Me.propertyList.length; i++) {
            if(Me.propertyList[i].client == Me.S1.PRIMARY_ID){
                Me.propertyOptions.push(Me.propertyList[i]);
            }
        };
         Me.S2 = Me.propertyOptions[0];
    };

    Me.resetForm = function(){
        Me.clearForm();
    };

    Me.submitForm = function(){
        Me.isError = false;
        var dataObj = {};
        dataObj.jobNumber = "";
        dataObj.manager = S.manager;
        dataObj.client = Me.S1.PRIMARY_ID;
        dataObj.property = Me.S2.PRIMARY_ID;
        dataObj.status = Me.T1;
        dataObj.dateProspect = Me.T2;
        var result = DB.putJob(dataObj)
        .then(function(result){
            if(result != false){
               Me.inputField="SUCCESS";
            }else{
                Me.dataError();
            }                 
        },function(error){
            Me.dataError();
        });
    };

    Me.dataError = function(){

    };

    Me.goNewClient = function(){
        $state.transitionTo("addNewClient");
    };

    Me.goNewProperty = function(){
        $state.transitionTo("addNewProperty");
    };

     Me.goProposal =  function(){
        if(Me.S2.roof == "Pitched"){
            $state.transitionTo("proposalNewPitched");
        }else{
            $state.transitionTo("proposalNewFlat");
        }
    };

    
 }]);