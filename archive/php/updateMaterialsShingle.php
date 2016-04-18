<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));

define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");

$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('cannot reach database');

$PRIMARY_ID = mysqli_real_escape_string($con,$data->PRIMARY_ID);
$Sort = mysqli_real_escape_string($con,$data->Sort);
$Manufacturer = mysqli_real_escape_string($con,$data->Manufacturer);
$Item = mysqli_real_escape_string($con,$data->Item);
$Code = mysqli_real_escape_string($con,$data->Code);
$Package = mysqli_real_escape_string($con,$data->Package);
$Category = mysqli_real_escape_string($con,$data->Category);
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

$query = "UPDATE materials_shingle SET 
Sort='".$Sort."',
Item='".$Item."',
Code='".$Code."',
Manufacturer='".$Manufacturer."',
Package='".$Package."',
Category='".$Category."',
QtyPkg='".$QtyPkg."',
UnitPkg='".$UnitPkg."',
PkgPrice='".$PkgPrice."',
QtyCoverage='".$QtyCoverage."',
UnitCoverage='".$UnitCoverage."',
RoundUp='".$RoundUp."',
Margin='".$Margin."',
InputParam='".$InputParam."',
Checked='".$Checked."',
url='".$url."'
WHERE PRIMARY_ID='".$PRIMARY_ID."'";

$qry_res = mysqli_query($con,$query);

if ($qry_res) {
	$arr = array('msg' => "Success", 'result' => $qry_res);
	$jsn = json_encode($arr);
	echo($jsn);
} else {
	$arr = array('msg' => "Error", 'result' => $qry_res);
	$jsn = json_encode($arr);
	echo($jsn);
}
?>