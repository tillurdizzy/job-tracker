<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
$data = json_decode(file_get_contents("php://input"));
require_once ('vo/invtVO.php');

define( "DATABASE_SERVER", "jobtracker.db.10253438.hostedresource.com");
define( "DATABASE_USERNAME", "jobtracker");
define( "DATABASE_PASSWORD", "Sadie9954!");
define( "DATABASE_NAME", "jobtracker");

$con = mysqli_connect(DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD,DATABASE_NAME) or die ('ERROR!!!');
$query = sprintf("SELECT * FROM inv_shingle");
$result = mysqli_query($con,$query);
$resultValueObjects = array();
while ($row = mysqli_fetch_object($result)) {
	$oneVO = new invtVO();
	$oneVO->PRIMARY_ID = $row->PRIMARY_ID;
	$oneVO->Manufacturer = $row->Manufacturer;
	$oneVO->Code = $row->Code;
	$oneVO->Item = $row->Item;
	$oneVO->Usage = $row->Usage;
	$oneVO->Qty = $row->Qty;
	$oneVO->Unit = $row->Unit;
	$oneVO->Price = $row->Price;
	array_push( $resultValueObjects, $oneVO );
}
echo json_encode($resultValueObjects);
?>