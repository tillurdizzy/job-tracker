'use strict';
app.controller('NewPropertyCtrl',['$state','evoDb','SharedSrvc',function ($state,evoDb,SharedSrvc) {

    var DB = evoDb;
    var Me = this;
    var S = SharedSrvc;
    Me.managerName = S.managerName;
    Me.clientList = S.managerClients;
   
    Me.T1=Me.clientList[0];
    Me.T2="";
    Me.T3="";
    Me.T4="Houston";
    Me.T5="TX";
    Me.T6="";
    Me.T7=1;
    Me.T8="Commercial";
    Me.T9="Flat";
    Me.T10="0";
    Me.T11=1;
   
    var numFields = 11;
    Me.inputField = "T1";
    Me.inputMsg = "Field 1 of " + numFields;
    Me.isError = false;

    
   
   
  
    Me.submitT1=function(){
        Me.inputMsg = "";
        Me.isError = false;
        if(Me.T1==""){//company/client
            Me.isError = true;
            Me.inputMsg = "This field cannot be blank.";
        }else{
            Me.inputField="T2";
            Me.inputMsg = "Field 2 of " + numFields;
        };
    };

    Me.submitT2=function(){//bldg name
        Me.inputMsg = "";
        Me.isError = false;
        if(Me.T2==""){
            Me.isError = true;
            Me.inputMsg = "This field cannot be blank.";
        }else{
            Me.inputField="T3";
            Me.inputMsg = "Field 3 of " + numFields;
        }
    };

    Me.submitT3=function(){//street
        Me.inputMsg = "";
        Me.isError = false;
        if(Me.T3==""){
            Me.isError = true;
            Me.inputMsg = "This field cannot be blank.";
        }else{
            Me.inputField="T4";
            Me.inputMsg = "Field 4 of " + numFields;
        }
    };

    Me.submitT4=function(){//city
        Me.inputMsg = "";
        Me.isError = false;
       if(Me.T4==""){
            Me.isError = true;
            Me.inputMsg = "This field cannot be blank.";
        }else{
            Me.inputField="T5";
            Me.inputMsg = "Field 5 of " + numFields;
        }
    };

    Me.submitT5=function(){//state
        Me.inputMsg = "";
        Me.isError = false;
       if(Me.T5==""){
            Me.isError = true;
            Me.inputMsg = "This field cannot be blank.";
        }else{
            Me.inputField="T6";
            Me.inputMsg = "Field 6 of " + numFields;
        }
    };

    Me.submitT6=function(){//zip
        Me.inputMsg = "";
        Me.isError = false;
       if(Me.T6==""){
            Me.isError = true;
            Me.inputMsg = "This field cannot be blank.";
        }else{
            Me.inputField="T7";
            Me.inputMsg = "Field 7 of " + numFields;
        }
    };

    Me.submitT7=function(){
        Me.inputMsg = "";
        Me.isError = false;
        if(Me.T7==""){//class
            Me.isError = true;
            Me.inputMsg = "This field cannot be blank.";
        }else{
            Me.inputField="T8";
            Me.inputMsg = "Field 8 of " + numFields;
        }
    };

    Me.submitT8=function(){
        Me.inputMsg = "";
        Me.isError = false;
        if(Me.T8==""){//mobile phone
            Me.isError = true;
            Me.inputMsg = "This field cannot be blank.";
        }else{
            Me.inputField="T9";
            Me.inputMsg = "Field 9 of " + numFields;
        }
    };

    Me.submitT9=function(){
        Me.inputMsg = "";
        Me.isError = false;
        if(Me.T9==""){//business phone
            Me.isError = true;
            Me.inputMsg = "This field cannot be blank.";
        }else{
            Me.inputField="T10";
            Me.inputMsg = "Field 10 of " + numFields;
        }
    };

    Me.submitT10=function(){
        Me.inputMsg = "";
        Me.isError = false;
       if(Me.T10==""){//email
            Me.isError = true;
            Me.inputMsg = "This field cannot be blank.";
        }else{
            Me.inputField="SUBMIT";
            Me.inputMsg = "";
        }
    };

    Me.submitT11=function(){
        Me.inputMsg = "";
        Me.isError = false;
       if(Me.T10==""){//email
            Me.isError = true;
            Me.inputMsg = "This field cannot be blank.";
        }else{
            Me.inputField="SUBMIT";
            Me.inputMsg = "";
        }
    };

  
    Me.submitForm = function(){
        Me.isError = false;
        var dataObj = {};
        dataObj.manager = S.manager;
        dataObj.client = Me.T1;
        dataObj.name = Me.T2;
        dataObj.street = Me.T3;
        dataObj.city = Me.T4;
        dataObj.state = Me.T5;
        dataObj.zip = Me.T6;
        dataObj.levels = Me.T7;
        dataObj.class = Me.T8;
        dataObj.roof = Me.T9;
        dataObj.description = Me.T10;
        dataObj.layers = Me.T11;
        var result = DB.putProperty(dataObj)
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
        Me.inputField="ERROR";
        Me.isError = true;
        Me.inputMsg = "Submit Error.  Try again.";
    };

    Me.clearForm = function(){
        Me.T1=Me.clientList[0];
        Me.T2="";
        Me.T3="";
        Me.T4="Houston";
        Me.T5="TX";
        Me.T6="";
        Me.T7="1";
        Me.T8="Commercial";
        Me.T9="Flat";
        Me.T10="0";
        Me.T11="1";
        Me.isError = false;
        Me.inputField="T1";
    };


   
 }]);