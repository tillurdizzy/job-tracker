'use strict';
app.controller('NewPropertyViewCtrl',['$state','SharedSrvc',function ($state,SharedSrvc) {

    var DB = evoDb;
    var ME = this;
    var S = SharedSrvc;
    ME.clientList = S.managerClients;
    ME.selectedClient;

    ME.submitClient=function(){
        S.selectedClientObj =  ME.selectedClient;
        if(ME.selectedClient.type=="Individual"){
            
            $state.transitionTo('addNewProperty.individual');
        }else{
            $state.transitionTo('addNewProperty.organization');
        };
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