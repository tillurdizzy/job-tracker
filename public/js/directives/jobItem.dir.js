app.directive('jobInputItem', [function() {
    return {
        restrict: 'A',
        scope: {
            id: '@',
            code: '@',
            item: '@',
            unit: '@',
            qty: '@',
            submit: '&'
        },
        controller: function($scope) {
            $scope.inputNum = "";
            $scope.editMode = false;
            $scope.submitEdit = function() {
                $scope.editMode = false;
                if ($scope.inputNum == "") {
                    $scope.inputNum = 0;
                }
                var userInput = Number($scope.inputNum);
                if (userInput < 0) {
                    userInput = 0;
                }
                var validate = isNaN(userInput);
                if (validate) { // input is not a number
                    userInput = 0;
                    $scope.qty = "0";
                } else {
                    var obj = {};
                    obj.itemCode = $scope.code;
                    obj.qty = userInput;
                    $scope.qty = userInput;
                    $scope.submit()(obj);
                }
                $scope.inputNum = "";
            }
            $scope.toggleEdit = function() {
                $scope.editMode = !$scope.editMode;
            }
        },
        templateUrl: 'js/directives/jobItem.tpl.html',
        link: function(scope, elm, attrs) {}
    }
}]);