app.directive('jobInputItem',[function () {
    return {
      restrict: 'A',
      scope:{
        id:'@',
        code:'@',
        item:'@',
        unit:'@',
        qty:'@',
        submit:'&'
      },
      controller:function($scope){
        $scope.inputNum = "";
        $scope.editMode = false;

        $scope.submitEdit = function(){
          $scope.editMode = false;
          var userInput = $scope.inputNum;
          var validate = isNaN(Number($scope.inputNum));
          if(validate){// input is not a number
            userInput = "0";
            $scope.inputNum = "0";
          }else{
            var obj = {};
            obj.itemCode =  $scope.code;
            obj.qty = userInput;
            $scope.qty = userInput;
            $scope.submit()(obj);
          }
        }



        $scope.toggleEdit = function(){
          $scope.editMode = !$scope.editMode;
        }
      },
      templateUrl:'js/directives/jobItem.tpl.html',
      link: function(scope, elm, attrs) {
      }


    }
}]);