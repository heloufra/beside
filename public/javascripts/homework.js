getAllHomeworks();
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
	  		var homeworks = res.homeworks;

	  		/*if (res.Homeworks.length > 0)
	  		{
	  			displayStudent(res.Homeworks[res.Homeworks.length - 1].Student_ID);
	  		}*/
	  		var active = '';
	  		for (var i = res.homeworks.length - 1; i >= 0; i--) {
	  			if (i === res.homeworks.length - 1)
	  				active = 'active';
	  			else
	  				active = '';
	  			$('#list_homeworks').append('<div class="sections-main-sub-container-left-card homework-row'+active+'"> <div class="sections-main-sub-container-left-card-main-img-text" style="background: '+res.homeworks[i].Subject_Color+';" >'+res.homeworks[i].Subject_Label.slice(0,2)+'</div> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+res.homeworks[i].Homework_Title+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+res.homeworks[i].Subject_Label+' - '+res.homeworks[i].Classe_Label+' - Teacher Name </span> </div> </div>')
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
		  		$('#AddHomeworkModal').modal('hide');
				console.log('Saved');
				getAllHomeworks();
		  	} else {
		  		console.log("not saved");
		  	}
		  });
	}
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