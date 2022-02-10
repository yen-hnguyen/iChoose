const assignChartParams = (optionParams, optionValues, ctx) => {
  const data = {
    labels: optionParams,
    datasets: [{
      label: 'My First Dataset',
      data: optionValues,
      backgroundColor: [
        'rgb(206, 169, 188)',
        'rgb(132, 100, 160)',
        'rgb(10, 65, 122)',
        'rgb(114, 180, 235)',
        'rgb(32, 133, 236)'
      ],
      hoverOffset: 5
    }]
  };


  const config = {
    type: 'pie',
    data,
    options: {
      responsive: true,
      legend: {
        position: 'bottom',
        labels: {
          fontSize: 20,
      }
      },
      plugins: {
        title: {
          display: true,
          text: 'Chart.js Pie Chart'
        },
        datalabels: {
          formatter: (value, ctx) => {
            let datasets = ctx.chart.data.datasets;
            if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
              let sum = datasets[0].data.reduce((a, b) => a + b, 0);
              let percentage = Math.round((value / sum) * 100) + '%';
              return percentage;
            } else {
              return percentage;
            }
          },
          color: '#fff',
          font: {
            weight: 'bold',
            size: 20,
          }
        },
      }
    },
  };

  const actions = [
    {
      name: 'Position: bottom',
      handler(chart) {
        chart.options.plugins.legend.position = 'bottom';
        chart.update();
      }
    },
  ];

  const myChart = new Chart(ctx, config);

};
export { assignChartParams };
