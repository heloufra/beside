var absencesT,absencesS,Payments,StudentMonthlySubscriptions, DashboardAllData = [];
var absenceArray = ["Retard","Absence"];
var months =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var StudentSub = [];
var today = new Date();
var currentDate = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
var maxChart = 0;
var selectedMonth = 6 ; //(today.getMonth() + 1) ;

$cutout="62%";
$layoutPadding = 3 ;

$(document).ready(()=> {
	getAbsences();
	getPayments();
});


$timing = 1000;


function monthDays(month,year) {
         return new Date(year, month, 0).getDate();
};

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
            var Today = new Date();
     	 	Today = Today.toISOString().slice(0,10);

            var filtredT = absencesT.filter(absence =>{

			 	if(absence.teacher.AD_Type == 2){
	                  AD_FromTo = JSON.parse(absence.teacher.AD_FromTo);
	                  AD_From   = AD_FromTo.from;
	                  AD_To     = AD_FromTo.to;
	                  AD_From =  dateConvert(AD_From);
	                  AD_To   =  dateConvert(AD_To);
	                  return dateBetween(AD_From,AD_To,Today);
	            }else{
		              AD_FromTo  =  absence.teacher.AD_Date;
		              AD_FromTo  =  dateConvert(AD_FromTo);
		              if(absence.teacher.AD_Type == 0){
		                AD_FromTo  =  absence.teacher.AD_Date;
		                AD_FromTo  =  dateConvert(AD_FromTo);
		                return dateBetween(AD_FromTo,AD_FromTo,Today);
		              }else{
		                return dateBetween(AD_FromTo,AD_FromTo,Today);
		              }       
	            }

		 	});

		 	var filtredS = absencesS.filter(absence =>{ 
			 	if(absence.student.AD_Type == 2){
	                  AD_FromTo = JSON.parse(absence.student.AD_FromTo);
	                  AD_From   = AD_FromTo.from;
	                  AD_To     = AD_FromTo.to;
	                  AD_From =  dateConvert(AD_From);
	                  AD_To   =  dateConvert(AD_To);
	                  return dateBetween(AD_From,AD_To,Today);
	            }else{
		              AD_FromTo  =  absence.student.AD_Date;
		              AD_FromTo  =  dateConvert(AD_FromTo);
		              if(absence.student.AD_Type == 0){
		                AD_FromTo  =  absence.student.AD_Date;
		                AD_FromTo  =  dateConvert(AD_FromTo);
		                return dateBetween(AD_FromTo,AD_FromTo,Today);
		              }else{
		                return dateBetween(AD_FromTo,AD_FromTo,Today);
		              }       
	            }
		 	})

          	displayTAbsences(filtredT);
          	displaySAbsences(filtredS);
	  	}
	  });
}

function dateConvert(date) {
  	return  date = date.split("/").reverse().join("-");
}

function dateConvertSlashes(date) {

	date = date.split("T");
	return date[0].split("-").reverse().join("/");

}

function dateBetween(from,to,check) {

	var fDate,lDate,cDate;
	fDate = Date.parse(from);
	lDate = Date.parse(to);
	cDate = Date.parse(check);

	if((cDate <= lDate && cDate >= fDate)) {
	    return true;
	}

	return false;

}


function getPayments()
{
	addLoadingAnimation(".dashboard-card-info",null);
	addLoadingAnimation(".dashboard-card-table-info-container",null);
	$.ajax({
	    type: 'get',
	    url: '/Dashboard/payments',
	    dataType: 'json'
	  })
	  .done(function(res){
	  	if(res.errors)
	  	{
	  		console.log(res.errors)
	  	} else {
	  		Payments = res.payments;
			StudentMonthlySubscriptions = res.studentMonthlySubscriptions ;
	  		StudentSub = res.studentsSub;
			for (var i = StudentSub.length - 1; i >= 0; i--) {
				if (StudentSub[i].Expense_PaymentMethod === 'Monthly'){
					maxChart += parseInt(StudentSub[i].Expense_Cost);
				}
			}
			getDashboardAllData();
	  	}
	  });
}

