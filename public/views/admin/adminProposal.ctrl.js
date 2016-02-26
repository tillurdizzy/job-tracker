'use strict';

app.controller('AdminProposalCtrl',['$location','$state','evoDb','$scope','SharedSrvc',function ($location,$state,evoDb,$scope,SharedSrvc) {
	var DB =  evoDb;
	var ME = this;
	var S = SharedSrvc;

	ME.selectedProposal = {};
	ME.activeProposals = [];
	ME.selectDataProvider = [];
	
	ME.selectProposal = function(){
		console.log(ME.activeProposals[ME.selectedProposal.id].name);
	}

	var pullProposalData = function(){
		ME.selectDataProvider = [];
		DB.returnRawData('views/admin/http/getJobProposals.php')
		.then(function(result){
             if(typeof result != "boolean"){
             	ME.activeProposals = result;
            	for (var i = 0; i < result.length; i++) {
					var a =  result[i].name;
					var b =  result[i].street;
					var c =  result[i].city;
					var d =  result[i].state;
					var label = a + ", " + b + ", " + c + " " + d;
					ME.selectDataProvider.push({label:label,id:i});
				}
				ME.selectedProposal = ME.selectDataProvider[0];
            }else{
              ME.dataError("JobsCtrl-getManagerJobs()-1",result); 
            }
        },function(error){
            ME.dataError("JobsCtrl-getManagerJobs()-2",result);
        });
		
		
	};

	

	$scope.$watch('$viewContentLoaded', function() {
 		pullProposalData();
    });

 }]);