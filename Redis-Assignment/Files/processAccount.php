<?php

	/*
	 * Author: Steven Jiang
	 * Date: 9/13/20
	 * File: processAccount.php
	*/

	// if started from commandline, wrap parameters to $_POST
	if (!isset($_SERVER["HTTP_HOST"])) {
 		parse_str($argv[1], $_POST);
	}

	// Connecting to redis server on localhost
	$redis = new Redis();
	$redis -> connect('127.0.0.1', 6379);
 
	$userID = 'jiangs1';

	// Display redis info
	$redisInfo = $redis -> info();
	echo "Redis version: " . $redisInfo['redis_version'] . "\n";

	// removes empty string from frontend form input
	$_POST['genre'] = array_filter($_POST['genre']);

	// for-each loop to add each genre to user's genre set
	foreach ($_POST['genre'] as $genre) {
		echo "Starting to add genre " . $genre . " to set!\n";
		$status = $redis -> sadd($userID . ":genres", $genre);
		echo $status ? "Success!\n" : "Failed! Already in Set!\n";
	}

	echo "\n";
 
	// Turn entire POST array to JSON first
	$JSON = json_encode($_POST);
	echo "Starting to add account info for user: " . $_POST['account'] . "\n";
		
	$status = $redis -> rawCommand("JSON.SET", $userID . ":" . $_POST['account'], ".", $JSON);
	echo $status ? "Success!\n" : "Failed!\n"

?>
