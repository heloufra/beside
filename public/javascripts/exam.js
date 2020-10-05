getAllExams();
function getAllExams() {
 	$('.exam-row').remove();
	$.ajax({
	    type: 'get',
	    url: '/Exams/all',
	    dataType: 'json'
	  })
	  .done(function(res){
	  	if(res.errors)
	  	{
	  		console.log(res.errors)
	  	} else {
	  		var exams = res.Exams;

	  		/*if (res.Exams.length > 0)
	  		{
	  			displayStudent(res.Exams[res.Exams.length - 1].Student_ID);
	  		}*/
	  		var active = '';
	  		for (var i = res.exams.length - 1; i >= 0; i--) {
	  			if (i === res.exams.length - 1)
	  				active = 'active';
	  			else
	  				active = '';
	  			$('#list_exams').append('<div class="sections-main-sub-container-left-card exam-row'+active+'"> <div class="sections-main-sub-container-left-card-main-img-text" style="background: '+res.exams[i].Subject_Color+';" >'+res.exams[i].Subject_Label.slice(0,2)+'</div> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+res.exams[i].Exam_Title+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+res.exams[i].Subject_Label+' - '+res.exams[i].Classe_Label+' - Teacher Name </span> </div> </div>')
	  		}
	  	}
	  });
 }
function saveExam() {
	var exam_classe = $('#AddExamModal').find('input[name="exam_classe"]').val();
	var exam_date = $('#AddExamModal').find('input[name="exam_date"]').val();

	var exam_subject = $('#AddExamModal').find('input[name="exam_subject"]').val();
	var exam_name = $('#AddExamModal').find('input[name="exam_name"]').val();
	var exam_description = $('#AddExamModal').find('#exam_description').val();
	var at_type = "";


	console.log(exam_classe,exam_subject,exam_date,exam_description,exam_name);

	if (!exam_date)
		$('#AddExamModal').find('.exam_date').css("border-color", "#f6b8c1");
	else
		$('#AddExamModal').find('.exam_date').css("border-color", "#EFEFEF");
	if (!exam_classe)
		$('#AddExamModal').find('.exam_classe').css("border-color", "#f6b8c1");
	else
		$('#AddExamModal').find('.exam_classe').css("border-color", "#EFEFEF");
	if (!exam_name)
		$('#AddExamModal').find('.exam_name').css("border-color", "#f6b8c1");
	else
		$('#AddExamModal').find('.exam_name').css("border-color", "#EFEFEF");

	if (!exam_subject)
		$('#AddExamModal').find('.exam_subject').css("border-color", "#f6b8c1");
	else
		$('#AddExamModal').find('.exam_subject').css("border-color", "#EFEFEF");
	if (!exam_description)
		$('#AddExamModal').find('#exam_description').css("border-color", "#f6b8c1");
	else
		$('#AddExamModal').find('#exam_description').css("border-color", "#EFEFEF");

	if (exam_name && exam_description && exam_date && exam_subject && exam_classe)
	{
		$.ajax({
		    type: 'post',
		    url: '/Exams/save',
		    data: {
		    	exam_name,
		    	exam_date,
		    	exam_description,
		    	exam_classe,
		    	exam_subject
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.saved)
		  	{
		  		$('#AddExamModal').modal('hide');
				console.log('Saved');
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