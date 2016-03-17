app.directive('raqdioSelection',[function () {
    return {
      restrict: 'E',
      scope:{
        price:'@',
        id:'@',
        label:'@',
        model:'@',
        group:'@',
        url:'@',
        val:'@',
        change:'&'
      },
      templateUrl:'client/views/radio-selection.tpl.html',
      link: function(scope, elm, attrs) {
      }


    }
}]);