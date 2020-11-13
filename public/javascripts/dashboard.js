var absencesT,absencesS = [];
var absenceArray = ["Retard","Absence"];
var today = new Date();
var currentDate = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();

getAbsences();
function getAbsences() {
	$.ajax({
	    type: 'get',
	    url: '/Dashboard/absences',
	    dataType: 'json'
	  })
	  .done(function(res){
	  	if(res.errors)
	  	{
	  		console.log(res.errors)
	  	} else {
	  		absencesT= res.absencesT;
            absencesS = res.absencesS;
            var filtredT = absencesT.filter(absence =>{ 
	 		var addDate = new Date(absence.teacher.AD_Addeddate);
		 		if (absence.teacher.AD_Date !== 'null')
		 			return (absence.teacher.AD_Date === currentDate) || addDate.toDateString() === today.toDateString();
		 		else
		 		{
		 			var fromTo = JSON.parse(absence.teacher.AD_FromTo);
		 			return ((fromTo.from.split('/')[0] <= currentDate.split('/')[0] && fromTo.from.split('/')[1] <= currentDate.split('/')[1]) && (fromTo.to.split('/')[0] >= currentDate.split('/')[0] && fromTo.to.split('/')[1] >= currentDate.split('/')[1])) || addDate.toDateString() === today.toDateString();
		 		}
		 	})
		 	var filtredS = absencesS.filter(absence =>{ 
		 		var addDate = new Date(absence.student.AD_Addeddate);
		 		if (absence.student.AD_Date !== 'null')
		 			return absence.student.AD_Date === currentDate || addDate.toDateString() === today.toDateString();
		 		else
		 		{
		 			var fromTo = JSON.parse(absence.student.AD_FromTo);
		 			return ((fromTo.from.split('/')[0] <= currentDate.split('/')[0] && fromTo.from.split('/')[1] <= currentDate.split('/')[1]) && (fromTo.to.split('/')[0] >= currentDate.split('/')[0] && fromTo.to.split('/')[1] >= currentDate.split('/')[1])) || addDate.toDateString() === today.toDateString();
		 		}
		 	})
          	displayTAbsences(filtredT);
          	displaySAbsences(filtredS);
	  	}
	  });
}

