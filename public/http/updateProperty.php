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
$manager = mysqli_real_escape_string($con,$data->manager);
$client = mysqli_real_escape_string($con,$data->client);
$name = mysqli_real_escape_string($con,$data->name);
$street = mysqli_real_escape_string($con,$data->street);
$city = mysqli_real_escape_string($con,$data->city);
$state = mysqli_real_escape_string($con,$data->state);
$zip = mysqli_real_escape_string($con,$data->zip);
$multiUnit = mysqli_real_escape_string($con,$data->multiUnit);

$query = "UPDATE properties SET 
manager='".$manager."',
client='".$client."',
name='".$name."',
street='".$street."',
city='".$city."',
state='".$state."',
zip='".$zip."',
multiUnit='".$multiUnit."',
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