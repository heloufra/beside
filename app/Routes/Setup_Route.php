<?php


    /*********************************** default_Action **********************************/

    $app->get('/Setup/',$AuthMdw,'Setup_Controller::default_Action');
    $app->get('/',$AuthMdw,'Setup_Controller::default_Action');

?>
