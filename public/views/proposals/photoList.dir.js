app.directive('photoList',[function () {
    return {
      restrict: 'AE',
      scope:{
        url:'@',
        caption:'@',
        category:'@'
      },
      
      templateUrl:'views/proposals/photoListThumbs.tpl.html',
      link: function(scope, elm, attrs) {
      }


    }
}]);