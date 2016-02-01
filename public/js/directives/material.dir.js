app.directive('materialItem',[function () {
    return {
      restrict: 'A',
      scope:{
        id:'@',
        code:'@',
        item:'@',
        qty:'@',
        price:'@',
        unit:'@',
        submit:'&'
      },
      controller:function($scope){
        $scope.inputNum;
        $scope.showAdd=false;
        $scope.showInfo=false;

        $scope.openAdd = function(){
          $scope.showAdd=true;
          $scope.showInfo=false;
        }

        $scope.openInfo = function(){
          $scope.showAdd=false;
          $scope.showInfo=true;
        }
        $scope.close = function(){
          $scope.showAdd=false;
          $scope.showInfo=false;
        }

        $scope.submitEdit = function(){
          var num = Number($scope.inputNum);
          $scope.submit()(num,code);
        }
      },
      templateUrl:'js/directives/material.tpl.html',
      link: function(scope, elm, attrs) {
      }


    }
}]);