// Questions array (10 questions). Each is answered on scale 0..4 (0 - never, 4 - very often).
const QUESTIONS = [
  "Как часто вы проверяете телефон сразу после пробуждения?",
  "Как часто вы используете телефон перед сном?",
  "Как часто вы пролистываете социальные сети без конкретной цели?",
  "Как часто вы отвлекаетесь на телефон во время работы или учёбы?",
  "Как часто вы замечаете, что время в телефоне пролетело незаметно?",
  "Как часто вы используете телефон во время общения с друзьями/семьёй?",
  "Как часто вы проверяете уведомления сразу же после их появления?",
  "Как часто вы используете телефон во время приёма пищи?",
  "Как часто вы испытываете беспокойство, если надолго оставляете телефон в другой комнате?",
  "Как часто вы откладываете важные дела из-за времени в телефоне?"
];

const OPTIONS = [
  {label: "Никогда", value:0},
  {label: "Редко", value:1},
  {label: "Иногда", value:2},
  {label: "Часто", value:3},
  {label: "Очень часто", value:4}
];

const questionsList = document.getElementById('questionsList');
const quizForm = document.getElementById('quizForm');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const resultSection = document.getElementById('result');
const quizSection = document.getElementById('quiz');
const scoreText = document.getElementById('scoreText');
const recommendationsDiv = document.getElementById('recommendations');
const restartBtn = document.getElementById('restartBtn');

let answers = new Array(QUESTIONS.length).fill(null);
let current = 0;

function buildQuestions(){
  QUESTIONS.forEach((q, i) => {
    const li = document.createElement('li');
    li.className = 'question';
    li.dataset.index = i;
    li.style.display = i === 0 ? 'block' : 'none';
    li.innerHTML = `
      <p class="q-text">${i+1}. ${q}</p>
      <div class="options" data-index="${i}">
        ${OPTIONS.map(o => `<label class="option" data-value="${o.value}"><input type="radio" name="q${i}" value="${o.value}" />${o.label}</label>`).join('')}
      </div>
    `;
    questionsList.appendChild(li);
  });
}
function showQuestion(idx){
  const items = questionsList.querySelectorAll('.question');
  items.forEach((el,i) => {
    el.style.display = i === idx ? 'block' : 'none';
  });
  prevBtn.disabled = idx === 0;
  nextBtn.style.display = idx === QUESTIONS.length -1 ? 'none' : 'inline-block';
  submitBtn.style.display = idx === QUESTIONS.length -1 ? 'inline-block' : 'none';
}
function attachOptionHandlers(){
  questionsList.addEventListener('click', (e) => {
    const label = e.target.closest('.option');
    if(!label) return;
    const parent = label.parentElement;
    const qIdx = Number(parent.dataset.index);
    const value = Number(label.dataset.value);
    answers[qIdx] = value;
    // toggle selected class
    parent.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
    label.classList.add('selected');
  });
}
prevBtn.addEventListener('click', () => {
  if(current>0) current--;
  showQuestion(current);
});
nextBtn.addEventListener('click', () => {
  // if unanswered, mark as 0 automatically? We'll require user to pick; show alert if missing.
  if(answers[current] === null){
    alert('Пожалуйста, выберите вариант ответа для этого вопроса, прежде чем продолжить.');
    return;
  }
  if(current < QUESTIONS.length-1) current++;
  showQuestion(current);
});
quizForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // ensure all answered
  for(let i=0;i<QUESTIONS.length;i++){
    if(answers[i] === null){
      alert('Пожалуйста, ответьте на все вопросы перед отправкой.');
      // jump to first unanswered
      current = i;
      showQuestion(current);
      return;
    }
  }
  // compute score
  const total = answers.reduce((a,b)=>a+b,0);
  showResult(total, answers);
});

