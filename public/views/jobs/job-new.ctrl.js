'use strict';
app.controller('NewJobCtrl',['$scope','$state','evoDb','SharedSrvc',function ($scope,$state,evoDb,SharedSrvc) {

	var DB = evoDb;
	var Me = this;
    Me.S = SharedSrvc;
    Me.inputField = "INFO";
    Me.managerName = Me.S.managerName;
    Me.clientList = Me.S.managerClients;
    Me.propertyList = Me.S.managerProperties;
    Me.propertyRoofs; // The buildings/roofs for a multiUnit property
    var numFields = 2;
    Me.inputMsg = "Field 1 of " + numFields;
    // Form elements
    Me.S1 = Me.clientList[0];
    Me.S2 = ""; // Property

    Me.isMultiUnit = false;
   
    Me.submitS1 = function(){
        Me.inputMsg = "";
        Me.isError = false;
        if(Me.S1==""){//company/client
            Me.isError = true;
            Me.inputMsg = "This field cannot be blank.";
        }else{
            Me.filterProperties();
            Me.inputField="S2";
            Me.inputMsg = "Field 2 of " + numFields;
            Me.S.selectedClientObj = Me.S1;
        };
   };

   Me.submitS2 = function(){
        Me.inputMsg = "";
        Me.isError = false;

        Me.isMultiUnit = returnMultiUnit();

        if(Me.isMultiUnit == true){
            numFields = 3;
            getRoof();
            Me.inputField="S3";
        }else{
            var isDupe = Me.S.jobExists(Me.S1.PRIMARY_ID,Me.S2.PRIMARY_ID);
            if(isDupe){
                Me.isError = true;
                Me.inputMsg = "This Job already exists.";
            }else{
                Me.T1 = "Prospect";
                var d = new Date();
                Me.T2 = d.valueOf();
                Me.inputField="REVIEW";
                Me.inputMsg = "";
                Me.S.selectedPropertyObj = Me.S2;
            };
        }
   };

   Me.submitS3 = function(){
        Me.inputMsg = "";
        Me.isError = false;
        var isDupe = Me.S.jobExists(Me.S1.PRIMARY_ID,Me.S2.PRIMARY_ID);
        
        if(isDupe){
            Me.isError = true;
            Me.inputMsg = "This Job already exists.";
        }else{
            Me.T1 = "Prospect";
            var d = new Date();
            Me.T2 = d.valueOf();
            Me.inputField="REVIEW";
            Me.inputMsg = "";
            Me.S.selectedPropertyObj = Me.S2;
        };
   };

   Me.returnMultiUnit = function(){
        for (var i = 0; i <  Me.propertyList.length; i++) {
            if(Me.S2.PRIMARY_ID == Me.propertyList[i].PRIMARY_ID){
                var num = parseInt(Me.propertyList[i].multiUnit);
                if(num > 0){
                    return true;
                }
            }
        }
        return false;
   };

   var getRoof = function() {
        var dataObj = { propID: ME.S2.PRIMARY_ID };
        DB.query("getRoof",dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.getRoof() at >>> PropertiesCtrl.getRoof()");
            } else {
                Me.propertyRoofs = resultObj.data;
            }
        }, function(error) {
            alert("ERROR returned for DB.getRoof() at >>> PropertiesCtrl.getRoof()");
        });
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

    Me.selectProperty = function(){
        Me.inputMsg = "";
        Me.isError = false;
    };

    Me.selectRoof = function(){
       
    };

    Me.resetForm = function(){
        Me.clearForm();
    };

    Me.submitForm = function(){
        Me.isError = false;
        var dataObj = {};
        dataObj.jobNumber = "";
        dataObj.manager = Me.S.manager;
        dataObj.client = Me.S1.PRIMARY_ID;
        dataObj.property = Me.S2.PRIMARY_ID;
        dataObj.status = Me.T1;
        dataObj.dateProspect = Me.T2;
        dataObj.dateProposal = "0";

        var result = DB.putJob(dataObj).then(function(result){
            if(typeof result != "boolean"){
               Me.inputField="SUCCESS";
               var jobID = result.insertID;
               dataObj.PRIMARY_ID = jobID;
               Me.S.selectedJobObj = dataObj;
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
        $state.transitionTo("proposal.params");
    };

    $scope.$watch('$viewContentLoaded', function() {
       var loggedIn = Me.S.loggedIn;
       if(!loggedIn){
            $state.transitionTo('login');
       }
    });

    
 }]);