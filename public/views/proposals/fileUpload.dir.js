'use strict';

app.directive('fileUpload', function(){
	return{
		restrict:'A',
		scope:{
			fileUpload: '&'
		},
		template:'<input type="file" id="file" /> ',
		replace:true,
		link: function(scope,ele,attrs,c){
			ele.bind('change',function(){
				var file = ele[0].files;
				if(file){
					scope.fileUpload({files:file});
				}
			})
		}
	}
})


