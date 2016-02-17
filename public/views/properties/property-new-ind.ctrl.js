'use strict';
app.controller('NewPropertyIndCtrl',['$state','$scope','evoDb','SharedSrvc','underscore',function ($state,$scope,evoDb,SharedSrvc,underscore) {

    var DB = evoDb;
    var ME = this;
    ME.S = SharedSrvc;
    ME.managerName = ME.S.managerName;
    ME.selectedClientObj = ME.S.selectedClientObj;

    //Form models
    ME.clientName = ME.selectedClientObj.name_first + " " + ME.selectedClientObj.name_last;
    ME.propertyName = ME.selectedClientObj.name_last + " Residence";
    ME.streetAddress = ME.selectedClientObj.street;
    ME.propertyCity=ME.selectedClientObj.city;
    ME.propertyState=ME.selectedClientObj.state;
    ME.propertyZip=ME.selectedClientObj.zip;
    ME.numLevels=ME.S.levelOptions[0];
    ME.roofPitch = ME.S.pitchOptions[0];
    ME.shingleGrade=ME.S.shingleGradeOptions[0];
    ME.roofDeck=ME.S.roofDeckOptions[0];
    ME.layers=ME.S.numbersToFive[0];
    ME.edgeDetail=ME.S.edgeDetail[0];
    ME.edgeTrim=false;
    ME.valleyDetail=ME.S.valleyOptions[0];
    ME.ridgeCap=ME.S.ridgeCapShingles[0];
    ME.roofVents=ME.S.ventOptions[0];

    ME.multiLevelObj = {propertyID:0,LEVONE:0,LEVTWO:0,LEVTHR:0,LEVFOU:0,LEVFIV:0,LEVSIX:0};
    ME.multiVentObj = {propertyID:0,TURBNS:0,STATIC:0,PWRVNT:0,AIRHWK:0,SLRVNT:0};
    // Form fields to show and in this order
    // the goPrevious and goNext use this list to find destination
    ME.formFields = ['','propertyName','propertyAddress',
        'numLevels','roofPitch','shingleGrade','roofDeck','layers','edgeDetail',
        'valleyDetail','ridgeCap','roofVents','SUBMIT'];

    ME.multiLevelModel = {
        levelOne:{pitch:ME.S.multiLevelOptions[0],percent:ME.S.percentOptions[0]},
        levelTwo:{pitch:ME.S.multiLevelOptions[0],percent:ME.S.percentOptions[0]},
        levelThree:{pitch:ME.S.multiLevelOptions[0],percent:ME.S.percentOptions[0]},
        levelFour:{pitch:ME.S.multiLevelOptions[0],percent:ME.S.percentOptions[0]},
        levelFive:{pitch:ME.S.multiLevelOptions[0],percent:ME.S.percentOptions[0]},
        levelSix:{pitch:ME.S.multiLevelOptions[0],percent:ME.S.percentOptions[0]}
    };

    ME.multiVentModel = {
        TURBNS:ME.S.numbersToTen[0],
        STATIC:ME.S.numbersToTen[0],
        PWRVNT:ME.S.numbersToTen[0],
        AIRHWK:ME.S.numbersToTen[0],
        SLRVNT:ME.S.numbersToTen[0]
    };

    var numFields = ME.formFields.length-2;
    ME.inputField = ME.formFields[1];
    ME.inputMsg = "Field 1 of " + numFields;
    ME.isError = false;

    // ME.DOM used to store vars that are only used to show/hide DOM elements
    ME.DOM = {};
    ME.DOM.isMultiLevel = false;
    ME.DOM.isMultiVented = false;

    ME.goNewJob = function(){
        $state.transitionTo('addNewJob');
    };

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
        return underscore.indexOf(ME.formFields,item);
    };

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

    ME.submit_propertyAddress=function(){
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.streetAddress==="" || ME.propertyCity==="" || ME.propertyState==="" || ME.propertyZip===""){
            ME.isError = true;
            ME.inputMsg = "Please complete all fields.";
        }else{
            ME.goNext('propertyAddress');
        };
    };

    ME.submit_numLevels=function(){
        ME.inputMsg = "";
        ME.isError = false;
       if(ME.numLevels==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.goNext('numLevels');
        };
    };


    ME.selectPitch = function(){
        if(ME.roofPitch.id == 6){
            ME.DOM.isMultiLevel = true;
        }else{
            ME.DOM.isMultiLevel = false;
        }
    };

    ME.submit_roofPitch=function(){
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.DOM.isMultiLevel===true){
            ME.multiLevelObj.LEVONE = ME.multiLevelModel.levelOne.percent.id;
            ME.multiLevelObj.LEVTWO = ME.multiLevelModel.levelTwo.percent.id;
            ME.multiLevelObj.LEVTHR = ME.multiLevelModel.levelThree.percent.id;
            ME.multiLevelObj.LEVFOU = ME.multiLevelModel.levelFour.percent.id;
            ME.multiLevelObj.LEVFIV = ME.multiLevelModel.levelFive.percent.id;
            ME.multiLevelObj.LEVSIX = ME.multiLevelModel.levelSix.percent.id;
            var percentTotal = ME.multiLevelObj.LEVONE + ME.multiLevelObj.LEVTWO + 
            ME.multiLevelObj.LEVTHR + ME.multiLevelObj.LEVFOU + ME.multiLevelObj.LEVFIV + ME.multiLevelObj.LEVSIX;
            if(percentTotal == 10){
               ME.goNext('roofPitch');
            }else{
                ME.inputMsg = "Percent column must total 100.";
                ME.isError = true; 
            }
        }else{
            ME.goNext('roofPitch');
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

   
    ME.submit_layers=function(){
        ME.inputMsg = "";
        ME.isError = false;
       if(ME.layers==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.goNext('layers');
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

    ME.selectVentilation = function(){
        if(ME.roofVents.id == 2){
            ME.DOM.isMultiVented = true;
        }else{
            ME.DOM.isMultiVented = false;
        }
    };

     ME.submit_roofVents=function(){
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.DOM.isMultiVented === true){
           ME.multiVentObj.TURBNS = ME.multiVentModel.TURBNS.id;
           ME.multiVentObj.STATIC = ME.multiVentModel.STATIC.id;
           ME.multiVentObj.PWRVNT = ME.multiVentModel.PWRVNT.id;
           ME.multiVentObj.AIRHWK = ME.multiVentModel.AIRHWK.id;
           ME.multiVentObj.SLRVNT = ME.multiVentModel.SLRVNT.id;
        }
        ME.goNext('roofVents');
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
        var d = new Date();
        var dataObj = {};
        dataObj.manager = ME.S.managerID;
        dataObj.client = ME.selectedClientObj.PRIMARY_ID;
        dataObj.createdDate = d.valueOf();
        dataObj.name = ME.propertyName;
        dataObj.street = ME.streetAddress;
        dataObj.city = ME.propertyCity;
        dataObj.state = ME.propertyState;
        dataObj.zip = ME.propertyZip;
        dataObj.numLevels = ME.numLevels.id;
        dataObj.shingleGrade = ME.shingleGrade.id;
        dataObj.roofDeck = ME.roofDeck.id;
        dataObj.layers = ME.layers.id;
        dataObj.edgeDetail = ME.edgeDetail.id;
        dataObj.edgeTrim = (ME.edgeTrim===true) ? 1:0;
        dataObj.valleyDetail = ME.valleyDetail.id;
        dataObj.ridgeCap = ME.ridgeCap.id;
        dataObj.roofVents = ME.roofVents.id;
        dataObj.pitch = ME.roofPitch.id;
       
        var result = DB.putProperty(dataObj)
        .then(function(result){
             if(typeof result != "boolean"){
                var thisPropertyID = result.id;
                ME.submitMultiLevels(thisPropertyID);
                ME.submitMultiVents(thisPropertyID);
                ME.inputField="SUCCESS";
            }else{
                ME.dataError();
            }                 
        },function(error){
            ME.dataError();
        });
    };

    ME.submitMultiLevels = function(id){
        if(ME.DOM.isMultiLevel === true){
            ME.multiLevelObj.propertyID = id;
            var result = DB.putMultiLevel(ME.multiLevelObj)
                .then(function(result){
                if(typeof result != "boolean"){
                  
                }else{
                    ME.dataError();
                }                 
            },function(error){
                ME.dataError();
            });
        }
    };

    ME.submitMultiVents = function(id){
        if(ME.DOM.isMultiVented === true){
            ME.multiVentObj.propertyID = id;
            var result = DB.putMultiVents(ME.multiVentObj)
                .then(function(result){
                if(typeof result != "boolean"){
                  
                }else{
                    ME.dataError();
                }                 
            },function(error){
                ME.dataError();
            });
        }
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
    };

    ME.goNewProperty = function(){
        $state.transitionTo("addNewProperty");
    };

    $scope.$watch('$viewContentLoaded', function() {
       var loggedIn = ME.S.loggedIn;
       if(!loggedIn){
            $state.transitionTo('login');
       }else{
        
       }
    });

 }]);