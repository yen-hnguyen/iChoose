import { assignChartParams } from "./chart_params.js"

$(document).ready(function () {

  //GET poll from JSON
  $.get("/polls/info", data => {
    const choiceArray = getChoices(data.polls.slice(0,4));
    const pointArray = getPoints(data.polls.slice(0,4));
    const a1 = data.polls[0].admin_link;
    renderPollData(data.polls[0].description, a1);
    const ctx = document.getElementsByClassName("chart")[0];
    assignChartParams(choiceArray, pointArray, ctx);

    const choiceArray2 = getChoices(data.polls.slice(4, 8));
    const pointArray2 = getPoints(data.polls.slice(4, 8));
    const a2 = data.polls[4].admin_link;
    renderPollData(data.polls[4].description, a2);
    const ctx2 = document.getElementsByClassName("chart")[1];
    assignChartParams(choiceArray2, pointArray2, ctx2);

    const choiceArray3 = getChoices(data.polls.slice(8));
    const pointArray3 = getPoints(data.polls.slice(8));
    const a3 = data.polls[8].admin_link;
    renderPollData(data.polls[8].description, a3);
    const ctx3 = document.getElementsByClassName("chart")[2];
    assignChartParams(choiceArray3, pointArray3, ctx3);



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

  const renderPollData = (data, link) => {
    const polls = $("#chosen-polls");
    const pollElement = `
  <div class="recent-polls" style="width: 425px;">
   <a href=${link}><h5 class="title">${data}</h5></a>
   <canvas class="chart" width="400" height="400"></canvas>
  </div>
  `;
    polls.append(pollElement);
    $(".title").css({"height": "85px"});
    $("a").css({"text-decoration": "none"});
    polls.css({ "display": "flex", "justify-content": "space-around" });
  };

});






