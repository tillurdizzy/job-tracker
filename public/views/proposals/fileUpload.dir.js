'use strict';

app.directive('fileSelector', function(){
	return{
		restrict:'A',
		scope:{
			fileSelect: '&'
		},
		template:'<input type="file" id="file"/> ',
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


