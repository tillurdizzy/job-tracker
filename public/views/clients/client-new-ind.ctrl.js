'use strict';
app.controller('NewClientIndCtrl',['$state','evoDb','SharedSrvc',function ($state,evoDb,SharedSrvc) {

	var DB = evoDb;
	var ME = this;
    ME.S = SharedSrvc;
    ME.managerName = ME.S.managerName;
    // Form elements
   
    ME.T1="";//first name
    ME.T2="";//last name
    ME.T3="";//cell
    ME.T4="";//email
    ME.T5="";//street
    ME.T6 = "Houston";
    ME.T7 = "TX";
    ME.T8="";//zip
   
   
    var currentFieldNum = "1";
    var numFields = "8";
    ME.inputField = "T1";
    ME.inputMsg = "Field 1 of " + numFields;
    ME.isError = false;

    ME.goPrevious = function(num){
        currentFieldNum = num;
        ME.inputField="T" + num;
        ME.inputMsg = "Field " + num +  " of " + numFields;
    }

    ME.goStart=  function(){
        $state.transitionTo("addNewClient");
    }

    ME.goAddProperty=  function(){
        $state.transitionTo("addNewProperty");
    }

    ME.goNewJob = function(){
        
    }

    
  
    ME.submitT1=function(){
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.T1==""){//first name
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="T2";
            ME.inputMsg = "Field 2 of " + numFields;;
        };
    };

    ME.submitT2=function(){
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.T2==""){//last
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="T3";
            ME.inputMsg = "Field 3 of " + numFields;
        }
    };

    ME.submitT3=function(){
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.T3==""){//cell
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="T4";
            ME.inputMsg = "Field 4 of " + numFields;
        }
    };

    ME.submitT4=function(){
        ME.inputMsg = "";
        ME.isError = false;
       if(ME.T4==""){//email
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="T5";
            ME.inputMsg = "Field 5 of " + numFields;
        }
    };

    ME.submitT5=function(){//street
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

    ME.submitT6=function(){//city
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
        if(ME.T7==""){//state
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
        if(ME.T8==""){//zip
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

        dataObj.manager = ME.S.manager;
        dataObj.type = "Individual";
        dataObj.name_first = ME.T1;
        dataObj.name_last = ME.T2;
        dataObj.displayName = ME.T1 + " " + ME.T2;
        dataObj.phone_cell = ME.T3;
        dataObj.phone_bus = ME.T3;
        dataObj.email = ME.T4;
        dataObj.street = ME.T5;
        dataObj.city = ME.T6;
        dataObj.state = ME.T7;
        dataObj.zip = ME.T8;
        dataObj.username = ME.T4;
        
        var result = DB.putClient(dataObj).then(function(result){
            if(typeof result != "boolean"){
               ME.inputField="SUCCESS";
               ME.getManagerProperties();//This will refresh Properties, Clients and Jobs for this Sales Rep!!!
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
        ME.T1 = "";
        ME.T2 = "";
        ME.T3 = "";
        ME.T4 = "";
        ME.T5 = "";
        ME.T6 = "Houston";
        ME.T7 = "TX";
        ME.T8 = "";
        ME.isError = false;
        ME.inputField="T1";
    };


    ME.dataError = function(loc,error){
        console.log(loc + " : " + error);
    };

    ME.getManagerProperties = function(){
        var result = DB.getManagerProperties()
        .then(function(result){
            if(result != false){
                // DB sent the data to the SharedSrvc
                // Don't do anything here
            }else{
              ME.dataError("JobsCtrl-getManagerProperties()-1",result); 
            }
        },function(error){
            ME.dataError("JobsCtrl-getManagerProperties()-2",result);
        });
    };


   
 }]);