$(document).ready(function() {

  $(".poll-creation").submit(function(event) {
    event.preventDefault();

    console.log("Form submitted...ajax call")

    const newPoll = $(this).serialize();

    $.ajax({
      type: "POST",
      url: "/polls/new",
      data: newPoll
    }).then(response => {
      console.log("Successfully posted to the server using Ajax.");
      $.ajax({
        type: "GET",
        url: "http://localhost:8080/polls/new",
      }).then(response => {
        console.log("GET server using Ajax.");
      })
    });
});
});

