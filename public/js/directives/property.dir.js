app.directive('propertyItem',[function () {
    return {
      restrict: 'A',
      scope:{
        id:'@',
        name:'@',
        address:'@',
        details:'&'
      },
      controller:function($scope){
        $scope.showDetails = function(){
          var ndx = Number($scope.id);
          $scope.details()(ndx);
        }
      },
      templateUrl:'js/directives/property.tpl.html',
      link: function(scope, elm, attrs) {
      }


    }
}]);