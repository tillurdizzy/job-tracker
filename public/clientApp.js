'use strict';
var app = angular.module('ClientApp', ['ui.router','ngSanitize','ngUnderscore','directive.g+signin']);

app.config(function($stateProvider, $urlRouterProvider) {
 	
 	$urlRouterProvider.otherwise("/splash");
  	
	$stateProvider
		$stateProvider

		.state('login', {
			url: "/login",
			templateUrl:"views/login/client-login.html",
			controller:"ClientLoginCtrl"
		})
		.state('login.invalid', {
			url: "/invalid",
			templateUrl:"views/login/admin-login-invalid.html"
		})
		.state('login.success', {
			url: "/success",
			templateUrl:"views/login/admin-login-success.html"
		})
		
		.state('splash', {
			url: "/splash",
			templateUrl:"views/login/splash-client.html"
		})
		
		
		
});	


