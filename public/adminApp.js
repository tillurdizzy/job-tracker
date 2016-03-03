'use strict';
var app = angular.module('AdminApp', ['ui.router','ngSanitize','ngUnderscore','directive.g+signin']);

app.config(function($stateProvider, $urlRouterProvider) {
 	
 	$urlRouterProvider.otherwise("/splash");
  	
	$stateProvider
		$stateProvider

		.state('login', {
			url: "/login",
			templateUrl:"views/login/admin-login.html",
			controller:"AdminLoginCtrl"
		})
		.state('login.invalid', {
			url: "/invalid",
			templateUrl:"views/login/admin-login-invalid.html"
		})
		.state('login.success', {
			url: "/success",
			templateUrl:"views/login/admin-login-success.html"
		})
		
		.state('admin', {
			url: "/admin",
			templateUrl:"views/admin/admin.html"
		})

		.state('splash', {
			url: "/splash",
			templateUrl:"views/login/splash-admin.html"
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

		.state('admin.prospectsReview', {
			url: "/prospect-review",
			templateUrl:"views/admin/admin-proposal-review.html"
		})
		.state('admin.proposalsReview', {
			url: "/proposal-review",
			templateUrl:"views/admin/admin-proposal-review.html"
		})
		.state('admin.proposalsReview.input', {
			url: "/input",
			templateUrl:"views/admin/admin-proposal-review-input.html"
		})
		.state('admin.proposalsReview.supplies', {
			url: "/supplies",
			templateUrl:"views/admin/admin-proposal-review-supplies.html"
		})
		.state('admin.proposalsReview.pricing', {
			url: "/pricing",
			templateUrl:"views/admin/admin-proposal-review-pricing.html"
		})
		.state('admin.contractsReview', {
			url: "/ontracts-review",
			templateUrl:"views/admin/admin-proposal-review.html"
		})
		.state('admin.activeReview', {
			url: "/active-review",
			templateUrl:"views/admin/admin-proposal-review.html"
		})
		.state('admin.completeReview', {
			url: "/complete-review",
			templateUrl:"views/admin/admin-proposal-review.html"
		})


		
		
});	


