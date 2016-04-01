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
$TURBNS = mysqli_real_escape_string($con,$data->TURBNS);
$STATIC = mysqli_real_escape_string($con,$data->STATIC);
$PWRVNT = mysqli_real_escape_string($con,$data->PWRVNT);
$AIRHWK = mysqli_real_escape_string($con,$data->AIRHWK);
$SLRVNT = mysqli_real_escape_string($con,$data->SLRVNT);
$LEVSIX = mysqli_real_escape_string($con,$data->LEVSIX);

$query = "UPDATE multi_vents SET 
TURBNS='".$TURBNS."',
PWRVNT='".$PWRVNT."',
STATIC='".$STATIC."',
AIRHWK='".$AIRHWK."',
SLRVNT='".$SLRVNT."',
LEVSIX='".$LEVSIX."'
WHERE propertyID='".$propertyID."'";

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