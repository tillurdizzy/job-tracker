<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");

$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$Sort = mysqli_real_escape_string($con,$data->Sort);
$Category = mysqli_real_escape_string($con,$data->Category);
$Manufacturer = mysqli_real_escape_string($con,$data->Manufacturer);
$Item = mysqli_real_escape_string($con,$data->Item);
$Code = mysqli_real_escape_string($con,$data->Code);
$Package = mysqli_real_escape_string($con,$data->Package);
$QtyPkg = mysqli_real_escape_string($con,$data->QtyPkg);
$UnitPkg = mysqli_real_escape_string($con,$data->UnitPkg);
$PkgPrice = mysqli_real_escape_string($con,$data->PkgPrice);
$QtyCoverage = mysqli_real_escape_string($con,$data->QtyCoverage);
$UnitCoverage = mysqli_real_escape_string($con,$data->UnitCoverage);
$RoundUp = mysqli_real_escape_string($con,$data->RoundUp);
$Margin = mysqli_real_escape_string($con,$data->Margin);
$InputParam = mysqli_real_escape_string($con,$data->InputParam);
$Checked = mysqli_real_escape_string($con,$data->Checked);
$url = mysqli_real_escape_string($con,$data->url);

$query = "INSERT INTO materials_shingle(Sort,Category,Manufacturer,Item,Code,Package,QtyPkg,UnitPkg,PkgPrice,QtyCoverage,UnitCoverage,RoundUp,Margin,InputParam,Checked,url)
VALUES(
'" . $Sort . "', " .
"'" . $Category . "', " .
"'" . $Manufacturer . "', " .
"'" . $Item . "', " .
"'" . $Code . "', " .
"'" . $Package . "', " .
"'" . $QtyPkg . "', " .
"'" . $UnitPkg . "', " .
"'" . $PkgPrice . "', " .
"'" . $QtyCoverage . "', " .
"'" . $UnitCoverage . "', " .
"'" . $RoundUp . "', " .
"'" . $Margin . "', " .
"'" . $InputParam . "', " .
"'" . $Checked . "', " .
"'" . $url . "')";
$qry_res = mysqli_query($con,$query);
if ($qry_res) {
	$arr = array('msg' => "Successful", 'result' => $qry_res, 'params' => $Item);
	$jsn = json_encode($arr);
	echo($jsn);
} else {
	$arr = array('msg' => "Error", 'result' => $qry_res,'params' => $Item);
	$jsn = json_encode($arr);
	echo($jsn);
}
?>