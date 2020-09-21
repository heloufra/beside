<?php

    /*********************************** default_Action **********************************/

    $app->get('/Finances/',$AuthMdw,'Finance_Controller::default_Action');

?>
