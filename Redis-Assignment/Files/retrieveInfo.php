<?php

	/*
	 * Author: Steven Jiang
	 * Date: 9/13/20
	 * File: retrieveInfo.php
	 */

	// if started from commandline, wrap parameters to $_POST
	if (!isset($_SERVER["HTTP_HOST"])) {
        	parse_str($argv[1], $_POST);
	}

	// Connecting to redis server on localhost
	$redis = new Redis();
	$redis -> connect('127.0.0.1', 6379);

	// jiang1:10d2e5
	$userID = $_POST['userID'];

	// Display redis info
	$redisInfo = $redis -> info();
	echo "Redis version: " . $redisInfo['redis_version'] . "\n";

	echo "Starting to retrieve info for user " . $userID . "\n";

	$name_status = $redis -> rawCommand("JSON.GET", $userID, "name");
	$phone_status = $redis -> rawCommand("JSON.GET", $userID, "phone");
	$genres_status = $redis -> rawCommand("JSON.GET", $userID, "genre");

	echo $name_status ? "Successfully retrieved name: " . $name_status . "\n" : "Failed to retrieve name!\n";
	echo $phone_status ? "Successfully retrieved phone number: " . $phone_status . "\n" : "Failed to retrieve phone number!\n";

	if ($genres_status) {
		echo "Successfully retrieved list of genres: \n";
		$genres = explode(",", $genres_status);

		foreach ($genres as $genre) {
			$trimmedGenre = trim($genre, "[\"\"]");
			echo " - " . $trimmedGenre . "\n";	
		}
	}
	else {
		echo "Failed to retrieve list of genres!\n";
	}

?>
