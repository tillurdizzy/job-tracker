'use strict';
app.service('ShingleSrvc',['$http','$q','SharedSrvc',function shingleStuff($http,$q,SharedSrvc){
	var self = this;
	self.ME = "ShingleSrvc: ";
	var S = SharedSrvc;
	self.jobMaterials = [];

	// Form items
	self.FIELD;
	self.TOP;
	self.RAKE;
	self.PERIMETER;
	self.VALLEY;
	self.LEAD1;
	self.LEAD2;
	self.LEAD3;
	self.LEAD4;
	self.VENTS8;
	self.EIGHT;
	self.TURBINES;
	self.PWRVENTS;
	self.LOWSLOPE;
	self.AIRHAWKS;
	self.DECKING;
	self.PAINT;
	self.CAULK;
	self.CARPORT;
	self.SATILITE;

	// Inventory items: ID is from SQl PRIMARY_ID unique auto
	var A1 = {ID:1,Item:"GAF Lifetime",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var B1 = {ID:2,Item:"GAF Royal Sov",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var C1 = {ID:3,Item:"Timber Tex",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var D1 = {ID:4,Item:"Z-Ridge",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var E1 = {ID:5,Item:"Ridge",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var F1 = {ID:6,Item:"Starter",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var G1 = {ID:7,Item:"Deck Nails",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var H1 = {ID:8,Item:"Roofing Nails",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var J1 = {ID:9,Item:"Stainless Steel Nails",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var K1 = {ID:10,Item:"#15 Felt",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var L1 = {ID:11,Item:"Ice & Water Shield",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var M1 = {ID:12,Item:"Drip Edge",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var N1 = {ID:13,Item:"Lumber 1 X 2",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var O1 = {ID:14,Item:"8x8",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var P1 = {ID:15,Item:"50 ft. GV Valley",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var Q1 = {ID:16,Item:"50 ft. GV Carport Flashing",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var R1 = {ID:17,Item:"W Valley",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var S1 = {ID:20,Item:"8 in. Vents",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var T1 = {ID:21,Item:"1.5 in. Lead",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var U1 = {ID:22,Item:"2 in. Lead",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var V1 = {ID:23,Item:"4 in. Lead",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var W1 = {ID:24,Item:"Ridge Vent",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var X1 = {ID:25,Item:"Power Vent",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var Y1 = {ID:26,Item:"Air Hawks",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var Z1 = {ID:27,Item:"Turbine",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var A2 = {ID:28,Item:"Plywood",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var B2 = {ID:29,Item:"OSB",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var C2 = {ID:30,Item:"Caulk",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var D2 = {ID:31,Item:"Commdeck Plate",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var E2 = {ID:32,Item:"Delivery",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};
	var F2 = {ID:33,Item:"Paint",Code:"",Price:0,Unit:"",Qty:0,Amt:0,Usage:1,Total:0,Tax:0,Optional:false};

	self.processInput = function(){
		// Shingles
		A1.Amt = parseInt(Math.ceil(self.FIELD * A1.Usage)/A1.Usage);
		A1.Total = Math.round(A1.Amt * A1.Price * 100)/100;

		// Timber tex
		C1.Amt = Math.ceil(self.TOP / C1.Usage);
		C1.Total = Math.round(A1.Amt * A1.Price * 100)/100;

		// Z-Ridge
		D1.Amt = Math.ceil(self.RAKE / D1.Usage);
		D1.Total = Math.round(D1.Amt * A1.Price * 100)/100;

		// Ridge
		E1.Amt = Math.ceil((self.TOP + self.RAKE) / E1.Usage);
		E1.Total = Math.round(E1.Amt * E1.Price * 100)/100;

		// Starter
		F1.Amt = Math.ceil(self.PERIMETER / F1.Usage);
		F1.Total = Math.round(F1.Amt * F1.Price * 100)/100;

		// Deck Nails
		G1.Amt = Math.ceil(self.FIELD / G1.Usage);
		G1.Total = Math.round(G1.Amt * G1.Price * 100)/100;

		// Roofing Nails
		H1.Amt = Math.ceil(self.FIELD / H1.Usage);
		H1.Total = H1.Amt * H1.Price;

		// Stainless Nails
		J1.Amt = Math.ceil(self.LOWSLOPE / J1.Usage);
		J1.Total = J1.Amt * J1.Price;

		// #15 Felt
		K1.Amt = Math.ceil(self.FIELD / K1.Usage);
		K1.Total = K1.Amt * K1.Price;

		// Ice and Water Shield
		L1.Amt = Math.ceil((self.LOWSLOPE * 1.05 ) / L1.Usage);
		L1.Total = L1.Amt * L1.Price;

		// Drip Edge
		M1.Amt = Math.ceil(self.PERIMETER / M1.Usage);
		M1.Total = M1.Amt * M1.Price;

		// Lumber 1x8
		N1.Amt = Math.ceil(self.PERIMETER / N1.Usage);
		N1.Total = N1.Amt * N1.Price;

		// 8x8
		O1.Amt = Math.ceil(self.EIGHT / O1.Usage);
		O1.Total = O1.Amt * O1.Price;

		// GV Valley
		P1.Amt = Math.ceil(self.VALLEY / P1.Usage);
		P1.Total = P1.Amt * P1.Price;

		// GV Carport
		Q1.Amt = Math.ceil(self.FIELD / Q1.Usage);
		Q1.Total = Q1.Amt * Q1.Price;

		// W Valley
		R1.Amt = Math.ceil(self.VALLEY / R1.Usage);
		R1.Total = R1.Amt * R1.Price;

		// 8" vents
		S1.Amt = self.VENTS8;
		S1.Total = S1.Amt * S1.Price;

		// 1.5 Lead
		T1.Amt = self.LEAD1;
		T1.Total = T1.Amt * T1.Price;

		// 2 Lead
		U1.Amt = self.LEAD2;
		U1.Total = U1.Amt * U1.Price;

		// 4 Lead
		V1.Amt = self.LEAD4;
		V1.Total = V1.Amt * V1.Price;

		// Ridge Vents
		W1.Amt = Math.ceil(self.TOP / W1.Usage);
		W1.Total = W1.Amt * W1.Price;

		// Power Vents
		X1.Amt = self.PWRVENTS;
		X1.Total = X1.Amt * X1.Price;

		// Air Hawks
		Y1.Amt = self.AIRHAWKS;
		Y1.Total = Y1.Amt * Y1.Price;

		// Turbines
		Z1.Amt = self.TURBINES;
		Z1.Total = Z1.Amt * Z1.Price;

		// Plywood
		A2.Amt = self.DECKING;
		A2.Total = A2.Amt * A2.Price;

		// OSB
		B2.Amt = A2.Amt;
		B2.Total = B2.Amt * B2.Price;

		// Caulk
		C2.Amt = self.CAULK;
		C2.Total = C2.Amt * C2.Price;

		// Commdeck
		D2.Amt = self.SATILITE;
		D2.Total = D2.Amt * D2.Price;

		// Delivery
		E2.Amt = 0;
		E2.Total = E2.Amt * E2.Price;

		// Paint
		F2.Amt = self.PAINT;
		F2.Total = F2.Amt * F2.Price;

		var rtnArray = [];
		rtnArray.push(A1);
		rtnArray.push(B1);
		rtnArray.push(C1);
		rtnArray.push(D1);
		rtnArray.push(E1);
		rtnArray.push(F1);
		rtnArray.push(G1);
		rtnArray.push(H1);
		rtnArray.push(J1);
		rtnArray.push(K1);
		rtnArray.push(L1);
		rtnArray.push(M1);
		rtnArray.push(N1);
		rtnArray.push(O1);
		rtnArray.push(P1);
		rtnArray.push(Q1);
		rtnArray.push(R1);
		rtnArray.push(S1);
		rtnArray.push(T1);
		rtnArray.push(U1);
		rtnArray.push(V1);
		rtnArray.push(W1);
		rtnArray.push(X1);
		rtnArray.push(Y1);
		rtnArray.push(Z1);
		rtnArray.push(A2);
		rtnArray.push(B2);
		rtnArray.push(C2);
		rtnArray.push(D2);
		rtnArray.push(E2);
		rtnArray.push(F2);
		return rtnArray;

	};

	var processInventory = function(rawData){
		for (var i = 0; i < rawData.length; i++) {
			var id = parseInt(rawData[i].PRIMARY_ID);
			var obj = rawData[i];
			switch(id){
				case 1:setProps(A1,obj);break;
				case 2:setProps(B1,obj);break;
				case 3:setProps(C1,obj);break;
				case 4:setProps(D1,obj);break;
				case 5:setProps(E1,obj);break;
				case 6:setProps(F1,obj);break;
				case 7:setProps(G1,obj);break;
				case 8:setProps(H1,obj);break;
				case 9:setProps(J1,obj);break;
				case 10:setProps(K1,obj);break;
				case 11:setProps(L1,obj);break;
				case 12:setProps(M1,obj);break;
				case 13:setProps(N1,obj);break;
				case 14:setProps(O1,obj);break;
				case 15:setProps(P1,obj);break;
				case 16:setProps(Q1,obj);break;
				case 17:setProps(R1,obj);break;
				case 20:setProps(S1,obj);break;
				case 21:setProps(T1,obj);break;
				case 22:setProps(U1,obj);break;
				case 23:setProps(V1,obj);break;
				case 24:setProps(W1,obj);break;
				case 25:setProps(X1,obj);break;
				case 26:setProps(Y1,obj);break;
				case 27:setProps(Z1,obj);break;
				case 28:setProps(A2,obj);break;
				case 29:setProps(B2,obj);break;
				case 30:setProps(C2,obj);break;
				case 31:setProps(D2,obj);break;
				case 32:setProps(E2,obj);break;
				case 33:setProps(F2,obj);break;
			}
		};
	};

	var setProps = function(itemTo,objFrom){
		itemTo.Qty = Number(objFrom.Qty);
		itemTo.Unit = objFrom.Unit;
		itemTo.Price = Number(objFrom.Price);
		itemTo.Code = objFrom.Code;
		itemTo.Item = objFrom.Item;
		itemTo.Usage = Number(objFrom.Usage);
	};



	var getInventory = function(){
		var deferred = $q.defer();
		$http({method: 'POST', url: 'js/php/getShingleInvt.php'}).
		success(function(data, status) {
			if(typeof data != 'string' && data.length > 0){
     			deferred.resolve(data);
			}else{
				deferred.resolve(false);
			}
	    }).
		error(function(data, status, headers, config) {
			deferred.reject(data);
	    });
	    return deferred.promise;
	};

	var initService = function(){
		var rawData = getInventory()
		.then(function(rawData){
            if(rawData != false){
               processInventory(rawData);
            }else{
               
            }
           
        },function(error){
           
        });


	};

	initService();

	return self;
}]);