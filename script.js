const LEVELS = 10;
const QUESTIONS_PER_LEVEL = 5;
const TOTAL_QUESTIONS = LEVELS * QUESTIONS_PER_LEVEL;
const GAME_SECONDS = 300;

const words = [
  { en: "apple", zh: "苹果" },
  { en: "banana", zh: "香蕉" },
  { en: "pear", zh: "梨" },
  { en: "orange", zh: "橙子" },
  { en: "watermelon", zh: "西瓜" },
  { en: "grape", zh: "葡萄" },
  { en: "peach", zh: "桃子" },
  { en: "cat", zh: "猫" },
  { en: "dog", zh: "狗" },
  { en: "bird", zh: "鸟" },
  { en: "fish", zh: "鱼" },
  { en: "rabbit", zh: "兔子" },
  { en: "panda", zh: "熊猫" },
  { en: "tiger", zh: "老虎" },
  { en: "lion", zh: "狮子" },
  { en: "book", zh: "书" },
  { en: "pen", zh: "钢笔" },
  { en: "pencil", zh: "铅笔" },
  { en: "ruler", zh: "尺子" },
  { en: "eraser", zh: "橡皮" },
  { en: "schoolbag", zh: "书包" },
  { en: "classroom", zh: "教室" },
  { en: "teacher", zh: "老师" },
  { en: "student", zh: "学生" },
  { en: "friend", zh: "朋友" },
  { en: "father", zh: "爸爸" },
  { en: "mother", zh: "妈妈" },
  { en: "brother", zh: "兄弟" },
  { en: "sister", zh: "姐妹" },
  { en: "grandpa", zh: "爷爷" },
  { en: "grandma", zh: "奶奶" },
  { en: "red", zh: "红色" },
  { en: "blue", zh: "蓝色" },
  { en: "green", zh: "绿色" },
  { en: "yellow", zh: "黄色" },
  { en: "black", zh: "黑色" },
  { en: "white", zh: "白色" },
  { en: "morning", zh: "早上" },
  { en: "afternoon", zh: "下午" },
  { en: "evening", zh: "晚上" },
  { en: "rainy", zh: "下雨的" },
  { en: "sunny", zh: "晴朗的" },
  { en: "cloudy", zh: "多云的" },
  { en: "hot", zh: "热的" },
  { en: "cold", zh: "冷的" },
  { en: "happy", zh: "开心的" },
  { en: "sad", zh: "难过的" },
  { en: "run", zh: "跑" },
  { en: "jump", zh: "跳" },
  { en: "read", zh: "读" },
  { en: "write", zh: "写" },
  { en: "listen", zh: "听" },
  { en: "speak", zh: "说" },
  { en: "play", zh: "玩" },
  { en: "water", zh: "水" },
  { en: "milk", zh: "牛奶" },
  { en: "rice", zh: "米饭" },
  { en: "bread", zh: "面包" },
  { en: "noodle", zh: "面条" },
  { en: "house", zh: "房子" },
  { en: "park", zh: "公园" },
  { en: "hospital", zh: "医院" },
  { en: "library", zh: "图书馆" },
  { en: "bus", zh: "公交车" },
  { en: "bike", zh: "自行车" }
];

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");

const highScoreEl = document.getElementById("high-score");
const levelEl = document.getElementById("level");
const questionEl = document.getElementById("question");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const promptCnEl = document.getElementById("prompt-cn");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const progressEl = document.getElementById("progress");
const nextBtn = document.getElementById("next-btn");

const finalScoreEl = document.getElementById("final-score");
const finalHighScoreEl = document.getElementById("final-high-score");
const correctCountEl = document.getElementById("correct-count");

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

let gameQuestions = [];
let currentIndex = 0;
let score = 0;
let correctCount = 0;
let leftSeconds = GAME_SECONDS;
let timerId = null;
let answered = false;

const HIGH_SCORE_KEY = "hangzhou_word_game_high_score";

function loadHighScore() {
  return Number(localStorage.getItem(HIGH_SCORE_KEY) || 0);
}

