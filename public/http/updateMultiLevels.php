<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));

define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");

$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('cannot reach database');

$propertyID = mysqli_real_escape_string($con,$data->propertyID);
$roofID = mysqli_real_escape_string($con,$data->roofID);
$LEVONE = mysqli_real_escape_string($con,$data->LEVONE);
$LEVTWO = mysqli_real_escape_string($con,$data->LEVTWO);
$LEVTHR = mysqli_real_escape_string($con,$data->LEVTHR);
$LEVFOU = mysqli_real_escape_string($con,$data->LEVFOU);

$query = "UPDATE multi_level SET 
LEVONE='".$LEVONE."',
LEVTHR='".$LEVTHR."',
LEVTWO='".$LEVTWO."',
LEVFOU='".$LEVFOU."'
WHERE propertyID='".$propertyID."' AND roofID='".$roofID."'";

$qry_res = mysqli_query($con,$query);

if ($qry_res) {
	$arr = array('msg' => "Success", 'result' => $qry_res);
	$jsn = json_encode($arr);
	echo($jsn);
} else {
	$arr = array('msg' => "Error", 'query' => $query,'result' => $qry_res);
	$jsn = json_encode($arr);
	echo($jsn);
}
?>