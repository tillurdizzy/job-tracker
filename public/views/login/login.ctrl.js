'use strict';
app.controller('LoginCtrl',['$scope','$state','$element','evoDb',function ($scope,$state,$element,evoDb) {

	var DB = evoDb;
	
    $scope.submissionInvalid = false;// form is filled out correctly
    $scope.requestSuccess=false;// database query; starts out false set to true on successful query
    $scope.loginSuccess = null;// user/pword match; starts out null, set false if user entry does not match, true if does

    $scope.displayname="";

    $element.bind("keydown keypress", function (event) {
        console.log('keypress', event, event.which);
        if(event.which === 38) { // up
            $scope.submitLoginForm();
        } else if (event.which === 40) { // down
        } else {
            return;
        }
        event.preventDefault();
    });

    $scope.continueBtn = function(){
        $state.transitionTo("jobs");
    }

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

            var result = DB.queryLogIn(dataObj)
                .then(function(result){
                    if(result != false){
                        $scope.loginSuccess=true;
                        $scope.requestSuccess = true;
                        $scope.clearForm();
                        $scope.displayname = result[0].name_first + " " + result[0].name_last; 
                    }else{
                        $scope.loginSuccess = false;
                    }
                   
                },function(error){
                    $scope.loginSuccess = false;
                    $scope.dataError();
                });
        }else{
            $scope.submissionInvalid = true;// triggers form errors to show 
        };
    };

    $scope.dataError = function(){

    };

    $scope.clearForm = function(){
        $scope._username="";
        $scope._pin="";
    };
	

 }]);