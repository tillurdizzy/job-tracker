'use strict';

app.controller('PitchedRoofInventoryCtrl',['$state','$scope','SharedSrvc','AdminDataSrvc',function ($state,$scope,SharedSrvc,AdminDataSrvc) {
	
	var ME = this;
	ME.S = SharedSrvc;
	var DB =  AdminDataSrvc;

	ME.pitchedInventoryList = [];
	ME.EditMode = "Add Item";
	ME.inputDataObj = {};
	ME.formStatus = "Pristine";
	
	ME.addItem = function(){
		ME.EditMode = "Add Item";
	};
	ME.updateItem = function(){
		ME.EditMode = "Update Item";
	};

	ME.removeItem = function(){
		ME.EditMode = "Remove Item";
	};

	ME.backToHome = function(){
		$state.transitionTo('admin');
	}

	ME.formChange = function(){
		ME.formStatus = "Dirty";
	}

	ME.clickTableRow = function(code){
		ME.EditMode = "Update Item";
		ME.formStatus = "Pristine";
		ME.inputDataObj = {};
		for (var i = 0; i < ME.pitchedInventoryList.length; i++) {
			if(ME.pitchedInventoryList[i].Code == code){
				ME.inputDataObj = ME.pitchedInventoryList[i];
			}
		}
	};

	ME.selectDataObj_dp = {Package:ME.S.packageOptions[0],UnitPkg:ME.S.unitOptions[0],UnitCoverage:ME.S.unitOptions[0],InputParam:ME.S.propertyParams[0]};

	ME.submit = function(){
		switch(ME.EditMode){
			case "Add Item": addItem();break;
			case "Update Item": updateItem();break;
			case "Remove Item": removeItem();break;
		}
	};

	var addItem = function(){
		parseSelectionProviders();
        var query = DB.queryDBWithObj("views/admin/http/putPitchedInventoryItem.php",ME.inputDataObj).then(function(result) {
            if (result != false) {
                resetForm();
                alert("Add Item Successful");
            } else {
                alert("FALSE returned from DB at PitchedRoofInventoryCtrl >>> addItemSubmit()");
                return false;
            }
        }, function(error) {
            alert("ERROR returned returned from DB at PitchedRoofInventoryCtrl >>> addItemSubmit()");
        });
	};

	var updateItem = function(){
		parseSelectionProviders();
        var query = DB.queryDBWithObj("js/php/updateMaterialsShingle.php",ME.inputDataObj).then(function(result) {
            if (result != false) {
            	resetForm();
            	alert("Update Successful");
            } else {
                alert("FALSE returned from DB at PitchedRoofInventoryCtrl >>> addItemSubmit()");
                return false;
            }
        }, function(error) {
            alert("ERROR returned returned from DB at PitchedRoofInventoryCtrl >>> addItemSubmit()");
        });
	};

	var parseSelectionProviders = function(){
		ME.inputDataObj.Package = ME.selectDataObj_dp.Package.label;
		ME.inputDataObj.UnitPkg = ME.selectDataObj_dp.UnitPkg.label;
		ME.inputDataObj.UnitCoverage = ME.selectDataObj_dp.UnitCoverage.label;
		ME.inputDataObj.InputParam = ME.selectDataObj_dp.InputParam.label;
	};

	var resetForm = function(){
		ME.formStatus = "Pristine";
		if(ME.EditMode == "Add Item"){
			var sortNum = parseInt(ME.inputDataObj.Sort);
        	sortNum+=1;
        	ME.inputDataObj.Sort =  sortNum;
		}
	};

	var getInventory = function(){
		var query = DB.queryDB("views/admin/http/getMaterialsShingle.php").then(function(result) {
            if (result != false && typeof result != "string") {
               ME.pitchedInventoryList = result;
            } else {
                alert("FALSE returned from DB at PitchedRoofInventoryCtrl >>> addItemSubmit()");
                return false;
            }
        }, function(error) {
            alert("ERROR returned returned from DB at PitchedRoofInventoryCtrl >>> addItemSubmit()");
        });
	};

	var resetInputFields = function(){
		ME.inputDataObj = {Sort:"",Category:"",Manufacturer:"",Item:"",Code:"",Package:"",QtyPkg:"",UnitPkg:"",PkgPrice:"",QtyCoverage:"",UnitCoverage:"",
	RoundUp:"",Margin:"",InputParam:"",Checked:"false",Notes:"",url:""};
	};


	getInventory();
	resetInputFields();


 }]);