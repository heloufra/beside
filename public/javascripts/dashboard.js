var absencesT,absencesS,Payments = [];
var absenceArray = ["Retard","Absence"];
var months =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octobre", "November", "December"];
var StudentSub = [];
var today = new Date();
var currentDate = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
var maxChart = 0;
getAbsences();
getPayments();

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
	  		console.log("Payments",Payments)
	  		StudentSub = res.studentsSub;
	  		for (var i = StudentSub.length - 1; i >= 0; i--) {
	  			//if (StudentSub[i].Expense_PaymentMethod === 'Monthly'){
	  				maxChart += parseInt(StudentSub[i].Expense_Cost);
	  			//}
	  		}
	  		console.log("Payments",Payments)
	  		ChartJS(today.getMonth(),today.getFullYear());
	  		var filtred = Payments.filter(payment => {
				var date = new Date(payment.SP_Addeddate)
				return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
			})
	  		displayPayments(filtred);
	  	}
	  });
}

function displayPayments(payments) 
{
	var result = [];
	var subScription = [];
	$('#list-payments').find('.row-payments').remove();

	console.log('StudentSub',StudentSub);
	for (var i = StudentSub.length - 1; i >= 0; i--) {
		if (!subScription[StudentSub[i].Student_ID]){
			subScription[StudentSub[i].Student_ID] = {Student_ID:StudentSub[i].Student_ID,Expense_Cost:0};
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
	console.log('subScription',subScription);
	var tempDate;
	payments.forEach(function (a) {
		tempDate = new Date(a.SP_Addeddate);
	    if (!this[a.Student_ID+ '-' +tempDate.toDateString()]) {
	        this[a.Student_ID+ '-'  +tempDate.toDateString()] = { Student_ID: a.Student_ID, Expense_Cost: 0,SP_Addeddate:a.SP_Addeddate,Student_Image:a.Student_Image,Student_FirstName:a.Student_FirstName,Student_LastName:a.Student_LastName,Classe_Label:a.Classe_Label };
	        result.push(this[a.Student_ID+ '-'  +tempDate.toDateString()]);
	    }
    	this[a.Student_ID+ '-'  +tempDate.toDateString()].Expense_Cost += parseInt(a.Expense_Cost);
	}, Object.create(null));
	Payments.forEach(function (a) {
	    subScription[a.Student_ID].Expense_Cost -= parseInt(a.Expense_Cost);
	}, Object.create(null));
	for (var i = 0; i <= result.length - 1; i++) {
		var $date = dateConvertSlashes(result[i].SP_Addeddate);
		$('#list-payments').append('<tr class="row-payments"> <td data-label="Student"> <!-- sections-main-sub-container-left-cards --> <div class="sections-main-sub-container-left-card"> <img class="sections-main-sub-container-left-card-main-img" src="'+result[i].Student_Image+'" alt="card-img"> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+result[i].Student_FirstName + ' ' + result[i].Student_LastName +'</p> <span class="sections-main-sub-container-left-card-sub-info">'+ result[i].Classe_Label +'</span> </div> </div> <!-- End sections-main-sub-container-left-cards --> </td> <td class="readonly" data-label="Date"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+ $date +'" class="input-text" required="" placeholder="Date"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> </td> <td class="readonly" data-label="Paid amount"> <div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="'+ result[i].Expense_Cost +'" class="input-text input-text-blue" required="" placeholder="Paid amount"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> </div> </td> <td class="readonly" data-label="Outstanding"> <div class="form-group group dynamic-form-input-text-container-icon"> '+(subScription[result[i].Student_ID].Expense_Cost <= 0 ?('<img src="assets/icons/green_check.svg" alt="green_check">') : ('<input type="text" value="'+subScription[result[i].Student_ID].Expense_Cost+'" class="input-text" required="" placeholder="Outstanding">'))+' </div> </td> </tr> ')
	}
}

function displayTAbsences(Tabsences) 
{
	  console.log("Tabsences",Tabsences);

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
	if ($('input[data-name=Teacher]').is(':checked'))
		displayTAbsences(filtredT);
    else
    	$('#absence-list').find('.row-teacher').remove();
    if ($('input[data-name=Student]').is(':checked'))
         displaySAbsences(filtredS);
    else
    	$('#absence-list').find('.row-student').remove();
 });

$('input[name=filter-finance]').change(function () {
	var filtred;
	if (this.value.replace(/\s/g, ''))
	{
		filtred = Payments.filter(payment => {
			var date = new Date(payment.SP_Addeddate);
			return date.getMonth() === ($(this).attr("data-id")*1 - 1 ) ;
		});

		$year = String($(this).attr("data-start-date")).split('-');
		ChartJS(($(this).attr("data-id") * 1 - 1 ) , $year[0]);

	}
})

$('input[name=filter-payments]').change(function () {
	var filtred;
	if (this.value.replace(/\s/g, ''))
	{
		if (this.value === 'Today')
		{
			filtred = Payments.filter(payment => {
				var date = new Date(payment.SP_Addeddate)
				return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
			})
		} else if (this.value === 'This year')
		{
			filtred = Payments.filter(payment => {
				var date = new Date(payment.SP_Addeddate);
				return date.getFullYear() === today.getFullYear();
			})
		}else if (this.value === 'This Month')
		{
			filtred = Payments.filter(payment => {
				var date = new Date(payment.SP_Addeddate);
				return date.getMonth() === today.getMonth();
			})
		}

		displayPayments(filtred || []);
	}
})

	/* Chart.js _______________________________________________*/


function randomData(month_ID,Year){

		$chartData = [];
		$filtreDate = [];

		days = monthDays((month_ID*1+1),Year);
		console.log("days",days);

		for(d=1;d<=days;d++){

			$obj = {};

			$filtreDate = Payments.filter(payment => {
				var temp = new Date(payment.SP_Addeddate);
				var mois = months.indexOf(payment.SP_PaidPeriod);
				console.log("temp.getDate()" , temp.getDate() +" d "+ d +" mois "+mois+" month_ID "+month_ID+" payment.SP_PaidPeriod "+payment.SP_PaidPeriod);
				return (temp.getDate() === d && mois === month_ID ) || ( temp.getDate() === d  && temp.getMonth() == month_ID && temp.getFullYear() == Year)   ;
			})

			$obj.paymentCount  = 0;
			$obj.y = 0;

			console.log("$filtreDate",$filtreDate);

			for (var i = $filtreDate.length - 1; i >= 0; i--) {
				$obj.paymentCount  += 1;
				$obj.y 			  += parseInt($filtreDate[i].Expense_Cost);
			}

			$chartData.push($obj);
		}

		console.log("$chartData",$chartData);

		return $chartData;

}

function ChartJS(month_ID,Year) {
	
	$chartDays = [];

	days = monthDays((month_ID*1+1),Year);
	console.log("days",days);

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
					data: randomData(month_ID,Year)
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




