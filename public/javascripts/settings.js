var oldSubjects = [];
var $alreadySelected = [];
var $category_id = -1;
var $days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** Schedules ***********/
var $morning_From = "";
var $morning_To = "";
var $evening_From = "";
var $evening_To = "";

/** Breaks ***********/
var $break_Time_Start = "";
var $break_Time_End = "";

addLoadingAnimation(".sections-main-sub-container-right");
removeLoadingAnimation(".sections-main-sub-container-right",null);

/* Costs Section _______________________*/

$(document).on("click","#Costs_Section .square-button-plus",function(){

	expenses = {};
	expenseName = [];
	expenseCost = [];
	var htmlLi = '';
	var filtred =[];
	var costId = -1;

	$(this).parent().find('.form-group-left input').each(function() {
		 filtred.push($(this).val());
	});

	//$(this).parents(".dynamic-form-input-container-extra-style-composed").find(".dynamic-form-input-dropdown").removeClass("dynamic-form-input-first");

	$(this).parent().find(".dynamic-form-input-dropdown-options li").each(function(){
		if(!expenseName.includes($(this).attr("data-val"))){
			expenseName.push($(this).attr("data-val"));
			expenseCost.push($(this).attr("data-cost"));
		}
	});

	expenses["expenseName"] = expenseName;
	expenses["expenseCost"] = expenseCost;
	 
	for (var i = expenses.expenseName.length - 1; i >= 0; i--) {
	   if (filtred.includes(expenses.expenseName[i])){
		 htmlLi += '<li data-cost="'+expenses.expenseCost[i]+'" data-val="'+expenses.expenseName[i]+'" class="hidden">'+expenses.expenseName[i]+'</li>';
	   }
	   else{
		htmlLi += '<li data-cost="'+expenses.expenseCost[i]+'" data-val="'+expenses.expenseName[i]+'">'+expenses.expenseName[i]+'</li>';
	   }
	}

	$(this).before('<div class="dynamic-form-input-dropdown-container"> <div class="dynamic-form-input-dropdown costs-'+$(this).parent().attr('data-level')+'"> <div class="dynamic-form-input"> <div class="form-group group form-group-left"> <input type="text" oninput="hideNext(\''+ costId + '\')" class="input-dropdown" name="cost-name" required> <label class="input-label"><span class="input-label-text" data-lang="Expense_name">Expense Name</span> <span class="input-label-bg-mask"></span></label> <img class="icon button-icon" src="assets/icons/caret.svg"> <ul class="dynamic-form-input-dropdown-options">'+htmlLi+'</ul> </div> <div class="form-group group form-group-right"> <input type="text" class="input-text" name="cost-price" required> <label class="input-label"><span class="input-label-text" data-lang="Price">Price</span> <span class="input-label-bg-mask"></span></label> </div> <div class="square-button square-button-minus"> <img class="icon" src="assets/icons/minus.svg"> </div> </div> </div> </div>');

	if (filtred.length === (expenses.expenseName.length - 1)){
	$(this).css('display','none');
	}

	$("body").trigger("domChanged");

});

$(document).on("change","#Costs_Section .input-dropdown",function(){
   var filtred =[];
   $(this).parents(".dynamic-form-input-dropdown-container").parent().find('.form-group-left input').each(function() {
		 filtred.push($(this).val());
	})
   for (var i = expenses.expenseName.length - 1; i >= 0; i--) {
	 if (expenses.expenseName[i] === $(this).val())
	   $(this).parents(".dynamic-form-input-dropdown-container").parent('.dynamic-form-input-container-extra-style-composed').find('.dynamic-form-input-dropdown-options li[data-val="'+$(this).val()+'"]').addClass('hidden');
	 else if (!filtred.includes(expenses.expenseName[i]))
	   $(this).parents(".dynamic-form-input-dropdown-container").parent('.dynamic-form-input-container-extra-style-composed').find('.dynamic-form-input-dropdown-options li[data-val="'+expenses.expenseName[i]+'"]').removeClass('hidden');
   }
   $("body").trigger("domChanged");
})

$(document).on("click","#Costs_Section .square-button-minus",function(){

   $inputVal = $(this).parents(".dynamic-form-input-dropdown-container").find('.form-group-left input').val();
   $(this).parents(".dynamic-form-input-dropdown-container").parent('.dynamic-form-input-container-extra-style-composed').find('.dynamic-form-input-dropdown-options li[data-val="'+$inputVal+'"]').removeClass('hidden');

   if($(this).parents(".dynamic-form-input-container-extra-style").children(".dynamic-form-input-dropdown-container").length <= 2 ){
	 $(this).parents(".dynamic-form-input-container-extra-style").children(".dynamic-form-input-dropdown-container").children(".dynamic-form-input-dropdown").addClass("dynamic-form-input-first");
   }
   $(this).parents(".dynamic-form-input-dropdown-container")
   $(this).parents(".dynamic-form-input-dropdown-container").parent('.dynamic-form-input-container-extra-style-composed').find('.square-button-plus').css('display','block');
   $(this).parents(".dynamic-form-input-dropdown-container").remove();

});

/* End Costs Section _______________________*/

function getDetails() {
	$.ajax({
		type: 'get',
		url: '/Settings/get/details',
	})
	.done(function (res) {
		
		$('#Details_Section').removeClass('dom-change-watcher');
		$('#Details_Section').find('input[name="Institution_Name"]').val(res.institution.Institution_Name);
		$('#Details_Section').find('#Institution_Logo').attr('src',res.institution.Institution_Logo);
		$('#Details_Section').find('input[name="Institution_Email"]').val(res.institution.Institution_Email);
		$('#Details_Section').find('input[name="Institution_Phone"]').val(res.institution.Institution_Phone);
		//$('#Details_Section').find('input[name="Institution_wtsp"]').val(res.institution.Institution_wtsp);
		var Institution_Categories_Prov = res.institution.Categories.filter((category) => {
			return category.IC_ID == res.institution.Institution_Category_ID;
		});

		$label = arrLang[$lang][String(Institution_Categories_Prov[0]["IC_Label"]).replace(/\s/g, "_")];
		
		$('#Details_Section').find('input[name="category"]').val($label);
		$category_id = res.institution.Institution_Category_ID;
		$('#Details_Section').addClass('dom-change-watcher');

		if (Institution_Categories_Prov[0]["IC_Label"]) {
			$("#Details_Section .dynamic-form-input-dropdown-options li").each(function () {
				$text = arrLang[$lang][String($(this).text()).replace(/\s/g, "_")];
				if($label == $text){
					$(this).addClass("hide");
				} else {
					$(this).removeClass("hide");
				}
			});
		}

		$("#subCategoriesList").find('option').remove();
		res.institution.Specialities.map((Speciality) => {
			var selected = Speciality.ISC_Existe == 1 ? 'selected' : '';
			$label = arrLang[$lang][String(Speciality.ISC_Label).replace(/\s/g, "_")];
            $("#subCategoriesList").append('<option '+selected+' class="row-classe" data-lang='+$label+' value="'+Speciality.ISC_ID+'">'+$label+'</option>');
			select2ReCall();
		});
		
	});
}

$(document).ready(() => {
	getDetails();
	select2ReCall();
	dateTimePickerRecall();
});

function getAcademic() {
	addLoadingAnimation(".sections-main-sub-container-right");
	$.ajax({
		type: 'get',
		url: '/Settings/get/academic',
	})
	.done(function(res){
		removeLoadingAnimation(".sections-main-sub-container-right",null);
		$('#Academic_Year_Section').removeClass('dom-change-watcher');
		$('#Academic_Year_Section').find('input[name="AY_Label"]').val(res.academic.AY_Label);
		$('#Academic_Year_Section').find('input[name="AY_Satrtdate"]').val(res.academic.AY_Satrtdate);
		$('#Academic_Year_Section').find('input[name="AY_EndDate"]').val(res.academic.AY_EndDate);
		$('#Academic_Year_Section').addClass('dom-change-watcher');
	});
}

function getLevels() {

	addLoadingAnimation(".sections-main-sub-container-right");
	
	$.ajax({
		type: 'get',
		url: '/Settings/get/levels',
	})
	.done(function(res){
		removeLoadingAnimation(".sections-main-sub-container-right",null);
		$('#Level_Section').find('.row-levels').remove();
		$('#Level_Section').removeClass('dom-change-watcher');
		for (var i = res.levels.length - 1; i >= 0; i--) {
			$('#Level_Section').find('#levels-container').prepend(`<div class="dynamic-form-input dynamic-form-input-first row-levels">
                                      <div class="form-group group">
                                        <input type="text" required value="${res.levels[i].Level_Label}" data-level="${res.levels[i].Level_ID}" name="level-name">
                                        <label class="input-label"><span class="input-label-text" data-lang="Level_name">Level name</span> <span class="input-label-bg-mask"></span></label>
                                      </div>
                                      <div class="square-button hidden">
                                        <img class="icon" src="assets/icons/minus.svg">
                                      </div>
                                    </div>`);
		}
		$('#Level_Section').addClass('dom-change-watcher');
		$("body").trigger("domChanged");
	});
}

getLevels();