function displayTAbsences(Tabsences) 
{
	  var userNAme,reportedBy,htmlClasse;
	  		for (var i = 0; i <= Tabsences.length - 1; i++) {
	  			userNAme = Tabsences[i].teacher.User_Name;
                try {
                    userNAme = JSON.parse(Tabsences[i].teacher.User_Name);
                    if (userNAme.first_name)
                      userNAme = userNAme.first_name + " " + userNAme.last_name;
                    else
                      userNAme = Tabsences[i].teacher.User_Name;
                } catch (e) {
                    userNAme = Tabsences[i].teacher.User_Name;
                }
                reportedBy = Tabsences[i].reportedBy.User_Name;
                try {
                    reportedBy = JSON.parse(Tabsences[i].reportedBy.User_Name);
                    if (reportedBy.first_name)
                      reportedBy = reportedBy.first_name + " " + reportedBy.last_name;
                    else
                      reportedBy = Tabsences[i].reportedBy.User_Name;
                } catch (e) {
                    reportedBy = Tabsences[i].reportedBy.User_Name;
                }
                htmlClasse = "";
                for (var j =  Tabsences[i].classes.length - 1; j >= 0; j--) {
                	htmlClasse +=  Tabsences[i].classes[j].Classe_Label + ' ';
                }
                var fromTo = JSON.parse(Tabsences[i].teacher.AD_FromTo)
		        var type;
		        if(Tabsences[i].teacher.AD_Type === 2)
		          type = 'Absence';
		        else
		          type = absenceArray[Tabsences[i].teacher.AD_Type];
	  			$('#absence-list').append(' <tr class="row-teacher"> <td data-label="Persons"> <!-- sections-main-sub-container-left-cards --> <div class="sections-main-sub-container-left-card"> <img class="sections-main-sub-container-left-card-main-img" src="'+Tabsences[i].teacher.User_Image+'" alt="card-img"> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info"> '+userNAme+' </p> <span class="sections-main-sub-container-left-card-sub-info">'+htmlClasse +'</span> </div> </div> <!-- End sections-main-sub-container-left-cards --> </td> <td class="readonly" data-label="Type"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+type+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> </td> <td class="readonly" data-label="From"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+fromTo.from+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> </td> <td class="readonly" data-label="To"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+fromTo.to+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> </td> <td class="readonly" data-label="Reported by"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+reportedBy+'" class="input-text" required="" placeholder="Reported by"> </div> </td> </tr>')
	  		}
}

function displaySAbsences(Sabsences) 
{
	var reportedBy;
	for (var i = 0; i <= Sabsences.length - 1; i++) {
	
    reportedBy = Sabsences[i].reportedBy.User_Name;
    try {
        reportedBy = JSON.parse(Sabsences[i].reportedBy.User_Name);
        if (reportedBy.first_name)
          reportedBy = reportedBy.first_name + " " + reportedBy.last_name;
        else
          reportedBy = Sabsences[i].reportedBy.User_Name;
    } catch (e) {
        reportedBy = Sabsences[i].reportedBy.User_Name;
    }
    var fromTo = JSON.parse(Sabsences[i].student.AD_FromTo)
    var type;
    if(Sabsences[i].student.AD_Type === 2)
      type = 'Absence';
    else
      type = absenceArray[Sabsences[i].student.AD_Type];
		$('#absence-list').append(' <tr class="row-student"> <td data-label="Persons"> <!-- sections-main-sub-container-left-cards --> <div class="sections-main-sub-container-left-card"> <img class="sections-main-sub-container-left-card-main-img" src="'+Sabsences[i].student.Student_Image+'" alt="card-img"> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info"> '+Sabsences[i].student.Student_FirstName+ ' '+ Sabsences[i].student.Student_LastName+' </p> <span class="sections-main-sub-container-left-card-sub-info">'+Sabsences[i].student.Classe_Label +'</span> </div> </div> <!-- End sections-main-sub-container-left-cards --> </td> <td class="readonly" data-label="Type"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+type+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> </td> <td class="readonly" data-label="From"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+fromTo.from+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> </td> <td class="readonly" data-label="To"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+fromTo.to+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> </td> <td class="readonly" data-label="Reported by"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+reportedBy+'" class="input-text" required="" placeholder="Reported by"> </div> </td> </tr>')
	}
}

$('.filter-absence').change(function () {
	var filtredT = absencesT,filtredS = absencesS;
	$('#absence-list').find('.row-student').remove();
	$('#absence-list').find('.row-teacher').remove();
	 if ($('input[name="filter-absence"]').val().replace(/\s/g, '') !== '')
	 {
		filtredT = absencesT.filter(absence =>{ 
	 		var addDate = new Date(absence.teacher.AD_Addeddate);
	 		if (absence.teacher.AD_Date !== 'null')
	 			return (parseInt(absence.teacher.AD_Date.split('/')[2]) === today.getFullYear() ) || addDate.getFullYear()() === today.getFullYear()();
	 		else
	 		{
	 			var fromTo = JSON.parse(absence.teacher.AD_FromTo);
	 			return (parseInt(fromTo.from.split('/')[2]) >= today.getFullYear() && parseInt(fromTo.to.split('/')[2]) <= today.getFullYear()) || addDate.getFullYear() === today.getFullYear();
	 		}
		 	})
	 	filtredS = absencesS.filter(absence =>{ 
	 		var addDate = new Date(absence.student.AD_Addeddate);
	 		if (absence.student.AD_Date !== 'null')
	 			return (parseInt(absence.student.AD_Date.split('/')[2]) ===  today.getFullYear()) || addDate.getFullYear() === today.getFullYear();
	 		else
	 		{
	 			var fromTo = JSON.parse(absence.student.AD_FromTo);
	 			return (parseInt(fromTo.from.split('/')[2]) >=  today.getFullYear() && parseInt(fromTo.to.split('/')[2]) <=  today.getFullYear()) || addDate.getFullYear() === today.getFullYear();
	 		}
	 	})

		if ($('input[name="filter-absence"]').val() === 'This Month')
		{
			filtredT = filtredT.filter(absence =>{ 
	 		var addDate = new Date(absence.teacher.AD_Addeddate);
	 		if (absence.teacher.AD_Date !== 'null')
	 			return (parseInt(absence.teacher.AD_Date.split('/')[1]) === (today.getMonth() + 1)) || addDate.getMonth() === today.getMonth();
	 		else
	 		{
	 			var fromTo = JSON.parse(absence.teacher.AD_FromTo);
	 			return (parseInt(fromTo.from.split('/')[1]) <= (today.getMonth() + 1) && parseInt(fromTo.to.split('/')[1]) >= (today.getMonth() + 1)) || addDate.getMonth() === today.getMonth();
	 		}
		 	})
		 	filtredS = filtredS.filter(absence =>{ 
		 		var addDate = new Date(absence.student.AD_Addeddate);
		 		if (absence.student.AD_Date !== 'null')
		 			return (parseInt(absence.student.AD_Date.split('/')[1]) === (today.getMonth() + 1)) || addDate.getMonth() === today.getMonth();
		 		else
		 		{
		 			var fromTo = JSON.parse(absence.student.AD_FromTo);
		 			return (parseInt(fromTo.from.split('/')[1]) <= (today.getMonth() + 1) && parseInt(fromTo.to.split('/')[1]) >= (today.getMonth() + 1)) || addDate.getMonth() === today.getMonth();
		 		}
		 	})
		} else if ($('input[name="filter-absence"]').val() === 'Today')
		{
			filtredT = filtredT.filter(absence =>{ 
	 		var addDate = new Date(absence.teacher.AD_Addeddate);
		 		if (absence.teacher.AD_Date !== 'null')
		 			return (absence.teacher.AD_Date === currentDate) || addDate.toDateString() === today.toDateString();
		 		else
		 		{
		 			var fromTo = JSON.parse(absence.teacher.AD_FromTo);
		 			return ((fromTo.from.split('/')[0] <= currentDate.split('/')[0] && fromTo.from.split('/')[1] <= currentDate.split('/')[1]) && (fromTo.to.split('/')[0] >= currentDate.split('/')[0] && fromTo.to.split('/')[1] >= currentDate.split('/')[1])) || addDate.toDateString() === today.toDateString();
		 		}
		 	})
		 	filtredS = filtredS.filter(absence =>{ 
		 		var addDate = new Date(absence.student.AD_Addeddate);
		 		if (absence.student.AD_Date !== 'null')
		 			return absence.student.AD_Date === currentDate || addDate.toDateString() === today.toDateString();
		 		else
		 		{
		 			var fromTo = JSON.parse(absence.student.AD_FromTo);
		 			return ((fromTo.from.split('/')[0] <= currentDate.split('/')[0] && fromTo.from.split('/')[1] <= currentDate.split('/')[1]) && (fromTo.to.split('/')[0] >= currentDate.split('/')[0] && fromTo.to.split('/')[1] >= currentDate.split('/')[1])) || addDate.toDateString() === today.toDateString();
		 		}
		 	})
		}
	 }
	if ($('input[data-name=Teacher]').is(':checked'))
		displayTAbsences(filtredT);
    else
    	$('#absence-list').find('.row-teacher').remove();
    if ($('input[data-name=Student]').is(':checked'))
         displaySAbsences(filtredS);
    else
    	$('#absence-list').find('.row-student').remove();
 });