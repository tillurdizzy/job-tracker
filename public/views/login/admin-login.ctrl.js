'use strict';
app.controller('AdminLoginCtrl',['$scope','$state','AdminDataSrvc','SharedSrvc','ShingleSrvc','ShingleCalcs','LogInSrvc','serviceAWS',
    function ($scope,$state,AdminDataSrvc,SharedSrvc,ShingleSrvc,ShingleCalcs,LogInSrvc,serviceAWS) {

    // Inject all these Services so they get initiated and are ready for use later
    var DB = AdminDataSrvc;
    var S = SharedSrvc;
    var L = LogInSrvc;
    var A = serviceAWS;

    $scope.displayName="";
    $scope.loginObj={};
    $scope.googleAuthResult = {};
    $scope.googleReturnEvent = {};
    $scope.googlePerson = {};
    $scope.credentialsInvalid = false;
    
    $scope.$on('event:google-plus-signin-success', function (event, authResult) {
        $scope.googleAuthResult = authResult;
        $scope.googleReturnEvent = event;
        makeApiCall();
    });

    $scope.$on('event:google-plus-signin-failure', function (event, authResult) {
        console.log('Not signed into Google Plus.');
    });

    var makeApiCall = function(){
        gapi.client.load('plus', 'v1').then(function() {
          // Step 5: Assemble the API request
          var request = gapi.client.plus.people.get({
            'userId': 'me'
          });
          // Step 6: Execute the API request
          request.then(function(resp) {
           $scope.googlePerson = resp.result;
           verifyGoogleSignIn();
          }, function(reason) {
            console.log('Error: ' + reason.result.error.message);
          });
        });
    }

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

    var verifyGoogleSignIn = function(){
        var dataObj = new Object();
        dataObj.googleID = $scope.googlePerson.id;
        var result = DB.queryLogInGoogle(dataObj).then(function(result){
            if(result != false){
                // DB sets basic log in data for Shared Srvc and LogIn Srvc
                $scope.loginObj = result[0];
                onLogInSuccess();
            }else{
                $state.transitionTo("login.invalid");
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
        S.keyValues = DB.getIdValues();
        var login = S.loggedIn;
        $scope.dataRefreshed = S.dataRefreshed;
        if (login===true) {
            $scope.loginSuccess=true;
            $scope.requestSuccess = true;
            $scope.displayName=S.managerName;
        };
    };

    $scope.$watch('$viewContentLoaded', function() {
       checkForLogIn();
    });
    

 }]);