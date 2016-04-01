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
$type = mysqli_real_escape_string($con,$data->type);
$manager = mysqli_real_escape_string($con,$data->manager);
$company = mysqli_real_escape_string($con,$data->company);
$displayName = mysqli_real_escape_string($con,$data->displayName);
$name_first = mysqli_real_escape_string($con,$data->name_first);
$name_last = mysqli_real_escape_string($con,$data->name_last);
$street = mysqli_real_escape_string($con,$data->street);
$city = mysqli_real_escape_string($con,$data->city);
$state = mysqli_real_escape_string($con,$data->state);
$zip = mysqli_real_escape_string($con,$data->zip);
$phone_bus = mysqli_real_escape_string($con,$data->phone_bus);
$phone_cell = mysqli_real_escape_string($con,$data->phone_cell);
$edgeTrim = mysqli_real_escape_string($con,$data->edgeTrim);
$valleyDetail = mysqli_real_escape_string($con,$data->valleyDetail);
$ridgeCap = mysqli_real_escape_string($con,$data->ridgeCap);
$roofVents = mysqli_real_escape_string($con,$data->roofVents);
$email = mysqli_real_escape_string($con,$data->email);

$query = "UPDATE clients SET 
type='".$type."',
manager='".$manager."',
company='".$company."',
displayName='".$displayName."',
name_first='".$name_first."',
name_last='".$name_last."',
street='".$street."',
city='".$city."',
state='".$state."',
zip='".$zip."',
phone_bus='".$phone_bus."',
phone_cell='".$phone_cell."',
email='".$email."',
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