function displayPayments_old(payments) 
{
	var result = [];
	var subScription = [];
	$('#list-payments').find('.row-payments').remove();

	for (var i = StudentSub.length - 1; i >= 0; i--) {

		if (!subScription[StudentSub[i].Student_ID]){
			subScription[StudentSub[i].Student_ID] = {"Student_ID":StudentSub[i].Student_ID,Expense_Cost:0};
		}

		if (StudentSub[i].Expense_PaymentMethod === 'Monthly'){
			for (var j = months.indexOf(StudentSub[i].Subscription_StartDate); j <= months.length - 1; j++) {
				subScription[StudentSub[i].Student_ID].Expense_Cost += parseInt(StudentSub[i].Expense_Cost);
				if (j === today.getMonth()){
					break;
				}
				if (i === months.length - 1){
					i = -1;
				}
			}
		}else{
			subScription[StudentSub[i].Student_ID].Expense_Cost += parseInt(StudentSub[i].Expense_Cost)
		}
	}

	var tempDate;
	payments.forEach(function (a) {
		tempDate = new Date(a.SP_Addeddate);
	    if (!this[a.Student_ID+'-'+tempDate.toDateString()]) {
	        this[a.Student_ID+'-'+tempDate.toDateString()] = { Student_ID: a.Student_ID, Expense_Cost: 0,SP_Addeddate:a.SP_Addeddate,Student_Image:a.Student_Image,Student_FirstName:a.Student_FirstName,Student_LastName:a.Student_LastName,Classe_Label:a.Classe_Label };
	        result.push(this[a.Student_ID+'-'+tempDate.toDateString()]);
	    }
    	this[a.Student_ID+ '-'  +tempDate.toDateString()].Expense_Cost += parseInt(a.Expense_Cost);
	}, Object.create(null));
	
	Payments.forEach(function (a) {
	    subScription[a.Student_ID].Expense_Cost -= parseInt(a.Expense_Cost);
	}, Object.create(null));
	for (var i = 0; i <= result.length - 1; i++) {
		var $date = dateConvertSlashes(result[i].SP_Addeddate);
		$('#list-payments').append('<tr class="row-payments"> <td data-label="Student"> <!-- sections-main-sub-container-left-cards --> <div class="sections-main-sub-container-left-card"> <img class="sections-main-sub-container-left-card-main-img" src="'+result[i].Student_Image+'" alt="card-img"> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+result[i].Student_FirstName + ' ' + result[i].Student_LastName +'</p> <span class="sections-main-sub-container-left-card-sub-info">'+ result[i].Classe_Label +'</span> </div> </div> <!-- End sections-main-sub-container-left-cards --> </td> <td class="readonly" data-label="Date"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+ $date +'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> </td> <td class="readonly" data-label="Paid amount"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+ result[i].Expense_Cost +'" class="input-text input-text-blue" required="" placeholder="Paid amount"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> </td> <td class="readonly" data-label="Outstanding"> <div class="form-group group dynamic-form-input-text-container-icon"> '+(subScription[result[i].Student_ID].Expense_Cost <= 0 ? ('<img src="assets/icons/green_check.svg" alt="green_check">') : ('<input type="text" value="'+subScription[result[i].Student_ID].Expense_Cost+'" class="input-text" required="" placeholder="Outstanding">'))+' </div> </td> </tr> ')
	}
}

function displayPayments(selectedMonth) 
{
	
	$('#list-payments').html("");

	StudentMonthlySubscriptionsFiltred = StudentMonthlySubscriptions.filter(StudentMonthlySubscription => {
			return StudentMonthlySubscription.MonthID === selectedMonth
	});

	var result = [];
	var subScription = [];
	$('#list-payments').find('.row-payments').remove();

	if(StudentMonthlySubscriptionsFiltred.length > 0 ){
		
		for(i = 0 ; i < StudentMonthlySubscriptionsFiltred[0].StudentsPaymentsList.length ; i++ ){

			result = StudentMonthlySubscriptionsFiltred[0].StudentsPaymentsList[i];
			var $date = dateConvertSlashes(result.SP_Addeddate);
			StudentMonthlySubscription =  StudentMonthlySubscriptionsFiltred[0].StudentsPaymentsList[i];

			$('#list-payments').append(`<tr class="row-payments"> 

				<td data-label="Student"> 
				<!-- sections-main-sub-container-left-cards --> 
					<div class="sections-main-sub-container-left-card"> <img class="sections-main-sub-container-left-card-main-img" src="`+result.Student_Image+`" alt="card-img"> 
					<div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">`+result.Student_FirstName + ` ` + result.Student_LastName +`</p> <span class="sections-main-sub-container-left-card-sub-info">`+ result.Classe_Label +`</span> 
					</div> 
					</div>
				<!-- End sections-main-sub-container-left-cards --> 
				</td> 

				<td class="readonly" data-label="Date"> 
					<div class="form-group group dynamic-form-input-text-container-icon"> 
					<input type="text" value="`+ $date +`" class="input-text" required="" placeholder="Date"> 
					<img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> 
					</div> 
				</td> 

				<td class="readonly" data-label="Paid amount">
					<div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="`+ result.Expense_Cost +` Dhs" class="input-text input-text-blue" required="" placeholder="Paid amount"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> 
					</div>
				</td> 

				<td class="readonly" data-label="Paid month"> 
					<div class="form-group group dynamic-form-input-text-container-icon"> 
						<input type="text" value="`+ ((result.Expense_PaymentMethod == 'Monthly' ) ? arrLang[$lang][result.SP_PaidPeriod] : result.SP_PaidPeriod ) +`" class="input-text" required="" placeholder="Paid Month">
					</div>
				</td>

				<td data-label="Paid Subscriptions"> 
					<div class="sections-main-sub-container-left-card">
					<div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">`+result.Expense_Label+`</p> <span class="sections-main-sub-container-left-card-sub-info">`+ arrLang[$lang][result.Expense_PaymentMethod] +`</span>
					</div> 
					</div>
				</td>



			</tr> `);
		}

	}

}

function displayTAbsences(Tabsences) 
{
	  //console.log("Tabsences",Tabsences);

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
		        if(Tabsences[i].teacher.AD_Type === 2){
		          type = 'Absence';
		        }
		        else{
		          type = absenceArray[Tabsences[i].teacher.AD_Type];
		        }

		        $tr ='<tr class="row-teacher"> <td data-label="Persons"> <!-- sections-main-sub-container-left-cards --> <div class="sections-main-sub-container-left-card"> <img class="sections-main-sub-container-left-card-main-img" src="'+Tabsences[i].teacher.User_Image+'" alt="card-img"> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info"> '+userNAme+' </p> <span class="sections-main-sub-container-left-card-sub-info">'+htmlClasse +'</span> </div> </div> <!-- End sections-main-sub-container-left-cards --> ';

		        if(Tabsences[i].teacher.AD_Type === 0 ){

		        	$date_AD = dateConvertSlashes(Tabsences[i].teacher.AD_Addeddate);

			        $tr+='<td class="readonly" data-label="From"> <div class="sections-main-sub-container-left-card">  <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+fromTo.from+'</p> <span class="sections-main-sub-container-left-card-sub-info sections-main-sub-container-left-card-sub-info-date">'+$date_AD+'</span> </div> </div> </td> ';

			        $tr+='<td class="readonly" data-label="To"> <div class="sections-main-sub-container-left-card">  <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+fromTo.to+'</p> <span class="sections-main-sub-container-left-card-sub-info  sections-main-sub-container-left-card-sub-info-date">'+$date_AD+'</span> </div> </div> </td> ';
		    	}else{

		    		 $tr+='<td class="readonly" data-label="From"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+fromTo.from+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> </td> ';
			        $tr+='<td class="readonly" data-label="To"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+fromTo.to+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> </td> </td>';

		    	}

		        $tr+='<td class="readonly" data-label="Type"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+type+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> </td> <td class="readonly" data-label="Reported by"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+reportedBy+'" class="input-text" required="" placeholder="Reported by"> </div> </td> </tr>';

	  			$('#absence-list').append($tr);
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
    if(Sabsences[i].student.AD_Type === 2){
      type = 'Absence';
    }
    else{
      type = absenceArray[Sabsences[i].student.AD_Type];
    }

        $tr ='<tr class="row-teacher"> <td data-label="Persons"> <!-- sections-main-sub-container-left-cards --> <div class="sections-main-sub-container-left-card"> <img class="sections-main-sub-container-left-card-main-img" src="'+Sabsences[i].student.Student_Image+'" alt="card-img"> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info"> '+Sabsences[i].student.Student_FirstName+ ' '+ Sabsences[i].student.Student_LastName+' </p> <span class="sections-main-sub-container-left-card-sub-info">'+Sabsences[i].student.Classe_Label +'</span> </div> </div> <!-- End sections-main-sub-container-left-cards --> ';

        if(Sabsences[i].student.AD_Type === 0 ){

        	$date_AD = dateConvertSlashes(Sabsences[i].student.AD_Addeddate);

	        $tr+='<td class="readonly" data-label="From"> <div class="sections-main-sub-container-left-card">  <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+fromTo.from+'</p> <span class="sections-main-sub-container-left-card-sub-info  sections-main-sub-container-left-card-sub-info-date">'+$date_AD+'</span> </div> </div> </td> ';

	        $tr+='<td class="readonly" data-label="To"> <div class="sections-main-sub-container-left-card">  <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+fromTo.to+'</p> <span class="sections-main-sub-container-left-card-sub-info  sections-main-sub-container-left-card-sub-info-date">'+$date_AD+'</span> </div> </div> </td> ';
    	}else{

    		 $tr+='<td class="readonly" data-label="From"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+fromTo.from+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> </td> ';
	        $tr+='<td class="readonly" data-label="To"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+fromTo.to+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> </td> </td>';

    	}

        $tr+='<td class="readonly" data-label="Type"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+type+'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> </td> <td class="readonly" data-label="Reported by"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+reportedBy+'" class="input-text" required="" placeholder="Reported by"> </div> </td> </tr>';

			$('#absence-list').append($tr);

	}
}

$('.filter-absence').change(function () {
	var filtredT = absencesT,filtredS = absencesS;
	$('#absence-list').find('.row-student').remove();
	$('#absence-list').find('.row-teacher').remove();
	 if (String($('input[name="filter-absence"]').attr("data-val")).replace(/\s/g, '') !== '')
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

		if ($('input[name="filter-absence"]').attr("data-val") === 'This Month')
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
		} else if ($('input[name="filter-absence"]').attr("data-val") === 'Today')
		{
			var Today = new Date();
	 	 	Today = Today.toISOString().slice(0,10);

	        var filtredT = absencesT.filter(absence =>{

			 	if(absence.teacher.AD_Type == 2){
	                  AD_FromTo = JSON.parse(absence.teacher.AD_FromTo);
	                  AD_From   = AD_FromTo.from;
	                  AD_To     = AD_FromTo.to;
	                  AD_From =  dateConvert(AD_From);
	                  AD_To   =  dateConvert(AD_To);
	                  return dateBetween(AD_From,AD_To,Today);
	            }else{
		              AD_FromTo  =  absence.teacher.AD_Date;
		              AD_FromTo  =  dateConvert(AD_FromTo);
		              if(absence.teacher.AD_Type == 0){
		                AD_FromTo  =  absence.teacher.AD_Date;
		                AD_FromTo  =  dateConvert(AD_FromTo);
		                return dateBetween(AD_FromTo,AD_FromTo,Today);
		              }else{
		                return dateBetween(AD_FromTo,AD_FromTo,Today);
		              }       
	            }

		 	});

		 	var filtredS = absencesS.filter(absence =>{ 
			 	if(absence.student.AD_Type == 2){
	                  AD_FromTo = JSON.parse(absence.student.AD_FromTo);
	                  AD_From   = AD_FromTo.from;
	                  AD_To     = AD_FromTo.to;
	                  AD_From =  dateConvert(AD_From);
	                  AD_To   =  dateConvert(AD_To);
	                  return dateBetween(AD_From,AD_To,Today);
	            }else{
		              AD_FromTo  =  absence.student.AD_Date;
		              AD_FromTo  =  dateConvert(AD_FromTo);
		              if(absence.student.AD_Type == 0){
		                AD_FromTo  =  absence.student.AD_Date;
		                AD_FromTo  =  dateConvert(AD_FromTo);
		                return dateBetween(AD_FromTo,AD_FromTo,Today);
		              }else{
		                return dateBetween(AD_FromTo,AD_FromTo,Today);
		              }       
	            }
		 	})
		}
	 }
	if ($('input[data-name=Teacher]').is(':checked')){
		displayTAbsences(filtredT);
	}
		
    else{
		$('#absence-list').find('.row-teacher').remove();
	}
    	
    if ($('input[data-name=Student]').is(':checked')){
		displaySAbsences(filtredS);
	}
    else{
		$('#absence-list').find('.row-student').remove();
	}
    	
	$(this).attr("data-lang",arrLang[$lang][$(this).attr("data-val")]);


 });

$('input[name=filter-finance]').change(function () {
	if (this.value.replace(/\s/g, ''))
	{
		filterDashboardData($(this).attr("data-id"));
	}
})

