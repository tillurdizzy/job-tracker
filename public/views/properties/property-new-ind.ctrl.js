'use strict';
app.controller('NewPropertyIndCtrl',['$state','$scope','evoDb','SharedSrvc','underscore',function ($state,$scope,evoDb,SharedSrvc,underscore) {

    var DB = evoDb;
    var ME = this;
    ME.S = SharedSrvc;
    ME.managerName = ME.S.managerName;
    ME.selectedClientObj = ME.S.selectedClientObj;

    ME.clientName = ME.selectedClientObj.name_first + " " + ME.selectedClientObj.name_last;
    ME.propertyName = ME.selectedClientObj.name_last + " Residence";
    ME.streetAddress = ME.selectedClientObj.street;
    ME.propertyCity=ME.selectedClientObj.city;
    ME.propertyState=ME.selectedClientObj.state;
    ME.propertyZip=ME.selectedClientObj.zip;
    ME.numLevels=ME.S.levelOptions[0];
    ME.shingleGrade=ME.S.shingleGradeOptions[0];;
    ME.roofDeck=ME.S.roofDeckOptions[0];
    ME.coveredLayer=ME.S.coveredLayerOptions[0];
    ME.layersCovering=ME.S.numbersToFive[0];
    ME.edgeDetail=ME.S.edgeDetail[0];
    ME.valleyDetail=ME.S.valleyOptions[0];
    ME.ridgeCap=ME.S.ridgeCapShingles[0];
    ME.roofVents=ME.S.ventOptions[0];
    ME.pitchAvg = ME.S.pitchAverages[0];

    ME.formFields = ['','propertyName','streetAddress','propertyCity','propertyState','propertyZip',
        'numLevels','shingleGrade','roofDeck','coveredLayer','layersCovering','edgeDetail',
        'valleyDetail','ridgeCap','roofVents','SUBMIT'];

    var numFields = ME.formFields.length-2;
    ME.inputField = ME.formFields[1];
    ME.inputMsg = "Field 1 of " + numFields;
    ME.isError = false;

    ME.goNewJob = function(){
        $state.transitionTo('addNewJob');
    }

    ME.goPrevious = function(_from){
        var currentField = returnNdx(_from);
        var goToFieldNum = currentField - 1;
        if(goToFieldNum == 0){
            $state.transitionTo("addNewProperty");
        }else{
            ME.inputField=ME.formFields[goToFieldNum]
            ME.inputMsg = "Field " + goToFieldNum +  " of " + numFields;
        };
    };

    ME.goNext = function(_from){
        var currentField = returnNdx(_from);
        var goToFieldNum = currentField + 1;
        ME.inputField=ME.formFields[goToFieldNum];
        if(ME.inputField == "SUBMIT"){
             ME.inputMsg = "";
        }
       
    };

    var returnNdx = function(item){
        console.log("Going to "  + underscore.indexOf(ME.formFields,item));
        return underscore.indexOf(ME.formFields,item);
    }

    ME.submit_propertyName=function(){
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.propertyName==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.goNext('propertyName');
        };
    };

    ME.submit_streetAddress=function(){//bldg name
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.streetAddress==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.goNext('streetAddress');
        };
    };

    ME.submit_propertyCity=function(){//street
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.propertyCity==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.goNext('propertyCity');
        };
    };

    ME.submit_propertyState=function(){//city
        ME.inputMsg = "";
        ME.isError = false;
       if(ME.propertyState==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.goNext('propertyState');
        };
    };

    ME.submit_propertyZip=function(){//state
        ME.inputMsg = "";
        ME.isError = false;
       if(ME.propertyZip==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.goNext('propertyZip');
        };
    };

    ME.submit_numLevels=function(){//zip
        ME.inputMsg = "";
        ME.isError = false;
       if(ME.numLevels==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.goNext('numLevels');
        };
    };

    ME.submit_shingleGrade=function(){
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.shingleGrade==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.goNext('shingleGrade');
        };
    };

    ME.submit_roofDeck=function(){
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.roofDeck==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.goNext('roofDeck');
        };
    };

    ME.submit_coveredLayer=function(){
        ME.inputMsg = "";
        ME.isError = false;
       if(ME.coveredLayer==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.goNext('coveredLayer');
        };
    };

    ME.submit_layersCovering=function(){
        ME.inputMsg = "";
        ME.isError = false;
       if(ME.layersCovering==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.goNext('layersCovering');
        };
    };

    ME.submit_edgeDetail=function(){
        ME.inputMsg = "";
        ME.isError = false;
       if(ME.edgeDetail==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.goNext('edgeDetail');
        };
    };


    ME.submit_valleyDetail=function(){
        ME.inputMsg = "";
        ME.isError = false;
       if(ME.valleyDetail==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.goNext('valleyDetail');
        };
    };

    ME.submit_ridgeCap=function(){
        ME.inputMsg = "";
        ME.isError = false;
      if(ME.ridgeCap==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.goNext('ridgeCap');
        };
    };

     ME.submit_roofVents=function(){
        ME.inputMsg = "";
        ME.isError = false;
       if(ME.roofVents==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.goNext('roofVents');
        };
    };

     ME.submit_specialFlashing=function(){
        ME.inputMsg = "";
        ME.isError = false;
      if(ME.specialFlashing==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.goNext('specialFlashing');
        };
    };

  
    ME.submitForm = function(){
        ME.isError = false;
        var dataObj = {};
        dataObj.manager = ME.S.managerID;
        dataObj.client = ME.selectedClientObj.PRIMARY_ID;
        dataObj.name = ME.propertyName;
        dataObj.street = ME.streetAddress;
        dataObj.city = ME.propertyCity;
        dataObj.state = ME.propertyState;
        dataObj.zip = ME.propertyZip;
        dataObj.numLevels = ME.numLevels.id;
        dataObj.coveredLayer = ME.coveredLayer.id;
        dataObj.shingleGrade = ME.shingleGrade.id;
        dataObj.roofDeck = ME.roofDeck.id;
        dataObj.layersCovering = ME.layersCovering.id;
        dataObj.edgeDetail = ME.edgeDetail.id;
        dataObj.valleyDetail = ME.valleyDetail.id;
        dataObj.ridgeCap = ME.ridgeCap.id;
        dataObj.roofVents = ME.roofVents.id;
       
        var result = DB.putProperty(dataObj)
        .then(function(result){
             if(typeof result != "boolean"){
               ME.inputField="SUCCESS";
            }else{
                ME.dataError();
            }                 
        },function(error){
            ME.dataError();
        });
    };

    ME.dataError = function(){
        ME.inputField="ERROR";
        ME.isError = true;
        ME.inputMsg = "Submit Error.  Try again.";
    };

    ME.clearForm = function(){
       
    };

    ME.goNewClient = function(){
        $state.transitionTo("addNewClient");
    }

    ME.goNewProperty = function(){
        $state.transitionTo("addNewProperty");
    }

    $scope.$watch('$viewContentLoaded', function() {
       var loggedIn = ME.S.loggedIn;
       if(!loggedIn){
            $state.transitionTo('login');
       }else{
        
       }
    });

 }]);