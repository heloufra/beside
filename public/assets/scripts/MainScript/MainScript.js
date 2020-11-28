/*______________ Global Variables _____________*/

$Href = "";
$Api  = "";
$Path = "";
$href = "/beside/";

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


/* FormatAMPM _________________________________*/

function FormatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = hours < 10 ? '0'+hours : hours;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}



/* Auto_grow _________________________________*/

function Auto_grow(element) {

	$height_= String(element.style.height).split("px");

	if($height_[0] > 48){
		//$(".dashboard-new-message-side-bar-body").css("height","calc(100vh - 25.5vh)");
	}else{
		//$(".dashboard-new-message-side-bar-body").css("height","calc(100vh - 23.5vh)");
	}

	if(element.value == ""){
		//$(".dashboard-new-message-side-bar-body").css("height","calc(100vh - 23.5vh)");
		element.style.height = "0px";
	}else{
		element.style.height = "2px";
	}
    
    element.style.height = ((element.scrollHeight)-8)+"px";
}

/* End Auto_grow _________________________________*/

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

   function getOS() {

	  	  var userAgent = window.navigator.userAgent,
	      platform = window.navigator.platform,
	      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
	      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
	      iosPlatforms = ['iPhone', 'iPad', 'iPod'],
	      os = null;

		  if (macosPlatforms.indexOf(platform) !== -1) {
		    os = 'Mac OS';
		  } else if (iosPlatforms.indexOf(platform) !== -1) {
		    os = 'iOS';
		  } else if (windowsPlatforms.indexOf(platform) !== -1) {
		    os = 'Windows';
		  } else if (/Android/.test(userAgent)) {
		    os = 'Android';
		  } else if (!os && /Linux/.test(platform)) {
		    os = 'Linux';
		  }

  		return os;
	}

	 /**
	 * JavaScript Client Detection
	 * Source: http://jsfiddle.net/ChristianL/AVyND/
	 * (C) viazenetti GmbH (Christian Ludwig)
	 */

	function osDetector(window){

        var os, clientStrings;
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var unknown = '-';

        // system
        var os = unknown;
        var clientStrings = [
            {s:'Windows 3.11', r:/Win16/},
            {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
            {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
            {s:'Windows 98', r:/(Windows 98|Win98)/},
            {s:'Windows CE', r:/Windows CE/},
            {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
            {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
            {s:'Windows Server 2003', r:/Windows NT 5.2/},
            {s:'Windows Vista', r:/Windows NT 6.0/},
            {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
            {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
            {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
            {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
            {s:'Windows ME', r:/Windows ME/},
            {s:'Android', r:/Android/},
            {s:'Open BSD', r:/OpenBSD/},
            {s:'Sun OS', r:/SunOS/},
            {s:'Linux', r:/(Linux|X11)/},
            {s:'iOS', r:/(iPhone|iPad|iPod)/},
            {s:'Mac OS X', r:/Mac OS X/},
            {s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
            {s:'QNX', r:/QNX/},
            {s:'UNIX', r:/UNIX/},
            {s:'BeOS', r:/BeOS/},
            {s:'OS/2', r:/OS\/2/},
            {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
        ];

        for (var id in clientStrings) {
            var cs = clientStrings[id];
            if (cs.r.test(nAgt)) {
                os = cs.s;
                break;
            }
        }

        var osVersion = unknown;

        if (/Windows/.test(os)) {
            osVersion = /Windows (.*)/.exec(os)[1];
            os = 'Windows';

            var script = `<link rel="stylesheet" href="assets/styles/MainStyle/MainStyle_ScrollBar.css">`;
			$('head').append(script);

        }

        switch (os) {
            case 'Mac OS X':
                osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'Android':
                osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'iOS':
                osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                break;
        }

        window.jscd = {
        	os: os,
        	osVersion: osVersion,
    	};

    	console.log(jscd.os + ' ' + jscd.osVersion);
        
    }

	/***********************************************/

/* End Helpers _________________________________*/

$(document).ready(function(){

	var script = '<link rel="icon" href="assets/favicon/favIcon.png">';
	$('head').append(script);

	if($('head').find('script[src="assets/includes/nicescroll/jquery.nicescroll.min.js"]').length == 0){
		var script = '<link rel="icon" href="assets/favicon/favIcon.png">';
		$('head').append(script);
	}


	/*var script = `<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.min.js"></script>
				  <script type="text/javascript" src="https://html2canvas.hertzen.com/dist/html2canvas.js"></script>`;
	$('head').append(script);*/

	
	var script = `<script type="text/javascript" src="https://printjs-4de6.kxcdn.com/print.min.js"></script>
				  <link rel="stylesheet" href="https://printjs-4de6.kxcdn.com/print.min.css">
				  <link rel="stylesheet" href="assets/styles/MainStyle/MainStyle.css" type="text/css" media="print" />`;


	$('head').append(script);

	var script = `<script type="text/javascript" src="https://cdn2.hubspot.net/hubfs/476360/Chart.js"></script>
				  <script type="text/javascript" src="https://cdn2.hubspot.net/hubfs/476360/utils.js"></script>`;


	$('head').append(script);


	$(document).on("click",".setup-main-container",function(){

		$(".dynamic-form-input-dropdown-options").css({"opacity":"0"});
		$(".dynamic-form-input-dropdown-options").css({"display":"none"});

		$(".dynamic-form-input-dropdown-container .button-icon").removeClass("caret-rotate");
		$(".dynamic-form-input-dropdown-container .button-icon").addClass("caret-rotate-reset");
		
	});

	/* Form Component ______________________*/

	$(".sections-main-sub-container-right-main-header-info .input-img").each(function(){

		if($(this).attr("src") == ""){
		   $(this).attr("src","assets/icons/Logo_placeholder.svg");
		}

	});




	/***** 	window.myLine.update() *********************
	config.data.datasets.forEach(function(dataset) {
		dataset.data = dataset.data.map(function() {
			return Data();
		});

	});

	window.myLine.update();
	/***************************************************


/* osDetector _________________________________*/

	   	if( getOS() == "Windows"){
	   		var script = `<link rel="stylesheet" href="assets/styles/MainStyle/MainStyle_ScrollBar.css">`;
			$('head').append(script);
	    }

	/* End osDetector _________________________________*/

	/* End Chart.js ___________________________________________*/

	


	//Create PDf from HTML...
	function CreatePDFfromHTML() {

		
		/**************************

	    var HTML_Width = $(".html-content").width();
	    var HTML_Height = $(".html-content").height();
	    var top_left_margin = 15;
	    var PDF_Width = HTML_Width + (top_left_margin * 2);
	    var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
	    var canvas_image_width = HTML_Width;
	    var canvas_image_height = HTML_Height;

	    var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

	    html2canvas($(".html-content")[0]).then(function (canvas) {
	        var imgData = canvas.toDataURL("image/jpeg", 1.0);
	        var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
	        pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
	        for (var i = 1; i <= totalPDFPages; i++) { 
	            pdf.addPage(PDF_Width, PDF_Height);
	            pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
	        }
	        pdf.save("Your_PDF_Name.pdf");
	    });

	    /**************************/

	    var doc = new jsPDF("p", "mm", "a4");

		var width = doc.internal.pageSize.getWidth();
		var height = doc.internal.pageSize.getHeight();

		html2canvas($(".html-content")[0]).then(function (canvas) {
	        var imgData = canvas.toDataURL("image/jpeg", 1.0);
	        var pdf = new jsPDF('p', 'pt', [width, height]);
	        pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
	        var totalPDFPages = Math.ceil(height / height) - 1;
	        for (var i = 1; i <= totalPDFPages; i++) { 
	            pdf.addPage(width, height);
	            pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
	        }
	        pdf.save("Your_PDF_Name.pdf");
	    });

		doc.addImage(imgData, 'JPEG', 0, 0, width, height);

	}

	$(document).on("click","#printTheBill",function(){
		
		//CreatePDFfromHTML();

		printJS({printable: 'html-content',
		scanStyles:true,
		type:'html',
		honorColor: true,
		css: ["assets/styles/MainStyle/MainStyle.css"]
		})

		//assets/styles/MainStyle/MainStyle.css

		/*$('.html-content').printThis({
              importCSS: true,
              base:'true',
              loadCSS: $href+"assets/styles/MainStyle/print.css",
              header: "",
              debug: true,
              importCSS: true,
              importStyle: true
          });*/

	});

	
	/* nicescroll ____________________________*/

	if(getOS() == 'Mac OS_'){

		$(".sections-main-sub-container-right-main").css("cssText","overflow: hidden;overflow-y: scroll;");

		if($("body .finance-page-extra-style").length == 0) {

			$(".sections-main-sub-container-right-main").niceScroll({
				horizrailenabled:false , 
				cursorcolor : "rgba(21, 26, 59, 0.19)",
				background: "#fff",
				cursorwidth: "8px",
				scrollspeed: 60, 
		    	mousescrollstep: 40,
				smoothscroll:true,
				hwacceleration: true
			});

		}else{

			$(".finance-page-extra-style .tab-content").niceScroll({
				horizrailenabled:false , 
				cursorcolor : "rgba(21, 26, 59, 0.19)",
				background: "#fff",
				cursorwidth: "8px",
				scrollspeed: 60, 
		    	mousescrollstep: 40,
				smoothscroll:true,
				hwacceleration: true,
				zindex:'99999999',
				horizrailenabled:false
			});
		}

		$(".side-bar").niceScroll({
			horizrailenabled:false , 
			cursorcolor : "rgba(21, 26, 59, 0.19)",
			background: "#fff",
			cursorwidth: "8px",
			scrollspeed: 60, 
	    	mousescrollstep: 40,
			smoothscroll:true,
			hwacceleration: true,
			zindex:99999999
		});

		$(".dashboard-card-table-info-body").niceScroll({
			horizrailenabled:false , 
			cursorcolor : "rgba(21, 26, 59, 0.19)",
			background: "#fff",
			cursorwidth: "8px",
			scrollspeed: 60, 
	    	mousescrollstep: 40,
			smoothscroll:true,
			hwacceleration: true
		});

		$(".sections-main-sub-container-left-card-container").niceScroll({
			horizrailenabled:false , 
			cursorcolor : "rgba(21, 26, 59, 0.19)",
			background: "#fff",
			cursorwidth: "8px",
			scrollspeed: 60, 
	    	mousescrollstep: 40,
			smoothscroll:true,
			hwacceleration: true
		});

		$(".dynamic-form-input-dropdown-options").niceScroll({
			horizrailenabled:false , 
			cursorcolor : "rgba(21, 26, 59, 0.19)",
			background: "#fff",
			cursorwidth: "8px",
			scrollspeed: 60, 
	    	mousescrollstep: 40,
			smoothscroll:true,
			hwacceleration: true
		});

		$(".modal .modal-body").niceScroll({
			horizrailenabled:false , 
			cursorcolor : "rgba(21, 26, 59, 0.19)",
			background: "#fff",
			cursorwidth: "8px",
			scrollspeed: 60, 
	    	mousescrollstep: 40,
			smoothscroll:true,
			hwacceleration: true
		});

		$(".dashboard-chat-side-bar-body").niceScroll({
			horizrailenabled:false , 
			cursorcolor : "rgba(21, 26, 59, 0.19)",
			background: "#fff",
			cursorwidth: "8px",
			scrollspeed: 60, 
	    	mousescrollstep: 40,
			smoothscroll:true,
			hwacceleration: true
		});


		$(document).on("mouseover",".modal .modal-body",function(){

			$(this).css("cssText","overflow-y : scroll !important");

			if($(this).find(".show-footer").length == 1){
	  			$(".modal-dom-change-watcher.in .modal-body").css("cssText","max-height:calc(100vh - 29.5vh) !important");
			}

		});

		$(document).on("mousemove",".sub-main-container",function(){

			$(".sub-main-container").niceScroll({
				horizrailenabled:false , 
				cursorcolor  : "rgba(21, 26, 59, 0.19)",
				background: "#fff",
				cursorwidth: "8px",
				scrollspeed: 60, 
		    	mousescrollstep: 40,
				smoothscroll:true,
				hwacceleration: true
			});

			$(".sub-main-container").getNiceScroll().resize();

		});

		$(document).on("mousemove",".select2-dropdown",function(){

			$(".select2-dropdown").niceScroll({
				horizrailenabled:false , 
				cursorcolor : "red",
				background: "#fff",
				cursorwidth: "8px",
				scrollspeed: 60, 
		    	mousescrollstep: 40,
				smoothscroll:true,
				hwacceleration: true
			});

			$(".select2-dropdown").getNiceScroll().resize();

			console.log("scrolling ... ");

		});


		$('div').on( 'mousewheel DOMMouseScroll', function (e) { 
	  
		  var e0 = e.originalEvent;
		  var delta = e0.wheelDelta || -e0.detail;

		  this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
		  e.preventDefault();  

		});

		$(".sections-main-sub-container-right-main-rows").scroll(function(e){
			
			$(".dashboard-main-sub-left-container").css("background","red");
			$(".dashboard-main-sub-left-container").css("overflow-y","hidden");
			$(".dashboard-main-sub-left-container").getNiceScroll().remove();
			e.preventDefault();

		});


		$(document).on('DOMMouseScroll mousewheel', '.Scrollable', function(ev) {
		    var $this = $(this),
		        scrollTop = this.scrollTop,
		        scrollHeight = this.scrollHeight,
		        height = $this.innerHeight(),
		        delta = (ev.type == 'DOMMouseScroll' ?
		            ev.originalEvent.detail * -40 :
		            ev.originalEvent.wheelDelta),
		        up = delta > 0;

		    var prevent = function() {
		        ev.stopPropagation();
		        ev.preventDefault();
		        ev.returnValue = false;
		        return false;
		    }

		    if (!up && -delta > scrollHeight - height - scrollTop) {
		        // Scrolling down, but this will take us past the bottom.
		        $this.scrollTop(scrollHeight);
		        return prevent();
		    } else if (up && delta > scrollTop) {
		        // Scrolling up, but this will take us past the top.
		        $this.scrollTop(0);
		        return prevent();
		    }
		});


	}
	/* End scrollbar ____________________________*/

	/*Dropdown Menu*/

	$(document).on("click",".input-dropdown",function(event){

		$(".dynamic-form-input-dropdown-options").css({"opacity":"0"});
		$(".dynamic-form-input-dropdown-options").css({"display":"none"});

		$(".sub-form-group").find(".button-icon").removeClass("caret-rotate");
		$(".sub-form-group").find(".button-icon").addClass("caret-rotate-reset");

		$this = $(this);

		$this.parent().find(".dynamic-form-input-dropdown-options").css({"display":"inline-block"});


		$(this).closest(".form-group").find(".button-icon").removeClass("caret-rotate-reset");
		$(this).closest(".form-group").find(".button-icon").addClass("caret-rotate");
	
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

		$this.closest(".form-group").find(".input-dropdown").val(" ");

		$this.parent().find(".dynamic-form-input-dropdown-options").css({"opacity":"0"});

		if($this.parents(".dynamic-form-input-dropdown-container").find(".input-dropdown").val() =="" 
			|| $this.parents(".dynamic-form-input-dropdown-container").find(".input-dropdown").val()  == null ){

			setTimeout(function(){

				$this.closest(".form-group").find(".input-dropdown").val(" ");

				setTimeout(function(){
					$this.closest(".form-group").find(".input-dropdown").val($text);
				},180);

			},5);
			
			
		}else{
			$this.closest(".form-group").find(".input-dropdown").val($text);
		}

		$(this).parents(".dynamic-form-input-dropdown-container").find(".button-icon").removeClass("caret-rotate");
		$(this).parents(".dynamic-form-input-dropdown-container").find(".button-icon").addClass("caret-rotate-reset");
		
		setTimeout(function(){
			$(".dynamic-form-input-dropdown-options").css("cssText","display:none");
		},1);

	});

	$(document).on("click",function(event){

		$(".dynamic-form-input-dropdown-container").find(".button-icon").removeClass("caret-rotate");
		$(".dynamic-form-input-dropdown-container").find(".button-icon").addClass("caret-rotate-reset");


		/****************** side bar animation  **************************/

			$(".slide-down").addClass('slide-up').removeClass('slide-down');

		    $(".main-selected-school").find(".button-icon").removeClass("caret-rotate");
			$(".main-selected-school").find(".button-icon").addClass("caret-rotate-reset");

		/********************************************/

		setTimeout(function(){
			$(".dynamic-form-input-dropdown-options").css("cssText","display:none");
			$(".table-option-list").css("cssText","display:none");
			$(".sections-main-sub-container-right-main-header-option-list").css("cssText","display:none");
			$(".sections-main-sub-container-right-main-header-option-icon").css({"display":"inline-block"});
			$(".sections-main-sub-container-right-main-header-option-icon").addClass("sub-container-nav-bar-img-animation");
		},1);

		/****************************************/

		if($(".form-group-search").length >= 1 ){

			if($(".form-group-search .input-text").val().length == 0){

				$(".form-group-search").css("cssText","z-index : -10 !important ; border-radius : 3px !important; opacity : 0 !important;");

				$(".form-group-search .button-icon").attr("src","assets/icons/sidebar_icons/close.svg");

				setTimeout(function(){
					$(".hide-controler").css("opacity","1");
				},200);
			

			}

		}
	});

	$(document).on("keyPress",".input-dropdown",function(){
		return null;
	});

	$(document).on("click","#printTheBill",function(){
		
		//CreatePDFfromHTML();

		printJS({printable: 'html-content',
		scanStyles:true,
		type:'html',
		honorColor: true,
		css: [window.location.origin+"/assets/styles/MainStyle/MainStyle.css"]
		})

		//assets/styles/MainStyle/MainStyle.css

		/*$('.html-content').printThis({
              importCSS: true,
              base:'true',
              loadCSS: $href+"assets/styles/MainStyle/print.css",
              header: "",
              debug: true,
              importCSS: true,
              importStyle: true
          });*/

	});

	/* sections-label-checkbox-container _________________*/

	$(document).on("click",".modal.in .sections-label-checkbox-main-container",function(){

		if (!$(this).find("div").hasClass("readonly"))
		{
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
		}
		
	});

	/* End sections-label-checkbox-container _________________*/

	/* .tab-pane.in .sections-label-checkbox-main-container _________________*/

	$(document).on("click",".tab-pane.in .sections-label-checkbox-main-container",function(){

		if (!$(this).find("div").hasClass("readonly"))
		{
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
		}
		
	});

	/* End .tab-pane.in .sections-label-checkbox-main-container _________________*/

	/* finance-page-extra-style _________________*/

	$(document).on("click",".finance-page-extra-style .sections-label-checkbox-main-container",function(){

		if (!$(this).find("div").hasClass("readonly"))
		{
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
		}
		
	});


	/* End finance-page-extra-style _________________*/

	/* finance-page-extra-style _________________*/

	$(document).on("click",".dashboard-card-table-info-container .sections-label-checkbox-main-container",function(){

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

	$(document).on("click",".sub-main-container",function(){

		if($(".select2").length > 0 ){
			$('body').trigger('mousedown');
		}
		
	});

	/*$(document).on("blur",".select2",function(){

		$('body').trigger('mousedown');
		
	});*/

	
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
		$dynamic_form_input.find(".square-button-minus").removeClass('hidden');
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
		$dynamic_form_input.find(".square-button-minus").removeClass('hidden');
		$dynamic_form_input.find("input").attr('data-classe',0);
		$(this).before($dynamic_form_input);

	});

	$(document).on("click","#Classe_Section .square-button-minus",function(){

		if($(this).parent(".dynamic-form-input").parent(".dynamic-form-input-container").children(".dynamic-form-input").length <= 2 ){
			$(this).parent(".dynamic-form-input").parent(".dynamic-form-input-container").children(".dynamic-form-input").addClass("dynamic-form-input-first");
		}
		
		$(this).parent(".dynamic-form-input").remove();

	});

	$(document).on("click","#Classe_Section .square-button-minus",function(){

		if($(this).parent(".dynamic-form-input").parent(".dynamic-form-input-container").children(".dynamic-form-input").length <= 2 ){
			$(this).parent(".dynamic-form-input").parent(".dynamic-form-input-container").children(".dynamic-form-input").addClass("dynamic-form-input-first");
		}
		
		$(this).parent(".dynamic-form-input").remove();

	});

	$(document).on("click","#Classe_Section .square-button-minus",function(){

		if($(this).parent(".dynamic-form-input").parent(".dynamic-form-input-container").children(".dynamic-form-input").length <= 2 ){
			$(this).parent(".dynamic-form-input").parent(".dynamic-form-input-container").children(".dynamic-form-input").addClass("dynamic-form-input-first");
		}
		
		$(this).parent(".dynamic-form-input").remove();

	});

	/* Academic Year Section _______________________*/

	$year = new Date();

	$(".setup-main-container .start-month .date-form-input-header-picker-label").text(($year.getFullYear()*1)-1);
	$(".setup-main-container .end-month  .date-form-input-header-picker-label").text(($year.getFullYear()*1));

	$(".setup-main-container .start-month .date-form-input-header-picker-controllers.left-arrow").css("opacity","0.6");
	$(".setup-main-container .end-month .date-form-input-header-picker-controllers.left-arrow").css("opacity","0.6");

	$(".academic-year-input-label").val($(".setup-main-container .start-month .date-form-input-header-picker-label").text()+' - '+$(".setup-main-container .end-month  .date-form-input-header-picker-label").text());

	/* start-month _______________________*/


	/* start-month _______________________*/

	$(document).on("click",".setup-main-container .start-month .date-form-input-header-picker-controllers.right-arrow",function(event){

		$current_year = $(this).parents(".date-form-input-container").find(".date-form-input-header-picker-label").text();

		$(this).parents(".date-form-input-container").find(".date-form-input-header-picker-label").text(($current_year*1)+1);

		$(".setup-main-container .end-month .date-form-input-header-picker-label").text(($current_year*1)+2);

		$(this).parents(".date-form-input-container").find(".date-form-input-header-picker-controllers.left-arrow").css("opacity","1");

		$(".setup-main-container .end-month .date-form-input-header-picker-controllers.left-arrow").css("opacity","1");
		
		event.preventDefault();
		event.stopPropagation();

	});

	$(document).on("click",".setup-main-container .start-month .date-form-input-header-picker-controllers.left-arrow",function(event){

		$current_year = $(this).parents(".date-form-input-container").find(".date-form-input-header-picker-label").text();

		if($current_year >= $year.getFullYear() ){
			$(".setup-main-container .end-month .date-form-input-header-picker-label").text($current_year);
			$(this).parents(".date-form-input-container").find(".date-form-input-header-picker-label").text(($current_year*1)-1);
			
		}else{
			$(this).css("opacity","0.6");
			$(".setup-main-container .end-month .date-form-input-header-picker-label").text(($current_year*1)+1);
			$(".setup-main-container .end-month .date-form-input-header-picker-controllers.left-arrow").css("opacity","0.6");
		}
		
		event.preventDefault();
		event.stopPropagation();
	});

	/* End start-month _______________________*/

	/* end-month _______________________*/

	$(document).on("click",".setup-main-container .end-month .date-form-input-header-picker-controllers.right-arrow",function(event){

		$current_year = $(this).parents(".date-form-input-container").find(".date-form-input-header-picker-label").text();

		$(this).parents(".date-form-input-container").find(".date-form-input-header-picker-label").text(($current_year*1)+1);

		$(this).parents(".date-form-input-container").find(".date-form-input-header-picker-controllers.left-arrow").css("opacity","1");
		
		event.preventDefault();
		event.stopPropagation();
	});

	$(document).on("click",".setup-main-container .end-month .date-form-input-header-picker-controllers.left-arrow",function(event){

		$current_year = ($(this).parents(".date-form-input-container").find(".date-form-input-header-picker-label").text() * 1 );

		if( ($current_year > ($year.getFullYear()*1)) && ($current_year *1) > ($(".setup-main-container .start-month .date-form-input-header-picker-label").text() * 1) ){
			$(this).parents(".date-form-input-container").find(".date-form-input-header-picker-label").text(($current_year*1)-1);
		}else{
			$(this).css("opacity","0.6");
		}
		
		
		event.preventDefault();
		event.stopPropagation();
	});

	/* End end-month _______________________*/

	$(document).on("click",".setup-main-container .date-form-input-header-picker-controllers",function(event){

		$start_month = $(".setup-main-container .start-month .date-form-input-header-picker-label").text();
		$end_month   = $(".setup-main-container .end-month   .date-form-input-header-picker-label").text();

		$(".academic-year-input-label").val($start_month+' - '+$end_month);
		
		event.preventDefault();
		event.stopPropagation();

	});

	$(document).on("click",".date-form-input",function(event){


		$(".date-form-input-picker-container").css({"opacity":"0"});
		$(".date-form-input-picker-container").css({"display":"none"});

		$this = $(this);

		//$this.val("");

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
		$dynamic_form_input.find("input").attr('data-expense',0);
		$dynamic_form_input.find(".square-button-minus").removeClass('hidden');
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

		$(this).parents(".dynamic-form-input-container-extra-style-composed").find(".dynamic-form-input-dropdown").removeClass("dynamic-form-input-first");
		$dynamic_form_input = $(this).parent().children(".dynamic-form-input-dropdown-container").first().clone();
		$dynamic_form_input.find(".input-text").val("");
		$dynamic_form_input.find(".square-button-minus").removeClass('hidden');
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

	/****** append new options to all dropdown *********/



	/****** End append new options to all dropdown *********/

	/**__ input-text-subject-classes-select2 _____________________________*/

	

	if($(".input-text-subject-classes-select2").length > 0){

		$(".input-text-subject-classes-select2").select2({
		  tags: true,
		  dropdownPosition: 'below',
  		  placeholder: "Classes",
  		  minimumResultsForSearch: -1,
  		  templateResult: hideSelected
		});

	}

	/**__ input-text-subject-classes-select2 _____________________________*/

	if($(".input-text-subject-classes-select2-2").length > 0){

		$(".input-text-subject-classes-select2-2").select2({
		  dropdownPosition: 'below',
  		  placeholder: "",
  		  minimumResultsForSearch: -1,
  		  templateResult: hideSelected
		});

	}

	$('.input-text-subject-classes-select2').on('select2:selecting', function (e) {

		$(this).parents(".form-group-right").find(".input-label").addClass("input-label-move-to-top");

	});

	$('.input-text-subject-classes-select2').on('select2:unselecting', function (e) {

		if($(this).select2('data').length <= 1 ){
			$(this).parents(".form-group-right").find(".input-label").removeClass("input-label-move-to-top");
		}

	});

	/**__ input-text-subject-classes-select2-2' _________________________*/

	$('.input-text-subject-classes-select2-2').on('select2:opening', function (e) {

		$(this).parents(".form-group-right").find(".input-label").addClass("input-label-move-to-top");

	});

	$('.input-text-subject-classes-select2-2').on('select2:closing', function (e) {

		if($(this).select2('data').length < 1 ){
			$(this).parents(".form-group-right").find(".input-label").removeClass("input-label-move-to-top");
		}else{
			$(this).parents(".form-group-right").find(".input-label").addClass("input-label-move-to-top");
		}

	});

	$('.input-text-subject-classes-select2-2').on('select2:selecting', function (e) {

		$(this).parents(".form-group-right").find(".input-label").addClass("input-label-move-to-top");

	});

	$('.input-text-subject-classes-select2-2').on('select2:unselecting', function (e) {

		if($(this).select2('data').length <= 1 ){
			$(this).parents(".form-group-right").find(".input-label").removeClass("input-label-move-to-top");
		}

	});

	/**__ input-text-subject-classes-select2-2' _________________________*/

	$(document).on("click",".input-label",function(){
		$(this).parents(".form-group").find(".select2-selection").focus();
		$(this).parents(".form-group").find(".select2-selection").click();
		//$(this).parents(".form-group-right").find(".input-label").addClass("input-label-move-to-top");
		return false;
	});

	$(document).on("click",".button-icon",function(){
		$(this).parents(".form-group").find(".select2-selection").focus();
		$(this).parents(".form-group").find(".select2-selection").click();
		return false;
	});


	/* #Details #Subject_Class_New_Dynamic_Form_Input _______________________*/

	$(document).on("click",".dom-change-watcher #Subject_Class_New_Dynamic_Form_Input",function(){

		if(!$(this).parents(".modal").length == 1){

			$(".sections-main-sub-container-right-main-rows-dropdown-tags .dynamic-form-input-dropdown").removeClass("dynamic-form-input-first");

			$dynamic_form_input = $(".sections-main-sub-container-right-main-rows-dropdown-tags .dynamic-form-input-dropdown-container").first().clone();
			$select_id = $(".sections-main-sub-container-right-main-rows-dropdown-tags .dynamic-form-input-dropdown-container").last().find('.input-text-subject-classes-select2').data('select');
			console.log("Select ID",$select_id);
			$dynamic_form_input.find(".input-text-subject-classes-select2").select2("destroy");

			$dynamic_form_input.find(".select2").remove();

			$dynamic_form_input.find(".input-label").removeClass("input-label-move-to-top");
			$dynamic_form_input.find("input").val("");
			$dynamic_form_input.find("select").val("");
			$dynamic_form_input.find('option').remove();
			var subjects = [];
			$('.subjects-list .input-dropdown').each(function() {
				subjects.push($(this).val());
			})

			$dynamic_form_input.find('.dynamic-form-input-dropdown-options li').each(function() {
				if(subjects.includes($(this).attr('data-val')))
					$(this).addClass('hidden');
			})
			$(this).parent().find(".sections-main-sub-container-right-main-rows-dropdown-tags-container").last().after($dynamic_form_input);
			$(this).parents(".sections-main-sub-container-right-main-rows-dropdown-tags").find(".input-text-subject-classes-select2").select2({
			  tags: true,
			  dropdownPosition: 'below',
	  		  placeholder: "Classes",
	  		  minimumResultsForSearch: -1,
	  		  templateResult: hideSelected,
			});


			$(this).parents(".sections-main-sub-container-right-main-rows-dropdown-tags").find(".input-text-subject-classes-select2").on('select2:selecting', function (e) {

				$(this).parents(".form-group-right").find(".input-label").addClass("input-label-move-to-top");

			});

			$(this).parents(".sections-main-sub-container-right-main-rows-dropdown-tags").find(".input-text-subject-classes-select2").on('select2:unselecting', function (e) {

				if($(this).select2('data').length <= 1 ){
					$(this).parents(".form-group-right").find(".input-label").removeClass("input-label-move-to-top");
				}

			});

			$(".sub-container-form-footer").addClass("show-footer");
	  		$(".sections-main-sub-container-right-main").css("cssText","height:calc(100vh - 120px)");
	  		$domChange=true;

	  		setTimeout(function(){

				$(".sub-container-form-footer").removeClass("hide-footer");

	  		},50);


	  	}

	});

	$(document).on("click",".dom-change-watcher .square-button",function(){

		if(!$(this).parents(".modal").length == 1){

			/* Display Hidden Subjects   */

				if ($(this).hasClass('square-button-minus'))
				{
					$subject = $(this).parents(".details-teacher .dynamic-form-input-dropdown-container").find('.input-dropdown').val();
					$(".details-teacher .dynamic-form-input-dropdown-options li").each(function(){
						console.log("Subject",$subject);
						if ($(this).attr('data-val') === $subject)
						{
							$(this).removeClass('hidden');
						}
					})
				}

			/* End Display Hidden Subjects   */
			$(this).parents(".details-teacher .dynamic-form-input-dropdown-container").remove();

			if($(".details-teacher .sections-main-sub-container-right-main-rows-dropdown-tags .sections-main-sub-container-right-main-rows-dropdown-tags-container").length == 1 ){
				$(".details-teacher .sections-main-sub-container-right-main-rows-dropdown-tags .sections-main-sub-container-right-main-rows-dropdown-tags-container .dynamic-form-input-dropdown").addClass("dynamic-form-input-first");
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

	/* .dom-change-watcher .file-add-btn _______________________*/

	$(document).on("click",".dom-change-watcher .file-add-btn",function(){

		if(!$(this).parents(".modal").length == 1){



			$(".sub-container-form-footer").addClass("show-footer");
	  		$(".sections-main-sub-container-right-main").css("cssText","height:calc(100vh - 120px)");

	  		$domChange=true;
	  		setTimeout(function(){
				$(".sub-container-form-footer").removeClass("hide-footer");
	  		});

  		}
		
	});

	$(document).on("click",".dom-change-watcher .cancel-change",function(){
	  		$domChange=false;
	});

	$(document).on("click",".dom-change-watcher .file-loaded .file-close",function(){

		if(!$(this).parents(".modal").length == 1){

			$(this).parents(".file-loaded").find('input').val(null);
			$(this).parents(".file-loaded").remove();

			$(".sub-container-form-footer").addClass("show-footer");
	  		$(".sections-main-sub-container-right-main").css("cssText","height:calc(100vh - 120px)");

	  		$domChange=true;
	  		setTimeout(function(){
				$(".sub-container-form-footer").removeClass("hide-footer");
	  		});

  		}
		
	});


	/* #AddTeacherModal #Subject_Class_New_Dynamic_Form_Input _______________________*/

	$(document).on("click","#AddTeacherModal #Subject_Class_New_Dynamic_Form_Input",function(){

			$("#AddTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags .dynamic-form-input-dropdown").removeClass("dynamic-form-input-first");

			$dynamic_form_input = $("#AddTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags .dynamic-form-input-dropdown-container").first().clone();

			$dynamic_form_input.find(".input-text-subject-classes-select2").select2("destroy");

			$dynamic_form_input.find(".select2").remove();

			$dynamic_form_input.find(".input-label").removeClass("input-label-move-to-top");

			$(this).parent().find(".sections-main-sub-container-right-main-rows-dropdown-tags-container").last().after($dynamic_form_input);

			$(this).parents(".sections-main-sub-container-right-main-rows-dropdown-tags").find(".input-text-subject-classes-select2").select2({
			  tags: true,
			  dropdownPosition: 'below',
	  		  placeholder: "Classes",
	  		  minimumResultsForSearch: -1,
	  		  templateResult: hideSelected
			});


			$(this).parents(".sections-main-sub-container-right-main-rows-dropdown-tags").find(".input-text-subject-classes-select2").on('select2:selecting', function (e) {

				$(this).parents(".form-group-right").find(".input-label").addClass("input-label-move-to-top");

			});

			$(this).parents(".sections-main-sub-container-right-main-rows-dropdown-tags").find(".input-text-subject-classes-select2").on('select2:unselecting', function (e) {

				if($(this).select2('data').length <= 1 ){
					$(this).parents(".form-group-right").find(".input-label").removeClass("input-label-move-to-top");
				}

			});

	});

	$(document).on("click","#AddTeacherModal .square-button",function(){

			$(this).parents(".dynamic-form-input-dropdown-container").remove();

			if($("#AddTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags .sections-main-sub-container-right-main-rows-dropdown-tags-container").length == 1 ){
				$("#AddTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags .sections-main-sub-container-right-main-rows-dropdown-tags-container .dynamic-form-input-dropdown").addClass("dynamic-form-input-first");
			}
		
	});

	/* End #Details #Parents_New_Dynamic_Form_Input _______________________*/



	

	/* End input-dropdown-search ______________________________________________________________________________________*/

	/**__ End input-text-subject-classes-select2 _____________________________*/


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
			minDate:new Date(),
			classes:'datepicker__',
			navTitles: {
			      days: 'M - yyyy',
			      months: 'yyyy',
			      years: 'yyyy1 - yyyy2'
				},
			language:'en'
		});		
			
		$this_.focus();
		console.log(".input-date-from-today");

	});

	$(".input-date-from-today").datepicker({
			dateFormat: "dd/mm/yyyy",
			showOtherMonths: true,
			firstDay: 1,
			autoClose: true,
			minDate:new Date(),
			navTitles: {
			      days: 'M - yyyy',
			      months: 'yyyy',
			      years: 'yyyy1 - yyyy2'
				},
			language:'en'
	});	

	$(document).on("click_",".input-date-from-today",function(){

		$this_ = $(this);

		$this_.datepicker({
			dateFormat: "dd/mm/yyyy",
			showOtherMonths: true,
			firstDay: 1,
			autoClose: true,
			minDate:new Date(),
			navTitles: {
			      days: 'M - yyyy',
			      months: 'yyyy',
			      years: 'yyyy1 - yyyy2'
				},
			language:'en'
		});		
			
		$this_.focus();
		console.log(".input-date-from-today");

	});

	/* End input-date-from-today __________________________*/

	/* input-date-from-today ______________________________*/

	$(document).on('change','.dynamic-form-input-container-multi-date .dynamic-form-input-text-container-icon:first-child .input-date',function() {

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
					}).val($(this).val());

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

	/* End side-bar-li auto select  ________________________*/

	/* side-bar-li a  ________________________*/

	$(document).on("click",".side-bar-li a",function(event){

		$redirectTo = $(this).attr("href");

		if($domChange){
			//jQuery.noConflict(); 
			$('#ChangesModal').modal('show');
			event.preventDefault();
			event.stopPropagation();
		}

	});

	/* End side-bar-li a ________________________*/


	/* secondary-pink-button ____________________________*/

	$(document).on("click",".secondary-pink-button",function(event){

		$domChange = false;

		if($(this).parents(".setup-update-main-container")){
			return false;
		}
		else{

			

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
		}

	});

	/* End secondary-pink-button ________________________*/

	/* secondary-pink-button ____________________________*/

	$(document).on("click",".sections-main-sub-container-left-card",function(event){

		if($domChange){
			//jQuery.noConflict(); 
			$('#ChangesModal').modal('show');
			event.preventDefault();
			event.stopPropagation();
		}

	});

	/* End secondary-pink-button ________________________*/

	


	/* input-dropdown remove focus     _________________________*/

	$('.input-dropdown').focus(function(e) {
		$(".button-icon").removeClass("caret-rotate");
		$(".button-icon").addClass("caret-rotate-reset");
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

		$(".button-icon").removeClass("caret-rotate");
		$(".button-icon").addClass("caret-rotate-reset");

		$(this).siblings("input").click();
		$(this).siblings("input").focus();
		return false;

	});

	$(document).on("click",".caret-rotate",function(){

		$this = $(this);

		

		$this.closest(".form-group").find(".button-icon").removeClass("caret-rotate");
		$this.closest(".form-group").find(".button-icon").addClass("caret-rotate-reset");

		setTimeout(function(){
			$(".dynamic-form-input-dropdown-options").css("cssText","display:none");
		},1);

	});


	/* End button-icon remove focus ________________________*/

	/* select2  _________________*/

	$(document).on("click",".select2",function(event){

		$(".form-group").find(".button-icon").removeClass("caret-rotate");
		$(".form-group").find(".button-icon").addClass("caret-rotate-reset");

		$this = $(this);

		$(this).parents(".form-group").find(".button-icon").removeClass("caret-rotate-reset");
		$(this).parents(".form-group").find(".button-icon").addClass("caret-rotate");

		event.stopPropagation();
		event.preventDefault();

	});

	/* .input-text-subject-classes-select2 .caret-rotate  _________________*/

	$(document).on("click",".dynamic-form-input-dropdown .caret-rotate",function(){

		$this = $(this);

		$(".input-text-subject-classes-select2").select2('close');

		$this.removeClass("caret-rotate");
		$this.addClass("caret-rotate-reset");

	});

	/* .select2-results__option  _________________*/

	$(document).on("click",".select2-results__option--selectable",function(event){
		$(".button-icon").removeClass("caret-rotate");
		$(".button-icon").addClass("caret-rotate-reset");
	});	

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
	$(".sub-main-container").css("cssText","height:94vh");

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


	$(window).resize(function(){
		$(".tab-pane:visible .sub-container-form-footer").css("width",$(".sections-main-sub-container-right").css("width"));
	});


	$(window).on("mousemove",function(){
		$(".tab-pane:visible .sub-container-form-footer").css("width",$(".sections-main-sub-container-right").css("width"));
	});

	/* Tabs setup dom-change-watcher ___________________________________________________________________________________*/

	$(document).on("click",".setup-update-main-container .sections-main-sub-container-left .side-bar-li-span",function(e){
		$(".tab-pane .sub-container-form-footer").removeClass("show-footer");
		$(".tab-pane .sub-container-form-footer").addClass("hide-footer");
		$(".tab-pane .sub-container-form-footer").css("cssText","width:"+$(".sections-main-sub-container-right").css("width"));
		$(".tab-pane .sub-main-container").css("cssText","height: calc(100% - 48px);");
		e.stopPropagation();
		e.preventDefault();
		return false
	});



	$(document).on("click",".setup-update-main-container .sections-main-sub-container-left .side-bar-li a",function(e){
		e.stopPropagation();
		e.preventDefault();
		return false
	});


	/* Modal dismiss only front logic you can disable due to functionality */



	$(document).on("click","#Discard",function(event){

		$("#ChangesModal").modal("hide");
		event.preventDefault();
		event.stopPropagation();
		return false;
	});

	/* input-text-empty ____________________________*/

	$(document).on('keydown','.dom-change-watcher input', function() {


		if(!$(this).parents(".modal").length == 1){

			$(".tab-pane:visible .sub-container-form-footer").addClass("show-footer");
			
	  		$domChange=true;
	  		setTimeout(function(){
				$(".tab-pane:visible .sub-container-form-footer").removeClass("hide-footer");
				$(".tab-pane:visible .sub-container-form-footer").css("cssText","width:"+$(".sections-main-sub-container-right").css("width")+" !important;");
				$(".tab-pane:visible .sub-main-container").css("cssText","height:calc(100vh - 120px)");
	  		},25);

		}

	});

	/* End input-text-empty ________________________*/


	/* input-text-empty ____________________________*/

	$(document).on('change','.dom-change-watcher input', function() {

		if(!$(this).parents(".modal").length == 1){

			$(".tab-pane:visible .sub-container-form-footer").addClass("show-footer");
	  		$(".sub-main-container").css("cssText","height:calc(100vh - 120px)");

	  		$domChange=true;

	  		setTimeout(function(){
				$(".tab-pane:visible .sub-container-form-footer").removeClass("hide-footer");
				$(".tab-pane:visible .sub-container-form-footer").css("width",$(".sections-main-sub-container-right").css("width"));
				$(".tab-pane:visible .sub-main-container").css("cssText","height:calc(100vh - 120px)");
	  		},25);

		}

	});

	/* End input-text-empty ________________________*/

	/* .square-button-plus ____________________________*/

	$(document).on('click','.setup-update-main-container .square-button-extra-style', function() {

		if(!$(this).parents(".modal").length == 1){

			$(".tab-pane:visible .sub-container-form-footer").addClass("show-footer");
	  		$(".sub-main-container").css("cssText","height:calc(100vh - 120px)");

	  		$domChange=true;

	  		setTimeout(function(){
				$(".tab-pane:visible .sub-container-form-footer").removeClass("hide-footer");
				$(".tab-pane:visible .sub-container-form-footer").css("width",$(".sections-main-sub-container-right").css("width"));
				$(".tab-pane:visible .sub-main-container").css("cssText","height:calc(100vh - 120px)");
	  		},25);

		}

	});

	/* End .square-button-plus ________________________*/




	/* End Tabs setup dom-change-watcher ____________________________________________________________________________________*/


	/* Modal dom-change-watcher ___________________________________________________________________________________*/

	/* input-text-empty ____________________________*/

	$(document).on('keydown','.modal-dom-change-watcher input', function() {

  		// ===> Enable to fire change  Confirm modal  : $domChange=true;

  		setTimeout(function(){
  			$(".modal-dom-change-watcher.in .modal-content").css({"max-height":"calc(100vh - 29.5vh) !important"});
  			$(".modal-dom-change-watcher.in .modal-body").css("cssText","max-height:calc(100vh - 29.5vh) !important");
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
  			$(".modal-dom-change-watcher.in .modal-body").css("max-height","calc(100vh - 29.5vh)");
  			$(".modal-dom-change-watcher .hide-footer").css("display","block");
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
  		if (!$('input').hasClass('readonly'))
  		{
	  		setTimeout(function(){
	  			$(".modal-dom-change-watcher.in .modal-content").css({"max-height":"calc(100vh - 29.5vh)"});
	  			$(".modal-dom-change-watcher.in .modal-body").css("cssText","max-height:calc(100vh - 29.5vh)");
	  		},25);

	  		setTimeout(function(){
	  			$(".modal.in .sub-container-form-footer").removeClass("hide-footer");
				$(".modal.in .sub-container-form-footer").addClass("show-footer");
	  		},50);
  		}
	});
	/* End dynamic-form-input-container-type ________________________*/

	/* End modal dom-change-watcher ____________________________________________________________________________________*/

	/* #Details #Parents_New_Dynamic_Form_Input _______________________*/

	$(document).on("click",".dom-change-watcher #Parents_New_Dynamic_Form_Input",function(){

		if(!$(this).parents(".modal").length == 1){

			$("#Details .sections-main-sub-container-right-main-rows-parents-details .dynamic-form-input-parent").removeClass("dynamic-form-input-first");
			$dynamic_form_input = $("#Details .sections-main-sub-container-right-main-rows-parents-details .dynamic-form-input-parent").first().clone();
			$dynamic_form_input.find("input").val("");
			$dynamic_form_input.find("input").data('id','null');
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

	/* sub-container-nav-bar-profile-dropdown-ul-li _______________________*/

		$(document).on("click",".sub-container-nav-bar-profile-dropdown-ul-li a",function(){
		
		event.preventDefault();
		event.stopPropagation();

	});


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
		//jQuery.noConflict(); 
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
		$('#ConfirmDeleteModal').data('role',"one");
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



	/* login-done ________________*/

		$(document).on("click",".login-done",function(event){

		$this = $(this);
		
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

		$this.find("img").replaceWith($svg);

		// login failed : enable btn  => 

		setTimeout(function(argument) {

			/* in case there is an error else pass to login view 
			   $img =`<img class="icon button-icon" src="assets/icons/right_arrow.svg"> `;
			   $this.find("svg").replaceWith($img);
			*/

		},2000);

	});

	/* End.login-done ________________*/

	$(document).on("click",".sections-main-sub-container-right-main-header-option-icon",function(event){

		$(".sections-main-sub-container-right-main-header-option-list").css("cssText","display:none");

		$(this).css("cssText","display:none");

		$(this).siblings(".sections-main-sub-container-right-main-header-option-list").css("display","block");
		
		event.preventDefault();
		event.stopPropagation();

	});
	
	/* .finance-page-extra-style .col-text-align img _______________________*/

	$(document).on("mouseenter",".finance-page-extra-style .col-text-align img",function(e){

			$this = $(this);
			$obj = JSON.parse($(this).data("obj").replace(/\\|\//g,''));


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

	$(document).on("mouseleave",".finance-page-extra-style .col-text-align img",function(e){
		$(".custmized-tooltip").css({
			display:"none",
			opacity:0
		})
	});

	/* End .finance-page-extra-style .col-text-align img _______________________*/

/* #EditStudentModal #Parents_New_Dynamic_Form_Input _______________________*/

	$(document).on("click","#EditStudentModal #Modal_Parents_New_Dynamic_Form_Input",function(){
		
			$("#EditStudentModal .dynamic-form-input-parent").removeClass("dynamic-form-input-first");
			$dynamic_form_input = $("#EditStudentModal .dynamic-form-input-parent").first().clone();
			$dynamic_form_input.find("input").val("");
			$(this).parent().before($dynamic_form_input);

			setTimeout(function(){
	  			$(".modal-dom-change-watcher.in .modal-content").css("cssText","height:calc(100% - 72px) !important");
	  			$(".modal-dom-change-watcher.in .modal-content").css("cssText","height:calc(100% - 72px) !important");
	  		},25);

	  		setTimeout(function(){
	  			$(".modal.in .sub-container-form-footer").removeClass("hide-footer");
				$(".modal.in .sub-container-form-footer").addClass("show-footer");
	  		},50);

	});

	$(document).on("click","#EditStudentModal .square-button",function(){

			$(this).parents(".dynamic-form-input-parent").remove();

			if($("#EditStudentModal .dynamic-form-input-parent").length == 1 ){
				$("#EditStudentModal .dynamic-form-input-parent").addClass("dynamic-form-input-first");
			}

			setTimeout(function(){
	  			$(".modal-dom-change-watcher.in .modal-content").css("cssText","height:calc(100% - 72px) !important");
	  			$(".modal-dom-change-watcher.in .modal-content").css("cssText","height:calc(100% - 72px) !important");
	  		},25);

	  		setTimeout(function(){
	  			$(".modal.in .sub-container-form-footer").removeClass("hide-footer");
				$(".modal.in .sub-container-form-footer").addClass("show-footer");
	  		},50);
		
	});


	/* End #EditStudentModal #Parents_New_Dynamic_Form_Input _______________________*/

	/* #EditTeacherModal #Subject_Class_New_Dynamic_Form_Input _______________________*/

	$(document).on("click","#EditTeacherModal #Subject_Class_New_Dynamic_Form_Input",function(){

			$("#EditTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags .dynamic-form-input-dropdown").removeClass("dynamic-form-input-first");

			$dynamic_form_input = $("#EditTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags .dynamic-form-input-dropdown-container").first().clone();

			$dynamic_form_input.find(".input-text-subject-classes-select2").select2("destroy");

			$dynamic_form_input.find(".select2").remove();

			$dynamic_form_input.find(".input-label").removeClass("input-label-move-to-top");

			$(this).parent().find(".sections-main-sub-container-right-main-rows-dropdown-tags-container").last().after($dynamic_form_input);

			$(this).parents(".sections-main-sub-container-right-main-rows-dropdown-tags").find(".input-text-subject-classes-select2").select2({
			  tags: true,
			  dropdownPosition: 'below',
	  		  placeholder: "Classes",
	  		  minimumResultsForSearch: -1,
	  		  templateResult: hideSelected
			});


			$(this).parents(".sections-main-sub-container-right-main-rows-dropdown-tags").find(".input-text-subject-classes-select2").on('select2:selecting', function (e) {

				$(this).parents(".form-group-right").find(".input-label").addClass("input-label-move-to-top");

			});

			$(this).parents(".sections-main-sub-container-right-main-rows-dropdown-tags").find(".input-text-subject-classes-select2").on('select2:unselecting', function (e) {

				if($(this).select2('data').length <= 1 ){
					$(this).parents(".form-group-right").find(".input-label").removeClass("input-label-move-to-top");
				}

			});

	  		setTimeout(function(){
	  			$(".modal-dom-change-watcher.in .modal-content").css("cssText","height:calc(100% - 72px) !important");
	  			$(".modal-dom-change-watcher.in .modal-content").css("cssText","height:calc(100% - 72px) !important");
	  		},25);

	  		setTimeout(function(){
	  			$(".modal.in .sub-container-form-footer").removeClass("hide-footer");
				$(".modal.in .sub-container-form-footer").addClass("show-footer");
	  		},50);

	});

	$(document).on("click","#EditTeacherModal .square-button",function(){

			$(this).parents(".dynamic-form-input-dropdown-container").remove();

			if($("#EditTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags .sections-main-sub-container-right-main-rows-dropdown-tags-container").length == 1 ){
				$("#EditTeacherModal .sections-main-sub-container-right-main-rows-dropdown-tags .sections-main-sub-container-right-main-rows-dropdown-tags-container .dynamic-form-input-dropdown").addClass("dynamic-form-input-first");
			}  		

			setTimeout(function(){
	  			$(".modal-dom-change-watcher.in .modal-content").css("cssText","height:calc(100% - 72px) !important");
	  			$(".modal-dom-change-watcher.in .modal-content").css("cssText","height:calc(100% - 72px) !important");
	  		},25);

	  		setTimeout(function(){
	  			$(".modal.in .sub-container-form-footer").removeClass("hide-footer");
				$(".modal.in .sub-container-form-footer").addClass("show-footer");
	  		},50);
		
	});

	/* End #Details #Parents_New_Dynamic_Form_Input _______________________*/

	/* modal-card-container _________________*/

	$(document).on("click",".modal-card-container",function(){

		$(".sections-main-container").removeClass("modal-open-finance");

		if($(this).attr("data-val") == "Retard" ){
			$("#AddAbsenceModal .sections-label-checkbox-main-container[data-val='Retard']").trigger("click");
		}else{
			$("#AddAbsenceModal .sections-label-checkbox-main-container[data-val='Absence']").trigger("click");
		}

		if($(this).attr("data-val") == "Payment" ){
			$(".sections-main-container").addClass("modal-open-finance");
		}

		setTimeout(function(){
			$("#NewActionModal").modal("hide");
		},5);

		
		
	});

	/* .modal-btn import from file _________________*/

	$(document).on("click",".modal-btn",function(){

		setTimeout(function(){
			$("#NewActionModal").modal("hide");
		},5);
		
	});

	


	/* ImportUsersModal  ________________*/

		$(document).on("click","#ImportUsersModal .modal-confirm-button ",function(event){

		$this = $(this);
		
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

		$this.find("img").replaceWith($svg);

		// Note : disable modal action while loading

		// on success 

		setTimeout(function(argument) {

			$img =`<img class="icon button-icon" src="assets/icons/check_small.svg"> `;

			$this.find("svg").replaceWith($img);

		},10000);



	});

	/* End ImportUsersModal  ________________*/

	/* .main-selected-school _________________*/

	$(document).on("click",".main-selected-school",function(event){

		$(".main-selected-school").toggleClass("main-selected-school-border");

		toggleSlide(".school-dropdown-list");
		$(".school-dropdown-list").css("visibility","visible");
		if($(".sub-container-nav-bar-profile-dropdown-mask").css("opacity") == 1 ){
			$(".sub-container-nav-bar-profile-dropdown-close").click();
		}

		event.stopPropagation();
		event.preventDefault();

	});


	/* End main-selected-school _________________*/	

	/* .main-selected-school _________________*/

	$(document).on("click",".main-selected-school .button-icon",function(event){

		$(".main-selected-school").click();

		event.stopPropagation();
		event.preventDefault();

	});



	/* End main-selected-school _________________*/

	/* .dashboard-chat-side-bar-body-extra-style _________________*/

	$(document).on("click",".dashboard-chat-side-bar-body-extra-style",function(event){

		$(".dashboard-new-message-side-bar-container").css("display","flex");

		setTimeout(function(){
			$(".dashboard-new-message-side-bar-container").css("left","0%");
			$(".message-input").focus();
		},10);

	});

	/* .dashboard-chat-side-bar-header-close-icon _________________*/

	$(document).on("click",".dashboard-chat-side-bar-header-close-icon",function(event){

		$(".dashboard-new-message-side-bar-container").css("left","100%");
		$(".message-input").val("");
		$(".message-input").focus();

		setTimeout(function(){
			$(".dashboard-new-message-side-bar-container").css("display","none");
		},500);


	});

	/* #Send_Btn _________________*/

	$(document).on("click","#Send_Btn",function(event){

		if($(".message-input").val() != ""){

			$(".dashboard-new-message-side-bar-body").animate({ scrollTop: $('.dashboard-new-message-side-bar-body').prop("scrollHeight")}, 1000);

			$time = FormatAMPM(new Date);

			$newBubble =`<div class="dashboard-new-message-side-bar-body-bubble right-bubble">
				<p class="">
				`+$(".message-input").val()+`
				</p>
				<span class="bubble-timing">`+$time+`</span>
				</div>`;

			$(".dashboard-new-message-side-bar-body").append($newBubble);

			$(".message-input").val("");

			$(".message-input").focus();
		}


	});

	/* End #Send_Btn ____________________*/

	/* #Add_New_Message _________________*/

	$(document).on("click","#Add_New_Message",function(event){

		$(this).removeClass("caret-rotate-reset");

		$(".dashboard-add-new-message-side-bar-container").css("display","flex");

		setTimeout(function(){
			$(".dashboard-add-new-message-side-bar-container").css("left","0%");
			$(".message-input").focus();
		},10);

	});

	/* #Add_New_Message .button-icon _________________*/

	$(document).on("click","#Add_New_Message .button-icon",function(event){

		$(this).removeClass("caret-rotate-reset");

		$(".dashboard-add-new-message-side-bar-container").css("display","flex");

		setTimeout(function(){
			$(".dashboard-add-new-message-side-bar-container").css("left","0%");
			$(".message-input").focus();
		},10);

	});

	/* .dashboard-chat-side-bar-header-close-icon _________________*/

	$(document).on("click",".dashboard-chat-side-bar-header-close-icon",function(event){

		$(".dashboard-add-new-message-side-bar-container").css("left","100%");

		setTimeout(function(){
			$(".dashboard-add-new-message-side-bar-container").css("display","none");
		},500);

	});

	/* .dashboard-chat-side-bar-header-filter-icon _________________*/

	$(document).on("click",".dashboard-chat-side-bar-header-filter-open-icon",function(event){

		$(".dashboard-filter-message-side-bar-container").css("display","inline-block");

		setTimeout(function(){
			$(".dashboard-filter-message-side-bar-container").css("cssText","top : 0% ");
		},10);

	});

	/* .dashboard-chat-side-bar-header-close-icon _________________*/

	$(document).on("click",".dashboard-chat-side-bar-header-close-icon",function(event){

		$(".dashboard-filter-message-side-bar-container").css("cssText","top: -100% ");

		setTimeout(function(){
			$(".dashboard-filter-message-side-bar-container").css("display","none");
		},500);

	});

	/* End .dashboard-chat-side-bar-body-extra-style _________________*/

	/* .nav-bar-account-settings  _________________*/

	$(document).on("click",".nav-bar-account-settings",function(event){

		$(".sub-container-nav-bar-profile-dropdown-mask").css({"opacity":"0"});

		setTimeout(function(){
			$(".sub-container-nav-bar-profile-dropdown-mask").css({"display":"none"});
		},25);

		$(".sub-container-nav-bar-img").css({"display":"inline-block"});

		$(".sub-container-nav-bar-img").addClass("sub-container-nav-bar-img-animation");


		setTimeout(function(){
			$("#ProfileSettings").modal("show");
		},150);
		
		event.preventDefault();
		event.stopPropagation();
		return false;
	});

	/* .form-group-search  _________________*/

	/* .form-group-search-btn  _________________*/

	$(document).on("click",".form-group-search-btn",function(event){
		
		$(".hide-controler").css("opacity","0");

		setTimeout(function(){
			$(".form-group-search").css("cssText","z-index : 4 !important ; opacity : 1 !important;");
		},225);

		$(".form-group-search .button-icon").attr("src","assets/icons/sidebar_icons/close.svg");

		$(".form-group-search .button-icon").addClass("input-text-empty");

		event.preventDefault();
		event.stopPropagation();
		return false;

	});

	/* .form-group-search-btn  _________________*/

	$(document).on("click",".form-group-search .button-icon",function(event){

		$(".form-group-search").css("cssText","z-index : -10 !important ; border-radius : 3px !important; opacity : 0 !important;");

		$(".form-group-search .button-icon").attr("src","assets/icons/sidebar_icons/close.svg");

		setTimeout(function(){
			$(".hide-controler").css("opacity","1");
		},200);
		

		event.preventDefault();
		event.stopPropagation();
		return false;

	});

	$(document).on("keyup blur focus click",".sections-main-sub-container-left-search-bar .form-group-search .input-text",function(event){
		if($(this).val().length == 0 ){
			$(this).siblings(".icon").attr("src","assets/icons/sidebar_icons/close.svg");
			$(this).siblings(".icon").addClass("input-text-empty");
		}else{
			$(this).siblings(".icon").attr("src","assets/icons/sidebar_icons/close.svg");
			$(this).siblings(".icon").removeClass("input-text-empty");
		}

		event.preventDefault();
		event.stopPropagation();

	});

	/* toggleSlide  _________________*/
	
	function toggleSlide($selector) {

	  let $container = $($selector);
	  
	  if( $container.hasClass('slide-down')) {

	    $container.removeClass('slide-down');
	    $container.addClass('slide-up');


	    $(".main-selected-school").find(".button-icon").removeClass("caret-rotate");
		$(".main-selected-school").find(".button-icon").addClass("caret-rotate-reset");


	  } else {

	    $container.removeClass('slide-up');
	    $container.addClass('slide-down');

	    $(".main-selected-school").find(".button-icon").addClass("caret-rotate");
		$(".main-selected-school").find(".button-icon").removeClass("caret-rotate-reset");

	  }
	}

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

		//jQuery.noConflict(); 
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
				////jQuery.noConflict(); 
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


$(document).on("click",".save-changes",function(){

  		$domChange = false;
	});


/* .input-label-text-gender  _________________*/

	$(document).on("click",".dynamic-form-input-dropdown-gender-options li",function(event){

		$profile_img = "";

		$profile_src = "avatar_"+$(this).attr("data-user")+"_"+$(this).attr("data-val")+".svg";

		$profile_src = String($profile_src).toLowerCase();

		if(!$(this).parents(".modal").length == 1){

			$profile_img =  $(".sections-main-sub-container-right-main .input-img");

			if($profile_img.attr("src") == "" 
				|| String($profile_img.attr("src")).includes("avatar") 
				|| String($profile_img.attr("src")).includes("Logo_placeholder") )
			{
				$profile_img.attr("src","assets/images/profiles/"+$profile_src);
			}
			
		}else{
			$profile_img =  $(this).parents(".modal").find(".input-img");
			console.log('profile_img',$profile_img.attr("src"));
			if($profile_img.attr("src") == "" 
				|| String($profile_img.attr("src")).includes("avatar") 
				|| String($profile_img.attr("src")).includes("Logo_placeholder") )
			{
				$profile_img.attr("src","assets/images/profiles/"+$profile_src);
			}
		}
		
		event.preventDefault();
		event.stopPropagation();

	});


 function makeid(length) {
		var result           = '';
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
		  result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
 $(document).ready(function(){         

$("input").each(function(){

		$(this).attr("autocomplete",makeid(50));
		$(this).attr("autofill",'off');
		if($(this).attr("name")=="phone" || $(this).attr("name")=="whatsapp"){
			$(this).attr("maxlength","13");
		}

	});
});