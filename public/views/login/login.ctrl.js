'use strict';
app.controller('LoginCtrl',['$scope','$state','evoDb','SharedSrvc','ShingleSrvc','ShingleCalcs','ClientSrvc','LogInSrvc','serviceAWS',
    function ($scope,$state,evoDb,SharedSrvc,ShingleSrvc,ShingleCalcs,ClientSrvc,LogInSrvc,serviceAWS) {

    // Inject all these Services so they get initiated and are ready for use later
	var DB = evoDb;
	var S = SharedSrvc;
    var C = ClientSrvc;
    var L = LogInSrvc;
     $scope.A = serviceAWS;

    $scope.submissionInvalid = false;// form is filled out correctly
    $scope.requestSuccess=false;// database query; starts out false set to true on successful query
    $scope.loginSuccess = null;// user/pword match; starts out null, set false if user entry does not match, true if does
    $scope.resultLength = 0;
    $scope.displayName="";
    $scope.loginObj={};

    var serverAvailable = true;
    $scope.dataRefreshed = false;

    $scope.continueBtn = function(){
        if( $scope.loginObj.userType == "client"){
            $state.transitionTo("approval");
        }else if($scope.loginObj.userType == "admin"){
            $state.transitionTo("admin");
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
        $scope.displayName="";
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

            //dataObj.name_user = "ssmith";
            //dataObj.pin = "1234";

            dataObj.name_user = "smartin";
            dataObj.pin = "7663";

            //dataObj.name_user = "dsheives";
            //dataObj.pin = "9954";

            if(serverAvailable == true){
                var result = DB.queryLogIn(dataObj)
                .then(function(result){
                    if(result != false){
                        // DB sets basic log in data for Shared Srvc and LogIn Srvc
                        $scope.loginObj = result[0];
                        var userType = $scope.loginObj.userType;
                        $scope.dataRefreshed = false;
                        $scope.loginSuccess=true;
                        $scope.requestSuccess = true;// this var changes the stage
                        $scope.clearForm();
                        $scope.displayName = $scope.loginObj.name_first + " " + $scope.loginObj.name_last;
                         $scope.A.initAWS(true);
                        if(userType == "client"){
                            C.LogIn($scope.loginObj);
                            $scope.getClientJob($scope.loginObj.jobID);
                        }else if(userType == "sales"){
                            $scope.getManagerJobs();
                        }else if(userType == "admin"){
                            $scope.dataRefreshed = true;
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
                $scope.displayName = "Admin Testing";
                S.setManagerID(3,"Admin Testing");
                DB.setManagerID(3);
                $scope.getManagerJobs();
            }
        }else{
            $scope.submissionInvalid = true;// triggers form errors to show 
        };
    };

    $scope.getClientJob = function(jobID){
        var dataObj = {ID:jobID}
        var result = DB.getJobByID(dataObj)
        .then(function(result){// result could be and empty array OR boolean false OR array with data
            if(typeof result != "boolean"){
                C.setData(result[0],"job");
                $scope.getClientProperty(result[0].property);
                $scope.getClientID(result[0].client);
                console.log("Successful getting CLIENT JOB! data");
            }else{
                $scope.dataError("LoginCtrl-getClientJob()-1",result); 
            }
        },function(error){
            $scope.dataError("LoginCtrl-getClientJob()-2",result);
        });
    };

    $scope.getClientProperty = function(propID){
        var dataObj = {ID:propID};
        var result = DB.getPropertyByID(dataObj)
        .then(function(result){
            if(typeof result != "boolean"){
                C.setData(result[0],"property");
                console.log("Successful getting CLIENT Property! data");
            }else{
                $scope.dataError("LoginCtrl-getClientProperty()-1",result); 
            }
        },function(error){
            $scope.dataError("LoginCtrl-getClientProperty()-2",result);
        });
    };

    $scope.getClientID = function(clientID){
        var dataObj = {ID:clientID};
        var result = DB.getClientByID(dataObj)
        .then(function(result){
            if(typeof result != "boolean"){
                $scope.dataRefreshed = true;
                C.setData(result[0],"id");
                console.log("Successful getting CLIENT ID data");
            }else{
                $scope.dataError("LoginCtrl-getClientID()-1",result); 
            }
        },function(error){
            $scope.dataError("LoginCtrl-getClientID()-2",result);
        });
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