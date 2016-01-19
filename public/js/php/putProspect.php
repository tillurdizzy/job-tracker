<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
define( "DATABASE_SERVER", "localhost");
define( "DATABASE_USERNAME", "root");
define( "DATABASE_PASSWORD", "");
define( "DATABASE_NAME", "roofingtracker");
/*define( "DATABASE_USERNAME", "evo-danny");
define( "DATABASE_PASSWORD", "SaDie9954!");
define( "DATABASE_NAME", "evo-jobtrack");*/

$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$manager = mysqli_real_escape_string($con,$data->manager);
$property = mysqli_real_escape_string($con,$data->property);
$roof = mysqli_real_escape_string($con,$data->roof);
$status = mysqli_real_escape_string($con,$data->status);
$name = mysqli_real_escape_string($con,$data->name);
$address = mysqli_real_escape_string($con,$data->address);
$city = mysqli_real_escape_string($con,$data->city);
$state = mysqli_real_escape_string($con,$data->state);
$zip = mysqli_real_escape_string($con,$data->zip);
$contact = mysqli_real_escape_string($con,$data->contact);
$phone = mysqli_real_escape_string($con,$data->phone);
$email = mysqli_real_escape_string($con,$data->email);
$date1 = mysqli_real_escape_string($con,$data->date1);

$query = "INSERT INTO jobs_list(manager,property,roof,status,name,address,city,state,zip,contact,phone,email,date1,date0)
VALUES(
'" . $manager . "', " .
"'" . $property . "', " .
"'" . $roof . "', " .
"'" . $status . "', " .
"'" . $name . "', " .
"'" . $address . "', " .
"'" . $city . "', " .
"'" . $state . "', " .
"'" . $zip . "', " .
"'" . $contact . "', " .
"'" . $phone . "', " .
"'" . $email . "', " .
"'" . $date1 . "', " .
"'" . $date1 . "')";
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