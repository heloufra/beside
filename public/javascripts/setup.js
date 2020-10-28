$(document).on("click","#logout_btn",function(event){

    $.ajax({type: 'get',url: '/logout'});

  });

function readFile() {
  
  if (this.files && this.files[0]) {
    
    var FR= new FileReader();
    
    FR.addEventListener("load", function(e) {
      document.getElementById("output").src       = e.target.result;
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
          console.log("Subjects:",subjects);
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
            .map(function(){return $(this).val();}).get();
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
          .map(function(){return $(this).val();}).get();
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
          if (inputs[i] === "logo")
          $('.logo').css("border-color", "#f6b8c1");
          else
            $('input[name='+inputs[i]+']').css("border-color", "#f6b8c1");
          return;
        } else
        {
          $('.expensesInput').css("border-color", "#f6b8c1");
          return;
        }
      }
    }
    if (temp.logo)
      temp.logo = $('#output').attr("src");
  }

    data[value] = JSON.stringify(temp);
    saveData(value,data,next);
}

function saveData(value,data,next){
        
        if (value === "levels")
        {
           addLevels(JSON.parse(data.levels));
        }
        if (value === "expenses")
          addExpenses(JSON.parse(data.expenses));
        $("#"+value+ "-li img").attr("src", "assets/icons/sidebar_icons/validate.svg");
        $("#"+value +"-li span").attr("class", "side-bar-li-span-validate");
        $("#"+next+ "-li img").attr("src", "assets/icons/sidebar_icons/checked.svg");
        $("#"+next +"-li span").attr("class", "side-bar-li-span-active");
        if (value !== "costs")
        {
          nextItem();
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

function addExpenses(data) {
  $('.expense-items').remove();
  expenses = data.expenseName;
  if (Array.isArray(data.expenseName))
   for (var i = 0; i <= data.expenseName.length - 1; i++) {
    $('.expense-list').append('<li data-val="'+data.expenseName[i]+'" class="expense-items"><span class="expense_label">'+data.expenseName[i]+'</span><span class="method_label">'+data.expenseTime[i]+'</span></li>');
   }
  else
    $('.expense-list').append('<li data-val="'+data.expenseName+'" class="expense-items"><span class="expense_label">'+data.expenseName+'</span><span class="method_label">'+data.expenseTime+'</span></li>');
}
function hideSelected(value) {
    if (value && !value.selected) {
      return $('<span>' + value.text + '</span>');
    }
  }
function addLevels(data) {

  if (!Array.isArray(data.levelName))
    data.levelName = [data.levelName];
  if (levelsData.length === 0)
  {
    levelsData = data.levelName
    for (var i = 0; i < data.levelName.length; i++) {
          $('#classes').append('<div class="dynamic-form-input-container '+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName[i]+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input dynamic-form-input-first"><div class="form-group group"><input type="text" required name="classeName-'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"><label class="input-label"><span class="input-label-text">Classe name</span> <span class="input-label-bg-mask"></span></label></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg" ></div></div><div class="square-button square-button-extra-style square-button-plus" id="Classe_New_Dynamic_Form_Input"><img class="icon" src="assets/icons/plus.svg"></div></div>');
           $('#subjectsForm').append('<div class="dynamic-form-input-container '+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+' dynamic-form-input-container-extra-style"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName[i]+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input-dropdown-container"><div class="dynamic-form-input-dropdown dynamic-form-input-first subject-'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"><div class="dynamic-form-input"><div class="form-group group"><select class="js-example-data-array input-text-subject-select2" multiple name="language" id="subject-'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"></select><img class="icon button-icon" src="assets/icons/caret.svg"></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg"></div></div></div></div></div>');
          $('#costsForm').append('<div class="dynamic-form-input-container '+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+' dynamic-form-input-container-extra-style dynamic-form-input-container-extra-style-composed" id="costs-'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName[i]+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input-dropdown-container"><div class="dynamic-form-input-dropdown dynamic-form-input-first costs-'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"><div class="dynamic-form-input"><div class="form-group group form-group-left"><input type="text" class="input-dropdown" required name="costsName-'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"><label class="input-label"><span class="input-label-text">Expense Name</span> <span class="input-label-bg-mask"></span></label><img class="icon button-icon" src="assets/icons/caret.svg"><ul class="dynamic-form-input-dropdown-options expense-list"></ul></div><div class="form-group group form-group-right price-'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"><input type="number" class="input-text" required name="price-'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"><label class="input-label"><span class="input-label-text">Price</span> <span class="input-label-bg-mask"></span></label></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg"></div></div></div></div><div class="square-button square-button-extra-style square-button-plus" ><img class="icon" src="assets/icons/plus.svg"></div></div>');
        }
  } else
  {
      for (var i = 0; i < levelsData.length; i++) {
        if (!data.levelName.includes(levelsData[i]))
        {
          $('.'+levelsData[i].replace(/[^A-Z0-9]/ig, '')).remove();
        }
      }
      for (var i = 0; i < data.levelName.length; i++) {
        if (!levelsData.includes(data.levelName[i]))
        {
          $('#classes').append('<div class="dynamic-form-input-container '+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName[i]+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input dynamic-form-input-first"><div class="form-group group"><input type="text" required name="classeName-'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"><label class="input-label"><span class="input-label-text">Classe name</span> <span class="input-label-bg-mask"></span></label></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg" ></div></div><div class="square-button square-button-extra-style square-button-plus" id="Classe_New_Dynamic_Form_Input"><img class="icon" src="assets/icons/plus.svg"></div></div>');
          $('#subjectsForm').append('<div class="dynamic-form-input-container '+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+' dynamic-form-input-container-extra-style"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName[i]+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input-dropdown-container"><div class="dynamic-form-input-dropdown dynamic-form-input-first subject-'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"><div class="dynamic-form-input"><div class="form-group group"><select class="js-example-data-array input-text-subject-select2" multiple name="language" id="subject-'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"></select><img class="icon button-icon" src="assets/icons/caret.svg"></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg"></div></div></div></div></div>');
          $('#costsForm').append('<div class="dynamic-form-input-container '+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+' dynamic-form-input-container-extra-style dynamic-form-input-container-extra-style-composed" id="costs-'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName[i]+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input-dropdown-container"><div class="dynamic-form-input-dropdown dynamic-form-input-first costs-'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"><div class="dynamic-form-input"><div class="form-group group form-group-left"><input type="text" class="input-dropdown" required name="costsName-'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"><label class="input-label"><span class="input-label-text">Expense Name</span> <span class="input-label-bg-mask"></span></label><img class="icon button-icon" src="assets/icons/caret.svg"><ul class="dynamic-form-input-dropdown-options expense-list"></ul></div><div class="form-group group form-group-right price-'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"><input type="number" class="input-text" required name="price-'+data.levelName[i].replace(/[^A-Z0-9]/ig, '')+'"><label class="input-label"><span class="input-label-text">Price</span> <span class="input-label-bg-mask"></span></label></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg"></div></div></div></div><div class="square-button square-button-extra-style square-button-plus" ><img class="icon" src="assets/icons/plus.svg"></div></div>');
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
      tokenSeparators: [',', ' '],
        minimumResultsForSearch: -1,
        templateResult: hideSelected,
        placeholder: "Select items",
        templateSelection: function (data, container){
          console.log(">>Selection",data);
          $(container).attr("style","background-color:#"+Math.random().toString(16).substr(2,6)+"!important;");
        $tag_data = data;
          return data.text;
      }

    });

  }

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
          $(this).append('<option value="'+$tag_data.id+'">'+$tag_data.text+'</option>');
          $(this).trigger('change');
        }

      }
      
    });
    
    $tag_data ="";

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

