getAllHomeworks();
var homeworks = [];
var homeworkId = 0;
var ClasseFilter = [];
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

	  		if (res.homeworks.length > 0)
	  		{
	  			homeworkId = res.homeworks[0].Homework_ID;
	  			if (id)
	  				displayHomework(id);
	  			else
	  				displayHomework(res.homeworks[0].Homework_ID);
	  		}
	  		var active = '';
	  		var name = '';
	  		for (var i = 0; i <= res.homeworks.length - 1; i++) {
	  			if (i === 0)
	  				active = 'active';
	  			else
	  				active = '';
	  			name = JSON.parse(res.homeworks[i].User_Name);
	  			$('#list_homeworks').append('<div data-id="'+res.homeworks[i].Homework_ID+'" class="sections-main-sub-container-left-card homework-row '+active+'"><input name="homeworkId" type="hidden" value="'+res.homeworks[i].Homework_ID+'"> <div class="sections-main-sub-container-left-card-main-img-text" style="background: '+res.homeworks[i].Subject_Color+';" >'+res.homeworks[i].Subject_Label.slice(0,2)+'</div> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+res.homeworks[i].Homework_Title+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+res.homeworks[i].Subject_Label+' - '+res.homeworks[i].Classe_Label+' - '+name.first_name+' '+ name.last_name+' </span> </div> </div>')
	  		}
	  	}
	  });
 }

var fileData = null;

function loadFile() {
    var file    = document.getElementByID('uploaded_file').files[0];
    var reader  = new FileReader();

    reader.onloadend = function () {
        fileData = file;
    }
    if (file) {
        reader.readAsDataURL(file);
    }
}

if (document.getElementById("uploaded_file"))
	document.getElementById("uploaded_file").addEventListener("change", loadFile);
function saveHomework() {
	var homework_classe = $('#AddHomeworkModal').find('input[name="homework_classe"]').val();
	var homework_deliverydate = $('#AddHomeworkModal').find('input[name="homework_deliverydate"]').val();

	var homework_subject = $('#AddHomeworkModal').find('input[name="homework_subject"]').val();
	var homework_name = $('#AddHomeworkModal').find('input[name="homework_name"]').val();
	var uploaded_file = $('#AddHomeworkModal').find('input[name="uploaded_file"]').prop('files')[0];
	var homework_description = $('#AddHomeworkModal').find('#homework_description').val();
	var at_type = "";


	console.log(homework_classe,homework_subject,homework_deliverydate,homework_description,homework_name);

	if (!homework_deliverydate)
		$('#AddHomeworkModal').find('.homework_deliverydate').css("border-color", "#f6b8c1");
	else
		$('#AddHomeworkModal').find('.homework_deliverydate').css("border-color", "#EFEFEF");
	if (!homework_classe)
		$('#AddHomeworkModal').find('.homework_classe').css("border-color", "#f6b8c1");
	else
		$('#AddHomeworkModal').find('.homework_classe').css("border-color", "#EFEFEF");
	if (!homework_name)
		$('#AddHomeworkModal').find('.homework_name').css("border-color", "#f6b8c1");
	else
		$('#AddHomeworkModal').find('.homework_name').css("border-color", "#EFEFEF");

	if (!homework_subject)
		$('#AddHomeworkModal').find('.homework_subject').css("border-color", "#f6b8c1");
	else
		$('#AddHomeworkModal').find('.homework_subject').css("border-color", "#EFEFEF");
	if (!homework_description)
		$('#AddHomeworkModal').find('#homework_description').css("border-color", "#f6b8c1");
	else
		$('#AddHomeworkModal').find('#homework_description').css("border-color", "#EFEFEF");

	if (homework_name && homework_description && homework_deliverydate && homework_subject && homework_classe)
	{
		var formData = new FormData();
        formData.append('homework_name', homework_name);
        formData.append('homework_deliverydate', homework_deliverydate);
        formData.append('homework_description', homework_description);
        formData.append('homework_classe', homework_classe);
        formData.append('homework_subject', homework_subject);
        formData.append('file', uploaded_file);
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
				$('#AddHomeworkModal').find('input[name="homework_classe"]').val("");
				$('#AddHomeworkModal').find('input[name="homework_deliverydate"]').val("");
				$('#AddHomeworkModal').find('input[name="homework_subject"]').val("");
				$('#AddHomeworkModal').find('input[name="homework_name"]').val("");
				$('#AddHomeworkModal').find('#homework_description').val("");
		  		$('#AddHomeworkModal').modal('hide');
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
 	var formData = new FormData();
 	formData.append('id', homeworkId);
    formData.append('homework_name', $('#homework_info').find('input[name="homework_name"]').val());
    formData.append('homework_date', $('#homework_info').find('input[name="homework_date"]').val());
    formData.append('homework_description', $('#homework_info').find('#homework_description').val());
    formData.append('file', $('#homework_info').find('input[name="uploaded_file"]').prop('files')[0]);
	$.ajax({
	    type: 'post',
	    url: '/Homeworks/update',
	    data: formData,
	    processData: false,
        contentType: false

	  })
	  .done(function(res){
	  	if(res.updated)
	  	{
	  			getAllHomeworks(homeworkId);
	  			$('#ChangesModal').modal('hide');
	  			console.log($('#ChangesModal').data('id'));
	  	} else {
	  		console.log(res);
	  	}
	  });
 	$('#homework_info .sub-container-form-footer').addClass('hide-footer');
 	$('#homework_info .sub-container-form-footer').removeClass('show-footer');
 }
 function discardChange() {
 	$('#homework_info .sub-container-form-footer').addClass('hide-footer');
 	$('#homework_info .sub-container-form-footer').removeClass('show-footer');
 	$('#ChangesModal').modal('hide');
 	displayHomework(homeworkId);
 }

function displayHomework(index)
{
	$('#HomeworkDetails').removeClass("dom-change-watcher");
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
  	} else {
  		console.log(res.homeworkFiles)
  		if (res.homework[0])
  		{
  			var name = JSON.parse(res.homework[0].User_Name);
  		$('#homework_info').removeClass('hidden');
  		$('#homework_info').find('.file-forms').remove();
  		$('#homework_info').find('.homework_img').css('background-color',res.homework[0].Subject_Color);
  		$('#homework_info').find('.homework_img').html(res.homework[0].Subject_Label.slice(0,2))
  		$('#homework_info').find('.label-full-name').html(res.homework[0].Homework_Title);
  		$('#homework_info').find('input[name="homework_name"]').val(res.homework[0].Homework_Title);
  		$('#homework_info').find('input[name="homework_date"]').val(res.homework[0].Homework_DeliveryDate);
  		$('#homework_info').find('#homework_description').val(res.homework[0].Homework_Deatils);
  		$('#homework_info').find('.sub-label-full-name').html(res.homework[0].Subject_Label+' - '+res.homework[0].Classe_Label+' - '+name.first_name+' '+ name.last_name);
  		for (var i = res.homeworkFiles.length - 1; i >= 0; i--) {
  			$('#homework_info').find('.list-files').prepend('<div class="file-container file-loaded file-forms"><a style="text-decoration: none; color: inherit;" download href="'+res.homeworkFiles[i].Homework_Link+'"> <div class="file-icon-label"> <img class="file-icon" src="assets/icons/file.svg" alt="file"/> <span class="file-label">'+res.homeworkFiles[i].Homework_Title+'-'+(i + 1)+'</span> </div></a> <img class="file-close" src="assets/icons/close-gray.svg" alt="close"/> </div>');
  		}
  		$('#HomeworkDetails').addClass("dom-change-watcher");
  		}
  	}
  });
}
$('input[name="filter-classe"]').on( "change", function() {
  var value = $(this).val();
  if (value.replace(/\s/g, '') !== '')
  {
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
		  	if(res.errors)
		  	{
		  		console.log(res.errors)
		  	} else {

		  		for (var i = res.subjects.length - 1; i >= 0; i--) {
		  			
		  			$('.filter-subject').append(' <li class="row-subject" data-val="'+res.subjects[i].Subject_Label+'">'+res.subjects[i].Subject_Label+'</li>')
		  		}
		  	}
		  });
  }
})

