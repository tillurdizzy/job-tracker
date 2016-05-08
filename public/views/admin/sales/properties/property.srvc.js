'use strict';

app.service('PropertiesSrvc',['AdminSharedSrvc','AdminDataSrvc',function propSrv( AdminSharedSrvc,AdminDataSrvc){
	var self = this;
	var S = AdminSharedSrvc;
	var DB = AdminDataSrvc;
	self.PROPERTIES = [];
	self.CLIENTS = [];
	self.MultiVents =  [];
	self.MultiLevels =  [];

	var createDP = function() {
        self.PROPERTIES = S.PROPERTIES;
        self.PROPERTIES.unshift({ displayName: "-- Select --", PRIMARY_ID: -1 });

        self.CLIENTS = S.CLIENTS;
        self.CLIENTS.unshift({ displayName: "-- Select --", PRIMARY_ID: -1 });

        S.getMultiVents();
    	S.getMultiLevels();
    };

    createDP();
	
}]);