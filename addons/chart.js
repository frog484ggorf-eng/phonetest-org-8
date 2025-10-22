function showChart(answers) {
  const ctx = document.createElement('canvas');
  document.getElementById('recommendations').appendChild(ctx);
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: answers.map((_, i) => `Вопрос ${i+1}`),
      datasets: [{label: 'Ваши ответы', data: answers}]
    },
    options: {scales:{y:{beginAtZero:true,max:4}}}
  });
}

// === Диаграмма результатов ===
function showResultChart(score) {
    const container = document.getElementById('chartContainer');
    if (!container) return;
    container.style.display = 'block';

    const ctx = document.getElementById('resultChart').getContext('2d');

    let level;
    if (score < 30) level = 'Низкий уровень зависимости';
    else if (score < 60) level = 'Средний уровень зависимости';
    else level = 'Высокий уровень зависимости';

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Ваш уровень зависимости', 'Оставшийся баланс'],
            datasets: [{
                data: [score, 100 - score],
                backgroundColor: ['#4CAF50', '#E0E0E0']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                title: { display: true, text: level }
            }
        }
    });
}
