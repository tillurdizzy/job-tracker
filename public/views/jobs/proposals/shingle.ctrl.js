'use strict';
app.controller('ShingleCtrl',['$state','$element','ShingleSrvc',function ($state,$element,ShingleSrvc) {

	var SRVC = ShingleSrvc;
	var Me = this;
    Me.materialResults = null;

    Me.submissionInvalid = false;// form is filled out correctly
    Me.requestSuccess=false;// database query; starts out false set to true on successful query

    Me.T1="0";
    Me.T2="0";
    Me.T3="0";
    Me.T4="0";
    Me.T5="0";
    Me.T6="0";
    Me.T7="0";
    Me.T8="0";
    Me.T9="0";
    Me.T10="0";
    Me.T11="0";
    Me.T12="0";
    Me.T13="0";
    Me.T14="0";
    Me.T15="0";
    Me.T16="0";
    Me.T17="0";
    Me.T18="0";
    Me.T19="0";
    Me.T20="0";

   
  

    $element.bind("keydown keypress", function (event) {
        console.log('keypress', event, event.which);
        if(event.which === 38) { // up
            Me.submitForm();
        } else if (event.which === 40) { // down
        } else {
            return;
        }
        event.preventDefault();
    });

    Me.submitForm = function(){
       if(Me.A.$valid){
            SRVC.FIELD = Me.T1;
            SRVC.TOP = Me.T19;
            SRVC.RAKE = Me.T20;
            SRVC.PERIMETER = Me.T2;
            SRVC.VALLEY = Me.T3;
            SRVC.LEAD1 = Me.T4;
            SRVC.LEAD2 = Me.T5;
            SRVC.LEAD3 = Me.T6;
            SRVC.LEAD4 = Me.T7;
            SRVC.VENTS8 = Me.T8;
            SRVC.EIGHT = Me.T9;
            SRVC.TURBINES = Me.T10;
            SRVC.PWRVENTS = Me.T11;
            SRVC.LOWSLOPE = Me.T12;
            SRVC.AIRHAWKS = Me.T13;
            SRVC.DECKING = Me.T14;
            SRVC.PAINT = Me.T15;
            SRVC.CAULK = Me.T16;
            SRVC.CARPORT = Me.T17;
            SRVC.SATILITE = Me.T18;

            Me.materialResults = SRVC.processInput();
       }
    };

   

    Me.cancelMe = function(){
         $state.transitionTo("home.edit");
    };

    var clearForm = function(){
        Me.materialResults = null;
    Me.T1="0";
        Me.T2="0";
    Me.T3="0";
    Me.T4="0";
    Me.T5="0";
    Me.T6="0";
    Me.T7="0";
    Me.T8="0";
    Me.T9="0";
    Me.T10="0";
    Me.T11="0";
    Me.T12="0";
    Me.T13="0";
    Me.T14="0";
    Me.T15="0";
    Me.T16="0";
    Me.T17="0";
    Me.T18="0";
    Me.T19="0";
    Me.T20="0";
    };

    clearForm();
	

 }]);