'use strict';
require('angular')
var app = angular.module('ClientApp', ['ui.router', 'ngSanitize', 'ngUnderscore', 'ngDialog']);

app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/splash");

    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "views/login/client-login.html",
            controller: "ClientLoginCtrl"
        })
        .state('login.invalid', {
            url: "/invalid",
            templateUrl: "views/login/client-login-invalid.html"
        })
        .state('login.success', {
            url: "/success",
            templateUrl: "views/login/client-login-success.html"
        })
        .state('splash', {
            url: "/splash",
            templateUrl: "views/login/splash-client.html"
        })
        .state('review', {
            url: "/review",
            templateUrl: "client/views/review.html"
        })
        .state('approval', {
            url: "/approval",
            templateUrl: "client/views/approval.html"
        });

});

app.config(['ngDialogProvider', function(ngDialogProvider) {
    ngDialogProvider.setDefaults({
        showClose: true,
        closeByDocument: true,
        closeByEscape: true
    });
}]);