function getClasses() {
	addLoadingAnimation(".sections-main-sub-container-right");	
	$.ajax({
		type: 'get',
		url: '/Settings/get/classes',
	})
	.done(function(res){
		removeLoadingAnimation(".sections-main-sub-container-right",null);
		$('#Classe_Section').find('.row-levels').remove();
		$('#Classe_Section').removeClass('dom-change-watcher');

		for (var i = res.levels.length - 1; i >= 0; i--) {

			  var filtred = res.classes.filter(classe => classe.Level_ID === res.levels[i].Level_ID);
			  var htmlClasses = ``;

			  if(filtred.length > 0 ){

	              for(var j = 0;j < filtred.length ; j++) {
	                htmlClasses += `<div class="dynamic-form-input dynamic-form-input-first">
	                    <div class="form-group group">
	                      <input type="text" required name="classe-name" value="${filtred[j].Classe_Label}" data-classe="${filtred[j].Classe_ID}" data-level="${res.levels[i].Level_ID}">
	                      <label class="input-label"><span class="input-label-text" data-lang="Class_name">Classe name</span> <span class="input-label-bg-mask"></span></label>
	                    </div>
	                  <div class="square-button square-button-minus">
	                    <img class="icon" src="assets/icons/minus.svg" >
	                  </div>
	                </div>`
	              }

	          }else{

	          		htmlClasses = `<div class="dynamic-form-input dynamic-form-input-first">
	                    <div class="form-group group">
	                      <input type="text" required name="classe-name" value="" data-classe="0" data-level="${res.levels[i].Level_ID}">
	                      <label class="input-label"><span class="input-label-text"  data-lang="Class_name">Classe name</span> <span class="input-label-bg-mask"></span></label>
	                    </div>
	                  <div class="square-button square-button-minus">
	                    <img class="icon" src="assets/icons/minus.svg" >
	                  </div>
	                </div>`
	          }

              $('#Classe_Section').find('#classes-container').prepend(`<div class="dynamic-form-input-container row-levels" data-level="${res.levels[i].Level_ID}">
	                  <label class="input-label dynamic-form-input-container-label"><span class="input-label-text">${res.levels[i].Level_Label}</span> <span class="input-label-bg-mask"></span></label>
	                 ${htmlClasses}
	                  <div class="square-button square-button-extra-style square-button-plus" id="Classe_New_Dynamic_Form_Input">
	                    <img class="icon" src="assets/icons/plus.svg">
	                  </div>
	                </div>`);

		}

		$('#Classe_Section').addClass('dom-change-watcher');

		$("body").trigger("domChanged");

	});
}

getClasses();

function getSchedule() {

	addLoadingAnimation(".sections-main-sub-container-right");	

	$.ajax({
		type: 'get',
		url: '/Settings/get/schedule',
	})
	.done(function (res) {
		
			removeLoadingAnimation(".sections-main-sub-container-right", null);
			$('#Schedule_Section').find('.row-levels').remove();

			/** Schedule Section  *****************/

			var htmlSchedule = ``;

			if (res.Schedules.length > 0) {

				res.Schedules.map((Schedule, ind) => {
					
					checked = (Schedule.IS_Status == 1) ? 'checked' : '';
					subRowScheduleDisabled = (Schedule.IS_Status == 1) ? '' : 'sub-row-schedule-disabled';
					ScheduleHours = JSON.parse(Schedule.IS_Schedules);
					console.log("ScheduleHours => ", ind, ScheduleHours, checked);

					EveningVisibility = 'visibility' ;
					PlusVisibility = '';
					
					if (ScheduleHours.evening) {
						EveningVisibility = (ScheduleHours.evening.length == 0) ? 'visibility' : '';
						PlusVisibility = (ScheduleHours.evening.length > 0) ? 'visibility' : '';
					}
				
			
					htmlSchedule += `<div class="dynamic-form-input-container row-schedule">

									<div class="dynamic-form-input-label-container">
										<span class="input-label-bg-mask"></span>
										
										<div class="sections-label-checkbox-main-container sections-label-checkbox-container-left container-background-style" data-val="${$days[ind]}">
											<div class="sections-label-checkbox-container ">
											<div class="form-group group ">
												<span class="expense_label" data-lang="${$days[ind]}" placeholder="${$days[ind]}" style="opacity: 1;">${$days[ind]}</span>
											</div>
											</div>
											<div class="customCheck">
											<input ${checked} type="checkbox" value="${(ind + 1)}" data-val="${$days[ind]}" class="schedule-ck" name="checkbox" id="${$days[ind]}" autocomplete="" autofill="off">
											<label for="${$days[ind]}"></label>
											</div>
										</div>

									</div>

									<div class="sub-row-schedule ${subRowScheduleDisabled}" id="sub-row-schedule-${[ind]}">

										<div class="dynamic-form-input dynamic-form-input-first">

											<div class="dynamic-form-input-container dynamic-form-input-container-extra-style
													dynamic-form-input-container-multi-time dynamic-form-input-container-multi-time-first">

												<label class="input-label dynamic-form-input-container-label"><span class="input-label-text" data-lang="Morning">Morning</span> <span class="input-label-bg-mask"></span></label>

												<div class="flex flex-form-group-container">

													<div class="form-group group dynamic-form-input-text-container-icon">
													<input type="text" class="input-text input-time input-time-from" required="" name="morning_time_start" placeholder="Time"  data-lang="Time" autocomplete="" autofill="off">
													<img class="icon button-icon caret-disable-rotate" src="assets/icons/time_icon.svg">
													</div>

													<div class="form-group group dynamic-form-input-text-container-icon">
													<input type="text" name="morning_time_end" class="input-text input-time input-time-to" required="" placeholder="Time"  data-lang="Time" autocomplete="" autofill="off">
													<img class="icon button-icon caret-disable-rotate" src="assets/icons/time_icon.svg">
													</div>

												</div>

											</div>

											<div class="dynamic-form-input-container dynamic-form-input-container-extra-style
													dynamic-form-input-container-multi-time dynamic-form-input-container-multi-time-last ${EveningVisibility}">

												<label class="input-label dynamic-form-input-container-label"><span class="input-label-text"  data-lang="Evening">Evening</span> <span class="input-label-bg-mask"></span></label>

												<div class="flex flex-form-group-container">

													<div class="form-group group dynamic-form-input-text-container-icon">
													<input type="text" class="input-text input-time input-time-from" required="" name="evening_time_start" placeholder="Time"  data-lang="Time" autocomplete="" autofill="off">
													<img class="icon button-icon caret-disable-rotate" src="assets/icons/time_icon.svg">
													</div>

													<div class="form-group group dynamic-form-input-text-container-icon">
													<input type="text" name="evening_time_end" class="input-text input-time input-time-to" required="" placeholder="Time"  data-lang="Time" autocomplete="" autofill="off">
													<img class="icon button-icon caret-disable-rotate" src="assets/icons/time_icon.svg">
													</div>

												</div>

												<div class="square-button square-button-minus">
													<img class="icon" src="assets/icons/minus.svg">
												</div>

											</div>


										</div>

										<div class="square-button square-button-extra-style square-button-plus ${PlusVisibility}" id="${[ind]}">
											<img class="icon" src="assets/icons/plus.svg">
										</div>

									</div>

							</div>`;
				});

				$('#Schedule_Section').find('#schedule-container').html("");
				$('#Schedule_Section').find('#schedule-container').prepend(htmlSchedule);


				/***************************************************************************/

				$(".row-schedule").each(function (ind, elm) {

					if ($(elm).find("input[type='checkbox']").is(":checked")) {

						ScheduleHours = JSON.parse(res.Schedules[ind].IS_Schedules);

						$(elm).find("input[name='morning_time_start']").val(ScheduleHours.morning[0].morning_time_start);
						$(elm).find("input[name='morning_time_end']").val(ScheduleHours.morning[1].morning_time_end);

						if (!$(elm).find(".dynamic-form-input-container-multi-time-last").hasClass("visibility")) {
							$(elm).find("input[name='evening_time_start']").val(ScheduleHours.evening[0].evening_time_start);
							$(elm).find("input[name='evening_time_end']").val(ScheduleHours.evening[1].evening_time_end);
						}

					}

				});

				$('.input-time').timepicker({
					timeFormat: 'HH:mm',
					interval: 60,
					dynamic: false,
					dropdown: true,
					scrollbar: true
				});

				/***************************************************************************/

			} else {
			
				for (var i = 0; i < $days.length; i++) {
				
					checked = false; 
			
					htmlSchedule += `<div class="dynamic-form-input-container row-schedule">

									<div class="dynamic-form-input-label-container">
										<span class="input-label-bg-mask"></span>
										
										<div class="sections-label-checkbox-main-container sections-label-checkbox-container-left container-background-style" data-val="${$days[i]}">
											<div class="sections-label-checkbox-container ">
											<div class="form-group group ">
												<span class="expense_label" data-lang="${$days[i]}" placeholder="${$days[i]}" style="opacity: 1;">${$days[i]}</span>
											</div>
											</div>
											<div class="customCheck">
											<input ${checked} type="checkbox" value="${(i + 1)}" data-val="${$days[i]}" class="schedule-ck" name="checkbox" id="${$days[i]}" autocomplete="" autofill="off">
											<label for="${$days[i]}"></label>
											</div>
										</div>

									</div>

									<div class="sub-row-schedule sub-row-schedule-disabled" id="sub-row-schedule-${[i]}">

										<div class="dynamic-form-input dynamic-form-input-first">

											<div class="dynamic-form-input-container dynamic-form-input-container-extra-style
													dynamic-form-input-container-multi-time dynamic-form-input-container-multi-time-first">

												<label class="input-label dynamic-form-input-container-label"><span class="input-label-text" data-lang="Morning">Select time</span> <span class="input-label-bg-mask"></span></label>

												<div class="flex flex-form-group-container">

													<div class="form-group group dynamic-form-input-text-container-icon">
													<input type="text" class="input-text input-time input-time-from" required="" name="morning_time_start" placeholder="Time"  data-lang="Time" autocomplete="" autofill="off">
													<img class="icon button-icon caret-disable-rotate" src="assets/icons/time_icon.svg">
													</div>

													<div class="form-group group dynamic-form-input-text-container-icon">
													<input type="text" name="morning_time_end" class="input-text input-time input-time-to" required="" placeholder="Time"  data-lang="Time" autocomplete="" autofill="off">
													<img class="icon button-icon caret-disable-rotate" src="assets/icons/time_icon.svg">
													</div>

												</div>

											</div>

											<div class="dynamic-form-input-container dynamic-form-input-container-extra-style
													dynamic-form-input-container-multi-time dynamic-form-input-container-multi-time-last visibility">

												<label class="input-label dynamic-form-input-container-label"><span class="input-label-text"  data-lang="Evening">Select time</span> <span class="input-label-bg-mask"></span></label>

												<div class="flex flex-form-group-container">

													<div class="form-group group dynamic-form-input-text-container-icon">
													<input type="text" class="input-text input-time input-time-from" required="" name="evening_time_start" placeholder="Time"  data-lang="Time" autocomplete="" autofill="off">
													<img class="icon button-icon caret-disable-rotate" src="assets/icons/time_icon.svg">
													</div>

													<div class="form-group group dynamic-form-input-text-container-icon">
													<input type="text" name="evening_time_end" class="input-text input-time input-time-to" required="" placeholder="Time"  data-lang="Time" autocomplete="" autofill="off">
													<img class="icon button-icon caret-disable-rotate" src="assets/icons/time_icon.svg">
													</div>

												</div>

												<div class="square-button square-button-minus">
													<img class="icon" src="assets/icons/minus.svg">
												</div>

											</div>


										</div>

									<div class="square-button square-button-extra-style square-button-plus" id="${[i]}">
										<img class="icon" src="assets/icons/plus.svg">
									</div>

									</div>

							</div>`;
				}

				$('#Schedule_Section').find('#schedule-container').html("");
				$('#Schedule_Section').find('#schedule-container').prepend(htmlSchedule);

			}

			/** breaks section ***********************/
	
			var htmlScheduleBreaks = ``;

			if (res.ScheduleBreaks.length > 0) {
		
				res.ScheduleBreaks.map((singleBreak, ind) => {

					dynamicFormInputFirst = (ind == 0) ? " dynamic-form-input-first" : "";
					
					htmlScheduleBreaks += `<div class="row-schedule-breaks">

											<div class="sub-row-schedule-breaks">

												<div class="dynamic-form-input ${dynamicFormInputFirst}">

													<div class="dynamic-form-input-container dynamic-form-input-container-extra-style
															dynamic-form-input-container-multi-time dynamic-form-input-container-multi-time-first">

														<label class="input-label dynamic-form-input-container-label"><span class="input-label-text">${singleBreak.IBS_Start_Label}</span> <span class="input-label-bg-mask"></span></label>

														<div class="form-group group">
															<input type="text" required="" name="break_label" value="${singleBreak.IBS_Start_Label}" class="dynamic-form-input-text-with-border">
															<label class="input-label"><span class="input-label-text" data-lang="Break_label" style="opacity: 1;">Break Label</span> <span class="input-label-bg-mask"></span></label>
														</div>

														<div class="flex flex-form-group-container">

															<div class="form-group group dynamic-form-input-text-container-icon">
															<input type="text" class="input-text input-time input-time-from" required="" name="break_time_start" placeholder="Time"  data-lang="Time" data-lang="Time" value="${singleBreak.IBS_Start_Time}"  autocomplete="" autofill="off">
															<img class="icon button-icon caret-disable-rotate" src="assets/icons/time_icon.svg">
															</div>

															<div class="form-group group dynamic-form-input-text-container-icon">
															<input type="text" name="break_time_end" class="input-text input-time input-time-to" required="" placeholder="Time"  data-lang="Time" autocomplete="" value="${singleBreak.IBS_End_Time}" autofill="off">
															<img class="icon button-icon caret-disable-rotate" src="assets/icons/time_icon.svg">
															</div>

															<div class="square-button square-button-minus">
																<img class="icon" src="assets/icons/minus.svg">
															</div>

														</div>

													</div>

												</div>

										</div>`;
				

				});
			
			} else {

				htmlScheduleBreaks = `<div class="row-schedule-breaks">

						<div class="sub-row-schedule-breaks">

							<div class="dynamic-form-input dynamic-form-input-first">

								<div class="dynamic-form-input-container dynamic-form-input-container-extra-style
										dynamic-form-input-container-multi-time dynamic-form-input-container-multi-time-first">

									<label class="input-label dynamic-form-input-container-label"><span class="input-label-text" data-lang="Break">Break</span> <span class="input-label-bg-mask"></span></label>

									<div class="form-group group">
										<input type="text" required="" name="break_label" value="" class="dynamic-form-input-text-with-border">
										<label class="input-label"><span class="input-label-text" data-lang="Break_label" style="opacity: 1;">Break Label</span> <span class="input-label-bg-mask"></span></label>
									</div>

									<div class="flex flex-form-group-container">

										<div class="form-group group dynamic-form-input-text-container-icon">
										<input type="text" class="input-text input-time input-time-from" required="" name="break_time_start" placeholder="Time"  data-lang="Time" data-lang="Time"  autocomplete="" autofill="off">
										<img class="icon button-icon caret-disable-rotate" src="assets/icons/time_icon.svg">
										</div>

										<div class="form-group group dynamic-form-input-text-container-icon">
										<input type="text" name="break_time_end" class="input-text input-time input-time-to" required="" placeholder="Time"  data-lang="Time" autocomplete="" autofill="off">
										<img class="icon button-icon caret-disable-rotate" src="assets/icons/time_icon.svg">
										</div>

										<div class="square-button square-button-minus">
											<img class="icon" src="assets/icons/minus.svg">
										</div>

									</div>

								</div>

							</div>

					</div>`;
			}
		
		
			htmlScheduleBreaks += `<div class="square-button square-button-extra-style square-button-plus">
													<img class="icon" src="assets/icons/plus.svg">
								  </div>`;

			$('#Schedule_Section').find('#schedule-breaks-container').html("");
			$('#Schedule_Section').find('#schedule-breaks-container').prepend(htmlScheduleBreaks);
		
			$('.input-time').timepicker({
					timeFormat: 'HH:mm',
					interval: 60,
					dynamic: false,
					dropdown: true,
					scrollbar: true
			});

			$('#Schedule_Section').addClass('dom-change-watcher');
			$("body").trigger("domChanged");

	});

}

