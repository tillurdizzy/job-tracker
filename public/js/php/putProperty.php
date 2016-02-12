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
$coveredLayer = mysqli_real_escape_string($con,$data->coveredLayer);
$layersCovering = mysqli_real_escape_string($con,$data->layersCovering);
$edgeDetail = mysqli_real_escape_string($con,$data->edgeDetail);
$valleyDetail = mysqli_real_escape_string($con,$data->valleyDetail);
$ridgeCap = mysqli_real_escape_string($con,$data->ridgeCap);
$roofVents = mysqli_real_escape_string($con,$data->roofVents);
$pitchAvg = mysqli_real_escape_string($con,$data->pitchAvg);

$query = "INSERT INTO properties(manager,client,name,street,city,state,zip,
numLevels,shingleGrade,roofDeck,coveredLayer,layersCovering,edgeDetail,valleyDetail,
ridgeCap,roofVents,pitchAvg)
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
"'" . $coveredLayer . "', " .
"'" . $layersCovering . "', " .
"'" . $edgeDetail . "', " .
"'" . $valleyDetail . "', " .
"'" . $ridgeCap . "', " .
"'" . $roofVents . "', " .
"'" . $pitchAvg . "')";
$qry_res = mysqli_query($con,$query);
if ($qry_res) {
	$last_id = mysqli_insert_id($con);
	$arr = array('msg' => "Success", 'result' => $qry_res, 'params' => $last_id);
	$jsn = json_encode($arr);
	echo($jsn);
} else {
	$arr = array('msg' => "Fail", 'result' => $qry_res,'params' => $manager);
	$jsn = json_encode($arr);
	echo($jsn);
}
?>