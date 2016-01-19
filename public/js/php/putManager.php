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
$name_first = mysqli_real_escape_string($con,$data->name_first);
$name_last = mysqli_real_escape_string($con,$data->name_last);
$name_user = mysqli_real_escape_string($con,$data->name_user);
$pin = mysqli_real_escape_string($con,$data->pin);

$query = "INSERT INTO managers(name_first,name_last,name_user,pin)
VALUES(
'" . $name_first . "', " .
"'" . $name_last . "', " .
"'" . $name_user . "', " .
"'" . $pin . "')";
$qry_res = mysqli_query($con,$query);
if ($qry_res) {
	$arr = array('msg' => "Insert successful", 'result' => $qry_res, 'params' => $name_first);
	$jsn = json_encode($arr);
	echo($jsn);
} else {
	$arr = array('msg' => "Error inserting record", 'result' => $qry_res,'params' => $name_first);
	$jsn = json_encode($arr);
	echo($jsn);
}
?>