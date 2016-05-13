'use strict';
app.controller('ClientLoginCtrl', ['$scope', '$state', 'ClientSharedSrvc', 'ClientDataSrvc',
    function($scope, $state, ClientSharedSrvc, ClientDataSrvc) {

        // Inject all these Services so they get initiated and are ready for use later
        var DB = ClientDataSrvc;
        var C = ClientSharedSrvc;

        $scope.displayName = "";
        $scope.clientObj = {};
        $scope.continueFlag = false;
        $scope.isError = false;

        $scope.continueBtn = function() {
            $state.transitionTo("review");
        };

        $scope.logOut = function() {
            $scope.displayName = "";
            C.logOut();
            DB.logOut();
            $state.transitionTo("splash");
        };

        $scope.submitLoginForm = function() {

            $scope.isError = false;
            var dataObj = new Object();
            dataObj.username = this._username;
            dataObj.PIN = this._pin;

            dataObj.username = "rode";
            dataObj.PIN = "1234";

            DB.queryDB("getClientByLogIn",dataObj).then(function(resultObj) {
                if (resultObj.result == "Error" || typeof resultObj.data === "string") {
                    alert("Query Error - see console for details");
                    console.log("getClientByLogIn ---- " + resultObj.data);
                } else {
                    if (resultObj.data.length == 0) {
                        onLogInFail();
                    } else {
                        $scope.clientObj = resultObj.data[0];
                        onLogInSuccess();
                    }
                }
            }, function(error) {
                alert("Query Error - ClientLoginCtrl >> getClientByLogIn");
            });
        };


        var onLogInSuccess = function() {
            $scope.displayName = $scope.clientObj.name_first + " " + $scope.clientObj.name_last;
            //A.initAWS($scope.googleAuthResult.id_token);
            $state.transitionTo("login.success");

            // C.LogIn also triggers pulling the Client's job(s)
            // Which will in turn pull the associated Property VO's
            // When complete broadcasts "on-client-properties-complete"
            C.LogIn($scope.displayName, $scope.clientObj);
        };

        var onLogInFail = function() {
            $scope.isError = true;
        };

        $scope.$on('on-data-collection-complete', function(event, data) {
            $scope.continueFlag = true;
        });


        $scope.$on('on-client-properties-complete', function(event, data) {

        });

        $scope.$watch('$viewContentLoaded', function() {
            //checkForLogIn();
        });


    }
]);
