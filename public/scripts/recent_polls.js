import { assignChartParams } from "./chart_params.js"

$(document).ready(function () {

  //GET poll from JSON
  $.get("/polls", data => {

    const choiceArray = getChoices(data);
    const pointArray = getPoints(data);

    renderPollData(data.polls[0].description);

    const ctx = $('#chart1');
    assignChartParams(choiceArray, pointArray, ctx);

    const ctx2 = $('#chart2');
    assignChartParams(choiceArray, pointArray, ctx2);
  });

  const getChoices = (data) => {
    const choiceArray = [];
    for (const choice of data.polls) {
      choiceArray.push(choice.choice);
    }
    return choiceArray;
  }

  const getPoints = (data) => {
    const pointArray = [];
    for (const point of data.polls) {
      pointArray.push(Number(point.total_points));
    }
    return pointArray;
  }

  const renderPollData = (data) => {
    const polls = $("#chosen-polls");
    const pollElement = `
  <div class="recent-polls" style="width: 425px;">
   <h5 id="title1">${data}</h5>
   <canvas id="chart1" width="400" height="400"></canvas>
  </div>
  <div class="recent-polls" style="width: 425px;">
   <h5 id="title2">${data}</h5>
   <canvas id="chart2" width="400" height="400"></canvas>
  </div>
  `;
    polls.append(pollElement);
    polls.css({ "display": "flex", "justify-content": "space-around" });
  };

});