$('input[name=filter-payments_old]').change(function () {
	var filtred;
	var $this = $(this);
	if (String($this.attr("data-val")).replace(/\s/g, ''))
	{
		if ($this.attr("data-val") === 'Today'){
			filtred = Payments.filter(payment => {
				var date = new Date(payment.SP_Addeddate)
				return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
			})
		} 
		else if ($this.attr("data-val") === 'This year'){
			filtred = Payments.filter(payment => {
				var date = new Date(payment.SP_Addeddate);
				return date.getFullYear() === today.getFullYear();
			})
		}
		else if ($this.attr("data-val") === 'This Month'){
			filtred = Payments.filter(payment => {
				var date = new Date(payment.SP_Addeddate);
				return date.getMonth() === today.getMonth();
			})
		}

		displayPayments(filtred || []);
		$this.attr("data-lang",arrLang[$lang][$this.attr("data-val")]);
	}
})


$('input[name=filter-payments]').change(function () {
	

	var $this = $(this);
	
	if (String($this.attr("data-val")).replace(/\s/g, ''))
	{
		var index = months.indexOf($this.attr("data-val"));
		displayPayments((index+1));
		$this.attr("data-lang",arrLang[$lang][$this.attr("data-val")]);
	}
})

	/* Chart.js _______________________________________________*/


function randomData(month_ID,Year){

		$chartData = [];
		$filtreDate = [];

		days = monthDays((month_ID*1+1),Year);
		//console.log("days",days);

		for(d=1;d<=days;d++){

			$obj = {};

			$filtreDate = Payments.filter(payment => {
				var temp = new Date(payment.SP_Addeddate);
				var mois = months.indexOf(payment.SP_PaidPeriod);
				//console.log("temp.getDate()" , temp.getDate() +" d "+ d +" mois "+mois+" month_ID "+month_ID+" payment.SP_PaidPeriod "+payment.SP_PaidPeriod);
				return (temp.getDate() === d && mois === month_ID ) || ( temp.getDate() === d  && temp.getMonth() == month_ID && temp.getFullYear() == Year)   ;
			})

			$obj.paymentCount  = 0;
			$obj.y = 0;

			//console.log("$filtreDate",$filtreDate);

			for (var i = $filtreDate.length - 1; i >= 0; i--) {
				$obj.paymentCount  += 1;
				$obj.y 			  += parseInt($filtreDate[i].Expense_Cost);
			}

			$chartData.push($obj);
		}

		//console.log("$chartData",$chartData);

		return $chartData;

}

