let $myLatlng = { lat: 31.62585619016439, lng: -7.9884129471777054 };
let $myLatlng_Prov = { lat: 31.62585619016439, lng: -7.9884129471777054 };
let $zoom = 1;
let $location = "";
let $Institution_Name = '';

const mapStyle = [
	{
		"featureType": "administrative",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#54585c"
			}
		]
	},
	{
		"featureType": "landscape",
		"elementType": "all",
		"stylers": [
			{
				"color": "#f7f7f7"
			}
		]
	},
	{
		"featureType": "poi",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "on"
			},
			{
				"color": "#e5e5e5"
			}
		]
	},
	{
		"featureType": "poi",
		"elementType": "labels.text",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "road",
		"elementType": "all",
		"stylers": [
			{
				"saturation": -100
			},
			{
				"lightness": 45
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "simplified"
			}
		]
	},
	{
		"featureType": "road.arterial",
		"elementType": "labels.icon",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "transit",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "water",
		"elementType": "all",
		"stylers": [
			{
				"color": "#ededed"
			},
			{
				"visibility": "on"
			}
		]
	}
];

addLoadingAnimation(".sections-main-sub-container-right");
removeLoadingAnimation(".sections-main-sub-container-right", null);

/*********************************************/

$(document).on("keyup",".sub-main-container",(event) => {
	$('.sub-container-form-footer').removeClass('hide-footer');
	$('.sub-container-form-footer').addClass('show-footer');
});

/********************************************/

/*** initAutocomplete  **************/

function initAutocomplete(location, myLatlng, zoomIn) {

  console.log("data =>", location, myLatlng, zoomIn);

  var map = new google.maps.Map(document.getElementById('map'), {
    center: myLatlng ,
    zoom: zoomIn ,
	mapTypeId: 'roadmap'
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('Institution_Adress');
  var searchBox = new google.maps.places.SearchBox(input);
  //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	
  input.placeholder = "";

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
	}

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
	});
	  
    markers = [];

    // For each place, get the icon, name and location.
	var bounds = new google.maps.LatLngBounds();
	  
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
	  }
		
	  $myLatlng = {
		  "lat":place.geometry.location.lat(),
		  "lng":place.geometry.location.lng()
	  }
		
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        //map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
		  bounds.extend(place.geometry.location);
		  map.setZoom(zoomIn);
      }
    });
	
	map.fitBounds(bounds);
	  
	var listener = google.maps.event.addListener(map, "idle", function () {
		map.setZoom(zoomIn);
		google.maps.event.removeListener(listener);
	});
	  
  });
	
  input.value = location;
	
}

function getInstitutionApiInfo() {

	headerParams = {
		'Authorization':
			'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyIjoiYWRtaW5AYmVzaWRlLm1hIiwiaWF0IjoxNjQ1MTA1ODkyfQ.vOIP6X8sJb_8nf7yXLuPCIdFIoku0CTqAMMEFlBnrwg'
	};

	$.ajax({
		type: 'get',
		url: `/Api/v1/Website/All/institutionApiInfo/`,
		data:{"name":"ee"},
		headers: headerParams,
		dataType: 'json'
	})
	.done(function (res) {
		console.log("institutionApiInfo =>", res);
	});

}

