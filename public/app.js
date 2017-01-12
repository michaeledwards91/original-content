$(document).ready(function() {

	// the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();

	$(document).on("click", ".notesBtn", function() {

		var articleId = $(this).attr("data-id");
		console.log(articleId);

		$.getJSON("/api/articles/"+articleId, function(data) {
			console.log(data);

			$("#modalHead").text("Notes for Article " + data._id);
		});

	});


});