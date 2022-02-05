import { assignChartParams } from "./chart_params.js"

const polls = document.getElementById("chosen-polls");
polls.style.display = "flex";
polls.style.justifyContent = "space-around";
polls.innerHTML = `
<div class="recent-polls" style="width: 425px;">
  <h5 id="title1"></h5>
  <canvas id="chart1" width="400" height="400"></canvas>
</div>
<div class="recent-polls" style="width: 425px;">
  <h5 id="title2"></h5>
  <canvas id="chart2" width="400" height="400"></canvas>
</div>
`;

const title1 = "Which movie to watch on the weekend?";
document.getElementById("title1").append(title1);
const title2 = "What's the lunch plan on Friday?";
document.getElementById("title2").append(title2);

const movieLabels = ["Matrix Revolutions", "Spiderman", "John Wick 4", "Avatar 2"];
const pollVotes1 = [5, 6, 4, 7];
const foodLabels = ["Sushi", "Tacos", "Pizza", "Ramen"];
const pollVotes2 = [5, 6, 4, 7];

const ctx = document.getElementById('chart1');
const ctx2 = document.getElementById('chart2');

assignChartParams(movieLabels, pollVotes1, ctx);
assignChartParams(foodLabels, pollVotes2, ctx2);



