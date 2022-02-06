import { assignChartParams } from "./chart_params.js"

$(document).ready(function () {

  //GET poll from JSON
  $.get("/polls", data => {
    const choiceArray = getChoices(data.polls.slice(0,4));
    const pointArray = getPoints(data.polls.slice(0,4));

    renderPollData(data.polls[0].description);

    const ctx = document.getElementsByClassName("chart")[0];
    assignChartParams(choiceArray, pointArray, ctx);

    const choiceArray2 = getChoices(data.polls.slice(4));
    const pointArray2 = getPoints(data.polls.slice(4));

    renderPollData(data.polls[4].description);

    const ctx2 = document.getElementsByClassName("chart")[1];
    assignChartParams(choiceArray2, pointArray2, ctx2);


  });

  const getChoices = (data) => {
    const choiceArray = [];
    for (const choice of data) {
      choiceArray.push(choice.choice);
    }
    return choiceArray;
  }

  const getPoints = (data) => {
    const pointArray = [];
    for (const point of data) {
      pointArray.push(Number(point.total_points));
    }
    return pointArray;
  }

  const renderPollData = (data) => {
    const polls = $("#chosen-polls");
    const pollElement = `
  <div class="recent-polls" style="width: 425px;">
   <h5 class="title">${data}</h5>
   <canvas class="chart" width="400" height="400"></canvas>
  </div>
  `;
    polls.append(pollElement);
    polls.css({ "display": "flex", "justify-content": "space-around" });
  };

});






