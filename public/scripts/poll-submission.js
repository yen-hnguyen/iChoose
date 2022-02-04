/* eslint-disable no-undef */
$(document).ready(function() {
  const addElements = function() {
    $("#user-votes").empty().append(
      `<li class="options" id="option1">Hawaii</li>
      <li class="options" id="option2">Tulum</li>
      <li class="options" id="option3">Dominican</li>
      <li class="options" id="option4">Bali</li>`
    );
  };

  addElements();
  $("#user-votes").sortable({
    cursor: "move",
  }).disableSelection();
});