function getDetails() {
	$.ajax({
		type: 'get',
		url: '/Website/get/details',
	})
		.done(function (res) {

			$('#Details_Section').removeClass('dom-change-watcher');
			$('#Details_Section').find('input[name="Institution_Name"]').val("");
			$('#Details_Section').find('input[name="Institution_Email"]').val("");
			$('#Details_Section').find('input[name="Institution_Phone"]').val("");
			$('#Details_Section').find('textarea[name="Institution_About"]').val("");
			$('#Details_Section').find('input[name="Institution_Adress"]').val("");
			$('#Details_Section').find('input[name="Institution_Website"]').val("");
		
			$('#Details_Section').find('input[name="Institution_Name"]').val(res.institution.Institution_Name);
			$Institution_Name = res.institution.Institution_Name;
			$('#Details_Section').find('input[name="Institution_Email"]').val(res.institution.Institution_Email);
			$('#Details_Section').find('input[name="Institution_Phone"]').val(res.institution.Institution_Phone);
			$('#Details_Section').find('textarea[name="Institution_About"]').val(res.institution.Institution_About);
			$('#Details_Section').find('input[name="Institution_Adress"]').val(res.institution.Institution_Adress);
			$('#Details_Section').find('input[name="Institution_Website"]').val(res.institution.Institution_Link);
			

			if ( res.institution.Institution_Latitude !== null && res.institution.Institution_Latitude !== undefined ) {
				$myLatlng.lat = (res.institution.Institution_Latitude  * 1);
				$myLatlng.lng = (res.institution.Institution_Longitude * 1);
				$zoom = 18.75;
			} else {
				$myLatlng.lat = $myLatlng_Prov.lat;
				$myLatlng.lng = $myLatlng_Prov.lng;
				$zoom = 4;
			}

			$location = res.institution.Institution_Location
				
			//initMap();
			initAutocomplete(res.institution.Institution_Location, $myLatlng, $zoom);
			
			
	});
}

$(document).ready(  () => {
	getDetails();
	getInstitutionApiInfo();
});

function getGallery() {

	addLoadingAnimation(".sections-main-sub-container-right");

	$.ajax({
		type: 'get',
		url: '/Website/get/gallery',
	})
	.done(function(res){
		console.log("res =>",res);
		removeLoadingAnimation(".sections-main-sub-container-right",null);
		$('#Gallery_Section').find('#sortable').html("");
		$('#Gallery_Section').removeClass('dom-change-watcher');
		//
		$pictures = "";

		res.Gallery.map((pic) =>{
			$(document).find("#sortable").append(CreateNewGalleryPic(pic["Institution_Gallery_Url"]));
			// sortable
			sortableInit();
		});
		
		$('#Gallery_Section').find('#sortable').append();
		$('#Gallery_Section').addClass('dom-change-watcher');
		$("body").trigger("domChanged");
	});
}

getGallery();

