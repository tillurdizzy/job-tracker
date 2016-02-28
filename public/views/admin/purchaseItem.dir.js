app.directive('purchaseItem', [function() {
    return {
        restrict: 'AE',
        scope: {
            total: '@',
            multiplier: '@',
            item: '@',
            itemcode: '@',
            unit: '@',
            qty: '@',
            toggle: '&',
            change: '&'
        },
        controller: function($scope) {
            $scope.inputNum = "";
            $scope.isIncluded = false;
            $scope.qtyChange = function() {
               
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
            $scope.toggleCheckBox = function() {
                $scope.isIncluded = !$scope.isIncluded;
            }
        },
        templateUrl: 'views/admin/inventory-purchase-item.tpl.html',
        link: function(scope, elm, attrs) {}
    }
}]);