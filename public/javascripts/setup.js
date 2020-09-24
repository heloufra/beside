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

var owl = $('.owl-carousel');
owl.owlCarousel({
      slideSpeed : 300,
      singleItem:true,
      pagination: false,
      nav:true,
      mouseDrag:false,
});
// Go to the next item
function submit(value,inputs){
        var data = {};
        if (value === "subjects")
        {
          var levels = $('input[name="levelName"]').map(function(){return $(this).val();}).get();
          var subjects = {};
          for (var i = 0; i <= levels.length - 1; i++) {
            subjects[levels[i]]= $('#'+levels[i]).val();
          }
          data[value] = JSON.stringify(subjects);
        }
        else
          for (var i = inputs.length - 1; i >= 0; i--) {
            var values = $('input[name='+inputs[i]+']')
                .map(function(){return $(this).val();}).get();
            var filtered = values.filter(function (el) {
              return el != "";
            });
            data[inputs[i]] = filtered.length > 1 ? filtered : filtered[0];
          }
        console.log("Data::",data);
        $.ajax({
            type: 'post',
            url: '/setup/' + value,
            data: data,
            dataType: 'text'
        })
        .done(function(res){
            var result = JSON.parse(res);
            console.log(result);
            if (result.saved)
            {
              if (value === "levels")
              {
                addLevels(data);
              }
              if (value !== "costs")
                nextItem();
              $( ".alert-danger" ).remove();
              $("#"+value+ "-li img").attr("src", "assets/icons/sidebar_icons/checked.svg");
              $("#"+value +"-li span").attr("class", "side-bar-li-span-active");
            } else {
              $(".sub-container").prepend("<div style='position: absolute;width: 100%;' class='alert alert-danger' role='alert'>"+result.errors[0].errorDesc +"</div>");
            }
        });
    };

function addLevels(data) {
  $('.dynamic-form-input-container').remove();
                for (var i = 0; i <= data.levelName.length - 1; i++) {

                  $('#classes').append('<div class="dynamic-form-input-container"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName[i]+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input dynamic-form-input-first"><div class="form-group group"><input type="text" required name="classeName"><label class="input-label"><span class="input-label-text">Classe name</span> <span class="input-label-bg-mask"></span></label></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg" ></div></div><div class="square-button square-button-extra-style square-button-plus" id="Classe_New_Dynamic_Form_Input"><img class="icon" src="assets/icons/plus.svg"></div></div>');
                  $('#subjectsForm').append('<div class="dynamic-form-input-container dynamic-form-input-container-extra-style"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName[i]+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input-dropdown-container"><div class="dynamic-form-input-dropdown dynamic-form-input-first"><div class="dynamic-form-input"><div class="form-group group"><select class="input-text-subject-select2" multiple name="language" id="'+data.levelName[i]+'"><option value="Bangladesh">Bangladesh</option><option selected value="Barbados">Barbados</option><option selected value="Belarus">Belarus</option><option value="Belgium">Belgium</option></select><img class="icon button-icon" src="assets/icons/caret.svg"></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg"></div></div></div></div></div>');
                  $('#costsForm').append('<div class="dynamic-form-input-container dynamic-form-input-container-extra-style dynamic-form-input-container-extra-style-composed"><label class="input-label dynamic-form-input-container-label"><span class="input-label-text">'+data.levelName[i]+'</span> <span class="input-label-bg-mask"></span></label><div class="dynamic-form-input-dropdown-container"><div class="dynamic-form-input-dropdown dynamic-form-input-first"><div class="dynamic-form-input"><div class="form-group group form-group-left"><input type="text" class="input-dropdown" required name="costsName"><label class="input-label"><span class="input-label-text">Expense Name</span> <span class="input-label-bg-mask"></span></label><img class="icon button-icon" src="assets/icons/caret.svg"><ul class="dynamic-form-input-dropdown-options"><li data-val="Insurance fees"><span class="expense_label">Insurance fees</span><span class="method_label">Monthly</span></li><li data-val="School fees"><span class="expense_label">School fees</span><span class="method_label">Annual</span></li><li data-val="Transport fees"><span class="expense_label">Transport fees</span><span class="method_label">Monthly</span></li></ul></div><div class="form-group group form-group-right"><input type="text" class="input-text" required name="price"><label class="input-label"><span class="input-label-text">Price</span> <span class="input-label-bg-mask"></span></label></div><div class="square-button square-button-minus"><img class="icon" src="assets/icons/minus.svg"></div></div></div></div><div class="square-button square-button-extra-style square-button-plus" ><img class="icon" src="assets/icons/plus.svg"></div></div>');
                }

                if($(".input-text-subject").length > 0){
                  $(".input-text-subject").fastselect({
                     userOptionAllowed: true,
                     userOptionPrefix: 'new ',
                     noResultsText: 'No Data',
                     clearQueryOnSelect:true
                  });
                }

                if($(".input-text-subject-select2").length > 0){
                  $(".input-text-subject-select2").select2({
                    tags: true,
                    dropdownPosition: 'below',
                    tokenSeparators: [',', ' '],
                        minimumResultsForSearch: -1,
                        templateResult: hideSelected
                  });
                }

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

function hideSelected(value) {
      if (value && !value.selected) {
        return $('<span>' + value.text + '</span>');
      }
    }

function prev(value) {
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