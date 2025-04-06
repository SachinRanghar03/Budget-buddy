let chart;

function updateChart(filtered) {
  const ctx = document.getElementById('chart').getContext('2d');
  const categorySums = {};

  filtered.forEach(t => {
    const cat = t.category;
    if (!categorySums[cat]) categorySums[cat] = 0;
    categorySums[cat] += t.amount;
  });

  const labels = Object.keys(categorySums);
  const data = Object.values(categorySums).map(Math.abs);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#4caf50', '#f44336', '#2196f3', '#ff9800', '#9c27b0']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: {
          display: true,
          text: 'Expenses by Category'
        }
      }
    }
  });
}
