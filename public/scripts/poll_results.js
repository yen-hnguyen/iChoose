import { assignChartParams } from "./chart_params.js"
$(document).ready(function () {
  const choices = $("#result-choice");
  const choiceArray = choices.html().split(",");
  const points = $("#result-points");
  const pointArray = points.html().split(",");

  const numPoint = [];
  pointArray.forEach(num => numPoint.push(Number(num)));
  console.log(numPoint);


  // const pollElement = `
  // <div class="poll-result" style="width: 425px;">
  // <canvas id="chart" width="400" height="400"></canvas>
  // </div>
  // `;
  const ctx = $('<canvas id="chart" width="400" height="400"></canvas>');
  const pieChart = $("#pie-chart");
  pieChart.css({ "width": "500px" });
  pieChart.append(ctx);

  assignChartParams(choiceArray, numPoint, ctx);


});



