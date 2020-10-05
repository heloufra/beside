getAllExams();
var exams = [];
var examId = 0;
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
	  		exams = res.exams;

	  		if (res.exams.length > 0)
	  		{
	  			displayExam(res.exams[res.exams.length - 1].Exam_ID);
	  		}
	  		var active = '';
	  		for (var i = res.exams.length - 1; i >= 0; i--) {
	  			if (i === res.exams.length - 1)
	  				active = 'active';
	  			else
	  				active = '';
	  			$('#list_exams').append('<div class="sections-main-sub-container-left-card exam-row '+active+'"><input name="examId" type="hidden" value="'+res.exams[i].Exam_ID+'"> <div class="sections-main-sub-container-left-card-main-img-text" style="background: '+res.exams[i].Subject_Color+';" >'+res.exams[i].Subject_Label.slice(0,2)+'</div> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+res.exams[i].Exam_Title+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+res.exams[i].Subject_Label+' - '+res.exams[i].Classe_Label+' - Teacher Name </span> </div> </div>')
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
		  		getAllExams();
				$('#AddExamModal').find('input[name="exam_classe"]').val("");
				$('#AddExamModal').find('input[name="exam_date"]').val("");
				$('#AddExamModal').find('input[name="exam_subject"]').val("");
				$('#AddExamModal').find('input[name="exam_name"]').val("");
				$('#AddExamModal').find('#exam_description').val("");
		  		$('#AddExamModal').modal('hide');
				console.log('Saved');
		  	} else {
		  		console.log("not saved");
		  	}
		  });
	}
}

function displayExam(index) 
{
	$('#ExamsDetails').removeClass("dom-change-watcher");
	$.ajax({
    type: 'get',
    url: '/Exams/one',
    data: {
    	exam_id:index
    },
    dataType: 'json'
  })
  .done(function(res){
  	if(res.errors)
  	{
  		console.log(res.errors)
  	} else {
  		if (res.exam[0])
  		{
  		$('#exam_info').removeClass('hidden');
  		$('#exam_info').find('.exam_img').css('background-color',res.exam[0].Subject_Color);
  		$('#exam_info').find('.exam_img').html(res.exam[0].Subject_Label.slice(0,2))
  		$('#exam_info').find('.label-full-name').html(res.exam[0].Exam_Title);
  		$('#exam_info').find('input[name="exam_name"]').val(res.exam[0].Exam_Title);
  		$('#exam_info').find('input[name="exam_date"]').val(res.exam[0].Exam_DeliveryDate);
  		$('#exam_info').find('#exam_description').val(res.exam[0].Exam_Deatils);
  		$('#exam_info').find('.sub-label-full-name').html(res.exam[0].Subject_Label+' - '+res.exam[0].Classe_Label+' - Teacher Name');
  		$('#ExamsDetails').addClass("dom-change-watcher");
  		}
  	}
  });
}
$(document).on("click",".sections-main-sub-container-left-card",function(event){
	examId = $(this).find('input[name="examId"]').val();
	$('.sections-main-sub-container-left-card').removeClass('active');
	$(this).addClass('active');
	displayExam(examId);
});
$('input[name="filter-classe"]').on( "change", function() {
  var value = $(this).val();
  if (value.replace(/\s/g, '') !== '')
  {
  	 $('.filter-subject').find('.row-subject').remove();
  	 $('#list_exams').find('.exam-row').remove();
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
		  var filtred = exams.filter(function (el) {
			  return el.Classe_Label === value ;
			});

		  var active = '';
	  		for (var i = filtred.length - 1; i >= 0; i--) {
	  			if (i === filtred.length - 1)
	  			{
	  				displayExam(filtred[i].Exam_ID);
	  				active = 'active';
	  			}
	  			else
	  				active = '';
	  			$('#list_exams').append('<div class="sections-main-sub-container-left-card exam-row '+active+'"><input name="examId" type="hidden" value="'+filtred[i].Exam_ID+'"> <div class="sections-main-sub-container-left-card-main-img-text" style="background: '+filtred[i].Subject_Color+';" >'+filtred[i].Subject_Label.slice(0,2)+'</div> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+filtred[i].Exam_Title+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+filtred[i].Subject_Label+' - '+filtred[i].Classe_Label+' - Teacher Name </span> </div> </div>')
	  		}
  }
})

$('input[name="filter-subject"]').on( "change", function() {
  var value = $(this).val();
  if (value.replace(/\s/g, '') !== '')
  {
  	$('#list_exams').find('.exam-row').remove();
  	  var filtred = exams.filter(function (el) {
			  return el.Subject_Label === value ;
			});

		  var active = '';
  		for (var i = filtred.length - 1; i >= 0; i--) {
  			if (i === filtred.length - 1)
  			{
  				displayExam(filtred[i].Exam_ID);
  				active = 'active';
  			}
  			else
  				active = '';
  			$('#list_exams').append('<div class="sections-main-sub-container-left-card exam-row '+active+'"><input name="examId" type="hidden" value="'+filtred[i].Exam_ID+'"> <div class="sections-main-sub-container-left-card-main-img-text" style="background: '+filtred[i].Subject_Color+';" >'+filtred[i].Subject_Label.slice(0,2)+'</div> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+filtred[i].Exam_Title+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+filtred[i].Subject_Label+' - '+filtred[i].Classe_Label+' - Teacher Name </span> </div> </div>')
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