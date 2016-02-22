'use strict';

app.directive('fileSelector', function(){
	return{
		restrict:'A',
		scope:{
			fileSelect: '&'
		},
		templateUrl:'views/proposals/upload.tpl.html',
		replace:true,
		link: function(scope,ele,attrs,c){
			ele.bind('change',function(){
				var file = ele[0].files;
				if(file){
					scope.fileSelect({files:file});
				}
			})
		}
	}
})


