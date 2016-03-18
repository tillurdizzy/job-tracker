
// NOT USED
app.directive('materialsListItem',[function () {
    return {
      restrict: 'E',
      scope:{
        sort:'@',
        category:'@',
        code:'@',
        category:'@',
      },
      templateUrl:'js/directives/hrule.tpl.html',
      link: function(scope, elm, attrs) {
      }


    }
}]);