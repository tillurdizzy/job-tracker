'use strict';
var app = angular.module('AdminApp', ['ui.router','ngSanitize','ngUnderscore','directive.g+signin','ngDialog','ng-fusioncharts']);

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
			templateUrl:"views/admin/reps/manager-add.html"
		})
		.state('admin.managerUpdate', {
			url: "/managerUpdate",
			templateUrl:"views/admin/reps/manager-update.html"
		})
		.state('admin.pitchedInventory', {
			url: "/pitched-inventory",
			templateUrl:"views/admin/inventory/pitched-roof-materials.html"
		})
		

		.state('admin.reportJobsActive', {
			url: "/reportJobsActive",
			templateUrl:"views/admin/reports/jobs-active.html"
		})

		.state('admin.clientManagement', {
			url: "/clientManagement",
			templateUrl:"views/admin/sales/clients/admin-sales-clients.html"
		})
		.state('admin.propertyManagement', {
			url: "/propertyManagement",
			templateUrl:"views/admin/sales/properties/admin-sales-properties.html"
		})
		.state('admin.jobManagement', {
			url: "/jobManagement",
			templateUrl:"views/admin/sales/jobs/admin-sales-jobs.html"
		})

		

		//  <<<<<<<<<< Begin Jobs Review  > Proposal >>>>>>>>>>>>>
		.state('admin.proposalsReview', {
			url: "/proposal-review",
			templateUrl:"views/admin/proposal/admin-proposal-review.html"
		})
		.state('admin.proposalsReview.input', {
			url: "/input",
			templateUrl:"views/admin/proposal/admin-proposal-review-input.html"
		})
		.state('admin.proposalsReview.supplies', {
			url: "/supplies",
			templateUrl:"views/admin/proposal/admin-proposal-review-supplies.html"
		})
		.state('admin.proposalsReview.pricing', {
			url: "/pricing",
			templateUrl:"views/admin/proposal/admin-proposal-review-pricing.html"
		})
		//  <<<<<<<<<< End Jobs Review >> Proposal >>>>>>>>>>>>>

		// <<<<<<<<<<< Jobs Review >> Other than Proposal>> 
		.state('admin.prospectsReview', {
			url: "/prospect-review",
			templateUrl:"views/admin/reviews/prospects/admin-prospect-review.html"
		})
		.state('admin.contractsReview', {
			url: "/contracts-review",
			templateUrl:"views/admin/reviews/contracts/admin-contract-review.html"
		})
		.state('admin.activeReview', {
			url: "/active-review",
			templateUrl:"views/admin/reviews/active//admin-active-review.html"
		})
		.state('admin.completeReview', {
			url: "/complete-review",
			templateUrl:"views/admin/reviews/complete/admin-complete-review.html"
		})


		
		
});	