getSchedule();

function getSubjects() {

	addLoadingAnimation(".sections-main-sub-container-right");

	$.ajax({
		type: 'get',
		url: '/Settings/get/subjects',
	})
	.done(function(res){
		removeLoadingAnimation(".sections-main-sub-container-right",null);
		$('#Subject_Section').find('.row-levels').remove();
		$('#Subject_Section').removeClass('dom-change-watcher');
		$level_id = -1;
		for (var i = res.levels.length - 1; i >= 0; i--) {
          var filtredSubject = res.subjects.filter((subject) => { $level_id = res.levels[i].Level_ID ; return  subject.Level_ID === res.levels[i].Level_ID});
          var htmlSubjects = ``;

          if(filtredSubject.length > 0 ){


          	  $subject_ =  [];

	          for(var j = 0;j < filtredSubject.length ; j++) {

	            htmlSubjects += `<option selected locked="locked" data-ls-id="${filtredSubject[j].LS_ID}" data-bg="${filtredSubject[j].Subject_Color}" value="${filtredSubject[j].Subject_Label}">${filtredSubject[j].Subject_Label}</option>`;

	            $subject_.push(filtredSubject[j]);

	          }

	          oldSubjects.push({"level-id":$level_id,'subject':$subject_});

	          $('#Subject_Section').find('#subjects-container').prepend(`<div class="dynamic-form-input-container dynamic-form-input-container-extra-style row-levels" data-level="${res.levels[i].Level_ID}">

	              <label class="input-label dynamic-form-input-container-label"><span class="input-label-text">${res.levels[i].Level_Label}</span> <span class="input-label-bg-mask"></span></label>

	              <div class="dynamic-form-input-dropdown-container">
	                <div class="dynamic-form-input-dropdown dynamic-form-input-first">
	                  <div class="dynamic-form-input dynamic-form-input-first">
	                    <div class="form-group group">

	                        <select class="input-text-subject-select2" multiple name="language" data-level="${res.levels[i].Level_ID}">
	                        ${htmlSubjects}
	                        </select>
	                        <img class="icon button-icon" src="assets/icons/caret.svg">
	                    </div>

	                    <div class="square-button square-button-minus">
	                      <img class="icon" src="assets/icons/minus.svg">
	                    </div>

	                  </div>
	                </div>
	              </div>
	            </div>`)

          }else{

          	  var htmlSubjects = ``;

          	  

          	  for(var j = 0;j < res.allSubjects.length ; j++) {
	            htmlSubjects += `<option data-ls-id="-1" data-bg="${res.allSubjects[j].Subject_Color}" value="${res.allSubjects[j].Subject_Label}">${res.allSubjects[j].Subject_Label}</option>`;
	          }

	          $('#Subject_Section').find('#subjects-container').prepend(`<div class="dynamic-form-input-container dynamic-form-input-container-extra-style row-levels" data-level="${res.levels[i].Level_ID}">

	              <label class="input-label dynamic-form-input-container-label"><span class="input-label-text">${res.levels[i].Level_Label}</span> <span class="input-label-bg-mask"></span></label>

	              <div class="dynamic-form-input-dropdown-container">
	                <div class="dynamic-form-input-dropdown dynamic-form-input-first">
	                  <div class="dynamic-form-input dynamic-form-input-first">
	                    <div class="form-group group">

	                        <select class="input-text-subject-select2" multiple name="language" data-level="${res.levels[i].Level_ID}">
	                        ${htmlSubjects}
	                        </select>
	                        <img class="icon button-icon" src="assets/icons/caret.svg">
	                    </div>

	                    <div class="square-button square-button-minus">
	                      <img class="icon" src="assets/icons/minus.svg">
	                    </div>

	                  </div>
	                </div>
	              </div>
	            </div>`)

          }

		}

		$('#Subject_Section').addClass('dom-change-watcher');
		select2Call();

	});
}

getSubjects();

