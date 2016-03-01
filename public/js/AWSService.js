'use strict';
app.service('serviceAWS',['$http','$q','$rootScope','SharedSrvc','LogInSrvc',function ($http,$q,$rootScope,SharedSrvc,LogInSrvc){

  var self = this;
  self.S = SharedSrvc;
  self.L = LogInSrvc;

  self.webIdCredentials = {};

  self.config = null;
  self.uploadedURL = null;

  // S3 Bucket vars
  self.s3Obj = null;
  self.bucketImages=[];
  self.bucketDocs=[];


  self.awsRegion = self.L.userVO.awsRegion;
  self.S3Region = "us-east-1";
  
  self.bucketUrl = self.S.awsBucketUrl;
  self.bucketName = self.L.userVO.name_user;
 
  // Job folder within Users S3 Bucket
  // ANY path items between the bucket and the file
  self.bucketPrefix = "";

  // DynamoDB vars
  self.dynamoObj;
  self.currentTableScan;
  self.lastAccountID;

  self.initAWS = function(GOOGLE_ACCESS_TOKEN){
    AWS.config.logger = 'console';
    AWS.config.region = 'us-east-1';
    AWS.config.region = 'us-west-2';
    AWS.config.apiVersions = {s3: '2006-03-01',dynamodb: '2012-08-10'};
    var credentials = {
      RoleArn: 'arn:aws:iam::845886544285:role/evo-id-auth',
      WebIdentityToken: GOOGLE_ACCESS_TOKEN,
      RoleSessionName: 'web-id'
    }
    self.webIdCredentials = new AWS.WebIdentityCredentials(credentials);
    AWS.config.credentials = self.webIdCredentials;
    self.s3Obj = new AWS.S3({region: self.S3Region});
    console.log("S3 Object: " + self.s3Obj);
  };

  self.updateReferences = function(){
    self.bucketName = self.L.userVO.name_user;
    self.bucketPrefix = "id_" + self.S.selectedPropertyObj.PRIMARY_ID + "/";
    self.getPhotoList();
  };

  self.getPhotoList = function(){
    // list objects in the 'photos' folder
    self.bucketImages=[];
    self.s3Obj.listObjects({Bucket: self.bucketName,Prefix:self.bucketPrefix + 'photos/'}, function(error, data) {
      if (error) {
        console.log(error);
      } else {
        var contentArray = data.Contents;
        for (var i=1; i<contentArray.length; i++){ 
          var bucketPath = contentArray[i].Key;  
          var url =  self.bucketUrl + self.bucketName +  "/" + bucketPath;
          self.bucketImages.push({section:"",caption:"",path:url});
        }
         $rootScope.$broadcast("aws-bucket-images");
      }
    });
  };

  self.getDocumentList = function(){
    
    // list objects in the 'docs' folder
    self.bucketDocs=[];
    self.s3Obj.listObjects({Bucket: self.bucketName,Prefix:self.bucketPrefix + 'docs/'}, function(error, data) {
      if (error) {
        console.log(error);
      } else {
        var contentArray = data.Contents;
        for (var i=1; i<contentArray.length; i++){
          var bucketPath = contentArray[i].Key;
          var nameOnly = bucketPath.replace(/docs\//,'');
          var regex = new RegExp(/\.\w{3,4}$/);
          var filetype = regex.exec(nameOnly);
          var iconpath = 'images/document-icon.png';
          switch(filetype[0]){
            case '.doc': iconpath = 'images/word-icon.png';break;
            case '.docx': iconpath = 'images/word-icon.png';break;
            case '.pdf': iconpath = 'images/pdf-icon.png';break;
            case '.xls': iconpath = 'images/excel-icon.png';break;
            case '.xlsx': iconpath = 'images/excel-icon.png';break;
          }
          self.bucketDocs.push({name:nameOnly,path:self.bucketUrl + bucketPath,icon:iconpath});
        }
      }
    });
  };

  self.uploadBucketItems = function(fileList){
    var d = $q.defer();
    var file=fileList[0];
    // What type of file is this?
    var thisfilemime = file.type;
    var filetype = thisfilemime.replace(/\/.*/,'');
    if(filetype == 'image' || filetype == 'video'){
      var prefix = self.bucketPrefix + 'photos/';
    }else{
      prefix = self.bucketPrefix + 'docs/';
    }

    var putParams = {
      ACL: 'public-read-write',
      Bucket:self.bucketName,
      Key: prefix + file.name,
      Body: file,
      ContentType: file.type
    };
   
    self.s3Obj.putObject(putParams, function (err, data) {
      if (err) {
        console.log("PUT BUCKET OBJ ERR " + err); // an error occurred
        d.reject(err);
      }else{
        console.log("PUT BUCKET OBJ SUCCESS ");
        var getUrlParams = { Bucket:self.bucketName, Key:prefix + file.name,Expires:900*4};
        self.s3Obj.getSignedUrl('getObject',getUrlParams, function(err,url){
          if(!err){
            self.uploadedURL = url;
            console.log(self.uploadedURL);
            self.getPhotoList();
            self.getDocumentList();
          }
        })
        d.resolve(data);
      }
    });
    return d.promise;
  };


  

  self.dynamo_getTable = function (tbl){
    
    var d = $q.defer();
         
    self.dynamoObj.scan({TableName: tbl}, function (err, data) {
      if (err) {
        d.reject(err);
      }else{
        self.currentTableScan = data;
        console.log("GET TABLE tbl " + data);
        if(tbl == "MyAccounts"){
          self.getGreatestID();
        }
        d.resolve(data);
      }
    });
    return d.promise;
  };

  self.getGreatestID = function(){
    var tableItems =  self.currentTableScan.Items;
    var idArray = [];
    for (var i = 0; i < tableItems.length; i++) {
      idArray.push(tableItems[i].PRIMARY_ID.N);
    };
    var sorted =  _.sortBy(idArray,function(num){return num});
    self.lastAccountID = _.last(sorted);
  }

  self.putPhotoData = function(dataObj){
    dataObj.manager = self.managerID;
    var deferred = $q.defer();
    $http({method: 'POST', url: 'views/proposals/http/putPhoto.php',data:dataObj}).
    success(function(data, status, headers, config) {
        deferred.resolve(data);
      }).
      error(function(data, status, headers, config) {
      deferred.reject(data);
      });
      return deferred.promise;
  };

  self.updateUser = function(userDataObj){
     var params = {
      TableName:'UserLogin',
      Key:{'Email':{S:userDataObj.Email}},
      AttributeUpdates:{
        'Name': {Action: 'PUT', Value: {S: userDataObj.Name}},
        'UserName': {Action: 'PUT', Value: {S: userDataObj.UserName}}
      },
      ReturnValues:'ALL_NEW'
    };

    var d = $q.defer();
    self.dynamoObj.updateItem(params, function(err,data){
      if (err) {
        console.log('updateUser ERR' + err);
        d.reject(err);
      }else{ 
        console.log('updateUser Success' + data); 
        d.resolve(data);
      }
    });
    return d.promise;
  };

   self.addNewAccount = function(DataObj){
    self.lastAccountID++;

    var params = {
      TableName:'MyAccounts',
      Item:{
        'PRIMARY_ID':{N:self.lastAccountID.toString()},
        'NAME':{S: DataObj.NAME},
        'USER':{S: DataObj.USER},
        'PWORD':{S: DataObj.PWORD},
        'PIN': {S: DataObj.PIN},
        'NUM': {S: DataObj.NUM},
        'PHONE': {S: DataObj.PHONE}
      },
      ReturnValues:'ALL_OLD'
    };

    var d = $q.defer();
    self.dynamoObj.putItem(params, function(err,data){
      if (err) {
        console.log('addAccount ERR' + err);
        d.reject(err);
      }else{ 
        console.log('addAccount Success' + data); 
        d.resolve(data);
      }
    });
    return d.promise;
  };

  self.returnPhotoBucket = function(){
    console.log("returnPhotoBucket = " + self.bucketImages.length)
    return self.bucketImages;
  }

 

  return self;
}]);
