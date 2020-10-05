/*______________ Global Variables _____________*/

$Href = "";
$Api  = "";
$Path = "";

$domChange  = false;
$redirectTo = "";
$subFolder = "beside/";
$oldActiveTab = "";
$upActiveTab  = "";

/* input change watcher Component ______________________*/
(function($){
    var originalVal = $.fn.val;
    $.fn.val = function(){
        var result =originalVal.apply(this,arguments);
        if(arguments.length>0)
            $(this).change(); // OR with custom event $(this).trigger('value-changed');
        return result;
    };
})(jQuery);
/* End input change watcher Component __________________*/


/* domChangeWatcher _____________________________________*/

function domChangeWatcher(){

	if($domChange){
		//alert($domChange);
		return false;
	}

}

/* End domChangeWatcher _________________________________*/

/* Convert_Fr_En _________________________________*/

function Convert_Fr_En($date_){

	  $d = $date_.split("/");
	  return  $d[1]+"/"+$d[0]+"/"+$d[2];

}

/* End Convert_Fr_En _________________________________*/

/* Helpers _________________________________*/

    function emailValidator($email) {

	  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

	  return emailReg.test( $email );

	}

	function phoneValidator(phone) {

		var phoneReg =/^(0|\+212)([-. ]?[5-6-7]{1})([-. ]?[0-9]{2}){4}$/;

		return phoneReg.test(phone);

	}

	function priceValidator(price) {

		var priceReg = /^\d+$/;

		return priceReg.test(price);

	}

	function dateNaissValidator(dateNaiss) {

		var dateNaissReg = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;

		return dateNaissReg.test(dateNaiss);

	}

	function websiteValidator(website){

       var websiteReg=/^(http\:\/\/|https\:\/\/)?([a-z0-9][a-z0-9\-]*\.)+[a-z0-9][a-z0-9\-]*$/;

       return websiteReg.test(website);

   }

/* End Helpers _________________________________*/

