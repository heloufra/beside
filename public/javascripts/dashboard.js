var absencesT,absencesS,Payments,StudentMonthlySubscriptions, DashboardAllData = [] , $Monthly_Expenses_Total_Paid = 0;
var absenceArray = ["Retard","Absence"];
var months =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var StudentSub = [];
var today = new Date();
var currentDate = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
var maxChart = 0;
var selectedMonth = (today.getMonth() + 1);


$cutout="62%";
$layoutPadding = 3 ;

$(document).ready(() => {
	const date = new Date(Date.now());
	let Month_ID = (today.getMonth() + 1);
	getAbsences();
	getPayments(Month_ID);
});

$timing = 1250;

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

function getPayments(Month_ID)
{
	addLoadingAnimation(".dashboard-card-info",null);
	addLoadingAnimation(".dashboard-card-table-info-container",null);
	$.ajax({
	    type: 'post',
		url: '/Dashboard/payments',
		data:{"Month_ID":Month_ID},
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
					//maxChart += parseInt(StudentSub[i].Expense_Cost);
				}
			}
			getDashboardAllData();
	  	}
	});
}

function getPaymentsFilter(Month_ID)
{
	$.ajax({
	    type: 'post',
		url: '/Dashboard/payments/',
		data:{"Month_ID":Month_ID},
	    dataType: 'json'
	  })
	  .done(function(res){
	  	if(res.errors)
		{
			console.log("res err",res.errors);
		} else {
	  		Payments = res.payments;
			StudentMonthlySubscriptions = res.studentMonthlySubscriptions ;
	  		StudentSub = res.studentsSub;
			displayPayments(Month_ID);
	  	}
	});
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

	if (StudentMonthlySubscriptionsFiltred.length > 0) {
		
		
		for (i = 0; i < StudentMonthlySubscriptionsFiltred[0].StudentsPaymentsList.length; i++){


			(function (StudentMonthlySubscriptionsFiltred, i) {
					
					setTimeout(() => {
						result = StudentMonthlySubscriptionsFiltred[0].StudentsPaymentsList[i];
						var $date = dateConvertSlashes(result.SP_Addeddate);
						StudentMonthlySubscription = StudentMonthlySubscriptionsFiltred[0].StudentsPaymentsList[i];
						

					var $row = `<tr class="row-payments"> 

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

									<td class="readonly" data-label="Paid month"> 
										<div class="form-group group dynamic-form-input-text-container-icon"> 
											<input type="text" value="`+ ((result.Expense_PaymentMethod == 'Monthly' ) ? arrLang[$lang][result.SP_PaidPeriod] : result.SP_PaidPeriod ) +`" class="input-text" required="" placeholder="Paid Month">
										</div>
									</td>

									<td class="readonly" data-label="Paid amount">
										<div class="form-group group dynamic-form-input-text-container-icon"> <input type="text" value="`+ result.Expense_Cost +` Dhs" class="input-text input-text-green" required="" placeholder="Paid amount"> <img class="icon button-icon caret-disable-rotate" src="assets/icons/date_icon.svg"> 
										</div>
									</td> 

									<td data-label="Paid Subscriptions"> 
										<div class="sections-main-sub-container-left-card">
										<div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">`+result.Expense_Label+`</p> <span class="sections-main-sub-container-left-card-sub-info">`+ arrLang[$lang][result.Expense_PaymentMethod] +`</span>
										</div> 
										</div>
									</td>
								</tr> `;

						$('#list-payments').append($row);

					}, 2.5 );
			})(StudentMonthlySubscriptionsFiltred, i);
		}

	}

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

$('input[name=filter-payments_current]').change(function () {
	
	var $this = $(this);
	
	if (String($this.attr("data-val")).replace(/\s/g, '')) {
		var index = months.indexOf($this.attr("data-val"));
		//getPaymentsFilter((index + 1))
		displayPayments((index+1));
		$this.attr("data-lang", arrLang[$lang][$this.attr("data-val")]);
	}
});


$('input[name=filter-payments]').change(function () {

	var $this = $(this);
	
	if (String($this.attr("data-val")).replace(/\s/g, ''))
	{
		var index = months.indexOf($this.attr("data-val"));
		//displayPayments((index+1));
		$this.attr("data-lang",arrLang[$lang][$this.attr("data-val")]);
	}

	
})


$(document).on("click",".dynamic-form-input-dropdown-options li",function () {
	
	var $this = $(this);
	var index = months.indexOf($this.attr("data-val"));
	displayPayments((index+1));
	//getPaymentsFilter((index + 1));

});

/* Chart.js _______________________________________________*/


function randomData(month_ID,Year){

		$chartData = [];
		$filtreDate = [];

		days = monthDays((month_ID*1+1),Year);

		for(d=1;d<=days;d++){

			$obj = {};

			$filtreDate = Payments.filter(payment => {
				var temp = new Date(payment.SP_Addeddate);
				var mois = months.indexOf(payment.SP_PaidPeriod);
				return (temp.getDate() === d && mois === month_ID ) || ( temp.getDate() === d  && temp.getMonth() == month_ID && temp.getFullYear() == Year)   ;
			})

			$obj.paymentCount  = 0;
			$obj.y = 0;

			for (var i = $filtreDate.length - 1; i >= 0; i--) {
				$obj.paymentCount  += 1;
				$obj.y 			  += parseInt($filtreDate[i].Expense_Cost);
			}

			$chartData.push($obj);
		}

		return $chartData;

}

function ChartJS(month_ID,Year) {
	
	$chartDays = [];

	days = monthDays((month_ID*1+1),Year);

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
									percentage = ctx.dataset.data[ctx.dataIndex] < 100 ? 
									((parseFloat(ctx.dataset.data[ctx.dataIndex]).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, '')) % 10 == 0 ? 
									parseFloat(ctx.dataset.data[ctx.dataIndex]).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, '').replace(/^0*(\d+)(\.0*)?$/, '') : parseFloat(ctx.dataset.data[ctx.dataIndex]).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, '') )
									: 100 ;

									if(ctx.chart.canvas.id == "AnnualMonthlySubscriptionsPieChart"){
										
										if( ctx.label == "Debt"){
											/*amount = (ctx.dataset.extra_data.Total_Monthly_Annual_Expected) - 
													 (ctx.dataset.extra_data.Annual_Expense_TotalPay + ctx.dataset.extra_data.Monthly_Expense_TotalPay) ;*/
											amount = (ctx.dataset.extra_data.Total_Monthly_Annual_Expected) - 
													 (ctx.dataset.extra_data.Annual_Expense_TotalPay + $Monthly_Expenses_Total_Paid) ;
										}else{
											//amount = (ctx.dataset.extra_data.Annual_Expense_TotalPay + ctx.dataset.extra_data.Monthly_Expense_TotalPay)  ;
											amount = (ctx.dataset.extra_data.Annual_Expense_TotalPay + $Monthly_Expenses_Total_Paid)  ;
										}

										label = percentage +"% ~ "+amount+" Dhs ";
										
									}else if(ctx.chart.canvas.id == "AnnualSubscriptionsPieChart"){

										if( ctx.label == "Debt"){
											amount = (ctx.dataset.extra_data.Total_Annual_Expected - ctx.dataset.extra_data.Annual_Expense_TotalPay) ;
										}else{
											amount = ctx.dataset.extra_data.Annual_Expense_TotalPay   ;
										}

										label = percentage +"% ~ "+amount+" Dhs ";

									}else if(ctx.chart.canvas.id == "MonthlySubscriptionsPieChart"){

										if( ctx.label == "Debt"){
											amount = (ctx.dataset.extra_data.Total_Monthly_Expected - ctx.dataset.extra_data.Total_Monthly_Paid_Subscriptions) ;
										}else{
											amount = ctx.dataset.extra_data.Total_Monthly_Paid_Subscriptions ;
										}	
										
										label = percentage +"% ~ "+amount+" Dhs ";
									
									}else if(ctx.chart.canvas.id == "teacherDonutChart"){

										if( ctx.label == "Presences"){
											var Absences = (ctx.dataset.extra_data.teachersTotal - ctx.dataset.extra_data.teacherAdAbsences) ;
											label = percentage +"% ~ "+Absences+" "+((Absences >=2 ) ? arrLang[$lang]["Presences"] : arrLang[$lang]["Presence"] );
										}else{
											var Absences = ctx.dataset.extra_data.teacherAdAbsences ;
											label = percentage +"% ~ "+Absences+" "+((Absences >=2 ) ? arrLang[$lang]["Absences"] : arrLang[$lang]["Absence"] );
										}

									}else if(ctx.chart.canvas.id == "studentDonutChart"){

										if( ctx.label == "Presences"){
											var Absences = (ctx.dataset.extra_data.studentsTotal - ctx.dataset.extra_data.studentAdAbsences) ;
											label = percentage +"% ~ "+Absences+" "+ ((Absences >=2 ) ? arrLang[$lang]["Presences"] : arrLang[$lang]["Presence"] );
										}else{
											var Absences = ctx.dataset.extra_data.studentAdAbsences ;
											label = percentage +"% ~ "+Absences+" "+((ctx.dataset.extra_data.studentAdAbsences >=2 ) ? arrLang[$lang]["Absences"] : arrLang[$lang]["Absence"] );
										}

										

									}else{
										if( ctx.label == "Debt"){
											amount = (ctx.dataset.extra_data.Monthly_Expected_Incomes + ctx.dataset.extra_data.Annual_Expected_Incomes) - 
												(ctx.dataset.extra_data.Month_Expense_TotalPay_Per_Month+ctx.dataset.extra_data.Annual_Expense_TotalPay_Per_Month);
										}else{
											amount = ctx.dataset.extra_data.Monthly_Expense_TotalPay + ctx.dataset.extra_data.Annual_Expense_TotalPay_Per_Month ;
										}

										label = percentage +"% ~ "+amount+" Dhs ";
									}

									

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
						var fontSize = (height / 80 ).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, '');
						ctx.font = (fontSize) + "em sans-serif";
						ctx.textBaseline = "middle";
					
						var text = $percentage,
							textX = ((width - ctx.measureText(text).width) / 2),
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
								let percentage = (value*100 / sum).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, '')+"%";
								return percentage;
							},
							color: $data.colors,
							font: function (context) {
								var avgSize = ((context.chart.height ) / 8 );
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
									percentage = (parseFloat(ctx.dataset.data[ctx.dataIndex]));

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
								let percentage = (value*100 / sum).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, '')+"%";
								return percentage;
							},
							color: $data.colors,
							font: function (context) {
								var avgSize = ((context.chart.height ) / 8 );
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
										
										percentage = (parseFloat(percentage));
			
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
							}else if($maxChart <= 10000){
								lastDigits= $maxChart % 1000;
								//return (lastDigits * 1) < 100 ? (($maxChart - (100 - ($maxChart % 100) )) + 1000) : ($maxChart + 1000)
								return  (($maxChart - lastDigits)  + 1000)
							}else{
								lastDigits= $maxChart % 1000;
								//return (lastDigits * 1) < 100 ? (($maxChart - (100 - ($maxChart % 100) )) + 1000) : ($maxChart + 1000)
								return  (($maxChart - lastDigits)  + 10000)
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

		function ChartJSMixedBars($elem,$data,$stackedX,$stackedY) {

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
					x: { barPercentage: 1.0 , stacked:$stackedX },
					y: { 
						min: 0,
						stacked : $stackedY, 
						max: (ctx) => {

							if(ctx.chart.canvas.id == "yearlyExpencesIncomesBarChart"){

								if($maxChart <= 1000){
									lastDigits= $maxChart % 100;
									return (lastDigits * 1) < 100 ? ($maxChart + (100 - ($maxChart % 100) )) : ($maxChart + 100)
								}else if($maxChart <= 10000){
									lastDigits= $maxChart % 1000;
									//return (lastDigits * 1) < 100 ? (($maxChart - (100 - ($maxChart % 100) )) + 1000) : ($maxChart + 1000)
									return  (($maxChart - lastDigits)  + 1000)
								}else{
									lastDigits= $maxChart % 1000;
									//return (lastDigits * 1) < 100 ? (($maxChart - (100 - ($maxChart % 100) )) + 1000) : ($maxChart + 1000)
									return  (($maxChart - lastDigits)  + 10000)
								}

							}

							if(ctx.chart.canvas.id == "MonthlySubscriptionsRevenusBarChart"){

								if($maxChart <= 1000){
									lastDigits= $maxChart % 100;
									return (lastDigits * 1) < 100 ? ($maxChart + (100 - ($maxChart % 100) )) : ($maxChart + 100)
								}else if($maxChart <= 10000){
									lastDigits= $maxChart % 1000;
									//return (lastDigits * 1) < 100 ? (($maxChart - (100 - ($maxChart % 100) )) + 1000) : ($maxChart + 1000)
									return  (($maxChart - lastDigits)  + 1000)
								}else{
									lastDigits= $maxChart % 1000;
									//return (lastDigits * 1) < 100 ? (($maxChart - (100 - ($maxChart % 100) )) + 1000) : ($maxChart + 1000)
									return  (($maxChart - lastDigits)  + 10000)
								}

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
								if (legendItem.datasetIndex > 0){ return true };
							}
						}
					},
					tooltip:{
						
						callbacks: {


							title: function(context) {

								$title = "";

								context = context[0];

								if(context.chart.canvas.id == "MonthlySubscriptionsRevenusBarChart"){

									if(context.dataset.chartType =="bar"){
										$title = context.label +" - "+ context.dataset.label;
									}else{
										$title = context.label;
									}

									
								}else{
									$title = context.label;
								}
								
								return $title ;
								
							},

							label: function(context) {

								$label = "";

								if(context.chart.canvas.id == "yearlyExpencesIncomesBarChart"){
									if(context.dataset.label == 'Expected'){
										$label = context.dataset.label+" : "+context.raw+" Dhs";
									}else{
										$label = context.dataset.label+" : "+context.raw+" Dhs";
									}
									return $label;
								}

								if(context.chart.canvas.id == "MonthlySubscriptionsRevenusBarChart"){

									if(context.dataset.statusType == 'Expected'){
										if(context.dataset.chartType =="bar"){
											$label = " "+arrLang[$lang][context.dataset.statusType]+" : "+context.raw+" Dhs";
										}else{
											$label = " "+arrLang[$lang][context.dataset.statusType]+" : "+context.raw+" Dhs";
										}
									}else{
										if(context.dataset.chartType =="bar"){
											$label = " "+arrLang[$lang][context.dataset.statusType]+" : "+context.raw+" Dhs";
										}else{
											$label = " "+arrLang[$lang][context.dataset.statusType]+" : "+context.raw+" Dhs";
										}
									}
									
									return $label;
								}


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

		function ChartJSBars($elem,$data,$indexAxis='x',$stakedX=false,$stakedY=false,$displayDatalabels=true,$displayYAxis=false,$displayXAxis=true,$tickXDisplay=true){

			$maxChart = 0;
			//$maxChart = $data.datasets[0].extra_data.Total_Monthly_Annual_Expected;

			ctxChartCanvasId = "";

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
						display:$displayXAxis,
						min: 0,		
						stacked:$stakedX,		
						max: (ctx) => {

							ctxChartCanvasId = ctx.chart.canvas.id ;

							if(ctx.chart.canvas.id == "AnnualMonthlySubscriptionsBarChart"){
								return 100;
							}else{
								return data.expectedTotal;
							}
						},
						ticks: {
							stepSize: () => {
								return 10;
							},
							callback: function(value, index, values) {

								if(ctxChartCanvasId == "AnnualMonthlySubscriptionsBarChart"){
									return value+"%";

								}else if( ctxChartCanvasId == "AnnualMonthlySubscriptionsRevenusBarChart"){
									return value;
								}else if( ctxChartCanvasId == "MonthlySubscriptionsRevenusBarChart"){
									return value;
								}
								else{
									return value;
								}
							},
							display : $tickXDisplay,
							maxTicksLimit:  $tickXDisplay ?  7  : 25
						},

						gridLines: {
							display:  $tickXDisplay,
							drawBorder:  $tickXDisplay,
						},
					},
					y: { 
						display:$displayYAxis,
						stacked:$stakedY,
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


									if(ctx.chart.canvas.id == "AnnualMonthlySubscriptionsBarChart"){

										label = "";
										let total = 0;
										let dataArr = ctx.dataset.data;
										dataArr.map(ep => {
											total += ep;
										});
			
										let percentage = ( (ctx.dataset.data[ctx.dataIndex] * 1) * 100 ) / total ;
										
										percentage = percentage < 100 ?  (parseFloat(percentage).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, '')) : 100 ;
										
										label = percentage +"% ~ "+ctx.dataset.extra_data.Yearly_Total_Revenu_Grouped_By_Expenses[ctx.dataIndex].Count_Cost+" Dhs";
	
										return label;

									}

									if(ctx.chart.canvas.id == "AnnualMonthlySubscriptionsRevenusBarChart"){

										label = "";
										let total = 0;
										let dataArr = ctx.dataset.data;
										dataArr.map(ep => {
											total += ep;
										});
			
										let percentage = ( (ctx.dataset.data[ctx.dataIndex] * 1) * 100 ) / total ;
										percentage = percentage < 100 ?  (parseFloat(percentage).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, '')) : 100 ;

										//return label = percentage +"% ~ "+ctx.dataset.data[ctx.dataIndex]+" Dhs";
										return label = arrLang[$lang][ctx.dataset.statusType]+": "+ctx.dataset.data[ctx.dataIndex]+" Dhs";

									}

									if(ctx.chart.canvas.id == "MonthlySubscriptionsRevenusBarChart"){

										label = "";
										let total = 0;
										let dataArr = ctx.dataset.data;
										dataArr.map(ep => {
											total += ep;
										});
			
										let percentage = ( (ctx.dataset.data[ctx.dataIndex] * 1) * 100 ) / total ;
										percentage = percentage < 100 ?  (parseFloat(percentage).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, '')) : 100 ;

										//return label = percentage +"% ~ "+ctx.dataset.data[ctx.dataIndex]+" Dhs";
										return label = arrLang[$lang][ctx.dataset.statusType]+": "+ctx.dataset.data[ctx.dataIndex]+" Dhs";

									}

								},
						},
						usePointStyle: false

					},
					datalabels: {
						display: $displayDatalabels,
						anchor: function () {
							return 'start';
						},
						align:'end',
						rotation: function (ctx) {
							//return (ctx.dataset.data[ctx.dataIndex] <= 25) ? '-60' : '0'
						},
						formatter: (value, ctx) => {

							if(ctx.chart.canvas.id == "AnnualMonthlySubscriptionsBarChart"){

								label = "";
								let total = 0;
								let dataArr = ctx.dataset.data;
								dataArr.map(ep => {
									total += ep;
								});

								let percentage = ( (ctx.dataset.data[ctx.dataIndex] * 1) * 100 ) / total ;
								
								percentage =  percentage < 100 ? (parseFloat(percentage).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, '')) : 100 ;

								label = " "+percentage +"% : "+ctx.dataset.extra_data.Yearly_Total_Revenu_Grouped_By_Expenses[ctx.dataIndex].Expense_Label;


								return label;
							}

							if(ctx.chart.canvas.id == "AnnualMonthlySubscriptionsRevenusBarChart"){ 

								label = "";
								let total = 0;
								let dataArr = ctx.dataset.data;
								dataArr.map(ep => {
									total += ep;
								});
								
								if(ctx.dataset.statusType == 'Incomes'){

									label = "";
									let total = 0;
									let dataArr = ctx.dataset.data;
									dataArr.map(ep => {
										total += ep;
									});
	
									let percentage = ( (ctx.dataset.data[ctx.dataIndex] * 1) * 100 ) / total ;
									
									percentage =  percentage < 100 ? (parseFloat(percentage).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, '')) : 100 ;
	
									//label = " "+percentage +"% : "+String(ctx.dataset.label[ctx.dataIndex]).replaceAll("_",' ');
									label = " "+String(ctx.dataset.label[ctx.dataIndex]).replaceAll("_",' ');
									
								}
								
								return label;
							}


							if(ctx.chart.canvas.id == "MonthlySubscriptionsRevenusBarChart"){ 

								label = "";
								let total = 0;
								let dataArr = ctx.dataset.data;
								dataArr.map(ep => {
									total += ep;
								});
								
								if(ctx.dataset.statusType == 'Incomes'){

									label = "";
									let total = 0;
									let dataArr = ctx.dataset.data;
									dataArr.map(ep => {
										total += ep;
									});
	
									let percentage = ( (ctx.dataset.data[ctx.dataIndex] * 1) * 100 ) / total ;
									
									percentage =  percentage < 100 ? (parseFloat(percentage).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, '')) : 100 ;
	
									//label = " "+percentage +"% : "+String(ctx.dataset.label[ctx.dataIndex]).replaceAll("_",' ');
									label = " "+String(ctx.dataset.label[ctx.dataIndex]).replaceAll("_",' ');
									
								}
								
								return label;
							}

						},
						color: $data.colors,
						textIndent:10,
						font: function (context) {
							//var avgSize = ((context.chart.height ) / 8 );
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

			/***** Monthly Total Paid *****/
			DashboardAllData.MonthsExpenses.map((exp)=>{
				$Monthly_Expenses_Total_Paid += exp.Monthly_Expense_TotalPay;
			});
			/***** End Monthly Total Paid *****/

			displayPayments(selectedMonth);

			setTimeout(()=>{

				$data = {
					labels: ['Absences', 'Presences'],
					backgroundColor:["#f75e7e","#f1f1f4"],
					hoverBackgroundColor:["#f75e7e","#f1f1f4"],
					data:[],
					extra_data:res
				};

				$student_Percentage = ((res.studentAdAbsences * 100) / res.studentsTotal ) ;
				$teacher_Percentage = isNaN($student_Percentage) ? 0 : $student_Percentage ;
				$student_Percentage = $student_Percentage < 100 ? (parseFloat($student_Percentage).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, '')) : 100 ;

				

				$("#Student_Absence_Percentage").html($student_Percentage+'%');
				$("#Nombre_Student_Absence").html(res.studentAdAbsences);
				$("#Nombre_Student_Absence_Lang").html(
					(res.studentAdAbsences >=2 ) ? arrLang[$lang]["Absences"] : arrLang[$lang]["Absence"] );

				if(res.studentsTotal == 0 ){
					$student_Percentage = 0;
				}

				$data.data = [
					$student_Percentage,
					(($student_Percentage >= 100 ) ?  0 : parseFloat(100 - ($student_Percentage * 1).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, '') ))
				];

				ChartJSDonut("studentDonutChart",res.studentAdAbsences,$data);

			},$timing);

			setTimeout(()=>{

				$data = {
					labels: ['Absences', 'Presences'],
					backgroundColor:["#f75e7e","#f1f1f4"],
					hoverBackgroundColor:["#f75e7e","#f1f1f4"],
					data:[],
					extra_data:res
				};

				$teacher_Percentage = ((res.teacherAdAbsences * 100) / res.teachersTotal) ;
				$teacher_Percentage = isNaN($teacher_Percentage) ? 0 : $teacher_Percentage ;
				$teacher_Percentage = $teacher_Percentage < 100 ?  (parseFloat($teacher_Percentage).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, '')) : 100 ;

				$("#Teacher_Absence_Percentage").html($teacher_Percentage+'%');
				$("#Nombre_Teacher_Absence").html(res.teacherAdAbsences);

				$("#Nombre_Teacher_Absence_Lang").html(
					(res.teacherAdAbsences >=2 ) ? arrLang[$lang]["Absences"] : arrLang[$lang]["Absence"] );

				$data.data = [
					$teacher_Percentage,
					(($teacher_Percentage >= 100 ) ?  0 : (100 - ($teacher_Percentage * 1) ))
				];

				ChartJSDonut("teacherDonutChart",res.teacherAdAbsences,$data);

			},$timing);


			setTimeout(()=>{

				$data = {
					labels: ['Collections', 'Debt'],
					backgroundColor:["#a2e2ba","#f1f1f4"],
					hoverBackgroundColor:["#a2e2ba","#f1f1f4"],
					data:[],
					extra_data:filteredMonthExpenses[0]

				};

				$("#This_Month_Total_Incomes_Expected").html(filteredMonthExpenses[0].Monthly_Expected_Incomes + filteredMonthExpenses[0].Annual_Expected_Incomes);

				$("#This_Month_Collections").html(filteredMonthExpenses[0].Monthly_Expense_TotalPay + filteredMonthExpenses[0].Annual_Expense_TotalPay_Per_Month);

				$("#Total_Month_Debt").html();

				$Current_Month_Collections_Percentage = ((filteredMonthExpenses[0].Month_Expense_TotalPay_Per_Month + 
														filteredMonthExpenses[0].Annual_Expense_TotalPay_Per_Month) * 100) /
														(filteredMonthExpenses[0].Monthly_Expected_Incomes + filteredMonthExpenses[0].Annual_Expected_Incomes);

				$Current_Month_Collections_Percentage = isNaN($Current_Month_Collections_Percentage ) ? 0 : $Current_Month_Collections_Percentage ;

				$Current_Month_Collections_Percentage =  $Current_Month_Collections_Percentage < 100 ? (parseFloat($Current_Month_Collections_Percentage).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, '')) : 100 ;	

				$("#This_Month_Collections_Percentage").html($Current_Month_Collections_Percentage +"%");
				
				$("#Current_Month_Collections_Percentage").html($Current_Month_Collections_Percentage+"%");

				$("#Current_Month_Collections").html(filteredMonthExpenses[0].Month_Expense_TotalPay_Per_Month+filteredMonthExpenses[0].Annual_Expense_TotalPay_Per_Month);

				$Current_Month_Debt_Percentage = ((filteredMonthExpenses[0].Month_Expense_TotalPay_Per_Month + 
														filteredMonthExpenses[0].Annual_Expense_TotalPay_Per_Month) * 100) /
														(filteredMonthExpenses[0].Monthly_Expected_Incomes + filteredMonthExpenses[0].Annual_Expected_Incomes);

				$Current_Month_Debt_Percentage = isNaN($Current_Month_Debt_Percentage ) ? 0 : $Current_Month_Debt_Percentage ;

				$("#Current_Month_Debt").html((filteredMonthExpenses[0].Monthly_Expected_Incomes + filteredMonthExpenses[0].Annual_Expected_Incomes) - 
											(filteredMonthExpenses[0].Month_Expense_TotalPay_Per_Month+filteredMonthExpenses[0].Annual_Expense_TotalPay_Per_Month));

				$("#Current_Month_Debt_Percentage").html(((parseFloat(100 - $Current_Month_Debt_Percentage).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, '')))+"%");

				$data.data = [
								$Current_Month_Collections_Percentage,
								(($Current_Month_Collections_Percentage >= 100 ) ?  0 : (100 - ($Current_Month_Collections_Percentage * 1) ))
							];

				ChartJSDonut("monthlyDonutChart",$Current_Month_Collections_Percentage+'%',$data);

			},$timing);

			/******* AnnualMonthlySubscriptionsPieChart ***************/
				
				setTimeout(()=>{

					$data = {
						labels: ['Collections', 'Debt'],
						backgroundColor:["#a2e2ba","#f1f1f4"],
						hoverBackgroundColor:["#a2e2ba","#f1f1f4"],
						data:[],
						extra_data:filteredMonthExpenses[0]
	
					};
	
					$("#Total_Monthly_Annual_Expected").html(filteredMonthExpenses[0].Total_Monthly_Annual_Expected );
					$(".Total_Monthly_Expected").html(filteredMonthExpenses[0].Total_Monthly_Expected);
					$(".Total_Annual_Expected").html(filteredMonthExpenses[0].Total_Annual_Expected === null ? 0 : filteredMonthExpenses[0].Total_Annual_Expected );

					$Total_Annual_Expected = filteredMonthExpenses[0].Total_Monthly_Annual_Expected - (filteredMonthExpenses[0].Annual_Expense_TotalPay + $Monthly_Expenses_Total_Paid);

					$("#Total_Annual_Expected").html(filteredMonthExpenses[0].Total_Monthly_Annual_Expected - (filteredMonthExpenses[0].Annual_Expense_TotalPay + $Monthly_Expenses_Total_Paid));
					

					$Monthly_Annual_Percentage = ((filteredMonthExpenses[0].Annual_Expense_TotalPay + $Monthly_Expenses_Total_Paid) * 100) / filteredMonthExpenses[0].Total_Monthly_Annual_Expected ;

					$Monthly_Annual_Percentage =  $Monthly_Annual_Percentage < 100 ? (parseFloat($Monthly_Annual_Percentage).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, '')) : 100 ;

					$("#Total_Annual_Expected_Percentage").html( parseFloat( 100 - $Monthly_Annual_Percentage).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, '') +'%');

					if($Total_Annual_Expected == 0 ){
						//$Monthly_Annual_Percentage = 0;
					}
					
					$data.data = [
						$Monthly_Annual_Percentage,
						(($Monthly_Annual_Percentage >= 100 ) ?  0 : parseFloat(100 - ($Monthly_Annual_Percentage * 1).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, '') ))
					];

					ChartJSDonut("AnnualMonthlySubscriptionsPieChart",$Monthly_Annual_Percentage+'%',$data);

				},$timing);

			/******* End AnnualMonthlySubscriptionsPieChart ***************/

			/******* AnnualSubscriptionsPieChart ***************/

			setTimeout(()=>{

				$Total_Annual_Paid_Subscriptions_Percentage = (filteredMonthExpenses[0].Annual_Expense_TotalPay * 100) / 
				filteredMonthExpenses[0].Total_Annual_Expected;

				$Total_Annual_Paid_Subscriptions_Percentage = (isNaN($Total_Annual_Paid_Subscriptions_Percentage) ? 0 : $Total_Annual_Paid_Subscriptions_Percentage);

				$("#Total_Annual_Paid_Subscriptions").html(filteredMonthExpenses[0].Annual_Expense_TotalPay);
				$("#Total_Annual_Paid_Subscriptions_Percentage").html((parseFloat($Total_Annual_Paid_Subscriptions_Percentage).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, ''))+"%");

				$("#Total_Annual_UnPaid_Subscriptions").html(filteredMonthExpenses[0].Total_Annual_Expected-filteredMonthExpenses[0].Annual_Expense_TotalPay);

				$Total_Annual_UnPaid_Subscriptions_Percentage = (parseFloat(100-$Total_Annual_Paid_Subscriptions_Percentage));

				$("#Total_Annual_UnPaid_Subscriptions_Percentage").html( !isNaN($Total_Annual_UnPaid_Subscriptions_Percentage) ? 
					(parseFloat($Total_Annual_UnPaid_Subscriptions_Percentage).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, ''))+"%" : "0%");

				$data = {
					labels: ['Collections', 'Debt'],
					backgroundColor:["#a2e2ba","#f1f1f4"],
					hoverBackgroundColor:["#a2e2ba","#f1f1f4"],
					data:[],
					extra_data:filteredMonthExpenses[0]

				};

				$("#Total_Monthly_Annual_Expected").html(filteredMonthExpenses[0].Total_Monthly_Annual_Expected );
				$(".Total_Monthly_Expected").html(filteredMonthExpenses[0].Total_Monthly_Expected);
				$(".Total_Annual_Expected").html(filteredMonthExpenses[0].Total_Annual_Expected === null ? 0 : filteredMonthExpenses[0].Total_Annual_Expected );

				$Annual_Paid_Subscriptions_Percentage = $Total_Annual_Paid_Subscriptions_Percentage < 100 ? (parseFloat($Total_Annual_Paid_Subscriptions_Percentage).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, '')) : 100 ;

				$data.data = [
					$Annual_Paid_Subscriptions_Percentage,
					(($Annual_Paid_Subscriptions_Percentage >= 100 ) ?  0 : parseFloat(100 - ($Annual_Paid_Subscriptions_Percentage * 1).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, '') ))
				];

				ChartJSDonut("AnnualSubscriptionsPieChart",$Annual_Paid_Subscriptions_Percentage+'%',$data);

			},$timing);

			/******* End AnnualSubscriptionsPieChart ***************/

			/******* MonthlySubscriptionsPieChart ***************/

			setTimeout(()=>{

				$Total_Monthly_Paid_Subscriptions_Percentage = (filteredMonthExpenses[0].Total_Monthly_Paid_Subscriptions * 100) / 
				filteredMonthExpenses[0].Total_Monthly_Expected;

				$Total_Monthly_Paid_Subscriptions_Percentage = isNaN($Total_Monthly_Paid_Subscriptions_Percentage) ? 0 : $Total_Monthly_Paid_Subscriptions_Percentage ;

				$("#Total_Monthly_Paid_Subscriptions").html(filteredMonthExpenses[0].Total_Monthly_Paid_Subscriptions);
				$("#Total_Monthly_Paid_Subscriptions_Percentage").html((parseFloat($Total_Monthly_Paid_Subscriptions_Percentage).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, ''))+"%");

				$("#Total_Monthly_UnPaid_Subscriptions").html(filteredMonthExpenses[0].Total_Monthly_Expected - filteredMonthExpenses[0].Total_Monthly_Paid_Subscriptions);

				$Total_Monthly_UnPaid_Subscriptions_Percentage = (parseFloat(100-$Total_Monthly_Paid_Subscriptions_Percentage));
				$("#Total_Monthly_UnPaid_Subscriptions_Percentage").html((parseFloat($Total_Monthly_UnPaid_Subscriptions_Percentage).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, ''))+"%");


				/*************/

				$data = {
					labels: ['Collections', 'Debt'],
					backgroundColor:["#a2e2ba","#f1f1f4"],
					hoverBackgroundColor:["#a2e2ba","#f1f1f4"],
					data:[],
					extra_data:filteredMonthExpenses[0]

				};

				$("#Total_Monthly_Annual_Expected").html(filteredMonthExpenses[0].Total_Monthly_Annual_Expected );
				$(".Total_Monthly_Expected").html(filteredMonthExpenses[0].Total_Monthly_Expected);
				$(".Total_Annual_Expected").html(filteredMonthExpenses[0].Total_Annual_Expected === null ? 0 : filteredMonthExpenses[0].Total_Annual_Expected );

				$Monthly_Paid_Subscriptions_Percentage = $Total_Monthly_Paid_Subscriptions_Percentage < 100 ? (parseFloat($Total_Monthly_Paid_Subscriptions_Percentage).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, '')) : 100;

				$data.data = [
					$Monthly_Paid_Subscriptions_Percentage,
					(($Monthly_Paid_Subscriptions_Percentage >= 100 ) ?  0 : parseFloat(100 - ($Monthly_Paid_Subscriptions_Percentage * 1) ).toFixed(1).replace(/^0*(\d+)(\.0*)?$/, ''))
				];

				ChartJSDonut("MonthlySubscriptionsPieChart",$Monthly_Paid_Subscriptions_Percentage+'%',$data);

			},$timing);

			/******* End MonthlySubscriptionsPieChart ***************/

			setTimeout(()=>{

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

			setTimeout(()=>{

				var $data  = {};

				var $monthAbbrv = [];
				var $monthly_Annual_Expense_TotalPay = [];
				var $monthly_Expense_Cost = [];
	
				DashboardAllData.MonthsExpenses.map((MonthExpenses)=>{
					$monthAbbrv.push( arrLang[$lang][String(MonthExpenses.Month).substring(0,3)]);
					$monthly_Annual_Expense_TotalPay.push(MonthExpenses.Monthly_Expense_TotalPay+MonthExpenses.Annual_Expense_TotalPay_Per_Month);
					$monthly_Expense_Cost.push(MonthExpenses.Monthly_Expected_Incomes+MonthExpenses.Annual_Expected_Incomes);
				});

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

		/************ AnnualMonthlySubscriptionsRevenusBarChart ****************/

		setTimeout(()=>{
			
			var $data  = {};
			var $percentage100Array = [];
			var $total = 0;

			var $subscriptionsObjArray = [];
			var $subscriptionsObj = {};
			
			for(p = 1 ; p <= 10 ; p++ ){
				$percentage100Array.push(p*10);
			}

			var $expense_Labels = [];
			var $expense_Count_Cost = [];
			var $expense_Paid_Cost = [];
			var $expense_Count_Cost_Array = [];
			var $expense_Colors = [];

			filteredMonthExpenses[0].Yearly_Total_Revenu_Grouped_By_Expenses.map((exp)=>{
				$total  += exp.Count_Cost;
			});		

			/*** Acculumation Paid / Expected Expense *********************************************/

			DashboardAllData.MonthsExpenses.map((exp)=>{

				exp.Monthly_Expected_Revenu_Grouped_By_Expenses_Obj.map((monthly_Expected_Revenu) => {
					if( monthly_Expected_Revenu.Expense_Label in $subscriptionsObj){
						if( "Expected" in $subscriptionsObj[monthly_Expected_Revenu.Expense_Label] ){
							$subscriptionsObj[monthly_Expected_Revenu.Expense_Label]["Expected"]  = 
							monthly_Expected_Revenu.Count_Cost+$subscriptionsObj[monthly_Expected_Revenu.Expense_Label]["Expected"];
							$subscriptionsObj[monthly_Expected_Revenu.Expense_Label]["Expense_Color"]  = monthly_Expected_Revenu.Expense_Color;
						}else{
							$subscriptionsObj[monthly_Expected_Revenu.Expense_Label]["Expected"]  = monthly_Expected_Revenu.Count_Cost;
							$subscriptionsObj[monthly_Expected_Revenu.Expense_Label]["Expense_Color"]  = monthly_Expected_Revenu.Expense_Color;
						}
					}else{
						$subscriptionsObj[monthly_Expected_Revenu.Expense_Label] = {
							"Expected":monthly_Expected_Revenu.Count_Cost ,
							"Expense_Color" :  monthly_Expected_Revenu.Expense_Color
						};
					}
				});

				exp.Yearly_Expected_Revenu_Grouped_By_Expenses_Obj.map( (yearly_Expected_Revenu) => {
					if( yearly_Expected_Revenu.Expense_Label in $subscriptionsObj){
						if( "Expected" in $subscriptionsObj[yearly_Expected_Revenu.Expense_Label] ){
							$subscriptionsObj[yearly_Expected_Revenu.Expense_Label]["Expected"]  = 
							yearly_Expected_Revenu.Count_Cost+$subscriptionsObj[yearly_Expected_Revenu.Expense_Label]["Expected"];
							$subscriptionsObj[yearly_Expected_Revenu.Expense_Label]["Expense_Color"]  = yearly_Expected_Revenu.Expense_Color;
						}else{
							$subscriptionsObj[yearly_Expected_Revenu.Expense_Label]["Expected"]  = yearly_Expected_Revenu.Count_Cost;
							$subscriptionsObj[monthly_Expected_Revenu.Expense_Label]["Expense_Color"]  = yearly_Expected_Revenu.Expense_Color;
						}
					}else{
						$subscriptionsObj[yearly_Expected_Revenu.Expense_Label] = {
							"Expected":yearly_Expected_Revenu.Count_Cost,
							"Expense_Color" :  yearly_Expected_Revenu.Expense_Color
						};
					}
				});

				exp.Monthly_Paid_Subscriptions_Grouped_By_Expenses_Obj.map( (monthly_Paid_Revenu) => {
					if( monthly_Paid_Revenu.Expense_Label in $subscriptionsObj){
						if( "Paid" in $subscriptionsObj[monthly_Paid_Revenu.Expense_Label] ){
							$subscriptionsObj[monthly_Paid_Revenu.Expense_Label]["Paid"]  = 
							monthly_Paid_Revenu.total+$subscriptionsObj[monthly_Paid_Revenu.Expense_Label]["Paid"];
						}else{
							$subscriptionsObj[monthly_Paid_Revenu.Expense_Label]["Paid"]  = monthly_Paid_Revenu.total;
							$subscriptionsObj[monthly_Paid_Revenu.Expense_Label]["Expense_Color"]  = monthly_Paid_Revenu.Expense_Color;
						}
					}else{
						$subscriptionsObj[monthly_Paid_Revenu.Expense_Label] = {
							"Paid":monthly_Paid_Revenu.total,
							"Expense_Color" :  monthly_Paid_Revenu.Expense_Color
						};
					}
				});

				exp.Yearly_Paid_Subscriptions_Grouped_By_Expenses_Obj.map( (yearly_Paid_Revenu) => {
					if( yearly_Paid_Revenu.Expense_Label in $subscriptionsObj){
						if( "Paid" in $subscriptionsObj[yearly_Paid_Revenu.Expense_Label] ){
							$subscriptionsObj[yearly_Paid_Revenu.Expense_Label]["Paid"]  = 
							yearly_Paid_Revenu.total+$subscriptionsObj[yearly_Paid_Revenu.Expense_Label]["Paid"];						
							$subscriptionsObj[yearly_Paid_Revenu.Expense_Label]["Expense_Color"]  = yearly_Paid_Revenu.Expense_Color;
						}else{
							$subscriptionsObj[yearly_Paid_Revenu.Expense_Label]["Paid"]  = yearly_Paid_Revenu.total;						
							$subscriptionsObj[yearly_Paid_Revenu.Expense_Label]["Expense_Color"]  = yearly_Paid_Revenu.Expense_Color;
						}
					}else{
						$subscriptionsObj[yearly_Paid_Revenu.Expense_Label] = {
							"Paid":yearly_Paid_Revenu.total,
							"Expense_Color" :  yearly_Paid_Revenu.Expense_Color
						};
					}
				});
				
			});

			$subscriptionsObjArray.push($subscriptionsObj);

			/*** End Acculumation Paid / Expected Expense *********************************************/

			$datasets = [];
			$paid_datasets =[];
			$expected_datasets =[];
			$expected_color = "#f6f6f7";
			$expected_total = 0;

			for (element in $subscriptionsObjArray[0]) {

				expense = $subscriptionsObjArray[0][element];
				$expense_Labels.push(element);
				$expense_Colors.push(expense.Expense_Color);
				$paid_datasets.push(expense.Paid);
				$expected_datasets.push(expense.Expected);
				$expected_total += expense.Expected;
			}

			$data = {
				labels: $expense_Labels ,
				type: 'bar',
				colors:'#151a3b',
				expectedTotal:$expected_total,
				datasets: [{
					type: 'bar',
					label:$expense_Labels,
					data: $paid_datasets,
					fill: true,
					backgroundColor:$expense_Colors,
					borderWidth: 1,
					borderColor:$expense_Colors,
					hoverBackgroundColor:$expense_Colors,
					hoverBorderColor:$expense_Colors,
					extra_data:$subscriptionsObjArray,
					statusType:'Incomes',

					barThickness:38,
					barPercentage: 1.0,
					categoryPercentage: 1.0,
					}, 
					{
					type: 'bar',
					label: arrLang[$lang]["Expected"],
					data: $expected_datasets,
					fill: true,
					backgroundColor: $expected_color,
					borderWidth: 1,
					borderColor: $expected_color,
					hoverBackgroundColor: $expected_color,
					hoverBorderColor: $expected_color,
					extra_data:$subscriptionsObjArray,
					statusType:'Expected',
					barThickness:38,
					barPercentage: 1.0,
					categoryPercentage: 1.0,
					
					}
				]
			};

			//$elem,$data,$indexAxis='x',$stakedX=false,$stakedY=false,$displayDatalabels=true,$displayYAxis=false,$displayXAxis=true){

			ChartJSBars("AnnualMonthlySubscriptionsRevenusBarChart",$data,'y',true,true,true,false,true,false);

		},$timing);

		/************ MonthlySubscriptionsRevenusBarChart ****************/

		setTimeout(()=>{
			
			var $data  = {};
			var $percentage100Array = [];
			var $total = 0;

			var $subscriptionsObjArray = [];
			var $subscriptionsObj = {};
			
			for(p = 1 ; p <= 10 ; p++ ){
				$percentage100Array.push(p*10);
			}

			var $expense_Labels = [];
			var $expense_Count_Cost = [];
			var $expense_Paid_Cost = [];
			var $expense_Count_Cost_Array = [];
			var $expense_Colors = [];
			var $expected_Total_Array = [];

			filteredMonthExpenses[0].Yearly_Total_Revenu_Grouped_By_Expenses.map((exp)=>{
				$total  += exp.Count_Cost;
			});		

			/*** Acculumation Paid / Expected Expense *********************************************/

			$subscriptionsMonthObjArray = [];

			DashboardAllData.MonthsExpenses.map((exp)=>{

				$subscriptionsMonthObj  = {};
				$subscriptionsObj 	    = [];
				$subscriptionsObjArr    = [];

				for(e = 0 ; e < exp.Monthly_Expected_Revenu_Grouped_By_Expenses_Obj.length ; e++){
					$subscriptionsObjArr.push({
						"Expense_Label" : exp.Monthly_Expected_Revenu_Grouped_By_Expenses_Obj[e].Expense_Label,
						"Expected" : exp.Monthly_Expected_Revenu_Grouped_By_Expenses_Obj[e].Count_Cost,
						"Paid" : ( exp.Monthly_Paid_Subscriptions_Grouped_By_Expenses_Obj[e] === undefined ? 0 : exp.Monthly_Paid_Subscriptions_Grouped_By_Expenses_Obj[e].total ) ,
						"Expense_Color" : exp.Monthly_Expected_Revenu_Grouped_By_Expenses_Obj[e].Expense_Color
					});
				}

				for(e = 0 ; e < exp.Yearly_Expected_Revenu_Grouped_By_Expenses_Obj.length ; e++){
					$subscriptionsObjArr.push({
						"Expense_Label" : exp.Yearly_Expected_Revenu_Grouped_By_Expenses_Obj[e].Expense_Label,
						"Expected" : exp.Yearly_Expected_Revenu_Grouped_By_Expenses_Obj[e].Count_Cost,
						"Paid" : ( exp.Yearly_Paid_Subscriptions_Grouped_By_Expenses_Obj[e] === undefined ? 0 : exp.Yearly_Paid_Subscriptions_Grouped_By_Expenses_Obj[e].total),
						"Expense_Color" : exp.Yearly_Expected_Revenu_Grouped_By_Expenses_Obj[e].Expense_Color
					});
				}

				$subscriptionsMonthObj[exp.Month] = $subscriptionsObjArr;
				$subscriptionsMonthObjArray.push($subscriptionsMonthObj);
				
			});

			/*** End Acculumation Paid / Expected Expense *********************************************/

			$datasets = [];
			$paid_datasets =[]; 
			$expected_datasets =[];
			$expected_color = "#f6f6f7";
			$expected_total = 0;

			$monthAbbrv = [];
			$monthly_Expense_Income = [];
			$monthly_Expense_Cost   = [];
			$monthly_Expense_Color = [];
			$monthly_Expense_Labels = [];
			$expected_Total_Array = [];
			$expected_Total_Acc = 0;
			$expected_Yearly_Expected_Acc = [];

			$subscriptionsMonthObjArray.map((subscriptions) =>{

				

				$expected_Total_Acc = 0;

				for(elm in subscriptions){
					subscriptions[elm].map((subscr)=>{

						if(!$monthAbbrv.includes(arrLang[$lang][String(elm).substring(0,3)])){
							$monthAbbrv.push(arrLang[$lang][String(elm).substring(0,3)]);
							
						}

						if( subscr.Expense_Label!= '' && !$monthly_Expense_Labels.includes(subscr.Expense_Label)){
							$monthly_Expense_Labels.push(subscr.Expense_Label); 
						}

						$expected_Total_Acc += subscr.Expected; 

						$expected_Yearly_Expected_Acc.push(filteredMonthExpenses[0].Total_Monthly_Annual_Expected);

					});
				}

				$expected_Total_Array.push($expected_Total_Acc);

			});

			for(explbl = 0 ; explbl < $monthly_Expense_Labels.length ; explbl++){

				for(sub = 0 ; sub <  $subscriptionsMonthObjArray.length ; sub++){

					$monthly_Expense_Income = [];
					$monthly_Expense_Cost   = [];
					$monthly_Expense_Color = [];
					$expense_Label  = '';
						
					$subscriptionsMonthObjArray.map((subscriptions) =>{

						for(elm in subscriptions){
							subscriptions[elm].map((subscr)=>{
								if($monthly_Expense_Labels[explbl] == subscr.Expense_Label ){
									$monthly_Expense_Cost.push(subscr.Expected);
									$monthly_Expense_Color.push(subscr.Expense_Color);
									$monthly_Expense_Income.push(subscr.Paid);
									$expense_Label = subscr.Expense_Label;
									$expected_Total_Array.push(subscr.Expected+subscr.Paid);
									$expected_Total_Acc += $expected_Total_Acc;
								}
							});
						}

					});

					if( $expense_Label  != ''){

						$datasets.push({
							type: 'bar',
							label: $expense_Label ,
							data: $monthly_Expense_Income,
							fill: false,
							backgroundColor: $monthly_Expense_Color,
							borderWidth: 0,
							borderColor: $monthly_Expense_Color,
							hoverBackgroundColor: $monthly_Expense_Color,
							hoverBorderColor: $monthly_Expense_Color,
							barPercentage: 0.75,
							categoryPercentage: 0.75,
							statusType:"Incomes",
							chartType:"bar",
							expected_total:filteredMonthExpenses[0].Total_Monthly_Annual_Expected,
							//stack:$expense_Label
						});
	
						$datasets.push({
							type: 'bar',
							label: $expense_Label ,
							data: $monthly_Expense_Cost,
							fill: false,
							backgroundColor: $expected_color,
							borderWidth: 0,
							borderColor: $expected_color,
							hoverBackgroundColor: $expected_color,
							hoverBorderColor: $expected_color,
							barPercentage: 0.75,
							categoryPercentage: 0.75,
							statusType:"Expected",
							chartType:"bar",
							expected_total:filteredMonthExpenses[0].Total_Monthly_Annual_Expected,
							//stack:$expense_Label
						});

					}

					$monthly_Expense_Labels.shift();
				}

			}

			$datasets.push({
				label: arrLang[$lang]['Expected'],
				type: "line",
				borderColor: "#92ddff", //"rgba(21, 26, 59, 0.3)"
				backgroundColor:"transparent",
				hoverBackgroundColor: "#92ddff",
				hoverBorderColor: "#92ddff",
				data: $expected_Total_Array,
				lineTension: 0.5 ,
				//stepped: true,
				statusType:"Expected",
				chartType:"line"
			});

			/*$datasets.push({
				label: arrLang[$lang]['Expected'],
				type: "line",
				borderColor: $expected_color, //"rgba(21, 26, 59, 0.3)"
				backgroundColor:"transparent",
				data: $expected_Yearly_Expected_Acc  ,
				lineTension: 0 ,
				stepped: true
			});*/

			$data = {
				labels: $monthAbbrv,
				type: 'bar',
				datasets: $datasets
			};

			ChartJSMixedBars("MonthlySubscriptionsRevenusBarChart",$data,false,false);

		},$timing);
		
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

			$MonthDaysRangeDate = new Date(filteredMonthExpenses[0].MonthDaysRange[Acc]);

			$MonthDaysRangeIncomesAccumulationInit += filteredMonthExpenses[0].MonthDaysRangeIncomes[Acc]+filteredMonthExpenses[0].AnnualDaysRangeIncomes[Acc];
			$MonthDaysRangeIncomesAccumulation.push($MonthDaysRangeIncomesAccumulationInit);
			$MonthDaysRangeExpectedIncomes.push(filteredMonthExpenses[0].Monthly_Expected_Incomes+filteredMonthExpenses[0].Annual_Expected_Incomes);

			if((today.getMonth() + 1) == selectedMonth 
			&& ((selectedMonth+'/'+today.getDate()  ) == ($MonthDaysRangeDate.getMonth() + 1)+'/'+$MonthDaysRangeDate.getDate() )){
				break
			}

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


/******* End getDashboardAllData ***********/

$(".dashboard-card-info").click(function() {
	$to = $(this).attr("data-element");
	if($to){
		document.querySelector($to).scrollIntoView({ behavior: 'smooth' })
		return false;
	}
});