function ChartJS(month_ID,Year) {
	
	$chartDays = [];

	days = monthDays((month_ID*1+1),Year);
	//console.log("days",days);

	for(d=1;d<=days;d++){
		d = d < 9 ? '0'+d : d; 
		$chartDays.push(d);
	}

	var config = {
			type: 'line',
			data: {
				labels:$chartDays,
				datasets: [{
					label: 'Payment',
					backgroundColor:"#45bcff",
					borderColor: "#45bcff",
			        fill: true,
			        borderColor: "rgb(75, 192, 192)",
			        backgroundColor: "rgba(146, 221, 255, 0.08)",
			        borderWidth: 2,
			        lineTension: 0,
			        /* point options */
			        pointBorderColor: "#45bcff", // blue point border
			        pointBackgroundColor: "#45bcff", // wite point fill
			        pointBorderWidth: 1, // point border width 
					data: randomData(month_ID,Year),
					stepped: true,
				}]
			},
			options: {
				responsive: true,
            	maintainAspectRatio: false,
				title: {
					display: false,
					text: 'Finance'
				},
				legend: {
			    	display: false
			    },
			    tooltips: {
				   callbacks: {
                    	label : function(tooltipItem, data) {
                        	var item = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
				     		return item;
                   		 }
				  },
				  enabled: false,
			      backgroundColor: '#FFF',
			      titleFontSize: 16,
			      titleFontColor: '#0066ff',
			      bodyFontColor: '#000',
			      bodyFontSize: 14,
			      displayColors: false,
			      custom: 	/*********************************************************************************************/
							function(tooltip) {

							    // Tooltip Element
							    var tooltipEl = document.getElementById('chartjs-tooltip');
							    if (!tooltipEl) {
							        tooltipEl = document.createElement('div');
							        tooltipEl.id = 'chartjs-tooltip';
							        tooltipEl.innerHTML = "<table></table>"
							        document.body.appendChild(tooltipEl);
							    }
							    // Hide if no tooltip
							    if (tooltip.opacity === 0) {
							        tooltipEl.style.opacity = 0;
							        return;
							    }
							    // Set caret Position
							    //tooltipEl.classList.remove('above', 'below', 'no-transform');
							    if (tooltip.yAlign) {
							        tooltipEl.classList.add(tooltip.yAlign);
							    } else {
							        tooltipEl.classList.add('no-transform');
							    }
							    function getBody(bodyItem) {
							        return bodyItem.lines[0];
							    }
							    // Set Text
							    if (tooltip.body) {
							        var titleLines = tooltip.title || [];
							        var bodyLines = tooltip.body.map(getBody);
							        //PUT CUSTOM HTML TOOLTIP CONTENT HERE (innerHTML)
							        var innerHtml = '<thead>';
							        /*titleLines.forEach(function(title) {
							            innerHtml += '<tr><th>' +  + '</th></tr>';
							        });
							        innerHtml += '</thead><tbody>';*/
							        bodyLines.forEach(function(body, i) {
							            var colors = tooltip.labelColors[i];
							            var style = 'background:' + colors.backgroundColor;
							            style += '; border-color:' + colors.borderColor;
							            style += '; border-width: 2px'; 
							            var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
							            innerHtml += '<tr style="font-size:13px;color:#151a3b"><td>'+ span + body.paymentCount + ' payment(s) </td></tr>';
							            innerHtml += '<tr style="font-size:13px;color:#151a3b"><td><span style="color:#279fe3"> + ' + span + body.y + '</span> Dh </td></tr>';
							        });
							        innerHtml += '</tbody>';
							        var tableRoot = tooltipEl.querySelector('table');
							        tableRoot.innerHTML = innerHtml;
							    }
							    var position = this._chart.canvas.getBoundingClientRect();

								// Display, position, and set styles for font
								tooltipEl.style.opacity = 1;
								tooltipEl.style.position = 'absolute';
								tooltipEl.style.left = position.left + window.pageXOffset + tooltip.caretX + 'px';
								tooltipEl.style.top = position.top + window.pageYOffset + tooltip.caretY + 'px';
								tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
								tooltipEl.style.fontSize = tooltip.bodyFontSize + 'px';
								tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
								tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
								tooltipEl.style.pointerEvents = 'none';
								tooltipEl.style.backgroundColor = '#FFF';
								tooltipEl.style.borderRadius = '3px';
							}
							/*********************************************************************************************/
			    },
				scales: {
					xAxes: [{
						display: true,
						gridLines: {
						  display: true,
						  color: "#f0f0f6"
						},
			       		scaleLabel: {
			           		display: false,
			           		labelString: 'Date'
		        		}
					}],
					yAxes: [{
						display: true,
						gridLines: {
						  display: false,
						  color: "#f0f0f6"
						},
						//type: 'logarithmic',
	          			scaleLabel: {
							display: false,
							labelString: 'Index Returns'
						},
						ticks: {
							min: 0,
							max: maxChart,
							// forces step size to be 5 units
							stepSize: 500,
						}
					}]
				}
			}
	};

	if (document.getElementById('canvas')){

		if( window.myLine!==undefined){
			window.myLine.destroy();
		}
		
		var ctx = document.getElementById('canvas').getContext('2d');
		window.myLine = new Chart(ctx, config);

	}
			
}


		/***************************** ChartJSDonut **********************************/

		function ChartJSDonut($elem,$percentage,$data){
			var data = {
				labels: $data.labels,
				datasets: [
				  {
					data: $data.data,
					backgroundColor: $data.backgroundColor,
					hoverBackgroundColor: $data.hoverBackgroundColor,
					extra_data:$data.extra_data
				  }]
			  };
			  
			  var promisedDeliveryChart = new Chart(document.getElementById($elem), {
				type: 'doughnut',
				data: data,
				options: {
				  hover: {mode: null},
				  cutout:$cutout,
				  responsive: true,
				  maintainAspectRatio: true,
				  rotation: 0,
				  plugins:{
						legend: {
							display: false,
						},
						tooltip: {
							backgroundColor: 'rgba(0, 0, 0, 0.8)',
							titleFontSize: "10px",
							titleFontColor: '#151a3b',
							displayColors: true,
							usePointStyle: false,
							enabled: false,
							position:'average',
							bodyFont:"10px",
							external: externalTooltipHandler,
							callbacks: {
								title: function(ctx) {
									return arrLang[$lang][ctx[0].label]
								},
								label: function(ctx) {

									label = "";
									amount = 0;
									percentage = Math.round(parseFloat(ctx.dataset.data[ctx.dataIndex]));

									if( ctx.label == "Debt"){
										amount = (ctx.dataset.extra_data.Monthly_Expected_Incomes + ctx.dataset.extra_data.Annual_Expected_Incomes) - 
											(ctx.dataset.extra_data.Month_Expense_TotalPay_Per_Month+ctx.dataset.extra_data.Annual_Expense_TotalPay_Per_Month);
									}else{
										amount = ctx.dataset.extra_data.Monthly_Expense_TotalPay + ctx.dataset.extra_data.Annual_Expense_TotalPay_Per_Month ;
									}
									
									label = percentage +"% ~ "+amount+" Dhs ";
									return label;
								},
							}
						}
				  }
				},
				plugins: [{
					beforeDraw: function(chart) {

						var width = chart.width,
							height = chart.height,
							ctx = chart.ctx;
					
						ctx.restore();
						var fontSize = (height / 80 ).toFixed(2);
						ctx.font = (fontSize) + "em sans-serif";
						ctx.textBaseline = "middle";
					
						var text = $percentage,
							textX = Math.round((width - ctx.measureText(text).width) / 2),
							textY = height / 2;
					
						ctx.fillText(text, textX, textY);
						ctx.save();
					  }
				}]
				
			  });
		}

		/***************************** ChartJSPie **********************************/

		const getOrCreateTooltip = (chart) => {
			let tooltipEl = chart.canvas.parentNode.querySelector('div');
		  
			if (!tooltipEl) {
			  tooltipEl = document.createElement('div');
			  tooltipEl.className="tooltip_conatiner"
			  tooltipEl.style.background = 'rgba(0, 0, 0, 0.8)';
			  tooltipEl.style.borderRadius = '3px';
			  tooltipEl.style.color = 'white';
			  tooltipEl.style.opacity = 1;
			  tooltipEl.style.pointerEvents = 'none';
			  tooltipEl.style.position = 'absolute';
			  tooltipEl.style.transform = 'translate(-50%, 0)';
			  tooltipEl.style.transition = 'all .5s ease';
		  
			  const table = document.createElement('table');
			  table.style.margin = '0px';
		  
			  tooltipEl.appendChild(table);
			  chart.canvas.parentNode.appendChild(tooltipEl);
			}
		  
			return tooltipEl;
		  };
		  
		  const externalTooltipHandler = (context) =>{
			// Tooltip Element
			var tooltipEl = document.getElementById('chartjs-tooltip');

			// Create element on first render
			if (!tooltipEl) {
				tooltipEl = document.createElement('div');
				tooltipEl.id = 'chartjs-tooltip';
				tooltipEl.className = 'chartjs-tooltip below';
				tooltipEl.innerHTML = '<table></table>';
				document.body.appendChild(tooltipEl);
			}

			// Hide if no tooltip
			var tooltipModel = context.tooltip;
			if (tooltipModel.opacity === 0) {
				tooltipEl.style.opacity = 0;
				return;
			}

			// Set caret Position
			//tooltipEl.classList.remove('above', 'below', 'no-transform');
			if (tooltipModel.yAlign) {
				tooltipEl.classList.add(tooltipModel.yAlign);
			} else {
				tooltipEl.classList.add('no-transform');
			}

			function getBody(bodyItem) {
				return bodyItem.lines;
			}

			// Set Text
			if (tooltipModel.body) {
				var titleLines = tooltipModel.title || [];
				var bodyLines = tooltipModel.body.map(getBody);

				var innerHtml = '<thead>';

				titleLines.forEach(function(title) {
					innerHtml += '<tr><th>' + title + '</th></tr>';
				});
				innerHtml += '</thead><tbody>';

				bodyLines.forEach(function(body, i) {
					var colors = tooltipModel.labelColors[i];
					var style = 'background:' + colors.backgroundColor;
					style += '; border-color:' + colors.borderColor;
					style += '; border-width: 2px';
					style += '; margin-right: 2px';
					style += '; height : 12px';
					style += '; width : 12px';
					style += '; display : inline-block';
					style += '; position: relative ';
					style += '; top: 2px ';
					var span = '<span style="' + style + '"></span>';
					innerHtml += '<tr><td>' + span + body + '</td></tr>';
				});
				innerHtml += '</tbody>';

				var tableRoot = tooltipEl.querySelector('table');
				tableRoot.innerHTML = innerHtml;
			}

			var position = context.chart.canvas.getBoundingClientRect();
			var bodyFont = Chart.helpers.toFont(tooltipModel.options.bodyFont);

			// Display, position, and set styles for font
			tooltipEl.style.opacity = 1;
			tooltipEl.style.position = 'absolute';
			tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
			tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
			tooltipEl.style.font = bodyFont.string;
			tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
			tooltipEl.style.pointerEvents = 'none';
		}
		  
		/***************************** ChartJSPie **********************************/

		function ChartJSPie($elem,$data){

			var ctx = document.getElementById($elem);
			var myChart = new Chart(ctx, {
				type: $data.type,
				data: $data ,
				options: {
					hover: {mode: null},
					responsive: true,
					maintainAspectRatio: true,
					rotation: 0,
					cutout:$data.cutout,
					layout:{
						padding:$layoutPadding
					},
					plugins:{
						legend: {
							display: false,
						},
						datalabels: {
							display: true,
							anchor: function (ctx) {
								if( ctx.dataset.data[ctx.dataIndex] == 0 ||  ctx.dataset.data[ctx.dataIndex] <= 20   ){
									return 'center';
								}else if(ctx.dataset.data[ctx.dataIndex] > 20 ) {
									return 'center';
								}else if( ctx.dataset.data[ctx.dataIndex] >= 100 ) {
									return 'center';
								}
							},
							align:function (ctx) {
								if( ctx.dataset.data[ctx.dataIndex] == 0 ||  ctx.dataset.data[ctx.dataIndex] <= 20  ){
									return 'center'; //end
								}else if(ctx.dataset.data[ctx.dataIndex] > 20 ) {
									return 'center'; //center
								}else if( ctx.dataset.data[ctx.dataIndex] >= 100 ) {
									return 'center'; //start
								}
							},
							rotation: function (ctx) {
								//return (ctx.dataset.data[ctx.dataIndex] <= 25) ? '-60' : '0'
							},
							formatter: (value, ctx) => {
								let sum = 0;
								let dataArr = ctx.chart.data.datasets[0].data;
								dataArr.map(data => {
									sum += data;
								});
								let percentage = (value*100 / sum).toFixed(0)+"%";
								return percentage;
							},
							color: $data.colors,
							font: function (context) {
								var avgSize = Math.round((context.chart.height ) / 8 );
								return {
									size: avgSize+'em',
									weight: '500'
								};
							},
						},
						tooltip: {
							backgroundColor: 'rgba(0, 0, 0, 0.8)',
							titleFontSize: "10px",
							titleFontColor: '#151a3b',
							displayColors: true,
							usePointStyle: false,
							enabled: false,
							position:'average',
							bodyFont:"10px",
							external: externalTooltipHandler,
							callbacks: {
								title: function(ctx) {
									return arrLang[$lang][ctx[0].label]
								},
								label: function(ctx) {

									label = "";
									amount = 0;
									percentage = Math.round(parseFloat(ctx.dataset.data[ctx.dataIndex]));

									if(ctx.dataset.label == "MonthlySubscriptionsPieChart"){

										if( ctx.label == "Debt"){
											amount = ctx.dataset.extra_data.Total_Monthly_Expected - 
													 ctx.dataset.extra_data.Total_Monthly_Paid_Subscriptions;
										}else{
											amount = ctx.dataset.extra_data.Total_Monthly_Paid_Subscriptions;
										}

									}else{

										if( ctx.label == "Debt"){
											amount = ctx.dataset.extra_data.Total_Annual_Expected - 
													 ctx.dataset.extra_data.Annual_Expense_TotalPay;
										}else{
											amount = ctx.dataset.extra_data.Annual_Expense_TotalPay;
										}

									}
									
									label = percentage +"% ~ "+amount+" Dhs ";
									return label;
								},
							}
						}
					 }
				},
				plugins: [ChartDataLabels,{}]
			});
		}
				  
		/***************************** ChartJSPie **********************************/

		function ChartJSPieMixed($elem,$data){

			var ctx = document.getElementById($elem);
			var myChart = new Chart(ctx, {
				type: $data.type,
				data: $data ,
				options: {
					hover: {mode: null},
					responsive: true,
					maintainAspectRatio: true,
					rotation: 0,
					cutout:$data.cutout,
					layout:{
						padding:$layoutPadding
					},
					plugins:{
						legend: {
							display: false,
						},
						datalabels: {
							display: true,
							anchor: function (ctx) {
								if( ctx.dataset.data[ctx.dataIndex] == 0  ){
									return 'start';
								}else if(ctx.dataset.data[ctx.dataIndex] < 100 ) {
									return 'center';
								}else if( ctx.dataset.data[ctx.dataIndex] >= 100 ) {
									return 'start';
								}
							},
							align:function (ctx) {
								if( ctx.dataset.data[ctx.dataIndex] == 0  ){
									return 'center';
								}else if(ctx.dataset.data[ctx.dataIndex] < 100 ) {
									return 'center';
								}else if( ctx.dataset.data[ctx.dataIndex] >= 100 ) {
									return 'center';
								}
							},
							rotation: function (ctx) {
								//return (ctx.dataset.data[ctx.dataIndex] <= 25) ? '-60' : '0'
							},
							formatter: (value, ctx) => {
								let sum = 0;
								let dataArr = ctx.chart.data.datasets[0].data;
								dataArr.map(data => {
									sum += data;
								});
								let percentage = (value*100 / sum).toFixed(0)+"%";
								return percentage;
							},
							color: $data.colors,
							font: function (context) {
								var avgSize = Math.round((context.chart.height ) / 8 );
								return {
									size: avgSize+'em',
									weight: '500',

								};
							},
						},
						tooltip: {
							backgroundColor: 'rgba(0, 0, 0, 0.8)',
							titleFontSize: 10,
							titleFontColor: '#151a3b',
							displayColors: true,
							usePointStyle: false,
							enabled: false,
							position:'average',
							external: externalTooltipHandler,
							callbacks: {
								title: function(ctx) {
									return ctx[0].label;
								},
								label: function(ctx) {
										label = "";
										let total = 0;
										let dataArr = ctx.dataset.data;
										dataArr.map(ep => {
											total += ep;
										});
			
										let percentage = ( (ctx.dataset.data[ctx.dataIndex] * 1) * 100 ) / total ;
										
										percentage = Math.round(parseFloat(percentage));
			
										//label = " "+percentage +"% : "+ctx.dataset.extra_data.Yearly_Total_Revenu_Grouped_By_Expenses[ctx.dataIndex].Expense_Label;
										
										label = percentage +"% ~ "+ctx.dataset.extra_data[ctx.dataIndex].Count_Cost+" Dhs";
	
										return label;
									},
							},
							usePointStyle: false
						}
					 }
				},
				plugins: [ChartDataLabels,{}]
			});
		}
		
		/***************************************************************/

		/***************************** ChartJSLines **********************************/

		function ChartJSLines($elem,$data) {

			$maxChart = 0

			Array.prototype.max = function() {
				return Math.max.apply(null, this);
			};

			$data.datasets.map((ds)=>{

				if(ds.data.max() > $maxChart ){
					$maxChart = ds.data.max();
				}
				
			});

			var ctx = document.getElementById($elem).getContext("2d");

			var config = {
			   type: 'line',
			   data: $data ,
			   options: {
				  scales: {
					x: { barPercentage: 1.0 },
					y: { 
						id: 'Dataset1', 
						position: 'left', 
						type: 'linear',
						ticks: { display: true },
						scaleLabel: { display: false, labelString: "TestScale"},
						min: 0,
						max: () => {
							if($maxChart <= 1000){
								lastDigits= $maxChart % 100;
								return (lastDigits * 1) < 100 ? ($maxChart + (100 - ($maxChart % 100) )) : ($maxChart + 100)
							}else{
								lastDigits= $maxChart % 1000;
								//return (lastDigits * 1) < 100 ? (($maxChart - (100 - ($maxChart % 100) )) + 1000) : ($maxChart + 1000)
								return  (($maxChart - lastDigits)  + 1000)
							}
						} 
					}
				  },
				  responsive: true,
				  maintainAspectRatio: false,
				  plugins:{
					 legend : { display: false, position: 'bottom' },
					 tooltip: {
						callbacks: {

						  title: function(context) {
							var $payements =  (context[0].dataset.extra_data.MonthDailyPayements[context[0].dataIndex]+
											   context[0].dataset.extra_data.AnnualDailyPayements[context[0].dataIndex]);
							var $payementString = $payements > 1 ? arrLang[$lang]["Payments"] : arrLang[$lang]["Payment"];
							return $payements+" "+$payementString;
						  },
						  label: function(context) {
							$label = "";
							if(context.dataset.label == 'Expected'){
								$label = arrLang[$lang][context.dataset.label]+" : "+context.raw+" Dhs";
							}else{
								if(context.raw > 0 ){
									$label = arrLang[$lang][context.dataset.label]+" : +"+context.raw+" Dhs";
								}else{
									$label = arrLang[$lang][context.dataset.label]+" : "+context.raw+" Dhs";
								}
							
							}
							return $label;
						  },
						  labelTextColor: function(context) {
							$Color = "#FFF";
							if(context.dataset.label == 'Expected'){
								//$Color = '#92ddff';
							}else{
								//$Color = '#8de5ae';
							}
							return $Color;

						  }
						},
						backgroundColor: 'rgba(0, 0, 0, 0.8)',
						titleFontSize: 12,
						titleFontColor: '#151a3b',
						bodyFontSize: 14,
						displayColors: true,
						usePointStyle: false
					  }
				  },
				 
				  bezierCurve : true
			   }
			}; // end of var config

			if (document.getElementById($elem)){

				if( window.myLiveChart!==undefined){
					window.myLiveChart.destroy();
				}
				
				var ctx = document.getElementById($elem).getContext("2d");
				window.myLiveChart = new Chart(ctx, config);
		
				/***************************** End ChartJSMixedBars **********************************/
		
			}
			
		}
		
		/***************************** End ChartJSLines **********************************/

		/***************************** ChartJSMixedBars **********************************/

		function ChartJSMixedBars($elem,$data) {

			$maxChart = 0

			Array.prototype.max = function() {
				return Math.max.apply(null, this);
			};

			$data.datasets.map((ds)=>{

				if(ds.data.max() > $maxChart ){
					$maxChart = ds.data.max();
				}
				
			});
			
			var options = {
				responsive: true,
				maintainAspectRatio: false,
				tooltips: {
					mode: 'label',
					callbacks: {
						label: function(tooltipItem, data) {
						var dataset = data.datasets[tooltipItem.datasetIndex];
				
						if (tooltipItem.index == 0 && tooltipItem.datasetIndex !== 0)
							return null;
							return dataset.label + ': ' + dataset.data[tooltipItem.index]+' Dhs';
						}
					}
				},
				scales: {
					x: { barPercentage: 1.0 },
					y: { 
						min: 0,
						max: () => {
							lastDigits= $maxChart % 100;
							if($maxChart <= 1000){
								return (lastDigits * 1) < 100 ? ($maxChart + (100 - ($maxChart % 100) )) : ($maxChart + 100)
							}else{
								lastDigits= $maxChart % 1000;
								//return (lastDigits * 1) < 100 ? (($maxChart - (100 - ($maxChart % 100) )) + 1000) : ($maxChart + 1000)
								return  (($maxChart - lastDigits)  + 1000)
							}
						} 
					}
				},
				plugins:{
					legend: {
						display: false,
						labels: {
							fontSize: 11,
							usePointStyle: true,
							padding: 15,
							filter: (legendItem, chartData) => {
							if (legendItem.datasetIndex > 0) return true;
							}
						}
					},
					tooltip:{
						
						callbacks: {

							label: function(context) {
								$label = "";
								if(context.dataset.label == 'Expected'){
									$label = context.dataset.label+" : "+context.raw+" Dhs";
								}else{
									$label = context.dataset.label+" : "+context.raw+" Dhs";
								}
								return $label;
							  },
						},
						usePointStyle: false
					}
				}
			}

			data = $data;

			new Chart(document.getElementById($elem).getContext('2d'), {
				type: 'bar',
				data: data,
				options: options
			});
			
		}

		/***************************** ChartJSBars **********************************/

		function ChartJSBars($elem,$data,$indexAxis='x') {

			$maxChart = 0;
			$maxChart = $data.datasets[0].extra_data.Total_Monthly_Annual_Expected;

			var options = {
				responsive: true,
				maintainAspectRatio: false,
				tooltips: {
					mode: 'label',
					callbacks: {
						label: function(tooltipItem, data) {
						var dataset = data.datasets[tooltipItem.datasetIndex];
				
						if (tooltipItem.index == 0 && tooltipItem.datasetIndex !== 0)
							return null;
							return dataset.label + ': ' + dataset.data[tooltipItem.index]+' Dhs';
						}
					}
				},
				indexAxis:$indexAxis,
				scales: {
					x: {barPercentage: 1.0 ,
						min: 0,				
						max: () => {
							return 100;
						} ,
						ticks: {
							stepSize: () => {
								return 10;
							},
							callback: function(value, index, values) {
								return value+"%";
							}
						}
						
					},
					y: { 
						display:false
					}
				},
				plugins:{
					legend: {
						display: false,
						labels: {
							fontSize: 11,
							usePointStyle: true,
							padding: 15,
							filter: (legendItem, chartData) => {
							if (legendItem.datasetIndex > 0) return true;
							}
						}
					},
					tooltip:{
						callbacks: {

							label: function(ctx) {
									label = "";
									let total = 0;
									let dataArr = ctx.dataset.data;
									dataArr.map(ep => {
										total += ep;
									});
		
									let percentage = ( (ctx.dataset.data[ctx.dataIndex] * 1) * 100 ) / total ;
									
									percentage = Math.round(parseFloat(percentage));
		
									//label = " "+percentage +"% : "+ctx.dataset.extra_data.Yearly_Total_Revenu_Grouped_By_Expenses[ctx.dataIndex].Expense_Label;
									
									label = percentage +"% ~ "+ctx.dataset.extra_data.Yearly_Total_Revenu_Grouped_By_Expenses[ctx.dataIndex].Count_Cost+" Dhs";

									return label;
								},
						},
						usePointStyle: false

					},
					datalabels: {
						display: true,
						anchor: function () {
							return 'start';
						},
						align:'end',
						rotation: function (ctx) {
							//return (ctx.dataset.data[ctx.dataIndex] <= 25) ? '-60' : '0'
						},
						formatter: (value, ctx) => {
							label = "";
							let total = 0;
							let dataArr = ctx.dataset.data;
							dataArr.map(ep => {
								total += ep;
							});

							let percentage = ( (ctx.dataset.data[ctx.dataIndex] * 1) * 100 ) / total ;
							
							percentage = Math.round(parseFloat(percentage));

							label = " "+percentage +"% : "+ctx.dataset.extra_data.Yearly_Total_Revenu_Grouped_By_Expenses[ctx.dataIndex].Expense_Label;

							//label = percentage +"% ~ "+ctx.dataset.data[ctx.dataIndex]+" Dhs";

							return label;
						},
						color: $data.colors,
						textIndent:10,
						font: function (context) {
							//var avgSize = Math.round((context.chart.height ) / 8 );
							return {
								//size: avgSize+'em',
								weight: '500'

							};
						},
					}
					/***************/
				}
			}
			
			data = $data;

			new Chart(document.getElementById($elem).getContext('2d'), {
				type: 'bar',
				data: data,
				options: options,
				plugins: [ChartDataLabels,{}]
			});
			
		}
		
