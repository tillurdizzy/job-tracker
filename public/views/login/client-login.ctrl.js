'use strict';
app.controller('ClientLoginCtrl',['$scope','$state','ClientDataSrvc','ClientSharedSrvc','LogInSrvc','serviceAWS',
    function ($scope,$state,ClientDataSrvc,ClientSharedSrvc,LogInSrvc,serviceAWS,JobDataSrvc) {

    // Inject all these Services so they get initiated and are ready for use later
    var DB = ClientDataSrvc;
    var S = ClientSharedSrvc;
    var L = LogInSrvc;
    var A = serviceAWS;
    var J = JobDataSrvc;

    $scope.displayName="";
    $scope.loginObj={};
   
    $scope.credentialsInvalid = false;
   

    $scope.continueBtn = function(){
        $state.transitionTo("admin");
    };

    $scope.logOut = function(){
        $scope.displayName="";
        S.logOut();
        L.logOut();
        DB.logOut();
        $state.transitionTo("splash");
    };

    // Depracated log in form before google - still use during production
    $scope.submitLoginForm = function(){
        $scope.loginSuccess = null;
        $scope.requestSuccess = false;
        $scope.submissionInvalid = false;

        var dataObj = new Object();
        dataObj.name_user = this._username;
        dataObj.pin = this._pin;

        dataObj.name_user = "smartin";
        dataObj.pin = "7663";

        var result = DB.clientLogIn(dataObj).then(function(result){
            if(result != false){
                // DB sets basic log in data for Shared Srvc and LogIn Srvc
                $scope.loginObj = result[0];
                onLogInSuccess();
            }else{
                $scope.loginSuccess = false;
            }
        },function(error){
                $scope.loginSuccess = false;
                $scope.dataError();
            });
    };


    var onLogInSuccess = function(){
        var userType = $scope.loginObj.userType;
        $scope.displayName = $scope.loginObj.name_first + " " + $scope.loginObj.name_last;
        if(userType == "admin"){
            A.initAWS($scope.googleAuthResult.id_token);
            $state.transitionTo("login.success");
        }else{
            $state.transitionTo("login.invalid");
        }
    };

    $scope.dataError = function(){

    };

    var checkForLogIn = function(){
       
        var login = S.loggedIn;
        $scope.dataRefreshed = S.dataRefreshed;
        if (login===true) {
            $scope.loginSuccess=true;
            $scope.requestSuccess = true;
            $scope.displayName=S.clientName;
        };
    };

    $scope.$watch('$viewContentLoaded', function() {
       checkForLogIn();
    });
    

 }]);