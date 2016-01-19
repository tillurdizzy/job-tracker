app.directive('horizRule',[function () {
    return {
      restrict: 'E',
      scope:{
        margintop:'@',
        marginbottom:'@'
      },
      templateUrl:'js/directives/hrule.tpl.html',
      link: function(scope, elm, attrs) {
      }


    }
}]);