function updateDetails() {

	var Institution_Name  = $('#Details_Section').find('input[name="Institution_Name"]').val();
	var Institution_Email = $('#Details_Section').find('input[name="Institution_Email"]').val();
	var Institution_Phone = $('#Details_Section').find('input[name="Institution_Phone"]').val();
	var Institution_Adress  = $('#Details_Section').find('input[name="Institution_Adress"]').val();
	var Institution_About  = $('#Details_Section').find('textarea[name="Institution_About"]').val();
	var Institution_Website = $('#Details_Section').find('input[name="Institution_Website"]').val();
	var Institution_Location = $('#Details_Section').find('input[name="Institution_Location"]').val();

	if (!Institution_Name){
		$('#Details_Section').find('input[name="Institution_Name"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#Details_Section').find('input[name="Institution_Name"]').parent(".form-group").removeClass("form-input-error");
	}

	if (!Institution_Phone){
		$('#Details_Section').find('input[name="Institution_Phone"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		if (!internationalPhoneValidator(Institution_Phone)){
			$('#Details_Section').find('input[name="Institution_Phone"]').parent(".form-group").addClass("form-input-error");
		}
		else{
			$('#Details_Section').find('input[name="Institution_Phone"]').parent(".form-group").removeClass("form-input-error");
		}
	}

	if (!Institution_Adress){
		$('#Details_Section').find('input[name="Institution_Adress"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#Details_Section').find('input[name="Institution_Adress"]').parent(".form-group").removeClass("form-input-error");
	}

	/*if (!Institution_Location){
		$('#Details_Section').find('input[name="Institution_Location"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#Details_Section').find('input[name="Institution_Location"]').parent(".form-group").removeClass("form-input-error");
	}*/

	if (!Institution_About){
		$('#Details_Section').find('textarea[name="Institution_About"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#Details_Section').find('textarea[name="Institution_About"]').parent(".form-group").removeClass("form-input-error");
	}

	if (Institution_Website && Institution_Website != "" ){
		if (!websiteValidator(Institution_Website)){
			$('#Details_Section').find('input[name="Institution_Website"]').parent(".form-group").addClass("form-input-error");
		}
		else{
			$('#Details_Section').find('input[name="Institution_Website"]').parent(".form-group").removeClass("form-input-error");
		}
	} else {
			$('#Details_Section').find('input[name="Institution_Website"]').parent(".form-group").removeClass("form-input-error");
	}

	if (!Institution_Email){
		$('#Details_Section').find('input[name="Institution_Email"]').parent(".form-group").addClass("form-input-error");
	}
	else{

		if (!emailValidator(Institution_Email)){
			$('#Details_Section').find('input[name="Institution_Email"]').parent(".form-group").addClass("form-input-error");
		}
		else{
			$('#Details_Section').find('input[name="Institution_Email"]').parent(".form-group").removeClass("form-input-error");
		}
	}

	// Uncomment if we want to us e initmap with pointer cursor 
	/*if ($myLatlng.lat == $myLatlng_Prov.lat && $myLatlng.lng == $myLatlng_Prov.lng ){
		$('#Details_Section').find("#map").parent(".form-group").addClass("form-input-error");
		return false;
	}
	else{
		$('#Details_Section').find("#map").parent(".form-group").removeClass("form-input-error");
	}*/

	var data =  {
			Institution_Name:$('#Details_Section').find('input[name="Institution_Name"]').val(),
			Institution_Email:$('#Details_Section').find('input[name="Institution_Email"]').val(),
			Institution_Phone:$('#Details_Section').find('input[name="Institution_Phone"]').val(),
			Institution_Adress: $('#Details_Section').find('input[name="Institution_Adress"]').val(),
			Institution_Location: $('#Details_Section').find('input[name="Institution_Adress"]').val(),
			Institution_Website: $('#Details_Section').find('input[name="Institution_Website"]').val(),
			Institution_About: $('#Details_Section').find('textarea[name="Institution_About"]').val(),
			Institution_Latitude: $myLatlng.lat,
			Institution_Longitude: $myLatlng.lng
	}
	
	console.log(data);

	if (Institution_Phone && internationalPhoneValidator(Institution_Phone) && Institution_Adress && Institution_Name && Institution_Email) {
		
		if (Institution_Website != "" && !websiteValidator(Institution_Website)) {
			return false;
		}

		addLoadingAnimation(".sections-main-sub-container-right");

		$.ajax({
			type: 'post',
			url: '/Website/update/details',
			data:data,
			dataType: 'json'
		})
		.done(function(res){
		 	if (res.updated)
		 	{	
		 		removeLoadingAnimation(".sections-main-sub-container-right",null);
				$('.sub-container-form-footer').addClass('hide-footer');
	 			$('.sub-container-form-footer').removeClass('show-footer');
	 			$(".main-selected-school .side-bar-brand-label").text(Institution_Name);
		 	}else{
		 		removeLoadingAnimation(".sections-main-sub-container-right",null);
		 	}
		});

	}
}

function readFile() {
  
  if (this.files && this.files[0]) {
    
    var FR= new FileReader();
    
    FR.addEventListener("load", function(e) {
      document.getElementById("Institution_Logo").src = e.target.result;
    }); 
    
    FR.readAsDataURL( this.files[0] );
  }
  
}

//document.getElementById("Institution_Image").addEventListener("change", readFile);

function discard(section) {
	$('#ChangesModal').attr('data-section',section);
}

$('#ChangesModal').find('#Discard').on('click',function () {
	var section = $('#ChangesModal').attr('data-section');
	switch (section) {
	    case 'Details':
	    	getDetails();
	    break;
		case 'Gallery':
			getGallery();
		break;
		case 'Amenties':
			getAmenties();
		break;
		case 'DisplaySettings':
			getDisplaySettings();
		break;
		default:
			console.log(`Sorry, we are out of ${section}.`);
	}
	$('.sub-container-form-footer-container .sub-container-form-footer').addClass('hide-footer');
 	$('.sub-container-form-footer-container .sub-container-form-footer').removeClass('show-footer');
});

function hideSelected(value) {
  if (value && !value.selected) {
    return $('<span>' + value.text + '</span>');
  }
}

