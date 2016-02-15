'use strict';
var app = angular.module('MyApp', ['ui.router','ngSanitize','ngUnderscore']);

app.config(function($stateProvider, $urlRouterProvider) {
 	
 	$urlRouterProvider.otherwise("/login");
  	
	$stateProvider
		$stateProvider
		.state('test', {
			url: "/test",
			templateUrl:"views/test/test.html"
		})
		.state('login', {
			url: "/login",
			templateUrl:"views/login/login.html",
			controller:"LoginCtrl"
		})
		.state('loginadmin', {
			url: "/loginadmin",
			templateUrl:"views/login/admin-login.html",
			controller:"AdminLoginCtrl"
		})
		.state('admin', {
			url: "/admin",
			templateUrl:"views/admin/admin.html"
		})
		.state('admin.prospect', {
			url: "/prospectAdd",
			templateUrl:"views/admin/prospect-add.html"
		})
		.state('admin.managerAdd', {
			url: "/managerAdd",
			templateUrl:"views/admin/manager-add.html"
		})
		.state('admin.managerUpdate', {
			url: "/managerUpdate",
			templateUrl:"views/admin/manager-update.html"
		})
		.state('admin.inventoryAdd', {
			url: "/inventoryAdd",
			templateUrl:"views/inventory/inventory-add.html"
		})

		.state('admin.inventoryUpdate', {
			url: "/inventoryUpdate",
			templateUrl:"views/inventory/inventory-update.html"
		})

		.state('admin.reportJobsActive', {
			url: "/reportJobsActive",
			templateUrl:"views/reports/jobs-active.html"
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

		.state('reports', {
			url: "/reports",
			templateUrl:"views/reports/reports.html"
		})

		.state('approval', {
			url: "/approval",
			templateUrl:"views/approval/approval.html"
		});
		
		
		
});	


