/* eslint-disable no-undef */
$(document).ready(function() {
  $("#sortable").sortable({
    cursor: "move",
    update: function(event, ui) {
      let choicesOrder = $(this).sortable('toArray').toString();
      $('#ranking').val(choicesOrder);
      console.log(choicesOrder);
    }
  }).disableSelection();

});
