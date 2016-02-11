'use strict';
app.controller('NewPropertyIndCtrl',['$state','$scope','evoDb','SharedSrvc',function ($state,$scope,evoDb,SharedSrvc) {

    var DB = evoDb;
    var ME = this;
    var S = SharedSrvc;
    ME.managerName = S.managerName;
    ME.clientList = S.managerClients;

    ME.propertyName="";
    ME.streetAddress="";
    ME.propertyCity="";
    ME.propertyState="";
    ME.propertyZip="";
    ME.numLevels="";
    ME.shingleGrade="";
    ME.roofDeck="";
    ME.coveredLayer="";
    ME.layersCovering="";
    ME.edgeDetail="";
    ME.valleyDetail="";
    ME.ridgeCap="";
    ME.roofVents="";
    ME.specialFlashing="";

    ME.formFields = ['','propertyName','streetAddress','propertyCity','propertyState','propertyZip',
        'numLevels','shingleGrade','roofDeck','coveredLayer','layersCovering','edgeDetail',
        'valleyDetail','ridgeCap','roofVents','specialFlashing'];

   
    var numFields = ME.formFields.length - 1;
    ME.inputField = ME.formFields[1];
    ME.inputMsg = "Field 1 of " + numFields;
    ME.isError = false;

    ME.goPrevious = function(_from){
        var currentField = returnNdx(_from);
        var goToFieldNum = currentField - 1;
        ME.inputField=ME.formFields[goToFieldNum]
        ME.inputMsg = "Field " + goToFieldNum +  " of " + numFields;
    };

    ME.goNext = function(_from){
        var currentField = returnNdx(_from);
        var goToFieldNum = currentField + 1;
        if(goToFieldNum < numFields){
            ME.inputField=ME.formFields[goToFieldNum]
            ME.inputMsg = "Field " + goToFieldNum +  " of " + numFields;
        }else{

        }
    };

    var returnNdx = function(item){
        return _.indexof(ME.formFields,item);
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
        dataObj.manager = S.manager;
        dataObj.client = ME.T1;
        dataObj.name = ME.propertyName;
        dataObj.street = ME.streetAddress;
        dataObj.city = ME.propertyCity;
        dataObj.state = ME.propertyState;
        dataObj.zip = ME.propertyZip;
        dataObj.levels = ME.numLevels;
        dataObj.underlayer = ME.coveredLayer;
        dataObj.shingle = ME.shingleGrade;
        dataObj.deck = ME.roofDeck;
        dataObj.layers = ME.layersCovering;
        dataObj.edge = ME.edgeDetail;
        dataObj.valley = ME.valleyDetail;
        dataObj.ridge = ME.ridgeCap;
        dataObj.vents = ME.roofVents;
        dataObj.flashin = ME.specialFlashing;
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
        ME.T1=ME.clientList[0];
        ME.T2="";
        ME.T3="";
        ME.T4="Houston";
        ME.T5="TX";
        ME.T6="";
        ME.T7="1";
        ME.T8="Commercial";
        ME.T9="Flat";
        ME.T10="0";
        ME.T11="1";
        ME.isError = false;
        ME.inputField="T1";
    };

    ME.goNewClient = function(){
        $state.transitionTo("addNewClient");
    }

    ME.goNewProperty = function(){
        $state.transitionTo("addNewProperty");
    }

    $scope.$watch('$viewContentLoaded', function() {
       var loggedIn = S.loggedIn;
       if(!loggedIn){
            $state.transitionTo('login');
       }else{
        // Refresh the Client list every time we come to this page
            DB.getManagerClients();
       }
    });

 }]);