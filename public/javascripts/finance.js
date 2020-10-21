getAllFinances();
var exams = [];
var months =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octobre", "November", "December"];
var students=[];
var subscription=[];
var payments=[];
var indStart,indEnd;
var date = new Date();
function getAllFinances(id) {
	$.ajax({
	    type: 'get',
	    url: '/Finances/all',
	    dataType: 'json'
	  })
	  .done(function(res){
	  	if(res.errors)
	  	{
	  		console.log(res.errors);

	  	} else {
	  		$("#Finance").find('.month-row').remove();
	  		var htmlmonths = '';
	  		var studentList = '';
	  		console.log("students::",res.students);
	  		students = res.students;
	  		subscription = res.subscription;
	  		payments = res.payments;
	  		indStart = months.indexOf(res.start);
		 	indEnd = months.indexOf(res.end);
		 	for (var i = indStart; i < months.length; i++) {
				htmlmonths += '<th scope="col" class="col-text-align month-row">'+months[i].slice(0,3)+'</th>';
				if (i === indEnd)
					break;
				if (i === months.length - 1)
					i = -1;
			}
			$("#Finance").find('.list-months').append(htmlmonths);
			for (var i = 0; i <= students.length - 1; i++) {
				$('#Finance').find('.list-students').append('<tr data-studentid="'+students[i].Student_ID+'"> <td data-label="Subject name" class="td-label"><div class="sections-main-sub-container-left-card"> <img class="sections-main-sub-container-left-card-main-img" src="'+students[i].Student_Image+'" alt="card-img"> <div class="sections-main-sub-container-left-card-info"> <p class="sections-main-sub-container-left-card-main-info">'+students[i].Student_FirstName +' '+students[i].Student_LastName+'</p> <span class="sections-main-sub-container-left-card-sub-info">'+students[i].Classe_Label+'</span> </div> </div></td> </tr>');
				displayFinance(students[i].Student_ID);
			}
			
	  	}
	  });
 }

 function displayFinance(id) {
 	for (var i = indStart; i < months.length; i++) {
 		var subscriptionStudent = subscription.filter(function (el) {
						        return el.Student_ID === id;
						      });
 		var paymentFiltred = payments.filter(function (el) {
						        return el.Student_ID === id;
						      });
 		var studentPayment = '';
		for (var k = subscriptionStudent.length - 1; k >= 0; k--) {
			if (subscriptionStudent[k].Expense_PaymentMethod === "Monthly")
			{
				var endPay = new Date(subscriptionStudent[k].Subscription_EndDate);
				if (isNaN(endPay.getMonth()))
					endPay = i;
				else
					endPay = endPay.getMonth();
				if (date.getMonth() >= i && i >= indStart && endPay >= i)
				{
					var obj = '{Expence:subscriptionStudent[k].Expense_Label,Amount:subscriptionStudent[k].Expense_Cost,Status:"Unpaid",BoolStatus:"1"}'
					studentPayment += '<img src="assets/icons/check_red.svg" alt="states" data-pay="'+subscriptionStudent[k].SS_ID+'-'+months[i]+'" data-obj={"Expence":"'+subscriptionStudent[k].Expense_Label+'","Amount":'+subscriptionStudent[k].Expense_Cost+',"Status":"Unpaid","BoolStatus":"1"}/>'
				}
				else
					studentPayment += '<img class="disabled" data-pay="'+subscriptionStudent[k].SS_ID+'-'+months[i]+'" src="assets/icons/check_gray.svg" alt="states"/>';
			}
		}
		$("#Finance").find('[data-studentid="'+id+'"]').append(' <td scope="col" class="col-text-align col-text-align-extra-style col-text-align-extra-style-center">'+studentPayment+'</td>');
		for (var j = paymentFiltred.length - 1; j >= 0; j--) {
			if (paymentFiltred[j].Expense_PaymentMethod === "Monthly")
				if (paymentFiltred[j].SP_PaidPeriod === months[i])
				{
					$("#Finance").find('[data-studentid="'+id+'"]').find('[data-pay="'+paymentFiltred[j].SS_ID+"-"+months[i]+'"]').attr('src',"assets/icons/check_green.svg");
					$("#Finance").find('[data-studentid="'+id+'"]').find('[data-pay="'+paymentFiltred[j].SS_ID+"-"+months[i]+'"]').removeClass('disabled');
					$("#Finance").find('[data-studentid="'+id+'"]').find('[data-pay="'+paymentFiltred[j].SS_ID+"-"+months[i]+'"]').data('obj','{"Expence":"'+paymentFiltred[j].Expense_Label+'","Amount":'+paymentFiltred[j].Expense_Cost+',"Status":"Paid","BoolStatus":"0"}')
				}
		}
		if (i === indEnd)
			break;
		if (i === months.length - 1)
			i = -1;
	}
 }

