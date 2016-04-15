'use strict';
app.controller('NewPropertyAddressCtrl', ['$state', '$scope', 'evoDb', 'SharedSrvc', 'underscore', 'TempVarSrvc', 'ngDialog',
    function($state, $scope, evoDb, SharedSrvc, underscore, TempVarSrvc, ngDialog) {

        var DB = evoDb;
        var ME = this;
        ME.S = SharedSrvc;
        var T = TempVarSrvc;
        ME.managerName = ME.S.managerName;
        ME.selectedClientObj = ME.S.selectedClientObj;
        ME.multiUnit = T.multiUnitProperty; // Business client with multi-unit property (apartments)

        //Form models
        ME.clientName = ME.selectedClientObj.name_first + " " + ME.selectedClientObj.name_last;
        ME.propertyName = ME.selectedClientObj.name_last + " Residence";
        ME.streetAddress = ME.selectedClientObj.street;
        ME.propertyCity = ME.selectedClientObj.city;
        ME.propertyState = ME.selectedClientObj.state;
        ME.propertyZip = ME.selectedClientObj.zip;
        ME.multiUnitNumber = "2";

        ME.formFields = ['', 'propertyName', 'propertyAddress', 'SUBMIT'];

        var numFields = ME.formFields.length - 2;
        ME.inputField = ME.formFields[1];
        ME.inputMsg = "Page 1 of 2";
        ME.isError = false;

        ME.goNewJob = function() {
            $state.transitionTo('addNewJob');
        };

        ME.goPrevious = function(_from) {
            var currentField = returnNdx(_from);
            var goToFieldNum = currentField - 1;
            if (goToFieldNum == 0) {
                $state.transitionTo("addNewProperty");
            } else {
                ME.inputField = ME.formFields[goToFieldNum]
                ME.inputMsg = "Page " + goToFieldNum + " of " + numFields;
            };
        };

        ME.goNext = function(_from) {
            var currentField = returnNdx(_from);
            var goToFieldNum = currentField + 1;
            ME.inputField = ME.formFields[goToFieldNum];
            ME.inputMsg = "Page " + goToFieldNum + " of " + numFields;
            if (ME.inputField == "SUBMIT") {
                ME.inputMsg = "";
            }
        };

        var returnNdx = function(item) {
            return underscore.indexOf(ME.formFields, item);
        };

        ME.submit_propertyName = function() {
            ME.inputMsg = "";
            ME.isError = false;
            if (ME.propertyName == "") {
                ME.isError = true;
                ME.inputMsg = "This field cannot be blank.";
            } else {
                ME.goNext('propertyName');
            };
        };

        ME.submit_propertyAddress = function() {
            ME.inputMsg = "";
            ME.isError = false;
            if (ME.streetAddress === "" || ME.propertyCity === "" || ME.propertyState === "" || ME.propertyZip === "") {
                ME.isError = true;
                ME.inputMsg = "Please complete all fields.";
            } else {
                ME.goNext('propertyAddress');
            };
        };

        ME.submitForm = function() {
            ME.isError = false;
            var d = new Date();
            var dataObj = {};
            dataObj.manager = ME.S.managerID;
            dataObj.client = ME.selectedClientObj.PRIMARY_ID;
            dataObj.createdDate = d.valueOf();
            dataObj.name = ME.propertyName;
            dataObj.street = ME.streetAddress;
            dataObj.city = ME.propertyCity;
            dataObj.state = ME.propertyState;
            dataObj.zip = ME.propertyZip;
            if(ME.multiUnit == "Yes"){
                 dataObj.multiUnit = ME.multiUnitNumber;
            }else{
                dataObj.multiUnit = "0";
            }
           

            DB.query("putPropertyAddress", dataObj).then(function(resultObj) {
                if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                    alert("FALSE returned for putPropertyAddress >>> submitForm >>> property-new-view1-address.ctrl.js");
                } else {
                    T.lastResultID = resultObj.data.id;
                    openNotify();
                }
            }, function(error) {
                alert("ERROR returned for putPropertyAddress >>> submitForm >>> property-new-view1-address.ctrl.js");
            });
        };

        var openNotify = function() {
            var dialog = ngDialog.open({
                template: '<p>' + ME.propertyName + ' has been added as a property. You will now continue with the roof description.</p>' +
                    '<div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(1)">Close Me</button></div>',
                plain: true
            });
            dialog.closePromise.then(function(data) {
                console.log('ngDialog closed' + (data.value === 1 ? ' using the button' : '') + ' and notified by promise: ' + data.id);
                $state.transitionTo("addNewProperty.roof");
            });
        };

        ME.dataError = function() {
            ME.inputField = "ERROR";
            ME.isError = true;
            ME.inputMsg = "Submit Error.  Try again.";
        };

        ME.clearForm = function() {

        };

        ME.goNewClient = function() {
            $state.transitionTo("addNewClient");
        };

        ME.goNewProperty = function() {
            $state.transitionTo("addNewProperty");
        };

        var init = function() {
            if (ME.selectedClientObj.type == "Individual") {
                ME.propertyName = ME.selectedClientObj.name_last + " Residence";
            } else {
                ME.propertyName = "Apartment Complex Name";
            }
        };

        $scope.$watch('$viewContentLoaded', function() {
            var loggedIn = ME.S.loggedIn;
            if (!loggedIn) {
                $state.transitionTo('login');
            } else {

            }
        });

        init();

    }
]);
