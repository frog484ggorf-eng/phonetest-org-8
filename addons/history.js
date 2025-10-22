function saveResult(score, answers){
  const results = JSON.parse(localStorage.getItem('history') || '[]');
  results.push({date: new Date().toLocaleString(), score});
  localStorage.setItem('history', JSON.stringify(results));
}
function showHistory(){
  const results = JSON.parse(localStorage.getItem('history') || '[]');
  if(results.length===0) return;
  const div = document.createElement('div');
  div.className = 'reco';
  div.innerHTML = '<h3>История прохождений</h3><ul>' + 
    results.map(r=>`<li>${r.date}: ${r.score} баллов</li>`).join('') + 
    '</ul>';
  document.getElementById('recommendations').appendChild(div);
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