function getExpenses() {

	addLoadingAnimation(".sections-main-sub-container-right");

	$.ajax({
		type: 'get',
		url: '/Settings/get/expenses',
	})
	.done(function(res){
		removeLoadingAnimation(".sections-main-sub-container-right",null);
		$('#Expense_Section').find('.row-expenses').remove();
		$('#Expense_Section').removeClass('dom-change-watcher'); 
		for(var i = res.expenses.length - 1;i >= 0 ; i--) {
            $('#Expense_Section').find('#expense-container').prepend(`<div class="dynamic-form-input-dropdown-container row-expenses">
                                    <div class="dynamic-form-input-dropdown dynamic-form-input-first">
                                      <div class="dynamic-form-input">
                                        <div class="dynamic-form-input-float-adjust">
                                        <div class="form-group group form-group-left">
                                          <input type="text" class="input-text" required value="${res.expenses[i].Expense_Label}" name="expense-name" data-expense="${res.expenses[i].Expense_ID}">
                                          <label class="input-label"><span class="input-label-text" data-lang="Expense_name" >Expense name</span> <span class="input-label-bg-mask"></span></label>
                                        </div>
                                        <div class="form-group group form-group-right">
                                          <input type="text" name="payment_method" value="${arrLang[$lang][res.expenses[i].Expense_PaymentMethod]}" class="input-dropdown" required  data-lang="${res.expenses[i].Expense_PaymentMethod}" 
                                          	  readonly data-val="${res.expenses[i].Expense_PaymentMethod}">
                                          <img class="icon button-icon" src="assets/icons/caret.svg">
                                          <ul class="dynamic-form-input-dropdown-options">
                                              <li data-val="Monthly" data-lang="Monthly">Monthly</li>
                                              <li data-val="Annual" data-lang="Annual">Annual</li>
                                          </ul>
                                        </div>
                                        </div>
                                        <div class="square-button square-button-minus hidden">
                                          <img class="icon" src="assets/icons/minus.svg">
                                        </div>
                                      </div>
                                    </div>
                                  </div>`)
        }
        $('#Expense_Section').addClass('dom-change-watcher');
        $("body").trigger("domChanged");
	});
}

getExpenses();

function getCosts() {

	addLoadingAnimation(".sections-main-sub-container-right");

	$.ajax({
		type: 'get',
		url: '/Settings/get/costs',
	})
	.done(function(res){
		removeLoadingAnimation(".sections-main-sub-container-right",null);
		$('#Costs_Section').find('.row-levels').remove();
		$('#Costs_Section').removeClass('dom-change-watcher');
		for (var i = res.levels.length - 1; i >= 0; i--) {
        	var filtredCosts = res.costs.filter(cost => cost.Level_ID === res.levels[i].Level_ID);
        	

        	 if(filtredCosts.length > 0 ){

        	 		var htmlCosts = ``;

		          	for(var j = 0;j < filtredCosts.length ; j++) {
		              htmlCosts+= `<div class="dynamic-form-input-dropdown-container">
		                <div class="dynamic-form-input-dropdown dynamic-form-input-first">
		                  <div class="dynamic-form-input">
		                    <div class="form-group group form-group-left form-input-disabled">
		                      <input type="text" readonly class="input-dropdown" name="cost-name" required value="${filtredCosts[j].Expense_Label}" data-cost="${filtredCosts[j].Expense_ID}" data-level="${res.levels[i].Level_ID}">
		                      <label class="input-label input-label-move-to-top"><span class="input-label-text" data-lang="Expense_name">Expense Name</span> <span class="input-label-bg-mask"></span></label>
		                      <img class="icon button-icon" src="assets/icons/caret.svg">`;

				              htmlCosts+= `<ul class="dynamic-form-input-dropdown-options" style="display: none; opacity: 0;">`;

				              for(var ex = 0 ; ex < res.expenses.length ; ex++){

				              	 htmlCosts+= `<li data-val="${res.expenses[ex].Expense_Label}" data-cost="${res.expenses[ex].Expense_ID}">${res.expenses[ex].Expense_Label}</li>`;

				              }


				              htmlCosts+= `</ul>

		                    </div>
		                    <div class="form-group group form-group-right">
		                       <input type="text" class="input-text" name="cost-price" required value="${filtredCosts[j].Expense_Cost}">
		                        <label class="input-label"><span class="input-label-text" data-lang="Price">Price</span> <span class="input-label-bg-mask"></span></label>
		                    </div>
		                    <div class="square-button square-button-minus hidden" data-count="${res.expenses.length}">
		                      <img class="icon" src="assets/icons/minus.svg">
		                    </div>
		                  </div>
		                </div>
		              </div>`;
		         	}

		         	$hidden = ''; 

		         	if(filtredCosts.length == res.expenses.length ){
		         		$hidden = 'hidden';
		         	}
			        
			        $('#Costs_Section').find('#costs-container').prepend(`<div class="dynamic-form-input-container dynamic-form-input-container-extra-style dynamic-form-input-container-extra-style-composed row-levels" data-level="${res.levels[i].Level_ID}">
                      <label class="input-label dynamic-form-input-container-label"><span class="input-label-text">${res.levels[i].Level_Label}</span> <span class="input-label-bg-mask"></span></label>
                      ${htmlCosts}
                      <div class="square-button square-button-extra-style square-button-plus ${$hidden} " data-count="${res.expenses.length}" >
                        <img class="icon" src="assets/icons/plus.svg">
                      </div>
                    </div>`);
			}else{

					var htmlCosts = ``;

					for(var j = 0;j < res.expenses.length ; j++) {

		              htmlCosts+= `<div class="dynamic-form-input-dropdown-container">
		                <div class="dynamic-form-input-dropdown">
		                  <div class="dynamic-form-input">
		                    <div class="form-group group form-group-left">
		                      <input type="text" readonly class="input-dropdown" name="cost-name" required value="${res.expenses[j].Expense_Label}" data-cost="${res.expenses[j].Expense_ID}" data-level="${res.levels[i].Level_ID}">
		                      <label class="input-label input-label-move-to-top"><span class="input-label-text" data-lang="Expense_name">Expense Name</span> 
		                      <span class="input-label-bg-mask"></span></label>
		                      <img class="icon button-icon" src="assets/icons/caret.svg">
		                      <img class="icon button-icon" src="assets/icons/caret.svg">`;

				              htmlCosts+= `<ul class="dynamic-form-input-dropdown-options" style="display: none; opacity: 0;">`;

				              for(var ex = 0 ; ex < res.expenses.length ; ex++){

				              	 htmlCosts+= `<li data-val="${res.expenses[ex].Expense_Label}" data-cost="${res.expenses[ex].Expense_ID}">${res.expenses[ex].Expense_Label}</li>`;

				              }

				              htmlCosts+= `</ul>
		                    </div>
		                    <div class="form-group group form-group-right">
		                       <input type="text" class="input-text" name="cost-price" required >
		                        <label class="input-label"><span class="input-label-text" data-lang="Price">Price</span> <span class="input-label-bg-mask"></span></label>
		                    </div>
		                    <div class="square-button square-button-minus" data-count="${res.expenses.length}">
		                      <img class="icon" src="assets/icons/minus.svg">
		                    </div>
		                  </div>
		                </div>
		              </div>`
		         	}
			        
			        $('#Costs_Section').find('#costs-container').prepend(`<div class="dynamic-form-input-container dynamic-form-input-container-extra-style dynamic-form-input-container-extra-style-composed row-levels" data-level="${res.levels[i].Level_ID}">
	                      <label class="input-label dynamic-form-input-container-label"><span class="input-label-text">${res.levels[i].Level_Label}</span> <span class="input-label-bg-mask"></span></label>
	                      ${htmlCosts}
	                      <div class="square-button square-button-extra-style square-button-plus hidden" data-count="${res.expenses.length}">
	                        <img class="icon" src="assets/icons/plus.svg">
	                      </div>
	                    </div>`);
					}

			}

			$('#Costs_Section').addClass('dom-change-watcher');
			$("body").trigger("domChanged");
	});
}

getCosts();

function getGallery() {

	addLoadingAnimation(".sections-main-sub-container-right");

	$.ajax({
		type: 'get',
		url: '/Settings/get/gallery',
	})
	.done(function(res){
		console.log("res =>",res);
		removeLoadingAnimation(".sections-main-sub-container-right",null);
		$('#Gallery_Section').find('#sortable').html("");
		$('#Gallery_Section').removeClass('dom-change-watcher');
		//
		$pictures = "";

		res.Gallery.map((pic) =>{
			$(document).find("#sortable").append(CreateNewGalleryPic(pic["Institution_Gallery_Url"]));
			// sortable
			sortableInit();
		});
		
		$('#Gallery_Section').find('#sortable').append();
		$('#Gallery_Section').addClass('dom-change-watcher');
		$("body").trigger("domChanged");
	});
}

// getGallery(); // uncomment to activate gallery at the settings 

