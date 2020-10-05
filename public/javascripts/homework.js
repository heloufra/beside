getAllHomeworks();
var homeworks = [];
var homeworkId = 0;
function getAllHomeworks() {
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
	  			displayHomework(res.homeworks[res.homeworks.length - 1].Homework_ID);
	  		}
	  		var active = '';
	  		for (var i = res.homeworks.length - 1; i >= 0; i--) {
	  			if (i === res.homeworks.length - 1)
	  				active = 'active';
	  			else
	  				active = '';
	  			$('#list_homeworks').append('<div class="sections-main-sub-container-left-card homework-row '+active+'"><input name="homeworkId" type="hidden" value="'+res.homeworks[i].Homework_ID+'"> <div class="sections-main-sub-container-left-card-main-img-text" style="background: '+res.homeworks[i].Subject_Color+';" >'+res.homeworks[i].Subject_Label.slice(0,2)+'</div> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+res.homeworks[i].Homework_Title+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+res.homeworks[i].Subject_Label+' - '+res.homeworks[i].Classe_Label+' - Teacher Name </span> </div> </div>')
	  		}
	  	}
	  });
 }

function saveHomework() {
	var homework_classe = $('#AddHomeworkModal').find('input[name="homework_classe"]').val();
	var homework_deliverydate = $('#AddHomeworkModal').find('input[name="homework_deliverydate"]').val();

	var homework_subject = $('#AddHomeworkModal').find('input[name="homework_subject"]').val();
	var homework_name = $('#AddHomeworkModal').find('input[name="homework_name"]').val();
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
		$.ajax({
		    type: 'post',
		    url: '/Homeworks/save',
		    data: {
		    	homework_name,
		    	homework_deliverydate,
		    	homework_description,
		    	homework_classe,
		    	homework_subject
		    },
		    dataType: 'json'
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
  		if (res.homework[0])
  		{
  			console.log(res.homework)
  		$('#homework_info').removeClass('hidden');
  		$('#homework_info').find('.homework_img').css('background-color',res.homework[0].Subject_Color);
  		$('#homework_info').find('.homework_img').html(res.homework[0].Subject_Label.slice(0,2))
  		$('#homework_info').find('.label-full-name').html(res.homework[0].Homework_Title);
  		$('#homework_info').find('input[name="homework_name"]').val(res.homework[0].Homework_Title);
  		$('#homework_info').find('input[name="homework_date"]').val(res.homework[0].Homework_DeliveryDate);
  		$('#homework_info').find('#homework_description').val(res.homework[0].Homework_Deatils);
  		$('#homework_info').find('.sub-label-full-name').html(res.homework[0].Subject_Label+' - '+res.homework[0].Classe_Label+' - Teacher Name');
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
  	 $('#list_homeworks').find('.homework-row').remove();
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

		  var filtred = homeworks.filter(function (el) {
			  return el.Classe_Label === value ;
			});
		  console.log("Filtred::",filtred);
		  var active = '';
	  		for (var i = filtred.length - 1; i >= 0; i--) {
	  			if (i === filtred.length - 1)
	  			{
	  				displayHomework(filtred[i].Homework_ID);
	  				active = 'active';
	  			}
	  			else
	  				active = '';
	  			$('#list_homeworks').append('<div class="sections-main-sub-container-left-card homework-row '+active+'"><input name="homeworkId" type="hidden" value="'+filtred[i].Homework_ID+'"> <div class="sections-main-sub-container-left-card-main-img-text" style="background: '+filtred[i].Subject_Color+';" >'+filtred[i].Subject_Label.slice(0,2)+'</div> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+filtred[i].Homework_Title+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+filtred[i].Subject_Label+' - '+filtred[i].Classe_Label+' - Teacher Name </span> </div> </div>')
	  		}
  }
})


$(document).on("click",".sections-main-sub-container-left-card",function(event){
	homeworkId = $(this).find('input[name="homeworkId"]').val();
	$('.sections-main-sub-container-left-card').removeClass('active');
	$(this).addClass('active');
	displayHomework(homeworkId);
});

$('input[name="filter-subject"]').on( "change", function() {
  var value = $(this).val();
  if (value.replace(/\s/g, '') !== '')
  {
  	$('#list_homeworks').find('.homework-row').remove();
  	  var filtred = homeworks.filter(function (el) {
			  return el.Subject_Label === value ;
			});
		  console.log("Filtred::",filtred);
		  var active = '';
	  		for (var i = filtred.length - 1; i >= 0; i--) {
	  			if (i === filtred.length - 1)
	  			{
	  				displayHomework(filtred[i].Homework_ID);
	  				active = 'active';
	  			}
	  			else
	  				active = '';
	  			$('#list_homeworks').append('<div class="sections-main-sub-container-left-card homework-row '+active+'"><input name="homeworkId" type="hidden" value="'+filtred[i].Homework_ID+'"> <div class="sections-main-sub-container-left-card-main-img-text" style="background: '+filtred[i].Subject_Color+';" >'+filtred[i].Subject_Label.slice(0,2)+'</div> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+filtred[i].Homework_Title+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+filtred[i].Subject_Label+' - '+filtred[i].Classe_Label+' - Teacher Name </span> </div> </div>')
	  		}
  }
})

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