'use strict';
var app = angular.module('MyApp', ['ui.router','ngSanitize']);

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
		.state('edit', {
			url: "/edit",
			templateUrl:"views/jobs/edit.html"
		})
		.state('edit.status', {
			url: "/status",
			templateUrl:"views/jobs/edit-status.html"
		})

		.state('edit.details', {
			url: "/details",
			templateUrl:"views/jobs/edit-details.html"
		})

		.state('edit.proposalShingle', {
			url: "/proposalshingle",
			templateUrl:"views/jobs/proposal/proposal-shingle.html"
		})

		.state('newjob', {
			url: "/newjob",
			templateUrl:"views/jobs/prospect-form.html"
		})

		.state('clients', {
			url: "/clients",
			templateUrl:"views/clients/clients.html"
		})

		.state('properties', {
			url: "/properties",
			templateUrl:"views/properties/properties.html"
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


