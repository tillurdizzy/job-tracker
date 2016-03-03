'use strict';
var app = angular.module('MyApp', ['ui.router','ngSanitize','ngUnderscore','directive.g+signin']);

app.config(function($stateProvider, $urlRouterProvider) {
 	
 	$urlRouterProvider.otherwise("/splash");
  	
	$stateProvider
		$stateProvider
		.state('test', {
			url: "/test",
			templateUrl:"views/test/test.html"
		})

		.state('splash', {
			url: "/splash",
			templateUrl:"views/login/splash.html"
		})

		.state('login', {
			url: "/login",
			templateUrl:"views/login/login.html",
			controller:"LoginCtrl"
		})
		
		.state('jobs', {
			url: "/jobs",
			templateUrl:"views/jobs/jobs.html"
		})
		.state('jobs.details', {
			url: "/details",
			templateUrl:"views/jobs/job-details.html"
		})
		
		.state('addNewJob', {
			url: "/newjob",
			templateUrl:"views/jobs/job-new.html"
		})
		
		.state('clients', {
			url: "/clients",
			templateUrl:"views/clients/clients.html"
		})
		.state('clients.details', {
			url: "/details",
			templateUrl:"views/clients/client-details.html"
		})
		.state('addNewClient', {
			url: "/client-new",
			templateUrl:"views/clients/client-new.html"
		})

		.state('addNewClient.organization', {
			url: "/organization",
			templateUrl:"views/clients/client-new-org.html"
		})

		.state('addNewClient.individual', {
			url: "/individual",
			templateUrl:"views/clients/client-new-ind.html"
		})
		
		.state('properties', {
			url: "/properties",
			templateUrl:"views/properties/properties.html"
		})
		.state('properties.details', {
			url: "/details",
			templateUrl:"views/properties/property-details.html"
		})
		.state('addNewProperty', {
			url: "/property-new",
			templateUrl:"views/properties/property-new-view.html"
		})
		.state('addNewProperty.organization', {
			url: "/organization",
			templateUrl:"views/properties/property-new-org.html"
		})
		.state('addNewProperty.individual', {
			url: "/individual",
			templateUrl:"views/properties/property-new-ind.html"
		})
		
		.state('proposal', {
			url: "/proposal",
			templateUrl:"views/proposals/proposal.html"
		})

		.state('proposal.params', {
			url: "/params",
			templateUrl:"views/proposals/proposal-params.html"
		})

		.state('proposal.photos', {
			url: "/photos",
			templateUrl:"views/proposals/proposal-photos.html"
		})

		.state('proposal.special', {
			url: "/special",
			templateUrl:"views/proposals/proposal-special.html"
		})
		.state('proposal.submit', {
			url: "/submit",
			templateUrl:"views/proposals/proposal-submit.html"
		})

		.state('reports', {
			url: "/reports",
			templateUrl:"views/reports/reports.html"
		})

		.state('approval', {
			url: "/approval",
			templateUrl:"views/approval/approval.html"
		})

		.state('reference', {
			url: "/reference",
			templateUrl:"views/reference/reference.html"
		})

		.state('reference.roofpitch', {
			url: "/roofpitch",
			templateUrl:"views/reference/roofpitch.html"
		})
		
		
		
});	


