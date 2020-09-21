<?php

session_cache_limiter(false);
	
session_start(); 


date_default_timezone_set("Africa/Casablanca");

require_once __DIR__ . '/vendor/autoload.php';


require 'Slim/Slim.php';

require 'Connection.php';

require_once 'PHPMailerAutoload.php';
	
require_once 'class.phpmailer.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim((array('templates.path' => './Views')));

/******* Case-sensitive *******/

$configurations = [
    'routes.case_sensitive' => false
];

$app->config($configurations);

/************** Middlewares  : $SessionMdw | $AuthMdw **************/

require_once  './app/Middleware/middleware.php';

/************** Controllers **************/

require_once  './app/Controllers/Setup/Setup_Controller.php';
require_once  './app/Controllers/Student/Student_Controller.php';
require_once  './app/Controllers/Exam/Exam_Controller.php';
require_once  './app/Controllers/Homework/Homework_Controller.php';
require_once  './app/Controllers/Finance/Finance_Controller.php';

/**************** Routes ****************/

require_once './app/Routes/Setup_Route.php';
require_once './app/Routes/Student_Route.php';
require_once './app/Routes/Exam_Route.php';
require_once './app/Routes/Homework_Route.php';
require_once './app/Routes/Finance_Route.php';
    
/******************************************************************************/

$app->notFound(function () use ($app) {
    $app->render('/404/404.php');
});


$app->run();





