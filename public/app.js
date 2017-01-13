$(document).ready(function() {

	// the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();

	$(document).on("click", ".notesBtn", function() {

		var articleId = $(this).attr("data-id");
		console.log(articleId);

		$.getJSON("/api/populatedarticle/"+articleId, function(data) {
			console.log(data);

			$("#modalHead").text("Notes for Article " + data._id);
			$("#noteForm").attr("action", "/api/articles/"+articleId);

			//Build new collection items for each note, append into notes collection in modal
			for (var i = 0; i < data.notes.length; i++) {
				var newLi = $("<li></li>");
				newLi.addClass("collection-item");

				var lihtml = data.notes[i].body;
				lihtml = lihtml + "<a class='waves-effect waves-light btn deleteNoteBtn' href='/api/removenote/"+data.notes[i]._id+"''>Delete Note</a>"
				newLi.html(lihtml);

				$("#noteCollection").append(newLi);
			}
		});

	});


});