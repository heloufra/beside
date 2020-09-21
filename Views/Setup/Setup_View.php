<!DOCTYPE html>
<html>
<head>

	<title><?php echo $params["title"] ; ?></title>
    <meta charset="UTF-8">

  <?php 

  $posIndex = strpos( $_SERVER['PHP_SELF'], '/index.php');

  $baseUrl = substr( $_SERVER['PHP_SELF'], 0, $posIndex);

  $includes_master = "./Views/Includes_master/";

  ?>
  
  <!-- base_url -->
    <?php include_once($includes_master."base_url.php"); ?>
  <!-- end base_url -->

<meta name="viewport" content="width=device-width, initial-scale=1">

  <!--____________________________bootstrap______________________________-->

    <?php include_once("assets/includes/assets_bootstrap_jquery.php"); ?>


  <!--______________________________MainStyle Style____________________________-->

    <?php include_once("assets/includes/Main.php"); ?>


  <!--____________________________fastselect______________________________--> 

    <?php include_once("assets/includes/fastselect.php"); ?>

  <!--____________________________ select2 ______________________________--> 

    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/js/select2.min.js"></script>

  <!--____________________________owl carousel______________________________-->

    <?php include_once("assets/includes/owlcarousel.php"); ?>

</head>

<body class="setup-main-container">
	
    <!-- setup-main-container -->
    <div class="main-container">

      <!-- setup-main-container -->
      <div class="side-bar">

        <img class="side-bar-brand" src="assets/brand/brand.svg" alt="brand"/>

        <ul class="side-bar-ul">

            <li class="side-bar-li">
              <img class="side-bar-li-img" src="assets/icons/sidebar_icons/checked.svg" alt="check"/>
              <span class="side-bar-li-span-active">Detail</span>
            </li>

            <li class="side-bar-li">
              <img class="side-bar-li-img" src="assets/icons/sidebar_icons/unchecked.svg" alt="check"/>
              <span class="side-bar-li-span-inactive">Academic year</span>
            </li>

            <li class="side-bar-li">
              <img class="side-bar-li-img" src="assets/icons/sidebar_icons/unchecked.svg" alt="check"/>
              <span class="side-bar-li-span-inactive">Levels</span>
            </li>

            <li class="side-bar-li">
              <img class="side-bar-li-img" src="assets/icons/sidebar_icons/unchecked.svg" alt="check"/>
              <span class="side-bar-li-span-inactive">Classes</span>
            </li>

            <li class="side-bar-li">
              <img class="side-bar-li-img" src="assets/icons/sidebar_icons/unchecked.svg" alt="check"/>
              <span class="side-bar-li-span-inactive">Subjects</span>
            </li>

            <li class="side-bar-li">
              <img class="side-bar-li-img" src="assets/icons/sidebar_icons/unchecked.svg" alt="check"/>
              <span class="side-bar-li-span-inactive">Expenses</span>
            </li>

            <li class="side-bar-li">
              <img class="side-bar-li-img" src="assets/icons/sidebar_icons/unchecked.svg" alt="check"/>
              <span class="side-bar-li-span-inactive">Costs</span>
            </li>


        </ul>

        <p class="side-bar-section-description">
          There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.
        </p>
        
      </div>
      <!-- end setup-main-container -->

      <div class="sub-container">

        <div class="owl-carousel owl-theme ">
            <!-- sub-container Details -->
            <div  class="item" id="Details_Section" >
              <div  class="sub-main-container">
                <h1 class="sub-container-main-header">Details</h1>
                <h4 class="sub-container-sub-header">There are many variations of passages of Lorem Ipsum available, but the majority.</h4>

                <form class="sub-container-form">

                  <div class="form-group group">
                    <div class="input-img-container input-square-img-container">
                      <img class="input-img" src="assets/icons/Logo_placeholder.svg" />
                      <div class="rounded-button">
                        <img class="icon" src="assets/icons/plus.svg">
                      </div>
                    </div>
                  </div>

                  <div class="form-group group">
                    <input type="text" required>
                    <label class="input-label"><span class="input-label-text">Shcool name</span> <span class="input-label-bg-mask"></span></label>
                  </div>

                  <div class="form-group group">
                    <input type="text" required >
                    <label class="input-label"><span class="input-label-text">Email address</span> <span class="input-label-bg-mask"></span></label>
                  </div>

                  <div class="form-group group">
                    <input type="text" required >
                    <label class="input-label"><span class="input-label-text">Phone number</span> <span class="input-label-bg-mask"></span></label>
                  </div>

                  <div class="form-group group">
                    <input type="text" required >
                    <label class="input-label"><span class="input-label-text">Whatsapp business number</span> <span class="input-label-bg-mask"></span></label>
                  </div>

                </form>

              </div>

              <div class="sub-container-form-footer">
                  <div class="rounded-button btn-secondary">
                        <img class="icon" src="assets/icons/left_arrow.svg">
                  </div>
                  <div class="rounded-button rounded-button-primary rounded-button-float-right">
                        <span class="button-text">Next</span>
                        <img class="icon button-icon" src="assets/icons/right_arrow.svg">
                  </div>
              </div>

            </div>
            <!-- end sub-container Details -->


            <!-- sub-container Academic year -->
            <div class="item" id="Academic_Year_Section">
              <div  class="sub-main-container">
                <h1 class="sub-container-main-header">Academic year</h1>
                <h4 class="sub-container-sub-header">There are many variations of passages of Lorem Ipsum available, but the majority.</h4>

                <form class="sub-container-form">

                  <div class="form-group group">
                    <input type="text" required>
                    <label class="input-label"><span class="input-label-text">Academic Year Label</span> <span class="input-label-bg-mask"></span></label>
                  </div>


                  <div class="date-form-input-container">

                    <label class="input-label dynamic-form-input-container-label"><span class="input-label-text input-label-text-active">Start Month</span> <span class="input-label-bg-mask"></span></label>

                    <div class="date-form-input">

                      <div class="form-group group form-group-extra-style">

                        <input type="text" required>

                        <label class="input-label"><span class="input-label-text">Select Month</span> <span class="input-label-bg-mask"></span></label>
                        <img class="icon button-icon" src="assets/icons/caret.svg">

                        <div class="date-form-input-picker-container">
                          <div class="date-form-input-picker row">
                              <span class="col-md-3 date-form-input-picker-label date-form-input-picker-label-first-of-line">January</span>
                              <span class="col-md-3 date-form-input-picker-label">February</span>
                              <span class="col-md-3 date-form-input-picker-label">March</span>
                              <span class="col-md-3 date-form-input-picker-label">April</span>

                              <span class="col-md-3 date-form-input-picker-label date-form-input-picker-label-first-of-line">May</span>
                              <span class="col-md-3 date-form-input-picker-label">June</span>
                              <span class="col-md-3 date-form-input-picker-label">July</span>
                              <span class="col-md-3 date-form-input-picker-label">August</span>

                              <span class="col-md-3 date-form-input-picker-label date-form-input-picker-label-first-of-line date-form-input-picker-label-last-of-line">September</span>
                              <span class="col-md-3 date-form-input-picker-label date-form-input-picker-label-last-of-line">Octobre</span>
                              <span class="col-md-3 date-form-input-picker-label date-form-input-picker-label-last-of-line">November</span>
                              <span class="col-md-3 date-form-input-picker-label date-form-input-picker-label-last-of-line">December</span>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>

                  <div class="date-form-input-container">

                    <label class="input-label dynamic-form-input-container-label"><span class="input-label-text input-label-text-active">End Month</span> <span class="input-label-bg-mask"></span></label>

                    <div class="date-form-input">

                      <div class="form-group group form-group-extra-style">

                        <input type="text" required>

                        <label class="input-label"><span class="input-label-text">Select Month</span> <span class="input-label-bg-mask"></span></label>
                        <img class="icon button-icon" src="assets/icons/caret.svg">

                        <div class="date-form-input-picker-container">
                          <div class="date-form-input-picker row">
                              <span class="col-md-3 date-form-input-picker-label date-form-input-picker-label-first-of-line">January</span>
                              <span class="col-md-3 date-form-input-picker-label">February</span>
                              <span class="col-md-3 date-form-input-picker-label">March</span>
                              <span class="col-md-3 date-form-input-picker-label">April</span>

                              <span class="col-md-3 date-form-input-picker-label date-form-input-picker-label-first-of-line">May</span>
                              <span class="col-md-3 date-form-input-picker-label">June</span>
                              <span class="col-md-3 date-form-input-picker-label">July</span>
                              <span class="col-md-3 date-form-input-picker-label">August</span>

                              <span class="col-md-3 date-form-input-picker-label date-form-input-picker-label-first-of-line date-form-input-picker-label-last-of-line">September</span>
                              <span class="col-md-3 date-form-input-picker-label date-form-input-picker-label-last-of-line">Octobre</span>
                              <span class="col-md-3 date-form-input-picker-label date-form-input-picker-label-last-of-line">November</span>
                              <span class="col-md-3 date-form-input-picker-label date-form-input-picker-label-last-of-line">December</span>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>

                </form>

              </div>

              <div class="sub-container-form-footer">
                  <div class="rounded-button btn-secondary">
                        <img class="icon" src="assets/icons/left_arrow.svg">
                  </div>
                  <div class="rounded-button rounded-button-primary rounded-button-float-right">
                        <span class="button-text">Next</span>
                        <img class="icon button-icon" src="assets/icons/right_arrow.svg">
                  </div>
              </div>

            </div>
            <!-- end sub-container Academic year -->

            <!-- sub-container Level -->
            <div class="item" id="Level_Section">
              <div  class="sub-main-container">
                <h1 class="sub-container-main-header">Levels</h1>
                <h4 class="sub-container-sub-header">There are many variations of passages of Lorem Ipsum available, but the majority.</h4>

                <form class="sub-container-form">

                  <div class="dynamic-form-input dynamic-form-input-first">
                    <div class="form-group group">
                      <input type="text" required>
                      <label class="input-label"><span class="input-label-text">Level name</span> <span class="input-label-bg-mask"></span></label>
                    </div>
                    <div class="square-button">
                      <img class="icon" src="assets/icons/minus.svg">
                    </div>
                  </div>

                  <div class="square-button square-button-extra-style" id="Level_New_Dynamic_Form_Input">
                    <img class="icon" src="assets/icons/plus.svg">
                  </div>

                </form>

              </div>

              <div class="sub-container-form-footer">
                  <div class="rounded-button btn-secondary">
                        <img class="icon" src="assets/icons/left_arrow.svg">
                  </div>
                  <div class="rounded-button rounded-button-primary rounded-button-float-right">
                        <span class="button-text">Next</span>
                        <img class="icon button-icon" src="assets/icons/right_arrow.svg">
                  </div>
              </div>

            </div>
            <!-- end sub-container Level -->

            <!-- sub-container Classes -->
            <div class="item" id="Classe_Section">
              <div  class="sub-main-container">
                <h1 class="sub-container-main-header">Classes</h1>
                <h4 class="sub-container-sub-header">There are many variations of passages of Lorem Ipsum available, but the majority.</h4>

                <form class="sub-container-form">

                  <div class="dynamic-form-input-container">

                    <label class="input-label dynamic-form-input-container-label"><span class="input-label-text">Level name</span> <span class="input-label-bg-mask"></span></label>

                    <div class="dynamic-form-input dynamic-form-input-first">
                      <div class="form-group group">
                        <input type="text" required>
                        <label class="input-label"><span class="input-label-text">Classe name</span> <span class="input-label-bg-mask"></span></label>
                      </div>
                      <div class="square-button square-button-minus">
                        <img class="icon" src="assets/icons/minus.svg" >
                      </div>
                    </div>

                    <div class="square-button square-button-extra-style square-button-plus" id="Classe_New_Dynamic_Form_Input">
                      <img class="icon" src="assets/icons/plus.svg">
                    </div>

                  </div>


                  <div class="dynamic-form-input-container">

                    <label class="input-label dynamic-form-input-container-label"><span class="input-label-text">Level name</span> <span class="input-label-bg-mask"></span></label>

                    <div class="dynamic-form-input dynamic-form-input-first">
                      <div class="form-group group">
                        <input type="text" required>
                        <label class="input-label"><span class="input-label-text">Classe name</span> <span class="input-label-bg-mask"></span></label>
                      </div>
                      <div class="square-button square-button-minus">
                        <img class="icon" src="assets/icons/minus.svg" >
                      </div>
                    </div>

                    <div class="square-button square-button-extra-style square-button-plus" id="Classe_New_Dynamic_Form_Input">
                      <img class="icon" src="assets/icons/plus.svg">
                    </div>

                  </div>

                </form>

              </div>

              <div class="sub-container-form-footer">
                  <div class="rounded-button btn-secondary">
                        <img class="icon" src="assets/icons/left_arrow.svg">
                  </div>
                  <div class="rounded-button rounded-button-primary rounded-button-float-right">
                        <span class="button-text">Next</span>
                        <img class="icon button-icon" src="assets/icons/right_arrow.svg">
                  </div>
              </div>

            </div>
            <!-- end sub-container Classes -->

            <!-- sub-container Costs -->
            <div class="item" id="Subject_Section">
              <div  class="sub-main-container">
                <h1 class="sub-container-main-header">Subjects</h1>
                <h4 class="sub-container-sub-header">There are many variations of passages of Lorem Ipsum available, but the majority.</h4>

                <form class="sub-container-form">

                  <div class="dynamic-form-input-container dynamic-form-input-container-extra-style">

                    <label class="input-label dynamic-form-input-container-label"><span class="input-label-text">Level name</span> <span class="input-label-bg-mask"></span></label>

                    <div class="dynamic-form-input-dropdown-container">
                      <div class="dynamic-form-input-dropdown dynamic-form-input-first">
                        <div class="dynamic-form-input">

                          <div class="form-group group">

                              <select class="input-text-subject-select2" multiple name="language">
                                  <option value="Bangladesh">Bangladesh</option>
                                  <option selected value="Barbados">Barbados</option>
                                  <option selected value="Belarus">Belarus</option>
                                  <option value="Belgium">Belgium</option>
                              </select>
                              <img class="icon button-icon" src="assets/icons/caret.svg">
                          </div>

                          <div class="square-button square-button-minus">
                            <img class="icon" src="assets/icons/minus.svg">
                          </div>

                        </div>
                      </div>
                    </div>

                  </div>

                  <div class="dynamic-form-input-container dynamic-form-input-container-extra-style">

                    <label class="input-label dynamic-form-input-container-label"><span class="input-label-text">Level name</span> <span class="input-label-bg-mask"></span></label>

                    <div class="dynamic-form-input-dropdown-container">
                      <div class="dynamic-form-input-dropdown dynamic-form-input-first">
                        <div class="dynamic-form-input">

                          <div class="form-group group">

                              <select class="input-text-subject-select2" multiple name="language">
                                  <option value="Bangladesh">Bangladesh</option>
                                  <option selected value="Barbados">Barbados</option>
                                  <option selected value="Belarus">Belarus</option>
                                  <option value="Belgium">Belgium</option>
                              </select>
                              <img class="icon button-icon" src="assets/icons/caret.svg">
                          </div>

                          <div class="square-button square-button-minus">
                            <img class="icon" src="assets/icons/minus.svg">
                          </div>

                        </div>
                      </div>
                    </div>

                  </div>

                </form>

              </div>

              <div class="sub-container-form-footer">
                  <div class="rounded-button btn-secondary">
                        <img class="icon" src="assets/icons/left_arrow.svg">
                  </div>
                  <div class="rounded-button rounded-button-primary rounded-button-float-right">
                        <span class="button-text">Next</span>
                        <img class="icon button-icon" src="assets/icons/right_arrow.svg">
                  </div>
              </div>

            </div>
            <!-- end sub-container Costs -->


            <!-- sub-container Expenses -->
            <div class="item" id="Expense_Section">
              <div  class="sub-main-container">
                <h1 class="sub-container-main-header">Expenses</h1>
                <h4 class="sub-container-sub-header">There are many variations of passages of Lorem Ipsum available, but the majority.</h4>

                <form class="sub-container-form">

                    <div class="dynamic-form-input-dropdown-container">
                      <div class="dynamic-form-input-dropdown dynamic-form-input-first">
                        <div class="dynamic-form-input">
                          <div class="dynamic-form-input-float-adjust">
                          <div class="form-group group form-group-left">
                            <input type="text" class="input-text" required>
                            <label class="input-label"><span class="input-label-text">Expense name</span> <span class="input-label-bg-mask"></span></label>
                          </div>
                          <div class="form-group group form-group-right">
                            <input type="text" value="Monthly" class="input-dropdown" required>
                            <img class="icon button-icon" src="assets/icons/caret.svg">
                            <ul class="dynamic-form-input-dropdown-options">
                                <li data-val="Monthly">Monthly</li>
                                <li data-val="Annual">Annual</li>
                            </ul>
                          </div>
                          </div>
                          <div class="square-button square-button-minus">
                            <img class="icon" src="assets/icons/minus.svg">
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="square-button square-button-extra-style" id="Expense_New_Dynamic_Form_Input">
                      <img class="icon" src="assets/icons/plus.svg">
                    </div>

                </form>

              </div>

              <div class="sub-container-form-footer">
                  <div class="rounded-button btn-secondary">
                        <img class="icon" src="assets/icons/left_arrow.svg">
                  </div>
                  <div class="rounded-button rounded-button-primary rounded-button-float-right">
                        <span class="button-text">Next</span>
                        <img class="icon button-icon" src="assets/icons/right_arrow.svg">
                  </div>
              </div>

            </div>
            <!-- end sub-container Expenses -->


            <!-- sub-container Costs -->
            <div class="item" id="Costs_Section">
              <div  class="sub-main-container">
                <h1 class="sub-container-main-header">Costs</h1>
                <h4 class="sub-container-sub-header">There are many variations of passages of Lorem Ipsum available, but the majority.</h4>

                <form class="sub-container-form">

                  <div class="dynamic-form-input-container dynamic-form-input-container-extra-style dynamic-form-input-container-extra-style-composed">

                    <label class="input-label dynamic-form-input-container-label"><span class="input-label-text">Level name</span> <span class="input-label-bg-mask"></span></label>


                    <div class="dynamic-form-input-dropdown-container">
                      <div class="dynamic-form-input-dropdown dynamic-form-input-first">
                        <div class="dynamic-form-input">

                          <div class="form-group group form-group-left">
                            <input type="text" class="input-dropdown" required>
                            <label class="input-label"><span class="input-label-text">Expense Name</span> <span class="input-label-bg-mask"></span></label>
                            <img class="icon button-icon" src="assets/icons/caret.svg">
                            <ul class="dynamic-form-input-dropdown-options">
                                <li data-val="Insurance fees">
                                  <span class="expense_label">Insurance fees</span><span class="method_label">Monthly</span></li>
                                <li data-val="School fees">
                                  <span class="expense_label">School fees</span><span class="method_label">Annual</span></li>
                                <li data-val="Transport fees">
                                  <span class="expense_label">Transport fees</span><span class="method_label">Monthly</span></li>
                            </ul>
                          </div>

                          <div class="form-group group form-group-right">
                             <input type="text" class="input-text" required>
                              <label class="input-label"><span class="input-label-text">Price</span> <span class="input-label-bg-mask"></span></label>
                          </div>

                          <div class="square-button square-button-minus">
                            <img class="icon" src="assets/icons/minus.svg">
                          </div>

                        </div>
                      </div>
                    </div>

                    <div class="square-button square-button-extra-style square-button-plus" >
                      <img class="icon" src="assets/icons/plus.svg">
                    </div>

                  </div>

                  <div class="dynamic-form-input-container dynamic-form-input-container-extra-style dynamic-form-input-container-extra-style-composed">

                    <label class="input-label dynamic-form-input-container-label"><span class="input-label-text">Level name</span> <span class="input-label-bg-mask"></span></label>


                    <div class="dynamic-form-input-dropdown-container">
                      <div class="dynamic-form-input-dropdown dynamic-form-input-first">
                        <div class="dynamic-form-input">

                          <div class="form-group group form-group-left">
                            <input type="text" class="input-dropdown" required>
                            <label class="input-label"><span class="input-label-text">Expense Name</span> <span class="input-label-bg-mask"></span></label>
                            <img class="icon button-icon" src="assets/icons/caret.svg">
                            <ul class="dynamic-form-input-dropdown-options">
                                <li data-val="Insurance fees">
                                  <span class="expense_label">Insurance fees</span><span class="method_label">Monthly</span></li>
                                <li data-val="School fees">
                                  <span class="expense_label">School fees</span><span class="method_label">Annual</span></li>
                                <li data-val="Transport fees">
                                  <span class="expense_label">Transport fees</span><span class="method_label">Monthly</span></li>
                            </ul>
                          </div>

                          <div class="form-group group form-group-right">
                             <input type="text" class="input-text" required>
                              <label class="input-label"><span class="input-label-text">Price</span> <span class="input-label-bg-mask"></span></label>
                          </div>

                          <div class="square-button square-button-minus">
                            <img class="icon" src="assets/icons/minus.svg">
                          </div>

                        </div>
                      </div>
                    </div>

                    <div class="square-button square-button-extra-style square-button-plus" >
                      <img class="icon" src="assets/icons/plus.svg">
                    </div>

                  </div>

                </form>

              </div>

              <div class="sub-container-form-footer">
                  <div class="rounded-button btn-secondary">
                        <img class="icon" src="assets/icons/left_arrow.svg">
                  </div>
                  <div class="rounded-button rounded-button-primary rounded-button-float-right">
                        <span class="button-text">Next</span>
                        <img class="icon button-icon" src="assets/icons/right_arrow.svg">
                  </div>
              </div>

            </div>
            <!-- end sub-container Costs -->


        </div>

      </div>


    </div>
    <!-- end setup-main-container -->

</body>

</html>
