'use strict';
app.controller('LoginCtrl',['$scope','$state','evoDb','SharedSrvc','ShingleSrvc','ShingleCalcs','ClientSrvc','LogInSrvc',
    function ($scope,$state,evoDb,SharedSrvc,ShingleSrvc,ShingleCalcs,ClientSrvc,LogInSrvc) {

	var DB = evoDb;
	var S = SharedSrvc;
    var C = ClientSrvc;
    var L = LogInSrvc;

    $scope.submissionInvalid = false;// form is filled out correctly
    $scope.requestSuccess=false;// database query; starts out false set to true on successful query
    $scope.loginSuccess = null;// user/pword match; starts out null, set false if user entry does not match, true if does
    $scope.resultLength = 0;
    $scope.displayname="";
    $scope.loginObj;

    var serverAvailable = true;
    $scope.dataRefreshed = false;

    $scope.continueBtn = function(){
        if( $scope.loginObj.userType == "client"){
            $state.transitionTo("contract");
        }else{
           if($scope.resultLength == 0){
                $state.transitionTo("clients");
            }else{
                $state.transitionTo("jobs");
            } 
        }
    };

    $scope.logOut = function(){
        $scope.submissionInvalid = false;
        $scope.requestSuccess=false;
        $scope.loginSuccess = null;
        $scope.displayname="";
        S.logOut();
        L.logOut();
        DB.logOut();
    };

    $scope.submitLoginForm = function(){
    	$scope.loginSuccess = null;
        $scope.requestSuccess = false;
        if(true){
        /*if(this.loginForm.$valid){*/
            $scope.submissionInvalid = false;
            var dataObj = new Object();
            dataObj.name_user = this._username;
            dataObj.pin = this._pin;

            dataObj.name_user = "smartin";
            dataObj.pin = "7663";

            if(serverAvailable == true){
                var result = DB.queryLogIn(dataObj)
                .then(function(result){
                    if(result != false){
                        // DB sets Shared Srvc var for login
                        $scope.loginObj = result[0];
                        L.setUser(result[0]);
                        var userType = $scope.loginObj.userType;
                        $scope.dataRefreshed = false;// control display of spinning icon
                        $scope.loginSuccess=true;
                        $scope.requestSuccess = true;// this var changes the stage
                        $scope.clearForm();
                        $scope.displayname = $scope.loginObj.name_first + " " + $scope.loginObj.name_last;
                        if(userType == "client"){
                            
                        }else if(userType == "sales"){
                            $scope.getManagerJobs();
                        }else if(userType == "admin"){
                             $scope.getManagerJobs();
                        }else{

                        }
                       
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
        .then(function(result){// result could be and empty array OR boolean false OR array with data
            if(typeof result != "boolean"){
                $scope.dataRefreshed = true;
                $scope.resultLength = result.length;
                console.log("Successful getting job data");
            }else{
                $scope.dataError("LoginCtrl-getManagerJobs()-1",result); 
            }
        },function(error){
            $scope.dataError("LoginCtrl-getManagerJobs()-2",result);
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
        $scope.dataRefreshed = S.dataRefreshed;
        if (login===true) {
            $scope.loginSuccess=true;
            $scope.requestSuccess = true;
            $scope.displayname=S.managerName;
        };
    };

    $scope.$watch('$viewContentLoaded', function() {
       checkForLogIn();
    });
	

 }]);