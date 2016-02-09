'use strict';
app.controller('NewPropertyCtrl',['$state','$scope','evoDb','SharedSrvc',function ($state,$scope,evoDb,SharedSrvc) {

    var DB = evoDb;
    var ME = this;
    var S = SharedSrvc;
    ME.managerName = S.managerName;
    ME.clientList = S.managerClients;
   
    ME.T1=ME.clientList[0];
    ME.T2="";
    ME.T3="";
    ME.T4="";
    ME.T5="TX";
    ME.T6="";
    ME.T7=1;
    ME.T8="Residential";
    ME.T9="Pitched";
    ME.T10="0";
    ME.T11=1;
   
    var numFields = "11";
    var currentFieldNum = "1";
    ME.inputField = "T1";
    ME.inputMsg = "Field 1 of " + numFields;
    ME.isError = false;

    ME.goPrevious = function(num){
        currentFieldNum = num;
        ME.inputField="T" + num;
        ME.inputMsg = "Field " + num +  " of " + numFields;
    };

    
    ME.submitT1=function(){
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.T1==""){//company/client
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="T2";
            ME.inputMsg = "Field 2 of " + numFields;
        };
    };

    ME.submitT2=function(){//bldg name
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.T2==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="T3";
            ME.inputMsg = "Field 3 of " + numFields;
        }
    };

    ME.submitT3=function(){//street
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.T3==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="T4";
            ME.inputMsg = "Field 4 of " + numFields;
        }
    };

    ME.submitT4=function(){//city
        ME.inputMsg = "";
        ME.isError = false;
       if(ME.T4==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="T5";
            ME.inputMsg = "Field 5 of " + numFields;
        }
    };

    ME.submitT5=function(){//state
        ME.inputMsg = "";
        ME.isError = false;
       if(ME.T5==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="T6";
            ME.inputMsg = "Field 6 of " + numFields;
        }
    };

    ME.submitT6=function(){//zip
        ME.inputMsg = "";
        ME.isError = false;
       if(ME.T6==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="T7";
            ME.inputMsg = "Field 7 of " + numFields;
        }
    };

    ME.submitT7=function(){
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.T7==""){//class
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="T8";
            ME.inputMsg = "Field 8 of " + numFields;
        }
    };

    ME.submitT8=function(){
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.T8==""){//mobile phone
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="T9";
            ME.inputMsg = "Field 9 of " + numFields;
        }
    };

    ME.submitT9=function(){
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.T9==""){//business phone
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="T10";
            ME.inputMsg = "Field 10 of " + numFields;
        }
    };

    ME.submitT10=function(){
        ME.inputMsg = "";
        ME.isError = false;
       if(ME.T10==""){//email
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="SUBMIT";
            ME.inputMsg = "";
        }
    };

    ME.submitT11=function(){
        ME.inputMsg = "";
        ME.isError = false;
       if(ME.T10==""){//email
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="SUBMIT";
            ME.inputMsg = "";
        }
    };

  
    ME.submitForm = function(){
        ME.isError = false;
        var dataObj = {};
        dataObj.manager = S.manager;
        dataObj.client = ME.T1;
        dataObj.name = ME.T2;
        dataObj.street = ME.T3;
        dataObj.city = ME.T4;
        dataObj.state = ME.T5;
        dataObj.zip = ME.T6;
        dataObj.levels = ME.T7;
        dataObj.class = ME.T8;
        dataObj.roof = ME.T9;
        dataObj.description = ME.T10;
        dataObj.layers = ME.T11;
        var result = DB.putProperty(dataObj)
        .then(function(result){
            if(result != false){
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

    $scope.$watch('$viewContentLoaded', function() {
       var loggedIn = S.loggedIn;
       if(!loggedIn){
            $state.transitionTo('login');
       }
    });


   
 }]);