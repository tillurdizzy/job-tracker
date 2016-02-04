app.directive('proposalMaterial',[function () {
    return {
      restrict: 'A',
      scope:{
        code:'@',
        item:'@',
        unit:'@',
        qty:'@',
        price:'@',
        amt:'@',
        total:'@'
      },
      templateUrl:'js/directives/proposalMaterial.tpl.html',
      link: function(scope, elm, attrs) {
      }


    }
}]);