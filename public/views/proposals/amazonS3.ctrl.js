'use strict';

 app.controller('AmazonS3Ctrl', ["$scope","$window","serviceAWS","SharedSrvc", function ($scope,$window,serviceAWS,SharedSrvc) {
  var ME = this;
  ME.S = SharedSrvc;
  ME.AWS = serviceAWS;
  
 	ME.alerts = [];
  
  ME.selectedPhoto = null;
  ME.jobPhotos = [];

  ME.userAction = {selectFile:true,uploadFile:false};
  
  ME.resetPhotoUpload = function(){
    ME.userAction.selectFile = true;
    ME.userAction.uploadFile = false;
    ME.selectedPhoto = null;
  };

 	ME.selectImage = function(image){
 		$window.open(image.path);
 	};

 	ME.selectDoc = function(doc){
 		$window.open(doc.path);
 	};

 	ME.closeAlert = function(index) {
    ME.alerts = [];
  };

  ME.onSelectFile = function(files){
    ME.selectedPhoto = files;
    ME.userAction.selectFile = false;
    ME.userAction.uploadFile = true;
    $scope.$digest();
    serviceAWS.uploadBucketItems(ME.selectedPhoto).then(function(item){
      var x = item;
      ME.resetPhotoUpload();
    });
  };

	ME.uploadToBucket = function() {
    var dataObj = {};
    dataObj.jobID = ME.S.selectedJobObj.PRIMARY_ID;
    dataObj.url = ME.selectedPhoto[0].name;
    dataObj.category = ME.photoCategory.label;
    dataObj.caption = ME.photoCaption;
    var result =  ME.AWS.putPhotoData(dataObj).then(function(result) {
      if (result != false) { 
            
      } else {
           
      }
    }, function(error) {

    });

    serviceAWS.uploadBucketItems(ME.selectedPhoto).then(function(item){
      var x = item;
      ME.resetPhotoUpload();
    });
  };

  

  $scope.$on('aws-bucket-images', function (event, data) {
    console.log("broadcast - aws-bucket-images");
    $scope.$apply();
  });
 
  ME.AWS.updateReferences();

}]);
