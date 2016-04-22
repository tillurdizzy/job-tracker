'use strict';
app.controller('NewPropertyViewCtrl',['$scope','$state','SharedSrvc','evoDb','TempVarSrvc',function ($scope,$state,SharedSrvc,evoDb,TempVarSrvc) {

    //This controller is the Parent View and is only used to choose the Client - then the ui-view is loaded with 
    //address form then roof form

    var DB = evoDb; 
    var ME = this;
    var S = SharedSrvc;
    var T = TempVarSrvc;
    ME.clientList = S.managerClients;
    ME.selectedClient = null;
    ME.clientType = null;
    ME.multiUnit = "No";

    ME.selectClient = function(){
         S.selectedClientObj =  ME.selectedClient;
          // both using same form as of 4/2016
        if(ME.selectedClient.type=="1"){ 
            T.multiUnitProperty = "No"; 
            $state.transitionTo('addNewProperty.address');
        }else{
            // This will show the second question on form if client is a business
           ME.clientType ="2";
        };
    };

    // Only if clientType is business - otherwise just selecting the client will transition
    ME.submitForm=function(){
        T.multiUnitProperty = ME.multiUnit;
        $state.transitionTo('addNewProperty.address');
    };

    ME.goNewClient = function(){
        $state.transitionTo("addNewClient");
    };

    var init = function(){
        ME.clientList.unshift({displayName:"-- Select Client --"});
        ME.selectedClient = ME.clientList[0];
    }

    $scope.$watch('$viewContentLoaded', function() {
        var loggedIn = S.loggedIn;
        if(!loggedIn){
            $state.transitionTo('login');
        }else{
        // Refresh the Client list every time we come to this page
            DB.getManagerClients();
       };
    });

    init();

 }]);