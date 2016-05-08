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
$createdDate = mysqli_real_escape_string($con,$data->createdDate);
$client = mysqli_real_escape_string($con,$data->client);
$name = mysqli_real_escape_string($con,$data->name);
$street = mysqli_real_escape_string($con,$data->street);
$city = mysqli_real_escape_string($con,$data->city);
$state = mysqli_real_escape_string($con,$data->state);
$zip = mysqli_real_escape_string($con,$data->zip);
$roofCode = mysqli_real_escape_string($con,$data->roofCode);


$query = "INSERT INTO properties(manager,createdDate,client,name,street,city,state,zip,roofCode)
VALUES(
'" . $manager . "', " .
"'" . $createdDate . "', " .
"'" . $client . "', " .
"'" . $name . "', " .
"'" . $street . "', " .
"'" . $city . "', " .
"'" . $state . "', " .
"'" . $zip . "', " .
"'" . $roofCode . "')";
$qry_res = mysqli_query($con,$query);
if ($qry_res) {
	$last_id = mysqli_insert_id($con);
	$arr = array('msg' => "Success", 'result' => $qry_res, 'id' => $last_id);
	$jsn = json_encode($arr);
	echo($jsn);
} else {
	$arr = array('msg' => "Error", 'query' => $query,'result' => $qry_res);
	$jsn = json_encode($arr);
	echo($jsn);
}
?>