function updateDetails() {

	var Institution_Name  = $('#Details_Section').find('input[name="Institution_Name"]').val();
	var Institution_Logo  = $('#Details_Section').find('#Institution_Logo').attr('src');
	var Institution_Email = $('#Details_Section').find('input[name="Institution_Email"]').val();
	var Institution_Phone = $('#Details_Section').find('input[name="Institution_Phone"]').val();
	var Institution_Adress  = $('#Details_Section').find('input[name="Institution_Adress"]').val();
	var Institution_Adress  = $('#Details_Section').find('input[name="Institution_Adress"]').val();
	var Institution_SubCategoriesList  = $('#subCategoriesList').select2("data");

	if (!Institution_Name){
		$('#Details_Section').find('input[name="Institution_Name"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#Details_Section').find('input[name="Institution_Name"]').parent(".form-group").removeClass("form-input-error");
	}

	if (!Institution_Phone){
		$('#Details_Section').find('input[name="Institution_Phone"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		if (!internationalPhoneValidator(Institution_Phone)){
			$('#Details_Section').find('input[name="Institution_Phone"]').parent(".form-group").addClass("form-input-error");
		}
		else{
			$('#Details_Section').find('input[name="Institution_Phone"]').parent(".form-group").removeClass("form-input-error");
		}
	}

	if (!Institution_Adress){
		$('#Details_Section').find('input[name="Institution_Adress"]').parent(".form-group").addClass("form-input-error");
	}
	else{
		$('#Details_Section').find('input[name="Institution_Adress"]').parent(".form-group").removeClass("form-input-error");
	}

	if (Institution_SubCategoriesList.length <= 0 ){
		$('#Details_Section').find('.select2').addClass("form-input-error");
	}
	else{
		$('#Details_Section').find('.select2').removeClass("form-input-error");
	}

	if (!Institution_Email){
		$('#Details_Section').find('input[name="Institution_Email"]').parent(".form-group").addClass("form-input-error");
	}
	else{

		if (!emailValidator(Institution_Email)){
			$('#Details_Section').find('input[name="Institution_Email"]').parent(".form-group").addClass("form-input-error");
		}
		else{
			$('#Details_Section').find('input[name="Institution_Email"]').parent(".form-group").removeClass("form-input-error");
		}
	}

	if(Institution_Phone && internationalPhoneValidator(Institution_Phone) &&  Institution_Adress && Institution_Name && Institution_Email && Institution_SubCategoriesList.length > 0 ){

		addLoadingAnimation(".sections-main-sub-container-right");

		subCategoriesId = [];
		$("#subCategoriesList").select2('data').map((elm,ind) => {
			subCategoriesId.push(elm.id);
		})
		
		var data =  {
				Institution_Name:$('#Details_Section').find('input[name="Institution_Name"]').val(),
				Institution_Logo:$('#Details_Section').find('#Institution_Logo').attr('src'),
				Institution_Email:$('#Details_Section').find('input[name="Institution_Email"]').val(),
				Institution_Phone:$('#Details_Section').find('input[name="Institution_Phone"]').val(),
				Institution_Adress: $('#Details_Section').find('input[name="Institution_Adress"]').val(),
				Institution_Category:$('#Details_Section').find('input[name="Institution_Adress"]').val(),
				Institution_Category_id:$category_id,
				Institution_SubCategories:subCategoriesId,
		}

		console.log("data =>", data);

		$.ajax({
			type: 'post',
			url: '/Settings/update/details',
			data: {
				Institution_Name:$('#Details_Section').find('input[name="Institution_Name"]').val(),
				Institution_Logo:$('#Details_Section').find('#Institution_Logo').attr('src'),
				Institution_Email:$('#Details_Section').find('input[name="Institution_Email"]').val(),
				Institution_Phone:$('#Details_Section').find('input[name="Institution_Phone"]').val(),
				Institution_Adress: $('#Details_Section').find('input[name="Institution_Adress"]').val(),
				Institution_Category:$('#Details_Section').find('input[name="Institution_Adress"]').val(),
				Institution_Category_id:$category_id,
				Institution_SubCategories:subCategoriesId,
			},
			dataType: 'json'
		})
		.done(function(res){
		 	if (res.updated)
		 	{	
		 		removeLoadingAnimation(".sections-main-sub-container-right",null);
				$('#Details_Section .sub-container-form-footer').addClass('hide-footer');
	 			$('#Details_Section .sub-container-form-footer').removeClass('show-footer');
	 			$(".main-selected-school .side-bar-brand-label").text(Institution_Name);
		 	}else{
		 		removeLoadingAnimation(".sections-main-sub-container-right",null);
		 	}
		});

	}
}

function updateAY() {
	addLoadingAnimation(".sections-main-sub-container-right");
	
	$.ajax({
		type: 'post',
		url: '/Settings/update/academic',
		data: {
			AY_Label:$('#Academic_Year_Section').find('input[name="AY_Label"]').val(),
			AY_EndDate:$('#Academic_Year_Section').find('input[name="AY_EndDate"]').attr("data-val"),
			AY_Satrtdate:$('#Academic_Year_Section').find('input[name="AY_Satrtdate"]').attr("data-val")
		},
		dataType: 'json'
	})
	.done(function(res){
	 	if (res.updated)
	 	{
	 		removeLoadingAnimation(".sections-main-sub-container-right",null);
			$('#Academic_Year_Section .sub-container-form-footer').addClass('hide-footer');
 			$('#Academic_Year_Section .sub-container-form-footer').removeClass('show-footer');
	 	}else{
	 		removeLoadingAnimation(".sections-main-sub-container-right",null);
	 	}
	});
}

function updateLevels() {

	addLoadingAnimation(".sections-main-sub-container-right");

	$levelsErrors = [];

	var levels = $('#Level_Section').find('input[name="level-name"]').map(function(idx, elem) {

	 if($(elem).val() != ""){
	 	$(elem).parents(".form-group").removeClass("form-input-error");
   	 	return {label:$(elem).val(),id:$(elem).attr('data-level')};
	 }else{
	 	$levelsErrors.push(idx);
	 	$(elem).parents(".form-group").addClass("form-input-error");
	 }

  	}).get();

	if($levelsErrors.length == 0 ){

		$.ajax({
			type: 'post',
			url: '/Settings/update/levels',
			data: {
				levels
			},
			dataType: 'json'
		})
		.done(function(res){
		 	if (res.updated)
		 	{
		 		getClasses();
		 		getSubjects();
		 		getCosts();
		 		getLevels();
		 		removeLoadingAnimation(".sections-main-sub-container-right",null);
				$('#Level_Section .sub-container-form-footer').addClass('hide-footer');
	 			$('#Level_Section .sub-container-form-footer').removeClass('show-footer');
		 	}else{
		 		removeLoadingAnimation(".sections-main-sub-container-right",null);
		 	}
		});
	}
}

function updateExpenses() {

	$ExpensesLabelsErrors = [];
	$ExpensesCostsErrors  = [];

	var expenses = $('#Expense_Section').find('input[name="expense-name"]').map(function(idx, elem) {

	     if($(elem).val() != ""){
		 	$(elem).parents(".form-group").removeClass("form-input-error");
	   	 	return {
	   	 			label:$(elem).val(),id:$(elem).attr('data-expense'),
	   	 			method:$(elem).parents('.row-expenses').find('input[name="payment_method"]').attr("data-val")};
		 }else{
		 	$ExpensesLabelsErrors.push(idx);
		 	$(elem).parents(".form-group").addClass("form-input-error");
		 }

  	}).get();

  	$('#Expense_Section').find('input[name="payment_method"]').map(function(idx, elem) {

	     if($(elem).val() != "" ){
		 	$(elem).parents(".form-group").removeClass("form-input-error");
		 }else{
		 	$ExpensesCostsErrors.push(idx);
		 	$(elem).parents(".form-group").addClass("form-input-error");
		 }

  	})

	if($ExpensesLabelsErrors.length == 0 &&  $ExpensesCostsErrors.length == 0 ){
		addLoadingAnimation(".sections-main-sub-container-right");
		$.ajax({
			type: 'post',
			url: '/Settings/update/expenses',
			data: {
				expenses
			},
			dataType: 'json'
		})
		.done(function(res){
		 	if (res.updated)
		 	{
		 		getExpenses();
		 		getCosts();
				$('#Expense_Section .sub-container-form-footer').addClass('hide-footer');
	 			$('#Expense_Section .sub-container-form-footer').removeClass('show-footer');
	 			removeLoadingAnimation(".sections-main-sub-container-right",null);
		 	}else{
		 		removeLoadingAnimation(".sections-main-sub-container-right",null);
		 	}
		});
	}

}

function updateSubjects() {

	addLoadingAnimation(".sections-main-sub-container-right");

	var $subjects = {} ;

	$('#Subject_Section .row-levels').each(function(ind,elem){

		var $subject = {};
		var $sub     = [];

		$subject["level_id"] = $(elem).attr("data-level");

		$data = $(elem).find('.input-text-subject-select2').select2('data');

		$data.map(function(el,d){

			$text = el.text;
			$id = el.subject_id;

			if (typeof $id === 'undefined') {
				$id = -1 ;
			}

			$sub.push({'text':$text,'id':$id});

		});	

		$subject["subject"] = $sub;

		if($sub.length > 0 ){
			$subjects[ind] = $subject ;
		}

	});
	
	$.ajax({
		type: 'post',
		url: '/Settings/update/subjects',
		data: {
			'subjects' : $subjects
		},
		dataType: 'json'
	})
	.done(function(res){
	 	if (res.updated)
	 	{
	 		
	 		getSubjects();
			$('#Subject_Section .sub-container-form-footer').addClass('hide-footer');
 			$('#Subject_Section .sub-container-form-footer').removeClass('show-footer');
			removeLoadingAnimation(".sections-main-sub-container-right",null);
	 	}else{
			removeLoadingAnimation(".sections-main-sub-container-right",null);
	 	}
	});

}

function updateClasses() {

	var classes = $('#Classe_Section').find('input[name="classe-name"]').map(function(idx, elem) {
		
		if($(elem).val() != "" ){
			return {label:$(elem).val(),id:$(elem).attr('data-classe'),level:$(elem).parents('.row-levels').attr('data-level')};
		}
    	
  	}).get();

	$.ajax({
		type: 'post',
		url: '/Settings/update/classes',
		data: {
			classes
		},
		dataType: 'json'
	})
	.done(function(res){
	 	if (res.updated)
	 	{
	 		getClasses();
			$('#Classe_Section .sub-container-form-footer').addClass('hide-footer');
 			$('#Classe_Section .sub-container-form-footer').removeClass('show-footer');
	 	}
	});
}

function updateCosts() {

	$CostLabelsErrors = [];
	$CostPriceErrors  = [];
	
	//dynamic-form-input-dropdown
	var costs = $('#Costs_Section').find('input[name="cost-name"]').map(function(idx, elem) {

		if($(elem).val() != ""){
		    return {
		    	label:$(elem).val(),
		    	id:$(elem).attr('data-cost'),
		    	level:$(elem).parents('.row-levels').attr('data-level'),
		    	price:$(elem).parents('.dynamic-form-input-dropdown').find('input[name="cost-price"]').val()
		    };
		}else{
		 	$CostLabelsErrors.push(idx);
		 	$(elem).parents(".form-group").addClass("form-input-error");
	    }

	}).get();

  	$('#Costs_Section').find('input[name="cost-price"]').map(function(idx, elem) {

	     if($(elem).val() != "" ){
		 	$(elem).parents(".form-group").removeClass("form-input-error");
		 }else{
		 	$CostPriceErrors.push(idx);
		 	$(elem).parents(".form-group").addClass("form-input-error");
		 }

  	});

	if($CostLabelsErrors.length == 0 &&  $CostPriceErrors.length == 0 ){

		console.log("if costs",costs);

		addLoadingAnimation(".sections-main-sub-container-right");

		$.ajax({
			type: 'post',
			url: '/Settings/update/costs',
			data: {
				costs
			},
			dataType: 'json'
		})
		.done(function(res){
		 	if (res.updated)
		 	{
		 		getCosts();
				$('#Costs_Section .sub-container-form-footer').addClass('hide-footer');
	 			$('#Costs_Section .sub-container-form-footer').removeClass('show-footer');
	 			removeLoadingAnimation(".sections-main-sub-container-right",null);
		 	}else{
		 		removeLoadingAnimation(".sections-main-sub-container-right",null);
		 	}
		});
	}
}

