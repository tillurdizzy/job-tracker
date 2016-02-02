app.directive('jobInputItem',[function () {
    return {
      restrict: 'A',
      scope:{
        id:'@',
        code:'@',
        item:'@',
        unit:'@',
        qty:'@',
        submit:'&'
      },
      controller:function($scope){
        $scope.inputNum = 0;
        
        $scope.submit = function(){
          var obj = {};
          obj.code =  $scope.code;
          obj.qty = $scope.inputNum;
          scope.qty = Number(scope.qty) + Number($scope.inputNum);
          $scope.submit()(obj);
        }
      },
      templateUrl:'js/directives/jobItem.tpl.html',
      link: function(scope, elm, attrs) {
      }


    }
}]);