function callSubjects() {
  $.ajax({
          type: 'get',
          url: '/setup/subjects',
        })
        .done(function(res){
          if (res.subjects.length > 0)
            $(".input-text-subject-select2").select2({
              data: res.subjects,
              tags: true,
              dropdownPosition: 'below',
              tokenSeparators: [',', ' '],
              minimumResultsForSearch: -1,
              templateResult: hideSelected,
              placeholder: "Select items",
              templateSelection: function (data, container) {
                console.log("Selection>>",data);
                  $(container).attr("style","background-color:"+data.color+"!important;");
                  return data.text;
              },
            })
        });
 
}

function hideSelected(value) {
      if (value && !value.selected) {
        return $('<span>' + value.text + '</span>');
      }
    }

function prev(value,prev) {
  $("#"+prev+ "-li img").attr("src", "assets/icons/sidebar_icons/checked.svg");
  $("#"+prev +"-li span").attr("class", "side-bar-li-span-active");
  $("#"+value+ "-li img").attr("src", "assets/icons/sidebar_icons/unchecked.svg");
  $("#"+value +"-li span").attr("class", "side-bar-li-span-inactive");
}

function nextItem() {
    owl.trigger('owl.next');
}
// Go to the previous item
$('.customPrevBtn').click(function() {
    owl.trigger('owl.prev');
})

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
