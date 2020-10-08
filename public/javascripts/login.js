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
