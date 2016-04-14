'use strict';
app.controller('NewClientOrgCtrl',['$state','evoDb','SharedSrvc',function ($state,evoDb,SharedSrvc) {

	var DB = evoDb;
	var ME = this;
    var S = SharedSrvc;
    ME.managerName = S.managerName;

    ME.inputModelObj = {companyName:"",companyStreet:"",companyCity:"",companyState:"",companyZip:"",
    companyPhone:"",contactFirstName:"",contactLastName:"",contactCell:"",contactEmail:""};
   
    var currentFieldNum = "1";
    var numFields = "10";
    ME.inputField = "companyName";
    ME.inputMsg = "Field 1 of 10";
    ME.isError = false;

    ME.goPrevious = function(field){
        switch(field){
            case "companyName":currentFieldNum = "1";break;
            case "companyStreet":currentFieldNum = "2";break;
            case "companyCity":currentFieldNum = "3";break;
            case "companyState":currentFieldNum = "4";break;
            case "companyZip":currentFieldNum = "5";break;
            case "companyPhone":currentFieldNum = "6";break;
            case "contactFirstName":currentFieldNum = "7";break;
            case "contactLastName":currentFieldNum = "8";break;
            case "contactCell":currentFieldNum = "9";break;
            case "contactEmail":currentFieldNum = "10";break;
        };
        ME.inputField=field;
        ME.inputMsg = "Field " + currentFieldNum +  " of " + numFields;
    };

    ME.goStart=  function(){
        $state.transitionTo("addNewClient");
    };

    
    ME.submit_companyName=function(){
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.inputModelObj.companyName==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="companyStreet";
            ME.inputMsg = "Field 2 of " + numFields;;
        };
    };

    ME.submit_companyStreet=function(){
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.inputModelObj.companyStreet==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="companyCity";
            ME.inputMsg = "Field 3 of " + numFields;;
        }
    };

    ME.submit_companyCity=function(){
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.inputModelObj.companyCity==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="companyState";
            ME.inputMsg = "Field 4 of " + numFields;;
        }
    };

    ME.submit_companyState=function(){
        ME.inputMsg = "";
        ME.isError = false;
       if(ME.inputModelObj.companyState==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="companyZip";
            ME.inputMsg = "Field 5 of " + numFields;;
        }
    };

    ME.submit_companyZip=function(){//zip
        ME.inputMsg = "";
        ME.isError = false;
       if(ME.inputModelObj.companyZip==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="companyPhone";
            ME.inputMsg = "Field 6 of " + numFields;;
        }
    };

    ME.submit_companyPhone=function(){//phone
        ME.inputMsg = "";
        ME.isError = false;
       if(ME.inputModelObj.companyPhone==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="contactFirstName";
            ME.inputMsg = "Field 7 of 10";
        }
    };

    ME.submit_contactFirstName=function(){
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.inputModelObj.contactFirstName==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="contactLastName";
            ME.inputMsg = "Field 8 of 10";
        }
    };

    ME.submit_contactLastName=function(){
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.inputModelObj.contactLastName==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="contactCell";
            ME.inputMsg = "Field 9 of 10";
        }
    };

    ME.submit_contactCell=function(){
        ME.inputMsg = "";
        ME.isError = false;
        if(ME.inputModelObj.contactCell==""){
            ME.isError = true;
            ME.inputMsg = "This field cannot be blank.";
        }else{
            ME.inputField="contactEmail";
            ME.inputMsg = "Field 10 of 10";
        }
    };

    ME.submitT_contactEmail=function(){
        ME.inputMsg = "";
        ME.isError = false;
       if(ME.inputModelObj.contactEmail==""){//email
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
        dataObj.client_type = "Organization";
        dataObj.company = ME.inputModelObj.companyName;
        dataObj.street = ME.inputModelObj.companyStreet;
        dataObj.city = ME.inputModelObj.companyCity;
        dataObj.state = ME.inputModelObj.companyState;
        dataObj.zip = ME.inputModelObj.companyZip;
        dataObj.phone_bus = ME.inputModelObj.companyPhone;
        dataObj.name_first = ME.inputModelObj.contactFirstName;
        dataObj.name_last = ME.inputModelObj.contactLastName;
        dataObj.phone_cell = ME.inputModelObj.contactCell;
        dataObj.email = ME.inputModelObj.contactEmail;
        DB.putClient(dataObj).then(function(result){
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
       ME.inputModelObj = {companyName:"",companyStreet:"",companyCity:"",companyState:"",companyZip:"",companyPhone:"",contactFirstName:"",contactLastName:"",contactCell:"",contactEmail:""}
        ME.isError = false;
        ME.inputField="companyName";
    };

    ME.dataError = function(loc,error){
        console.log(loc + " : " + error);
    };


   
 }]);