'use strict';
app.controller('NewJobCtrl', ['$scope', '$state', 'evoDb', 'SharedSrvc', 'ngDialog', function($scope, $state, evoDb, SharedSrvc, ngDialog) {

    var DB = evoDb;
    var Me = this;
    Me.S = SharedSrvc;
    Me.inputField = "INFO";
    Me.managerName = Me.S.managerName;
    Me.clientList = Me.S.managerClients;
    Me.propertyList = Me.S.managerProperties;
    Me.propertyRoofs; // The buildings/roofs for a multiUnit property
    var numFields = 2;
    Me.inputMsg = "";
    // Form elements
    Me.S1 = Me.clientList[0];
    Me.S2 = ""; // Property
    Me.S3 = ""; // Building
    Me.status;
    Me.currentDate;

    Me.isMultiUnit = false;

    Me.submitS1 = function() {
        Me.inputMsg = "";
        Me.isError = false;
        if (Me.S1 == "") { //company/client
            Me.isError = true;
            Me.inputMsg = "This field cannot be blank.";
        } else {
            Me.filterProperties();
            Me.inputField = "S2";
            Me.inputMsg = "";
            Me.S.selectedClientObj = Me.S1;
        };
    };

    Me.goPrevious = function(_from) {
        Me.isError = false;
        Me.inputMsg = "";
        switch (_from) {
            case "S1":
                Me.inputField = "INFO";
                break;
            case "S2":
                Me.inputField = "S1";
                break;
            case "S3":
                Me.inputField = "S2";
                break;
            case "Review":
                Me.inputField = "S1";
                break;
        }
    }

    Me.submitS2 = function() {
        Me.inputMsg = "";
        Me.isError = false;

        Me.isMultiUnit = Me.returnMultiUnit();

        if (Me.isMultiUnit == true) {
            numFields = 3;
            getRoof();
            Me.inputField = "S3";
        } else {
            var isDupe = Me.S.jobExists(Me.S2.PRIMARY_ID,false);
            if (isDupe) {
                Me.isError = true;
                Me.inputMsg = "This Job already exists.";
            } else {
                Me.status = "Prospect";
                var d = new Date();
                Me.currentDate = d.valueOf();
                Me.inputField = "REVIEW";
                Me.inputMsg = "";
                Me.S.selectedPropertyObj = Me.S2;
            };
        }
    };

    Me.submitS3 = function() {
        Me.inputMsg = "";
        Me.isError = false;
        var isDupe = Me.S.jobExists(Me.S3.PRIMARY_ID,true);

        if (isDupe) {
            Me.isError = true;
            Me.inputMsg = "This Job already exists.";
        } else {
            Me.status = "Prospect";
            var d = new Date();
            Me.currentDate = d.valueOf();
            Me.inputField = "REVIEW";
            Me.inputMsg = "";
            Me.S.selectedPropertyObj = Me.S2;
        };
    };

    Me.returnMultiUnit = function() {
        for (var i = 0; i < Me.propertyList.length; i++) {
            if (Me.S2.PRIMARY_ID == Me.propertyList[i].PRIMARY_ID) {
                var num = parseInt(Me.propertyList[i].multiUnit);
                if (num > 0) {
                    return true;
                }
            }
        }
        return false;
    };

    var getRoof = function() {
        var dataObj = { propID: Me.S2.PRIMARY_ID };
        DB.query("getRoof", dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for DB.getRoof() at >>> PropertiesCtrl.getRoof()");
            } else {
                Me.propertyRoofs = resultObj.data;
                validateRoofs();
            }
        }, function(error) {
            alert("ERROR returned for DB.getRoof() at >>> PropertiesCtrl.getRoof()");
        });
    };

    var validateRoofs = function() {
        if (Me.propertyRoofs.length > 0) {
            Me.S3 = Me.propertyRoofs[0];
        } else {
            openRoofsInvalidDialog();
        }
    };

    var openRoofsInvalidDialog = function() {
        var dialog = ngDialog.open({
            template: '<p>Cannot create job. This multi-unit property does not have any buildings/roofs added to it.</p>' +
                '<div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(1)">Close</button></div>',
            plain: true
        });
        dialog.closePromise.then(function(data) {
            console.log('ngDialog closed' + (data.value === 1 ? ' using the button' : '') + ' and notified by promise: ' + data.id);
            $state.transitionTo("addNewProperty.roof");
        });
    };

    // When user selects Client, filter properties for only tha client
    Me.filterProperties = function() {
        Me.isError = false;
        Me.propertyOptions = [];
        for (var i = 0; i < Me.propertyList.length; i++) {
            if (Me.propertyList[i].client == Me.S1.PRIMARY_ID) {
                Me.propertyOptions.push(Me.propertyList[i]);
            }
        };
        if (Me.propertyOptions.length == 0) {
            ngDialog.open({
                template: '<h2>This client has no properties listed.</h2>',
                className: 'ngdialog-theme-default',
                plain: true,
                overlay: false
            });
        } else {
            Me.S2 = Me.propertyOptions[0];
            if (Me.returnMultiUnit()) {
                numFields = 3;
            }
        }
    };

    Me.selectProperty = function() {
        Me.inputMsg = "";
        Me.isError = false;
        if (Me.returnMultiUnit()) {
            numFields = 3;
        }
    };

    Me.selectRoof = function() {

    };

    Me.resetForm = function() {
        numFields = 2;
        Me.inputMsg = "";
        Me.inputField = "S1";
    };

    Me.submitForm = function() {
        Me.isError = false;
        var dataObj = {};
        dataObj.jobNumber = "";
        dataObj.manager = Me.S.managerID;
        dataObj.client = Me.S1.PRIMARY_ID;
        dataObj.property = Me.S2.PRIMARY_ID;
        dataObj.roofID = Me.S3.PRIMARY_ID;
        dataObj.status = Me.status;
        dataObj.dateProspect = Me.currentDate;
        dataObj.dateProposal = "0";
        // After successful insert, DB uses lastID to insert blank records for
        // Config, Params, SpecialConsiderations 
        DB.putJob(dataObj).then(function(resultObj) {
            if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                alert("FALSE returned for putJob >>> job-new.ctrl.js");
            } else {
                var jobID = resultObj.data.id;
                if(Me.isMultiUnit){
                    Me.inputField = "SUCCESS-MultiUnit";
                }else{
                    Me.inputField = "SUCCESS";
                }
            }
        }, function(error) {
            alert("ERROR returned for putJob >>> job-new.ctrl.js");
        });
    };

    Me.dataError = function() {

    };

    Me.goJobs = function() {
        $state.transitionTo("jobs");
    };

    Me.goNewClient = function() {
        $state.transitionTo("addNewClient");
    };

    Me.goNewProperty = function() {
        $state.transitionTo("addNewProperty");
    };

    Me.goProposal = function() {
        $state.transitionTo("proposal.params");
    };

    $scope.$watch('$viewContentLoaded', function() {
        var loggedIn = Me.S.loggedIn;
        if (!loggedIn) {
            $state.transitionTo('login');
        }
    });


}]);