function saveHighScore(val) {
  localStorage.setItem(HIGH_SCORE_KEY, String(val));
}

function shuffle(arr) {
  const temp = [...arr];
  for (let i = temp.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [temp[i], temp[j]] = [temp[j], temp[i]];
  }
  return temp;
}

function pickQuestions() {
  const pool = shuffle(words).slice(0, TOTAL_QUESTIONS);
  return pool.map((item) => {
    const wrongOptions = shuffle(words.filter((w) => w.en !== item.en))
      .slice(0, 3)
      .map((w) => w.en);
    const options = shuffle([item.en, ...wrongOptions]);
    return {
      prompt: item.zh,
      answer: item.en,
      options
    };
  });
}

function switchScreen(target) {
  [startScreen, gameScreen, resultScreen].forEach((screen) => {
    screen.classList.remove("active");
  });
  target.classList.add("active");
}

function updateBoard() {
  const level = Math.floor(currentIndex / QUESTIONS_PER_LEVEL) + 1;
  const question = (currentIndex % QUESTIONS_PER_LEVEL) + 1;
  levelEl.textContent = String(Math.min(level, LEVELS));
  questionEl.textContent = String(Math.min(question, QUESTIONS_PER_LEVEL));
  scoreEl.textContent = String(score);
  timerEl.textContent = String(leftSeconds);
  progressEl.style.width = `${(currentIndex / TOTAL_QUESTIONS) * 100}%`;
}

function renderQuestion() {
  const q = gameQuestions[currentIndex];
  if (!q) {
    endGame();
    return;
  }

  answered = false;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  nextBtn.disabled = true;

  updateBoard();
  promptCnEl.textContent = `“${q.prompt}” 的英文是？`;
  optionsEl.innerHTML = "";

  q.options.forEach((optionText) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = optionText;
    btn.addEventListener("click", () => chooseOption(btn, optionText));
    optionsEl.appendChild(btn);
  });
}

function chooseOption(btn, optionText) {
  if (answered) return;
  answered = true;

  const q = gameQuestions[currentIndex];
  const allBtns = Array.from(document.querySelectorAll(".option-btn"));
  allBtns.forEach((b) => {
    b.disabled = true;
    if (b.textContent === q.answer) {
      b.classList.add("correct");
    }
  });

  if (optionText === q.answer) {
    btn.classList.add("correct");
    score += 10;
    correctCount += 1;
    feedbackEl.textContent = "✅ 回答正确！";
    feedbackEl.className = "feedback show-correct";
  } else {
    btn.classList.add("wrong");
    feedbackEl.textContent = `❌ 回答错误，正确答案是 ${q.answer}`;
    feedbackEl.className = "feedback show-wrong";
  }

  scoreEl.textContent = String(score);
  nextBtn.disabled = false;
}

function tick() {
  leftSeconds -= 1;
  if (leftSeconds <= 0) {
    leftSeconds = 0;
    timerEl.textContent = "0";
    endGame();
    return;
  }
  timerEl.textContent = String(leftSeconds);
}

function startTimer() {
  clearInterval(timerId);
  timerId = setInterval(tick, 1000);
}

function startGame() {
  gameQuestions = pickQuestions();
  currentIndex = 0;
  score = 0;
  correctCount = 0;
  leftSeconds = GAME_SECONDS;
  switchScreen(gameScreen);
  startTimer();
  renderQuestion();
}

function endGame() {
  clearInterval(timerId);
  const prevHigh = loadHighScore();
  const latestHigh = Math.max(prevHigh, score);
  if (latestHigh !== prevHigh) {
    saveHighScore(latestHigh);
  }

  finalScoreEl.textContent = String(score);
  finalHighScoreEl.textContent = String(latestHigh);
  correctCountEl.textContent = String(correctCount);
  highScoreEl.textContent = String(latestHigh);
  switchScreen(resultScreen);
}

nextBtn.addEventListener("click", () => {
  currentIndex += 1;
  if (currentIndex >= TOTAL_QUESTIONS) {
    endGame();
    return;
  }
  renderQuestion();
});

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

highScoreEl.textContent = String(loadHighScore());
