const $logo = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTIwcHgiIGhlaWdodD0iMTIwcHgiIHZpZXdCb3g9IjAgMCAxMjAgMTIwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHRpdGxlPkxvZ28tcGxhY2Vob2xkZXI8L3RpdGxlPgogICAgPGcgaWQ9IkxvZ28tcGxhY2Vob2xkZXIiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUtQ29weS0xNyIgZmlsbC1ydWxlPSJub256ZXJvIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgcng9IjEiPjwvcmVjdD4KICAgICAgICA8ZyBpZD0iR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQwLjAwMDAwMCwgNDAuMDAwMDAwKSIgZmlsbD0iIzE1MUEzQiIgb3BhY2l0eT0iMC4yMDI2MTM0NjciPgogICAgICAgICAgICA8ZyBpZD0iSWNvbnMvSW1hZ2UiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTMwLjIzMzY2MTQsNi42NjY2NjY2NyBDMzEuOTQ1MzI5Miw2LjY2NjY2NjY3IDMzLjMzMzMzMzMsOC4wNTMxNDA1MSAzMy4zMzMzMzMzLDkuNzY3MTAzNzcgTDMzLjMzMzMzMzMsOS43NjcxMDM3NyBMMzMuMzMzMzMzMywzMC4yMjE0MTg4IEMzMy4zMzMzMzMzLDMxLjkzNjE0NzIgMzEuOTQ1MzI5MiwzMy4zMzMzMzMzIDMwLjIzMzY2MTQsMzMuMzMzMzMzMyBMMzAuMjMzNjYxNCwzMy4zMzMzMzMzIEw5Ljc3NzgxNjA0LDMzLjMzMzMzMzMgQzguMDY2MTQ4MjcsMzMuMzMzMzMzMyA2LjY2NjY2NjY3LDMxLjkzNjE0NzIgNi42NjY2NjY2NywzMC4yMjE0MTg4IEw2LjY2NjY2NjY3LDMwLjIyMTQxODggTDYuNjY2NjY2NjcsOS43NjYzMzg2IEM2LjY2NjY2NjY3LDguMDUzOTA1NjcgOC4wNjUzODMxMSw2LjY2NjY2NjY3IDkuNzc3ODE2MDQsNi42NjY2NjY2NyBMOS43Nzc4MTYwNCw2LjY2NjY2NjY3IFogTTE2Ljg2NDQ1MTcsMTcuMzU5NDczNiBDMTYuNTMzOTAxNywxNi44NDgxOCAxNS45Njc2ODE3LDE2LjU4NzA1OCAxNS40MDQ1MjIzLDE2LjY4ODEzNzUgQzE0Ljg0MTM2MywxNi43OTAwNTkzIDE0LjM4MDczNTQsMTcuMjMzOTY2NiAxNC4yMTU0NjAzLDE3LjgzNDU0NyBMMTQuMjE1NDYwMywxNy44MzQ1NDcgTDEwLjA0MTM1NzIsMjYuOTY0NTQ5IEM5Ljk1MjU5ODQzLDI3LjI5MDUzMDMgMTAuMDA4NDU1MywyNy42Mzc1Njk3IDEwLjE5MjA5NDIsMjcuOTEwNDg0MyBDMTAuMzc1NzMzMSwyOC4xODE3MTQxIDEwLjY2NTcyOTYsMjguMzMzMzMzMyAxMC45NzQwODk5LDI4LjMzMzMzMzMgTDEwLjk3NDA4OTksMjguMzMzMzMzMyBMMjguNTAxNjU5NywyOC4zMzMzMzMzIEMyOC44NTk3NTU2LDI4LjMzMzMzMzMgMjkuMTg4MDEwMSwyOC4xMjc4MDUxIDI5LjM1ODY0MTMsMjcuNzgwNzY1NiBDMjkuNTI4NTA3MywyNy40MzU0MTA4IDI5LjUxMjQzODksMjcuMDIwOTg1IDI5LjMxNjU1NzQsMjYuNjg5OTQ5OCBMMjkuMzE2NTU3NCwyNi42ODk5NDk4IEwyNi4wODA2ODY2LDIxLjIzODM5NzcgQzI1Ljg2MTA4NSwyMC44Njc3NzMxIDI1LjUxNTk5NjksMjAuNjEwMDIwNCAyNS4xMjE5Mzg0LDIwLjUyNDEwMjkgQzI0LjcyOTQxMDIsMjAuNDM3MzQzIDI0LjMyMTU3ODgsMjAuNTI3NDcyMiAyMy45ODk0OTg0LDIwLjc3NTk1OTIgTDIzLjk4OTQ5ODQsMjAuNzc1OTU5MiBMMjIuNDI3OTQ1OSwyMy4xODkyMzEzIEMyMS43NTY4OTg2LDIzLjY5Mjk0MzkgMjAuODQyNTI5OSwyMy41MTE4NDMyIDIwLjM3MDQyNDgsMjIuNzgxNTQ0MSBMMjAuMzcwNDI0OCwyMi43ODE1NDQxIFogTTI0LjE2NjY2NjcsMTEuNjY2NjY2NyBDMjIuNzg1OTU0OCwxMS42NjY2NjY3IDIxLjY2NjY2NjcsMTIuNzg1OTU0OCAyMS42NjY2NjY3LDE0LjE2NjY2NjcgQzIxLjY2NjY2NjcsMTUuNTQ3Mzc4NSAyMi43ODU5NTQ4LDE2LjY2NjY2NjcgMjQuMTY2NjY2NywxNi42NjY2NjY3IEMyNS41NDczNzg1LDE2LjY2NjY2NjcgMjYuNjY2NjY2NywxNS41NDczNzg1IDI2LjY2NjY2NjcsMTQuMTY2NjY2NyBDMjYuNjY2NjY2NywxMi43ODU5NTQ4IDI1LjU0NzM3ODUsMTEuNjY2NjY2NyAyNC4xNjY2NjY3LDExLjY2NjY2NjcgWiIgaWQ9IkNvbWJpbmVkLVNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==";

