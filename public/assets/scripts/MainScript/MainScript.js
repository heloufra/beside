/*______________ Global Variables _____________*/

$Href = "";
$Api  = "";
$Path = "";

$domChange = false;

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
	//alert($domChange);
	if($domChange){
		return false;
	}
}

/* End domChangeWatcher _________________________________*/

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
		$(".dynamic-form-input-dropdown-container").find(".button-icon").removeClass("caret-rotate");
		$(".dynamic-form-input-dropdown-container").find(".button-icon").addClass("caret-rotate-reset");

		$this = $(this);

		$this.parent().find(".dynamic-form-input-dropdown-options").css({"display":"inline-block"});


		$(this).parents(".dynamic-form-input-dropdown-container").find(".button-icon").removeClass("caret-rotate-reset");
		$(this).parents(".dynamic-form-input-dropdown-container").find(".button-icon").addClass("caret-rotate");

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

		$this.parent().find(".dynamic-form-input-dropdown-options").css({"opacity":"0"});

		$(this).parents(".dynamic-form-input-dropdown-container").find(".input-dropdown").val($text);

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
		},1);
	});

	$(document).on("keyPress",".input-dropdown",function(){
		return null;
	});


	/* sections-label-checkbox-container _________________*/

	$(document).on("click",".sections-label-checkbox-main-container",function(){

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

		});


	/* Subject Section _______________________*/

	/* StudentBtnEdit ________________________*/

	$(document).on("click","#StudentBtnEdit",function(){

		$this = $(this);

		$(".sections-main-sub-container-right-main-body.active .form-group ").toggleClass("disabled");
		$(".sections-main-sub-container-right-main-header-info .form-group ").toggleClass("disabled");
		$(".sections-main-sub-container-right-main-body.active .sections-label-checkbox-main-container ").toggleClass("disabled");

		$(".sub-container-form-footer").toggleClass("visibility");

	});

	$(document).on("click","#StudentBtnCancel",function(){

		$("#Details .sub-container-form-footer").removeClass("show-footer");
		$("#Details .sub-container-form-footer").addClass("hide-footer");
		
		setTimeout(function(){
			$(".sections-main-sub-container-right-main").css("cssText","height:95vh");
		},50);
  		
  		$domChange=true;

	});

	/* End StudentBtnEdit ________________________*/


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
		return false;
	});

	$(document).on("click",".caret-rotate",function(){

		$this = $(this);
		$this.parents(".dynamic-form-input-dropdown-container").find(".button-icon").removeClass("caret-rotate");
		$this.parents(".dynamic-form-input-dropdown-container").find(".button-icon").addClass("caret-rotate-reset");

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
			$(".sections-main-sub-container-right-main").css("cssText","height:84.5vh");
		}

		if($(".tab-pane:visible").find(".sub-container-form-footer-container").length == 1 
				&& $(".tab-pane:visible").attr("id") == "Details" ) {
				$(".sections-main-sub-container-right-main").css("cssText","height:94vh");
		}

	},500);

	$(document).on("click",".sections-main-sub-container-right-main-tabs li",function(event){


		domChangeWatcher();

		$("#Details .sub-container-form-footer").addClass("hide-footer");

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
				$(".sections-main-sub-container-right-main").css("cssText","height:84.5vh");
			}

			if($(".tab-pane:visible").find(".sub-container-form-footer-container").length == 1 
				&& $(".tab-pane:visible").attr("id") == "Details" ) {
				$(".sections-main-sub-container-right-main").css("cssText","height:94vh");
			}

		},500); 


		
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

	/* input-text-empty ____________________________*/

	$(document).on('change','#Details input', function() {
		
		$(".sub-container-form-footer").addClass("show-footer");
  		$(".sections-main-sub-container-right-main").css("cssText","height:84.5vh");
  		$domChange=true;
  		setTimeout(function(){
			$(".sub-container-form-footer").removeClass("hide-footer");
  		});
	});

	/* End input-text-empty ________________________*/

	/* #Details #Parents_New_Dynamic_Form_Input _______________________*/

	$(document).on("click","#Details #Parents_New_Dynamic_Form_Input",function(){

		$("#Details .dynamic-form-input-parent").removeClass("dynamic-form-input-first");
		$dynamic_form_input = $("#Details .dynamic-form-input-parent").first().clone();
		$dynamic_form_input.find("input").val("");
		$(this).parent().before($dynamic_form_input);

		$(".sub-container-form-footer").addClass("show-footer");
  		$(".sections-main-sub-container-right-main").css("cssText","height:84.5vh");
  		$domChange=true;
  		setTimeout(function(){
			$(".sub-container-form-footer").removeClass("hide-footer");
  		});


	});

	$(document).on("click","#Details .square-button",function(){

		$(this).parents(".dynamic-form-input-parent").remove();

		if($("#Details .dynamic-form-input-parent").length == 1 ){
			$("#Details .dynamic-form-input-parent").addClass("dynamic-form-input-first");
		}

		$(".sub-container-form-footer").addClass("show-footer");
  		$(".sections-main-sub-container-right-main").css("cssText","height:84.5vh");
  		$domChange=true;
  		setTimeout(function(){
			$(".sub-container-form-footer").removeClass("hide-footer");
  		});
		
	});

	/* End #Details #Parents_New_Dynamic_Form_Input _______________________*/

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

	function Absense_Retard_Checker($type){

		$session = $(".dynamic-form-input-container-session").find("input:checked").attr("data-val");
		$type    = $(".dynamic-form-input-container-type").find("input:checked").attr("data-val");

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
	

});