function readFile() {
  
  if (this.files && this.files[0]) {
    
    var FR= new FileReader();
    
    FR.addEventListener("load", function(e) {
      document.getElementById("Institution_Logo").src = e.target.result;
    }); 
    
    FR.readAsDataURL( this.files[0] );
  }
  
}

document.getElementById("Institution_Image").addEventListener("change", readFile);

function discard(section) {
	$('#ChangesModal').attr('data-section',section);
}

$('#ChangesModal').find('#Discard').on('click',function () {
	var section = $('#ChangesModal').attr('data-section');
	switch (section) {
	  case 'Details':
	    getDetails();
	    break;
	  case 'Academic':
	  	getAcademic();
	  	break;
	  case 'Levels':
	    getLevels();
	    break;
	  case 'Classes':
	    getClasses();
		break;
	  case 'Schedule':
	 	getSchedule();
	    break;
	  case 'Subjects':
	    getSubjects();
	    break;
	  case 'Expenses':
	    getExpenses();
	    break;
	  case 'Costs':
	    getCosts();
	    break;
	  case 'Gallery':
		getGallery();
		break;
	  default:
	    console.log(`Sorry, we are out of ${section}.`);
	}
	$('sections-main-sub-container-right .sub-container-form-footer').addClass('hide-footer');
 	$('sections-main-sub-container-right .sub-container-form-footer').removeClass('show-footer');
});

select2Call();

function hideSelected(value) {
  if (value && !value.selected) {
    return $('<span>' + value.text + '</span>');
  }
}

function select2Call() {

	$tag_data = "";

	$alreadySelected = [];

	$(".input-text-subject-select2").each(function(ind,elem){

			$this = $(this) ;

			/****** prepend new options to all dropdown *********/

				$this.select2({
					  tokenSeparators: [','],
					  tags: true,
					  dropdownPosition: 'below',
			  		  minimumResultsForSearch: -1,
			  		  templateResult: hideSelected,
			  		  placeholder: "",
			  		  templateSelection: function (data, container){

						  var $option = $this.find('option[value="'+data.id+'"]');

						  if ($option.attr('locked')){
						  	$(container).addClass('locked-tag');
							data.locked = true; 
							$alreadySelected.push(data.id+"_"+$this.attr("data-level"));
						  }

					      $(container).attr("style","background-color:"+$option.attr("data-bg")+"!important;");
					      data.selected=true;
					      data.ls_id = $option.attr("data-ls-id");
						  $tag_data = data;
					      return data.text;

					  },
				      processResults: function(data, params) {
				          var data = $.map(data, function(item) {
				            if (item.text.match(params.term) || params.term === "") return item;
				          });
				          return { results: data }
				      }

				}).on("select2:unselecting", function(e) {
					    var self = $(this);
					    setTimeout(function() {
					        self.select2('close');
					    }, 0);
				});

				$this.trigger("change");

			/****** trigger changes on select **************/

			$(".input-text-subject-select2").on('select2:select', function (e) {

				callSubjects();

				$that = $(this); 

				$dataSelect2Id = $(this).attr("data-select2-id");

				$dataSelect2Data = $that.select2('data') ;

				$dataSelect2DataText = $dataSelect2Data[$dataSelect2Data.length - 1 ].text;

				$('.input-text-subject-select2').each(function(){

					$thisEach  = $(this);

					$exist = false;

					$dataSelect2IdCurrent = $thisEach.attr("data-select2-id");

					if($dataSelect2Id != $dataSelect2IdCurrent ){

							$select2Data = $thisEach.select2('data');

							for($i = 0 ; $i < $select2Data.length; $i++) {
							    if (String($select2Data[$i].text).toLowerCase() == String($dataSelect2DataText).toLowerCase()) {
							       	$exist = true;
							       	break;
							    }
							}

							if(!$exist ){
								var newOption = new Option($dataSelect2DataText, $dataSelect2DataText , false, false);
								$thisEach.prepend(newOption).trigger('change');
							}
					}
					
				});

			});

			$tag_data_unselect ="";

			$(".input-text-subject-select2").on("select2:unselect", (e) => {

				callSubjects();

				$tag_data_unselect = e.params.data;

			});

			$(".input-text-subject-select2").on('select2:open', function (e) {

				var a = new Array();

			    $(this).children("option").each(function(x){

			        test = false;
			        b = a[x] = $(this).val();

			        for(i=0;i<a.length-1;i++){
			            if(b ==a[i]){
			            	test =true;
			            }
			        }

			        if(test){
			        	$(this).remove();
			        }

			    })

				if( $tag_data_unselect != "" ) {
					var newOption = new Option($tag_data_unselect.text, $tag_data_unselect.id, false, false);
					$(this).prepend(newOption).trigger('change');
				}

				$tag_data_unselect = "" ;

			});

			/****** End prepend new options to all dropdown *********/

			$tag_data = "";

	});

	callSubjects();

}

function select2ReCall() {

	$tag_data = "";

	$alreadySelected = [];

	$("#subCategoriesList").each(function(ind,elem){

			$this = $(this) ;

			/****** prepend new options to all dropdown *********/

				$this.select2({
					  tokenSeparators: [','],
					  tags: true,
					  dropdownPosition: 'below',
			  		  minimumResultsForSearch: -1,
			  		  templateResult: hideSelected,
			  		  placeholder: "",
			  		  templateSelection: function (data, container){

						  var $option = $this.find('option[value="'+data.id+'"]');

						  if ($option.attr('locked')){
						  	$(container).addClass('locked-tag');
							data.locked = true; 
							$alreadySelected.push(data.id+"_"+$this.attr("data-level"));
						  }

					      $(container).attr("style","background-color:"+$option.attr("data-bg")+"!important;");
					      data.selected=true;
					      data.ls_id = $option.attr("data-ls-id");
						  $tag_data = data;
					      return data.text;

					  },
				      processResults: function(data, params) {
				          var data = $.map(data, function(item) {
				            if (item.text.match(params.term) || params.term === "") return item;
				          });
				          return { results: data }
				      }

				}).on("select2:unselecting", function(e) {
					    var self = $(this);
					    setTimeout(function() {
					        self.select2('close');
					    }, 0);
				});

				$this.trigger("change");

			/****** trigger changes on select **************/

			$("#subCategoriesList").on('select2:select', function (e) {

				$that = $(this); 

				$dataSelect2Id = $(this).attr("data-select2-id");

				$dataSelect2Data = $that.select2('data') ;

				$dataSelect2DataText = $dataSelect2Data[$dataSelect2Data.length - 1 ].text;

				$('.input-text-subject-select2').each(function(){

					$thisEach  = $(this);

					$exist = false;

					$dataSelect2IdCurrent = $thisEach.attr("data-select2-id");

					if($dataSelect2Id != $dataSelect2IdCurrent ){

							$select2Data = $thisEach.select2('data');

							for($i = 0 ; $i < $select2Data.length; $i++) {
							    if (String($select2Data[$i].text).toLowerCase() == String($dataSelect2DataText).toLowerCase()) {
							       	$exist = true;
							       	break;
							    }
							}

							if(!$exist ){
								var newOption = new Option($dataSelect2DataText, $dataSelect2DataText , false, false);
								$thisEach.prepend(newOption).trigger('change');
							}
					}
					
				});

			});

			$tag_data_unselect ="";

			$("#subCategoriesList").on("select2:unselect", (e) => {

				$tag_data_unselect = e.params.data;

			});

			$("#subCategoriesList").on('select2:open', function (e) {

				var a = new Array();

			    $(this).children("option").each(function(x){

			        test = false;
			        b = a[x] = $(this).val();

			        for(i=0;i<a.length-1;i++){
			            if(b ==a[i]){
			            	test =true;
			            }
			        }

			        if(test){
			        	$(this).remove();
			        }

			    })

				if( $tag_data_unselect != "" ) {
					var newOption = new Option($tag_data_unselect.text, $tag_data_unselect.id, false, false);
					$(this).prepend(newOption).trigger('change');
				}

				$tag_data_unselect = "" ;

			});

			/****** End prepend new options to all dropdown *********/

			$tag_data = "";

	});

}

function callSubjects() {

  $.ajax({
          type: 'post',
          url: '/Settings/subjects',
        })
        .done(function(res){

          if (res.subjects.length > 0){

          		 $(".input-text-subject-select2").each(function(){

          		 	$this = $(this);

		            $this.select2({
		              data: res.subjects,
		              tags: true,
		              dropdownPosition: 'below',
		              tokenSeparators: [','],
		              minimumResultsForSearch: -1,
		              templateResult: hideSelected,
		              placeholder: "",
		              templateSelection: function (data, container) {

		                  $(container).attr("style","background-color:"+data.color+"!important;");

		                  var $option = $this.find('option[value="'+data.id+'"]');

		                  $option.attr("data-bg",data.color);
		                  $option.attr("data-subject-id",data.Subject_ID);

						  if ($alreadySelected.includes(data.id+"_"+$this.attr("data-level"))){
						  	$(container).addClass('locked-tag');
						  	$option.attr("locked",true);
							data.locked = true; 
						  }

					      data.selected=true;
					      data.subject_id = data.Subject_ID;
					      data.ls_id = $option.attr("data-ls-id");
						  $tag_data = data;
					      return data.text;

		              }

		            });

		            $this.trigger("change");

	        	});

        	}
        });
}

/** .modal-confirm-button *************************/

$(document).on("click", ".modal-confirm-button", function (event) {
	$("#ChangesModal").modal("hide");
	domChangeWatcher();
});

/**** Institution Categories **********************/

$(document).on("click","#categoriesList li",function () {
	$category_id = $(this).attr("data-categoryid");
	that = $(this);
	$("#Details_Section .dynamic-form-input-dropdown-options li").each(function(){
		if ($(that).text() == $(this).text()){
			$(this).addClass("hide");
		} else {
			$(this).removeClass("hide");
		}
	});
  loadSubCategories();
})

var categories_list = [];

