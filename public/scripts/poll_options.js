/* eslint-disable no-undef */
$(document).ready(function() {
  $('#warning-comment').hide();
  $('#choice3').hide();
  $('#choice4').hide();
  $('#choice5').hide();
  let i = 3;

  $('#add-option-button').on("click", function() {
    if (i < 6) {
      $(`#choice${i}`).show();
      $(`#choice${i}`).focus();
      i++;
    } else {
      $('#warning-comment').show("slow");
      setTimeout(() => {
        $('#warning-comment').hide("slow");
      }, 3000);
    }
  });
});