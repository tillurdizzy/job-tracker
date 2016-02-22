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
     ME.stepTwo = true;
  }
  ME.submitCaption = function(){
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

  ME.onSelectFile = function(file){
    ME.selectedPhoto = file;
    ME.stepFour = true;
  }

	ME.uploadToBucket = function() {
    dataObj = {};
    dataObj.jobID = ME.S.selectedJobObj.PRIMARY_ID;
    dataObj.url = ME.selectedPhoto;
    dataObj.category = ME. ME.photoCategory.label;
    dataObj.caption = ME.photoCaption;
    var result =  ME.AWS.putPhotoData(dataObj).then(function(result) {
      if (result != false) { 
            
      } else {
           
      }
    }, function(error) {

    });

    serviceAWS.uploadBucketItems(ME.selectedPhoto).then(function(item){
      ME.resetPhotoUpload();
    });
  };

  $scope.$watch( ME.AWS.bucketImages ,function(newValue, oldValue){
      console.log('bucketImages Changed');
      console.log(newValue);
      console.log(oldValue);
    }
  );

  $scope.$on('aws-bucket-images', function (event, data) {
    console.log("broadcast" + data);
    $scope.$apply();
  });
 
  ME.AWS.updateReferences();

}]);