/************ Sortable *********************/

$(document).on("click",".sections-main-sub-container-right-main-header-option-list-li-remove",function () {
	$('#Gallery_Section .sub-container-form-footer').removeClass('hide-footer');
	$('#Gallery_Section .sub-container-form-footer').addClass('show-footer');
});

function updateGallery(){

	$Gloabl_Gallary = [];

    $('#sortable li').each((ind,elm)=>{
      $Gloabl_Gallary.push({
        "url":$(elm).find(".input-img").attr("src"),
        "id":$(elm).find(".sections-main-sub-container-right-main-header-option-list-li-remove").attr("data-id")
      });
	});
	
	if ($Gloabl_Gallary.length >= 3 ) {
		$.ajax({
			type: 'post',
			url: '/Website/update/gallery',
		data: {
				"gallery": $Gloabl_Gallary
			},
			dataType: 'json'
		})
		.done(function(res){
			getGallery();
			$('#Gallery_Section .sub-container-form-footer').addClass('hide-footer');
			$('#Gallery_Section .sub-container-form-footer').removeClass('show-footer');
		});
	}

}

/************ Sortable *********************/

$gallery_selected_element = '';
$gallery_selected_element_state = "Add";

/* .gallery_add_new ________________________*/

$(document).on("click",".gallery_add_new",function (e) {
  $gallery_selected_element_state = "Add";
  $("#gallery_file").trigger("click");
});

/* End .gallery_add_new ________________________*/

// sortable
sortableInit();

$(document).on("click",".ui-state-default",function (e) {
  $gallery_selected_element_state = "Edit";
  $gallery_selected_element = $(this).find(".input-img")[0];
  $("#gallery_file").trigger("click");
});

function readGalleryFiles() {
  if (this.files && this.files.length > 0 ) {
    for(f=0 ; f < this.files.length ; f++ ){
      var FR= new FileReader();
      FR.addEventListener("load", function(e) {
        if($gallery_selected_element_state == "Add"){
          $(document).find("#sortable").append(CreateNewGalleryPic(e.target.result));
          // sortable
          sortableInit();
          // show customNextBtn
          toggleCustomNextBtn();
        }else{
          $($gallery_selected_element).attr("src",e.target.result);
        }
      });
      FR.readAsDataURL(this.files[f]);
      // empty
      $('#gallery_file').attr('value', '');
    };
  }
}

document.getElementById("gallery_file").addEventListener("change", readGalleryFiles);

/* Create New Gallery Pic ________________________*/

$(document).on("click","#Gallery_Section .sections-main-sub-container-right-main-header-option-list-li-remove",function (e) {
  e.preventDefault();
  e.stopPropagation();
  if($(this).attr("data-id") == -1){
    $(this).parents(".ui-state-default").remove();
	atLeast3Pics();
  }
  // show customNextBtn
  toggleCustomNextBtn();
});

/* Create New Gallery Pic ________________________*/

function CreateNewGalleryPic(src) {
  $pic = `<li class="ui-state-default">
            <div class="input-img-container input-square-img-container logo">
              <img class="input-img" src="${src}" data-src="${src}" class="gallery-output">
              <div class="input-img-container-mask">
                  <!-- sections-main-sub-container-right-main-header-option-list ------------------------------>
                  <div class="sections-main-sub-container-right-main-header-option-list">
                    <div class="sections-main-sub-container-right-main-header-option-list-li sections-main-sub-container-right-main-header-option-list-li-edit">
                      <img src="assets/icons/edit.svg" alt="edit"/>
                    </div>                
                    <div class="sections-main-sub-container-right-main-header-option-list-li sections-main-sub-container-right-main-header-option-list-li-remove" data-id="-1">
                      <img src="assets/icons/delete.svg" alt="delete">
                    </div>
                  </div>
                  <!-- sections-main-sub-container-right-main-header-option-list ------------------------------>
              </div>
            </div>
          </li>`;
  return $pic;
}

/* sortableInit ________________________*/

