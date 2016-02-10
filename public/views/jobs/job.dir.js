app.directive('jobItem',[function () {
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
      templateUrl:'views/jobs/job.tpl.html',
      link: function(scope, elm, attrs) {
      }


    }
}]);