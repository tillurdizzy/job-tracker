'use strict';
app.service('serviceAWS',['$q',function ($q){

  var self = this;
  self.config = null;
  self.uploadedURL = null;

  // S3 Bucket vars
  self.s3Obj = null;
  self.bucketImages=[];
  self.bucketDocs=[];
  var bucketUrl = "https://s3.amazonaws.com/tillurdizzy9954/";

  // DynamoDB vars
  self.dynamoObj;
  self.currentTableScan;
  self.lastAccountID;
  
  self.initAWS = function(id_token){
    AWS.config.logger = 'console';
    AWS.config.apiVersions = {s3: '2006-03-01',dynamodb: '2012-08-10'};
    AWS.config.update({accessKeyId: 'AKIAIWWAHXVHJAHPG7ZA', secretAccessKey: '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'});
   
    self.initS3();
    self.initDynamo();
  };

  self.initS3 = function(){
    AWS.config.region = 'us-east-1';// S3 Region
    self.s3Obj = new AWS.S3();
    self.getPhotoList();
    self.getDocumentList();
  };

  self.getPhotoList = function(){
    if(!angular.isDefined(self.s3Obj)){
      self.initS3();
    }
    // list objects in the 'photos' folder
    self.bucketImages=[];
    self.s3Obj.listObjects({Bucket: 'tillurdizzy9954',Prefix:'photos/'}, function(error, data) {
      if (error) {
        console.log(error);
      } else {
        var contentArray = data.Contents;
        for (var i=1; i<contentArray.length; i++){ 
          var bucketPath = contentArray[i].Key;               
          var nameOnly = bucketPath.replace(/photos\//,'');
          self.bucketImages.push({name:nameOnly,path:bucketUrl + bucketPath});
        }
      }
    });
  };

  self.getDocumentList = function(){
    if(!angular.isDefined(self.s3Obj)){
      self.initS3();
    }
    // list objects in the 'docs' folder
    self.bucketDocs=[];
    self.s3Obj.listObjects({Bucket: 'tillurdizzy9954',Prefix:'docs/'}, function(error, data) {
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
          self.bucketDocs.push({name:nameOnly,path:bucketUrl + bucketPath,icon:iconpath});
        }
      }
    });
  };

  self.uploadBucketItems = function(fileList){
    if(!angular.isDefined(self.s3Obj)){
      self.initS3();
    }
    var d = $q.defer();
    var file=fileList[0];

    // What type of file is this?
    var thisfilemime = file.type;
    var filetype = thisfilemime.replace(/\/.*/,'');
    if(filetype == 'image' || filetype == 'video'){
      var keypath = 'photos/';
    }else{
        keypath = 'docs/';
    }

    var putParams = {
      ACL: 'public-read-write',
      Bucket:'tillurdizzy9954',
      Key: keypath + file.name,
      Body: file,
      ContentType: file.type
    };
   
    self.s3Obj.putObject(putParams, function (err, data) {
      if (err) {
        console.log("PUT BUCKET OBJ ERR " + err); // an error occurred
        d.reject(err);
      }else{
        console.log("PUT BUCKET OBJ SUCCESS ");
        var getUrlParams = { Bucket:'tillurdizzy9954', Key:keypath + file.name,Expires:900*4};
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


  self.initDynamo = function() {
    AWS.config.region = 'us-west-2';// Dynamo region
    self.dynamoObj = new AWS.DynamoDB();
  };

  self.dynamo_getTable = function (tbl){
    if(!angular.isDefined(self.dynamoObj)){
      self.initDynamo();
    }
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

 

  return self;
}]);
