getAllExams();
var exams = [];
var examId = 0;
var ClasseFilter = [];

let $detailsSelector = "#ExamsDetails";

function getAllExams(id) {

	dynamicListRows = '';

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
	  			examId = res.exams[0].Exam_ID;
	  			if (id)
	  				displayExam(id);
	  			else
	  				displayExam(res.exams[0].Exam_ID);
	  		}
	  		var active = '';
	  		var name = '';

	  		remove_No_Result_FeedBack();
	  		addSideBarLoadingAnimation($sideSelector);

	  		for (var i = 0; i <= res.exams.length - 1; i++) {

	  			if (i === 0){
	  				active = 'active';
	  			}
	  			else{
	  				active = '';
	  			}

	  			name = JSON.parse(res.exams[i].User_Name);

	  			dynamicListRows += '<div class="sections-main-sub-container-left-card exam-row '+active+'"><input name="examId" type="hidden" value="'+res.exams[i].Exam_ID+'"> <div class="sections-main-sub-container-left-card-main-img-text" data-style="background: '+res.exams[i].Subject_Color+';" >'+res.exams[i].Subject_Label.slice(0,2)+'</div> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+res.exams[i].Exam_Title+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+res.exams[i].Subject_Label+' - '+res.exams[i].Classe_Label+' - '+name.first_name + ' ' + name.last_name+' </span> </div> </div>';
	  		}


		  	if(res.exams.length > 0 ){
				$('#list_exams').append(dynamicListRows);
			}else{
				$HeaderFeedBack = "No result found !";
				$SubHeaderFeedBack = "";
				$IconFeedBack = "404_students.png";
				no_Result_FeedBack($HeaderFeedBack,$SubHeaderFeedBack,$IconFeedBack);
			}

			removeSideBarLoadingAnimation($sideSelector);

	  	}
	  });
 }

  function remove() {
	$.ajax({
		    type: 'post',
		    url: '/Exams/remove',
		    data: {
		    	id:examId
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.removed)
		  	{
		  			$('#exam_info').addClass('hidden');
		  			getAllExams();
		  			$('#ConfirmDeleteModal').modal('hide');
		  	} else {
		  		console.log(res);
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

	addLoadingAnimation($detailsSelector,$headerInfo);
	$('#ExamsDetails').removeClass("dom-change-watcher");
	$('#EditExamModal').removeClass("dom-change-watcher");
	$('.row-score').remove();
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
  		console.log(res.errors);
  		removeLoadingAnimation($detailsSelector,$headerInfo);
  	} else {

  		removeLoadingAnimation($detailsSelector,$headerInfo);
  		if (res.exam[0])
  		{
  			var readonly = "";
  			if (res.role === 'Admin')
  				readonly = "readonly";
  			for (var i = res.score.length - 1; i >= 0; i--) {
  				$('.scores-container').append('<tr class="row-score"> <td data-label="Exam Title"> <!-- sections-main-sub-container-left-cards --> <div class="sections-main-sub-container-left-card"> <img class="sections-main-sub-container-left-card-main-img" src="'+res.score[i].Student_Image+'" alt="card-img"> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+res.score[i].Student_FirstName+ ' '+res.score[i].Student_LastName+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+res.score[i].Classe_Label+'</span> </div> </div> <!-- End sections-main-sub-container-left-cards --> </td> <td data-label="Score"> <div class="form-group group dynamic-form-input-text-container-icon"> <input '+readonly+' type="number" data-gradid="'+res.score[i].Grad_ID+'" data-studentid="'+res.score[i].Student_ID+'" name="score" value="'+(res.score[i].Exam_Score === null ? "" : res.score[i].Exam_Score)  +'" class="input-text input-table-edit-field" required="" placeholder="Add score"> </div> </td> </tr>')
  			}
  		$('#exam_info').removeClass('hidden');
  		$('#exam_info').find('.exam_img').css('background-color',res.exam[0].Subject_Color);
  		if (res.average.average)
  			$('#exam_info').find('#avg').html(res.average.average.toFixed(2));
  		else
  			$('#exam_info').find('#avg').html("0.00");
  		$('#exam_info').find('.exam_img').html(res.exam[0].Subject_Label.slice(0,2))
  		$('#exam_info').find('.label-full-name').html(res.exam[0].Exam_Title);
  		$('#exam_info').find('input[name="exam_name"]').val(res.exam[0].Exam_Title);
  		$('#exam_info').find('input[name="exam_date"]').val(res.exam[0].Exam_Date);
  		$('#exam_info').find('#exam_description').val(res.exam[0].Exam_Deatils);
  		$('#EditExamModal').find('input[name="exam_name"]').val(res.exam[0].Exam_Title);
  		$('#EditExamModal').find('input[name="exam_date"]').val(res.exam[0].Exam_Date);
  		$('#EditExamModal').find('#exam_description').val(res.exam[0].Exam_Deatils);
  		var name = JSON.parse(res.exam[0].User_Name);
  		$('#exam_info').find('.sub-label-full-name').html(res.exam[0].Subject_Label+' - '+res.exam[0].Classe_Label+' - '+name.first_name+' '+name.last_name);
  		$('#EditExamModal').addClass("dom-change-watcher");
  		}
  	}
  });
}
$(document).on("click","#list_exams .sections-main-sub-container-left-card",function(event){
	if (!$("#ChangesModal").hasClass('in'))
	{
		examId = $(this).find('input[name="examId"]').val();
		$('.sections-main-sub-container-left-card').removeClass('active');
		$(this).addClass('active');
		displayExam(examId);
	}
});

function saveScores() {
	var valideScore = true;
	var scores = $('input[name^=score]').map(function(idx, elem) {
		if ($(elem).val() >= 0 && $(elem).val() <= 20)
		{
			$(elem).css("background", "none");
	    	return {score:$(elem).val(),student:$(elem).data('studentid'),gradid:$(elem).data('gradid')};
		}
	    else
	    {
	    	$(elem).css("background", "#f6b8c1");
	    	valideScore = false;
	    	return;
	    }
	  }).get();

	if (valideScore)
		 $.ajax({
			    type: 'post',
			    url: '/Exams/score',
			    data: {
			    	scores:scores,
			    	examId
			    },
			    dataType: 'json'
			  })
			  .done(function(res){
			  	console.log("Score",res);
			  	if(res.errors)
	  			{
	  				displayExam(examId);
			  		$('#Scores .sub-container-form-footer').addClass('hide-footer');
					$('#Scores .sub-container-form-footer').removeClass('show-footer');
	  			}
			  	if(res.saved)
			  	{

			  		displayExam(examId);
			  		$('#Scores .sub-container-form-footer').addClass('hide-footer');
					$('#Scores .sub-container-form-footer').removeClass('show-footer');
			  	} else {

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

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

$('.exam-filters').on("change", function() {

		var subjectVal = $('.sections-main-sub-container-left-search-bar  input[name="filter-subject"]').attr("data-val");
	  	var classeVal  = $('.sections-main-sub-container-left-search-bar  input[name="filter-classe"]').attr("data-val");

	  	var dynamicListRows = '' ;

	  	var value = $(this).attr("data-val");

		if (value.replace(/\s/g, '') !== ''){

			remove_No_Result_FeedBack();
		  	addSideBarLoadingAnimation($sideSelector);

		  	if( classeVal == "All" && subjectVal == "All") {

		  		examsPrev = exams;

		  	}else{

		  		if( classeVal != "All" && subjectVal != "All"){
		  			examsPrev = exams.filter(ex => ex.Classe_Label == classeVal && ex.Subject_Label == subjectVal );
		  		}else if(classeVal !== "All" ){
		  			examsPrev = exams.filter(ex => ex.Classe_Label == classeVal );
		  		}else if(subjectVal !== "All" ){
		  			examsPrev = exams.filter(ex => ex.Subject_Label == subjectVal );
		  		}

		  	}
		  	
			var active,name = '';

			for (var i = examsPrev.length - 1; i >= 0; i--) {

				name = JSON.parse(examsPrev[i].User_Name);

				if (i === examsPrev.length - 1)
				{
					displayExam(examsPrev[i].Exam_ID);
					active = 'active';
				}
				else{
					active = '';
				}


				dynamicListRows += '<div data-id="'+examsPrev[i].Exam_ID+'" class="sections-main-sub-container-left-card homework-row '+active+'"><input name="homeworkId" type="hidden" value="'+examsPrev[i].Exam_ID+'"> <div class="sections-main-sub-container-left-card-main-img-text" data-style="background: '+examsPrev[i].Subject_Color+';" >'+examsPrev[i].Subject_Label.slice(0,2)+'</div> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+examsPrev[i].Exam_Title+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+examsPrev[i].Subject_Label+' - '+examsPrev[i].Classe_Label+' - '+name.first_name + ' ' + name.last_name+' </span> </div> </div>';

				removeSideBarLoadingAnimation($sideSelector);
			}
		}

		if(examsPrev.length > 0 ){
			$($sideSelector).append(dynamicListRows);
		}else{
			$HeaderFeedBack = "No result found !";
			$SubHeaderFeedBack = "";
			$IconFeedBack = "404_students.png";
			no_Result_FeedBack($HeaderFeedBack,$SubHeaderFeedBack,$IconFeedBack);
		}

		removeSideBarLoadingAnimation($sideSelector);

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

 function saveChange($this_elm) {

 	var exam_name = $('#EditExamModal').find('input[name="exam_name"]').val();
 	var exam_date = $('#EditExamModal').find('input[name="exam_date"]').val();
 	var exam_description =  $('#EditExamModal').find('#exam_description').val();

	if (!exam_name){
		$('#EditExamModal').find('.exam_name').css("border-color", "#f6b8c1");
	}
	else{
		$('#EditExamModal').find('.exam_name').css("border-color", "#EFEFEF");
	}

	if (!exam_date){
		$('#EditExamModal').find('.exam_date').css("border-color", "#f6b8c1");
	}
	else{
		$('#EditExamModal').find('.exam_date').css("border-color", "#EFEFEF");
	}

	if (!exam_description){
		$('#EditExamModal').find('#exam_description').css("border-color", "#f6b8c1");
	}
	else{
		$('#EditExamModal').find('#exam_description').css("border-color", "#EFEFEF");
	}

	if (exam_name && exam_description && exam_date ){

		action_Btn_loading($this_elm);

		$.ajax({
		    type: 'post',
		    url: '/Exams/update',
		    data: {
		    	id:examId,
		    	exam_name:$('#EditExamModal').find('input[name="exam_name"]').val(),
	  			exam_date:$('#EditExamModal').find('input[name="exam_date"]').val(),
	  			exam_description:$('#EditExamModal').find('#exam_description').val(),
		    },
		    dataType: 'json'
		  })
		  .done(function(res){
		  	if(res.updated)
		  	{
	  			getAllExams(examId);
	  			remove_action_Btn_loading($this_elm);
	  			$('#EditExamModal').modal('hide');
	  			$('#EditExamModal .sub-container-form-footer').addClass('hide-footer');
	 			$('#EditExamModal .sub-container-form-footer').removeClass('show-footer');
		  	} else {
		  		console.log(res);
		  	}
		  });
	 	
	}

 }

 function discardChange() {
 	$('#EditExamModal .sub-container-form-footer').addClass('hide-footer');
 	$('#EditExamModal .sub-container-form-footer').removeClass('show-footer');
 	$('#EditExamModal').modal('hide');
 	displayExam(examId);
 } 

 function discardScore() {
 	$('#Scores .sub-container-form-footer').addClass('hide-footer');
 	$('#Scores .sub-container-form-footer').removeClass('show-footer');
 	displayExam(examId);
 }

/*.sections-main-sub-container-right-main-header-option-list-span-edit __________________________*/

$(document).on("click",".sections-main-sub-container-right-main-header-option-list-li-exam-edit",function(){
	$('#EditExamModal').modal('show');
});