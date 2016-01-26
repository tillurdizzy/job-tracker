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
   
    Me.inputField = "company";
    Me.errorMsg = "";
    
    Me.resetForm = function(){
        Me.submissionComplete = false;
        Me.clearForm();
    };



    Me.submitT1=function(){
        Me.errorMsg = "";
        if(Me.T1==""){//company
            Me.errorMsg = "This field cannot be blank.";
        }else{
            Me.inputField="firstName";
        }
    };
    Me.submitT2=function(){//first name
        Me.errorMsg = "";
        if(Me.T2==""){
            Me.errorMsg = "This field cannot be blank.";
        }else{
            Me.inputField="lastName";
        }
    };
    Me.submitT3=function(){//last name
        Me.errorMsg = "";
        if(Me.T3==""){
            Me.errorMsg = "This field cannot be blank.";
        }else{
            Me.inputField="street";
        }
    };
    Me.submitT4=function(){//street
        Me.errorMsg = "";
       if(Me.T4==""){
            Me.errorMsg = "This field cannot be blank.";
        }else{
            Me.inputField="city";
        }
    };
    Me.submitT5=function(){//city
        Me.errorMsg = "";
       if(Me.T5==""){
            Me.errorMsg = "This field cannot be blank.";
        }else{
            Me.inputField="state";
        }
    };
    Me.submitT6=function(){//state
        Me.errorMsg = "";
       if(Me.T6==""){
            Me.errorMsg = "This field cannot be blank.";
        }else{
            Me.inputField="zip";
        }
    };
    Me.submitT7=function(){
        Me.errorMsg = "";
        if(Me.T7==""){//zip
            Me.errorMsg = "This field cannot be blank.";
        }else{
            Me.inputField="mobile";
        }
    };
    Me.submitT8=function(){
        Me.errorMsg = "";
        if(Me.T8==""){//mobile phone
            Me.errorMsg = "This field cannot be blank.";
        }else{
            Me.inputField="bus";
        }
    };
    Me.submitT9=function(){
        Me.errorMsg = "";
        if(Me.T9==""){//business phone
            Me.errorMsg = "This field cannot be blank.";
        }else{
            Me.inputField="email";
        }
    };
    Me.submitT10=function(){
        Me.errorMsg = "";
       if(Me.T10==""){//email
            Me.errorMsg = "This field cannot be blank.";
        }else{
            Me.inputField="submit";
        }
    };

  
    Me.submitForm = function(){
       
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
               Me.backToHome();
            }else{
               
            }                 
        },function(error){
            Me.dataError();
        });
    };


    Me.dataError = function(){

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
       
    };

    Me.getSharedVars();

   
 }]);