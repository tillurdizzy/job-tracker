<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
require_once ('vo/userVO.php');

define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");
//connect to the database.
$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$name_user = mysqli_real_escape_string($con,$data->name_user);
$pin = mysqli_real_escape_string($con,$data->pin);
$query = sprintf("SELECT * FROM login WHERE name_user = '".$name_user."' AND pin = '".$pin."'");
$result = mysqli_query($con,$query);
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new userVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->name_first = $row->name_first;
	$oneVO->name_last = $row->name_last;
	$oneVO->name_user = $row->name_user;
	$oneVO->userType = $row->userType;
	$oneVO->jobID = $row->jobID;
	$oneVO->awsRegion = $row->awsRegion;
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>