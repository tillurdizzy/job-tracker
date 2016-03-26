<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
require_once ('vo/materialsShingleVO.php');
define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");

//connect to the database.
$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');

$query = sprintf("SELECT * FROM materials_shingle WHERE Checked = 'true'");
$result = mysqli_query($con,$query);
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new materialsShingleVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->Sort = $row->Sort;
	$oneVO->Manufacturer = $row->Manufacturer;
	$oneVO->Category = $row->Category;
	$oneVO->Item = $row->Item;
	$oneVO->Code = $row->Code;
	$oneVO->Package = $row->Package;
	$oneVO->QtyPkg = $row->QtyPkg;
	$oneVO->UnitPkg = $row->UnitPkg;
	$oneVO->PkgPrice = $row->PkgPrice;
	$oneVO->QtyCoverage = $row->QtyCoverage;
	$oneVO->UnitCoverage = $row->UnitCoverage;
	$oneVO->RoundUp = $row->RoundUp;
	$oneVO->Margin = $row->Margin;
	$oneVO->InputParam = $row->InputParam;
	$oneVO->Checked = $row->Checked;
	$oneVO->url = $row->url;
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>