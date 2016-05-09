'use strict';

app.controller('RemovePropertyCtrl', ['$state', '$scope', 'PropertiesSrvc', 'AdminDataSrvc', 'ListSrvc', 'ngDialog', function($state, $scope, PropertiesSrvc, AdminDataSrvc, ListSrvc, ngDialog) {
    var ME = this;
    var myName = "RemovePropertyCtrl";
    ME.P = PropertiesSrvc;
    var DB = AdminDataSrvc;
    ME.L = ListSrvc;
    ME.PROPERTIES = [];
    ME.Roof = {};
    ME.EditMode = "Remove Property";
    ME.modePrompt = "Remove Property: Choose a property to delete."
    ME.SubmitBtnLabel = "Remove Property";

    ME.submitInValid = true;

    // Model Vars
    ME.propertySelector = null;
    ME.inputDataObj = {};


    ME.backToHome = function() {
        $state.transitionTo('admin');
    };

    ME.selectProperty = function() {
        ME.configPropObj(ME.propertySelector.PRIMARY_ID);
    };

   
    ME.configPropObj = function(ID) {
        ME.inputDataObj = {};
        for (var i = 0; i < ME.PROPERTIES.length; i++) {
            if (ME.PROPERTIES[i].PRIMARY_ID == ID) {
                ME.inputDataObj = ME.PROPERTIES[i];
                break;
            };
        };

        ME.inputDataObj.client = ME.P.returnObjFromSetByPrimaryID(ME.CLIENTS, ME.inputDataObj.client);
        ME.inputDataObj.roofCode = ME.L.returnObjById(ME.L.roofCode, ME.inputDataObj.roofCode);
    };

    ME.submit = function() {
        var dataObj = { propertyID: ME.propertySelector.PRIMARY_ID };
        removeAssociatedPropertyData(dataObj);
        DB.query("deleteProperty", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error") {
                alert("FALSE returned for DB.deleteProperty() at " + myName + " >>> remove_Item()");
                console.log(resultObj.data);
            } else {
                var x = resultObj.data;
                ngDialog.open({
                    template: '<h2>Property has been deleted.</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: false
                });
            }
        }, function(error) {
            alert("ERROR returned for DB.deleteProperty() at " + myName + " >>> remove_Item()");
        });
    };

    var removeAssociatedPropertyData = function(dataObj) {
        DB.query("deleteMultiLevel", dataObj);
        DB.query("deleteMultiVents", dataObj);
        DB.query("deleteRoof", dataObj);
    };


    var resetInputFields = function() {
        ME.submitInValid = true;
        ME.inputDataObj = {};
        ME.propertySelector = ME.PROPERTIES[0];
    };

    var createDP = function() {
        ME.PROPERTIES = DB.clone(ME.P.PROPERTIES);
        ME.CLIENTS = DB.clone(ME.P.CLIENTS);
        resetInputFields();
    };

    createDP();

    $scope.$watch('$viewContentLoaded', function() {
        console.log("AdminSalesClientsCtrl >>> $viewContentLoaded");
    });

}]);
