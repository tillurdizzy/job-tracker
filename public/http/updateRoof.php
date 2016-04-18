<?php
//Just makes an entry into the jobs_details table using the ID auto-created from the jobs_list table.
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");

$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');

$PRIMARY_ID = mysqli_real_escape_string($con,$data->PRIMARY_ID);
$propertyID = mysqli_real_escape_string($con,$data->propertyID);
$client = mysqli_real_escape_string($con,$data->client);
$name = mysqli_real_escape_string($con,$data->name);
$numLevels = mysqli_real_escape_string($con,$data->numLevels);
$shingleGrade = mysqli_real_escape_string($con,$data->shingleGrade);
$roofDeck = mysqli_real_escape_string($con,$data->roofDeck);
$layers = mysqli_real_escape_string($con,$data->layers);
$edgeDetail = mysqli_real_escape_string($con,$data->edgeDetail);
$edgeTrim = mysqli_real_escape_string($con,$data->edgeTrim);
$valleyDetail = mysqli_real_escape_string($con,$data->valleyDetail);
$ridgeCap = mysqli_real_escape_string($con,$data->ridgeCap);
$roofVents = mysqli_real_escape_string($con,$data->roofVents);
$pitch = mysqli_real_escape_string($con,$data->pitch);

$query = "UPDATE roof SET 
propertyID='".$propertyID."',
name='".$name."',
numLevels='".$numLevels."',
shingleGrade='".$shingleGrade."',
roofDeck='".$roofDeck."',
layers='".$layers."',
edgeDetail='".$edgeDetail."',
edgeTrim='".$edgeTrim."',
valleyDetail='".$valleyDetail."',
ridgeCap='".$ridgeCap."',
roofVents='".$roofVents."',
pitch='".$pitch."',
WHERE PRIMARY_ID='".$PRIMARY_ID."'";
$qry_res = mysqli_query($con,$query);
if ($qry_res) {
	$arr = array('msg' => "Success", 'result' => $qry_res);
	$jsn = json_encode($arr);
	echo($jsn);
} else {
	$arr = array('msg' => "Error inserting record", 'result' => $qry_res,'params' => $PRIMARY_ID);
	$jsn = json_encode($arr);
	echo($jsn);
}
?>