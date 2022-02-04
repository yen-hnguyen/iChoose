const assignChartParams = (optionParams, optionValues, ctx) => {
  const datas = {
    labels: optionParams,
    datasets: [{
      label: 'My First Dataset',
      data: optionValues,
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(1, 167, 1)'
      ],
      hoverOffset: 4
    }]
  };

  const options = {
    tooltips: {
      enabled: false
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          let datasets = ctx.chart.data.datasets;
          if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
            let sum = datasets[0].data.reduce((a, b) => a + b, 0);
            let percentage = Math.round((value / sum) * 100) + '%';
            console.log("p",percentage);
            return percentage;
          } else {
            return percentage;
          }
        },
        color: '#fff',
      }
    }
  };


  const myChart = new Chart(ctx, {
    type: 'pie',
    data: datas,
    options
  });

};
export { assignChartParams };
