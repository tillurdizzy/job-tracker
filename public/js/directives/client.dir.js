app.directive('clientItem',[function () {
    return {
      restrict: 'A',
      scope:{
        id:'@',
        company:'@',
        contact:'@',
        details:'&'
      },
      controller:function($scope){
        $scope.showDetails = function(){
          var ndx = Number($scope.id);
          $scope.details()(ndx);
        }
      },
      templateUrl:'js/directives/client.tpl.html',
      link: function(scope, elm, attrs) {
      }


    }
}]);