function sortableInit() {
  window.sortable = $("#sortable").sortable({
    stop : (event,ui)=>{
      $pictures = [];
      $(".ui-state-default .input-img").each((ind,elm)=>{
        $pictures.push({
          "position":(ind+1),
          "url":$(elm).attr("src")
        })
      });
	  $('#Gallery_Section .sub-container-form-footer').removeClass('hide-footer');
	  $('#Gallery_Section .sub-container-form-footer').addClass('show-footer');
    },
    cancel: ".static"
  }).disableSelection();

  // at Least 3 Pics
  atLeast3Pics();
  
}

/* toggleCustomNextBtn ________________________*/

function toggleCustomNextBtn() {

  $Gloabl_Gallary =[];

  if($('#sortable li').length >= 3 ){
    $("#Gallery_Section .sub-container-form-footer .customNextBtn").removeClass("hidden");
	$(".sections-main-sub-container-right-main-header-option-list-li-remove").css("display","inline-block");
  }else{
    $("#Gallery_Section .sub-container-form-footer .customNextBtn").addClass("hidden");
	$(".sections-main-sub-container-right-main-header-option-list-li-remove").css("display","none");
  }
  
  $('#sortable li').each((ind,elm)=>{
    $Gloabl_Gallary.push({
      "url":$(elm).find(".input-img").attr("src"),
      "id":$(elm).find(".sections-main-sub-container-right-main-header-option-list-li-remove").attr("data-id")
    });
  });

  atLeast3Pics();
 
}

/* Drag to upload  ________________________*/

const eventChange = new Event('change');
var $dropzone = document.querySelector('.import-file-container');
var input = document.getElementById('gallery_file');
var input_file = $('#gallery_file');

$dropzone.ondragover = function (e) { 
  e.preventDefault(); 
  this.classList.add('dragover');
};
$dropzone.ondragleave = function (e) { 
    e.preventDefault();
    this.classList.remove('dragover');
};
$dropzone.ondrop = function (e) {
    e.preventDefault();
    this.classList.remove('dragover');
    input.files = e.dataTransfer.files;
    $gallery_selected_element_state = "Add";
    input.dispatchEvent(eventChange);
}


/**************** */

function atLeast3Pics() {
	if($('#sortable li').length > 3 ){
		$(".sections-main-sub-container-right-main-header-option-list-li-remove").css("display","inline-block");
	  }else{
		$(".sections-main-sub-container-right-main-header-option-list-li-remove").css("display","none");
	  }
}

/** .modal-confirm-button *************************/

$(document).on("click", ".modal-confirm-button", function (event) {
	$("#ChangesModal").modal("hide");
	domChangeWatcher();
});

/********** google map  *************/

function initMap() {
 
	const map = new google.maps.Map(document.getElementById("map"), {
		zoom: $zoom,
		center: $myLatlng,
		styles : mapStyle
	});

	marker = new google.maps.Marker({
		position: $myLatlng,
		icon: '/assets/icons/marker.png',
	});
		
	marker.setMap(null);
	marker.setMap(map);
	// Configure the click listener.
	map.addListener("click", (mapsMouseEvent) => {
	
		// To remove the marker from the map
		marker.setMap(null);
		$myLatlng = mapsMouseEvent.latLng.toJSON();
		
		marker = null;
		marker = new google.maps.Marker({
			position: $myLatlng,
			icon: '/assets/icons/marker.png',
		});

		// To add the marker to the map, call setMap();
		marker.setMap(map);

		$('.sub-container-form-footer').removeClass('hide-footer');
		$('.sub-container-form-footer').addClass('show-footer');
		
	});
}

/********** getAmenties  *************/

var oldSubjects = [];
var $alreadySelected = [];