$Gloabl_Gallary = [];
$category_id = -1; 

$(document).on("click","#logout_btn",function(event){

  $.ajax({type: 'get',url: '/logout'});

  });
  
$( "#Details_Section input" ).change(function() {
 
});

function hideNext(id){

  var input = " input";

  if (id == "#subjectsForm") {
      input = " select";
  } else {
    if (id == "#Details_Section"){
       input = " input[type='text']";
    } else {
       input = " input";
    }
  }
  
  $(id + input).each(function () {

    if (id == "#subjectsForm" && $(this).val().length === 0) {
      $('.customNextBtn').addClass("hidden");
      return false;
    }
    else if (id == "#Details_Section")
    {
      if ($(this).val() && $("#subCategoriesList").select2('data').length > 0) {
        console.log($(this).attr("name"));
        $('.customNextBtn').removeClass("hidden Details_Section");
      } else {
        $('.customNextBtn').addClass("hidden Details_Section");
        return false;
      }
    }
    else
    {
      if ($(this).val()) {
        $('.customNextBtn').removeClass("hidden");
      } else {
        $('.customNextBtn').addClass("hidden");
        return false;
      }
    }

  });

}

function readFile() {
  
  if (this.files && this.files[0]) {
    
    var FR= new FileReader();
    
    FR.addEventListener("load", function(e) {
      document.getElementById("output").src = e.target.result;
    }); 
    
    FR.readAsDataURL( this.files[0] );
  }
  
}

document.getElementById("file").addEventListener("change", readFile);


// Go to the next item
var data = {};
var levelsData = [];
var expenses = [];

