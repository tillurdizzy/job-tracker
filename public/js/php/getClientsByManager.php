<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
require_once ('vo/clientVO.php');

define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");
//connect to the database.
$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$manager = mysqli_real_escape_string($con,$data->manager);
$query = sprintf("SELECT * FROM clients WHERE manager = '".$manager."'");
$result = mysqli_query($con,$query);
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new clientVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->type = $row->type;
	$oneVO->manager = $row->manager;
	$oneVO->company = $row->company;
	$oneVO->name_first = $row->name_first;
	$oneVO->name_last = $row->name_last;
	$oneVO->street = $row->street;
	$oneVO->city = $row->city;
	$oneVO->state = $row->state;
	$oneVO->zip = $row->zip;
	$oneVO->phone_bus = $row->phone_bus;
	$oneVO->phone_cell = $row->phone_cell;
	$oneVO->email = $row->email;
	
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>