function getAmenties() {

	addLoadingAnimation(".sections-main-sub-container-right");

	$.ajax({
		type: 'get',
		url: '/Website/get/amenties',
	})
	.done(function (res) {
		
		removeLoadingAnimation(".sections-main-sub-container-right",null);
		$('#Amenties_Section').removeClass('dom-change-watcher');

		amentiesHtml = ``;

		Amenties = SortAmentiesList(res.Amenties);

		for (var i = 0; i < Amenties.length; i++){
			
			checked = Amenties[i].Amenty_Selected == 1 ? 'checked' : '';
			
			//$Amenty_Label = arrLang[$lang][String(Amenties[i].Amenty_Label).replace(/\s/g, "_")];
			$Amenty_Label = arrLang[$lang][String(Amenties[i].Amenty_Label).replace(/\s/g, "_")];
		
			amentiesHtml +=`<div class="switcher-container">
								<!-- switcher-container -->
								<label class="switch" for="${String($Amenty_Label+''+Amenties[i].Amenty_ID).replace(' ','')}">
								<input ${checked} type="checkbox" data-val="${Amenties[i].Amenty_ID}" id="${String($Amenty_Label+''+Amenties[i].Amenty_ID).replace(' ','')}">
								<span class="slider round"></span>
								</label>
								<label for="${String($Amenty_Label+''+Amenties[i].Amenty_ID).replace(' ','')}" class="sections-main-sub-container-right-main-result-label">
								<img  class="switch_icon" src="${Amenties[i].Amenty_Icon}" />
								<span class="switch_label">${$Amenty_Label}</span>
								</label>
								<!-- End switcher-container -->
								<!-- switcher-mask-container -->
								<label class="switcher-mask-container" for="${String($Amenty_Label + '' + Amenties[i].Amenty_ID).replace(' ', '')}"></label>
								<!-- end switcher-mask-container -->
							</div>`;
		} 
				
		$('#Amenties_Section').find('#amenties-container').html("");
		$('#Amenties_Section').find('#amenties-container').prepend(amentiesHtml);
		$('#Amenties_Section').addClass('dom-change-watcher');

	});
}

getAmenties();

$(document).on("click" , (e) => {
	
	$Gloabl_Amenties =[];

	$('#amenties-container input[type="checkbox"]').each((ind, elm) => {
		if ($(elm).is(':checked')) {
			$Gloabl_Amenties.push($(elm).attr("data-val"));
		}
	});

	if ($Gloabl_Amenties.length == 0 ) {
		setTimeout((e) => {
			$('#Amenties_Section .sub-container-form-footer').removeClass('show-footer');
			$('#Amenties_Section .sub-container-form-footer').addClass('hide-footer');
			$('#Amenties_Section .sub-main-container').css('height', "calc(100%)");
			console.log("if =>", $Gloabl_Amenties.length);
		}, 200);
	} else {
		setTimeout((e) => {
			$('#Amenties_Section .sub-container-form-footer').addClass('show-footer');
			$('#Amenties_Section .sub-container-form-footer').removeClass('hide-footer');
			$('#Amenties_Section .sub-main-container').css('height', "calc(100vh - 120px)");
			console.log("else =>", $Gloabl_Amenties.length);
		}, 200);
	}

});

function updateAmenties(event){

	$Gloabl_Amenties = [];

	$('#amenties-container input[type="checkbox"]').each((ind, elm) => {
		if ($(elm).is(':checked')) {
			$Gloabl_Amenties.push($(elm).attr("data-val"));
		}
	});
	
	console.log("Gloabl_Amenties =>", $Gloabl_Amenties);

	if ($Gloabl_Amenties.length > 0 ) {

		$.ajax({
			type: 'post',
			url: '/Website/update/amenties',
		data: {
				"amenties": $Gloabl_Amenties
			},
			dataType: 'json'
		})
		.done(function (res) {
			
			getAmenties();
			setTimeout((e) => {
				$('#Amenties_Section .sub-container-form-footer').addClass('hide-footer');
				$('#Amenties_Section .sub-container-form-footer').removeClass('show-footer');
				$('#Amenties_Section .sub-main-container').css('height', "calc(100%)");
			}, 200);
			
		});
		
	}


	event.stopPropagation();
	event.preventDefault();

}

/********** getDisplaySettings  *************/

