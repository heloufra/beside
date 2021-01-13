getAllHomeworks();
var homeworks = [];
var homeworkId = 0;
var ClasseFilter = [];
var removedFiles = [];

let inputFile = $('#EditHomeworkModal').find('input[name="upload_file"]');
let button = $('#EditHomeworkModal .file-add-btn');
let buttonSubmit = $('#mySubmitButton');
let filesContainer = $('#EditHomeworkModal').find('.list-files');
let files = [];

let inputFileAdd = $('#AddHomeworkModal').find('input[name="upload_file_modal"]');
let buttonAdd = $('#AddHomeworkModal .file-add-btn');
let buttonSubmitAdd = $('#mySubmitButton');
let filesContainerAdd = $('#AddHomeworkModal').find('.list-files');
let filesAdd = [];

let $detailsSelector = "#HomeworkDetails";

function getAllHomeworks(id) {
 	$('.homework-row').remove();
	$.ajax({
	    type: 'get',
	    url: '/Homeworks/all',
	    dataType: 'json'
	  })
	  .done(function(res){
	  	if(res.errors)
	  	{
	  		console.log(res.errors)
	  	} else {

	  		homeworks = res.homeworks;

	  		if (res.homeworks.length > 0){

	  			homeworkId = res.homeworks[0].Homework_ID;

	  			if (id){
	  				displayHomework(id);
	  			}
	  			else{
	  				displayHomework(res.homeworks[0].Homework_ID);
	  			}
	  		}

	  		var active = '';
	  		var name = '';

	  		addSideBarLoadingAnimation($sideSelector)

	  		for (var i = 0; i <= res.homeworks.length - 1; i++) {

	  			if (i === 0){
	  				active = 'active';
	  			}
	  			else{
	  				active = '';
	  			}

	  			name = JSON.parse(res.homeworks[i].User_Name);
	  			console.log("color "+res.homeworks[i].Subject_Label.slice(0,2)+"-"+res.homeworks[i].Subject_Color);

	  			$('#list_homeworks').append('<div data-id="'+res.homeworks[i].Homework_ID+'" class="sections-main-sub-container-left-card homework-row '+active+'"><input name="homeworkId" type="hidden" value="'+res.homeworks[i].Homework_ID+'"> <div class="sections-main-sub-container-left-card-main-img-text" data-style="background: '+res.homeworks[i].Subject_Color+';" >'+res.homeworks[i].Subject_Label.slice(0,2)+'</div> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+res.homeworks[i].Homework_Title+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+res.homeworks[i].Subject_Label+' - '+res.homeworks[i].Classe_Label+' - '+name.first_name+' '+ name.last_name+' </span> </div> </div>');
	  		}

	  		removeSideBarLoadingAnimation($sideSelector);
	  	}
	  });
 }

var fileData = null;

$('#AddHomeworkModal').find('input[name="upload_file_modal"]').on( "change", function() {
	if ($(this).val().replace(/\s/g, '') !== '')
	{
		/**************************************/

			let newFiles = []; 

		    for(let index = 0; index < inputFileAdd[0].files.length; index++) {
		      let file = inputFileAdd[0].files[index];
		      newFiles.push(file);
		      filesAdd.push(file);
		    }
		    
		    newFiles.forEach(file => {

		      let fileElementAdd = $(`<div class="file-container file-upload"> <div class="file-icon-label"> <img class="file-icon" src="assets/icons/file.svg" alt="file"/> <span class="file-label">`+$(this).val().split("\\")[2]+`</span> </div> <img class="file-close" onclick="discardFileModal(this)" src="assets/icons/close-gray.svg" alt="close"/> <div class="progress"> <div class="progress-bar" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"> </div> </div> </div>`);

		      fileElementAdd.attr('data-fileData', file);

		      filesContainerAdd.append(fileElementAdd);

		      setTimeout(function(){
				$('#AddHomeworkModal').find('.file-container .progress-bar').css('width', '100%').attr('aria-valuenow', 100); 
			  },500);
		      
		    });

		/**************************************/
	}
});

$('#EditHomeworkModal').find('input[name="upload_file"]').on( "change", function() {

	if ($(this).val().replace(/\s/g, '') !== '')
	{
		/**************************************/

			let newFiles = []; 

		    for(let index = 0; index < inputFile[0].files.length; index++) {
		      let file = inputFile[0].files[index];
		      newFiles.push(file);
		      files.push(file);
		    }
		    
		    newFiles.forEach(file => {

		      let fileElement = $(`<div class="file-container file-upload"> <div class="file-icon-label"> <img class="file-icon" src="assets/icons/file.svg" alt="file"/> <span class="file-label">`+$(this).val().split("\\")[2]+`</span> </div> <img class="file-close" onclick="discardFile(this)" src="assets/icons/close-gray.svg" alt="close"/> <div class="progress"> <div class="progress-bar" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"> </div> </div> </div>`);

		      fileElement.attr('data-fileData', file);

		      filesContainer.append(fileElement);

		      setTimeout(function(){
				$('#EditHomeworkModal').find('.file-container .progress-bar').css('width', '100%').attr('aria-valuenow', 100); 
			  },500);
		      
		    });

		/**************************************/

	}

})

function discardFileModal(this_elm) {
	file_to_remove = $(this_elm).parents('.file-upload').attr("data-filedata");
	let indexToRemove = filesAdd.indexOf(file_to_remove);
	filesAdd.splice(indexToRemove, 1);
	$(this_elm).parents('.file-upload').remove();
}

function discardFile(this_elm) {

	file_to_remove = $(this_elm).parents('.file-upload').attr("data-filedata");
	let indexToRemove = files.indexOf(file_to_remove);
	files.splice(indexToRemove, 1);
	$(this_elm).parents('.file-upload').remove();
}

function saveHomework() {

	var homework_classe = $('#AddHomeworkModal').find('input[name="homework_classe"]').val();
	var homework_deliverydate = $('#AddHomeworkModal').find('input[name="homework_deliverydate"]').val();

	var homework_subject = $('#AddHomeworkModal').find('input[name="homework_subject"]').val();
	var homework_name = $('#AddHomeworkModal').find('input[name="homework_name"]').val();
	var homework_description = $('#AddHomeworkModal').find('#homework_description').val();
	var at_type = "";

	console.log(homework_classe,homework_subject,homework_deliverydate,homework_description,homework_name);

	if (!homework_deliverydate){
		$('#AddHomeworkModal').find('.homework_deliverydate').css("border-color", "#f6b8c1");
	}
	else{
		$('#AddHomeworkModal').find('.homework_deliverydate').css("border-color", "#EFEFEF");
	}
	if (!homework_classe){
		$('#AddHomeworkModal').find('.homework_classe').css("border-color", "#f6b8c1");
	}
	else{
		$('#AddHomeworkModal').find('.homework_classe').css("border-color", "#EFEFEF");
	}
	if (!homework_name){
		$('#AddHomeworkModal').find('.homework_name').css("border-color", "#f6b8c1");
	}
	else{
		$('#AddHomeworkModal').find('.homework_name').css("border-color", "#EFEFEF");
	}

	if (!homework_subject){
		$('#AddHomeworkModal').find('.homework_subject').css("border-color", "#f6b8c1");
	}
	else{
		$('#AddHomeworkModal').find('.homework_subject').css("border-color", "#EFEFEF");
	}
	if (!homework_description){
		$('#AddHomeworkModal').find('#homework_description').css("border-color", "#f6b8c1");
	}
	else{
		$('#AddHomeworkModal').find('#homework_description').css("border-color", "#EFEFEF");
	}

	if (homework_name && homework_description && homework_deliverydate && homework_subject && homework_classe)
	{
		$('#AddHomeworkModal').modal('hide');
		var formData = new FormData();
        formData.append('homework_name', homework_name);
        formData.append('homework_deliverydate', homework_deliverydate);
        formData.append('homework_description', homework_description);
        formData.append('homework_classe', homework_classe);
        formData.append('homework_subject', homework_subject);

		filesAdd.forEach((fl) => {
			formData.append("file",fl);
			console.log("saved fl",fl)
		});

		$.ajax({
		    type: 'post',
		    url: '/Homeworks/save',
		    data: formData,
		    processData: false,
        	contentType: false
		  })
		  .done(function(res){
		  	if(res.saved)
		  	{
		  		getAllHomeworks();
		  		$('#AddHomeworkModal').find('.file-upload').addClass('file-container-visibility');
				$('#AddHomeworkModal').find('input[name="homework_classe"]').val("");
				$('#AddHomeworkModal').find('input[name="homework_deliverydate"]').val("");
				$('#AddHomeworkModal').find('input[name="homework_subject"]').val("");
				$('#AddHomeworkModal').find('input[name="homework_name"]').val("");
				$('#AddHomeworkModal').find('#homework_description').val("");
				$('#AddHomeworkModal').find('input[name="upload_file_modal"]').val('');
				filesAdd = [];
				console.log('Saved');
		  	} else {
		  		console.log("not saved");
		  	}
		  });
	}
}

 function remove() {
	$.ajax({
		    type: 'post',
		    url: '/Homeworks/remove',
		    data: {
		    	id:homeworkId
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.removed)
		  	{
		  			getAllHomeworks();
		  			$('#homework_info').addClass('hidden');
		  			$('#ConfirmDeleteModal').modal('hide');
		  	} else {
		  		console.log(res);
		  	}
		  });
 }

 function saveChange() {

 	var homework_name = $('#EditHomeworkModal').find('input[name="homework_name"]').val();
 	var homework_date = $('#EditHomeworkModal').find('input[name="homework_date"]').val();
 	var homework_description =  $('#EditHomeworkModal').find('#homework_description').val();

	if (!homework_name){
		$('#EditHomeworkModal').find('.homework_name').css("border-color", "#f6b8c1");
	}
	else{
		$('#EditHomeworkModal').find('.homework_name').css("border-color", "#EFEFEF");
	}

	if (!homework_date){
		$('#EditHomeworkModal').find('.homework_date').css("border-color", "#f6b8c1");
	}
	else{
		$('#EditHomeworkModal').find('.homework_date').css("border-color", "#EFEFEF");
	}

	if (!homework_description){
		$('#EditHomeworkModal').find('.homework_description').css("border-color", "#f6b8c1");
	}
	else{
		$('#EditHomeworkModal').find('.homework_description').css("border-color", "#EFEFEF");
	}

 	var formData = new FormData();
 	formData.append('id', homeworkId);
    formData.append('homework_name', $('#EditHomeworkModal').find('input[name="homework_name"]').val());
    formData.append('homework_date', $('#EditHomeworkModal').find('input[name="homework_date"]').val());
    formData.append('homework_description', $('#EditHomeworkModal').find('#homework_description').val());

    if(removedFiles.length != 0){
    	formData.append('removedFiles', removedFiles );
    }

 	files.forEach((fl) => {
      formData.append("file",fl);
    });



    if (homework_name && homework_description && homework_date ){

    	$.ajax({
		    type: 'post',
		    url: '/Homeworks/update',
		    data: formData,
		    processData: false,
		    cache: false,
	        contentType: false

		  })
		  .done(function(res){
		  	if(res.updated)
		  	{
		  			getAllHomeworks(homeworkId);
		  			$('#EditHomeworkModal').modal('hide');
		  			removedFiles = [];
		  			files = [];
		  			console.log(res);
		  	} else {
		  		console.log(res);
		  	}
		});

		$('#EditHomeworkModal .sub-container-form-footer').addClass('hide-footer');
		$('#EditHomeworkModal .sub-container-form-footer').removeClass('show-footer');

    }

 }
 function discardChange() {
 	$('#EditHomeworkModal .sub-container-form-footer').addClass('hide-footer');
 	$('#EditHomeworkModal .sub-container-form-footer').removeClass('show-footer');
 	$('#EditHomeworkModal').find('.file-upload').addClass('file-container-visibility');
 	$('#EditHomeworkModal').find('input[name="upload_file"]').val('');
 	$('#EditHomeworkModal').modal('hide');
 	displayHomework(homeworkId);
 }

function displayHomework(index)
{

	addLoadingAnimation($detailsSelector,$headerInfo);

	$('#HomeworkDetails').removeClass("dom-change-watcher");
	$('#EditHomeworkModal').removeClass("dom-change-watcher");
	$.ajax({
    type: 'get',
    url: '/Homeworks/one',
    data: {
    	homework_id:index
    },
    dataType: 'json'
  })
  .done(function(res){
  	if(res.errors)
  	{
  		console.log(res.errors)
		removeLoadingAnimation($detailsSelector,$headerInfo);
  	} else {

		removeLoadingAnimation($detailsSelector,$headerInfo);
  		console.log(res.homeworkFiles)
  		if (res.homework[0])
  		{
  			var name = JSON.parse(res.homework[0].User_Name);
  			$('#homework_info').find('input[name="upload_file"]').val('');
	  		$('#homework_info').removeClass('hidden');
	  		$('#homework_info').find('.file-forms').remove();
	  		$('#homework_info').find('.homework_img').css('background-color',res.homework[0].Subject_Color);
	  		$('#homework_info').find('.homework_img').html(res.homework[0].Subject_Label.slice(0,2))
	  		$('#homework_info').find('.label-full-name').html(res.homework[0].Homework_Title);
	  		$('#homework_info').find('input[name="homework_name"]').val(res.homework[0].Homework_Title);
	  		$('#homework_info').find('input[name="homework_date"]').val(res.homework[0].Homework_DeliveryDate);
	  		$('#homework_info').find('#homework_description').val(res.homework[0].Homework_Deatils);
	  		$('#homework_info').find('.file-upload').addClass('file-container-visibility');
	  		$('#homework_info').find('.sub-label-full-name').html(res.homework[0].Subject_Label+' - '+res.homework[0].Classe_Label+' - '+name.first_name+' '+ name.last_name);
	  		$('#EditHomeworkModal').find('input[name="upload_file"]').val('');
	  		$('#EditHomeworkModal').removeClass('hidden');
	  		$('#EditHomeworkModal').find('.file-forms').remove();
	  		$('#EditHomeworkModal').find('input[name="homework_name"]').val(res.homework[0].Homework_Title);
	  		$('#EditHomeworkModal').find('input[name="homework_date"]').val(res.homework[0].Homework_DeliveryDate);
	  		$('#EditHomeworkModal').find('#homework_description').val(res.homework[0].Homework_Deatils);
	  		$('#EditHomeworkModal').find('input[name="upload_file"]').val('');
	  		$('#EditHomeworkModal').find('.file-upload').addClass('file-container-visibility');
	  		for (var i = res.homeworkFiles.length - 1; i >= 0; i--) {
	  			$('#homework_info').find('.list-files').prepend('<a style="text-decoration: none; color: inherit;" download href="'+res.homeworkFiles[i].Homework_Link+'"><div class="file-container file-loaded file-forms"> <div class="file-icon-label"> <img class="file-icon" src="assets/icons/file.svg" alt="file"/> <span class="file-label">'+res.homeworkFiles[i].Homework_Title+'</span> </div></div></a>');
	  			$('#EditHomeworkModal').find('.list-files').prepend('<a style="text-decoration: none; color: inherit;" download href="'+res.homeworkFiles[i].Homework_Link+'"><div class="file-container file-loaded file-forms"> <div class="file-icon-label"> <img class="file-icon" src="assets/icons/file.svg" alt="file"/> <span class="file-label">'+res.homeworkFiles[i].Homework_Title+'</span> </div><img class="file-close" onclick="removeFile('+res.homeworkFiles[i].HA_ID+',this);return false" src="assets/icons/close-gray.svg" alt="close"/> </div></a>');
	  		}
	  		$('#EditHomeworkModal').addClass("dom-change-watcher"); 
  		}
  	}
  });
}

function removeFile(id,this_elm) {

	console.log("id",id);
	console.log("this_elm ",this_elm);

	$(this_elm).parents(".file-loaded").find('input').val(null);
	$(this_elm).parents(".file-loaded").remove();

	$(".sub-container-form-footer").addClass("show-footer");
	$(".modal-dom-change-watcher.in .modal-content").css("cssText","height:calc(100% - 72px) !important");

	$domChange=true;
	setTimeout(function(){
		$(".sub-container-form-footer").removeClass("hide-footer");
	});

	removedFiles.push(id);

	return false;

}

$('input[name="filter-classe"]').on( "change", function() {
    var value = $(this).val();

  	if (value.replace(/\s/g, '') !== ''){

  	 $('.filter-subject').find('.row-subject').remove();
	  $.ajax({
		    type: 'get',
		    url: '/Select/subjects',
		    data: {
		    	classe:value,
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.errors){
		  	  console.log(res.errors)
		  	} else {

		  		for (var i = res.subjects.length - 1; i >= 0; i--) {
		  			
		  			$('.filter-subject').append(' <li class="row-subject" data-val="'+res.subjects[i].Subject_Label+'">'+res.subjects[i].Subject_Label+'</li>');
		  		}
				
		  	}
		  	
		  });
  	}

})

$('.homework-filters').on("change", function() {

		var subjectVal = $('.sections-main-sub-container-left-search-bar  input[name="filter-subject"]').attr("data-val");
	  	var classeVal  = $('.sections-main-sub-container-left-search-bar  input[name="filter-classe"]').attr("data-val");
	  	var dynamicListRows = '' ;

	  	var value = $(this).attr("data-val");

		if (value.replace(/\s/g, '') !== ''){

			remove_No_Result_FeedBack();
		  	addSideBarLoadingAnimation($sideSelector);

		  	$('#list_homeworks').find('.homework-row').remove();

		  	console.log("data-val" , subjectVal +" _ "+ classeVal);

		  	if( classeVal == "All" && subjectVal == "All") {

		  		homeworksPrev = homeworks;

		  	}else{

		  		if( classeVal != "All" && subjectVal != "All"){
		  			homeworksPrev = homeworks.filter(h => h.Classe_Label == classeVal && h.Subject_Label == subjectVal );
		  		}else if(classeVal !== "All" ){
		  			homeworksPrev = homeworks.filter(h => h.Classe_Label == classeVal );
		  		}else if(subjectVal !== "All" ){
		  			homeworksPrev = homeworks.filter(h => h.Subject_Label == subjectVal );
		  		}

		  	}
		  	
			var active,name = '';
			for (var i = homeworksPrev.length - 1; i >= 0; i--) {

				name = JSON.parse(homeworksPrev[i].User_Name);

				if (i === homeworksPrev.length - 1)
				{
					displayHomework(homeworksPrev[i].Homework_ID);
					active = 'active';
				}
				else{
					active = '';
				}


				dynamicListRows += '<div data-id="'+homeworksPrev[i].Homework_ID+'" class="sections-main-sub-container-left-card homework-row '+active+'"><input name="homeworkId" type="hidden" value="'+homeworksPrev[i].Homework_ID+'"> <div class="sections-main-sub-container-left-card-main-img-text" data-style="background: '+homeworksPrev[i].Subject_Color+';" >'+homeworksPrev[i].Subject_Label.slice(0,2)+'</div> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+homeworksPrev[i].Homework_Title+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+homeworksPrev[i].Subject_Label+' - '+homeworksPrev[i].Classe_Label+' - '+name.first_name + ' ' + name.last_name+' </span> </div> </div>';

				removeSideBarLoadingAnimation($sideSelector);
			}
		}

		if(homeworksPrev.length > 0 ){
			$($sideSelector).append(dynamicListRows);
		}else{
			$HeaderFeedBack = "No result found!";
			$SubHeaderFeedBack = "";
			$IconFeedBack = "404_students.png";
			no_Result_FeedBack($HeaderFeedBack,$SubHeaderFeedBack,$IconFeedBack);
		}

		removeSideBarLoadingAnimation($sideSelector);

});


$(document).on("click",".sections-main-sub-container-left-card",function(event){
	if (!$("#ChangesModal").hasClass('in'))
	{
		homeworkId = $(this).find('input[name="homeworkId"]').val();
		$('.sections-main-sub-container-left-card').removeClass('active');
		$(this).addClass('active');
		displayHomework(homeworkId);
	}
});

$('.select-classe').on( "change", function() {
  var value = $(this).val();
  if (value.replace(/\s/g, '') !== '')
  {
  	 $('.select-subject').find('.row-subject').remove();
	  $.ajax({
		    type: 'get',
		    url: '/Select/subjects',
		    data: {
		    	classe:value,
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.errors)
		  	{
		  		console.log(res.errors)
		  	} else {

		  		for (var i = res.subjects.length - 1; i >= 0; i--) {
		  			
		  			$('.select-subject').append(' <li class="row-subject" data-val="'+res.subjects[i].Subject_Label+'">'+res.subjects[i].Subject_Label+'</li>')
		  		}
		  	}
		  });
  }
})

 /*.sections-main-sub-container-right-main-header-option-list-span-edit __________________________*/

$(document).on("click",".sections-main-sub-container-right-main-header-option-list-li-homework-edit",function(){
	$('#EditHomeworkModal').modal('show');
});