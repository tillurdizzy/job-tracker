<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));

/*define( "DATABASE_USERNAME", "evo-danny");
define( "DATABASE_PASSWORD", "SaDie9954!");
define( "DATABASE_NAME", "evo-jobtrack");*/

define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");

$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('cannot reach database');

$PRIMARY_ID = mysqli_real_escape_string($con,$data->PRIMARY_ID);
$name = mysqli_real_escape_string($con,$data->name);
$address = mysqli_real_escape_string($con,$data->address);
$property = mysqli_real_escape_string($con,$data->property);
$roof = mysqli_real_escape_string($con,$data->roof);
$city = mysqli_real_escape_string($con,$data->city);
$state = mysqli_real_escape_string($con,$data->state);
$zip = mysqli_real_escape_string($con,$data->zip);
$contact = mysqli_real_escape_string($con,$data->contact);
$email = mysqli_real_escape_string($con,$data->email);
$phone = mysqli_real_escape_string($con,$data->phone);

$query = "UPDATE jobs_list SET 
name='".$name."',
property='".$property."',
roof='".$roof."',
address='".$address."',
city='".$city."',
state='".$state."',
zip='".$zip."',
contact='".$contact."',
email='".$email."',
phone='".$phone."'
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