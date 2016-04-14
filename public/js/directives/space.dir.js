app.directive('addSpace',[function () {
    return {
      restrict: 'E',
      scope:{
        margintop:'@',
        marginbottom:'@',
        heightpx:'@'
      },
      templateUrl:'js/directives/add-space.tpl.html'
    }
}]);