$(document).ready(function(){

	if($('head').find('script[src="assets/scripts/dashBoard/jquery.nicescroll.min.js"]').length == 0){
		var script = '<link rel="icon" href="assets/favicon/favIcon.png">';
		$('head').append(script);
	}

	$(document).on("click",".setup-main-container",function(){

		$(".dynamic-form-input-dropdown-options").css({"opacity":"0"});
		$(".dynamic-form-input-dropdown-options").css({"display":"none"});

		$(".dynamic-form-input-dropdown-container .button-icon").removeClass("caret-rotate");
		$(".dynamic-form-input-dropdown-container .button-icon").addClass("caret-rotate-reset");
		
	});

	/* Form Component ______________________*/

	/*Dropdown Menu*/

	$(document).on("click",".input-dropdown",function(event){

		$(".dynamic-form-input-dropdown-options").css({"opacity":"0"});
		$(".dynamic-form-input-dropdown-options").css({"display":"none"});

		$(".sub-form-group").find(".button-icon").removeClass("caret-rotate");
		$(".sub-form-group").find(".button-icon").addClass("caret-rotate-reset");

		$this = $(this);

		$this.parent().find(".dynamic-form-input-dropdown-options").css({"display":"inline-block"});


		$(this).parents(".sub-form-group").find(".button-icon").removeClass("caret-rotate-reset");
		$(this).parents(".sub-form-group").find(".button-icon").addClass("caret-rotate");

		setTimeout(function(){
			$this.parent().find(".dynamic-form-input-dropdown-options").css({"opacity":"1"});
		},50);

		event.stopPropagation();
		event.preventDefault();

	});

	$(document).on("click",".dynamic-form-input-dropdown-options li",function(){

		$this = $(this);

		$text = $(this).attr("data-val");

		if($(this).attr("data-id") == "0"){
			$(this).parents(".dynamic-form-input-float-adjust").find(".interaction_icon_main").attr("src","assets/icons/emoji_good.svg");
		}else{
			$(this).parents(".dynamic-form-input-float-adjust").find(".interaction_icon_main").attr("src","assets/icons/emoji_bad.svg");
		}

		$this.parents(".dynamic-form-input-dropdown-container").find(".input-dropdown").val(" ");

		$this.parent().find(".dynamic-form-input-dropdown-options").css({"opacity":"0"});

		if($this.parents(".dynamic-form-input-dropdown-container").find(".input-dropdown").val() =="" 
			|| $this.parents(".dynamic-form-input-dropdown-container").find(".input-dropdown").val()  == null ){

			setTimeout(function(){

				$this.parents(".dynamic-form-input-dropdown-container").find(".input-dropdown").val(" ");

				setTimeout(function(){
					$this.parents(".dynamic-form-input-dropdown-container").find(".input-dropdown").val($text);
				},180);

			},5);
			
			
		}else{
			$this.parents(".dynamic-form-input-dropdown-container").find(".input-dropdown").val($text);
		}

		$(this).parents(".dynamic-form-input-dropdown-container").find(".button-icon").removeClass("caret-rotate");
		$(this).parents(".dynamic-form-input-dropdown-container").find(".button-icon").addClass("caret-rotate-reset");
		
		setTimeout(function(){
			$(".dynamic-form-input-dropdown-options").css("cssText","display:none");
		},1);

	});

	$(document).on("click",function(){

		$(".dynamic-form-input-dropdown-container").find(".button-icon").removeClass("caret-rotate");
		$(".dynamic-form-input-dropdown-container").find(".button-icon").addClass("caret-rotate-reset");

		setTimeout(function(){
			$(".dynamic-form-input-dropdown-options").css("cssText","display:none");
			$(".table-option-list").css("cssText","display:none");
			$(".sections-main-sub-container-right-main-header-option-list").css("cssText","display:none");
			$(".sections-main-sub-container-right-main-header-option-icon").css({"display":"inline-block"});
			$(".sections-main-sub-container-right-main-header-option-icon").addClass("sub-container-nav-bar-img-animation");
		},1);
	});

	$(document).on("keyPress",".input-dropdown",function(){
		return null;
	});


	/* sections-label-checkbox-container _________________*/

	$(document).on("click",".modal.in .sections-label-checkbox-main-container",function(){

		if($(this).find("div").hasClass("customCheckRounded")){

			$(this).parent(".sections-checkboxes-main-container").find(".sections-label-checkbox-main-container").addClass("container-background-style");
			$(this).parent(".sections-checkboxes-main-container").find("input").prop("checked",false);
			$(this).parent(".sections-checkboxes-main-container").find(".expense_label").css("color","var(--input-placeholder--color)");

			$(this).removeClass("container-background-style");
			$(this).find("input").prop('checked',true);
			$(this).find(".expense_label").css("color","var(--black--color)");

			Absense_Retard_Checker($(this).attr("data-val"));
			
		}else{

			if ($(this).find("input").is(':checked')) {
				$(this).find("input").click();
			}else{
				$(this).find("input").click();
			}

		}
		
	});

	/* End sections-label-checkbox-container _________________*/

	/* .tab-pane.in .sections-label-checkbox-main-container _________________*/

	$(document).on("click",".tab-pane.in .sections-label-checkbox-main-container",function(){

		if($(this).find("div").hasClass("customCheckRounded")){

			$(this).parent(".sections-checkboxes-main-container").find(".sections-label-checkbox-main-container").addClass("container-background-style");
			$(this).parent(".sections-checkboxes-main-container").find("input").prop("checked",false);
			$(this).parent(".sections-checkboxes-main-container").find(".expense_label").css("color","var(--input-placeholder--color)");

			$(this).removeClass("container-background-style");
			$(this).find("input").prop('checked',true);
			$(this).find(".expense_label").css("color","var(--black--color)");

			Absense_Retard_Checker($(this).attr("data-val"));
			
		}else{

			if ($(this).find("input").is(':checked')) {
				$(this).find("input").click();
			}else{
				$(this).find("input").click();
			}

		}
		
	});

	/* End .tab-pane.in .sections-label-checkbox-main-container _________________*/

	/* finance-page-extra-style _________________*/

	$(document).on("click",".finance-page-extra-style .sections-label-checkbox-main-container",function(){

		if($(this).find("div").hasClass("customCheckRounded")){

			$(this).parent(".sections-checkboxes-main-container").find(".sections-label-checkbox-main-container").addClass("container-background-style");
			$(this).parent(".sections-checkboxes-main-container").find("input").prop("checked",false);
			$(this).parent(".sections-checkboxes-main-container").find(".expense_label").css("color","var(--input-placeholder--color)");

			$(this).removeClass("container-background-style");
			$(this).find("input").prop('checked',true);
			$(this).find(".expense_label").css("color","var(--black--color)");

			Absense_Retard_Checker($(this).attr("data-val"));
			
		}else{

			if ($(this).find("input").is(':checked')) {
				$(this).find("input").click();
			}else{
				$(this).find("input").click();
			}

		}
		
	});

	/* End finance-page-extra-style _________________*/

	

	/* Form Component ______________________*/


	/* sections-main-sub-container-right-main _____________________________________*/

	$(".sections-main-sub-container-right-main").scroll(function(){

		var main = $(".sections-main-sub-container-right-main").scrollTop();

		if ( main > 0  ) {
			$(".sections-main-sub-container-right-main-tabs").addClass("sticky");
			$(".sections-main-sub-container-right-main").addClass("sticky_info");
		}  

		if ( main <= 0  ) {
			$(".sections-main-sub-container-right-main-tabs").removeClass("sticky");
			$(".sections-main-sub-container-right-main").removeClass("sticky_info");
		}

	});

	/* End sections-main-sub-container-right-main _________________________________*/

	/* Level Section _______________________*/

	$(document).on("click","#Level_Section #Level_New_Dynamic_Form_Input",function(){

		$("#Level_Section .dynamic-form-input").removeClass("dynamic-form-input-first");
		$dynamic_form_input = $("#Level_Section .dynamic-form-input").first().clone();
		$dynamic_form_input.find("input").val("");
		$(this).before($dynamic_form_input);

	});

	$(document).on("click","#Level_Section .square-button",function(){

		$(this).parent(".dynamic-form-input").remove();

		if($("#Level_Section .dynamic-form-input").length == 1 ){
			$("#Level_Section .dynamic-form-input").addClass("dynamic-form-input-first");
		}
		
	});	

	/* Classe Section _______________________*/

	$(document).on("click","#Classe_Section .square-button-plus",function(){

		$dynamic_form_input = $(this).parent().children(".dynamic-form-input").first().removeClass("dynamic-form-input-first").clone();
		$dynamic_form_input.find("input").val("");
		$(this).before($dynamic_form_input);

	});

	$(document).on("click","#Classe_Section .square-button-minus",function(){

		if($(this).parent(".dynamic-form-input").parent(".dynamic-form-input-container").children(".dynamic-form-input").length <= 2 ){
			$(this).parent(".dynamic-form-input").parent(".dynamic-form-input-container").children(".dynamic-form-input").addClass("dynamic-form-input-first");
		}
		
		$(this).parent(".dynamic-form-input").remove();

	});

	/* Academic Year Section _______________________*/

	$(document).on("click",".date-form-input",function(event){


		$(".date-form-input-picker-container").css({"opacity":"0"});
		$(".date-form-input-picker-container").css({"display":"none"});

		$this = $(this);

		$this.val("");

		$this.parent().find(".date-form-input-picker-container").css({"display":"inline-block"});

		setTimeout(function(){
			$this.parent().find(".date-form-input-picker-container").css({"opacity":"1"});
		},50);
		

		event.stopPropagation();
		event.preventDefault();

	});

	$(document).on("click",".sub-main-container",function(){

		$this = $(this);

		$(this).parent().find(".date-form-input-picker-container").css({"opacity":"0"});

		setTimeout(function(){
			$this.parent().find(".date-form-input-picker-container").css({"display":"none"});
		},50);

	});

	$(document).on("click",".date-form-input-picker-label",function(){

		$this = $(this);

		$this.parent().find("input").focus();

		$this.parent().find(".date-form-input-picker-label").removeClass("active");

		$text = $(this).text();

		$(this).addClass("active");		

		$this.parent().find(".date-form-input-picker-container").css({"opacity":"0"});

		setTimeout(function(){
			$this.parent().find(".date-form-input-picker-container").css({"display":"none"});
			$this.parent().find("input").val($text);
		},500);

	});

	/* Expenses Section _______________________*/

	$(document).on("click","#Expense_Section #Expense_New_Dynamic_Form_Input",function(){

		$("#Expense_Section .dynamic-form-input-dropdown").removeClass("dynamic-form-input-first");
		$dynamic_form_input = $("#Expense_Section .dynamic-form-input-dropdown-container").first().clone();
		$dynamic_form_input.find(".input-text").val("");
		$dynamic_form_input.find(".input-dropdown").val("");
		$(this).before($dynamic_form_input);

	});

	$(document).on("click","#Expense_Section .square-button-minus",function(){

		$(this).parents(".dynamic-form-input-dropdown-container").remove();

		if($("#Expense_Section .dynamic-form-input-dropdown-container").length == 1 ){
			$("#Expense_Section .dynamic-form-input-dropdown").addClass("dynamic-form-input-first");
		}
		
	});

	/* Expenses Section _______________________*/

	/* Costs Section _______________________*/

	$(document).on("click","#Costs_Section .square-button-plus",function(){

		$("#Costs_Section .dynamic-form-input-dropdown").removeClass("dynamic-form-input-first");
		$dynamic_form_input = $(this).parent().children(".dynamic-form-input-dropdown-container").first().clone();
		$dynamic_form_input.find(".input-text").val("");
		$dynamic_form_input.find(".input-dropdown").val("");
		$(this).before($dynamic_form_input);

	});

	$(document).on("click","#Costs_Section .square-button-minus",function(){

		if($(this).parents(".dynamic-form-input-container-extra-style").children(".dynamic-form-input-dropdown-container").length <= 2 ){
			$(this).parents(".dynamic-form-input-container-extra-style").children(".dynamic-form-input-dropdown-container").children(".dynamic-form-input-dropdown").addClass("dynamic-form-input-first");
		}

		$(this).parents(".dynamic-form-input-dropdown-container").remove();

	});

	/* Subject Section _______________________*/

	if($(".input-text-subject").length > 0){
		$(".input-text-subject").fastselect({
			 userOptionAllowed: true,
			 userOptionPrefix: 'new ',
			 noResultsText: 'No Data',
			 clearQueryOnSelect:true
		});
	}

	function hideSelected(value) {
	  if (value && !value.selected) {
	    return $('<span>' + value.text + '</span>');
	  }
	}

	if($(".input-text-subject-select2").length > 0){
		$(".input-text-subject-select2").select2({
		  tags: true,
		  dropdownPosition: 'below',
		  tokenSeparators: [',', ' '],
  		  minimumResultsForSearch: -1,
  		  templateResult: hideSelected
		});
	}

	if($(".input-text-month-select2").length > 0){
		$(".input-text-month-select2").select2({
		  tags: true,
		  dropdownPosition: 'below'
		  /*tokenSeparators: [',', ' '],
  		  minimumResultsForSearch: -1,
  		  templateResult: hideSelected*/
		});
	}

	if($(".input-text-year-select2").length > 0){
		$(".input-text-year-select2").select2({
		  tags: true,
		  dropdownPosition: 'below'
		  /*tokenSeparators: [',', ' '],
  		  minimumResultsForSearch: -1,
  		  templateResult: hideSelected*/
		});
	}

	$('.owl-carousel').owlCarousel({
	    loop:true,
	    margin:10,
	    nav:true,
	    singleItem:true,
	    pagination: false,
	    dots:false
	    //mouseDrag: false,
		//touchDrag: false
	});

	/* input-time __________________________*/

	$('.input-time').timepicker({

		timeFormat: 'HH:mm',
	    interval: 60,
	    dynamic: false,
	    dropdown: true,
	    scrollbar: true

	});

	/* input-time __________________________*/


	/* input-time change __________________________*/

	$(document).on("click",".input-time",function(){

		$(this).timepicker({

			timeFormat: 'HH:mm',
		    interval: 60,
		    dynamic: true,
		    dropdown: true,
		    scrollbar: true

		});

	});

    $('.input-time').timepicker('option', 'change', function(time) {

		$(this).parents(".dynamic-form-input-text-container-icon")
			   .next(".dynamic-form-input-text-container-icon").find(".input-time")
       		   .timepicker('option', 'minTime', time ).val($(this).val());

    });

	/* input-time __________________________*/

	/* input-date-limited __________________________*/

	$(document).on("click",".input-date-limited",function(){

		$this_ = $(this);

		$this_.datepicker({
			dateFormat: "dd/mm/yyyy",
			showOtherMonths: true,
			firstDay: 1,
			autoClose: true,
			maxDate:new Date(),
			navTitles: {
			      days: 'M - yyyy',
			      months: 'yyyy',
			      years: 'yyyy1 - yyyy2'
				},
			language:'en'
		});		

		$this_.focus();
		console.log(".input-date-limited");

	});

	/* End input-date-limited __________________________*/

	/* input-date-limited __________________________*/

	$(document).on("click",".input-date-illimited",function(){

		$this_ = $(this);

		$this_.datepicker({
			dateFormat: "dd/mm/yyyy",
			showOtherMonths: true,
			firstDay: 1,
			autoClose: true,
			navTitles: {
			      days: 'M - yyyy',
			      months: 'yyyy',
			      years: 'yyyy1 - yyyy2'
				},
			language:'en'
		});		
			
		$this_.focus();
		console.log(".input-date-illimited");

	});

	/* End input-date-limited __________________________*/

	/* input-date-from-today __________________________*/

	$(document).on("click",".input-date-from-today",function(){

		$this_ = $(this);

		$this_.datepicker({
			dateFormat: "dd/mm/yyyy",
			showOtherMonths: true,
			firstDay: 1,
			autoClose: true,
			navTitles: {
			      days: 'M - yyyy',
			      months: 'yyyy',
			      years: 'yyyy1 - yyyy2'
				},
			language:'en'
		});		
			
		$this_.focus();
		console.log(".input-date-illimited");

	});

	/* End input-date-from-today __________________________*/

	/* input-date-from-today ______________________________*/

	$(document).on('change','.input-date',function() {


           	$(this).parents(".dynamic-form-input-text-container-icon")
				   .next(".dynamic-form-input-text-container-icon")
				   .find(".input-date").datepicker("remove")
				   .datepicker({
						dateFormat: "dd/mm/yyyy",
						showOtherMonths: true,
						firstDay: 1,
						autoClose: true,
						startDate:new Date(Convert_Fr_En($(this).val())),
						navTitles: {
						      days: 'M - yyyy',
						      months: 'yyyy',
						      years: 'yyyy1 - yyyy2'
							}
					});		
				   
    });
	
	/* End input-date-from-today __________________________*/


	/* StudentBtnEdit ________________________*/

	$(document).on("click","#StudentBtnEdit",function(){

		$this = $(this);
		$(".sub-container-form-footer").toggleClass("visibility");

	});

	/* End StudentBtnEdit ________________________*/

	/* discard-changes ________________________*/

	$(document).on("click",".discard-changes",function(){

		/*____ Hide parent container if it needs ____*

		$(".tab-pane.active .sub-container-form-footer").removeClass("show-footer");
		$(".tab-pane.active .sub-container-form-footer").addClass("hide-footer");
		$(".tab-pane.active .modal .sub-container-form-footer").removeClass("hide-footer");
		
		setTimeout(function(){
			$(".sections-main-sub-container-right-main").css("cssText","height:95vh");
		},50);

  		*/

  		/*____ Edit modals hide footers then adapt height ____*/

  		$(".modal-dom-change-watcher .modal-content").css({"max-height":"100vh"});
  		$(".modal-dom-change-watcher .modal-body").css("cssText","height: 100%;max-height: 80vh");

  		$(".modal-dom-change-watcher .sub-container-form-footer").removeClass("show-footer");
  		$(".modal-dom-change-watcher .sub-container-form-footer").addClass("hide-footer");

  		// ===> Enable to fire change  Confirm modal  : $domChange=true;

	});

	/* End discard-changes ________________________*/


	/* side-bar-li ________________________*/

	$(".side-bar-extra-style .side-bar-li").hover(

	  function() {
	  	if(!$(this).hasClass("active")){
	  	   $(this).find(".side-bar-li-img").attr("src","assets/icons/sidebar_icons/side_bar_menu/"+$(this).attr("data-asset-active"));
	  	   $(this).find(".side-bar-li-span").addClass("side-bar-li-span-active");
	  	   $(this).find(".side-bar-li-span").removeClass("side-bar-li-span-inactive");
	  	}
	  }, function() {
	  	if(!$(this).hasClass("active")){
	  	   $(this).find(".side-bar-li-img").attr("src","assets/icons/sidebar_icons/side_bar_menu/"+$(this).attr("data-asset-inactive"));
	  	   $(this).find(".side-bar-li-span").removeClass("side-bar-li-span-active");
	  	   $(this).find(".side-bar-li-span").addClass("side-bar-li-span-inactive");
	  	}
	  }
	);

	/* End side-bar-li ________________________*/


	/* side-bar-li auto select  ________________________*/

	$pathname = window.location.pathname;

	if($pathname.includes($subFolder)){

		$pathname = $pathname.split($subFolder)[1];
		if((typeof $pathname !== 'undefined' )){
			if($pathname.includes('/')){
			   $pathname.replace("/","");
			   //console.log("defined");
			}else{
			   //console.log("undefined");
			}
		}

	}else{

		$pathname = $pathname.split($subFolder)[1];
		
		if((typeof $pathname !== 'undefined' )){
			if($pathname.includes('/')){
			   $pathname.replace("/","");
			   //console.log("defined");
			}else{
			   //console.log("undefined");
			}
		}
	}

	$(".side-bar-extra-style .side-bar-li").each(function(){

		
		$(".side-bar-li-span").removeClass("side-bar-li-span-active");
		$(".side-bar-li-span").addClass("side-bar-li-span-inactive");

		if($(this).find("a").attr("href").includes($pathname)){
			$(this).addClass("active");
			$(this).find(".side-bar-li-img").attr("src","assets/icons/sidebar_icons/side_bar_menu/"+$(this).attr("data-asset-active"));
	  	   	$(this).find(".side-bar-li-span").addClass("side-bar-li-span-active");
	  	   	$(this).find(".side-bar-li-span").removeClass("side-bar-li-span-inactive");
			return false;
		}

	});

	/* End side-bar-li auto select  ________________________*/

	/* side-bar-li a  ________________________*/

	$(document).on("click",".side-bar-li a",function(event){

		$redirectTo = $(this).attr("href");

		if($domChange){
			jQuery.noConflict(); 
			$('#ChangesModal').modal('show');
			event.preventDefault();
			event.stopPropagation();
		}

	});

	/* End side-bar-li a ________________________*/

	/* secondary-pink-button ____________________________*/

	$(document).on("click",".secondary-pink-button",function(event){

		$domChange = false;

		$('#ChangesModal').modal('hide');

		$pathname = window.location.pathname;
		$url     = window.location.host;

		if($pathname.includes($subFolder)){
			$url = "/"+$subFolder+$redirectTo;
		}else{
			$url = "/"+$redirectTo;
		}

		if($redirectTo != ""){
			window.location.href = $url;
		}

	});

	/* End secondary-pink-button ________________________*/

	/* secondary-pink-button ____________________________*/

	$(document).on("click",".sections-main-sub-container-left-card",function(event){

		if($domChange){
			jQuery.noConflict(); 
			$('#ChangesModal').modal('show');
			event.preventDefault();
			event.stopPropagation();
		}

	});

	/* End secondary-pink-button ________________________*/

	


	/* input-dropdown remove focus     _________________________*/

	$('.input-dropdown').focus(function(e) {
	    $(this).blur();
	});

	/* End  input-dropdown remove focus ________________________*/

	/* input-label-text remove focus     _________________________*/

	$(document).on("click",".input-label",function(){
		$(this).parents(".form-group").find("input").focus();
		$(this).parents(".form-group").find(".input-dropdown").click();
		return false;
	});

	/* End  input-dropdown remove focus ________________________*/


	/* button-icon remove focus ________________________*/

	$(document).on("click",".button-icon",function(){
		$(this).siblings("input").click();
		$(this).siblings("input").focus();
		return false;
	});

	$(document).on("click",".caret-rotate",function(){

		$this = $(this);
		$this.parents(".sub-form-group").find(".button-icon").removeClass("caret-rotate");
		$this.parents(".sub-form-group").find(".button-icon").addClass("caret-rotate-reset");

		setTimeout(function(){
			$(".dynamic-form-input-dropdown-options").css("cssText","display:none");
		},1);

	});


	/* End button-icon remove focus ________________________*/

	/* table-option-icon ________________________*/

	$(document).on("click",".table-option-icon",function(event){

		$(".table-option-list").css("cssText","display:none");

		$(this).siblings(".table-option-list").css("display","block");
		
		event.preventDefault();
		event.stopPropagation();

	});

	/* End table-option-icon _________________*/

	/* tab-pane  ____________________________*/

	$(".sections-main-sub-container-right-main").css("cssText","height:94vh");

	setTimeout(function(){
		if($(".tab-pane:visible").find(".sub-container-form-footer-container").length == 1){
			$(".sections-main-sub-container-right-main").css("cssText","height:calc(100vh - 120px)");
		}

		if($(".tab-pane:visible").find(".sub-container-form-footer-container").length == 1 
				&& $(".tab-pane:visible").attr("id") == "Details" 
				|| $(".tab-pane:visible").attr("id") == "ExamsDetails" 
				|| $(".tab-pane:visible").attr("id") == "HomeworkDetails" ) {
				$(".sections-main-sub-container-right-main").css("cssText","height:94vh");
		}

	},500);

	$(document).on("click",".sections-main-sub-container-right-main-tabs li",function(event){

		domChangeWatcher();

		$(".tab-pane.active .modal .sub-container-form-footer").removeClass("hide-footer");

		if($(this).find("a").attr("href") == "#Details"){
			$(".sections-main-sub-container-right-main .input-img-container .rounded-button").addClass("show-icon");
			$(".sections-main-sub-container-right-main .input-img-container .rounded-button").removeClass("hide-icon");
		}else{
			$(".sections-main-sub-container-right-main .input-img-container .rounded-button").addClass("hide-icon");
			$(".sections-main-sub-container-right-main .input-img-container .rounded-button").removeClass("show-icon");
		}

		$(".sections-main-sub-container-right-main").css("cssText","height:94vh");

		setTimeout(function(){

			if($(".tab-pane:visible").find(".sub-container-form-footer-container").length == 1 ){

				$(".sections-main-sub-container-right-main").css("cssText","height:calc(100vh - 120px)");
				
				if($(".tab-pane:visible").find(".sub-container-form-footer-container").children(".hide-footer").length > 0 ){
					$(".sections-main-sub-container-right-main").css("cssText","height:94vh");
				}
			}

		},500); 

	});

	$(document).on("mouseenter",".sections-main-sub-container-right-main-tabs li",function(event){

		$oldActiveTab = $(".sections-main-sub-container-right-main-tabs li.active a").attr("href") ;

	});

	/* End tab-pane  ________________________*/


	/* input-text  ____________________________*/

		$(document).on("keyup blur",".sections-main-sub-container-left-search-bar .input-text",function(event){
			if($(this).val().length == 0 ){
				$(this).siblings(".icon").attr("src","assets/icons/sidebar_icons/search.svg");
				$(this).siblings(".icon").removeClass("input-text-empty");
			}else{
				$(this).siblings(".icon").attr("src","assets/icons/sidebar_icons/close.svg");
				$(this).siblings(".icon").addClass("input-text-empty");
			}
		});

	/* End input-text  ________________________*/

	/* input-text-empty ________________________*/

		$(document).on("click",".input-text-empty",function(event){
				$(this).attr("src","assets/icons/sidebar_icons/search.svg");
				$(this).siblings(".input-text").val("");
				$(this).removeClass("input-text-empty");
		});

	/* End input-text-empty ________________________*/

	/* input-text  ____________________________*/

		$(document).on("keyup blur",".filter-sections-search-container .input-text",function(event){
			if($(this).val().length == 0 ){
				$(this).siblings(".icon").attr("src","assets/icons/sidebar_icons/search.svg");
				$(this).siblings(".icon").removeClass("input-text-empty");
			}else{
				$(this).siblings(".icon").attr("src","assets/icons/sidebar_icons/close.svg");
				$(this).siblings(".icon").addClass("input-text-empty");
			}
		});

	/* End input-text  ________________________*/

	/* input-text-empty ________________________*/

		$(document).on("click",".input-text-empty",function(event){
				$(this).attr("src","assets/icons/sidebar_icons/search.svg");
				$(this).siblings(".input-text").val("");
				$(this).removeClass("input-text-empty");
		});

	/* End input-text-empty ________________________*/

	/* Tabs dom-change-watcher ___________________________________________________________________________________*/

	/* input-text-empty ____________________________*/

	$(document).on('keydown','.dom-change-watcher input', function() {

		if(!$(this).parents(".modal").length == 1){

			$(".tab-pane:visible .sub-container-form-footer").addClass("show-footer");
	  		

	  		$domChange=true;
	  		setTimeout(function(){
				$(".tab-pane:visible .sub-container-form-footer").removeClass("hide-footer");
				$(".tab-pane:visible .sections-main-sub-container-right-main").css("cssText","height:calc(100vh - 120px)");
	  		},25);

		}

	});

	/* End input-text-empty ________________________*/


	/* input-text-empty ____________________________*/

	$(document).on('change','.dom-change-watcher input', function() {

		if(!$(this).parents(".modal").length == 1){

			$(".tab-pane:visible .sub-container-form-footer").addClass("show-footer");
	  		$(".sections-main-sub-container-right-main").css("cssText","height:calc(100vh - 120px)");

	  		$domChange=true;

	  		setTimeout(function(){
				$(".tab-pane:visible .sub-container-form-footer").removeClass("hide-footer");
	  		},25);

		}

	});

	/* End input-text-empty ________________________*/

	/* input-text-empty ____________________________*/

	$(document).on('keydown','.dom-change-watcher textarea', function() {

		if(!$(this).parents(".modal").length == 1){

			$(".tab-pane:visible  .sub-container-form-footer").addClass("show-footer");
	  		$(".sections-main-sub-container-right-main").css("cssText","height:calc(100vh - 120px)");
	  		$domChange=true;
	  		setTimeout(function(){
				$(".sub-container-form-footer").removeClass("hide-footer");
	  		},25);

	  		if($(this).val() == ""){
	  			$(this).css("cssText","background-color : var(--input-active-bg-color) !important ;");
	  		}else{
	  			$(this).css("cssText","background-color : var(--white-color) !important ;");
	  		}
  		}

	});

	/* End input-text-empty ________________________*/

	/* End Tabs dom-change-watcher ____________________________________________________________________________________*/


	/* Modal dom-change-watcher ___________________________________________________________________________________*/

	/* input-text-empty ____________________________*/

	$(document).on('keydown','.modal-dom-change-watcher input', function() {

  		// ===> Enable to fire change  Confirm modal  : $domChange=true;

  		setTimeout(function(){
  			$(".modal-dom-change-watcher.in .modal-content").css({"max-height":"calc(100vh - 29.5vh)"});
  			$(".modal-dom-change-watcher.in .modal-body").css("cssText","max-height:calc(100vh - 29.5vh)");
  		},25);

  		setTimeout(function(){
  			$(".modal.in .sub-container-form-footer").removeClass("hide-footer");
			$(".modal.in .sub-container-form-footer").addClass("show-footer");
  		},50);

	});

	/* End input-text-empty ________________________*/


	/* input-text-empty ____________________________*/

	$(document).on('change','.modal-dom-change-watcher input', function() {
	
  		// ===> Enable to fire change  Confirm modal  : $domChange=true;

  		setTimeout(function(){
  			$(".modal-dom-change-watcher.in .modal-content").css({"max-height":"calc(100vh - 29.5vh)"});
  			$(".modal-dom-change-watcher.in .modal-body").css("cssText","max-height:calc(100vh - 29.5vh)");
  		},25);

  		setTimeout(function(){
  			$(".modal.in .sub-container-form-footer").removeClass("hide-footer");
			$(".modal.in .sub-container-form-footer").addClass("show-footer");
  		},50);

	});

	/* End input-text-empty ________________________*/

	/* input-text-empty ____________________________*/

	$(document).on('keydown','.modal-dom-change-watcher textarea', function() {

  		// ===> Enable to fire change  Confirm modal  : $domChange=true;

  		setTimeout(function(){
  			$(".modal-dom-change-watcher.in .modal-content").css({"max-height":"calc(100vh - 29.5vh)"});
  			$(".modal-dom-change-watcher.in .modal-body").css("cssText","max-height:calc(100vh - 29.5vh)");
  		},25);

  		setTimeout(function(){
  			$(".modal.in .sub-container-form-footer").removeClass("hide-footer");
			$(".modal.in .sub-container-form-footer").addClass("show-footer");
  		},50);
  		
	});

	/* dynamic-form-input-container-type ____________________________*/

	$(document).on('click','.modal-dom-change-watcher.in .sections-label-checkbox-container ', function() {

  		// ===> Enable to fire change  Confirm modal  : $domChange=true;

  		setTimeout(function(){
  			$(".modal-dom-change-watcher.in .modal-content").css({"max-height":"calc(100vh - 29.5vh)"});
  			$(".modal-dom-change-watcher.in .modal-body").css("cssText","max-height:calc(100vh - 29.5vh)");
  		},25);

  		setTimeout(function(){
  			$(".modal.in .sub-container-form-footer").removeClass("hide-footer");
			$(".modal.in .sub-container-form-footer").addClass("show-footer");
  		},50);
  		
	});

	/* End dynamic-form-input-container-type ________________________*/

	/* End modal dom-change-watcher ____________________________________________________________________________________*/

	/* #Details #Parents_New_Dynamic_Form_Input _______________________*/

	$(document).on("click",".dom-change-watcher #Parents_New_Dynamic_Form_Input",function(){

		if(!$(this).parents(".modal").length == 1){

			$("#Details .sections-main-sub-container-right-main-rows-parents-details .dynamic-form-input-parent").removeClass("dynamic-form-input-first");
			$dynamic_form_input = $("#Details .sections-main-sub-container-right-main-rows-parents-details .dynamic-form-input-parent").first().clone();
			$dynamic_form_input.find("input").val("");
			$(this).parent().before($dynamic_form_input);

			$(".sub-container-form-footer").addClass("show-footer");
	  		$(".sections-main-sub-container-right-main").css("cssText","height:calc(100vh - 120px)");
	  		$domChange=true;
	  		setTimeout(function(){
				$(".sub-container-form-footer").removeClass("hide-footer");
	  		});
	  	}


	});

	$(document).on("click","#Details .square-button",function(){

		if(!$(this).parents(".modal").length == 1){

			$(this).parents(".dynamic-form-input-parent").remove();

			if($("#Details .sections-main-sub-container-right-main-rows-parents-details .dynamic-form-input-parent").length == 1 ){
				$("#Details .sections-main-sub-container-right-main-rows-parents-details .dynamic-form-input-parent").addClass("dynamic-form-input-first");
			}

			$(".sub-container-form-footer").addClass("show-footer");
	  		$(".sections-main-sub-container-right-main").css("cssText","height:calc(100vh - 120px)");
	  		$domChange=true;
	  		setTimeout(function(){
				$(".sub-container-form-footer").removeClass("hide-footer");
	  		});

  		}
		
	});

	/* End #Details #Parents_New_Dynamic_Form_Input _______________________*/


	/* #AddStudentModal #Parents_New_Dynamic_Form_Input _______________________*/


	$(document).on("click","#Modal_Parents_New_Dynamic_Form_Input",function(){
		
			$(".modal .dynamic-form-input-parent").removeClass("dynamic-form-input-first");
			$dynamic_form_input = $(".modal .dynamic-form-input-parent").first().clone();
			$dynamic_form_input.find("input").val("");
			$(this).parent().before($dynamic_form_input);

	});


	$(document).on("click","#AddStudentModal .square-button",function(){

			$(this).parents(".dynamic-form-input-parent").remove();

			if($("#AddStudentModal .dynamic-form-input-parent").length == 1 ){
				$("#AddStudentModal .dynamic-form-input-parent").addClass("dynamic-form-input-first");
			}
		
	});

	/* End #AddStudentModal #Parents_New_Dynamic_Form_Input _______________________*/


	/* .sub-container-nav-bar-img _______________________*/

	$(document).on("click",".sub-container-nav-bar-img",function(){

		$(this).css("cssText","display:none");

		$(".sub-container-nav-bar-profile-dropdown-mask").css({"display":"inline-block"});

		setTimeout(function(){
			$(".sub-container-nav-bar-profile-dropdown-mask").css({"opacity":"1"});
		},0.5);
		
		event.preventDefault();
		event.stopPropagation();

	});

	/* End .sub-container-nav-bar-img _______________________*/


	/* sub-container-nav-bar-profile-dropdown-close __________________________*/

	$(document).on("click",".sub-container-nav-bar-profile-dropdown-close",function(){

		$(".sub-container-nav-bar-profile-dropdown-mask").css({"opacity":"0"});

		setTimeout(function(){
			$(".sub-container-nav-bar-profile-dropdown-mask").css({"display":"none"});
		},25);

		$(".sub-container-nav-bar-img").css({"display":"inline-block"});

		$(".sub-container-nav-bar-img").addClass("sub-container-nav-bar-img-animation");

		
	});

	/* End sub-container-nav-bar-profile-dropdown-close _______________________*/


	/* #Exams tbody tr __________________________*/

	$(document).on("click","#Exams tbody tr",function(){
		$('#ExamDetailModal').modal('show');
	});

	/* End #Exams tbody tr _______________________*/	

	/* #Homework tbody tr __________________________*/

	$(document).on("click","#Homework tbody tr",function(){
		jQuery.noConflict(); 
		$('#HomeworkDetailModal').modal('show');
	});

	/* End #Homework tbody tr _______________________*/


	/* #Absence .table-option-list-li-edit __________________________*/

	$(document).on("click","#Absence .table-option-list-li-edit",function(){
		$('#EditAbsenceModal').modal('show');

		$(".modal-dom-change-watcher .modal-content").css({"max-height":"100vh"});
  		$(".modal-dom-change-watcher .modal-body").css("cssText","height: 100%;max-height: 80vh");

  		$(".modal-dom-change-watcher .sub-container-form-footer").removeClass("show-footer");
  		$(".modal-dom-change-watcher .sub-container-form-footer").addClass("hide-footer");
	});

	/* End #Absence .table-option-list-li-edit _______________________*/

	/* #Absence .table-option-list-li-delete __________________________*/

	$(document).on("click","#Absence .table-option-list-li-delete",function(){
		$('#ConfirmDeleteModal').modal('show');
	});

	/* End #Absence .table-option-list-li-delete _______________________*/


	/* #Attitude .table-option-list-li-edit __________________________*/

	$(document).on("click","#Attitude .table-option-list-li-edit",function(){

		$('#EditAttitudeModal').modal('show');

		$(".modal-dom-change-watcher .modal-content").css({"max-height":"100vh"});
  		$(".modal-dom-change-watcher .modal-body").css("cssText","height: 100%;max-height: 80vh");
  		$(".modal-dom-change-watcher .sub-container-form-footer").removeClass("show-footer");
  		$(".modal-dom-change-watcher .sub-container-form-footer").addClass("hide-footer");

	});

	/* End #Attitude .table-option-list-li-edit _______________________*/

	/* #Absence .table-option-list-li-delete __________________________*/

	$(document).on("click","#Attitude .table-option-list-li-delete",function(){
		$('#ConfirmDeleteModal').modal('show');
	});

	/* End #Attitude .table-option-list-li-delete _______________________*/


	/*.sections-main-sub-container-right-main-header-option-list-span-delete __________________________*/

	$(document).on("click",".sections-main-sub-container-right-main-header-option-list-li-delete",function(){
		$('#ConfirmDeleteModal').modal('show');
	});

	/* End .sections-main-sub-container-right-main-header-option-list-span-delete _______________________*/

	/* sections-main-sub-container-right-main-header-option-icon ________________________*/

	$(document).on("click",".sections-main-sub-container-right-main-header-option-icon",function(event){

		$(".sections-main-sub-container-right-main-header-option-list").css("cssText","display:none");

		$(this).css("cssText","display:none");

		$(this).siblings(".sections-main-sub-container-right-main-header-option-list").css("display","block");
		
		event.preventDefault();
		event.stopPropagation();

	});

	/* End sections-main-sub-container-right-main-header-option-icon _________________*/

	/* input-user-login _________________*/

	$(document).on('keyup','.input-user-login', function() {

		$('.input-user-login').removeClass("input-validation-error");

		if( $(this).val() !== "" && (emailValidator($(this).val()) || phoneValidator($(this).val())) ){

			$('.input-user-login').removeClass("input-validation-error");

			$(".sub-container-form-footer").addClass("show-footer");

	  		setTimeout(function(){
				$(".sub-container-form-footer").removeClass("hide-footer");
				$(".sections-main-sub-container-right-main").css("height",":calc(100% - 60px)");
	  		},25);

		}else{

			if( $(this).val() == "" ){

				$('.input-user-login').addClass("input-validation-error");

			}

			$(".sub-container-form-footer").removeClass("show-footer");

	  		setTimeout(function(){
				$(".sub-container-form-footer").addClass("hide-footer");
				$(".sections-main-sub-container-right-main").css("height",":calc(100%)");
	  		},25);

		}

	});

	/* End input-user-login _________________*/

	/* End input-user-code _________________*/

	$(document).on('keydown','.input-user-code', function() { 

		$('.input-user-code').removeClass("input-validation-error");

		if( $(this).val() !== "" ){

			if(String($(this).val()).length >= 5 ) {

				$('.input-user-code').removeClass("input-validation-error");

				$(".sub-container-form-footer").addClass("show-footer");

		  		setTimeout(function(){
					$(".sub-container-form-footer").removeClass("hide-footer");
					$(".sections-main-sub-container-right-main").css("height",":calc(100% - 60px)");
		  		},25);

	  		}else{

	  			$(".sub-container-form-footer").removeClass("show-footer");

		  		setTimeout(function(){
					$(".sub-container-form-footer").addClass("hide-footer");
					$(".sections-main-sub-container-right-main").css("height",":calc(100%)");
		  		},25);
	  		}

		}else{

			if( $(this).val() == "" ){

				$('.input-user-code').addClass("input-validation-error");

			}

			$(".sub-container-form-footer").removeClass("show-footer");

	  		setTimeout(function(){
				$(".sub-container-form-footer").addClass("hide-footer");
				$(".sections-main-sub-container-right-main").css("height",":calc(100%)");
	  		},25);

		}

	});

	/* End input-user-code _________________*/

	/* Login_Section_Btn _________________*/


	$(document).on("click","#Login_Section_Btn",function(event){

		// test if phone or email exist 
		 $.ajax({
            type: 'post',
            url: '/verify',
            data: {
            	email:$('input[name=email]').val(),
            },
            dataType: 'json'
          })
          .done(function(res){

              if (res.exist)
              {
              		$(".sub-container-form-footer").removeClass("show-footer");
					$(".sub-container-form-footer").addClass("hide-footer");
					$(".sections-main-sub-container-right-main").css("height",":calc(100%)");
                 	owl.trigger('owl.next');
              } else {
               	$("#Login_Section .sections-main-sub-container-right-main-note").removeClass("input-validation-error-feedback-hide");
				$("#Login_Section .sections-main-sub-container-right-main-note").addClass("input-validation-error-feedback-show");
              }
          });

		// On success 
		
		event.preventDefault();
		event.stopPropagation();

	});


	/* End Login_Section_Btn ________________*/


	/* Code_Section_Btn ________________*/

		$(document).on("click","#Code_Section_Btn",function(event){

		
		// disable btn click and change arrow by spin while check login   => 

		$svg =` <svg class="icon button-icon button-icon-extra-style" version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
				   width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
				  <path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
				    s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
				    c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/>
				  <path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
				    C22.32,8.481,24.301,9.057,26.013,10.047z">
				    <animateTransform attributeType="xml"
				      attributeName="transform"
				      type="rotate"
				      from="0 20 20"
				      to="360 20 20"
				      dur="0.5s"
				      repeatCount="indefinite"/>
				    </path>
				</svg>`;

		 $(this).find("img").replaceWith($svg);

		$.ajax({
            type: 'post',
            url: '/login',
            data: {
            	code:$('input[name=code]').val(),
            	email:$('input[name=email]').val()
            },
            dataType: 'json'
          })
          .done(function(res){

              if (res.login)
              {
              		window.location.href = '/Students';
              } else {
              	// login failed : enable btn  => 
               		$img =`<img class="icon button-icon" src="assets/icons/right_arrow.svg"> `;
					$(this).find("svg").replaceWith($img);
					$('.input-user-code').addClass("input-validation-error");
					$("#Code_Section .sections-main-sub-container-right-main-note").removeClass("input-validation-error-feedback-hide");
					$("#Code_Section .sections-main-sub-container-right-main-note").addClass("input-validation-error-feedback-show");
              }
          });
	});

	/* End Code_Section_Btn ________________*/

	$(document).on("click",".sections-main-sub-container-right-main-header-option-icon",function(event){

		$(".sections-main-sub-container-right-main-header-option-list").css("cssText","display:none");

		$(this).css("cssText","display:none");

		$(this).siblings(".sections-main-sub-container-right-main-header-option-list").css("display","block");
		
		event.preventDefault();
		event.stopPropagation();

	});
	
	/* .finance-page-extra-style .col-text-align img _______________________*/

	$(".finance-page-extra-style .col-text-align img").on("mouseenter",function(e){

			$this = $(this);

			$obj = JSON.parse($(this).attr("data-obj"));


			$(".custmized-tooltip").css({
				display:"inline-block"
			});

			$(".custmized-tooltip-label-value").text($obj.Expence);
			$(".custmized-tooltip-amount-value").text($obj.Amount);
			$(".custmized-tooltip-status-value").text($obj.Status);


			if($obj.BoolStatus == "0"){
				$(".custmized-tooltip-status-value").addClass("custmized-tooltip-value-color-green");
				$(".custmized-tooltip-status-value").removeClass("custmized-tooltip-value-color-red");
			}else{
				$(".custmized-tooltip-status-value").removeClass("custmized-tooltip-value-color-green");
				$(".custmized-tooltip-status-value").addClass("custmized-tooltip-value-color-red");
			}


			setTimeout(function(){

				// left : - 133.5
				// top - 150 

				offset_ = 0.5;

				if($(".custmized-tooltip").outerWidth() <= 160 ){
					offset_ = 25;
					console.log("width "+$(".custmized-tooltip").outerWidth());
				}else if($(".custmized-tooltip").outerWidth() <= 190 ){
					offset_ = 12;
					console.log("width "+$(".custmized-tooltip").outerWidth());
				}

				$(".custmized-tooltip").css({
					opacity:1,
					left:(35+$this.offset().left - 133 + offset_  )+"px",
					top:($this.offset().top + 35 )+"px"
				});


			},5);

			setTimeout(function(){

				// left : - 133.5
				// top - 150 

				offset_ = 0.5;

				if($(".custmized-tooltip").outerWidth() <= 160 ){
					offset_ = 25;
					console.log("width "+$(".custmized-tooltip").outerWidth());
				}else if($(".custmized-tooltip").outerWidth() <= 190 ){
					offset_ = 12;
					console.log("width "+$(".custmized-tooltip").outerWidth());
				}

				$(".custmized-tooltip").css({
					opacity:1,
					left:(35+$this.offset().left - 133 + offset_  )+"px",
					top:($this.offset().top + 35 )+"px"
				});


			},25);


	});

	$(".finance-page-extra-style .col-text-align img ").on("mouseleave",function(e){
		$(".custmized-tooltip").css({
			display:"none",
			opacity:0
		})
	});

	/* End .finance-page-extra-style .col-text-align img _______________________*/



	/* modal-card-container _________________*/

	$(document).on("click",".modal-card-container",function(){

		if($(this).attr("data-val") == "Retard" ){
			$("#AddAbsenceModal .sections-label-checkbox-main-container[data-val='Retard']").trigger("click");
		}else{
			$("#AddAbsenceModal .sections-label-checkbox-main-container[data-val='Absence']").trigger("click");
		}

		//$("#NewActionModal").modal("hide");
		
	});

	/* End modal-card-container _________________*/

	function Absense_Retard_Checker($type){

		$session = $(".modal.in .dynamic-form-input-container-session").find("input:checked").attr("data-val");
		$type    = $(".modal.in .dynamic-form-input-container-type").find("input:checked").attr("data-val");

		console.log($session+" __ "+$type);

		if($type == "Absence"){

			$(".dynamic-form-input-container-session").fadeIn().slideDown();

			if($session == "Session"){
				$(".dynamic-form-input-container-multi-date").fadeOut().slideUp();
				$(".dynamic-form-input-container-one-date").fadeIn().slideDown();
				$(".dynamic-form-input-container-multi-time").fadeIn().slideDown();
			}else{
				$(".dynamic-form-input-container-multi-date").fadeIn().slideDown();
				$(".dynamic-form-input-container-one-date").fadeOut().slideUp();
				$(".dynamic-form-input-container-multi-time").fadeOut().slideUp();
			}	

		}else{
			$(".dynamic-form-input-container-session").fadeOut().slideUp();
			$(".dynamic-form-input-container-multi-date").fadeOut().slideUp();
			$(".dynamic-form-input-container-one-date").slideDown();
			$(".dynamic-form-input-container-multi-time").slideDown();
		}

	}

	/* load _______________________*

	$(window).on('beforeunload', function(){
	  	if($domChange){
	 	 	return "";
	 	}
	});

	$(window).on('unload', function(){
	    alert("unload");
	    return false;
	});

	/* End load _______________________*/

	/* .sections-main-sub-container-left-search-bar .square-button Swicher if needed ______

	$(document).on("click",".sections-main-sub-container-left-search-bar .square-button",function(){

		jQuery.noConflict(); 
		switch($(".tab-pane:visible").attr("id")) {
			  case "Details":{
				$('#AddStudentModal').modal('show');
			  	break;
			  }
			  case "Absence":{
				$('#AddAbsenceModal').modal('show');
			  	break;
			  }			  
			  case "Finance":{
				$('#FinanceModal').modal('show');
			  	break;
			  }		  
			  case "Attitude":{
				$('#AddAttitudeModal').modal('show');
			  	break;
			  }
			  default:{
			  	break;
			  }
		}
		
	});

	/* End .finance-page-extra-style .col-text-align img _______________________*/


	/* nav-tabs a ______________________________________________________________*/

	  $(".nav-tabs a").click(function(){
	    $(this).tab('show');
	  });

	  $('.nav-tabs a').on('show.bs.tab', function(){
	    //alert('The new tab is about to be shown.');
	  });

	  $('.nav-tabs a').on('shown.bs.tab', function(){
	    //alert('The new tab is now fully shown.');
	  });

	  $('.nav-tabs a').on('hide.bs.tab', function(e){
	   
	    	if($domChange){
				//jQuery.noConflict(); 
				$('#ChangesModal').modal('show');
				event.preventDefault();
				event.stopPropagation();
				return false;
			}

			
	  });

	  $('.nav-tabs a').on('hidden.bs.tab', function(){
	    //alert('The previous tab is now fully hidden.');
	  });
	
	/* nav-tabs a ______________________________________________________________*/

});