function getAllCategories(){

	categoriesList = '';

	$.ajax({
	    type: 'post',
	    url: '/settings/categories',
	    data: {},
	    dataType: 'json'
	  })
    .done(function (res) {
      
	  	if(res.categories)
	  	{
			categories_list = res.categories;
				
	  		for (var n = res.categories.length - 1; n >= 0; n--) {
				$label = arrLang[$lang][String(res.categories[n].IC_Label).replace(/\s/g, "_")];
			  	categoriesList += '<li data-categoryId="'+res.categories[n].IC_ID+'"  data-val="'+$label+'">'+$label+'</li>';
			}

			$("#categoriesList").html("");
			$("#categoriesList").html(categoriesList);

	  	} else {
	  		console.log(res);
      }
      
	  });

}

getAllCategories();

function loadSubCategories() {
    $("#subCategoriesList").find('option').remove();
    $.ajax({
        type: 'post',
        url: '/settings/subCategories',
        data: {
          "category_id":$category_id,
        },
        dataType: 'json'
      })
      .done(function(res){
        if(res.errors){
          console.log(res.errors);
        } else {
          for (var i = res.subCategories.length - 1; i >= 0; i--) {
 			  $label = arrLang[$lang][String(res.subCategories[i].ISC_Label).replace(/\s/g, "_")];
              $("#subCategoriesList").append('<option class="row-classe" data-lang='+$label+' value="'+res.subCategories[i].ISC_ID+'">'+$label+'</option>');
          }
        }
      });
}

/*___________  Schedule  _______________________*/

/* Schedule Section .row-schedule _______________________*/

$(document).on("click", "#Schedule_Section .row-schedule .square-button-plus", function () {

	$(this).parent(".dynamic-form-input-container .sub-row-schedule").find(".dynamic-form-input-container-multi-time-last").removeClass("visibility");
	$(this).addClass("visibility");

	if ($(this).attr("id") == 0) {

		if ($morning_To) {
			$(this).parents(".row-schedule").find(".sub-row-schedule").find("input[name='evening_time_start']")
				.timepicker('option', 'minTime', $morning_To).val($morning_To);

			$(this).parents(".row-schedule").find(".sub-row-schedule").find("input[name='evening_time_end']")
				.timepicker('option', 'minTime', $morning_To).val($morning_To);
		}

	} else {

		if($evening_From != ""){
			$(this).parents(".row-schedule").find(".sub-row-schedule").find("input[name='evening_time_start']")
			.timepicker('option', 'minTime', $morning_To).val($evening_From);
		}

		if($evening_To != ""){
			$(this).parents(".row-schedule").find(".sub-row-schedule").find("input[name='evening_time_end']")
			.timepicker('option', 'minTime', $morning_To).val($evening_To);
		}
		
	}

});

/* Schedule Section _______________________*/

$(document).on("click", "#Schedule_Section .square-button-minus", function () {
	$(this).parents(".dynamic-form-input-container .sub-row-schedule").find(".square-button-plus").removeClass("visibility");
	$(this).parent(".dynamic-form-input-container-multi-time-last").addClass("visibility");
});

/* .schedule-ck ____________________*/

$(document).on("change",".schedule-ck" ,function (event) {

	id = $(this).val();

	if ($(this).is(":checked")) {

		$(this).parents(".row-schedule").find(".sub-row-schedule").css("pointer-events", "unset");
		$(this).parents(".row-schedule").find(".sub-row-schedule").removeClass("sub-row-schedule-disabled");

			maxOfTimePeriod();

			if ($morning_From != "") {
				$(this).parents(".row-schedule").find(".sub-row-schedule").find("input[name='morning_time_start']").val(
					$morning_From
				);
			}

			if ($morning_To != "" ) {
				$(this).parents(".row-schedule").find(".sub-row-schedule").find("input[name='morning_time_end']").val(
					$morning_To
				);
			}
			
			$(this).parents(".row-schedule").find(".sub-row-schedule").find("input[name='evening_time_start']").val(
				$evening_From
			);
			
			$(this).parents(".row-schedule").find(".sub-row-schedule").find("input[name='evening_time_end']").val(
				$evening_To
			);

			if ($morning_To != "") {
				$(this).parents(".row-schedule").find(".sub-row-schedule").find("input[name='evening_time_start']")
		   		   .timepicker('option', 'minTime', $morning_To).val($morning_To);

				$(this).parents(".row-schedule").find(".sub-row-schedule").find("input[name='evening_time_end']")
					.timepicker('option', 'minTime', $morning_To).val($morning_To);
			}
		
			if ($("#schedule-container .square-button-plus.visibility").length > 0 ){
				$(this).parents(".row-schedule").find(".sub-row-schedule").find(".square-button-plus").trigger("click");
			}

		    dateTimePickerRecall();

	} else {

		$(this).parents(".row-schedule").find(".sub-row-schedule").css("pointer-events", "none");
		$(this).parents(".row-schedule").find(".sub-row-schedule").addClass("sub-row-schedule-disabled");

		//if ($(this).val() != 1) {
			$(this).parents(".row-schedule").find(".sub-row-schedule").find("input[name='morning_time_start']").val("");
			$(this).parents(".row-schedule").find(".sub-row-schedule").find("input[name='morning_time_end']").val("");
			$(this).parents(".row-schedule").find(".sub-row-schedule").find("input[name='evening_time_start']").val("");
			$(this).parents(".row-schedule").find(".sub-row-schedule").find("input[name='evening_time_end']").val("");
		//}

		dateTimePickerRecall();

	}

});

/*** updateSchedule  ***********/

function updateSchedule() {

	let schedules = [];

	let validForm = true;

	$(".row-schedule").each(function (ind, elm) {

		if ($(elm).find("input[type='checkbox']").is(":checked")) {

			working_hours = {};
			working_morning_hours = [];
			working_evening_hours = [];
			
			if (!$(elm).find("input[name='morning_time_start']").val()) {
				$(elm).find("input[name='morning_time_start']").addClass("form-input-error");
				validForm = false;
			} else {
				$(elm).find("input[name='morning_time_start']").removeClass("form-input-error");
				working_morning_hours.push({ "morning_time_start": $(elm).find("input[name='morning_time_start']").val()});
			}

			if (!$(elm).find("input[name='morning_time_end']").val()) {
				$(elm).find("input[name='morning_time_end']").addClass("form-input-error");
				validForm = false;
			} else {
				$(elm).find("input[name='morning_time_end']").removeClass("form-input-error");
				working_morning_hours.push({ "morning_time_end": $(elm).find("input[name='morning_time_end']").val()});
			}

			working_hours["morning"] = working_morning_hours;

			if (!$(elm).find(".dynamic-form-input-container-multi-time-last").hasClass("visibility")) {
				
				if (!$(elm).find("input[name='evening_time_start']").val()) {
					$(elm).find("input[name='evening_time_start']").addClass("form-input-error");
					validForm = false;
				} else {
					$(elm).find("input[name='evening_time_start']").removeClass("form-input-error");
					working_evening_hours.push({ "evening_time_start": $(elm).find("input[name='evening_time_start']").val()});
				}

				if (!$(elm).find("input[name='evening_time_end']").val()) {
					$(elm).find("input[name='evening_time_end']").addClass("form-input-error");
					validForm = false;
				} else {
					$(elm).find("input[name='evening_time_end']").removeClass("form-input-error");
					working_evening_hours.push({ "evening_time_end": $(elm).find("input[name='evening_time_end']").val()});
				}

				working_hours["evening"] = working_evening_hours;

			}

			schedules.push({
				"day_id": $(elm).find("input[type='checkbox']").val(),
				"status": 1,
				"working_hours":  JSON.stringify(working_hours)
			});

		} else {
				schedules.push({
					"day_id": $(elm).find("input[type='checkbox']").val(),
					"working_hours":  JSON.stringify({ "morning": [], "evening": [] }),
					"status": -1
				});
		}

	});

	let schedule_breaks = [];

	$(".row-schedule-breaks .dynamic-form-input").each(function (ind, elm) {

			working_breaks_hours = [];
			break_label = "";
		
			if (!$(elm).find("input[name='break_label']").val()) {
				$(elm).find("input[name='break_label']").parent(".form-group").addClass("form-input-error");
				validForm = false;
			} else {
				$(elm).find("input[name='break_label']").parent(".form-group").removeClass("form-input-error");
				break_label =  $(elm).find("input[name='break_label']").val();
			}
		
			if (!$(elm).find("input[name='break_time_start']").val()) {
				$(elm).find("input[name='break_time_start']").addClass("form-input-error");
				validForm = false;
			} else {
				$(elm).find("input[name='break_time_start']").removeClass("form-input-error");
				working_breaks_hours.push({ "break_time_start": $(elm).find("input[name='break_time_start']").val()});
			}

			if (!$(elm).find("input[name='break_time_end']").val()) {
				$(elm).find("input[name='break_time_end']").addClass("form-input-error");
				validForm = false;
			} else {
				$(elm).find("input[name='break_time_end']").removeClass("form-input-error");
				working_breaks_hours.push({ "break_time_end": $(elm).find("input[name='break_time_end']").val()});
			}

			schedule_breaks.push({
				"break_label": break_label,
				"breaks":working_breaks_hours
			});
			
	});

			
	let data = {
		schedules,
		schedule_breaks
	}

	filtredSchedulesProv = schedules.filter((schedule) => {
		return schedule.status == 1;
	});

	if (filtredSchedulesProv.length <= 0 ) {
		$(".sub-container-form .row-schedule:first-child").addClass("form-input-error");
		validForm = false;
	} else {
		$(".sub-container-form .row-schedule").removeClass("form-input-error");
	}

	if (validForm) {

		console.log("data =>",data);

		$.ajax({
			type: 'post',
			url: '/Settings/update/schedule',
			data: {
				schedules,
				schedule_breaks
			},
			dataType: 'json'
		})
		.done(function(res){
			if (res.updated)
			{
				getSchedule();
				$('#Schedule_Section .sub-container-form-footer').addClass('hide-footer');
				$('#Schedule_Section .sub-container-form-footer').removeClass('show-footer');
				$('#Schedule_Section .sub-main-container').css('height', "calc(100%)");
				removeLoadingAnimation(".sections-main-sub-container-right",null);
			}else{
				removeLoadingAnimation(".sections-main-sub-container-right",null);
			}

			console.log("done data =>",res);
		});
	}
}

