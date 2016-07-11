'use strict';
var app = angular.module('AdminApp', ['ui.router','ngSanitize','ngUnderscore','directive.g+signin','ngDialog','ng-fusioncharts']);

app.run(function($rootScope) {
  $rootScope.addExceptionAlert = function(exceptionObj) {
        alert("$exceptionHandler :: \n" + exceptionObj.message + " : \n" + exceptionObj.reason);
    };
});

app.config(function($stateProvider, $urlRouterProvider,$provide) {
 	
 	$provide.decorator("$exceptionHandler", function ($delegate, $injector) {
        return function (exception, cause) {
            var $rootScope = $injector.get("$rootScope");
            $rootScope.addExceptionAlert({message: "Exception", reason: exception});
            $delegate(exception, cause);
        };
    });

 	$urlRouterProvider.otherwise("/splash");
  	
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

		//////////////////////////////////////////////////////////// Inventory
		.state('admin.pitchedInventory', {
			url: "/pitched-inventory",
			templateUrl:"views/admin/inventory/pitched-roof-materials.html"
		})

		.state('admin.pitchedInventory.addItem', {
			url: "/add-item",
			templateUrl:"views/admin/inventory/pitched-roof-add-item.html"
		})
		.state('admin.pitchedInventory.updateItem', {
			url: "/update-item",
			templateUrl:"views/admin/inventory/pitched-roof-update-item.html"
		})
		.state('admin.pitchedInventory.updatePrice', {
			url: "/update-price",
			templateUrl:"views/admin/inventory/pitched-roof-update-price.html"
		})
		.state('admin.pitchedInventory.removeItem', {
			url: "/remove-item",
			templateUrl:"views/admin/inventory/pitched-roof-remove-item.html"
		})

		.state('admin.colorInventory', {
			url: "/pitched-inventory",
			templateUrl:"views/admin/inventory/pitched-roof-colors.html"
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
		.state('admin.propertyManagement.add', {
			url: "/propertyManagement-add",
			templateUrl:"views/admin/sales/properties/add/add-property.html"
		})
		.state('admin.propertyManagement.update', {
			url: "/propertyManagement-update",
			templateUrl:"views/admin/sales/properties/update/update-property.html"
		})
		.state('admin.propertyManagement.remove', {
			url: "/propertyManagement-remove",
			templateUrl:"views/admin/sales/properties/remove/remove-property.html"
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
		.state('admin.proposalsReview.materials', {
			url: "/materials",
			templateUrl:"views/admin/proposal/admin-proposal-review-materials.html"
		})
		.state('admin.proposalsReview.design', {
			url: "/design",
			templateUrl:"views/admin/proposal/admin-proposal-review-design.html"
		})
		.state('admin.proposalsReview.labor', {
			url: "/labor",
			templateUrl:"views/admin/proposal/admin-proposal-review-labor.html"
		})
		.state('admin.proposalsReview.summary', {
			url: "/summary",
			templateUrl:"views/admin/proposal/admin-proposal-review-summary.html"
		})
		.state('admin.proposalsReview.contract', {
			url: "/contract",
			templateUrl:"views/admin/proposal/admin-proposal-review-contract.html"
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

		.state('admin.reportTables', {
			url: "/reports-tables",
			templateUrl:"views/admin/reports/tables.html"

		})
});	


app.config(['ngDialogProvider', function(ngDialogProvider) {
    ngDialogProvider.setDefaults({
        showClose: true,
        closeByDocument: true,
        closeByEscape: true
    });
}]);


