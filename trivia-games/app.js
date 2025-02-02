let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let questionsAttempted = 0;
let quizActive = true;
let timer;
const timeLimit = 15; // Set timer limit per question
let timeLeft = timeLimit; 

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start-btn").onclick = () => {
        quizActive = true;
        fetchQuestions();
        document.getElementById("start-btn").style.display = "none";
        document.getElementById("stop-btn").style.display = "block"; 
    };
});

function fetchQuestions() {
    fetch('https://opentdb.com/api.php?amount=10&type=multiple')
        .then(response => response.json())
        .then(data => {
            questions = data.results.map(q => ({
                question: q.question,
                answers: shuffle([...q.incorrect_answers, q.correct_answer]),
                correctAnswer: q.correct_answer
            }));
            currentQuestionIndex = 0; 
            loadQuestion();
        })
        .catch(error => console.error('Error loading questions:', error));
}

function loadQuestion() {
    if (!quizActive) return;

    if (questions.length === 0 || currentQuestionIndex >= questions.length) {
        fetchMoreQuestions();
        return;
    }

    clearTimeout(timer); // Reset timer
    timeLeft = timeLimit;
    updateTimerDisplay();
    startTimer();

    const question = questions[currentQuestionIndex];
    const questionContainer = document.getElementById("question-container");
    questionContainer.innerHTML = `<h3>${question.question}</h3>`;

    const answersContainer = document.getElementById("answers");
    answersContainer.innerHTML = "";

    question.answers.forEach(answer => {
        const button = document.createElement("button");
        button.classList.add("btn");
        button.textContent = answer;
        button.onclick = () => checkAnswer(button, answer);
        answersContainer.appendChild(button);
    });
}

function checkAnswer(button, selectedAnswer) {
    if (!quizActive) return;

    questionsAttempted++;
    clearTimeout(timer); // Stop timer

    const correctAnswer = questions[currentQuestionIndex].correctAnswer;
    const allButtons = document.querySelectorAll("#answers button");
    if (selectedAnswer === correctAnswer) {
        score++;
        button.style.backgroundColor = "#4CAF50"; // Green for correct
        showFeedback("Correct! 🎉", "green");
    } else {
        button.style.backgroundColor = "#FF5733"; // Red for incorrect
        showFeedback(`Wrong! ❌ Correct: ${correctAnswer}`, "red");
        allButtons.forEach(btn => {
            if (btn.textContent === correctAnswer) {
                btn.style.backgroundColor = "#4CAF50"; // Green for correct answer
            }
        });
    }

    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 1500);
}

function fetchMoreQuestions() {
    fetch('https://opentdb.com/api.php?amount=10&type=multiple')
        .then(response => response.json())
        .then(data => {
            questions = data.results.map(q => ({
                question: q.question,
                answers: shuffle([...q.incorrect_answers, q.correct_answer]),
                correctAnswer: q.correct_answer
            }));
            currentQuestionIndex = 0; 
            loadQuestion();
        })
        .catch(error => console.error('Error loading more questions:', error));
}

function stopQuiz() {
    quizActive = false;
    document.getElementById("game-container").style.display = "none";
    document.getElementById("stop-btn").style.display = "none";
    const resultContainer = document.getElementById("result-container");
    resultContainer.style.display = "block";

    let level = (score <= 5) ? 'Beginner' : (score <= 10) ? 'Intermediate' : 'Expert';
    
    document.getElementById("score").textContent = `Your score: ${score} / ${questionsAttempted}`;
    document.getElementById("level").textContent = `You are an: ${level}`;
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

document.getElementById("restart-btn").onclick = () => {
    quizActive = true;
    currentQuestionIndex = 0;
    score = 0;
    questionsAttempted = 0;
    document.getElementById("game-container").style.display = "block";
    document.getElementById("result-container").style.display = "none";
    document.getElementById("stop-btn").style.display = "block";
    fetchQuestions();
};

document.getElementById("stop-btn").onclick = stopQuiz;

// Timer Functions
function startTimer() {
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            showFeedback("Time's up! ⏳", "orange");
            setTimeout(() => {
                currentQuestionIndex++;
                loadQuestion();
            }, 1500);
        } else {
            timeLeft--;
            updateTimerDisplay();
        }
    }, 1000);
}

function updateTimerDisplay() {
    document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;
}

// Show feedback below the question
function showFeedback(message, color) {
    const feedback = document.createElement("p");
    feedback.textContent = message;
    feedback.style.color = color;
    feedback.style.fontSize = "1.2rem";
    feedback.style.fontWeight = "bold";

    const questionContainer = document.getElementById("question-container");
    questionContainer.appendChild(feedback);

    setTimeout(() => {
        feedback.remove();
    }, 1500);
}
