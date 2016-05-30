'use strict';

app.service('PdfSrvc',['SharedSrvc',function createPDF(SharedSrvc){
	var self = this;
	var S = SharedSrvc;

	self.newPDF = function(dataObj){
		var doc = new jsPDF('p', 'pt', 'letter');
		doc.setFont("helvetica");
		doc.setFontType("bold");
		doc.setFontSize(14);
		doc.text(20, 30, 'S.C. Martin Roofing Consultants');

		doc.setFontSize(10);
		doc.setFontType("normal");
		doc.text(20, 42, '13003 Murphy Rd. Suite G1');
		doc.text(20, 54, 'Stafford, TX 77477');
		doc.text(20, 66, '713-729-7663');
		doc.text(20, 76, 'www.evolutionroofingsystems.com');

		doc.setFontSize(12);
		doc.text(20, 150, "Property: ");
		doc.text(20, 165, S.selectedPropertyObj.street);
		doc.text(20, 180, S.selectedPropertyObj.city + "," + S.selectedPropertyObj.state + " " + S.selectedPropertyObj.zip);

		doc.setFontSize(14);
		doc.text(20, 250, "Materials: $" + dataObj.upgradesBase);

		doc.save(S.selectedClientObj.name_last + '.pdf');
	}
	

	
}]);