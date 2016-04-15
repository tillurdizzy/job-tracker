'use strict';
app.controller('NewPropertyViewCtrl',['$scope','$state','SharedSrvc','evoDb',function ($scope,$state,SharedSrvc,evoDb) {

    //This controller is the Parent View and is only used to choose the Client - then the ui-view is loaded with 
    //either the form for Individual or Organization Client and a new controller takes over

    var DB = evoDb; 
    var ME = this;
    var S = SharedSrvc;
    ME.clientList = S.managerClients;
    ME.selectedClient = ME.clientList[0];
    ME.clientType = null;
    ME.multiUnit = "No";

    ME.selectClient = function(){
         S.selectedClientObj =  ME.selectedClient;
          // both using same form as of 4/2016
        if(ME.selectedClient.type=="Individual"){  
            $state.transitionTo('addNewProperty.individual');
        }else{
            // This will show the second question on form if client is a business
           ME.clientType ="Business";
        };
    }

    ME.submitForm=function(){
        S.multiUnitProperty = ME.multiUnit;
        $state.transitionTo('addNewProperty.individual');
    };

    ME.goNewClient = function(){
        $state.transitionTo("addNewClient");
    };

    $scope.$watch('$viewContentLoaded', function() {
        var loggedIn = S.loggedIn;
        if(!loggedIn){
            $state.transitionTo('login');
        }else{
        // Refresh the Client list every time we come to this page
            DB.getManagerClients();
       };
    });

 }]);