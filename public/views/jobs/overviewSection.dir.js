app.directive('overviewSection',['SharedSrvc', function (SharedSrvc) {
    return {
      restrict: 'E',
      scope:{
        title:'@',
        status:'@',
        edit:'&'
      },
      templateUrl:'views/home/home.overview.tpl.html',
      link: function(scope, elm, attrs) {
        scope.myData = [];
        var S = SharedSrvc;
        function getDataFromShared(){
          switch(scope.status){
            case "0":scope.myData = S.status_0;break;
            case "1":scope.myData = S.status_1;break;
            case "2":scope.myData = S.status_2;break;
            case "3":scope.myData = S.status_3;break;
            case "4":scope.myData = S.status_4;break;
          }
          
        };
        getDataFromShared();
      },
      controller:function($scope){
        $scope.editJob = function(n){
          $scope.edit({ndx:n});
        };
      }
    }
}]);