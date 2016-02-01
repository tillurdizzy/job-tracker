<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
require_once ('vo/shingleItemsVO.php');

define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");
//connect to the database.
$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$id = mysqli_real_escape_string($con,$data->id);
//Can use either PRIMARY_ID or JobNumber; both should be unique
$query = sprintf("SELECT * FROM shingle_input_items");
$result = mysqli_query($con,$query);
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new shingleItemsVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->item = $row->item;
	$oneVO->code = $row->code;
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>