function getDisplaySettings() {

	addLoadingAnimation(".sections-main-sub-container-right");

	$.ajax({
		type: 'get',
		url: '/Website/get/displaySettings',
	})
	.done(function (res) {
		
		removeLoadingAnimation(".sections-main-sub-container-right",null);
		$('#Dispaly_Settings_Section').removeClass('dom-change-watcher');

		dispalySettingsHtml = ``;

		console.log("DisplaySettings =>", res.DisplaySettings);

		DisplaySettings = SortDisplaySettingsList(res.DisplaySettings);

		for (var i = 0; i < DisplaySettings.length; i++){
			
			checked = DisplaySettings[i].MTD_Selected == 1 ? 'checked' : '';
			preview = DisplaySettings[i].MTD_Label == "Website" ? `<a href="#">${arrLang[$lang]["Website_Preview"]}</a>` : "";
		
			dispalySettingsHtml +=`<div class="switcher-main-container">
			
									<div class="switcher-container">

										<!-- switcher-container -->
										<label for="${String(DisplaySettings[i].MTD_Label+''+DisplaySettings[i].MTD_ID).replace(' ','')}" class="sections-main-sub-container-right-main-result-label">
											<span class="switch_label">${arrLang[$lang][DisplaySettings[i].MTD_Label]}</span>
										</label>
										<label class="switch" for="${String(DisplaySettings[i].MTD_Label+''+DisplaySettings[i].MTD_ID).replace(' ','')}">
											<input ${checked} type="checkbox" data-val="${DisplaySettings[i].MTD_ID}" id="${String(DisplaySettings[i].MTD_Label+''+DisplaySettings[i].MTD_ID).replace(' ','')}">
											<span class="slider round"></span>
										</label>
										<!-- End switcher-container -->
										<!-- switcher-mask-container -->
										<label class="switcher-mask-container" for="${String(DisplaySettings[i].MTD_Label+''+DisplaySettings[i].MTD_ID).replace(' ','')}"></label>
										<!-- end switcher-mask-container -->
									</div>

									<span class="switch_sub_label"> 
										<span style="opacity: 1;">
											${arrLang[$lang][DisplaySettings[i].MTD_Sub_Label]}
											<span>${preview}</span>
										</span> 
									</span>

								</div>`;
		} 
				
		$('#Dispaly_Settings_Section').find('#display-settings-container').html("");
		$('#Dispaly_Settings_Section').find('#display-settings-container').prepend(dispalySettingsHtml);
		$('#Dispaly_Settings_Section').addClass('dom-change-watcher');

	});
}

getDisplaySettings();

function updateDispalySettings(event){

	$Gloabl_Display_Settings = [];

	$('#display-settings-container input[type="checkbox"]').each((ind, elm) => {
		if ($(elm).is(':checked')) {
			$Gloabl_Display_Settings.push($(elm).attr("data-val"));
		}
	});
	
	console.log("Gloabl_Display_Settings =>", $Gloabl_Display_Settings);

	$.ajax({
		type: 'post',
		url: '/Website/update/displaySettings',
	   data: {
			"display_Settings": $Gloabl_Display_Settings
		},
		dataType: 'json'
	})
	.done(function (res) {
		
		getDisplaySettings();
		setTimeout((e) => {
			$('#Dispaly_Settings_Section .sub-container-form-footer').addClass('hide-footer');
			$('#Dispaly_Settings_Section .sub-container-form-footer').removeClass('show-footer');
			$('#Dispaly_Settings_Section .sub-main-container').css('height', "calc(100%)");
		}, 200);
		
	});

}

/** #ChangesModal .modal-confirm-button  */

$(document).on("click", "#ChangesModal .modal-confirm-button", function (event) {

	switch ($oldActiveTab) {
		case '#Details_Section':
			console.log($oldActiveTab)
			updateDetails(event);
	    	break;
		case '#Amenties_Section':
			console.log($oldActiveTab)
			updateAmenties(event);
			break;
		case '#Gallery_Section':
			console.log($oldActiveTab)
			updateGallery(event);
			break;
		case '#Dispaly_Settings_Section':
			console.log($oldActiveTab)
			updateDispalySettings(event);
			break;
		default:
			console.log(`Sorry, we are out of ${section}.`);
			break;
	}
	
	$domChange  = false;
	
});


$("#Details_Section").on("keyup","input",function (params) {
	$domChange  = true;
});
