import { assignChartParams } from "./chart_params.js"

$(document).ready(function () {

  const polls = $("#chosen-polls");
  const pollElement = `
  <div class="recent-polls" style="width: 425px;">
   <h5 id="title1">Which movie to watch on the weekend?</h5>
   <canvas id="chart1" width="400" height="400"></canvas>
  </div>
  <div class="recent-polls" style="width: 425px;">
   <h5 id="title2">What's the lunch plan on Friday?</h5>
   <canvas id="chart2" width="400" height="400"></canvas>
  </div>
  `;
  polls.append(pollElement);
  polls.css({"display": "flex", "justify-content": "space-around"});

  const movieLabels = ["Matrix Revolutions", "Spiderman", "John Wick 4", "Avatar 2"];
  const pollVotes1 = [5, 6, 4, 7];
  const foodLabels = ["Sushi", "Tacos", "Pizza", "Ramen"];
  const pollVotes2 = [5, 6, 4, 7];

  const ctx = $('#chart1');
  const ctx2 = $('#chart2');

  assignChartParams(movieLabels, pollVotes1, ctx);
  assignChartParams(foodLabels, pollVotes2, ctx2);
});




