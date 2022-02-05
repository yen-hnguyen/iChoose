import { assignChartParams } from "./chart_params.js"
$(document).ready(function() {

  const getPollData = () => {
    const ul2 = Array.from(document.getElementById("user-votes").children);
    const points = [];
    const labels = [];
    let point = 4;
    for (const item of ul2) {
      labels.push(item.innerHTML);
      points.push(point);
      point--;
    }
    return {labels, points};
  }


  $("button").click(function() {
    const {labels, points} = getPollData();
    $("#pie-chart").css({ "width": "500px" });
    const canvas = `<canvas id="chart1" width="400" height="400"></canvas>`;
    $("#pie-chart").append(canvas);
    const ctx = $('#chart1');
    assignChartParams(labels, points, ctx);
  });



});