/******* getDashboardAllData ***********/

function getDashboardAllData(){
	$.ajax({
	    type: 'post',
	    url: '/Dashboard/getDashboardAllData',
	    dataType: 'json'
	  })
	  .done(function(res){

	  	if(res.errors)
	  	{
		  console.log(res.errors);
	  	} else {

			DashboardAllData = res ;

			selectedMonth = res.Month_ID;

			$(".current-month").html(arrLang[$lang][months[(selectedMonth*1-1)]]);
			$(".academic-year").html(" "+res.Academic_Year[0].AY_Label);
			$(".monthly-financal-selected-month").html(arrLang[$lang][months[(selectedMonth*1-1)]]);
			$(".equivalent").html(" ~ ");

			var filteredMonthExpenses = DashboardAllData.MonthsExpenses.filter(monthsExpenses => {
				return monthsExpenses.Month == months[(selectedMonth*1-1)];
		  	});

			$filter_finance = $('input[name=filter-finance]');

			$filter_finance.attr("value",arrLang[$lang][months[(selectedMonth*1-1)]]);
			$filter_finance.attr("data-id",months[selectedMonth]);

			$filter_payments = $('input[name=filter-payments]');
			$filter_payments.attr("value",arrLang[$lang][months[(selectedMonth*1-1)]]);
			$filter_payments.attr("data-id",months[selectedMonth]);
	
			displayPayments(selectedMonth);


			setTimeout(()=>{

				var timerId;
				student_Percentage = 0;
				teacher_Percentage = 0;

				$("#progress_bar_student").css('width', '0px');
				$("#progress_bar_teachers").css('width', '0px');
				$('#progress_bar_student').css('width', DashboardAllData.percentageS + '%');
				$('#progress_bar_teachers').css('width', DashboardAllData.percentageT + '%');

			},$timing);

			

			setTimeout(()=>{

				$data = {
					labels: ['Collections', 'Debt'],
					backgroundColor:["#92ddff","#f1f1f4"],
					hoverBackgroundColor:["#92ddff","#f1f1f4"],
					data:[],
					extra_data:filteredMonthExpenses[0]

				};

				$("#This_Month_Total_Incomes_Expected").html(filteredMonthExpenses[0].Monthly_Expected_Incomes + filteredMonthExpenses[0].Annual_Expected_Incomes);

				$("#This_Month_Collections").html(filteredMonthExpenses[0].Monthly_Expense_TotalPay + filteredMonthExpenses[0].Annual_Expense_TotalPay_Per_Month);

				$("#Total_Month_Debt").html();

				$Current_Month_Collections_Percentage = ((filteredMonthExpenses[0].Month_Expense_TotalPay_Per_Month + 
														filteredMonthExpenses[0].Annual_Expense_TotalPay_Per_Month) * 100) /
														(filteredMonthExpenses[0].Monthly_Expected_Incomes + filteredMonthExpenses[0].Annual_Expected_Incomes);

				$Current_Month_Collections_Percentage = Math.round(parseFloat($Current_Month_Collections_Percentage));	

				$("#This_Month_Collections_Percentage").html($Current_Month_Collections_Percentage +"%");
				
				$("#Current_Month_Collections_Percentage").html($Current_Month_Collections_Percentage+"%");

				$("#Current_Month_Collections").html(filteredMonthExpenses[0].Month_Expense_TotalPay_Per_Month+filteredMonthExpenses[0].Annual_Expense_TotalPay_Per_Month);

				$Current_Month_Debt_Percentage = ((filteredMonthExpenses[0].Month_Expense_TotalPay_Per_Month + 
														filteredMonthExpenses[0].Annual_Expense_TotalPay_Per_Month) * 100) /
														(filteredMonthExpenses[0].Monthly_Expected_Incomes + filteredMonthExpenses[0].Annual_Expected_Incomes);

				$("#Current_Month_Debt").html((filteredMonthExpenses[0].Monthly_Expected_Incomes + filteredMonthExpenses[0].Annual_Expected_Incomes) - 
											(filteredMonthExpenses[0].Month_Expense_TotalPay_Per_Month+filteredMonthExpenses[0].Annual_Expense_TotalPay_Per_Month));

				$("#Current_Month_Debt_Percentage").html((Math.round(parseFloat(100 - $Current_Month_Debt_Percentage)))+"%");

				$data.data = [
								$Current_Month_Collections_Percentage,
								(($Current_Month_Collections_Percentage >= 100 ) ?  0 : (100 - ($Current_Month_Collections_Percentage * 1) ))
							];

				ChartJSDonut("monthlyDonutChart",$Current_Month_Collections_Percentage+'%',$data);

			},$timing);

			/******* AnnualMonthlySubscriptionsPieChart old ***************

				$Total_Annual_Expected_Percentage = (filteredMonthExpenses[0].Total_Annual_Expected * 100) / filteredMonthExpenses[0].Total_Monthly_Annual_Expected;
				$Total_Monthly_Expected_Percentage  = (filteredMonthExpenses[0].Total_Monthly_Expected * 100) / filteredMonthExpenses[0].Total_Monthly_Annual_Expected;

				$("#Total_Monthly_Annual_Expected").html(filteredMonthExpenses[0].Total_Monthly_Annual_Expected );

				$(".Total_Monthly_Expected").html(filteredMonthExpenses[0].Total_Monthly_Expected);
				$(".Total_Annual_Expected").html(filteredMonthExpenses[0].Total_Annual_Expected);

				$("#Total_Monthly_Expected_Percentage").html(Math.round(parseFloat($Total_Monthly_Expected_Percentage))+"%");
				$("#Total_Annual_Expected_Percentage").html(Math.round(parseFloat($Total_Annual_Expected_Percentage))+"%");
				
				setTimeout(()=>{
					$data = {
						labels: ['#b5eac9', '#a8dfff'],
						datasets: [{
							label: 'AnnualMonthlySubscriptionsPieChart',
							data: [$Total_Annual_Expected_Percentage, $Total_Monthly_Expected_Percentage],
							backgroundColor: [
								'#b5eac9',
								'#a8dfff'
							],
							borderColor: [
								'#b5eac9',
								'#a8dfff'
							],
							borderWidth: 1
						}],
						colors:['#151a3b', '#151a3b'],
						type:'doughnut',//Pie
						cutout:$cutout,
						percentage:0 // back to later 
					};

					ChartJSPie("AnnualMonthlySubscriptionsPieChart",$data);

				},$timing);

			/******* End AnnualMonthlySubscriptionsPieChart old ***************/

			/******* AnnualMonthlySubscriptionsPieChart ***************/
				
				setTimeout(()=>{

					var $data  = {};
					var $percentage100Array = [];
					var $total = 0;
					
					for(p = 1 ; p <= 10 ; p++ ){
						$percentage100Array.push(p*10);
					}
	
					var $expense_Labels = [];
					var $expense_Count_Cost = [];
					var $expense_Count_Cost_Array = [];
					var $expense_Colors = [];
	
					var filtred_Yearly_Total_Revenu_Grouped_By_Expenses =  filteredMonthExpenses[0].Yearly_Total_Revenu_Grouped_By_Expenses.filter(exp => {
						return exp.SS_Status == 1 ;
					});
	
					filtred_Yearly_Total_Revenu_Grouped_By_Expenses.map((exp)=>{
						$total  += exp.Count_Cost;
					});
	
					filtred_Yearly_Total_Revenu_Grouped_By_Expenses.map((expense)=>{
						$expense_Labels.push(expense.Expense_Label);
						$expense_Colors.push(expense.Expense_Color);
						var percentage = (( expense.Count_Cost * 100 ) / $total );
						$expense_Count_Cost.push(percentage);
						$expense_Count_Cost_Array.push(expense.Count_Cost);
					});
	
					$Total_Annual_Expected_Percentage = (filteredMonthExpenses[0].Total_Annual_Expected * 100) / filteredMonthExpenses[0].Total_Monthly_Annual_Expected;
					$Total_Monthly_Expected_Percentage  = (filteredMonthExpenses[0].Total_Monthly_Expected * 100) / filteredMonthExpenses[0].Total_Monthly_Annual_Expected;
	
					$("#Total_Monthly_Annual_Expected").html(filteredMonthExpenses[0].Total_Monthly_Annual_Expected );
					$(".Total_Monthly_Expected").html(filteredMonthExpenses[0].Total_Monthly_Expected);
					$(".Total_Annual_Expected").html(filteredMonthExpenses[0].Total_Annual_Expected);
					
					
					$data = {
						labels: $expense_Labels ,
						datasets: [{
							label: 'AnnualMonthlySubscriptionsPieChart',
							data: $expense_Count_Cost,
							backgroundColor: $expense_Colors,
							borderColor: $expense_Colors,
							borderWidth: 1,
							extra_data:filtred_Yearly_Total_Revenu_Grouped_By_Expenses,
						}],
						colors:['#151a3b', '#151a3b','#151a3b'],
						type:'doughnut',//Pie
						cutout:$cutout,//$cutout,
						percentage:0 // back to later ,
						
						
					};

					ChartJSPieMixed("AnnualMonthlySubscriptionsPieChart",$data);

				},$timing);

			/******* End AnnualMonthlySubscriptionsPieChart ***************/

			/******* AnnualSubscriptionsPieChart ***************/

			$Total_Annual_Paid_Subscriptions_Percentage = (filteredMonthExpenses[0].Annual_Expense_TotalPay * 100) / 
														   filteredMonthExpenses[0].Total_Annual_Expected;

			$("#Total_Annual_Paid_Subscriptions").html(filteredMonthExpenses[0].Annual_Expense_TotalPay);
			$("#Total_Annual_Paid_Subscriptions_Percentage").html(Math.round(parseFloat($Total_Annual_Paid_Subscriptions_Percentage).toFixed(0))+"%");
			
			$("#Total_Annual_UnPaid_Subscriptions").html(filteredMonthExpenses[0].Total_Annual_Expected-filteredMonthExpenses[0].Annual_Expense_TotalPay);

			$Total_Annual_UnPaid_Subscriptions_Percentage = Math.round(parseFloat(100-$Total_Annual_Paid_Subscriptions_Percentage));
			$("#Total_Annual_UnPaid_Subscriptions_Percentage").html(Math.round(parseFloat($Total_Annual_UnPaid_Subscriptions_Percentage).toFixed(0))+"%");

			setTimeout(()=>{
				$data = {
					labels: ['Collections', 'Debt'],
					datasets: [{
						label: 'AnnualSubscriptionsPieChart',
						data: [$Total_Annual_Paid_Subscriptions_Percentage, (100-$Total_Annual_Paid_Subscriptions_Percentage)],
						backgroundColor: [
							'#b5eac9',
							'#f6f6f7'
						],
						borderColor: [
							'#b5eac9',
							'#f6f6f7'
						],
						borderWidth: 1,
						extra_data:filteredMonthExpenses[0],
					}],
					colors: () => {
						if($Total_Annual_Paid_Subscriptions_Percentage <= 0 ){
							return ['#151a3b','transparent'];
						}else{
							return '#151a3b';
						}
						
					},
					type:'pie',
					cutout:$cutout,
					percentage:$Total_Annual_Paid_Subscriptions_Percentage // back to later 
				};

				ChartJSPie("AnnualSubscriptionsPieChart",$data);

			},$timing);

			/******* End AnnualSubscriptionsPieChart ***************/

			/******* MonthlySubscriptionsPieChart ***************/

			$Total_Monthly_Paid_Subscriptions_Percentage = (filteredMonthExpenses[0].Total_Monthly_Paid_Subscriptions * 100) / 
															filteredMonthExpenses[0].Total_Monthly_Expected;

			$("#Total_Monthly_Paid_Subscriptions").html(filteredMonthExpenses[0].Total_Monthly_Paid_Subscriptions);
			$("#Total_Monthly_Paid_Subscriptions_Percentage").html(Math.round(parseFloat($Total_Monthly_Paid_Subscriptions_Percentage).toFixed(0))+"%");

			$("#Total_Monthly_UnPaid_Subscriptions").html(filteredMonthExpenses[0].Total_Monthly_Expected - filteredMonthExpenses[0].Total_Monthly_Paid_Subscriptions);

			$Total_Monthly_UnPaid_Subscriptions_Percentage = Math.round(parseFloat(100-$Total_Monthly_Paid_Subscriptions_Percentage));
			$("#Total_Monthly_UnPaid_Subscriptions_Percentage").html(Math.round(parseFloat($Total_Monthly_UnPaid_Subscriptions_Percentage).toFixed(0))+"%");

			setTimeout(()=>{
				$data = {
					labels: ['Collections', 'Debt'],
					datasets: [{
						label: 'MonthlySubscriptionsPieChart',
						data: [$Total_Monthly_Paid_Subscriptions_Percentage, (100-$Total_Monthly_Paid_Subscriptions_Percentage)],
						backgroundColor: [
							'#a8dfff',
							'#f6f6f7'
						],
						borderColor: [
							'#a8dfff',
							'#f6f6f7'
						],
						color: [
							'#a8dfff',
							'#f6f6f7'
						],
						borderWidth: 1,
						extra_data:filteredMonthExpenses[0],
					}],
					colors: () => {
						if($Total_Monthly_Paid_Subscriptions_Percentage <= 0 ){
							return ['#151a3b','transparent'];
						}else{
							return '#151a3b';
						}
						
					},
					type:'pie',
					cutout:$cutout,
					percentage:$Total_Monthly_Paid_Subscriptions_Percentage // back to later 
				};

				ChartJSPie("MonthlySubscriptionsPieChart",$data);

			},$timing);

			/******* End MonthlySubscriptionsPieChart ***************/

			// yearly chart 
			//$data.data = [filteredMonthExpenses[0].Annual_Expense_Cost_Percentage,(100 - (filteredMonthExpenses[0].Annual_Expense_Cost_Percentage * 1))];
			//ChartJSDonut("yearlyDonutChart",filteredMonthExpenses[0].Annual_Expense_Cost_Percentage+'%',$data);

			var $MonthDaysRangeIncomesAccumulation =  [];
			var $MonthDaysRangeExpectedIncomes=  [];
			var $MonthDaysRangeIncomesAccumulationInit = 0;

			for(Acc = 0 ; Acc < filteredMonthExpenses[0].MonthDaysRangeIncomes.length ; Acc++){

				$MonthDaysRangeDate = new Date(filteredMonthExpenses[0].MonthDaysRange[Acc]);

				$MonthDaysRangeIncomesAccumulationInit += filteredMonthExpenses[0].MonthDaysRangeIncomes[Acc]+filteredMonthExpenses[0].AnnualDaysRangeIncomes[Acc];
				$MonthDaysRangeIncomesAccumulation.push($MonthDaysRangeIncomesAccumulationInit);
				$MonthDaysRangeExpectedIncomes.push(filteredMonthExpenses[0].Monthly_Expected_Incomes+filteredMonthExpenses[0].Annual_Expected_Incomes);

				if((today.getMonth() + 1) == selectedMonth 
				&& ((selectedMonth+'/'+today.getDate()  ) == ($MonthDaysRangeDate.getMonth() + 1)+'/'+$MonthDaysRangeDate.getDate() )){
					break
				}

			}

			setTimeout(()=>{
				var $data = {
					labels: filteredMonthExpenses[0].MonthDaysRangeNumbers,
					datasets: [
					{
					label: 'Incomes',
					type: "line",
					borderColor: "#9BF1BB",//92ddff
					backgroundColor:"transparent",
					data: $MonthDaysRangeIncomesAccumulation,
					lineTension: 0,      
					extra_data:filteredMonthExpenses[0],
					stepped: true
					},
					{
					label: 'Expected',
					type: "line",
					borderColor: "#a8dfff", //"rgba(21, 26, 59, 0.3)"
					backgroundColor:"transparent",
					data: $MonthDaysRangeExpectedIncomes,
					lineTension: 0 ,
					extra_data:filteredMonthExpenses[0],
					stepped: true
				},
				]
				};
				
				ChartJSLines("monthDailyLineChart",$data);

			},$timing);

			var $data  = {};

			var $monthAbbrv = [];
			var $monthly_Annual_Expense_TotalPay = [];
			var $monthly_Expense_Cost = [];

			DashboardAllData.MonthsExpenses.map((MonthExpenses)=>{
				$monthAbbrv.push( arrLang[$lang][String(MonthExpenses.Month).substring(0,3)]);
				$monthly_Annual_Expense_TotalPay.push(MonthExpenses.Monthly_Expense_TotalPay+MonthExpenses.Annual_Expense_TotalPay_Per_Month);
				$monthly_Expense_Cost.push(MonthExpenses.Monthly_Expected_Incomes+MonthExpenses.Annual_Expected_Incomes);
			});

			setTimeout(()=>{
				$data = {
					labels: $monthAbbrv,
					type: 'bar',
					datasets: [{
						type: 'bar',
						label: arrLang[$lang]["Incomes"],
						data: $monthly_Annual_Expense_TotalPay,
						fill: true,
						backgroundColor: '#a2e2ba',
						borderWidth: 1,
						borderColor: '#a2e2ba',
						hoverBackgroundColor: '#a2e2ba',
						hoverBorderColor: '#a2e2ba',
						//stack: 'Expenditures'
						}, 
						{
						type: 'bar',
						label: arrLang[$lang]["Expected"],
						data: $monthly_Expense_Cost,
						fill: true,
						backgroundColor: '#f6f6f7',
						borderWidth: 1,
						borderColor: '#f6f6f7',
						hoverBackgroundColor: '#f6f6f7',
						hoverBorderColor: '#f6f6f7',
						//stack: 'Expenditures'
						},
						/*{
							label: 'Expected',
							type: "line",
							borderColor: "#92ddff", //"rgba(21, 26, 59, 0.3)"
							backgroundColor:"transparent",
							data: $monthly_Expense_Cost,
							lineTension: 0
						}*/
					]
				};

				ChartJSMixedBars("yearlyExpencesIncomesBarChart",$data);

			},$timing);


		    var $data  = {};
			var $percentage100Array = [];
			var $total = 0;
			
			for(p = 1 ; p <= 10 ; p++ ){
				$percentage100Array.push(p*10);
			}

			var $expense_Labels = [];
			var $expense_Count_Cost = [];
			var $expense_Count_Cost_Array = [];
			var $expense_Colors = [];

			filteredMonthExpenses[0].Yearly_Total_Revenu_Grouped_By_Expenses.map((exp)=>{
				$total  += exp.Count_Cost;
			});

			filteredMonthExpenses[0].Yearly_Total_Revenu_Grouped_By_Expenses.map((expense)=>{
				$expense_Labels.push(expense.Expense_Label);
				$expense_Colors.push(expense.Expense_Color);
				var percentage = (( expense.Count_Cost * 100 ) / $total );
				$expense_Count_Cost.push(percentage);
				$expense_Count_Cost_Array.push(expense.Count_Cost);
			});

			setTimeout(()=>{

				$data = {
					labels: $expense_Labels ,
					type: 'bar',
					datasets: [
						{
						type: 'bar',
						label: $expense_Labels,
						data: $expense_Count_Cost ,
						fill: true,
						backgroundColor:$expense_Colors,
						borderWidth: 1,
						borderColor: $expense_Colors,
						hoverBackgroundColor: $expense_Colors,
						hoverBorderColor:$expense_Colors,
						extra_data:filteredMonthExpenses[0],

						barThickness:38,
						barPercentage: 1.0,
    					categoryPercentage: 1.0,
						
						}
					],
					colors:'#151a3b'
				};

				ChartJSBars("AnnualMonthlySubscriptionsBarChart",$data,'y');

			},$timing);

			
			/*

			var $data  = {};

			var $percentage100Array = [];
			
			for(p = 1 ; p <= 10 ; p++ ){
				$percentage100Array.push(p*10);
			}

			var $expense_Labels = [];
			var $expense_Count_Cost = [];

			filteredMonthExpenses[0].Yearly_Total_Revenu_Grouped_By_Expenses.map((expense)=>{
				$expense_Labels.push(expense.Expense_Label);
				$expense_Count_Cost.push(expense.Count_Cost);
			});

			setTimeout(()=>{

				$data = {
					labels: ['#d2ebdc','#d8e9ff','#f5caca'],
					datasets: [{
						label: 'AnnualMonthlySubscriptionsBarChart',
						data: [10,30,60],
						backgroundColor:['#d2ebdc','#d8e9ff','#f5caca'],
						borderColor: ['#d2ebdc','#d8e9ff','#f5caca'],
						borderWidth: 1
					}],
					colors:'#151a3b',
					type:'pie',
					percentage:$Total_Annual_Paid_Subscriptions_Percentage // back to later 
				};

				ChartJSPie("AnnualMonthlySubscriptionsBarChart",$data);

			},$timing);

			*/



			removeLoadingAnimation(".dashboard-card-info",null);
			removeLoadingAnimation(".dashboard-card-table-info-container",null);

	  	}

		  

	  });
}

