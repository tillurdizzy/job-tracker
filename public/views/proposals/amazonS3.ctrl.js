'use strict';

 app.controller('AmazonS3Ctrl', ["$window","serviceAWS", function ($scope,$window,serviceAWS) {
  var ME = this;
  ME.Bucket = serviceAWS;
  ME.currentView = 'grid'; // 'list'  || 'grid'
  ME.currentFolder = 'images';// 'images' || 'docs'
 	ME.alerts = [];

 	ME.listPhotos = function(){	
 		ME.currentFolder = 'images';
    ME.uploadResult='';
 		ME.alerts = [];
 	};

 	ME.listDocs = function(){
 		ME.currentFolder = 'docs';
    ME.uploadResult='';
 		ME.alerts = [];
 	};

  ME.showView = function(v){
     ME.currentView = v;
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

	ME.onFile = function(fileList) {
    serviceAWS.uploadBucketItems(fileList).then(function(item){
      ME.uploadResult = serviceAWS.uploadedURL;
    });
  };

}]);
