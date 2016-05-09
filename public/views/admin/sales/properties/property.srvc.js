'use strict';

app.service('PropertiesSrvc', ['AdminSharedSrvc', 'AdminDataSrvc', function propSrv(AdminSharedSrvc, AdminDataSrvc) {
    var self = this;
    var S = AdminSharedSrvc;
    var DB = AdminDataSrvc;
    self.PROPERTIES = [];
    self.CLIENTS = [];
    self.MULTIVENTS = S.MULTIVENTS;
    self.MULTILEVELS = S.MULTILEVELS;

    var createDP = function() {
        self.PROPERTIES = DB.clone(S.PROPERTIES);
        self.PROPERTIES.unshift({ displayName: "-- Select --", PRIMARY_ID: -1 });

        self.CLIENTS = DB.clone(S.CLIENTS);
        self.CLIENTS.unshift({ displayName: "-- Select --", PRIMARY_ID: -1 });
        getTheMultis();
    };

    // Triggered by selecting Update or Remove Tabs
    var getTheMultis = function() {
        S.getMultiVents();
        S.getMultiLevels();
    };

    self.logMultis = function() {
    	self.MULTIVENTS = S.MULTIVENTS;
        self.MULTILEVELS = S.MULTILEVELS;
    }

    var returnDisplayNameFromClient = function(id) {
        for (var i = 0; i < self.CLIENTS.length; i++) {
            if (self.CLIENTS[i].PRIMARY_ID == id) {
                return self.CLIENTS[i].displayName;
            }
        };
        return "";
    };

    self.selfDestruct = function() {
        self.PROPERTIES = null;
        self.CLIENTS = null;
    };

    self.returnObjByPropID = function(set, id) {
        var rtnObj = {};
        for (var i = 0; i < set.length; i++) {
            if (set[i].propertyID == id) {
                rtnObj = set[i];
                break;
            };
        };
        return rtnObj;
    };

    self.returnObjByRoofID = function(set, id) {
        var rtnObj = {};
        for (var i = 0; i < set.length; i++) {
            if (set[i].roofID == id) {
                rtnObj = set[i];
                break;
            };
        };
        return rtnObj;
    };

    self.returnObjFromSetByPrimaryID = function(set, id) {
        var rtnObj = {};
        for (var i = 0; i < set.length; i++) {
            if (set[i].PRIMARY_ID == id) {
                rtnObj = set[i];
                break;
            };
        };
        return rtnObj;
    };

    createDP();

}]);