function filterDashboardData(filter_by_month_id){

		$(".monthly-financal-selected-month").html(arrLang[$lang][months[(filter_by_month_id*1-1)]]);

		var filteredMonthExpenses = DashboardAllData.MonthsExpenses.filter(monthsExpenses => {
			return monthsExpenses.Month == months[(filter_by_month_id*1-1)];
		});

		var $MonthDaysRangeIncomesAccumulation =  [];
		var $MonthDaysRangeExpectedIncomes=  [];
		var $MonthDaysRangeIncomesAccumulationInit = 0;

		for(Acc = 0 ; Acc < filteredMonthExpenses[0].MonthDaysRangeIncomes.length ; Acc++){
			$MonthDaysRangeIncomesAccumulationInit += filteredMonthExpenses[0].MonthDaysRangeIncomes[Acc]+filteredMonthExpenses[0].AnnualDaysRangeIncomes[Acc];
			$MonthDaysRangeIncomesAccumulation.push($MonthDaysRangeIncomesAccumulationInit);
			$MonthDaysRangeExpectedIncomes.push(filteredMonthExpenses[0].Monthly_Expected_Incomes+filteredMonthExpenses[0].Annual_Expected_Incomes);
		}

		var $data = {
			labels: filteredMonthExpenses[0].MonthDaysRangeNumbers,
			datasets: [
			{
			   label: 'Incomes',
			   type: "line",
			   borderColor: "#9BF1BB",//92ddff
			   backgroundColor:"transparent",
			   data: $MonthDaysRangeIncomesAccumulation,
			   lineTension: 0,      
			   extra_data:filteredMonthExpenses[0],
			   stepped: true
			},
			{
			  label: 'Expected',
			  type: "line",
			  borderColor: "#92ddff", //"rgba(21, 26, 59, 0.3)"
			  backgroundColor:"transparent",
			  data: $MonthDaysRangeExpectedIncomes,
			  lineTension: 0 ,
			  extra_data:filteredMonthExpenses[0],
			  stepped: true
		   },
		  ]
		};

		ChartJSLines("monthDailyLineChart",$data);
		
}


/******* End getDashboardAllData ***********/



