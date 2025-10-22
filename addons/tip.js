const TIPS = [
  "Сделай 10-минутный перерыв без экрана.",
  "Выключи уведомления хотя бы на час.",
  "Проведи завтрак без телефона.",
  "Отложи телефон на 30 минут перед сном.",
  "Проведи прогулку без телефона."
];
function showDailyTip(){
  const day = new Date().getDate();
  const tip = TIPS[day % TIPS.length];
  const div = document.createElement('div');
  div.className='reco';
  div.innerHTML=`<h3>Совет дня</h3><p>${tip}</p>`;
  document.querySelector('main').prepend(div);
}
document.addEventListener('DOMContentLoaded', showDailyTip);

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
