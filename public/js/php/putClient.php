<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
/*define( "DATABASE_SERVER", "localhost");
define( "DATABASE_USERNAME", "root");
define( "DATABASE_PASSWORD", "");
define( "DATABASE_NAME", "roofingtracker");*/
/*define( "DATABASE_USERNAME", "evo-danny");
define( "DATABASE_PASSWORD", "SaDie9954!");
define( "DATABASE_NAME", "evo-jobtrack");*/

define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");

$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$manager = mysqli_real_escape_string($con,$data->manager);
$company = mysqli_real_escape_string($con,$data->company);
$name_first = mysqli_real_escape_string($con,$data->name_first);
$name_last = mysqli_real_escape_string($con,$data->name_last);
$street = mysqli_real_escape_string($con,$data->street);
$city = mysqli_real_escape_string($con,$data->city);
$state = mysqli_real_escape_string($con,$data->state);
$zip = mysqli_real_escape_string($con,$data->zip);
$phone_cell = mysqli_real_escape_string($con,$data->phone_cell);
$phone_bus = mysqli_real_escape_string($con,$data->phone_bus);
$email = mysqli_real_escape_string($con,$data->email);

$query = "INSERT INTO clients(manager,company,name_first,name_last,street,city,state,zip,phone_cell,phone_bus,email)
VALUES(
'" . $manager . "', " .
"'" . $company . "', " .
"'" . $name_first . "', " .
"'" . $name_last . "', " .
"'" . $street . "', " .
"'" . $city . "', " .
"'" . $state . "', " .
"'" . $zip . "', " .
"'" . $phone_cell . "', " .
"'" . $phone_bus . "', " .
"'" . $email . "')";
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