'use strict';
app.controller('NewClientCtrl',['$state','evoDb','SharedSrvc',function ($state,evoDb,SharedSrvc) {

	var DB = evoDb;
	var ME = this;
    var S = SharedSrvc;
    ME.managerName = S.managerName;
    // Form elements
   
    ME.T1="";//company name
    ME.T2="";//street
    ME.T3="";//cilty
    ME.T4="";//state
    ME.T5="";//zip
    ME.T6="";//phone
    ME.T7="";//first
    ME.T8="";//last
    ME.T9="";//cell
    ME.T10="";//email
   
    var currentFieldNum = "1";
    var numFields = "10";
    ME.inputField = "T1";
    ME.inputMsg = "Field 1 of 10";
    ME.isError = false;

    ME.goPrevious = function(num){
        currentFieldNum = num;
        ME.inputField="T" + num;
        ME.inputMsg = "Field " + num +  " of " + numFields;
    }
  
    ME.submitT1=function(){
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.T1==""){//company
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
        if(ME.T2==""){//street
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="T3";
            ME.inputMsg = "Field 3 of " + numFields;;
        }
    };

    ME.submitT3=function(){
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.T3==""){//city
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="T4";
            ME.inputMsg = "Field 4 of " + numFields;;
        }
    };

    ME.submitT4=function(){
        ME.inputMsg = "";
        ME.isError = false;
       if(ME.T4==""){//state
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="T5";
            ME.inputMsg = "Field 5 of " + numFields;;
        }
    };

    ME.submitT5=function(){//zip
        ME.inputMsg = "";
        ME.isError = false;
       if(ME.T5==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="T6";
            ME.inputMsg = "Field 6 of " + numFields;;
        }
    };

    ME.submitT6=function(){//phone
        ME.inputMsg = "";
        ME.isError = false;
       if(ME.T6==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="T7";
            ME.inputMsg = "Field 7 of 10";
        }
    };

    ME.submitT7=function(){
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.T7==""){//first
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="T8";
            ME.inputMsg = "Field 8 of 10";
        }
    };

    ME.submitT8=function(){
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.T8==""){//last
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="T9";
            ME.inputMsg = "Field 9 of 10";
        }
    };

    ME.submitT9=function(){
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.T9==""){//mobile
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="T10";
            ME.inputMsg = "Field 10 of 10";
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

  
    ME.submitForm = function(){
        ME.isError = false;
        var dataObj = {};
        dataObj.manager = S.manager;
        dataObj.company = ME.T1;
        dataObj.street = ME.T2;
        dataObj.city = ME.T3;
        dataObj.state = ME.T4;
        dataObj.zip = ME.T5;
        dataObj.phone_bus = ME.T6;
         dataObj.name_first = ME.T7;
        dataObj.name_last = ME.T8;
        dataObj.phone_cell = ME.T9;
        dataObj.email = ME.T10;
        var result = DB.putClient(dataObj)
        .then(function(result){
            if(typeof result != "boolean"){
               ME.inputField="SUCCESS";
               ME.getManagerProperties();
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
        ME.T6 = "";
        ME.T7 = "";
        ME.T8 = "";
        ME.T9 = "";
        ME.T10 = "";
        ME.isError = false;
        ME.inputField="INFO";
    };

    ME.getManagerProperties = function(){
        var result = DB.getManagerProperties()
        .then(function(result){
            if(result != false){
                // Don't do anything here
            }else{
              ME.dataError("NewClientCtrl-getManagerProperties()-1",result); 
            }
        },function(error){
            ME.dataError("NewClientCtrl-getManagerProperties()-2",result);
        });
    };

    ME.dataError = function(loc,error){
        console.log(loc + " : " + error);
    };


   
 }]);