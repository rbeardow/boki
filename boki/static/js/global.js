$(function() {
	var csrftoken = $('meta[name=csrf-token]').attr('content')
	$.ajaxSetup({
	    beforeSend: function(xhr, settings) {
	        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type)) {
	            xhr.setRequestHeader("X-CSRFToken", csrftoken)
	        }
	    }
	});
});

$(document).on('click', 'a[data-action]', function (e) {
  var href = $(this).attr('href');
  var protocol = this.protocol + '//';
  if (href.slice(protocol.length) !== protocol) {
    e.preventDefault();
    LocationApp.router.navigate(href);
  }
});