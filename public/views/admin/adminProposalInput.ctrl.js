'use strict';

app.controller('AdminPropInput',['$state','$scope','AdminSharedSrvc','AdminDataSrvc',function ($state,$scope,AdminSharedSrvc,AdminDataSrvc) {

	var ME = this;
	var S = AdminSharedSrvc;
	var DB = AdminDataSrvc;


	ME.propertyInputParams = {};

	$scope.$on('onRefreshParamsData', function(event, obj) {
		ME.propertyInputParams = obj;
    })
	

 }]);