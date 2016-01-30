app.directive('materialItem',[function () {
    return {
      restrict: 'A',
      scope:{
        id:'@',
        property:'@',
        status:'@',
        details:'&'
      },
      controller:function($scope){
        $scope.showDetails = function(){
          var ndx = Number($scope.id);
          $scope.details()(ndx);
        }
      },
      templateUrl:'js/directives/job.tpl.html',
      link: function(scope, elm, attrs) {
      }


    }
}]);