function showResult(score, answersArr){
  quizSection.style.display = 'none';
  resultSection.style.display = 'block';
  scoreText.innerHTML = `Ваш балл: <strong>${score}</strong> из ${QUESTIONS.length * 4}.`;
  recommendationsDiv.innerHTML = '';
  const level = interpretScore(score);
  const mainReco = document.createElement('div');
  mainReco.className = 'reco';
  mainReco.innerHTML = `<h3>${level.title}</h3><p>${level.desc}</p>`;
  recommendationsDiv.appendChild(mainReco);

  // Add specific tips
  const tips = generateTips(score, answersArr);
  tips.forEach(t => {
    const d = document.createElement('div');
    d.className = 'reco';
    d.innerHTML = `<strong>${t.title}</strong><p>${t.text}</p>`;
    recommendationsDiv.appendChild(d);
  });

  // small personalized note: if user often uses phone before sleep or immediately after waking, emphasize routines
  if(answersArr[0] >=3 || answersArr[1] >=3){
    const sleepTip = document.createElement('div');
    sleepTip.className = 'reco';
    sleepTip.innerHTML = `<strong>Режим сна и утро</strong><p>Старайтесь оставлять телефон вне зоны досягаемости за 30–60 минут до сна и первые 30 минут после пробуждения используйте для лёгкой утренней рутины без экрана.</p>`;
    recommendationsDiv.appendChild(sleepTip);
  }

  // actionable 7-day challenge
  const challenge = document.createElement('div');
  challenge.className = 'reco';
  challenge.innerHTML = `<strong>7-дневный челлендж</strong>
  <ol>
    <li>День 1: Включите ночной режим и отключите ненужные уведомления.</li>
    <li>День 2: Установите "безэкранное" время обеда — 30 минут без телефона.</li>
    <li>День 3: 1 час работы/учёбы без телефона (режим "Не беспокоить").</li>
    <li>День 4: Сократите время перед сном на 30 минут.</li>
    <li>День 5: Проведите встречу или разговор без телефона.</li>
    <li>День 6: Очистите домашний экран — оставьте только нужные приложения.</li>
    <li>День 7: Оцените прогресс — повторите тест.</li>
  </ol>`;
  recommendationsDiv.appendChild(challenge);

  // Offer download of personal summary
  const downloadBtn = document.createElement('button');
  downloadBtn.className = 'btn';
  downloadBtn.textContent = 'Скачать сводку (txt)';
  downloadBtn.addEventListener('click', () => {
    const summary = buildSummary(score, answersArr, level);
    const blob = new Blob([summary], {type: 'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'phone_test_summary.txt';
    a.click();
    URL.revokeObjectURL(url);
  });
  recommendationsDiv.appendChild(downloadBtn);
   


  // Scroll to top of results
  window.scrollTo({top:0,behavior:'smooth'});
}

function interpretScore(score){
  // score from 0..40
  if(score <= 12){
    return {
      title: 'Низкое использование',
      desc: 'Похоже, вы достаточно контролируете время с телефоном. Есть смысл поддерживать текущие привычки и периодически проверять уведомления/экранное время.'
    };
  } else if(score <= 24){
    return {
      title: 'Умеренное использование',
      desc: 'Вы проводите в телефоне чуть больше времени, чем оптимально. Небольшие изменения в рутинах могут помочь вернуть баланс.'
    };
  } else if(score <= 32){
    return {
      title: 'Высокое использование',
      desc: 'Телефон занимает значительную часть вашего времени. Рекомендуется внедрять чёткие ограничения и проверять причины — скука, прокрастинация, тревога.'
    };
  } else {
    return {
      title: 'Очень высокое использование',
      desc: 'Использование телефона может негативно влиять на сон, внимание и настроение. Рассмотрите более серьёзные шаги: лимиты, цифровой детокс, помощь специалиста при необходимости.'
    };
  }
}

function generateTips(score, answersArr){
  const tips = [];
  // General tips by score band
  if(score <= 12){
    tips.push({title:'Поддерживайте баланс', text:'Продолжайте использовать полезные привычки: цели на сессии в телефоне, отключение лишних уведомлений.'});
  } else if(score <= 24){
    tips.push({title:'Небольшие изменения', text:'Попробуйте установить лимиты на отдельные приложения и выделять "безэкранные" окна в день.'});
  } else if(score <= 32){
    tips.push({title:'Строгие границы', text:'Используйте системные таймеры, приложения-блокировщики и планируйте периоды глубокого внимания.'});
  } else {
    tips.push({title:'Серьёзные меры', text:'Подумайте об ограничении работы с соцсетями, цифровом детоксе и консультации с психологом при зависимости.'});
  }

  // Tips from specific behaviours
  if(answersArr[2] >=3){
    tips.push({title:'Соцсети', text:'Попробуйте лимит экранного времени для соцсетей, удалите лишние приложения или используйте версии браузера.'});
  }
  if(answersArr[3] >=3 || answersArr[9] >=3){
    tips.push({title:'Прокрастинация', text:'Отмечайте триггеры: какие задачи вы откладываете. Разбейте задачи на маленькие шаги и используйте метод Помодоро.'});
  }
  if(answersArr[6] >=3){
    tips.push({title:'Уведомления', text:'Отключите ненужные уведомления, включите приоритетные только для важных контактов.'});
  }
  if(answersArr[8] >=3){
    tips.push({title:'Тревога без телефона', text:'Практикуйте короткие перерывы без телефона, начинайте с 5–10 минут и постепенно увеличивайте.'});
  }

  return tips;
}

function buildSummary(score, answersArr, level){
  const lines = [];
  lines.push('СВОДКА ТЕСТА: Сколько вы сидите в телефоне');
  lines.push('-----------------------------------------');
  lines.push(`Дата: ${new Date().toLocaleString()}`);
  lines.push(`Баллы: ${score} из ${QUESTIONS.length*4}`);
  lines.push(`Уровень: ${level.title}`);
  lines.push('');
  lines.push('Ответы (в формате индекс: значение 0-4):');
  answersArr.forEach((v,i)=> lines.push(`${i+1}. ${QUESTIONS[i]} -> ${v}`));
  lines.push('');
  lines.push('Рекомендации (кратко):');
  lines.push(level.desc);
  return lines.join('\n');
}

document.addEventListener('DOMContentLoaded', () => {
  buildQuestions();
  attachOptionHandlers();
  showQuestion(0);
});

restartBtn.addEventListener('click', () => {
  // reset
  answers = new Array(QUESTIONS.length).fill(null);
  const optionEls = document.querySelectorAll('.option');
  optionEls.forEach(o => o.classList.remove('selected'));
  resultSection.style.display = 'none';
  quizSection.style.display = 'block';
  current = 0;
  showQuestion(current);
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
