'use strict';

app.controller('PitchedRoofInventoryCtrl',['$state','$scope','SharedSrvc','AdminDataSrvc',function ($state,$scope,SharedSrvc,AdminDataSrvc) {
	
	var ME = this;
	var S = SharedSrvc;
	var DB =  AdminDataSrvc;
	
	ME.addItem = function(){
		$state.transitionTo("admin.pitchedInventory.add");
	};
	ME.updateItem = function(){
		$state.transitionTo("admin.pitchedInventory.update");
	};
	ME.removeItem = function(){
		$state.transitionTo("admin.pitchedInventory.remove");
	};

	ME.inputDataObj = {Sort:"100",Category:"Shingle-Field",Supplier:"",Item:"",Code:"",Package:"Bdls",QtyPkg:"",UnitPkg:"",PkgPrice:"",QtyCoverage:"",UnitCoverage:"",
	RoundUp:"",Margin:"",InputParam:"",Default:"",Notes:"",url:""};

	ME.addItemSubmit = function(){
        var query = DB.queryDBWithObj("views/admin/http/putPitchedInventoryItem.php",ME.inputDataObj).then(function(result) {
            if (result != false) {
                return true;
            } else {
                alert("FALSE returned from DB at AdminSharedSrvc >>> getMaterialsList()");
                return false;
            }
        }, function(error) {
            alert("ERROR returned returned from DB at AdminSharedSrvc >>> getMaterialsList()");
        });
	};

	


	


 }]);