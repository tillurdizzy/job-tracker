'use strict';

app.controller('AdminSalesPropertiesCtrl', ['$state', 'PropertiesSrvc',function($state,PropertiesSrvc) {
    var ME = this;
    var myName = "AdminSalesPropertiesCtrl";

    ME.EditMode = "add";

    ME.backToHome = function() {
        PropertiesSrvc.selfDestruct();
        $state.transitionTo('admin');
    };

    ME.addItem = function() {
        ME.EditMode = "add";
        $state.transitionTo('admin.propertyManagement.add');
    };

    ME.updateItem = function() {
        ME.EditMode = "update";
        $state.transitionTo('admin.propertyManagement.update');
    };

    ME.removeItem = function() {
        ME.EditMode = "remove";
        $state.transitionTo('admin.propertyManagement.remove');
    };

}]);
