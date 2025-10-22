const LANGS = {
  ru: {share:"Поделиться", result:"Ваш результат:"},
  en: {share:"Share", result:"Your result:"}
};
let currentLang = 'ru';
function switchLang(){
  currentLang = currentLang === 'ru' ? 'en' : 'ru';
  alert(`Language switched to ${currentLang.toUpperCase()}`);
}
document.addEventListener('DOMContentLoaded', ()=>{
  const btn = document.createElement('button');
  btn.className='btn';
  btn.textContent='EN / RU';
  btn.onclick=switchLang;
  document.body.prepend(btn);
});

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
