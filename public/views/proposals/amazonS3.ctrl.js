'use strict';

 app.controller('AmazonS3Ctrl', ["$scope","$window","serviceAWS","SharedSrvc", function ($scope,$window,serviceAWS,SharedSrvc) {
  var ME = this;
  ME.S = SharedSrvc;
  ME.AWS = serviceAWS;
  
 	ME.alerts = [];
  
  ME.selectedPhoto = null;;
  ME.photoCategory = ME.S.photoCats[0];
  ME.photoCaption = "";
  ME.jobPhotos = [];

  ME.stepOne = true;
  ME.stepTwo = false;
  ME.stepThree = false;
  ME.stepFour = false;

  ME.selectCat = function(){
    photoFormAllFalse();
    ME.stepTwo = true;
  }
  ME.submitCaption = function(){
    photoFormAllFalse();
    ME.stepThree = true;
  }

  ME.resetPhotoUpload = function(){
    ME.stepOne = true;
    ME.stepTwo = false;
    ME.stepThree = false;
    ME.stepFour = false;
    ME.selectedPhoto = null;;
    ME.photoCategory = ME.S.photoCats[0];
    ME.photoCaption = "";
  }

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
    photoFormAllFalse();
    ME.selectedPhoto = files;
    ME.stepFour = true;
    $scope.$digest();
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

  var photoFormAllFalse = function(){
    ME.stepOne = false;
    ME.stepTwo = false;
    ME.stepThree = false;
    ME.stepFour = false;
  };

  

  $scope.$on('aws-bucket-images', function (event, data) {
    console.log("broadcast - aws-bucket-images");
    $scope.$apply();
  });
 
  ME.AWS.updateReferences();

}]);
