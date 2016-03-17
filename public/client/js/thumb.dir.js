app.directive('thumb', [function() {
    return {
        restrict: 'E',
        scope: {
            path: '@',
            click: '&',
            ndx:'@'
        },
        controller: function($scope) {
            $scope.onClick = function() {
                $scope.click()($scope.ndx);
            }
        },
        templateUrl: 'client/js/thumb.tpl.html',
        link: function(scope, elm, attrs) {}
    }
}]);
