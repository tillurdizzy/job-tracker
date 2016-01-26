'use strict';
var app = angular.module('MyApp', ['ui.router','ngSanitize','smart-table']);

app.config(function($stateProvider, $urlRouterProvider) {
 	
 	$urlRouterProvider.otherwise("/login");
  	
	$stateProvider
		$stateProvider
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
		.state('jobDetails', {
			url: "/jobDetails",
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
		.state('clientForms', {
			url: "/clientForms",
			templateUrl:"views/clients/clientforms.html"
		})
		.state('clientForms.Add', {
			url: "/clientAdd",
			templateUrl:"views/clients/client-form-add.html"
		})

		.state('properties', {
			url: "/properties",
			templateUrl:"views/properties/properties.html"
		})
		.state('properties.details', {
			url: "/details",
			templateUrl:"views/properties/property-details.html"
		})

		.state('proposal', {
			url: "/proposal",
			templateUrl:"views/forms/proposal.html"
		})

		.state('reports', {
			url: "/reports",
			templateUrl:"views/reports/reports.html"
		});
		
		
		
});	

/*app.run(function($rootScope) {
    $rootScope.$on('$viewContentLoaded', function () {
        $(document).foundation();
    });
});*/


