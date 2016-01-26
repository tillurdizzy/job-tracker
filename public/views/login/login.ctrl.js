'use strict';
app.controller('LoginCtrl',['$scope','$state','evoDb','SharedSrvc',function ($scope,$state,evoDb,SharedSrvc) {

	var DB = evoDb;
	var S = SharedSrvc;

    $scope.submissionInvalid = false;// form is filled out correctly
    $scope.requestSuccess=false;// database query; starts out false set to true on successful query
    $scope.loginSuccess = null;// user/pword match; starts out null, set false if user entry does not match, true if does

    $scope.displayname="";

    var serverAvailable = true;

    $scope.continueBtn = function(){
        $state.transitionTo("jobs");
    };

    $scope.logOut = function(){
        $scope.submissionInvalid = false;
        $scope.requestSuccess=false;
        $scope.loginSuccess = null;
        $scope.displayname="";
        S.logOut();
        DB.logOut();
    };

    $scope.submitLoginForm = function(){
    	$scope.loginSuccess = null;
        $scope.requestSuccess = false;
        if(this.loginForm.$valid){
            $scope.submissionInvalid = false;
            var dataObj = new Object();
            dataObj.name_user = this._username;
            dataObj.pin = this._pin;

            dataObj.name_user = "dsheives";
            dataObj.pin = "9954";
            if(serverAvailable == true){
                var result = DB.queryLogIn(dataObj)
                .then(function(result){
                    if(result != false){
                        // DB sets Shared Srvc var for login
                        $scope.loginSuccess=true;
                        $scope.requestSuccess = true;
                        $scope.clearForm();
                        $scope.displayname = result[0].name_first + " " + result[0].name_last; 
                        $scope.getManagerJobs();
                    }else{
                        $scope.loginSuccess = false;
                    }
                   
                },function(error){
                    $scope.loginSuccess = false;
                    $scope.dataError();
                });
            }else{
                $scope.loginSuccess=true;
                $scope.requestSuccess = true;
                $scope.clearForm();
                $scope.displayname = "Admin Testing";
                S.setManagerID(3,"Admin Testing");
                DB.setManagerID(3);
                $scope.getManagerJobs();
            }
        }else{
            $scope.submissionInvalid = true;// triggers form errors to show 
        };
    };

    $scope.getManagerJobs = function(){
        var result = DB.getManagerJobs()
        .then(function(result){
            if(result != false){
                console.log("Successful getting job data");
            }else{
              ME.dataError("LoginCtrl-getManagerJobs()-1",result); 
            }
        },function(error){
            ME.dataError("LoginCtrl-getManagerJobs()-2",result);
        });
    };

    $scope.dataError = function(){

    };

    $scope.clearForm = function(){
        $scope._username="";
        $scope._pin="";
    };

    var checkForLogIn = function(){
        var login = S.loggedIn;
        if (login===true) {
            $scope.loginSuccess=true;
            $scope.requestSuccess = true;
        };
    }

    $scope.$watch('$viewContentLoaded', function() {
       checkForLogIn()
    });
	

 }]);