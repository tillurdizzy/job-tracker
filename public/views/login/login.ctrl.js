'use strict';
app.controller('LoginCtrl',['$scope','$state','evoDb','SharedSrvc','ShingleSrvc','ShingleCalcs','ClientSrvc','LogInSrvc','serviceAWS',
    function ($scope,$state,evoDb,SharedSrvc,ShingleSrvc,ShingleCalcs,ClientSrvc,LogInSrvc,serviceAWS) {

    // Inject all these Services so they get initiated and are ready for use later
	var DB = evoDb;
	var S = SharedSrvc;
    var C = ClientSrvc;
    var L = LogInSrvc;
    var A = serviceAWS;

    $scope.submissionInvalid = false;// form is filled out correctly
    $scope.requestSuccess=false;// database query; starts out false set to true on successful query
    $scope.loginSuccess = null;// user/pword match; starts out null, set false if user entry does not match, true if does
    $scope.resultLength = 0;
    $scope.displayName="";
    $scope.loginObj={};
    $scope.googleAuthResult = {};
    $scope.googleReturnEvent = {};
    $scope.googlePerson = {};
    $scope.AWSSTS = {};

    var serverAvailable = true;
    $scope.dataRefreshed = false;

    $scope.$on('event:google-plus-signin-success', function (event, authResult) {
        $scope.googleAuthResult = authResult;
        $scope.googleReturnEvent = event;
        makeApiCall();
    });
    $scope.$on('event:google-plus-signin-failure', function (event, authResult) {
          // User has not authorized the G+ App!
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

    var verifyGoogleSignIn = function(){
        var dataObj = new Object();
        dataObj.googleID = $scope.googlePerson.id;
        var result = DB.queryLogInGoogle(dataObj).then(function(result){
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
    }

    // Depracated log in form before google - still use during production
    $scope.submitLoginForm = function(){
    	$scope.loginSuccess = null;
        $scope.requestSuccess = false;
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

        var result = DB.queryLogIn(dataObj).then(function(result){
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
        $scope.dataRefreshed = false;
        $scope.loginSuccess=true;
        $scope.requestSuccess = true;// this var changes the stage
        $scope.clearForm();
        $scope.displayName = $scope.loginObj.name_first + " " + $scope.loginObj.name_last;
        
        if(userType == "client"){
            C.LogIn($scope.loginObj);
            $scope.getClientJob($scope.loginObj.jobID);
        }else if(userType == "sales"){
            $scope.getManagerJobs();
        }else if(userType == "admin"){
            $scope.dataRefreshed = true;
        }else{

        }
        //var sts = new AWS.STS();
        // Get amazon credentials
        /*var params = {
          RoleArn: 'arn:aws:iam::845886544285:role/evo-id-auth',
          RoleSessionName: $scope.loginObj.name_user,
          WebIdentityToken: $scope.googleAuthResult.id_token
        };*/

        A.initAWS($scope.googleAuthResult.id_token);
        
        /*sts.assumeRoleWithWebIdentity(params, function(err, data) {
            if(err){
                console.log(err, err.stack); // an error occurred
            }else{
               $scope.AWSSTS = data;
               // Configure AWS
               A.initAWS($scope.AWSSTS);
            }
        });*/
    }

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