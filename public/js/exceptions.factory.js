'use strict';
app.factory('$exceptionHandler',function (){
	return function(exception,cause){
		console.log(exception,cause)
	}
});