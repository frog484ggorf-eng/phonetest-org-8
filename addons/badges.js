function checkBadges(score, answers){
  const badges = [];
  if(score < 10) badges.push('Осознанный пользователь');
  if(answers[0]>=3 && answers[1]>=3) badges.push('Ночной прокрутчик');
  if(answers[2]>=3) badges.push('Соцсеть-гуру');
  if(badges.length){
    const div = document.createElement('div');
    div.className='reco';
    div.innerHTML='<h3>Ваши бейджи:</h3>' + badges.map(b=>`<span class="badge">${b}</span>`).join(' ');
    document.getElementById('recommendations').appendChild(div);
  }
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
