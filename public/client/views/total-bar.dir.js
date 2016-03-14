app.directive('totalBar',[function () {
    return {
      restrict: 'E',
      scope:{
        price:'@'
      },
      templateUrl:'client/views/total-bar.tpl.html',
      link: function(scope, elm, attrs) {
      }


    }
}]);