function submit(value,inputs,next){
  $( ".alert-danger" ).remove();
  var temp = {};
  if (value === "subjects")
  {
    var levels = JSON.parse(data.levels);
    if (!Array.isArray(levels.levelName))
      levels.levelName = [levels.levelName];
    for (var i = 0; i <= levels.levelName.length - 1; i++) {
      if ($('#subject-'+levels.levelName[i].replace(/[^A-Z0-9]/ig, '')).val().length > 0)
      {
        var subjects =  $('#subject-'+levels.levelName[i].replace(/[^A-Z0-9]/ig, '')).val();
        for (var j = subjects.length - 1; j >= 0; j--) {
          if (ValidateSubjects(subjects[j]))
          {
            $('.subject-'+levels.levelName[i].replace(/[^A-Z0-9]/ig, '')).css("border-color", "#EFEFEF");
          } else
          {
            $('.subject-'+levels.levelName[i].replace(/[^A-Z0-9]/ig, '')).css("border-color", "#f6b8c1");
            return;
          }
        }
         $('.subject-'+levels.levelName[i].replace(/[^A-Z0-9]/ig, '')).css("border-color", "#EFEFEF");
         temp[levels.levelName[i]]= $('#subject-'+levels.levelName[i].replace(/[^A-Z0-9]/ig, '')).val();
      }
      else {
        $('.subject-'+levels.levelName[i].replace(/[^A-Z0-9]/ig, '')).css("border-color", "#f6b8c1");
        return;
      }
    }
  } else if (value === "classes" || value === "costs")
  {
     var levels = JSON.parse(data.levels);
    if (!Array.isArray(levels.levelName))
      levels.levelName = [levels.levelName];
    for (var i = levels.levelName.length - 1; i >= 0; i--) {
      var tempo = {}
      for (var j = inputs.length - 1; j >= 0; j--) {
        var values = $('input[name='+inputs[j]+'-'+levels.levelName[i].replace(/[^A-Z0-9]/ig, '')+']')
          .map(function(){
              if($(this).attr("name") == "expenseTime" ){
                return $(this).attr("data-val");
              }else{
                return $(this).val();
              }
          }).get();
        var filtered = values.filter(function (el) {
          return el != "";
        });
        if (filtered.length > 0)
        {
          tempo[inputs[j]] = filtered.length > 1 ? filtered : filtered[0];
          $('input[name='+inputs[j]+'-'+levels.levelName[i].replace(/[^A-Z0-9]/ig, '')+']').css("border-color", "#EFEFEF");
          $('.costs-'+i).css("border-color", "#EFEFEF");
        }
        else
        {
          if (value === "costs")
          {
            $('.costs-'+i).css("border-color", "#f6b8c1");
            return;
          }
          else
          {
            $('input[name='+inputs[j]+'-'+levels.levelName[i].replace(/[^A-Z0-9]/ig, '')+']').css("border-color", "#f6b8c1");
            return;
          }
        }
      }
      temp[levels.levelName[i]] = tempo;
   }
  }
  else
  {
    var temp = {};
    for (var i = inputs.length - 1; i >= 0; i--) {
      var values = $('input[name='+inputs[i]+']')
          .map(function(){
            if($(this).attr("name") == "expenseTime" ){
              return $(this).attr("data-val");
            } else if($(this).attr("name") == "start" || $(this).attr("name") == "end"   ){
              return $(this).attr("data-val");
            }else{
              return $(this).val();
            }
          }).get();
      var filtered = values.filter(function (el) {
        return el != "";
      });
      if (value === "levels" && hasDuplicates(filtered))
      {
       $(".sub-container").prepend("<div style='position: absolute;width: 100%;' class='alert alert-danger' role='alert'>Levels Cannot be duplicated</div>");
       return;
      }
      if (filtered.length > 0)
      {
        temp[inputs[i]] = filtered.length > 1 ? filtered : filtered[0];
        $('input[name='+inputs[i]+']').css("border-color", "#EFEFEF");
        $('.expensesInput').css("border-color", "#EFEFEF");
        $('.logo').css("border-color", "#EFEFEF");
      }
      else
      {
        if (value !== "expenses")
        {
          if (inputs[i] === "logo"){
            $('.logo').css("border-color", "#f6b8c1");
          }
          else{
            $('input[name='+inputs[i]+']').css("border-color", "#f6b8c1");
            return;
          }
        } else
        {
          $('.expensesInput').css("border-color", "#f6b8c1");
          return;
        }
      }
    }
    if (temp.logo){
      temp.logo = $('#output').attr("src");
    }else{
      temp.logo = $logo;
    }
  }

  /****** detail ************/
  if (value === "detail") {
    temp.category_id = $category_id;
    subCategoriesId = [];
    $("#subCategoriesList").select2('data').map((elm,ind) => {
      subCategoriesId.push(elm.id);
    })
    temp.subCategoriesId = subCategoriesId;
  }
  /****** detail ************/

  data[value] = JSON.stringify(temp);
  console.log("temp=>", temp);
  saveData(value, data, next);
  
}