$('.homework-filters').on( "change", function() {
	var subjectVal = $('input[name="filter-subject"]').val();
  	var classeVal = $('input[name="filter-classe"]').val();
	var filtred,filtredClass = [];
  var value = $(this).val();
  if (value.replace(/\s/g, '') !== '')
  {
  	$('#list_homeworks').find('.homework-row').remove();
	filtredClass = homeworks.filter(function (el) {
			  return el.Classe_Label === classeVal ;
			});
	if (classeVal === "All" || classeVal.replace(/\s/g, '') === 'Classes' )
		filtredClass = homeworks;
	filtred = filtredClass.filter(function (el) {
			  return el.Subject_Label === subjectVal ;
			});
	if (subjectVal === "All" || subjectVal.replace(/\s/g, '') === 'Subject')
		filtred = filtredClass;
	var active,name = '';
	for (var i = filtred.length - 1; i >= 0; i--) {
		name = JSON.parse(filtred[i].User_Name);
		if (i === filtred.length - 1)
		{
			displayHomework(filtred[i].Homework_ID);
			active = 'active';
		}
		else
			active = '';
		$('#list_homeworks').append('<div data-id="'+filtred[i].Homework_ID+'" class="sections-main-sub-container-left-card homework-row '+active+'"><input name="homeworkId" type="hidden" value="'+filtred[i].Homework_ID+'"> <div class="sections-main-sub-container-left-card-main-img-text" style="background: '+filtred[i].Subject_Color+';" >'+filtred[i].Subject_Label.slice(0,2)+'</div> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+filtred[i].Homework_Title+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+filtred[i].Subject_Label+' - '+filtred[i].Classe_Label+' - '+name.first_name + ' ' + name.last_name+' </span> </div> </div>')
	}
  }
})


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