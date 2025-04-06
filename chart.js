let chart;

function updateChart(data) {
  const totals = {};
  data.forEach(t => {
    if (!totals[t.category]) totals[t.category] = 0;
    totals[t.category] += Math.abs(t.amount);
  });

  const ctx = document.getElementById('chart').getContext('2d');
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(totals),
      datasets: [{
        label: 'Expenses by Category',
        data: Object.values(totals),
        backgroundColor: ['#f94144', '#f3722c', '#f9c74f', '#90be6d', '#577590'],
      }]
    }
  });
}