function saveData(value,data,next){
        
        if (value === "levels")
        {
           addLevels(JSON.parse(data.levels));
        }
        if (value === "expenses")
          addExpenses(JSON.parse(data.expenses),JSON.parse(data.levels));
        $("#"+value+ "-li img").attr("src", "assets/icons/sidebar_icons/validate.svg");
        $("#"+value +"-li span").attr("class", "side-bar-li-span-validate");
        $("#"+next+ "-li img").attr("src", "assets/icons/sidebar_icons/checked.svg");
        $("#"+next +"-li span").attr("class", "side-bar-li-span-active");
        if (value !== "costs")
        {
          nextItem(next);
        }
        else {
           $.ajax({
            type: 'post',
            url: '/setup/save',
            data: data,
            dataType: 'json'
          })
          .done(function(res){
              if (res.saved)
              {
                window.location = '/?redir='+res.token;
              } else {
                console.log(res);
                $(".sub-container").prepend("<div style='position: absolute;width: 100%;' class='alert alert-danger' role='alert'>Email Already Exist</div>");
              }
          });
        }
};

function ValidateEmail(mail)
{
 if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))
  {
    return (true)
  }
    alert("You have entered an invalid email address!")
    return (false)
}

function ValidateSubjects(subject) 
{
 if (/[a-zA-Z]{2,}/.test(subject))
  {
    return (true)
  }
    return (false)
}

var costId = '#costsForm';
function addExpenses(dataE,data) {
  
  $('.expense-items').remove();
   if (!Array.isArray(data.levelName))
    data.levelName = [data.levelName];
  for (var j = 0; j <= data.levelName.length - 1; j++) {
    if (Array.isArray(dataE.expenseName)){
       for (var i = 0; i <= dataE.expenseName.length - 1; i++) {
       $('#costsForm').find('.'+data.levelName[j].replace(/[^A-Z0-9]/ig, '')).prepend('<div class="dynamic-form-input-dropdown-container expense-items"> <div class="dynamic-form-input-dropdown  costs-'+data.levelName[j].replace(/[^A-Z0-9]/ig, '')+'"> <div class="dynamic-form-input"><div class="form-group group form-group-left"><input readonly oninput="hideNext(\''+ costId + '\')" type="text" value="'+dataE.expenseName[i]+'" class="input-text" required name="costsName-'+data.levelName[j].replace(/[^A-Z0-9]/ig, '')+'"> <label class="input-label"><span class="input-label-text" data-lang="Expense_name">Expense Name</span> </div> <div class="form-group group form-group-right price-'+data.levelName[j].replace(/[^A-Z0-9]/ig, '')+'"> <input oninput="hideNext(\''+ costId + '\')" type="number" class="input-text" required name="price-'+data.levelName[j].replace(/[^A-Z0-9]/ig, '')+'"><label class="input-label"> <span class="input-label-text" data-lang="Price">Price</span> <span class="input-label-bg-mask"></span></label> </div> <div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg"></div> </div> </div> </div>');
       }
    }
    else{
      $('#costsForm').find('.'+data.levelName[j].replace(/[^A-Z0-9]/ig, '')).prepend('<div class="dynamic-form-input-dropdown-container expense-items"> <div class="dynamic-form-input-dropdown costs-'+data.levelName[j].replace(/[^A-Z0-9]/ig, '')+'"> <div class="dynamic-form-input"><div class="form-group group form-group-left"><input readonly oninput="hideNext(\''+ costId + '\')" type="text" value="'+dataE.expenseName+'" class="input-text" required name="costsName-'+data.levelName[j].replace(/[^A-Z0-9]/ig, '')+'"> <label class="input-label"><span class="input-label-text" data-lang="Expense_name">Expense Name</span> </div> <div class="form-group group form-group-right price-'+data.levelName[j].replace(/[^A-Z0-9]/ig, '')+'"> <input oninput="hideNext(\''+ costId + '\')" type="number" class="input-text" required name="price-'+data.levelName[j].replace(/[^A-Z0-9]/ig, '')+'"><label class="input-label"> <span class="input-label-text" data-lang="Price">Price</span> <span class="input-label-bg-mask"></span></label> </div> <div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg"></div> </div> </div> </div>');
    }
  }
  $('#costsForm').find(".input-label").addClass("input-label-move-to-top");
  expenses = dataE;
  $("body").trigger("domChanged");
}

