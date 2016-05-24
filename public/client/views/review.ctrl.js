'use strict';

app.controller('ReviewCtrl',['$scope','$state','ClientSharedSrvc','ngDialog','$controller','JobConfigSrvc',function ($scope,$state,ClientSharedSrvc,ngDialog,$controller,JobConfigSrvc) {
	
	var ME = this;
	var CONFIG = JobConfigSrvc;
	// Selections and pricing specific to a job
    ME.jobConfig = [];
    var jobParams = {};
	
	ME.C = ClientSharedSrvc;
	ME.UpgradeRidgeCaps = {};
	ME.UpgradeDripEdge = {};
	ME.baseLineTotal = ME.C.baseLineTotal;
	ME.grandTotal = ME.baseLineTotal;
	ME.imagePath = "client/img/";
	ME.selectedPhoto = {path:"",cap:""};
	ME.shingleManufacturer = "GAF";


	// These are to control the ng-show DOM elements
	ME.UpgradeFieldNdx = "";
	ME.UpgradeRidgeNdx = "";
	ME.UpgradeValleyNdx = "";
	ME.UpgradeTrimNdx = "";

	ME.showUpgrades = {field:true,ridge:false,valley:false,trim:false};

	ME.calculateTotal = function(){

		var fieldprofitMargin = 0;
		var ridgeprofitMargin = 0;
		var valleyprofitMargin = 0;
		var trimprofitMargin = 0;

		for (var i = 0; i < ME.shingleUpgrades.length; i++) {
			if(ME.shingleUpgrades[i].Code === ME.UpgradeFieldNdx){
				fieldprofitMargin = Number(ME.shingleUpgrades[i].upgradePrice);
				break;
			}
		};

		for (var i = 0; i < ME.ridgeUpgrades.length; i++) {
			if(ME.ridgeUpgrades[i].Code === ME.UpgradeRidgeNdx){
				ridgeprofitMargin = Number(ME.ridgeUpgrades[i].upgradePrice);
				break;
			}
		};

		for (var i = 0; i < ME.valleyUpgrades.length; i++) {
			if(ME.valleyUpgrades[i].Code === ME.UpgradeValleyNdx){
				valleyprofitMargin = Number(ME.valleyUpgrades[i].upgradePrice);
				break;
			}
		};

		for (var i = 0; i < ME.trimUpgrades.length; i++) {
			if(ME.trimUpgrades[i].Code === ME.UpgradeTrimNdx){
				trimprofitMargin = Number(ME.trimUpgrades[i].upgradePrice);
				break;
			}
		};

		var base = Number(ME.baseLineTotal);
		ME.grandTotal = base + fieldprofitMargin + ridgeprofitMargin + valleyprofitMargin + trimprofitMargin;


		// DOM vars to show Ridge Selections that match Field manufacturer
		var firstChar = ME.UpgradeFieldNdx[0];
		if(firstChar === "G"){
			ME.shingleManufacturer = "GAF";
		}else{
			ME.shingleManufacturer = "OC";
		}
	};

	ME.saveJobConfig = function(){
        var dataObj = [
			{Category:'Field',Code:ME.UpgradeFieldNdx},
			{Category:'Ridge',Code:ME.UpgradeRidgeNdx},
			{Category:'Valley',Code:ME.UpgradeValleyNdx},
			{Category:'Edge',Code:ME.UpgradeTrimNdx}];
        
        ME.C.saveJobConfig(dataObj);	
    };


	ME.thumbClick = function(ndx){
		ME.selectedPhoto.path = ME.C.photoGallery[ndx].full;
		ME.selectedPhoto.cap = ME.C.photoGallery[ndx].cap;
		var myTemplate = "client/js/full.tpl.html";
		ngDialog.open({
            template: myTemplate,
            scope: $scope,
        	controller: $controller('DialogCtrl', {$scope: $scope,dataObj: ME.selectedPhoto})
        });
	};

	var getUpgradeOptions = function(){
		ME.shingleUpgrades = ME.C.getUpgrades("Field");
		ME.ridgeUpgrades = ME.C.getUpgrades("Ridge");
		ME.valleyUpgrades = ME.C.getUpgrades("Valley");
		ME.trimUpgrades = ME.C.getUpgrades("Edge");
	};

	var setSelections = function(){
		for (var i = 0; i < ME.shingleUpgrades.length; i++) {
			if(ME.shingleUpgrades[i].Checked === true){
				ME.UpgradeFieldNdx = ME.shingleUpgrades[i].Code;
				break;
			}
		};

		for (i = 0; i < ME.ridgeUpgrades.length; i++) {
			if(ME.ridgeUpgrades[i].Checked === true){
				ME.UpgradeRidgeNdx = ME.ridgeUpgrades[i].Code;
				break;
			}
		};

		for (i = 0; i < ME.valleyUpgrades.length; i++) {
			if(ME.valleyUpgrades[i].Checked === true){
				ME.UpgradeValleyNdx = ME.valleyUpgrades[i].Code;
				break;
			}
		};

		for (i = 0; i < ME.trimUpgrades.length; i++) {
			if(ME.trimUpgrades[i].Checked === true){
				ME.UpgradeTrimNdx = ME.trimUpgrades[i].Code;
				break;
			}
		};
	};
	
	
	$scope.$watch('$viewContentLoaded', function() {
       var loggedIn = ME.C.loggedIn;
       if(!loggedIn){
       		$state.transitionTo('login');
       };

    });

	getUpgradeOptions();
	setSelections();
	ME.calculateTotal();
	
	console.log("ReviewCtrl Complete");
  
 }]);