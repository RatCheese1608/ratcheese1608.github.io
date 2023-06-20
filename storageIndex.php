<?php
	header('Content-Type: application/json');

	$data = [
		"Path" => "Resources",
		"Images" => ["golden rat.jpg","rat.jpg"],
	];

	echo json_encode($data);
?>
