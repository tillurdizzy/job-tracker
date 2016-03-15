'use strict';
app.controller('NewClientViewCtrl', ['$state', function($state) {

    var ME = this;
    ME.ClientType = "Individual";

    ME.goJobs = function() {
        $state.transitionTo("jobs");
    };

    ME.goProperties = function() {
        $state.transitionTo("properties");
    };

    ME.submitClientType = function() {
        if (ME.ClientType == "Individual") {
            $state.transitionTo("addNewClient.individual");
        } else {
            $state.transitionTo("addNewClient.organization");
        };
    };


}]);
