<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
require_once ('vo/managerVO.php');
/*
define( "DATABASE_SERVER", "localhost");
define( "DATABASE_USERNAME", "root");
define( "DATABASE_PASSWORD", "");
define( "DATABASE_NAME", "roofingtracker");
*/

/*
define( "DATABASE_SERVER", "tillurdizzy.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "evo-danny");
define( "DATABASE_PASSWORD", "SaDie9954!");
define( "DATABASE_NAME", "evo-jobtrack");
*/
define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");
//connect to the database.
$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$name_user = mysqli_real_escape_string($con,$data->name_user);
$pin = mysqli_real_escape_string($con,$data->pin);
$query = sprintf("SELECT * FROM managers WHERE name_user = '".$name_user."' AND pin = '".$pin."'");
$result = mysqli_query($con,$query);
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new managerVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->name_first = $row->name_first;
	$oneVO->name_last = $row->name_last;
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>