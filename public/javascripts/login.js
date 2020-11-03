var getParams = function (url) {
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
};

var params = getParams(window.location.href);

if (params.redir)
{
	   $.ajax({
            type: 'post',
            url: '/token',
            data: {token:params.redir},
            dataType: 'json'
          })
          .done(function(res){
              if (res.exist)
              {
                $('#Login_Section').addClass('hidden');
				$('input[name=email]').val(res.email);
              } else {
               	window.location = '/';
              }
          });
}

  /* Login_Section_Btn _________________*/


  $(document).on("click","#Login_Section_Btn",function(event){

    // test if phone or email exist 
     $.ajax({
            type: 'post',
            url: '/verify',
            data: {
              email:$('input[name=email]').val(),
            },
            dataType: 'json'
          })
          .done(function(res){

              if (res.exist)
              {
                  $(".sub-container-form-footer").removeClass("show-footer");
          $(".sub-container-form-footer").addClass("hide-footer");
          $(".sections-main-sub-container-right-main").css("height",":calc(100%)");
                  owl.trigger('owl.next');
              } else {
                $("#Login_Section .sections-main-sub-container-right-main-note").removeClass("input-validation-error-feedback-hide");
        $("#Login_Section .sections-main-sub-container-right-main-note").addClass("input-validation-error-feedback-show");
              }
          });

    // On success 
    
    event.preventDefault();
    event.stopPropagation();

  });

  $(document).on("click","#Resend_Section_Btn",function(event){

    // test if phone or email exist 
     $.ajax({
            type: 'post',
            url: '/verify',
            data: {
              email:$('input[name=email]').val(),
            },
            dataType: 'json'
          })

  });


  /* End Login_Section_Btn ________________*/


  /* Code_Section_Btn ________________*/

    $(document).on("click","#Code_Section_Btn",function(event){

    
    // disable btn click and change arrow by spin while check login   => 

    $svg =` <svg class="icon button-icon button-icon-extra-style" version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
           width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
          <path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
            s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
            c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/>
          <path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
            C22.32,8.481,24.301,9.057,26.013,10.047z">
            <animateTransform attributeType="xml"
              attributeName="transform"
              type="rotate"
              from="0 20 20"
              to="360 20 20"
              dur="0.5s"
              repeatCount="indefinite"/>
            </path>
        </svg>`;

     $(this).find("img").replaceWith($svg);

    $.ajax({
            type: 'post',
            url: '/login',
            data: {
              code:$('input[name=code]').val(),
              email:$('input[name=email]').val()
            },
            dataType: 'json'
          })
          .done(function(res){

              if (res.login)
              {
                  window.location.href = '/Students';
              } else {
                // login failed : enable btn  => 
                console.log("Not Valide:");
                  $img =`<img class="icon button-icon" src="assets/icons/right_arrow.svg"> `;
                  $('#Code_Section_Btn').find("svg").replaceWith($img);
                  $('.input-user-code').addClass("input-validation-error");
                  $("#Code_Section .sections-main-sub-container-right-main-note").removeClass("input-validation-error-feedback-hide");
                  $("#Code_Section .sections-main-sub-container-right-main-note").addClass("input-validation-error-feedback-show");
              }
          });
  });

  /* End Code_Section_Btn ________________*/