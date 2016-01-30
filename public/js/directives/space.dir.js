app.directive('addSpace',[function () {
    return {
      restrict: 'E',
      scope:{
        margintop:'@',
        marginbottom:'@'
      },
      templateUrl:'js/directives/add-space.tpl.html',
      link: function(scope, elm, attrs) {
      }


    }
}]);