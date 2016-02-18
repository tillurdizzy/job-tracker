'use strict';


app.controller('ProposalMenuCtrl',['$scope','$rootScope','$location', function ($scope,$rootScope,$location) {

    $scope.isCurrentPath = function (path) {
        var x = $location.path();
        return $location.path() == path;
    };
 }]);