/* .input-time-from **********************************************/

$(document).on("click", ".input-time-from", function (event) {

	switch ($(this).attr("name")) {
		case 'evening_time_start': {
			if ($(this).val() == "") {
				$morning_To = $(this).parents(".row-schedule").find(".sub-row-schedule").find("input[name='morning_time_end']").val();
				$(this).parents(".row-schedule").find(".sub-row-schedule").find("input[name='evening_time_start']")
					.timepicker('option', 'minTime', $morning_To).val($morning_To);

				$(this).parents(".row-schedule").find(".sub-row-schedule").find("input[name='evening_time_end']")
					.timepicker('option', 'minTime', $morning_To).val($morning_To);
				$(this).focus();
			}
			break;
		}
		default: {
			break;
		}
	}
});

/*  #Schedule_Section #schedule-breaks-container  .square-button-plus _______________________*/

$(document).on("click", "#Schedule_Section #schedule-breaks-container .square-button-plus", function () {

	$(".sub-row-schedule-breaks .dynamic-form-input-container").removeClass("last");

	$dynamic_form_input = BreakComponent;
	$(this).before($dynamic_form_input);

	maxOfTimeBreak();

	if ($break_Time_End) {
		$(document).find("#Schedule_Section #schedule-breaks-container .last").find("input[name='break_time_start']")
		.timepicker('option', 'minTime', $break_Time_End).val($break_Time_End);

		$(document).find("#Schedule_Section #schedule-breaks-container .last").find("input[name='break_time_end']")
		.timepicker('option', 'minTime', $break_Time_End).val($break_Time_End);	
	}

	$('.input-time').timepicker({
			timeFormat: 'HH:mm',
			interval: 60,
			dynamic: false,
			dropdown: true,
			scrollbar: true
	});

	/** dateTimePickerRecall() ******************************/
	dateTimePickerRecall();

});

/*  #Schedule_Section #schedule-breaks-container .square-button-minus _______________________*/

$(document).on("click", "#Schedule_Section #schedule-breaks-container .square-button-minus", function () {
	
	if($(this).parents(".sub-row-schedule-breaks").children(".dynamic-form-input").length <= 2 ){
		$(this).parents(".sub-row-schedule-breaks").children(".dynamic-form-input").addClass("dynamic-form-input-first");
	}

	$(this).parents(".dynamic-form-input").remove();

});

/*  #Schedule_Section #schedule-breaks-container input[name='break_label'] _______________________*/

$(document).on("keyup", "#Schedule_Section #schedule-breaks-container input[name='break_label']", function () {

	if ($(this).val() != "") {
		$(this).parents(".dynamic-form-input-container-multi-time").find(".dynamic-form-input-container-label .input-label-text").text($(this).val());
	} else {
		$(this).parents(".dynamic-form-input-container-multi-time").find(".dynamic-form-input-container-label .input-label-text").text(arrLang[$lang]["Break"]);
	}

});

/*  #Schedule_Section #schedule-breaks-container .input-time _______________________*/

$(document).on("click", "#Schedule_Section #schedule-breaks-container .input-time", function () {
	$(this).trigger("focus");
});

/*  #Schedule_Section #schedule-breaks-container .input-time _______________________*/

$(document).on("change", "#Schedule_Section #schedule-breaks-container .input-time", function () {
	$('#Schedule_Section .sub-container-form-footer').removeClass('hide-footer');
	$('#Schedule_Section .sub-container-form-footer').addClass('show-footer');
	$('#Schedule_Section .sub-main-container').css('height', "calc(100vh - 120px)");
	maxOfTimeBreak();
});

$(document).on("click", ".ui-menu-item", function () {
	$('#Schedule_Section .sub-container-form-footer').removeClass('hide-footer');
	$('#Schedule_Section .sub-container-form-footer').addClass('show-footer');
	$('#Schedule_Section .sub-main-container').css('height', "calc(100vh - 120px)");
	maxOfTimeBreak();
	maxOfTimePeriod(); 
});

/*  #Schedule_Section #schedule-breaks-container .input-time _______________________*/

function dateTimePickerRecall() {

	
	$(document).find('#Schedule_Section #schedule-breaks-container .input-time').each((elm) => {
		$(elm).timepicker({
			timeFormat: 'HH:mm',
			interval: 60,
			dynamic: false,
			dropdown: true,
			scrollbar: true
		});
	});

	$(document).find('#Schedule_Section #schedule-breaks-container .input-time').timepicker('option', 'change', function (time) {
		
		$(this).parents(".dynamic-form-input-text-container-icon")
			   .next(".dynamic-form-input-text-container-icon").find(".input-time")
			.timepicker('option', 'minTime', time).val($(this).val());
		
		$(this).parents(".dynamic-form-input-text-container-icon")
			.next(".dynamic-form-input-text-container-icon").find(".input-time");
		
	});
	
}


const BreakComponent = (event) => {
	
	return `<div class="dynamic-form-input">

				<div class="dynamic-form-input-container dynamic-form-input-container-extra-style
						dynamic-form-input-container-multi-time dynamic-form-input-container-multi-time-first last">

					<label class="input-label dynamic-form-input-container-label"><span class="input-label-text" style="opacity: 1;">${arrLang[$lang]["Break"]}</span> <span class="input-label-bg-mask"></span></label>

					<div class="form-group group">
						<input type="text" required="" name="break_label" value="" class="dynamic-form-input-text-with-border" data-classe="0">
						<label class="input-label"><span class="input-label-text"  style="opacity: 1;">${arrLang[$lang]["Break_label"]}</span> <span class="input-label-bg-mask"></span></label>
					</div>

					<div class="flex flex-form-group-container">

						<div class="form-group group dynamic-form-input-text-container-icon">
						<input type="text" class="input-text input-time input-time-from" required="" name="break_time_start" placeholder="Time" data-lang="${arrLang[$lang]["Time"]}" autocomplete="" autofill="off" style="opacity: 1;" data-classe="0" value="${$break_Time_Start}">
						<img class="icon button-icon caret-disable-rotate" src="assets/icons/time_icon.svg">
						</div>

						<div class="form-group group dynamic-form-input-text-container-icon">
						<input type="text" name="break_time_end" class="input-text input-time input-time-to" required="" placeholder="Time" data-lang="${arrLang[$lang]["Time"]} autocomplete="" autofill="off" style="opacity: 1;" data-classe="0" value="${$break_Time_End}">
						<img class="icon button-icon caret-disable-rotate" src="assets/icons/time_icon.svg">
						</div>

						<div class="square-button square-button-minus">
							<img class="icon" src="assets/icons/minus.svg">
						</div>

					</div>

				</div>

			</div>`;
}

/** maxOfTimePeriod **********/

function maxOfTimePeriod() {

	inputNames = ["morning_time_start", "morning_time_end", "evening_time_start", "evening_time_end"];

	inputNames.map((inputName) => {
		$(".row-schedule").each(function (ind, elm) {
			max = 0;
			if ($(elm).find("input[type='checkbox']").is(":checked")) {

				if ($(elm).find("input[name='" + inputName + "']").val()) {
					if ($(elm).find("input[name='" + inputName + "']").val() != "") {
						inputVal = $(elm).find("input[name='" + inputName + "']").val();
						if (stringTimeConvertor(inputVal) >= max) {
							max = stringTimeConvertor(inputVal);
							switch (inputName) {
								case 'morning_time_start': {
									$morning_From = inputVal;
									break;
								}
								case 'morning_time_end': {
									$morning_To = inputVal;
									break;
								}
								case 'evening_time_start': {
									$evening_From = inputVal;
									break;
								}
								case 'evening_time_end': {
									$evening_To = inputVal;
									break;
								}
							}
						}
					}
				}
			}
		});
	});

}

/** maxOfTimeBreak **********/

function maxOfTimeBreak() {

	maxBreakStart = 0;
	maxBreakEnd = 0 ;
	
	$(document).find(".row-schedule-breaks .dynamic-form-input").each(function (ind, elm) {
		
		if ($(elm).find("input[name='break_time_start']").val()) {
			inputVal = $(elm).find("input[name='break_time_start']").val(); 
			if (stringTimeConvertor(inputVal) >= maxBreakStart) {
					maxBreakStart = stringTimeConvertor(inputVal);
					$break_Time_Start = inputVal;
			}
		}

		if ($(elm).find("input[name='break_time_end']").val()) {
			inputVal = $(elm).find("input[name='break_time_end']").val();
			if (stringTimeConvertor(inputVal) >= maxBreakEnd) {
					maxBreakEnd = stringTimeConvertor(inputVal);
					$break_Time_End = inputVal;
			}
		}
			
	});

	console.log("maxOfTimeBreak =>", $break_Time_Start, " ", $break_Time_End);

}

/** #Schedule_Section #schedule-container .input-time prev **********/

$("#Schedule_Section #schedule-container").on("click",".input-time", function () {

	$val = $(this).parents(".dynamic-form-input-text-container-icon").prev(".dynamic-form-input-text-container-icon").find(".input-time").val();

	if ($(this).val() == "") {
		$(this).timepicker('option', 'minTime', $val)
			//.val($val)
			.trigger("focus");
	}

});

/** #ChangesModal .modal-confirm-button  */
$(document).on("click", "#ChangesModal .modal-confirm-button", function (event){

	switch ($oldActiveTab) {
		case '#Details_Section':
			updateDetails(event);
	    	break;
		case '#Academic_Year_Section':
			updateAY(event);
			break;
		case '#Level_Section':
			updateLevels(event);
			break;
		case '#Classe_Section':
			updateClasses(event);
			break;
		case '#Subject_Section':
			updateSubjects(event);
			break;
		case '#Expense_Section':
			updateExpenses(event);
			break;
		case '#Costs_Section':
			updateCosts(event);
			break;
		case '#Schedule_Section':
			updateSchedule(event);
			break;
		default:
			console.log(`Sorry, we are out of ${section}.`);
			break;
	}

	$domChange  = false;
	
});