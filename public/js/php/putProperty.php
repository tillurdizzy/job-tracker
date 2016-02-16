<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");

$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$manager = mysqli_real_escape_string($con,$data->manager);
$client = mysqli_real_escape_string($con,$data->client);
$name = mysqli_real_escape_string($con,$data->name);
$street = mysqli_real_escape_string($con,$data->street);
$city = mysqli_real_escape_string($con,$data->city);
$state = mysqli_real_escape_string($con,$data->state);
$zip = mysqli_real_escape_string($con,$data->zip);
$numLevels = mysqli_real_escape_string($con,$data->numLevels);
$shingleGrade = mysqli_real_escape_string($con,$data->shingleGrade);
$roofDeck = mysqli_real_escape_string($con,$data->roofDeck);
$layersToRemove = mysqli_real_escape_string($con,$data->layersToRemove);
$edgeDetail = mysqli_real_escape_string($con,$data->edgeDetail);
$edgeTrim = mysqli_real_escape_string($con,$data->edgeTrim);
$valleyDetail = mysqli_real_escape_string($con,$data->valleyDetail);
$ridgeCap = mysqli_real_escape_string($con,$data->ridgeCap);
$roofVents = mysqli_real_escape_string($con,$data->roofVents);
$pitch = mysqli_real_escape_string($con,$data->pitch);

$query = "INSERT INTO properties(manager,client,name,street,city,state,zip,
numLevels,shingleGrade,roofDeck,layersToRemove,edgeDetail,edgeTrim,valleyDetail,
ridgeCap,roofVents,pitch)
VALUES(
'" . $manager . "', " .
"'" . $client . "', " .
"'" . $name . "', " .
"'" . $street . "', " .
"'" . $city . "', " .
"'" . $state . "', " .
"'" . $zip . "', " .
"'" . $numLevels . "', " .
"'" . $shingleGrade . "', " .
"'" . $roofDeck . "', " .
"'" . $layersToRemove . "', " .
"'" . $edgeDetail . "', " .
"'" . $edgeTrim . "', " .
"'" . $valleyDetail . "', " .
"'" . $ridgeCap . "', " .
"'" . $roofVents . "', " .
"'" . $pitch . "')";
$qry_res = mysqli_query($con,$query);
if ($qry_res) {
	$last_id = mysqli_insert_id($con);
	$arr = array('msg' => "Success", 'result' => $qry_res, 'id' => $last_id);
	$jsn = json_encode($arr);
	echo($jsn);
} else {
	$arr = array('msg' => "Fail", 'result' => $qry_res,'params' => $manager);
	$jsn = json_encode($arr);
	echo($jsn);
}
?>