/* Costs Section _______________________*/
  $(document).on("click","#Costs_Section .square-button-plus",function(){
     var htmlLi = '';
     var filtred =[];
     $(this).parent().find('.form-group-left input').each(function() {
          filtred.push($(this).val());
     })
      $(this).parents(".dynamic-form-input-container-extra-style-composed").find(".dynamic-form-input-dropdown").removeClass("dynamic-form-input-first");
      for (var i = expenses.expenseName.length - 1; i >= 0; i--) {
        if (filtred.includes(expenses.expenseName[i])){
          htmlLi += '<li data-val="'+expenses.expenseName[i]+'" class="hidden"> <span class="expense_label">'+expenses.expenseName[i]+'</span><span class="method_label">'+expenses.expenseTime[i]+'</span></li>';
        }
        else{
          htmlLi += '<li data-val="'+expenses.expenseName[i]+'"> <span class="expense_label">'+expenses.expenseName[i]+'</span><span class="method_label">'+expenses.expenseTime[i]+'</span></li>';
        }
      }
      $(this).before('<div class="dynamic-form-input-dropdown-container"> <div class="dynamic-form-input-dropdown costs-'+$(this).parent().attr('data-level')+'"> <div class="dynamic-form-input"> <div class="form-group group form-group-left"> <input type="text" oninput="hideNext(\''+ costId + '\')" class="input-dropdown" name="costsName-'+$(this).parent().attr('data-level')+'" required> <label class="input-label"><span class="input-label-text" data-lang="Expense_name">Expense Name</span> <span class="input-label-bg-mask"></span></label> <img class="icon button-icon" src="assets/icons/caret.svg"> <ul class="dynamic-form-input-dropdown-options">'+htmlLi+'</ul> </div> <div class="form-group group form-group-right"> <input type="text" class="input-text" name="price-'+$(this).parent().attr('data-level')+'" required> <label class="input-label"><span class="input-label-text" data-lang="Price">Price</span> <span class="input-label-bg-mask"></span></label> </div> <div class="square-button square-button-minus"> <img class="icon" src="assets/icons/minus.svg"> </div> </div> </div> </div>');
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

function hideSelected(value) {
    if (value && !value.selected) {
      return $('<span>' + value.text + '</span>');
    }
  }

  /*

  
  */
function addLevels(data) {

  if (!Array.isArray(data.levelName))
    data.levelName = [data.levelName];
  if (levelsData.length === 0)
  {
    levelsData = data.levelName
    var classeId = '#classes';
    var costId = '#costsForm';
    var SubjectID = '#subjectsForm';
    for (var i = 0; i < data.levelName.length; i++) {
          $('#classes').append('<div class="dynamic-form-input-container '+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName[i]+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input dynamic-form-input-first"><div class="form-group group"><input oninput="hideNext(\''+ classeId + '\')" type="text" required name="classeName-'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"><label class="input-label"><span class="input-label-text" data-lang="Class_name">Classe name</span> <span class="input-label-bg-mask"></span></label></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg" ></div></div><div class="square-button square-button-extra-style square-button-plus" id="Classe_New_Dynamic_Form_Input"><img class="icon" src="assets/icons/plus.svg"></div></div>');
           $('#subjectsForm').append('<div class="dynamic-form-input-container '+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+' dynamic-form-input-container-extra-style"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName[i]+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input-dropdown-container"><div class="dynamic-form-input-dropdown dynamic-form-input-first subject-'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"><div class="dynamic-form-input"><div class="form-group group"><select onchange="hideNext(\''+ SubjectID + '\')" class="js-example-data-array input-text-subject-select2" multiple name="language" id="subject-'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"></select><img class="icon button-icon" src="assets/icons/caret.svg"></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg"></div></div></div></div></div>');
          $('#costsForm').append('<div class="dynamic-form-input-container '+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+' dynamic-form-input-container-extra-style dynamic-form-input-container-extra-style-composed" data-level="'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'" id="costs-'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName[i]+'</span> <span class="input-label-bg-mask"></span></label><div class="square-button square-button-extra-style square-button-plus" ><img class="icon" src="assets/icons/plus.svg"></div></div>');
        }
  } else
  {
      var classeId = '#classes';
      var costId = '#costsForm';
      var SubjectID = '#subjectsForm';
      
      for (var i = 0; i < levelsData.length; i++) {
        if (!data.levelName.includes(levelsData[i]))
        {
          $('.'+levelsData[i].replace(/[^A-Z0-9]/ig, '')).remove();
        }
      }
      for (var i = 0; i < data.levelName.length; i++) {
        if (!levelsData.includes(data.levelName[i]))
        {
          $('#classes').append('<div class="dynamic-form-input-container '+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName[i]+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input dynamic-form-input-first"><div class="form-group group"><input oninput="hideNext(\''+ classeId + '\')" type="text" required name="classeName-'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"><label class="input-label"><span class="input-label-text" data-lang="Class_name" >Classe name</span> <span class="input-label-bg-mask"></span></label></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg" ></div></div><div class="square-button square-button-extra-style square-button-plus" id="Classe_New_Dynamic_Form_Input"><img class="icon" src="assets/icons/plus.svg"></div></div>');
          $('#subjectsForm').append('<div class="dynamic-form-input-container '+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+' dynamic-form-input-container-extra-style"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName[i]+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input-dropdown-container"><div class="dynamic-form-input-dropdown dynamic-form-input-first subject-'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"><div class="dynamic-form-input"><div class="form-group group"><select onchange="hideNext(\''+ SubjectID + '\')" class="js-example-data-array input-text-subject-select2" multiple name="language" id="subject-'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"></select><img class="icon button-icon" src="assets/icons/caret.svg"></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg"></div></div></div></div></div>');
          $('#costsForm').append('<div class="dynamic-form-input-container '+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+' dynamic-form-input-container-extra-style dynamic-form-input-container-extra-style-composed" data-level="'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'" id="costs-'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName[i]+'</span> <span class="input-label-bg-mask"></span></label><div class="square-button square-button-extra-style square-button-plus" ><img class="icon" src="assets/icons/plus.svg"></div></div>');
        }
      }
    levelsData = data.levelName;

  }

  callSubjects();
   if($(".input-text-subject").length > 0){
    $(".input-text-subject").fastselect({
       userOptionAllowed: true,
       userOptionPrefix: 'new ',
       noResultsText: 'No Data',
       clearQueryOnSelect:true
    });
  }

  /****** append new options to all dropdown *********/

  $tag_data = "";

  if($(".input-text-subject-select2").length > 0){

    $(".input-text-subject-select2").select2({
      tags: true,
      dropdownPosition: 'below',
      tokenSeparators: [','],
        minimumResultsForSearch: -1,
        templateResult: hideSelected,
        placeholder: "",
        templateSelection: function (data, container){
          //$(container).attr("style","background-color:#"+Math.random().toString(16).substr(2,6)+"!important;");
          $tag_data = data;
          return data.text;
      }

    });

  }

  $("body").trigger("domChanged");

  /****** trigger changes on select **************/

  $('.input-text-subject-select2').on('select2:select', function (e) {

    $dataSelect2Id = $(this).attr("data-select2-id");
    $('.input-text-subject-select2').each(function(){

      $this  = $(this);
      $exist = false;

      $dataSelect2IdCurrent = $(this).attr("data-select2-id");

      if($dataSelect2Id != $dataSelect2IdCurrent){

        $select2Data = $(this).select2('data');

        for($i = 0 ; $i < $select2Data.length; $i++){

            if (String($select2Data[$i].text).toLowerCase() == String($tag_data.text).toLowerCase()) {
                $exist = true;
                break;
            }

        }

        if(!$exist){
          var newOption = new Option($tag_data.text, $tag_data.id, false, false);
          $(this).append(newOption).trigger('change');
        }

      }
      
    });
    
    $tag_data ="";

  });


$tag_data_unselect ="";

  $(".input-text-subject-select2").on("select2:unselect", (e) => {

    $tag_data_unselect = e.params.data;

  });

  $('.input-text-subject-select2').on('select2:open', function (e) {

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
      $(this).append(newOption).trigger('change');
    }

    $tag_data_unselect = "" ;

  });
  /****** End append new options to all dropdown *********/

  if($(".input-text-month-select2").length > 0){
    $(".input-text-month-select2").select2({
      tags: true,
      dropdownPosition: 'below'
      /*tokenSeparators: [',', ' '],
          minimumResultsForSearch: -1,
          templateResult: hideSelected*/
    });
  }

  if($(".input-text-year-select2").length > 0){
    $(".input-text-year-select2").select2({
      tags: true,
      dropdownPosition: 'below'
      /*tokenSeparators: [',', ' '],
          minimumResultsForSearch: -1,
          templateResult: hideSelected*/
    });
  }
}


$tag_data = "";
function callSubjects() {
  $.ajax({
          type: 'get',
          url: '/setup/subjects',
          cache:true
        })
        .done(function(res){
          console.log("data fetching", res);
          if (Object.keys(res).length ){
          //if (typeof res.subjects.length !== 'undefined' ){
              if (res.subjects.length > 0){
                $(".input-text-subject-select2").select2({
                  data: res.subjects,
                  tags: true,
                  dropdownPosition: 'below',
                  tokenSeparators: [','],
                  minimumResultsForSearch: -1,
                  templateResult: hideSelected,
                  placeholder: "",
                  templateSelection: function (data, container) {
                    $tag_data = data;
                      $(container).attr("style","background-color:"+data.color+"!important;");
                      return data.text;
                  },
                })
              }
          }

        });
 
}

function hideSelected(value) {
      if (value && !value.selected) {
        return $('<span>' + value.text + '</span>');
      }
    }

function prev(value,prev,section) {
  $("#"+prev+ "-li img").attr("src", "assets/icons/sidebar_icons/checked.svg");
  $("#"+prev +"-li span").attr("class", "side-bar-li-span-active");
  $("#"+value+ "-li img").attr("src", "assets/icons/sidebar_icons/unchecked.svg");
  $("#"+value +"-li span").attr("class", "side-bar-li-span-inactive");
  $("#"+section+" .customNextBtn").removeClass("hidden");
}

function nextItem(next) {
    owl.trigger('owl.next');
    $('.customNextBtn').addClass("hidden");
    autoValidForm(next);
}

// Go to the previous item
$('.customPrevBtn').click(function() {
    owl.trigger('owl.prev');
});

function checkIfArrayIsUnique(myArray) {
  return myArray.length === new Set(myArray).size;
}

function hasDuplicates(array) {
    var valuesSoFar = Object.create(null);
    for (var i = 0; i < array.length; ++i) {
        var value = array[i].replace(/[^A-Z0-9]/ig, '');
        if (value in valuesSoFar) {
            return true;
        }
        valuesSoFar[value] = true;
    }
    return false;
}

/**** Institution Categories **********************/

$(document).on("click","#categoriesList li",function () {
  $category_id = $(this).attr("data-categoryid");
  loadSubCategories();
})

var categories_list = [];

function getAllCategories(){

	categoriesList = '';

	$.ajax({
	    type: 'post',
	    url: '/setup/categories',
	    data: {},
	    dataType: 'json'
  })
  .done(function (res) {
      if (res.categories) {
        categories_list = res.categories;
        for (var n = res.categories.length - 1; n >= 0; n--){
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
        url: '/setup/subCategories',
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
              console.log("res.subCategories[i].ISC_Label =>",res.subCategories[i].ISC_Label," ",String(res.subCategories[i].ISC_Label).replace(/\s/g, "_"));
              $("#subCategoriesList").append('<option class="row-classe" data-lang='+$label+' value="'+res.subCategories[i].ISC_ID+'">'+$label+'</option>');
          }
        }
      });
}

function categoriesChange(category) {

  var value = category.value;

  hideNext('#Details_Section');

  if($(category).parents("#Details_Section").length){
  	$("#Details_Section .dynamic-form-input-dropdown-options li").each(function(){
  		if(value == $(this).text()){
  			$(this).addClass("visibility");
  		}else{
  			$(this).removeClass("visibility");
  		}
  	});
  }
}

function autoValidForm(next){
  switch(next){
    case 'academic':{
      autoSubmitValidator('academic',['year','start','end','year_start','year_end'],'levels','Academic_Year_Section');
      break;
    }
    case 'levels':{
      autoSubmitValidator('levels',['levelName'],'classes','Level_Section');
      break;
    }
    case 'classes':{
      autoSubmitValidator('classes',['classeName'],'subjects','Classe_Section');
      break;
    }
    case 'subjects':{
      autoSubmitValidator('subjects',['language'],'expenses','Subject_Section');
      break;
    }
    case 'expenses':{
      autoSubmitValidator('expenses',['expenseName','expenseTime'],'costs','Expense_Section');
      break;
    }
    case 'costs':{
      autoSubmitValidator('costs',['costsName','price'],'cost','Costs_Section');
      break;
    }
    default:{
      autoSubmitValidator('detail',['school','email','phone','address','logo','category'],'academic','Details_Section');
      break;
    }
  }
}

/****** autoSubmitValidator  **********/

function autoSubmitValidator(value,inputs,next,section){
  $( ".alert-danger" ).remove();
  var temp = {};
  if (value === "subjects")
  {
    var levels = JSON.parse(data.levels);
    if (!Array.isArray(levels.levelName))
      levels.levelName = [levels.levelName];
    for (var i = 0; i <= levels.levelName.length - 1; i++) {
      if ($('#subject-'+levels.levelName[i].replace(/[^A-Z0-9]/ig, '')).val().length > 0)
      {
        var subjects =  $('#subject-'+levels.levelName[i].replace(/[^A-Z0-9]/ig, '')).val();
        for (var j = subjects.length - 1; j >= 0; j--) {
          if (ValidateSubjects(subjects[j])) {
          } else {
            return;
          }
        }
         temp[levels.levelName[i]]= $('#subject-'+levels.levelName[i].replace(/[^A-Z0-9]/ig, '')).val();
      }
      else {
        return;
      }
    }
  } else if (value === "classes" || value === "costs")
  {
     var levels = JSON.parse(data.levels);
    if (!Array.isArray(levels.levelName))
      levels.levelName = [levels.levelName];
    for (var i = levels.levelName.length - 1; i >= 0; i--) {
      var tempo = {}
      for (var j = inputs.length - 1; j >= 0; j--) {
        var values = $('input[name='+inputs[j]+'-'+levels.levelName[i].replace(/[^A-Z0-9]/ig, '')+']')
          .map(function(){
              if($(this).attr("name") == "expenseTime" ){
                return $(this).attr("data-val");
              }else{
                return $(this).val();
              }
          }).get();
        var filtered = values.filter(function (el) {
          return el != "";
        });
        if (filtered.length > 0)
        {
          tempo[inputs[j]] = filtered.length > 1 ? filtered : filtered[0];
        }
        else
        {
          if (value === "costs"){
            return;
          }
          else {
            return;
          }
        }
      }
      temp[levels.levelName[i]] = tempo;
   }
  }
  else
  {
    var temp = {};
    for (var i = inputs.length - 1; i >= 0; i--) {
      var values = $('input[name='+inputs[i]+']')
          .map(function(){
            if($(this).attr("name") == "expenseTime" ){
              return $(this).attr("data-val");
            } else if($(this).attr("name") == "start" || $(this).attr("name") == "end"   ){
              return $(this).attr("data-val");
            }else{
              return $(this).val();
            }
          }).get();
      var filtered = values.filter(function (el) {
        return el != "";
      });
      if (value === "levels" && hasDuplicates(filtered)){
       return;
      }
      if (filtered.length > 0){
        temp[inputs[i]] = filtered.length > 1 ? filtered : filtered[0];
      }
      else
      {
        if (value !== "expenses")
        {
          if (inputs[i] === "logo"){
          }
          else{
            return;
          }
        } else {
          return;
        }
      }
    }
    if (temp.logo){
      temp.logo = $('#output').attr("src");
    }else{
      temp.logo = $logo;
    }
  }

  /****** detail ************/
  if (value === "detail") {
    temp.category_id = $category_id;
    subCategoriesId = [];
    $("#subCategoriesList").select2('data').map((elm,ind) => {
      subCategoriesId.push(elm.id);
    })
    temp.subCategoriesId = subCategoriesId;
  }

  /****** customNextBtn ************/
  $('#'+section+' .customNextBtn').removeClass("hidden");
  
}

$("#subCategoriesList").on("change", function (event) {
  console.log($("#subCategoriesList").select2('data'));
  hideNext("#Details_Section");
});