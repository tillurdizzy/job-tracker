app.directive('totalBar',[function () {
    return {
      restrict: 'E',
      scope:{
        price:'@',
        label:'@'
      },
      templateUrl:'client/js/total-bar.tpl.html',
      link: function(scope, elm, attrs) {
      }


    }
}]);