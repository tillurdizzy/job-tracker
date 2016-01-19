<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
require_once ('vo/jobVO.php');
define( "DATABASE_SERVER", "localhost");
define( "DATABASE_USERNAME", "root");
define( "DATABASE_PASSWORD", "");
define( "DATABASE_NAME", "roofingtracker");
/*define( "DATABASE_USERNAME", "evo-danny");
define( "DATABASE_PASSWORD", "SaDie9954!");
define( "DATABASE_NAME", "evo-jobtrack");*/
//connect to the database.
$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$id = mysqli_real_escape_string($con,$data->id);
//Can use either PRIMARY_ID or JobNumber; both should be unique
$query = sprintf("SELECT * FROM jobs_list WHERE PRIMARY_ID = '".$id."' OR jobNumber = '".$id."'");
$result = mysqli_query($con,$query);
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new jobVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->jobNumber = $row->jobNumber;
	$oneVO->property = $row->property;
	$oneVO->roof = $row->roof;
	$oneVO->manager = $row->manager;
	$oneVO->status = $row->status;
	$oneVO->name = $row->name;
	$oneVO->address = $row->address;
	$oneVO->city = $row->city;
	$oneVO->state = $row->state;
	$oneVO->zip = $row->zip;
	$oneVO->contact = $row->contact;
	$oneVO->phone = $row->phone;
	$oneVO->email = $row->email;
	$oneVO->date1 = $row->date1;
	$oneVO->date2 = $row->date2;
	$oneVO->date3 = $row->date3;
	$oneVO->date4 = $row->date4;
	$oneVO->date5 = $row->date5;
	$oneVO->date0 = $row->date0;
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>