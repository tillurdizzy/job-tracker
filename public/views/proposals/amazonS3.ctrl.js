'use strict';

 app.controller('AmazonS3Ctrl', ["$window","serviceAWS","SharedSrvc", function ($window,serviceAWS,SharedSrvc) {
  var ME = this;
  ME.S = SharedSrvc;
  ME.AWS = serviceAWS;
  
 	ME.alerts = [];
  ME.uploadResult = [];
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

  }

	ME.onFile = function(fileList) {
    serviceAWS.uploadBucketItems(fileList).then(function(item){
      ME.uploadResult.push(serviceAWS.uploadedURL);
    });
  };

}]);
