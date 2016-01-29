'use strict';
app.controller('NewClientCtrl',['$state','evoDb','SharedSrvc',function ($state,evoDb,SharedSrvc) {

	var DB = evoDb;
	var Me = this;
    var S = SharedSrvc;
    Me.managerName = S.managerName;
    // Form elements
   
    Me.T1="";
    Me.T2="";
    Me.T3="";
    Me.T4="";
    Me.T5="Houston";
    Me.T6="TX";
    Me.T7="";
    Me.T8="";
    Me.T9="";
    Me.T10="";
   
    Me.inputField = "T1";
    Me.inputMsg = "Field 1 of 10";
    Me.isError = false;
  
    Me.submitT1=function(){
        Me.inputMsg = "";
        Me.isError = false;
        if(Me.T1==""){//company
            Me.isError = true;
            Me.inputMsg = "This field cannot be blank.";
        }else{
            Me.inputField="T2";
            Me.inputMsg = "Field 2 of 10";
        };
    };

    Me.submitT2=function(){//first name
        Me.inputMsg = "";
        Me.isError = false;
        if(Me.T2==""){
            Me.isError = true;
            Me.inputMsg = "This field cannot be blank.";
        }else{
            Me.inputField="T3";
            Me.inputMsg = "Field 3 of 10";
        }
    };

    Me.submitT3=function(){//last name
        Me.inputMsg = "";
        Me.isError = false;
        if(Me.T3==""){
            Me.isError = true;
            Me.inputMsg = "This field cannot be blank.";
        }else{
            Me.inputField="T4";
            Me.inputMsg = "Field 4 of 10";
        }
    };

    Me.submitT4=function(){//street
        Me.inputMsg = "";
        Me.isError = false;
       if(Me.T4==""){
            Me.isError = true;
            Me.inputMsg = "This field cannot be blank.";
        }else{
            Me.inputField="T5";
            Me.inputMsg = "Field 5 of 10";
        }
    };

    Me.submitT5=function(){//city
        Me.inputMsg = "";
        Me.isError = false;
       if(Me.T5==""){
            Me.isError = true;
            Me.inputMsg = "This field cannot be blank.";
        }else{
            Me.inputField="T6";
            Me.inputMsg = "Field 6 of 10";
        }
    };

    Me.submitT6=function(){//state
        Me.inputMsg = "";
        Me.isError = false;
       if(Me.T6==""){
            Me.isError = true;
            Me.inputMsg = "This field cannot be blank.";
        }else{
            Me.inputField="T7";
            Me.inputMsg = "Field 7 of 10";
        }
    };

    Me.submitT7=function(){
        Me.inputMsg = "";
        Me.isError = false;
        if(Me.T7==""){//zip
            Me.isError = true;
            Me.inputMsg = "This field cannot be blank.";
        }else{
            Me.inputField="T8";
            Me.inputMsg = "Field 8 of 10";
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
            Me.inputMsg = "Field 9 of 10";
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
            Me.inputMsg = "Field 10 of 10";
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

  
    Me.submitForm = function(){
        Me.isError = false;
        var dataObj = {};
        dataObj.manager = S.manager;
        dataObj.company = Me.T1;
        dataObj.name_first = Me.T2;
        dataObj.name_last = Me.T3;
        dataObj.street = Me.T4;
        dataObj.city = Me.T5;
        dataObj.state = Me.T6;
        dataObj.zip = Me.T7;
        dataObj.phone_cell = Me.T8;
        dataObj.phone_bus = Me.T9;
        dataObj.email = Me.T10;
        var result = DB.putClient(dataObj)
        .then(function(result){
            if(result != false){
               Me.inputField="SUCCESS";
               ME.getManagerProperties();
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
        Me.T1 = "";
        Me.T2 = "";
        Me.T3 = "";
        Me.T4 = "";
        Me.T5 = "";
        Me.T6 = "";
        Me.T7 = "";
        Me.T8 = "";
        Me.T9 = "";
        Me.T10 = "";
        Me.isError = false;
        Me.inputField="INFO";
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