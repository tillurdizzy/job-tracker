'use strict';

 app.controller('AmazonS3Ctrl', ["$window","serviceAWS","SharedSrvc", function ($window,serviceAWS,SharedSrvc) {
  var ME = this;
  ME.S = SharedSrvc;
  ME.AWS = serviceAWS;
  
 	ME.alerts = [];
  ME.bucketImages = ME.AWS.bucketImages;
  ME.selectedPhoto = "";
  ME.photoCategory = "";
  ME.photoCaption = "";
  ME.jobPhotos = [];

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
    ME.uploadToBucket(file);
  }

	ME.uploadToBucket = function(file) {
    serviceAWS.uploadBucketItems(file).then(function(item){
      console.log(item);
    });
  };

  ME.AWS.updateReferences();

}]);
