'use strict';
app.controller('NewClientViewCtrl',['$state',function ($state) {

	var ME = this;
    ME.ClientType = "Individual";
   
    // Form elements
   
    ME.submitClientType=function(){
        if( ME.ClientType=="Individual"){
           $state.transitionTo("addNewClient.individual");
        }else{
             $state.transitionTo("addNewClient.organization");
        };
    };


 }]);