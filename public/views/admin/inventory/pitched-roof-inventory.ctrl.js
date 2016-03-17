'use strict';

app.controller('PitchedRoofInventoryCtrl',['$state','$scope','SharedSrvc','AdminDataSrvc',function ($state,$scope,SharedSrvc,AdminDataSrvc) {
	
	var ME = this;
	ME.S = SharedSrvc;
	var DB =  AdminDataSrvc;

	ME.pitchedInventoryList = [];
	
	ME.addItem = function(){
		$state.transitionTo("admin.pitchedInventory.add");
	};
	ME.updateItem = function(){
		$state.transitionTo("admin.pitchedInventory.update");
	};
	ME.removeItem = function(){
		$state.transitionTo("admin.pitchedInventory.remove");
	};

	ME.inputDataObj = {Sort:"100",Category:"Shingle-Field",Manufacturer:"",Item:"",Code:"",Package:"",QtyPkg:"",UnitPkg:"",PkgPrice:"",QtyCoverage:"",UnitCoverage:"",
	RoundUp:"",Margin:"",InputParam:"",Checked:"false",Notes:"",url:""};

	ME.selectDataObj = {Package:ME.S.packageOptions[0],UnitPkg:ME.S.unitOptions[0],UnitCoverage:ME.S.unitOptions[0],InputParam:ME.S.propertyParams[0]};

	ME.addItemSubmit = function(){
		ME.inputDataObj.Package = ME.selectDataObj.Package.label;
		ME.inputDataObj.UnitPkg = ME.selectDataObj.UnitPkg.label;
		ME.inputDataObj.UnitCoverage = ME.selectDataObj.UnitCoverage.label;
		ME.inputDataObj.InputParam = ME.selectDataObj.InputParam.label;
        var query = DB.queryDBWithObj("views/admin/http/putPitchedInventoryItem.php",ME.inputDataObj).then(function(result) {
            if (result != false) {
                resetForm();
            } else {
                alert("FALSE returned from DB at PitchedRoofInventoryCtrl >>> addItemSubmit()");
                return false;
            }
        }, function(error) {
            alert("ERROR returned returned from DB at PitchedRoofInventoryCtrl >>> addItemSubmit()");
        });
	};

	var resetForm = function(){
		var sortNum = parseInt(ME.inputDataObj.Sort);
        sortNum+=1;
        ME.inputDataObj.Sort =  sortNum;
	}

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
	}


	getInventory();


 }]);