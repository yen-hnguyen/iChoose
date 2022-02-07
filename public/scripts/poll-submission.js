/* eslint-disable no-undef */
$(document).ready(function() {
  // $.get("/polls/choice", data => {
  //   console.log("data is", data);
  //   addElements(data.polls);
  // });
  // const addElements = function(data) {
  //   $("#user-votes").empty().append(
  //     `<li class="options" id="option1">${data[0].title}</li>
  //     <li class="options" id="option2">${data[1].title}</li>
  //     <li class="options" id="option3">${data[2].title}</li>
  //     <li class="options" id="option4">${data[3].title}</li>`
  //   );
  // };

  $("#user-votes").sortable({
    cursor: "move",
  }).disableSelection();
});
