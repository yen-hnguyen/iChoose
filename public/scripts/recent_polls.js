import { assignChartParams } from "./chart_params.js"

$(document).ready(function () {

  //Adjust page refresh delay time
  // const delay = 15000;

  setTimeout(() => {
    addChartElement();
    createCharts();
  }, 0);

  // setInterval(() => {
  //   createCharts();
  // }, delay);

  const addChartElement = () => {
    const chosenPolls = $('<section id="chosen-polls"></section>');

    const body = $("body");
    body.append(chosenPolls);
  };

  const createCharts = () => {
    $("#chosen-polls").empty();

    //GET poll from JSON
    $.get("/polls/info", result => {
      const data = result.polls;
      let resultArr = [];

      data.forEach(obj => { 
        if (!resultArr[obj.id]) {
          resultArr[obj.id] = [];
        } 
        resultArr[obj.id].push(obj)
      })

      const finalArr = resultArr.filter(arr => arr.length > 0)
      const chart1 = finalArr[2];
      const chart2 = finalArr[1];
      const chart3 = finalArr[0];

      // Render the most recent chart
      const choiceArray = []
      const pointArray = []
      for (const obj of chart1) {
        choiceArray.push(obj.choice)
        pointArray.push(Number(obj.total_points))
      }
      const a1 = chart1[0].admin_link;
      renderPollData(chart1[0].description, a1);
      const ctx = document.getElementsByClassName("chart")[0];
      assignChartParams(choiceArray, pointArray, ctx);

      // Render second chart
      const choiceArray2 = []
      const pointArray2 = []
      for (const obj of chart2) {
        choiceArray2.push(obj.choice)
        pointArray2.push(Number(obj.total_points))
      }
      const a2 = chart2[0].admin_link;
      renderPollData(chart2[0].description, a2);
      const ctx2 = document.getElementsByClassName("chart")[1];
      assignChartParams(choiceArray2, pointArray2, ctx2);

      // Render the third chart
      const choiceArray3 = []
      const pointArray3 = []
      for (const obj of chart3) {
        choiceArray3.push(obj.choice)
        pointArray3.push(Number(obj.total_points))
      }   
      const a3 = chart3[0].admin_link;
      renderPollData(chart3[0].description, a3);
      const ctx3 = document.getElementsByClassName("chart")[2];
      assignChartParams(choiceArray3, pointArray3, ctx3);

    });
  };

  const renderPollData = (data, link) => {
    const polls = $("#chosen-polls");
    const pollElement = `
  <div class="recent-polls" style="width: 425px;">
   <a href=${link}><h5 class="title">${data}</h5></a>
   <canvas class="chart" width="400" height="400"></canvas>
  </div>
  `;
    polls.append(pollElement);
    $(".title").css({ "height": "85px" });
    $("a").css({ "text-decoration": "none" });
    polls.css({ "display": "flex", "justify-content": "space-around" });
  };

});
